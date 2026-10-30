# Agent Skills

Reusable skills for React UI libraries and design-system workflows. The public
repository is available at [mudroljub/agent-skills](https://github.com/mudroljub/agent-skills).

## Included skills

- `figma-authority` — decide which design source wins and whether design intent is established.
- `match-assets` — audit or implement component assets from a design source.
- `match-component` — compare a React component with its Figma source.
- `match-page` — compare whole app pages with their Figma screen designs.
- `sync-design-tokens` — sync Figma variables and adopt exact design tokens.
- `sync-reference-table` — maintain a component-to-Figma reference table.
- `uikit-final-review` — run a pre-approval review for changed components.
- `write-stories` — create or revise React Storybook stories and Docs.
- `write-tests` — write behavioral React component tests.
- `write-components` — implement React UI-library components by shared conventions for styling, states, refs, and effects.
- `write-plan` — write, update, or review implementation plans for AI agents, including parallel lanes.
- `preview-embedded-ui` — preview and measure UI built for an embedded HTML engine in a desktop browser.
- `gameface` — write and fix UI code and styles in Coherent Gameface (COHTML) projects only.
- `pracenje-instrukcija` — distinguish questions and discussion from explicit commands.
- `skrati` — keep each reply short: one point, at most one question, plain language.
- `jedno-po-jedno` — work through open questions and findings one at a time.
- `wows-baza` — project skill: start World of Warships UI work from the local knowledge base on the machine.
- `perfect-developer` — the head: always loaded, it gives the agent the character of an elite engineer for every task.

## Install

```bash
npx skills add mudroljub/agent-skills
```

Start a new agent session after installation so it can discover the installed
skills.

### Install selected skills

List the skills available in this repository before installing:

```bash
npx skills add mudroljub/agent-skills --list
```

Install one skill, for example `write-tests`:

```bash
npx skills add mudroljub/agent-skills --skill write-tests
```

Install several selected skills in one command:

```bash
npx skills add mudroljub/agent-skills --skill match-component --skill sync-design-tokens
```

### Install globally

By default, skills are installed into the current project. Add `-g` (`--global`)
to install a skill into your user directory so it is available in every
project, for example `perfect-developer`:

```bash
npx skills add mudroljub/agent-skills -g --skill perfect-developer
```

or without prompts:

```bash
npx skills add mudroljub/agent-skills -g -s perfect-developer -a claude-code codex -y
```

## Contributing

`perfect-developer` is the head: it is always loaded and holds how to think,
plan, design, act, and resolve tensions. The other skills assume it and never
restate it.

Skills are independent: none may name another; all may rely on the head. Like
ministries, each skill is responsible for one area, and every rule is defined
in exactly one skill. A review checklist may list another area's rule as an
item to verify, but never defines or changes it. Behaviour rules (how to reply,
when to ask or act, where open items go, who approves a status) live only in
the communication skills (`pracenje-instrukcija`, `skrati`, `jedno-po-jedno`);
task skills describe their task and never repeat them.

Keep skills project-neutral. Do not add credentials, private URLs, proprietary
assets, or references that require access to a particular application. The one
exception is a project skill: it may point to that project's local knowledge
base by path, and the project's facts stay in that base, not in the skill.
