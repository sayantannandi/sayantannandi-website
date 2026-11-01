"""Assemble static files without publishing dependencies or server source."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'
EXCLUDE = {'.git', '.github', '.netlify', 'node_modules', 'netlify', 'scripts', 'public', 'docs', 'output', '__pycache__'}
EXTENSIONS = {'.html', '.css', '.js', '.mjs', '.json', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.pdf', '.zip', '.txt', '.xml', '.ico', '.woff', '.woff2', '.ics'}

import os
import re

# Every Netlify form gets hidden source fields; every page gets the attribution script.
# Google Analytics loads only when GA_MEASUREMENT_ID is set in Netlify and the visitor allows it.
GA_ID = os.environ.get('GA_MEASUREMENT_ID', '').strip()
if not re.fullmatch(r'G-[A-Z0-9]{4,}', GA_ID):
    GA_ID = ''
HIDDEN = ''.join(f'<input type="hidden" name="{n}">' for n in ['utm_source', 'utm_medium', 'utm_campaign', 'landing_page', 'referrer'])
SCRIPT = (f'<script>window.SN_GA_ID="{GA_ID}";</script>' if GA_ID else '') + '<script src="/assets/lib/attribution.js?v=1" defer></script>'
FORM = re.compile(r'(<form\b[^>]*\bdata-netlify="true"[^>]*>)')

def add_tracking(path):
    html = path.read_text(encoding='utf-8')
    if 'attribution.js' in html:
        return
    html = FORM.sub(lambda m: m.group(1) + HIDDEN, html)
    if '</head>' in html:
        html = html.replace('</head>', SCRIPT + '</head>', 1)
    elif '</body>' in html:
        html = html.replace('</body>', SCRIPT + '</body>', 1)
    path.write_text(html, encoding='utf-8')

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
count = 0
for source in ROOT.rglob('*'):
    relative = source.relative_to(ROOT)
    if set(relative.parts) & EXCLUDE or not source.is_file():
        continue
    if relative.name in {'package.json', 'package-lock.json'}:
        continue
    if source.suffix not in EXTENSIONS and source.name not in {'_redirects', '_headers'}:
        continue
    target = OUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    if target.suffix == '.html':
        add_tracking(target)
    count += 1
print(f'Prepared {count} public files.')
