# 3D World Portfolio - Design

Date: 2026-08-12
Status: approved, implementing in four stages

## Goal

Turn the portfolio from a scrolled document into a single continuous 3D world
that shows what the owner does: leading IT Architecture & Engineering across
three units (System Engineer, Solution Architecture, Quality Assurance).
Scrolling moves a camera through the world; sections become places rather than
blocks. `profile.png` stays on the opening screen.

## Non-goals

- Rewriting content. Everything in `content/` and the contact/CV APIs is data
  and is reused unchanged.
- 3D on the project detail pages (`/projects/[slug]`). Those are reading pages;
  they stay DOM.

## Hard requirement: two routes to the same content

The site exists to be read by recruiters and by Google. Text rendered as 3D
geometry is invisible to both. So the world is never the only way in:

- `/` server-renders the full DOM content. Crawlers, no-JS visitors, and the
  first paint all get real text.
- After mount, if the device qualifies, the world takes over the viewport and
  the DOM copy is hidden from the accessibility tree.
- `/text` is a permanent, linked, DOM-only route with the same content. The
  skip link and a visible control in the world both point at it.

A device that does not qualify never loads the world bundle at all.

## Device tiers

Detected once on the client, in `lib/webgl/capability.ts`:

| Tier | Condition | What renders |
|---|---|---|
| `full` | WebGL2, no reduced-motion, >= 4 cores, sustained 50+ fps probe | World with bloom, full layer count |
| `lite` | WebGL2, no reduced-motion, weaker device or 30-50 fps | World, DPR capped at 1, no bloom, half the layers |
| `dom` | No WebGL2, reduced-motion, or fps probe below 30 | DOM page, world bundle never fetched |

The fps probe runs for ~500ms on a throwaway canvas before the world mounts, so
a phone that reports WebGL2 but cannot sustain it still lands on `dom`.

## World structure

One continuous corridor along -Z. Scroll position maps to camera Z. Places sit
at fixed Z offsets; between them the tunnel recycles.

| Z zone | Place | Content source | Accent |
|---|---|---|---|
| 0 | Arrival - name, tagline, `profile.png` as a lit panel | `content/profile.ts` | cyan |
| -1 | About - narrative panel, stat monoliths | `content/profile.ts`, counts | cyan |
| -2 | Department - three unit towers standing in space | `content/organization.ts` | cyan to violet |
| -3 | Skills - grouped clusters, orbiting labels | `content/skills.ts` | violet |
| -4 | Experience - a path the camera follows past company markers | `content/experience.ts` | violet |
| -5 | Projects - floating panels, click opens the DOM detail page | `content/projects.ts` | violet to emerald |
| -6 | AI use cases - panels | `content/aiUseCases.ts` | emerald |
| -7 | Contact gate - the existing form via `<Html>` | existing `ContactGate` | emerald |

Zone accents reuse `--cyan`, `--violet`, `--emerald` so the world and the DOM
route look like one brand.

### Tunnel

12 planes (6 on `lite`) spaced along -Z, recycled to the far end once the camera
passes them, so punch-through is continuous but object count is constant. Each
plane's pattern comes from the zone it is recycled into: grid for
infrastructure, wireframe for architecture, gate frame for quality.

Punch-through moment, about 200ms: the plane dissolves from the centre outward,
bloom spikes, and the colour channels separate slightly at the screen edge.
Forward speed follows scroll *velocity*, not position, so fast scrolling stacks
the flashes and stopping leaves the camera drifting rather than frozen.

## Component boundaries

```
lib/webgl/capability.ts     tier detection, no React
lib/webgl/use-tier.ts       hook exposing the tier
components/world/WorldCanvas.tsx   Canvas + ScrollControls, lazy-loaded
components/world/Tunnel.tsx        recycled layer planes
components/world/zones/*.tsx       one file per place, reads content/
components/world/theme.ts          zone accents and Z offsets
components/ExperienceRouter.tsx    picks world or DOM, owns the /text link
```

Each zone takes its data as props and knows nothing about scroll or tiers. The
rig passes a normalised progress value down. That keeps zones testable as plain
functions of data.

## Error handling

- The world is behind `dynamic(() => ..., { ssr: false })`. A chunk that fails
  to load falls back to the DOM page rather than a blank screen.
- An r3f error boundary around the canvas drops the tier to `dom` on any WebGL
  context loss, which is common when a laptop switches GPUs.
- Textures (`profile.png`) load through a suspense boundary with the DOM page
  visible underneath, so there is no empty frame.

## Testing

Unit tests, `node` environment, in `lib/__tests__/`:

- tier decision table - every input combination maps to the documented tier
- zone Z offsets are unique and ordered
- zone content adapters return the same counts as the source content files

Runtime verification per stage: build, dev server, DOM route still 200,
`/text` renders every section, console and server logs clean.

## Stages

1. Foundation: capability tiers, router, `/text` route, canvas, rig, tunnel,
   Arrival place with `profile.png`.
2. Narrative places: About, Department, Skills.
3. Showcase places: Experience, Projects, AI.
4. Gate and tightening: Contact, then bundle, fps, Lighthouse, keyboard, and
   screen reader audit.

Each stage ends with a working site.
