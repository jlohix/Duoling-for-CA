import json

qs = json.load(open('/tmp/duo/questions_rendered.json'))

TOPIC_ORDER = ['1', '2', '3', '4', '5', '6', '7']
TOPIC_META = {
    '1': {'name': 'Basic Laws', 'icon': '⚡', 'blurb': "Ohm's Law, KCL, KVL, Thevenin & Norton"},
    '2': {'name': 'Energy Storage Elements', 'icon': '🔋', 'blurb': 'Capacitors, inductors, stored energy'},
    '3': {'name': 'First & Second Order Circuits', 'icon': '⏱️', 'blurb': 'RC/RL transients, RLC damping, phasors'},
    '4': {'name': 'Operational Amplifiers', 'icon': '🔺', 'blurb': 'Ideal op-amps, inverting & non-inverting gain'},
    '5': {'name': 'Laplace Transforms', 'icon': '🌀', 'blurb': 's-domain analysis of circuits'},
    '6': {'name': 'Transfer Functions', 'icon': '🔗', 'blurb': 'H(s), poles/zeros, and two-port network parameters'},
    '7': {'name': 'AC Steady-State Analysis', 'icon': '〰️', 'blurb': 'Phasors, RMS, mixed DC/AC sources'},
}
DIFF_META = {1: {'label': 'Easy', 'icon': '🌱'}, 2: {'label': 'Medium', 'icon': '🔥'}, 3: {'label': 'Challenging', 'icon': '💎'}}

by_topic = {}
for q in qs:
    by_topic.setdefault(q['topicId'], []).append(q)

units = []
for t in TOPIC_ORDER:
    tqs = by_topic.get(t, [])
    if not tqs:
        continue
    lessons = []
    MAX_LEN = 8
    for diff in (1, 2, 3):
        dqs = [q['id'] for q in tqs if q['difficulty'] == diff]
        if not dqs:
            continue
        chunks = [dqs[i:i + MAX_LEN] for i in range(0, len(dqs), MAX_LEN)]
        for ci, chunk in enumerate(chunks):
            label = DIFF_META[diff]['label']
            if len(chunks) > 1:
                label = f"{label} {ci + 1}"
            lessons.append({
                'id': f't{t}-d{diff}-{ci}',
                'label': label,
                'icon': DIFF_META[diff]['icon'],
                'questionIds': chunk,
            })
    units.append({
        'id': f't{t}',
        'topicId': t,
        'name': TOPIC_META[t]['name'],
        'icon': TOPIC_META[t]['icon'],
        'blurb': TOPIC_META[t]['blurb'],
        'lessons': lessons,
    })

json.dump(units, open('/tmp/duo/units.json', 'w'), indent=1)
total_lessons = sum(len(u['lessons']) for u in units)
print(f"{len(units)} units, {total_lessons} lessons, {len(qs)} questions")
for u in units:
    print(u['id'], u['name'], [(l['id'], len(l['questionIds'])) for l in u['lessons']])
