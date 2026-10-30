"""Rebuild the six printables locally. PDFs are committed; the web build uses no PDF dependencies."""
from pathlib import Path
import json, shutil
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'scripts/content/free-guides.json').read_text())
OUT=ROOT/'output/pdf';OUT.mkdir(parents=True,exist_ok=True)
for name,file in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Title','DejaVuSerif.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
W,H=595.28,841.89;M=48;CW=W-2*M
NAVY='#102c50'; BLUE='#2854df'; TEAL='#14776e'; CORAL='#bc4f3c'; MUTED='#48607b'; LINE='#cbd7e6'
ACCENTS={'blue':BLUE,'teal':TEAL,'coral':CORAL}
class Guide:
 def __init__(self,g,n):
    self.g=g;self.n=n;self.accent=ACCENTS[g['accent']];self.path=OUT/(g['slug']+'.pdf')
    self.c=canvas.Canvas(str(self.path),pagesize=(W,H),pageCompression=1,invariant=1)
    self.c.setTitle(g['title']);self.c.setAuthor('Sayantan Nandi');self.c.setSubject(g['promise']);self.page=0
 def text(self,txt,x,y,w=CW,size=11.2,font='Body',color=NAVY,leading=None):
    st=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.42,textColor=HexColor(color),spaceAfter=0)
    p=Paragraph(escape(txt).replace('\n','<br/>'),st);pw,ph=p.wrap(w,1000)
    if y-ph<55:raise ValueError(f"Overflow {self.g['slug']} page {self.page}: {txt[:70]} bottom={y-ph}")
    p.drawOn(self.c,x,y-ph);return y-ph
 def rule(self,y,color=LINE):
    self.c.setStrokeColor(HexColor(color));self.c.setLineWidth(.7);self.c.line(M,y,W-M,y)
 def start(self,label,title):
    if self.page:self.c.showPage()
    self.page+=1;self.c.setFillColor(HexColor(self.accent));self.c.rect(0,H-7,W,7,fill=1,stroke=0)
    self.text('SAYANTAN NANDI  /  THE OPTIONAL CAREER',M,H-30,size=8.2,font='Bold',color=MUTED)
    self.text(label.upper(),M,H-72,size=10,font='Bold',color=self.accent)
    self.y=self.text(title,M,H-100,size=27,font='Title',leading=33)-24
    self.c.setStrokeColor(HexColor(LINE));self.c.line(M,42,W-M,42)
    self.c.setFont('Body',8);self.c.setFillColor(HexColor(MUTED));self.c.drawString(M,28,'sayantannandi.com  /  Free practical guide')
    self.c.drawRightString(W-M,28,f'{self.page} / 5')
    self.c.linkURL('https://sayantannandi.com/worksheets',(M,24,290,38),relative=0)
 def para(self,t,size=11.2,font='Body',color=NAVY,gap=13):self.y=self.text(t,M,self.y,size=size,font=font,color=color)-gap
 def block(self,heading,body):
    self.para(heading,size=13,font='Bold',color=self.accent,gap=5);self.para(body,gap=18)
 def run(self):
    g=self.g
    self.start(f"Free guide {self.n:02d} · {g['category']}",g['title'])
    self.para(g['promise'],size=15,color=MUTED,gap=25)
    self.rule(self.y);self.y-=23
    self.para(g['hook'],size=17,font='Title',gap=14)
    self.para(g['intro'],gap=22)
    self.block('Start here',g['quick'])
    self.y-=2
    for i,s in enumerate(g['steps']):
        col=i%2;row=i//2;x=M+col*(CW/2+6);y=self.y-row*47
        self.c.setFillColor(HexColor('#f0f5ff'));self.c.roundRect(x,y-37,CW/2-7,37,5,fill=1,stroke=0)
        self.text(f'0{i+1}  {s}',x+11,y-10,w=CW/2-28,size=10.4,font='Bold',color=self.accent)
    self.y-=111
    self.para(f"Set aside {g['minutes']} minutes. Work through the examples, then print page 4 for your own situation.",size=10.5,color=MUTED)
    self.start('See it in practice','From a familiar response\nto a useful one.')
    self.para('Fictional examples for practice. Adapt the reasoning to the facts of your situation.',size=10.4,color=MUTED,gap=18)
    for e in g['examples']:
        self.para(e['label'].upper(),size=9,font='Bold',color=self.accent,gap=4)
        self.para('Before: '+e['before'],size=10.5,color=MUTED,gap=5)
        self.para('After: '+e['after'],size=10.7,gap=5)
        self.para(e['why'],size=9.6,color=MUTED,gap=17)
    self.start('The method',g['methodTitle'])
    for h,b in g['method']:self.block(h,b)
    self.rule(self.y);self.y-=17
    self.block('Keep this to hand',g['script'])
    self.start('Your printable worksheet',g['worksheetTitle'])
    self.para(g['worksheetIntro'],size=10.7,color=MUTED,gap=16)
    available=self.y-66;rowh=available/len(g['prompts'])
    for i,p in enumerate(g['prompts']):
        top=self.y-i*rowh
        end=self.text(f'{i+1:02d}  {p}',M,top,size=10.4,font='Bold')
        for l in [end-17,end-34,end-51]:
            self.c.setStrokeColor(HexColor(LINE));self.c.setLineWidth(.6);self.c.line(M,l,W-M,l)
    self.start('Take it into your week','One useful next move.')
    self.block('Before you use it', 'Read your completed sheet once. Check each statement below.')
    for check in g['checks']:
        self.c.setStrokeColor(HexColor(self.accent));self.c.rect(M,self.y-12,10,10,fill=0,stroke=1)
        self.y=self.text(check,M+22,self.y,w=CW-22,size=11)-13
    self.y-=5;self.block('Try it once',g['experiment'])
    self.block('Afterward, ask yourself',g['reflection'])
    self.rule(self.y);self.y-=23
    self.block(g['nextTitle'],g['nextText'])
    top=self.y;self.para(g['cta']+' →',size=12,font='Bold',color=BLUE,gap=5)
    url='https://sayantannandi.com'+g['url']
    self.c.linkURL(url,(M,self.y,W-M,top+2),relative=0)
    self.para('sayantannandi.com'+g['url'],size=10,color=MUTED,gap=18)
    self.para('By Sayantan Nandi\nFormer IT Director, Schneider Electric · Led teams of 200+ · ISB MBA',size=9.3,color=MUTED)
    self.c.save()
    shutil.copy2(self.path,ROOT/'assets/downloads/guides'/self.path.name)
    print(self.path)
for i,g in enumerate(DATA,1):Guide(g,i).run()
