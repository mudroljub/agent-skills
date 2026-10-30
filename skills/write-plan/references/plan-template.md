# Plan template

Copy the outline, keep the section order, and drop a section only when it has
nothing to say. Text in angle brackets is a placeholder; the remaining text
shows the expected shape.

```markdown
# <Plan title>

> **Status:** <date>, draft · **Code:** <repository> @ <revision>

<One paragraph: what the plan covers, which tracker items, what is outside
this phase, and who carries it out.>

## Scope rule
- <what is in>
- <what is explicitly out, for example fixing existing bugs or rewrites>
- <when shared code may change>

## How to read
- **Estimate:** story points of one lane, min / likely / max; one point is
  <scale, for example one ideal working day>. No step is likely to take more
  than about three ideal days. Meetings, review, and waiting for other teams
  are not included.
- **Lane:** the last field of a step header.
- **IDs:** parts of one piece of work split between lanes share the number
  and differ in the letter.
- **Conditional:** the step exists only if its trigger is confirmed.
- **External:** what is awaited from others.
- **Paths:** <abbreviations used in the plan>.

## Summary
- <lanes and who leads them>
- <total: likely points (min, max), plus conditional work>
- <calendar: likely working day of completion (min, max)>
- <main risks and how the first wave addresses them>
- <key architectural choices, with decision identifiers>

## Assumptions
- <assumption> (<decision identifier or "unverified">)

## Proposed decisions
| # | Decision | Why | Evidence |
|---|---|---|---|
| PD-1 | <proposal> | <reason> | `path:line` |

## Lanes
- **<Lane A>:** <kind of work>
- **<Lane B>:** <kind of work>
- **<Lead>:** assigns steps, reviews, commits, checks in the real runtime.

**Ownership**

| Area | Owner |
|---|---|
| <paths or document> | <lane> |

**Working rules**
1. <one owner per file; coordination for other files>
2. <handoff by announcement, not by commit; the UI does not wait for the
   logic: pure views with stories first, containers wire the data later>
3. <temporary failures reported with cause>
4. <one runner for generators, builds, dev servers>
5. <no commits or branch switches by agents; the lead runs git operations
   that change shared state while agents pause>
6. <only the lead starts shared applications such as a game client; agents
   ask for the check and read the logs>
7. <steps in order without waiting; a blocked step skipped and reported;
   independent work while waiting>
8. <check before reporting done>
9. <takeover of blocking steps when a lane is unavailable>
10. <new instructions go into these rules and the affected steps>

### Efficiency
- <shared setup, generators on demand, one build, tests at checkpoints,
  quiet output, cached design data, cheaper model for mechanical work,
  shared fixtures>

## Totals
| Task | Steps | Min | Likely | Max | Conditional (min / likely / max) |
|---|---|---|---|---|---|

| Lane | Steps | Min | Likely | Max | Conditional (min / likely / max) |
|---|---|---|---|---|---|

## Schedule
| Wave | <Lane A> | <Lane B> | <Lead> | Duration in working days (min / likely / max) |
|---|---|---|---|---|
| W1 · <goal> | P1-02, P1-03 · **<likely sum> p** | P1-04 · **<likely sum> p** | <parallel work> | <computed> |

- **Calendar:** <computed total>; <known waits inside waves>.
- **Conditional steps** enter a lane when: <step: trigger>.

**Checkpoints**
1. **End of W1:** <concrete, checkable results>.

**Handoffs**
- P1-03 (<Lane A>) → P1-04 (<Lane B>): <what must be usable>;

**External, in order of need:** <dependency (step)>.

## Phase 1 · <tracker item>: <title>

### P1-01 · <title> · 1 / 1.5 / 2 p · <lane>
- **What:** <files, names, behavior, values>
- **Reference:** `path:line`: <what to take from it>
- **Done when:** <command, test, measurement, or observable result>
- **Pitfalls:** <trap> (`path:line`)
- **External:** <what is awaited>; fallback: <how work continues>

## Open questions (by owner)
**<Owner>:** <question> (<step>)

## Risks
| Risk | Consequence | Mitigation |
|---|---|---|

## Not carried over
- <deliberately excluded behavior or code, with the reason>
```
