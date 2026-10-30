---
name: gameface
description: Write and fix UI code and styles in a Coherent Gameface (COHTML) project, where an HTML engine embedded in a game client runs the UI - its engine runtime, the browser APIs, HTML, and CSS it lacks or treats differently, keeping development-only code out of release, and reading its errors in the client log. Use only in a Gameface project - whenever its code or styles are written, reviewed, or debugged, when the `engine` global, `coui://` resources, or engine translations are involved, or when JavaScript or CSS that works in a browser fails, renders differently, or is ignored in the game; do not use outside Gameface projects, for components in general, for previewing the UI in a desktop browser, or for design parity.
compatibility: Requires repository access to the Gameface UI project. Behaviour the code cannot show needs the game client, its log, and the engine inspector.
---

# Gameface

Gameface runs HTML, CSS, and JavaScript, but it is not a browser: its runtime
lacks common web APIs, and its CSS engine supports a subset of CSS and drops
the rest without anything visible on screen. A correct browser render proves
nothing about the game.

## 1. Check the sources for the engine version

1. The official documentation (`https://docs.coherent-labs.com/cpp-gameface/`)
   is the authority; other notes are hints. Its supported-features tables (CSS
   properties, CSS selectors, HTML elements, JS events, canvas, SVG) and its
   "Differences to traditional browsers" page describe the latest version.
2. The client log line `Initializing COHTML ver. <x>` names the project's
   engine version. For each feature, find in the feature and LTS changelogs
   the version that added it or fixed its bug. Behaviour the Web Standard Mode
   migration guide calls legacy is what versions before 3.0 do.
3. The project's stylelint configuration encodes what that version rejects.
4. The pages are large: save them to a scratch folder and search them. When a
   table and a changelog disagree, check in the engine inspector.

## 2. Use the engine runtime

1. **Engine global.** The entry HTML loads the engine script (`cohtml.js`),
   which defines the global `engine`; type code against the engine's own
   declarations. Wait for `engine.whenReady` before calling the engine or
   reading what the host provides.
2. **Host messages.** `engine.trigger(name, ...args)` sends an event to the
   host, `engine.on` and `engine.off` listen to the host's events, and
   `engine.call` returns a promise with the host's answer.
3. **Resources.** Reference images, video, and fonts through `coui://`, which
   the engine resolves against the resource roots in its path configuration.
4. **Translations.** Translate through the engine (`engine.translate` and the
   plural function the project declares). A missing translation comes back as
   the key itself, so a raw key on screen means a missing string, not a broken
   call.
5. **Fonts.** Font families come from the engine's font config; use the
   family names it declares. Text without a `font-family` uses the config's
   fallback family.
6. **UI scale.** The host sets the root font size and a scale variable from the
   player's UI scale; size in rem, or the project's helper for it, so the UI
   follows that setting. That rem in media queries also follows the root size
   is inferred, not confirmed; confirm it in the game before relying on rem
   breakpoints.

## 3. Work within the engine's DOM and APIs

The runtime has no `fetch`, `URLSearchParams`, or `AbortController`; a call
throws a `ReferenceError`.

1. Get data from the host through the engine. When the view must make an HTTP
   request, use `XMLHttpRequest`, never `fetch`.
2. Do not use `URLSearchParams`; take values from the host, or parse a query
   string by hand. Before adopting a library, check that it does not need
   these APIs; routers and request libraries often do.
3. Before relying on any other web API, check that it exists: look for it in
   the engine's own DOM type declarations when the SDK ships them (for example
   `cohtml.lib.dom.d.ts`), and evaluate `typeof <Name>` in the engine
   inspector's console. A browser, the standard DOM types, or a test runner
   cannot tell.
4. Bundler output can call missing APIs too: a module-preload polyfill (Vite's,
   for example) loads chunks with `fetch`. Turn it off for the engine build
   (in Vite, `build.modulePreload: { polyfill: false }`) and confirm in the log
   that the error is gone.
