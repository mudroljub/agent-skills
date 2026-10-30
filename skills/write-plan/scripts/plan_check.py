#!/usr/bin/env python3
"""Mechanical checks for a plan whose step headers follow the write-plan format.

Step header:  ### <ID> · <title> · <min> / <likely> / <max> <unit>[ · <tag>] · <lane>
The unit is a short word such as p (points) or d (days); one plan uses one unit.

Usage:
    python plan_check.py PLAN.md [--schedule SCHEDULE.json] [--conditional-marker TEXT ...]

Reports step headers that cannot be parsed, duplicate IDs, references to
undefined steps, bare references to steps that exist only as lettered parts,
totals per phase and per lane, and, with --schedule, schedule coverage and
wave durations simulated with handoff waits, in estimate units: with one
point per ideal working day they are the calendar in working days. Exits
with 1 when it finds a problem.

Schedule file (JSON):
{
  "waves": [
    {"name": "Setup", "sequential": ["P1-01"]},
    {"name": "Wave 1",
     "lanes": {"UI": ["P1-08", "P1-03"], "Logic": ["P1-04"]},
     "parallel": ["P1-02"],
     "release": {"P1-04": [0.75, 1, 1.5]}},
    {"name": "Final pass", "sequential": ["P4-05"]}
  ],
  "handoffs": [["P1-08", "P1-04"]]
}
"sequential" steps run one after another; the wave lasts their sum.
"lanes" run in parallel, each lane in the listed order; a step waits for its
handoff predecessors in the same wave (earlier waves are already finished).
Lane names must match the lane in the step headers.
"parallel" steps happen during the wave without affecting its duration.
"release" is the earliest start of a step within its wave: min, likely, max.
"""

import argparse
import json
import re
import sys
from collections import defaultdict

ID_RE = re.compile(r'^[A-Z][A-Za-z0-9]*-\d+[a-z]?$')
ESTIMATE_RE = re.compile(r'^(\d+(?:[.,]\d+)?)\s*/\s*(\d+(?:[.,]\d+)?)\s*/\s*(\d+(?:[.,]\d+)?)\s*([A-Za-z]{1,3})$')
DEFAULT_MARKERS = ('conditional',)


def parse_steps(lines, markers):
    steps, problems = {}, []
    for number, line in enumerate(lines, 1):
        if not line.startswith('### '):
            continue
        parts = [part.strip() for part in line[4:].split(' · ')]
        if not ID_RE.match(parts[0]):
            continue
        step_id = parts[0]
        estimate_at = next((i for i, part in enumerate(parts) if ESTIMATE_RE.match(part)), None)
        if estimate_at is None or estimate_at < 2 or estimate_at == len(parts) - 1:
            problems.append('line %d: cannot parse step header: %s' % (number, line.strip()))
            continue
        tags = parts[estimate_at + 1:-1]
        unknown = [tag for tag in tags if tag.lower() not in markers]
        if unknown:
            problems.append('line %d: %s has unknown tag(s): %s' % (number, step_id, ', '.join(unknown)))
        if step_id in steps:
            problems.append('line %d: duplicate step id %s' % (number, step_id))
            continue
        *values, unit = ESTIMATE_RE.match(parts[estimate_at]).groups()
        steps[step_id] = {
            'unit': unit,
            'estimate': tuple(float(value.replace(',', '.')) for value in values),
            'conditional': any(tag.lower() in markers for tag in tags),
            'lane': parts[-1],
        }
    return steps, problems


def phase(step_id):
    return step_id.rsplit('-', 1)[0]


def check_references(lines, steps):
    prefixes = sorted({phase(step_id) for step_id in steps}, key=len, reverse=True)
    if not prefixes:
        return []
    ref_re = re.compile(r'\b(?:%s)-\d+[a-z]?\b' % '|'.join(re.escape(prefix) for prefix in prefixes))
    split_bases = {step_id.rstrip('abcdefghijklmnopqrstuvwxyz') for step_id in steps} - set(steps)
    undefined, bare = defaultdict(list), defaultdict(list)
    for number, line in enumerate(lines, 1):
        for ref in ref_re.findall(line):
            if ref in steps:
                continue
            (bare if ref in split_bases else undefined)[ref].append(str(number))
    return (['undefined step %s on line(s) %s' % (ref, ', '.join(where)) for ref, where in sorted(undefined.items())]
            + ['bare reference %s, only lettered parts exist, on line(s) %s' % (ref, ', '.join(where))
               for ref, where in sorted(bare.items())])


def total(step_ids, steps):
    return tuple(sum(steps[step_id]['estimate'][k] for step_id in step_ids) for k in range(3))


def simulate(wave, steps, predecessors, scenario):
    queues = {lane: list(ids) for lane, ids in wave['lanes'].items()}
    in_wave = {step_id for ids in queues.values() for step_id in ids}
    release = wave.get('release', {})
    clock = {lane: 0.0 for lane in queues}
    end, waits = {}, {}
    while any(queues.values()):
        progressed = False
        for lane, queue in queues.items():
            if not queue:
                continue
            step_id = queue[0]
            before = [p for p in predecessors[step_id] if p in in_wave]
            if any(p not in end for p in before):
                continue
            start = max([clock[lane], release.get(step_id, (0, 0, 0))[scenario]] + [end[p] for p in before])
            if start > clock[lane]:
                waits[step_id] = start - clock[lane]
            end[step_id] = clock[lane] = start + steps[step_id]['estimate'][scenario]
            queue.pop(0)
            progressed = True
        if not progressed:
            blocked = ', '.join(queue[0] for queue in queues.values() if queue)
            raise ValueError('deadlock in %s: %s wait for each other' % (wave['name'], blocked))
    return max(clock.values(), default=0.0), waits


