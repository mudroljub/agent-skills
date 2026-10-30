---
name: write-plan
description: Write, update, or review an implementation plan that AI agents carry out under a human lead, including plans that split the work between several agents. Use when a multi-day engineering task or migration needs a plan, a work breakdown, estimates, or a schedule, or when an existing plan is checked for errors, gaps, or inconsistencies; do not use for a short in-session to-do list or a single small change.
---

# Writing Plans

A plan is what agents build from. Each agent usually reads it once in full
and afterwards only the step it is working on, so a gap or contradiction
inside a step turns straight into wrong work. Write every step so that it can
be executed and checked on its own, and keep every fact traceable to its
source.

## Before writing

1. Read what the plan builds on: the code, the tracker items, the design, and
   the project's notes and decisions. The code is the source of truth;
   documents can be outdated, so verify their claims in the code.
2. Record the code revision the plan was checked against, and cite code facts
   as `path:line` at that revision.
3. Write the scope rule first: what is in, what is explicitly out, and how
   shared code is treated. Every step is judged against it.
4. Keep apart what is decided, what is proposed, and what is assumed. Mark an
   assumption as one until it is verified.

## Structure

Follow the section order of [the plan template](references/plan-template.md):
header, scope rule, how to read, summary, assumptions, proposed decisions,
lanes and working rules, totals and schedule, steps by phase, open questions
by owner, risks, and what is deliberately left out.

- Take every number in the summary from the computed tables.
- Keep only the current state: replace outdated text instead of keeping old
  versions, lists of removed items, or notes on how the plan evolved.
- When the work spans several tracker items, map each step to exactly one
  item, so that work and commits can be attributed.

## Steps

Header: `### <ID> · <title> · <min> / <likely> / <max> p[ · <tag>] · <lane>`,
for example `### P2-04 · Empty state in NumberInput · 0.5 / 1 / 1.5 p · conditional · UI`.
Estimate in story points of one lane, and state the scale under "How to
read", for example one point per ideal working day. Split any step that is
likely to take more than about three ideal days. Tag a step that exists only
if a design, a team, or a spike confirms it as conditional, and name its
trigger.

When one piece of work is split between lanes, give the parts one number and
different letters, and use letters for nothing else. Refer to such a part by
its full ID; a bare number is ambiguous.

Fields:

- **What**: the concrete change: files, names, behavior, values. Make it
  complete enough to start without the rest of the plan, and repeat a
  constraint here when this step depends on it.
- **Reference**: an existing implementation to follow, as `path:line`, and
  what exactly to take from it.
- **Done when**: the checks that prove the step is finished.
- **Pitfalls**: traps found in the code, each with its evidence.
- **External**: what is awaited from other people, with a fallback that keeps
  the work moving, for example fixtures built from documentation until real
  samples arrive and are compared.

### Done when

Most defects that plan reviews find are here.

- The check must be possible when the step finishes, in schedule order. It
  must not depend on a later step, and two steps must never each need the
  other to be done first. If a check needs another step's output, schedule
  that step first, record a handoff, or move the check to the later step.
- If the check needs something that does not exist yet at that point, such as
  a mock, a window, a device, or a tool, name what to use instead or move the
  check.
- Name what is checked and how: a command, a test, a measurement, or an
  observable result. "Works as before" and "nothing changes" cannot be
  checked; say what is compared with what.
- When only a person, or a later checkpoint, can do the check, say who and
  when.

### Keeping later work possible

- Build the hooks that later checks need, such as a runtime switch for a mock
  scenario or a debug handle, in the step that builds the thing itself.
- Do not break what is still in use. If moving or renaming would break the
  old path, keep it and defer the move to the step that retires the old path.
- Give every external dependency a fallback, and every risky assumption an
  early spike whose outcome decides the related conditional steps.

## Several agents

- Assign lanes by kind of work, and keep an ownership table that covers every
  file and document the steps touch, including configuration files, READMEs,
  and project notes. A step edits only files of its own lane, or says how the
  change is coordinated.
- List handoffs as `A → B: what must be usable`. Announcing that a part is
  usable is enough; a commit is not a precondition.
