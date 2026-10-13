# Claude Agent Skills

Agent Skills (SKILL.md format) packaged for upload to Claude.

Each skill sits in its own folder under `skills/`. Each one also has a ZIP in `zips/` with the
skill folder at the top level, which is the format claude.ai accepts
(Settings → Capabilities → Skills → Upload skill).

There are two sets here:

- **[SEO skills](#seo-skills-uk-bathroom-retail)** — the original three, vetted for SEO work on
  BestQualityBathrooms, BathroomShopUK and Pryor Bathrooms Sheffield.
- **[The ten general skills](#the-ten-general-skills)** — added from the video
  *"I Tested 1000+ Claude Skills: These 10 Are The Only Ones That Matter"* (Vaibhav Sisinty).

---

## The ten general skills

Added 12 October 2026. **Read the provenance column before trusting any of these** — they were
not all obtained the same way, and only three are upstream code.

| # in video | Skill | What it does | Provenance |
|---|---|---|---|
| 1 | `frontend-design` | Pushes UI work past templated defaults — deliberate palette, typography and layout choices grounded in the subject matter. | **Upstream, verbatim.** [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design), Apache 2.0 |
| 2 | `deep-research` | Decomposes a research question, dispatches parallel searches, reconciles conflicting sources, returns a cited synthesis. | **Written for this repo.** No upstream identified |
| 3 | `humanizer` | Strips AI writing tells — not-X-but-Y, one-line closers, forced triads, dash overuse, stock AI vocabulary. 26 named patterns. | **Upstream, verbatim.** [blader/humanizer](https://github.com/blader/humanizer) v3.1.0, MIT |
| 4 | `skill-creator` | Builds, edits and evaluates skills. Includes the packaging script and the eval viewer. | **Upstream, verbatim.** [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator), Apache 2.0 |
| 5 | `office-hours` | YC-partner-style interrogation of an idea before it gets built — six forcing questions, blind spots, alternatives, a design doc. | **Written for this repo**, adapting the behaviour of [garrytan/gstack](https://github.com/garrytan/gstack) `/office-hours` (MIT). See the note below |
| 6 | `seo-competitor-audit` | Benchmarks a site against named competitors across on-page, technical, mobile and AI search readiness (GEO + AEO scored separately); returns an impact-ranked fix list. | **Written for this repo**, GEO/AEO pillar informed by [SNLabat/SEO-GEO-AEO-Skill](https://github.com/SNLabat/SEO-GEO-AEO-Skill) |
| 7 | `fact-checker` | Decomposes text into atomic claims, traces each to a primary source, returns per-claim verdict + confidence + link. Mode B applies corrections to the user’s own document after approval. | **Written for this repo**, correction mode informed by [daymade/claude-code-skills](https://github.com/daymade/claude-code-skills) |
| 8 | `brand-guidelines` | Holds a brand's colours, typography, voice, naming rules and never-say list, and applies them to every output. | **Written for this repo.** See the note below |
| 9 | `find-skills` | Routes a plain-English request to an installed skill first, then searches the wider ecosystem (`npx skills`, skills.sh) with quality and safety checks if nothing installed fits. | **Written for this repo**, stage 2 follows [vercel-labs/skills](https://github.com/vercel-labs/skills) `find-skills` (MIT) |
| 10 | `token-optimization` | Survey-then-extract routine for large document sets, plus session-level waste (MCP audit, cache invalidation, context forking). | **Written for this repo**, session section informed by [valorisa/Claude-Skills](https://github.com/valorisa/Claude-Skills) (MIT) |

### A second pass on the four you flagged

`fact-checker`, `find-skills`, `token-optimization` and `seo-competitor-audit` were
searched again specifically. Real, inspectable skills exist for all four — none is
identical to the one the video demonstrated, and each scopes the job differently:

| Skill | What the real ones do | What the video describes | Outcome |
|---|---|---|---|
| `find-skills` | [vercel-labs](https://github.com/vercel-labs/skills) discovers and installs *new* skills from skills.sh | routing across *installed* skills | **Merged.** Stage 1 routes locally, stage 2 searches the ecosystem |
| `fact-checker` | [daymade](https://github.com/daymade/claude-code-skills) corrects claims in your own documents | judging articles and viral posts | **Kept ours**, added their correction workflow as Mode B |
| `token-optimization` | [valorisa](https://github.com/valorisa/Claude-Skills) manages session cost (MCP, cache, context window) | processing large document corpora | **Kept ours**, added their session-level analysis up front |
| `seo-competitor-audit` | [SNLabat](https://github.com/SNLabat/SEO-GEO-AEO-Skill) scores one site on SEO/GEO/AEO | benchmarking several competitors | **Kept ours**, borrowed their GEO/AEO split for pillar 4 |

Nothing was copied verbatim in this pass — the structure and technique were taken and
rewritten, and each source is credited in the table above and in the skill itself.

### What "written for this repo" means

The video summary describes each skill's **function and mechanism** but names a source for only
two of them (`frontend-design` as an official Anthropic skill, `office-hours` as part of gstack).
For the seven others, no single authoritative upstream could be identified — searching turns up
many same-named community skills with different implementations, and there is no way to tell
which one the video used.

So those were **written from the described behaviour**, not copied. They are original
implementations that do the described job. They are not the files the video demonstrated, and
should not be described as such.

### Two skills that needed a judgement call

**`office-hours`** — the real gstack version is a 95 KB SKILL.md wired into the rest of the
framework: it reads and writes shared `gbrain` state, resolves paths through `gstack-paths` and
`gstack-config`, and feeds companion skills (`/plan-ceo-review`, `/plan-eng-review`, `/autoplan`).
Copied out on its own it would reference helpers and state directories that do not exist. The
version here is standalone and reproduces the conversation — the six forcing questions, the blind
spots, the alternatives, the design document. For the full chain, install gstack itself.

**`brand-guidelines`** — Anthropic publishes a skill by this name, but it applies *Anthropic's own*
brand (their hex codes, Poppins and Lora). That is a worked example, not the skill the video
describes, which is a reusable baseline for *your* brand. Shipping Anthropic's colours into a
bathroom retailer's skill pack would be actively wrong, so the version here is generic: a template
with a filled-in placeholder profile and a setup procedure. Replace the `Example Co.` block with
your own before using it.

### Checks run on these ten

- **Safety:** every file was read. The three upstream skills contain no network calls and no
  remote code execution. `skill-creator`'s scripts use `subprocess` to invoke `claude -p` for
  evals and `base64` to embed images in its local HTML viewer — both consistent with their
  documented purpose. The seven authored skills are plain Markdown with no scripts.
- **Format:** all thirteen skills validated — YAML frontmatter parses, `name` matches the folder
  name, `description` present.
- **Not run:** none of these ten were A/B tested the way the three SEO skills were. The authored
  seven have had no eval pass at all. Treat the whole set as unproven until you have used them.

---

## SEO skills (UK bathroom retail)

| Skill | What it does | Source | Checked |
|---|---|---|---|
| `seo-audit` | Technical and on-page SEO audit in a fixed priority order (crawl and index → technical → on-page → content → authority). Each finding gets Issue / Impact / Evidence / Fix / Priority. | [coreyhaines31/marketingskills/skills/seo-audit](https://github.com/coreyhaines31/marketingskills/tree/c0e35b78ad294c4ea8dbe7801c79bfeb6f67f3e9/skills/seo-audit) | 2 October 2026 |
| `site-architecture` | Page hierarchy, URL map, breadcrumbs, navigation and internal linking plans (hub-and-spoke, link audit checklist). | [coreyhaines31/marketingskills/skills/site-architecture](https://github.com/coreyhaines31/marketingskills/tree/c0e35b78ad294c4ea8dbe7801c79bfeb6f67f3e9/skills/site-architecture) | 2 October 2026 |
| `content-strategy` | Content pillars, topic clusters, keyword ideas by buyer stage, and a scoring table for choosing which posts to write first. | [coreyhaines31/marketingskills/skills/content-strategy](https://github.com/coreyhaines31/marketingskills/tree/c0e35b78ad294c4ea8dbe7801c79bfeb6f67f3e9/skills/content-strategy) | 2 October 2026 |

All three come from Corey Haines' `marketingskills` repository, copied unchanged from commit
`c0e35b7` (1 October 2026). The repository's MIT licence is included in each skill folder.

`seo-competitor-audit` (from the ten above) overlaps with `seo-audit` and does not replace it:
`seo-audit` diagnoses one site in depth, `seo-competitor-audit` compares several and ranks the
gaps. Use the first to find what is broken, the second to find what is costing you the ranking.

### How the SEO three were checked

- **Proof:** the repository has about 52K GitHub stars, an MIT licence, and active maintenance
  (last commit 1 October 2026, more than 300 commits since April 2026). Third-party directories
  quote skills.sh install counts of about 195K–214K for seo-audit, about 133K for
  content-strategy and about 43K for site-architecture. These figures are second-hand:
  skills.sh couldn't be opened directly during the check. Tessl's independent evaluation
  reports seo-audit at quality 86 with a 1.12× improvement over no skill, and content-strategy
  at quality 77.
- **Safety:** every file was read in full. None of them contains scripts, external API calls,
  hidden or encoded text, prompt injection, requests for keys or passwords, or delete or
  install commands. All files are plain Markdown or JSON.
- **Tests:** each skill was run on a UK bathroom task and compared with the same task done
  without it. seo-audit was clearly better and site-architecture was better.
  content-strategy was only marginally better and was kept at the owner's request.

### Known limitations

- The examples are mostly written for software (SaaS) companies. The frameworks still apply to
  e-commerce, but expect to steer the output towards bathroom products.
- All three skills look for an optional `.agents/product-marketing.md` context file. If it
  isn't there, they just ask questions instead.
- `seo-audit` lists title tags at 50–60 characters and meta descriptions at 150–160
  characters. Yoast's green range for meta descriptions is 120–156, so stay within that.
- `content-strategy`: `references/headless-cms.md` (choosing a headless CMS) isn't relevant
  here. Its last three links point to files outside the skill folder and won't open. Its
  scoring table works best with real customer data (sales or support questions).
- The `evals/evals.json` files are the author's test cases. Claude doesn't need them to use
  the skill, and they're kept only to show how each skill is meant to behave.

---

## Installing

**claude.ai** — Settings → Capabilities → Skills → Upload skill, then pick the ZIP from `zips/`.

**Claude Code** — copy the folder into `~/.claude/skills/` (all projects) or `.claude/skills/`
(this project only):

```bash
cp -r skills/humanizer ~/.claude/skills/
```

## Licences

| Skill | Licence |
|---|---|
| `frontend-design`, `skill-creator` | Apache 2.0 — Anthropic (`LICENSE` in each folder) |
| `humanizer` | MIT — blader (`LICENSE` in the folder) |
| `seo-audit`, `site-architecture`, `content-strategy` | MIT — Corey Haines (`LICENSE` in each folder) |
| The seven authored skills | No upstream licence — written for this repo |
