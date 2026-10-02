# SEO Skills for UK Bathroom Retail

Agent Skills (SKILL.md format) checked and packaged for SEO work on BestQualityBathrooms,
BathroomShopUK and Pryor Bathrooms Sheffield.

Each skill sits in its own folder under `skills/`. Each one also has a ZIP in `zips/` with the
skill folder at the top level, which is the format claude.ai accepts
(Settings → Capabilities → Skills → Upload skill).

## Skills

| Skill | What it does | Source | Checked |
|---|---|---|---|
| `seo-audit` | Technical and on-page SEO audit in a fixed priority order (crawl and index → technical → on-page → content → authority). Each finding gets Issue / Impact / Evidence / Fix / Priority. | [coreyhaines31/marketingskills/skills/seo-audit](https://github.com/coreyhaines31/marketingskills/tree/c0e35b78ad294c4ea8dbe7801c79bfeb6f67f3e9/skills/seo-audit) | 2 October 2026 |
| `site-architecture` | Page hierarchy, URL map, breadcrumbs, navigation and internal linking plans (hub-and-spoke, link audit checklist). | [coreyhaines31/marketingskills/skills/site-architecture](https://github.com/coreyhaines31/marketingskills/tree/c0e35b78ad294c4ea8dbe7801c79bfeb6f67f3e9/skills/site-architecture) | 2 October 2026 |
| `content-strategy` | Content pillars, topic clusters, keyword ideas by buyer stage, and a scoring table for choosing which posts to write first. | [coreyhaines31/marketingskills/skills/content-strategy](https://github.com/coreyhaines31/marketingskills/tree/c0e35b78ad294c4ea8dbe7801c79bfeb6f67f3e9/skills/content-strategy) | 2 October 2026 |

All three come from Corey Haines' `marketingskills` repository, copied unchanged from commit
`c0e35b7` (1 October 2026). The repository's MIT licence is included in each skill folder.

## How they were checked

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

## Known limitations

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