5. Development-only code also runs in the engine in a development build, so the
   same limits apply to it.
6. **Events.** There are no pointer or clipboard events; use mouse events.
   Drag events exist only through Coherent's GamefaceDnD library, which
   emulates them.
7. **Hover.** The engine updates the hovered element, `:hover`, and the
   `mouseenter`, `mouseleave`, `mouseover`, and `mouseout` events only on a
   mouse move or scroll, so an element inserted or replaced under a still
   cursor is not hovered until the mouse moves.
8. **Event objects.** `event.target` and `event.currentTarget` are null once
   the handler returns; copy what a deferred callback needs.
9. **Layout timing.** Layout runs once per frame, so styles and sizes read from
   JavaScript are from the previous frame and missing in the first one; read
   them in `requestAnimationFrame`. `ResizeObserver` reports up to two frames
   late.
10. **Newer APIs.** Element `scrollTo`, the `scroll-behavior` property, and
    extra arguments to `setTimeout` and `setInterval` arrive in 3.2.1; before
    it, set `scrollTop` or `scrollLeft`, and pass a closure.
11. **HTML elements.** Unsupported elements are not rendered, among them
    `ul`, `ol`, `li`, `table`, `select`, `option`, `label`, `form`, `audio`,
    and `iframe`; build them from `div` and `span`. `input` has only the text,
    button, and password types, `br` breaks a line only inside text, and `a`
    gets no link styles.
12. **Canvas.** Only the 2D context, without pixel access (`getImageData`,
    `putImageData`, `toDataURL`, `toBlob`), shadows, line dashes, or `clip()`;
    gradients and patterns work only with some drawing methods, so check the
    canvas table before drawing.
13. **Video.** `<video>` plays WebM with one VP8 or VP9 track and one Vorbis
    track, has no controls, and honours only `src`, `autoplay`, `loop`,
    `muted`, and `preload="auto"`. It hands decoded audio to the host instead
    of playing it, and lower bitrate, lower resolution, and no alpha cost less
    to decode.

## 4. Write CSS the engine supports

The project's stylelint configuration is the list of what the engine does not
support: properties, values, pseudo-classes, and pseudo-elements. Read it
before using a feature, and run stylelint on every changed style; it does not
catch the layout, function, and version limits below.

1. **Selectors.** An unsupported pseudo-class or pseudo-element drops the whole
   rule. Use an explicit state class instead of pseudo-classes such as
   `:disabled`, `:checked`, or `:not()`, and order the rules so the state class
   wins. `:nth-child()` has no `of <selector>` form. Combinators (descendant,
   child, sibling) work only when the host enables
   `EnableComplexCSSSelectorsStyling`. Before 3.0 an element can miss a
   restyle from a combinator selector that ends in a pseudo-class (such as
   `.list .item:hover`), and before LTS 2.2.5 and 3.0.2 a long selector with a
   descendant combinator can fail to match; keep selectors short.
2. **Layout.** Every element is a flex container (a column by default; `p`
   and `span` are rows), and `block` and `inline` are simulated with flex.
   Boxes size as `border-box` (`box-sizing: content-box` arrives in 3.0),
   `flex-shrink` defaults to 0, and `auto` in `min-width` and `min-height`
   means 0. Before 3.0 there is no static position: every element acts as
   `position: relative`, so percentages on an absolutely positioned child
   resolve against its direct parent; the Web Standard Mode migration guide
   lists the layout bugs those versions keep. A parent with `overflow` other
   than `visible` clips its absolutely positioned children.
3. **Flex.** `gap` works from 2.2.0, but before LTS 2.2.4 and 3.1.1 it also
   leaves one gap after the last item, so the container grows by one gap.
   Auto margins in flex (for example `margin-left: auto`) arrive in 3.0; before
   it, align with `justify-content` or a growing spacer.
