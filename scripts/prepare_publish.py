"""Assemble static files without publishing dependencies or server source."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'
EXCLUDE = {'.git', '.github', '.netlify', 'node_modules', 'netlify', 'scripts', 'public', 'docs', '__pycache__'}
EXTENSIONS = {'.html', '.css', '.js', '.mjs', '.json', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.pdf', '.zip', '.txt', '.xml', '.ico', '.woff', '.woff2'}

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
    count += 1
print(f'Prepared {count} public files.')
