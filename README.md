# Agent Skills

Reusable skills for React UI libraries and design-system workflows. The public
repository is available at [mudroljub/agent-skills](https://github.com/mudroljub/agent-skills).

## Included skills

- `check-assets` — audit or implement component assets from a design source.
- `check-design` — compare a React component with its Figma source.
- `sync-design-tokens` — sync Figma variables and adopt exact design tokens.
- `sync-reference-table` — maintain a component-to-Figma reference table.
- `uikit-final-review` — run a pre-approval review for changed components.
- `write-stories` — create or revise React Storybook stories and Docs.
- `write-tests` — write behavioral React component tests.
- `pracenje-instrukcija` — distinguish questions and discussion from explicit commands.
- `perfect-developer` — give the agent the character of an elite software engineer.

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
npx skills add mudroljub/agent-skills --skill check-design --skill sync-design-tokens
```

## Contributing

Keep skills project-neutral. Do not add credentials, private URLs, proprietary
assets, or references that require access to a particular application.
