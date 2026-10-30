---
name: preview-embedded-ui
description: Preview, screenshot, and measure a web UI built for an embedded HTML engine (for example Coherent Gameface inside a game client) in a normal desktop browser, by adding a dev-only preview mode that stands in for the engine. Use whenever such a UI must be opened, captured, or compared with a design outside the engine, when its pages render blank or broken in a browser, or when setting up or fixing that preview; do not use for apps that already run in a browser, or to confirm behaviour that only the engine provides.
compatibility: Requires repository access to the UI project and its bundler dev server, and a desktop or headless browser. Behaviour that only the engine provides still needs the engine for final confirmation.
---

# Preview Embedded UI in a Browser

A UI written for an embedded engine expects a host: the engine script, its
resource scheme, its translations, fonts, and UI scale. Give the browser a thin
stand-in for that host so layout and visuals can be checked and measured
without the engine. Data mocks are not part of it: a component that receives
everything through props renders the same in both places, and only components
that read engine data themselves need mocks.

## 1. List what the host provides

Read the app's entry HTML and the engine integration before writing anything;
each item below breaks the page in a browser when missing.

1. **Engine global API.** The entry HTML loads an engine script (for example
   `cohtml.js`) that defines a global such as `engine` with calls, events, and
   translation functions.
2. **Resource scheme.** Images, video, and fonts use an engine URL scheme (for
   example `coui://`) resolved against resource roots listed in the engine's
   path configuration.
3. **Translations.** The engine translates keys and plurals and returns the key
   when a translation is missing.
4. **Fonts.** Font families are declared in an engine font config with their
   files, weights, and a fallback family, not in CSS.
5. **UI scale.** The host runs a script that sets the root font size and scale
   variables from the player's scale setting, and limits which scales each
   resolution allows.
6. **Host settings.** Globals such as client settings or locale decide themes
   and quality presets.

## 2. Build the preview mode

Add the preview as a separate dev-server mode or plugin (for example a Vite
plugin enabled by `mode === 'web'` with `apply: 'serve'`, run by its own task),
so the production build never contains it; confirm with a release build into
an emptied output folder that it holds no shim or preview route.

1. Keep one entry HTML. In preview mode, replace the engine script tag with a
   shim module, and fail loudly when the tag is not found, so a renamed script
   cannot silently drop the shim.
2. Type the shim against the engine's own type declarations. Implement what
   the page reads (`whenReady`, `translate`, plural translation, `on`, `off`,
   `trigger`) and make every other call a no-op, for example with a `Proxy`.
3. Rewrite the resource scheme to a local prefix in transformed sources and
   serve that prefix from the same disk roots, in the same order, as the
   engine's path configuration. Reject `..` and absolute paths. Never copy
   assets into the project: copies go stale and hand-made lists miss files.
4. Load every source translation file, plurals included, instead of scanning
   code for keys: keys built at runtime are invisible to a scanner. Return the
   key when a translation is missing, as the engine does.
5. Generate `@font-face` rules from the engine font config: same family names,
   weights mapped from the config's weight names, files served from the engine
   roots.
6. Run the host's scale script with the same formula, taking the scale from a
   URL parameter and defaulting to 1. Never derive it from
   `devicePixelRatio`: a 125% desktop setting would enlarge the UI twice.
7. Fill host settings with values that select the designed state. Zeroed
   hardware or quality values often select a fallback theme (high contrast,
   no blur) that no design shows.
8. Serve a frame page at `/` with a resolution selector (the resolutions the
   product supports), a scale selector limited to the scales the host allows
   for that resolution, and an iframe sized to the exact resolution and scaled
   down only visually to fit the window. Keep both values in the URL so a
   script can open the app page directly.

## 3. Neutralise browser differences, in the preview only

Put these rules in a preview stylesheet injected by the shim, never in the
components, so the engine build stays unchanged.

1. **rem in media queries.** A browser resolves rem in media queries with
   16 px, not with the root font size. When breakpoints are written in rem,
   rewrite them to pixels with the engine's root size (base size × scale);
   otherwise a small-screen layout turns on at full resolution.
2. **Box sizing.** If the engine sizes boxes including border and padding (as
   Gameface does), set `box-sizing: border-box` on every element, or bordered
   boxes come out wider than in the engine.
3. **Text inputs.** A browser gives `<input>` an intrinsic width of about 20
   characters that overflows narrow flex rows; set `input { min-width: 0; }`.
4. **Default font.** Text without a `font-family` uses the engine's fallback
   family but a browser serif; set the fallback family on `html`.
5. **Scrollbars.** Hide native scrollbars when the UI draws its own, without
   adding padding the engine does not have.

## 4. Avoid known pitfalls

1. The bundler's dependency scan reads the original entry HTML before the HTML
   transform and fails on the engine script URL; give it explicit entries (the
   app entry and the shim).
2. Assets referenced from shared libraries outside the app folder are refused
   by the dev server's file-system allowlist (403); allow the workspace root
   that holds them.
3. A module with all translations can weigh megabytes; return an empty source
   map for it, or the dev server builds a map several times larger.
4. Stopping a background dev-server task can leave its child process on the
   port; stop the process that owns the port before starting again.

## 5. Capture, measure, and confirm

1. For measurements and screenshots, open the app page directly (not the
   frame page) with a viewport equal to the target resolution, a device scale
   factor of 1, and the scale parameter set.
2. Check the result before trusting it: the root font size and scale variable
   must match the host formula (for example 10 px at scale 1 and 15 px at 1.5
   for a base of 10 px).
3. Use the preview for layout, spacing, typography, colours, and assets. A
   browser also renders CSS the engine ignores, so a correct preview does not
   prove the engine render.
4. Confirm in the engine whatever the preview only imitates: engine events and
   data bindings, wheel and focus handling (a browser registers React wheel
   listeners as passive, so `preventDefault` does not stop page scrolling),
   video, performance, and every assumption the shim encodes, such as the
   root size used in media queries.

## Report

The lasting result is the dev-only preview mode in the project; the skill keeps
no other record. The user must be told the preview command and URL, the
resolutions and scales checked, what was measured, and which behaviour still
needs confirmation in the engine.
