import json

css = open('/tmp/duo/app.css').read()
js = open('/tmp/duo/app.js').read()
template = open('/tmp/duo/template.html').read()
units = json.load(open('/tmp/duo/units.json'))
questions = json.load(open('/tmp/duo/questions_rendered.json'))

# keep only fields the app needs (drop raw pre-render fields we don't use client-side)
slim_q = []
for q in questions:
    slim_q.append({
        'id': q['id'],
        'questionHtml': q['questionHtml'],
        'options': q['options'],
        'optionsHtml': q['optionsHtml'],
        'correctIndex': q['correctIndex'],
        'image': q['image'],
        'explanationHtml': q['explanationHtml'],
        'difficulty': q['difficulty'],
    })

def safe_json(obj):
    return json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')

out = template.replace('__CSS__', css).replace('__JS__', js)
out = out.replace('__UNITS_JSON__', safe_json(units))
out = out.replace('__QUESTIONS_JSON__', safe_json(slim_q))

with open('/tmp/duo/ampup.html', 'w') as f:
    f.write(out)

print('bytes:', len(out))
