"""Inline SVG scenes for Climb, Build and Slow down (proposed homepage)."""

INK = '#102c50'
BLUE = '#2854df'
CYAN = '#a7edf5'
PALE = '#eaf2ff'
SKY = '#dbe8fb'
SKIN = '#c68b59'
SKIN2 = '#8d5b3a'
HAIR = '#2b1b14'


def _person(x, y, s, body, skin=SKIN, hair=HAIR):
    """A simple standing/sitting bust: head + shoulders, top at (x, y)."""
    return (f'<path d="M{x-30*s:.1f} {y+92*s:.1f} C{x-30*s:.1f} {y+50*s:.1f},{x-16*s:.1f} {y+42*s:.1f},{x:.1f} {y+42*s:.1f} '
            f'C{x+16*s:.1f} {y+42*s:.1f},{x+30*s:.1f} {y+50*s:.1f},{x+30*s:.1f} {y+92*s:.1f} Z" fill="{body}"/>'
            f'<circle cx="{x:.1f}" cy="{y+22*s:.1f}" r="{18*s:.1f}" fill="{skin}"/>'
            f'<path d="M{x-18*s:.1f} {y+20*s:.1f} C{x-18*s:.1f} {y-2*s:.1f},{x+18*s:.1f} {y-2*s:.1f},{x+18*s:.1f} {y+20*s:.1f} '
            f'C{x+9*s:.1f} {y+10*s:.1f},{x-9*s:.1f} {y+10*s:.1f},{x-18*s:.1f} {y+20*s:.1f} Z" fill="{hair}"/>')


def climb():
    # A corner office: city window, rising chart, person at a desk with a CEO nameplate.
    bars = ''.join(f'<rect x="{30+i*18}" y="{100-h}" width="12" height="{h}" rx="2" fill="{c}"/>'
                   for i, (h, c) in enumerate([(18, '#b7c9e6'), (26, '#b7c9e6'), (36, '#b7c9e6'), (50, BLUE)]))
    sky = ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="{120-y}" fill="#b7c9e6"/>' for x, y, w in
                  [(214, 52, 22), (240, 36, 18), (262, 60, 26), (292, 44, 20), (316, 66, 18)])
    return f'''<svg viewBox="0 0 360 210" role="img" aria-label="A leader at a desk in a corner office with a city view and a rising chart">
<rect width="360" height="210" fill="{PALE}"/>
<rect x="204" y="22" width="134" height="104" rx="6" fill="{SKY}" stroke="#c4d4ec" stroke-width="3"/>{sky}
<line x1="271" y1="22" x2="271" y2="126" stroke="#c4d4ec" stroke-width="3"/>
<rect x="20" y="22" width="110" height="90" rx="6" fill="#fff" stroke="#c4d4ec" stroke-width="2"/>{bars}
<polyline points="34,64 52,56 70,48 92,30" fill="none" stroke="{BLUE}" stroke-width="2.5" stroke-linecap="round"/>
{_person(176, 62, 1.15, INK)}
<path d="M163 112 L176 132 L189 112 Z" fill="#fff"/><path d="M174 114 L176 132 L178 114 Z" fill="{BLUE}"/>
<rect x="70" y="150" width="230" height="16" rx="4" fill="#7a5236"/>
<rect x="84" y="166" width="10" height="40" fill="#6a452c"/><rect x="276" y="166" width="10" height="40" fill="#6a452c"/>
<rect x="118" y="128" width="64" height="24" rx="3" fill="{INK}"/><text x="150" y="145" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="{CYAN}" letter-spacing="2">CEO</text>
<rect x="214" y="132" width="52" height="20" rx="3" fill="#2e4a6b"/><rect x="210" y="150" width="60" height="4" rx="2" fill="#24405f"/>
</svg>'''