4. **Missing features.** COHTML 2.2.3.1, for example, has no `object-fit`,
   grid layout, `justify-items`, `justify-self`, `float`, `outline`, `inset`,
   `order`, `display: inline-block`, `position: sticky`, or `max-width: none`,
   and no `word-break` or `word-wrap`; wrap long words with `overflow-wrap`.
   Borders are only solid, `white-space` takes only `normal`, `nowrap`, `pre`,
   and `pre-wrap`, `text-overflow` only `clip` and `ellipsis` (which needs the
   ellipsis glyph in the font), and `vertical-align` works only inside
   `cohinline` paragraphs.
5. **Values and functions.** `calc()` cannot mix percentages with other
   lengths, and neither variables nor `calc()` work inside `@keyframes`.
   `var()` fallbacks, `min()`, `max()`, `clamp()`, `round()`, `color-mix()`,
   `hsl()`, and `hsla()` arrive in 3.2.1; before it, compute the value in the
   preprocessor or the host, and note that Sass passes `min()` and `max()`
   with mixed units through to CSS.
6. **Text size.** Before 3.0 font sizes are whole pixels, so a scaled size such
   as 17.5px is rounded.
7. **Images.** From 2.2.0 an `<img>` keeps its source aspect ratio by default,
   and `aspect-ratio` works on elements, raster images, and SVGs, but not
   inside `cohinline`; do not mix percentages and lengths in the size limits
   combined with it.
8. **`inherit`.** Do not write it: the engine logs `Unable to parse declaration`
   for `color: inherit` and ignores it, and stylelint forbids it for more
   properties. Inherited properties such as `color` inherit without it.
9. **Shorthands.** Before LTS 2.2.9 and 3.1.1 a `border` or `text-stroke`
   shorthand without a width is parsed wrongly; always write the width.
10. **Shorthand expansion.** When the build expands shorthands into longhands
    (for example with a PostCSS plugin), read which shorthands it expands and
    how. With such a plugin, `background: none` becomes only
    `background-image: none` and keeps the colour another rule set, and
    `background: var(--x)` cannot be expanded, so the build warns and leaves
    it as written. Set colours with `background-color`, and clear a
    background with the longhands it uses.

## 5. Keep development-only code out of release

Gate development tools, mocks, and preview code with a build-mode condition
written in the expression itself (for example
`import.meta.env.MODE !== 'production' ? () => import('./DevTools') : null`),
so the bundler removes the branch and its chunk. Verify with a release build
into an emptied output folder that it contains no development chunk, mock, or
preview code; a file left from an earlier build would fake the result.

## 6. Read the engine's errors

1. The client log carries engine messages prefixed `[Gameface]`. A script
   error appears as `JS Error: <file>:<line>: <message>`, followed by
   `JS Error (Line)` with the source line and `JS Error (Stack)`; some errors
   appear only as `[Gameface] <ErrorType>: <message>`.
2. CSS the engine cannot use appears as `Unsupported CSS property detected:`,
   `Unsupported CSS pseudo class selector encountered:`, and
   `Unsupported CSS pseudo element encountered:`. A value it cannot read
   appears as
   `Unable to parse declaration: <property> - <value> @<file>:<line>:<column>`;
   a missing `url()` asset produces the same line.
3. `Initializing COHTML ver. <x>` names the engine version; when it differs
   from the version in the stylelint messages, the list may be stale.
   `Inspector initialized. Remote debugging available on port: <n>` names the
   inspector, open at `http://localhost:<n>/` while a Gameface view is open.
4. Search the log for the app's `coui://` build path to separate its messages
   from other views.

## 7. Project knowledge

When the project keeps a local knowledge base, read its Gameface notes before
work. Keep project facts there (paths, versions, log locations, file and line
evidence), not in this skill.

## Report

The record is the changed code and styles. Tell the user which engine limits
shaped the change, which log lines were checked, and what still needs
confirmation in the game.