- When one lane builds the UI and another the logic, never let the UI wait:
  build each screen first as a pure view with its own display props and a
  story with sample data, and wire it to the data layer through a thin
  container once that layer is usable. The UI lane stays unblocked and each
  handoff stays small.
- Give the plan working rules for a shared working copy:
  - one owner per file;
  - one runner at a time for generators, builds, and dev servers that write
    the same outputs;
  - agents do not commit or switch branches; the human lead runs every git
    operation that changes shared state, such as pull, rebase, merge, a
    branch switch, reverting, or stashing, while all agents pause writing,
    because it rewrites files under their open edits;
  - only the lead starts and drives a shared application whose state the
    lead owns, such as a game client, a device, or a shared test account
    session, unless the lead approves otherwise; agents ask for the check and
    read its logs afterwards, because there is one instance and every crash
    or side effect costs the lead's time;
  - a temporary failure is reported with its cause, never hidden by reverting
    someone else's work;
  - an agent works through its lane's steps in order without waiting for
    confirmation, skips a blocked step and reports what blocks it, and
    continues with independent work while it waits for a handoff or a check;
  - before reporting a step done, the agent checks every done-when item and
    its own changes, including work it delegated, and states what it could
    not check;
  - a lane may temporarily take over the blocking steps of an unavailable
    lane;
  - new instructions for the work go into the plan's rules and into every
    step they affect, so that the plan stays the single source.
- Add efficiency rules where they apply: one shared setup; generators run only
  after their inputs change; one build or dev server shared by all agents;
  tests at checkpoints rather than after every edit; quiet test and build
  output; design data fetched once and cached; a cheaper model for mechanical
  work; shared fixtures.
- Balance the lanes deliberately, and give the shorter lane conditional or
  follow-up work rather than idle time.

## Estimates and schedule

- Exclude conditional steps from the totals, and list them with their trigger
  and their own estimates.
- Schedule in waves. Compute each wave's min, likely, and max duration by
  simulating the lanes with their handoff waits; adding the numbers by hand
  misses the waits. With one point per ideal working day, the result is the
  calendar in working days. Keep the schedule as a small JSON file next to
  the plan and run [the check script](scripts/plan_check.py), which also
  recomputes every total and reports broken references. The schedule format
  is described at the top of the script; for a conditional tag in another
  language, pass it with `--conditional-marker`.
- Recompute after every reorder, new step, or changed estimate, and update
  every place that repeats a number.
- End each wave with a checkpoint that lists concrete, checkable results.

## Decisions, questions, risks

- Keep proposed decisions in their own table, with the reason and the
  evidence, apart from confirmed decisions; refer to confirmed ones by their
  identifier in the project's decision record.
- Group open questions by who can answer them.
- List risks with their consequence and mitigation, including differences
  between environments, for example a browser preview versus the real
  runtime.
- State facts about people and responsibilities only when verified. An
  unverified owner or approval requirement misleads every agent that reads it.

## Consistency

A change is complete only when every mention of the changed item is updated:
IDs, names, numbers, rules, and their references in the summary, tables,
checkpoints, and risks. Search the plan for the item before finishing.
Typical leftovers are references to removed steps, a rule stated differently
in two sections, totals not recomputed, a rationale that no longer fits after
a scope change, and one term used with two meanings.

## Reviewing a plan

1. Run the check script; every problem it reports is a finding.
2. Read the whole plan through four lenses. For a large plan, give each lens
   to an independent reviewer and have every finding checked by someone who
   tries to refute it before anything changes.
   - **Facts**: every claim about code, against the code at the current
     revision.
   - **Executability**: done-when timing, order against dependencies,
     handoffs, ownership, arithmetic, references.
   - **End to end**: walk the runtime path the plan builds, in order, and look
     for links that no step covers and mechanisms that do not exist in the
     code.
   - **Clarity**: places where two agents could read the same text
     differently.
3. Record each finding with the exact quote, its evidence, and the smallest
   correct fix. When applying a fix, change every place it affects, then run
   the check script again.

## Report

The record is the plan file and the schedule JSON next to it.

Tell the user what was created or changed, with the resulting totals and
calendar, which findings were fixed and which were left open and why, which
decisions the plan still needs, and which checks ran (the script, code
verification) and what could not be verified.
