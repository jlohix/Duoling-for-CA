import csv, json, re, sys

with open('/tmp/duo/QuestionBank.csv', newline='', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    rows = [r for r in reader if r.get('id')]

TOPIC_NAMES = {
    '1': 'Basic Laws',
    '2': 'Energy Storage Elements',
    '3': 'First & Second Order Circuits',
    '4': 'Operational Amplifiers',
    '5': 'Laplace Transforms',
    '6': 'Transfer Functions & Two-Port Networks',
    '7': 'AC Steady-State Analysis',
}

def clean(s):
    if s is None:
        return ''
    return s.strip()

def norm(s):
    # normalize for comparison (strip whitespace/case for dup detection)
    return re.sub(r'\s+', ' ', s.strip()).lower()

# Manual fixups for known data-entry corruption (mojibake, truncated text,
# stray fields, Excel auto-formatting artifacts)
TEXT_FIXUPS = {
    '609': {
        'question': 'For a series RLC circuit with R = 4Ω, L = 1H, C = 0.25F, the transfer function Vc(s) / Vin(s) is:',
    },
    '610': {
        'question': 'For a low-pass RC filter (R = 1kΩ, C = 1μF), the transfer function H(s) = Vo(s)/Vi(s) is:',
    },
    '210': {
        'question': 'Determine the voltage and the energy stored in the 60 μF capacitor.',
    },
}
OPTION_FIXUPS = {
    ('717', 'optionB'): '0 A',
}
EXPLANATION_FIXUPS = {
    '504': 'At DC steady state, the capacitor is fully charged and no current flows into it, so it acts as an open circuit (the opposite of an inductor, which acts as a short circuit at DC steady state).',
}
# Rows that look like they have 2+ valid option cells but are not genuine
# independent multiple-choice questions (fill-in-the-blank, multi-part
# answers, or otherwise incoherent) -- drop explicitly.
FORCE_DROP = {'506', '508', '511'}

PREFIX_RE = re.compile(r'^[A-Da-d]\.\s*')

usable = []
dropped = []

for r in rows:
    qid = clean(r['id'])
    if qid in FORCE_DROP:
        dropped.append((qid, clean(r['topicId']), 'force-drop (not a real MCQ)', clean(r['question'])[:60]))
        continue
    topic = clean(r['topicId'])
    question = clean(r['question'])
    a = clean(r['optionA'])
    b = clean(r['optionB'])
    c = clean(r['optionC'])
    d = clean(r['optionD'])
    answer = clean(r['answer']).lower()
    image = clean(r['image'])
    explanation = clean(r['explanation'])
    difficulty = clean(r['difficulty']) or '1'

    if qid in TEXT_FIXUPS and 'question' in TEXT_FIXUPS[qid]:
        question = TEXT_FIXUPS[qid]['question']
    if ('optionA' in r) and (qid, 'optionA') in OPTION_FIXUPS:
        a = OPTION_FIXUPS[(qid, 'optionA')]
    if (qid, 'optionB') in OPTION_FIXUPS:
        b = OPTION_FIXUPS[(qid, 'optionB')]
    if (qid, 'optionC') in OPTION_FIXUPS:
        c = OPTION_FIXUPS[(qid, 'optionC')]
    if qid in EXPLANATION_FIXUPS:
        explanation = EXPLANATION_FIXUPS[qid]
    if not image.startswith('http'):
        image = ''  # strip corrupted / non-URL image fields

    a = PREFIX_RE.sub('', a)
    b = PREFIX_RE.sub('', b)
    c = PREFIX_RE.sub('', c)
    d = PREFIX_RE.sub('', d)

    opts_raw = {'a': a, 'b': b, 'c': c}
    # need at least 2 non-empty of a/b/c, and question text, to be usable
    non_empty = [k for k, v in opts_raw.items() if v]

    # detect placeholder junk like "Picture" with no image
    junk_vals = {'picture', ''}
    real_opts = {k: v for k, v in opts_raw.items() if v and norm(v) not in junk_vals}

    if not question or len(real_opts) < 2:
        dropped.append((qid, topic, 'insufficient options', question[:60]))
        continue

    # Determine correct answer letter
    correct_letter = None
    if answer in ('a', 'b', 'c', 'd'):
        if answer == 'd':
            # d is normally a duplicate; map to whichever of a/b/c matches
            for k, v in real_opts.items():
                if norm(v) == norm(d):
                    correct_letter = k
                    break
            if not correct_letter and d and norm(d) not in junk_vals:
                # d has unique text not matching any of a/b/c -> treat d as a real 4th option? rare edge.
                correct_letter = 'd'
        else:
            correct_letter = answer if answer in real_opts else None
    if not correct_letter:
        # try to infer via optionD duplicate pattern
        if d and norm(d) not in junk_vals:
            for k, v in real_opts.items():
                if norm(v) == norm(d):
                    correct_letter = k
                    break

    if not correct_letter or correct_letter not in real_opts:
        dropped.append((qid, topic, 'no determinable answer', question[:60]))
        continue

    # Build final option list: use a/b/c only (d is redundant dup / or junk)
    choice_items = [(k, v) for k, v in opts_raw.items() if k in real_opts]
    # keep original a,b,c order
    choice_items = [(k, opts_raw[k]) for k in ['a', 'b', 'c'] if k in real_opts]

    usable.append({
        'id': qid,
        'topicId': topic,
        'topicName': TOPIC_NAMES.get(topic, f'Topic {topic}'),
        'question': question,
        'options': [v for k, v in choice_items],
        'correctIndex': [k for k, v in choice_items].index(correct_letter),
        'image': image,
        'explanation': explanation or '',
        'difficulty': int(difficulty) if difficulty.isdigit() else 1,
    })

print(f"Usable: {len(usable)}  Dropped: {len(dropped)}")
for d in dropped:
    print(' DROP', d)

by_topic = {}
for q in usable:
    by_topic.setdefault(q['topicId'], []).append(q)
for t, qs in sorted(by_topic.items(), key=lambda x: int(x[0])):
    print(f"Topic {t} ({TOPIC_NAMES.get(t)}): {len(qs)} questions")

with open('/tmp/duo/questions.json', 'w') as f:
    json.dump(usable, f, indent=1)

images = sorted(set(q['image'] for q in usable if q['image']))
with open('/tmp/duo/images.txt', 'w') as f:
    f.write('\n'.join(images))
print(f"\nUnique images: {len(images)}")