def build():
    # A small shop being set up: awning, OPEN sign, person carrying a box, stacked boxes.
    stripes = ''.join(f'<path d="M{40+i*30} 40 h30 v18 a15 15 0 0 1 -30 0 Z" fill="{BLUE if i % 2 == 0 else "#fff"}"/>' for i in range(8))
    return f'''<svg viewBox="0 0 360 210" role="img" aria-label="A person setting up their own small business, carrying a box into a shop marked open">
<rect width="360" height="210" fill="{PALE}"/>
<rect x="40" y="58" width="240" height="122" fill="#fff" stroke="#c4d4ec" stroke-width="2"/>
<rect x="34" y="28" width="252" height="14" rx="3" fill="{INK}"/>{stripes}
<rect x="60" y="88" width="90" height="70" rx="4" fill="{SKY}" stroke="#c4d4ec" stroke-width="2"/>
<rect x="72" y="98" width="48" height="20" rx="3" fill="{INK}"/><text x="96" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="{CYAN}">OPEN</text>
<rect x="172" y="96" width="62" height="84" rx="3" fill="#2e4a6b"/><circle cx="224" cy="140" r="3" fill="{CYAN}"/>
<rect x="0" y="180" width="360" height="30" fill="#d3e0f4"/>
<rect x="292" y="148" width="38" height="32" rx="2" fill="#c9965f"/><rect x="298" y="118" width="30" height="30" rx="2" fill="#d6a670"/>
<line x1="292" y1="164" x2="330" y2="164" stroke="#a87a48" stroke-width="2"/>
{_person(262, 92, 0.95, BLUE, SKIN2)}
<rect x="238" y="140" width="40" height="30" rx="2" fill="#d6a670" stroke="#a87a48" stroke-width="2"/>
<rect x="234" y="146" width="8" height="10" rx="3" fill="{SKIN2}"/><rect x="274" y="146" width="8" height="10" rx="3" fill="{SKIN2}"/>
</svg>'''


def slow_down():
    # Hills, sun, a tree, a person on a bench with a dog beside them.
    return f'''<svg viewBox="0 0 360 210" role="img" aria-label="A person relaxing on a bench in nature with their dog">
<rect width="360" height="210" fill="{SKY}"/>
<circle cx="292" cy="54" r="24" fill="#f6d27a"/>
<path d="M0 140 C60 104 120 112 180 130 C240 148 300 112 360 120 V210 H0 Z" fill="#b9d7c4"/>
<path d="M0 162 C80 140 160 150 240 160 C300 168 330 156 360 152 V210 H0 Z" fill="#9cc6ab"/>
<rect x="62" y="96" width="10" height="70" fill="#7a5236"/>
<circle cx="67" cy="84" r="30" fill="#6fae86"/><circle cx="46" cy="98" r="20" fill="#6fae86"/><circle cx="90" cy="96" r="22" fill="#6fae86"/>
<rect x="132" y="150" width="96" height="8" rx="3" fill="#7a5236"/>
<rect x="132" y="130" width="96" height="6" rx="3" fill="#7a5236"/>
<rect x="140" y="158" width="6" height="24" fill="#6a452c"/><rect x="214" y="158" width="6" height="24" fill="#6a452c"/>
{_person(176, 70, 0.95, INK)}
<path d="M168 152 h40 v8 h-40 Z" fill="#2e4a6b"/><rect x="200" y="158" width="9" height="22" rx="3" fill="#2e4a6b"/>
<ellipse cx="262" cy="166" rx="24" ry="12" fill="#b07a45"/>
<circle cx="286" cy="152" r="11" fill="#b07a45"/><path d="M280 144 l-6 -9 l10 4 Z" fill="#8a5a2e"/>
<circle cx="290" cy="150" r="1.8" fill="{INK}"/><circle cx="296" cy="155" r="2.2" fill="{INK}"/>
<rect x="246" y="172" width="6" height="14" rx="2" fill="#b07a45"/><rect x="270" y="172" width="6" height="14" rx="2" fill="#b07a45"/>
<path d="M238 162 q-12 -12 -6 -22" fill="none" stroke="#b07a45" stroke-width="5" stroke-linecap="round"/>
</svg>'''
