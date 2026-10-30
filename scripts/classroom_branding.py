"""Apply the current offer name to visible copy while retaining stable URLs and identifiers."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
def names(text):
    text=re.sub(r'(?<![/\w])(?:workshop cohort|live cohort|cohort)\b','Live Classroom',text,flags=re.I)
    text=re.sub(r'\blive(?: online)?\s+(Live Classroom)\b',r'\1',text,flags=re.I)
    return re.sub(r'(?<![/\w])cohorts\b','Live Classrooms',text,flags=re.I)
def brand_classroom(write):
    for p in ROOT.rglob('*.html'):
        rel=str(p.relative_to(ROOT))
        if rel.startswith(('public/','scripts/','node_modules/','.')):continue
        def token(m):
            t=m.group()
            if t.lower().startswith(('<script','<style')):return t
            if t.startswith('<'):
                return re.sub(r'''((?:alt|title|aria-label|content)=["'])(.*?)(["'])''',lambda a:a[1]+names(a[2])+a[3] if not a[2].startswith(('http','/')) else a[0],t)
            return names(t)
        s=re.sub(r'<script\b.*?</script>|<style\b.*?</style>|<[^>]+>|[^<]+',token,p.read_text(),flags=re.S|re.I)
        write(rel,s)
