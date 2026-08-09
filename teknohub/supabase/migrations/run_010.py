import subprocess, json, os

ref = 'abulunzifndlvksdljuf'
# baca key dari run_009.py (pola sama)
key = None
with open(os.path.join(os.path.dirname(__file__), 'run_009.py'), encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith("key = "):
            key = line.split("'")[1]
            break
if not key:
    print('KEY NOT FOUND'); raise SystemExit(1)

def query(q):
    cmd = ['curl', '-s', '-w', '\nHTTP:%{http_code}', '-X', 'POST',
           f'https://api.supabase.com/v1/projects/{ref}/database/query',
           '-H', f'Authorization: Bearer {key}',
           '-H', 'Content-Type: application/json',
           '-d', json.dumps({'query': q})]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    out = r.stdout.strip()
    parts = out.rsplit('\nHTTP:', 1)
    body = parts[0].strip() if len(parts) > 1 else out
    code = parts[1] if len(parts) > 1 else '?'
    return body, code

for name in ['010_product_reviews.sql', '010b_seed_reviews.sql']:
    with open(os.path.join(os.path.dirname(__file__), name), encoding='utf-8') as f:
        sql = f.read()
    body, code = query(sql)
    print(f'{name} HTTP:', code)
    if code not in ('200', '201'):
        print('ERROR:', body[:800])
        continue
    print('  ->', body[:300])

b, c = query("select count(*) as n from product_reviews;")
print('total reviews:', b, 'HTTP:', c)
b2, c2 = query("select p.slug, count(*) as n, avg(pr.rating)::numeric(3,1) as avg_rating from product_reviews pr join products p on p.id = pr.product_id group by p.slug order by p.slug limit 5;")
print('sample:', b2, 'HTTP:', c2)