def check_schedule(schedule, steps):
    problems, placed, wave_of = [], defaultdict(int), {}
    for index, wave in enumerate(schedule['waves']):
        ids = list(wave.get('sequential', [])) + list(wave.get('parallel', []))
        for lane, lane_ids in wave.get('lanes', {}).items():
            ids += lane_ids
            problems += ['%s is in lane %s in %s, but its header says %s' % (s, lane, wave['name'], steps[s]['lane'])
                         for s in lane_ids if s in steps and steps[s]['lane'].lower() != lane.lower()]
        for step_id in ids:
            placed[step_id] += 1
            wave_of[step_id] = index
            if step_id not in steps:
                problems.append('%s in %s is not a step in the plan' % (step_id, wave['name']))
    problems += ['%s is scheduled %d times' % (s, n) for s, n in sorted(placed.items()) if n > 1]
    problems += ['%s is not conditional but is not scheduled' % s
                 for s in sorted(steps) if not steps[s]['conditional'] and s not in placed]
    predecessors = defaultdict(list)
    for before, after in schedule.get('handoffs', []):
        problems += ['handoff %s -> %s: %s is not scheduled' % (before, after, s) for s in (before, after) if s not in placed]
        if before in wave_of and after in wave_of and wave_of[before] > wave_of[after]:
            problems.append('handoff %s -> %s goes backwards across waves' % (before, after))
        predecessors[after].append(before)
    if problems:
        return problems, []

    waves = []
    for wave in schedule['waves']:
        durations, likely_waits = [], {}
        for scenario in range(3):
            if 'lanes' in wave:
                duration, waits = simulate(wave, steps, predecessors, scenario)
            else:
                duration, waits = total(wave.get('sequential', []), steps)[scenario], {}
            durations.append(duration)
            if scenario == 1:
                likely_waits = waits
        lanes = {lane: total(ids, steps)[1] for lane, ids in wave.get('lanes', {}).items()}
        waves.append((wave['name'], durations, lanes, likely_waits))
    return [], waves


def main():
    parser = argparse.ArgumentParser(description='Mechanical checks for a write-plan plan.')
    parser.add_argument('plan')
    parser.add_argument('--schedule', help='JSON schedule file, see the module docstring')
    parser.add_argument('--conditional-marker', action='append',
                        help='tag that marks a conditional step (default: %s)' % ', '.join(DEFAULT_MARKERS))
    args = parser.parse_args()
    markers = {marker.lower() for marker in (args.conditional_marker or DEFAULT_MARKERS)}

    with open(args.plan, encoding='utf-8') as handle:
        lines = handle.read().splitlines()
    steps, problems = parse_steps(lines, markers)
    units = sorted({step['unit'] for step in steps.values()})
    if len(units) > 1:
        problems.append('estimates use several units: %s' % ', '.join(units))
    problems += check_references(lines, steps)
    comma = any(re.search(r'\d,\d', line) for line in lines if line.startswith('### '))

    def fmt(value):
        text = ('%.2f' % value).rstrip('0').rstrip('.')
        return text.replace('.', ',') if comma else text

    def triple(values):
        return ' / '.join(fmt(value) for value in values)

    print('steps: %d, conditional: %d, unit: %s' % (len(steps), sum(step['conditional'] for step in steps.values()),
                                                    ', '.join(units) or '-'))
    for label, key in (('phase', phase), ('lane', lambda step_id: steps[step_id]['lane'])):
        groups = defaultdict(lambda: ([], []))
        for step_id in steps:
            groups[key(step_id)][steps[step_id]['conditional']].append(step_id)
        for name in sorted(groups):
            planned, conditional = groups[name]
            line = '%s %s: steps %d, %s' % (label, name, len(planned), triple(total(planned, steps)))
            if conditional:
                line += '; conditional: steps %d, %s' % (len(conditional), triple(total(conditional, steps)))
            print(line)
    planned = [s for s in steps if not steps[s]['conditional']]
    conditional = [s for s in steps if steps[s]['conditional']]
    print('total: %s; conditional: %s' % (triple(total(planned, steps)), triple(total(conditional, steps))))

    if args.schedule:
        with open(args.schedule, encoding='utf-8') as handle:
            schedule = json.load(handle)
        try:
            schedule_problems, waves = check_schedule(schedule, steps)
        except ValueError as error:
            schedule_problems, waves = [str(error)], []
        problems += schedule_problems
        calendar = [0.0, 0.0, 0.0]
        for name, durations, lanes, waits in waves:
            calendar = [c + d for c, d in zip(calendar, durations)]
            line = 'wave %s: %s' % (name, triple(durations))
            if lanes:
                line += '; likely work: %s' % ', '.join('%s %s' % (lane, fmt(work)) for lane, work in lanes.items())
            if waits:
                line += '; likely waits: %s' % ', '.join('%s %s' % (s, fmt(w)) for s, w in sorted(waits.items()))
            print(line)
        if waves:
            print('calendar: %s' % triple(calendar))

    for problem in problems:
        print('PROBLEM: ' + problem)
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
