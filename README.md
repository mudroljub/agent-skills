# Agent Skills

Reusable skills for React UI libraries and design-system workflows.

## Included skills

- `check-assets` — audit or implement component assets from a design source.
- `check-design` — compare a React component with its Figma source.
- `sync-design-tokens` — sync Figma variables and adopt exact design tokens.
- `sync-reference-table` — maintain a component-to-Figma reference table.
- `uikit-final-review` — run a pre-approval review for changed components.
- `write-stories` — create or revise React Storybook stories and Docs.
- `write-tests` — write behavioral React component tests.
- `pracenje-instrukcija` — distinguish questions and discussion from explicit commands.

## Install

After this repository is published on GitHub:

```bash
npx skills add <github-owner>/agent-skills
```

Start a new agent session after installation so it can discover the installed
skills.

## Repository layout

Each skill lives in `skills/<skill-name>/` and contains its required
`SKILL.md` file plus any reusable references.

## Contributing

Keep skills project-neutral. Do not add credentials, private URLs, proprietary
assets, or references that require access to a particular application.
