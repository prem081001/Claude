"""Synthesise the 22s ambient bed + the four sound effects. numpy only, no downloads."""
import numpy as np, wave, os

SR = 48000
DUR = 22.0
rng = np.random.default_rng(20270124)          # seeded: same soundtrack every run

def t_of(n):  return np.arange(n) / SR
def w(sec):   return int(sec * SR)

def write(path, sig):
    """sig: (n,) mono or (n,2) stereo float -> 16-bit PCM"""
    if sig.ndim == 1: sig = np.stack([sig, sig], 1)
    peak = np.max(np.abs(sig))
    if peak > 0: sig = sig / max(peak, 1.0)
    pcm = np.clip(sig, -1, 1)
    pcm = (pcm * 32767).astype('<i2')
    with wave.open(path, 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes(pcm.tobytes())
    print(f"  {path}  {len(sig)/SR:.2f}s  peak {peak:.3f}")

def adsr(n, a, d, s, r, sus=0.7):
    """simple envelope in seconds"""
    e = np.zeros(n); ai, di, ri = w(a), w(d), w(r)
    si = max(0, n - ai - di - ri)
    e[:ai] = np.linspace(0, 1, ai, endpoint=False) if ai else 0
    if di: e[ai:ai+di] = np.linspace(1, sus, di, endpoint=False)
    e[ai+di:ai+di+si] = sus
    if ri: e[ai+di+si:ai+di+si+ri] = np.linspace(sus, 0, ri)
    return e

def note(freq, dur, kind='pad', amp=1.0, detune=0.0):
    n = w(dur); t = t_of(n)
    if kind == 'pad':
        # a few harmonics, rolled off, with a slow chorus-ish detune
        s  = np.sin(2*np.pi*freq*t)
        s += 0.42*np.sin(2*np.pi*freq*(1+0.0016+detune)*t)
        s += 0.30*np.sin(2*np.pi*2*freq*t)
        s += 0.12*np.sin(2*np.pi*3*freq*t)
        s += 0.05*np.sin(2*np.pi*4*freq*t)
        s *= adsr(n, 1.1, 0.9, 0, 1.4, sus=0.78)
        # a slow breath on the amplitude
        s *= 1 + 0.06*np.sin(2*np.pi*0.13*t)
        return s * amp * 0.26
    if kind == 'pluck':
        env = np.exp(-t * 5.2)
        s  = np.sin(2*np.pi*freq*t) * env
        s += 0.36*np.sin(2*np.pi*2*freq*t) * np.exp(-t*8.5)
        s += 0.17*np.sin(2*np.pi*3*freq*t) * np.exp(-t*12.0)
        s += 0.08*np.sin(2*np.pi*4.02*freq*t) * np.exp(-t*16.0)
        s[:w(0.004)] *= np.linspace(0, 1, w(0.004))     # no click
        return s * amp * 0.20
    if kind == 'sub':
        env = np.exp(-t * 4.0)
        s = np.sin(2*np.pi*freq*t) * env
        s[:w(0.012)] *= np.linspace(0, 1, w(0.012))
        return s * amp * 0.5
    raise ValueError(kind)

N = w(DUR)
NOTE = {k: 440.0 * 2**((i-9)/12) for i, k in
        enumerate(['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'])}
def f(name, octv): return NOTE[name] * 2**(octv-4)

# ---- F major, four chords of 5.5s: Fmaj7 - Dm7 - Bbmaj7 - Csus4 ----------
CHORDS = [
    (0.0,  [('F',3),('A',3),('C',4),('E',4)]),
    (5.5,  [('D',3),('F',3),('A',3),('C',4)]),
    (11.0, [('As',2),('D',3),('F',3),('A',3)]),
    (16.5, [('C',3),('F',3),('G',3),('C',4)]),
]

print("building the bed…")
pad = np.zeros(N + w(3))
for start, chord in CHORDS:
    for j, (nm, octv) in enumerate(chord):
        s = note(f(nm, octv), 6.6, 'pad', amp=0.9 - 0.08*j, detune=0.0004*j)
        i0 = w(start)
        pad[i0:i0+len(s)] += s

# ---- a soft plucked arpeggio riding over it -----------------------------
arp = np.zeros(N + w(3))
STEP = 0.375                                    # 80 bpm eighths
for k in range(int(DUR / STEP) + 1):
    tt = k * STEP
    chord = [c for c in CHORDS if c[0] <= tt][-1][1]
    # up-and-back pattern, lifting an octave on the turns
    pat = [0, 1, 2, 3, 2, 1]
    nm, octv = chord[pat[k % len(pat)]]
    if k % 12 in (4, 10): octv += 1
    amp = 0.52 + 0.3*((k % 6) == 0)
    s = note(f(nm, octv), 1.5, 'pluck', amp=amp)
    i0 = w(tt)
    arp[i0:i0+len(s)] += s

# ---- a gentle low pulse for rhythm --------------------------------------
pulse = np.zeros(N + w(3))
for k in range(int(DUR / 1.5) + 1):
    s = note(55.0, 1.0, 'sub', amp=0.34 if k % 2 == 0 else 0.22)
    i0 = w(k * 1.5)
    pulse[i0:i0+len(s)] += s

mix = (pad * 1.00 + arp * 0.62 + pulse * 0.50)[:N]
# a touch of stereo width: delay the arp a hair in the right channel
d = w(0.011)
L = mix.copy()
R = (pad*1.00 + np.roll(arp, d)*0.62 + pulse*0.50)[:N]
write('audio/bed.wav', np.stack([L, R], 1))

# ================= sound effects =========================================
print("building the effects…")

# soft phone buzz: low AM rumble, two short bursts
n = w(0.62); t = t_of(n)
car = np.sin(2*np.pi*62*t) + 0.5*np.sin(2*np.pi*124*t) + 0.2*np.sin(2*np.pi*186*t)
am  = 0.55 + 0.45*np.sign(np.sin(2*np.pi*27*t))         # the rattle
burst = np.zeros(n)
for s0, s1 in [(0.00, 0.20), (0.26, 0.48)]:
    i0, i1 = w(s0), w(s1)
    e = np.hanning(i1-i0) ** 0.6
    burst[i0:i1] += e
write('audio/sfx_buzz.wav', car * am * burst * 0.5)

# light whoosh: noise through a one-pole lowpass whose cutoff sweeps up then down
n = w(0.80); t = t_of(n)
noise = rng.normal(0, 1, n)
cut = 300 + 5200 * np.sin(np.pi * np.linspace(0, 1, n))**1.5    # sweep up and back
a = 1 - np.exp(-2*np.pi*cut/SR)                                  # per-sample coefficient
y = np.zeros(n); z = 0.0
for i in range(n):                                               # time-varying filter
    z += a[i] * (noise[i] - z); y[i] = z
y -= np.convolve(y, np.ones(400)/400, 'same')                    # strip the rumble
env = np.sin(np.pi*np.linspace(0,1,n))**1.8
write('audio/sfx_whoosh.wav', y * env * 2.2)

# sparkle shimmer: a cluster of high partials with staggered onsets
n = w(1.70); sh = np.zeros(n)
for k in range(16):
    fq = 2100 + rng.random()*4200
    on = rng.random()*0.42
    dec = 1.4 + rng.random()*1.6
    i0 = w(on); m = n - i0; tt = t_of(m)
    sh[i0:] += np.sin(2*np.pi*fq*tt) * np.exp(-tt*dec) * (0.4 + rng.random()*0.6)
write('audio/sfx_shimmer.wav', sh * 0.3)

# soft bell chime: slightly inharmonic partials over a long decay
n = w(2.60); t = t_of(n); bell = np.zeros(n)
for fq, amp, dec in [(880,1.0,1.5),(1320,0.52,2.0),(1761,0.3,2.6),(2644,0.16,3.4),(3520,0.08,4.4)]:
    bell += amp * np.sin(2*np.pi*fq*t) * np.exp(-t*dec)
bell[:w(0.006)] *= np.linspace(0, 1, w(0.006))
write('audio/sfx_bell.wav', bell * 0.42)
print("done")
