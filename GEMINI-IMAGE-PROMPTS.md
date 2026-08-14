# Gemini image prompts — homepage

Generate images for the homepage placeholders. Keep a consistent visual system across all assets.

## Global style (prepend to every prompt)

```
Editorial healthcare consulting photography, soft natural light, muted ivory and warm gray palette with sage green (#9CAF9F), soft teal (#4F9DA6), and slate blue (#466A86) accents. Clean, calm, premium, documentary-realism. No text, no logos, no watermarks, no faces looking at camera unless specified, no neon, no purple, no cyberpunk, no stock-photo smiles. 16:9 unless aspect ratio is specified.
```

---

## 1. `home-hero-operations.webp` — Hero (21:9 or 16:10)

```
Wide cinematic photograph of a modern integrative wellness clinic operations desk at dawn: soft morning light through sheer curtains, empty reception counter with a laptop showing abstract workflow dashboards (no readable text), appointment binder closed, muted sage plant, ivory walls, slate-blue chair, calm uncluttered composition, shallow depth of field, premium editorial style.
```

**Save as:** `public/images/home-hero-operations.webp`

---

## 2. `home-mission-continuum.webp` — Mission (16:10)

```
Photograph of a continuous hallway in a quiet wellness clinic, gentle perspective leading forward, soft teal and ivory tones, sunlight patches on polished floor, one open door revealing a consultation room with a desk and empty chairs, metaphor for a connected client journey, calm human-centered atmosphere, no people in frame.
```

**Save as:** `public/images/home-mission-continuum.webp`

---

## 3. `home-five-layer-system.webp` — Five-layer system (21:9)

```
Abstract architectural still life: five layered translucent glass panels stacked in a shallow perspective on an ivory surface, each panel tinted differently in sage, teal, slate blue, soft gold, and warm gray, soft studio lighting, clean minimal composition suggesting stacked operational system layers, no text, no icons.
```

**Save as:** `public/images/home-five-layer-system.webp`

---

## 4. Services set (16:10 each)

### `home-service-workflow-audit.webp`
```
Top-down photograph of a workflow audit workspace: printed process map sheets, sticky notes in muted gold and sage, a tablet with abstract CRM pipeline UI (no readable labels), fountain pen, ivory desk surface, soft overhead daylight, orderly but analytical mood.
```

### `home-service-automation-readiness.webp`
```
Close editorial photo of a structured knowledge base scene: neatly organized binder tabs, open notebook with blank structured sections, laptop edge showing a soft teal interface glow, soft focus background of a wellness office, calm preparatory atmosphere for AI readiness.
```

### `home-service-pilot-implementation.webp`
```
Photograph of a controlled pilot setup: two monitors on a clean desk showing abstract monitoring charts (no numbers readable), headset resting beside a notebook labeled blank, soft teal ambient light, quiet late-afternoon clinic back office, focused implementation mood.
```

### `home-service-optimization-retainer.webp`
```
Photograph of a recurring calibration ritual: calendar page blurred in background, coffee cup, laptop with soft dashboard glow, plant leaf in sage tones, warm ivory desk, sense of ongoing refinement rather than one-off project.
```

**Save as:** `public/images/home-service-*.webp`

---

## 5. `home-client-feedback.webp` — Feedback band (21:9)

```
Wide soft-focus photograph of an empty conference table in a bright consulting room, two water glasses, open notebooks, window light, ivory and sage palette, inviting collaborative atmosphere without people, premium editorial stillness.
```

**Save as:** `public/images/home-client-feedback.webp`

---

## 6. Case stories (16:10 each)

### `home-case-integrative-health.webp`
```
Photograph inside an integrative medical center treatment corridor: soft clinical lighting, IV therapy prep cart in soft focus, CharmHealth-like workstation silhouette (no brand logos), calm teal and ivory palette, professional clinical operations mood, no patients visible.
```

### `home-case-educational-research.webp`
```
Photograph of an educational research operations desk: registration badges, name tents stacked neatly, laptop with abstract participant list UI (unreadable), international conference materials blurred, slate blue and ivory tones, organized nonprofit operations atmosphere.
```

### `home-case-ai-digital-systems.webp`
```
Photograph of a digital systems QA workspace: dual screens with abstract journey-flow diagrams (no readable text), stylus on tablet, muted graphite and teal lighting, clean modern tech studio, validation and reliability mood, no sci-fi effects.
```

**Save as:** `public/images/home-case-*.webp`

---

## 7. `home-research-methodology.webp` — Research (16:10)

```
Editorial still life of research materials for workflow methodology: open peer-reviewed journal (blurred text), graph printouts with soft teal accent lines, reading glasses, ivory desk, soft north-window light, scholarly calm, no readable titles or logos.
```

**Save as:** `public/images/home-research-methodology.webp`

---

## 8. `home-about-workspace.webp` — About (4:5 portrait)

```
Portrait-oriented photograph of a remote consulting workspace overlooking soft Florida daylight: clean desk, laptop closed, notebook, ceramic cup, muted sage plant, ivory walls, calm professional solitude, no person in frame, premium lifestyle-editorial tone.
```

**Save as:** `public/images/home-about-workspace.webp`

---

## After generation

1. Export or convert to **WebP** and place files under `public/images/` using the exact filenames above.
2. Homepage and inner-page slots auto-load `/images/{filename}`; missing files fall back to placeholders.
3. Prefer WebP quality ~80–85 for balance of size and clarity.
4. Inner pages reuse homepage assets for heroes (mission continuum, service/case/research images). Hero side images are desktop-only (`lg+`).

