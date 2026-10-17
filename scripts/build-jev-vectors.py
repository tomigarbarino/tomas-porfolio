"""Build genuine SVG figures, with the portfolio fonts embedded as WOFF2.

Authoring only: pip install -r scripts/requirements-jev-figures.txt
python scripts/build-jev-vectors.py

Published PNGs are immutable provenance. Where raw observations are unavailable,
trace graphical marks only; do not infer observations or re-estimate statistics.
All labels, axes, legends, workflow and confusion counts are native SVG elements.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from html import escape
from io import BytesIO
import base64
import hashlib
import json
import re
import xml.etree.ElementTree as ET

from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat
from fontTools import subset
from fontTools.ttLib import TTFont
import vtracer
import resvg_py

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/media/research/jev'
INK, CREAM, ACID, VIOLET, PINK, GRID = '#080909', '#f2efde', '#f4ff54', '#c6a7ff', '#ff76b9', '#454b43'
study = json.loads((ROOT / 'src/content/jev-study.json').read_text(encoding='utf-8'))
originals = [b for s in study['sections'] for b in s['blocks'] if b['type'] == 'figure']
sha = lambda data: hashlib.sha256(data).hexdigest()

def font_data(name):
    font = TTFont(ROOT / f'public/fonts/{name}.ttf', recalcTimestamp=False)
    options = subset.Options()
    options.flavor = 'woff2'
    options.drop_tables.append('meta')
    sub = subset.Subsetter(options=options)
    # Both original OFL license files remain alongside the fonts in public/fonts.
    sub.populate(unicodes=list(range(32, 383)) + [8592, 8594, 8595, 8599, 8722, 8712, 8804, 8805, 183, 8211])
    sub.subset(font)
    font.flavor = 'woff2'
    data = BytesIO()
    font.save(data)
    return base64.b64encode(data.getvalue()).decode()

FONTS = f"""<style>
@font-face{{font-family:Barlow;src:url(data:font/woff2;base64,{font_data('BarlowCondensed-Black')}) format('woff2');font-weight:900}}
@font-face{{font-family:Plex;src:url(data:font/woff2;base64,{font_data('IBMPlexMono-Regular')}) format('woff2');font-weight:400}}
text{{font-family:Plex,monospace;fill:{CREAM};font-size:20px}}.display{{font-family:Barlow,sans-serif;font-weight:900}}.small{{font-size:16px}}
</style>"""
license_text = '\n\n'.join((ROOT/f'public/fonts/{name}-OFL.txt').read_text(encoding='utf-8') for name in ['BarlowCondensed','IBMPlexMono'])
LICENSES = '<metadata id="font-licenses">' + escape('\n'.join(line.rstrip() for line in license_text.splitlines())) + '</metadata>'
traces = []

def text(x, y, value, size=20, color=CREAM, anchor='start', display=False):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="font-size:{size}px;fill:{color}" class="{"display" if display else "mono"}">{escape(str(value))}</text>'

def line(x1, y1, x2, y2, color=GRID, width=1.5, dash=None):
    return f'<path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{color}" stroke-width="{width}"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>'

def rect(x,y,w,h,fill=INK,stroke=None):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}"' + (f' stroke="{stroke}" stroke-width="2"' if stroke else '') + '/>'

def frame(number,w,h,title,subtitle,body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" style="display:block;width:100%;height:auto;background:{INK}" role="img" aria-labelledby="title desc">
<title id="title">Figura {number}. {escape(title)}</title><desc id="desc">{escape(subtitle)}. Tipografía Barlow Condensed e IBM Plex Mono. Formas y texto vectoriales; figuras originales disponibles para comparar.</desc>
{FONTS}{LICENSES}{rect(0,0,w,h)}{rect(0,0,w,54,VIOLET)}
{text(30,35,'JEV / RESEARCH FILE 001',18,INK)}{text(w-30,35,f'FIG. {number:02}',18,INK,'end')}
{text(34,116,title.upper(),42,CREAM,display=True)}{text(34,150,subtitle,16,'#b8beb0')}
{body}{line(34,h-34,w-34,h-34,PINK,2)}</svg>\n'''

def trace(number, bounds, classify, fill, exclusions=(), anchor=None):
    """Contour-vectorize a binary mask in original plot coordinates.

    Labels/legends are excluded before tracing. VTracer fits the visible contour,
    not a statistical curve; no interpolation of data or invented observations.
    """
    original = Image.open(OUT / f'figure-{number}.png').convert('RGB')
    crop = original.crop(bounds)
    x0,y0,_,_ = bounds
    pixels = []
    for index, pixel in enumerate(crop.get_flattened_data()):
        x = index % crop.width + x0
        y = index // crop.width + y0
        excluded = any(a <= x < c and b <= y < d for a,b,c,d in exclusions)
        pixels.append(0 if not excluded and classify(*pixel) else 255)
    mask = Image.new('L', crop.size)
    mask.putdata(pixels)
    if anchor:
        core = Image.new('L',crop.size)
        core.putdata([255 if max(abs(a-b) for a,b in zip(pixel,anchor)) < 3 else 0 for pixel in crop.get_flattened_data()])
        # Gray anti-alias pixels also occur along the darker series. Keep only
        # pixels neighboring the actual gray-series color, not those edge fringes.
        mask = ImageOps.invert(ImageChops.darker(ImageOps.invert(mask),core.filter(ImageFilter.MaxFilter(5))))
    with TemporaryDirectory() as directory:
        source = Path(directory) / 'mask.png'
        target = Path(directory) / 'trace.svg'
        mask.save(source)
        vtracer.convert_image_to_svg_py(str(source),str(target),colormode='binary',mode='spline',filter_speckle=0,
            corner_threshold=60,length_threshold=0.5,max_iterations=10,splice_threshold=45,path_precision=3)
        svg = ET.parse(target).getroot()
        paths = ''.join(ET.tostring(node,encoding='unicode').replace('ns0:','').replace(':ns0','') for node in svg if node.tag.endswith('path'))
        paths = re.sub(r'fill="[^"]+"', f'fill="{fill}"', paths)
    # Independently rasterize the new paths at source resolution and compare
    # graphical masks with a one-source-pixel contour tolerance. This bounds
    # tracing error without pretending these are the raw observations.
    black_paths = re.sub(r'fill="[^"]+"', 'fill="#000000"', paths)
    probe = f'<svg xmlns="http://www.w3.org/2000/svg" width="{crop.width}" height="{crop.height}">{black_paths}</svg>'
    rendered = Image.open(BytesIO(resvg_py.svg_to_bytes(svg_string=probe,background='#ffffff',skip_system_fonts=True))).convert('L')
    actual = rendered.point(lambda v: 255 if v < 128 else 0)
    expected = ImageOps.invert(mask)
    count = lambda im: ImageStat.Stat(im).sum[0] / 255
    missed = count(ImageChops.subtract(expected,actual.filter(ImageFilter.MaxFilter(3))))
    extra = count(ImageChops.subtract(actual,expected.filter(ImageFilter.MaxFilter(3))))
    recall = 1 - missed / count(expected)
    precision = 1 - extra / count(actual)
    if recall < .99 or precision < .98:
        raise ValueError(f'Figure {number} {fill}: contour mismatch recall={recall:.4f}, precision={precision:.4f}')
    traces.append({'figure':number,'bounds':list(bounds),'maskSha256':sha(mask.tobytes()),'paths':paths.count('<path'),'color':fill,
                   'sourceRecallWithin1px':round(recall,6),'vectorPrecisionWithin1px':round(precision,6)})
    return paths

def group_plot(paths,bounds,x,y,w,h):
    a,b,c,d = bounds
    return f'<g transform="translate({x} {y}) scale({w/(c-a)} {h/(d-b)})">{paths}</g>'

cyan = lambda r,g,b: g-r > 30 and b-r > 30 and r < 170
neutral = lambda r,g,b: max(r,g,b)-min(r,g,b) < 3 and r < 220
figures = []
pending_assets = {}

def save(number,w,h,title,subtitle,body,method,extra=None):
    source = originals[number-1]
    assert sha((ROOT / f'public{source["src"]}').read_bytes()) == source['sha256']
    svg = frame(number,w,h,title,subtitle,body)
    filename = f'figure-{number}-portfolio.svg'
    pending_assets[filename] = svg
    figures.append({'number':number,'src':f'/media/research/jev/{filename}','width':w,'height':h,
        'sha256':sha(svg.encode()),'sourceSha256':source['sha256'],'mode':method,**(extra or {})})

# 1. The published flow, rebuilt entirely as editable shapes and text.
b = ''
boxes = [(35,245,235,160,CREAM),(320,200,300,205,ACID),(320,440,300,110,VIOLET),(680,200,330,350,INK),
         (1070,200,330,100,CREAM),(1070,325,330,100,VIOLET),(1070,450,330,100,CREAM)]
for x,y,w,h,c in boxes: b += rect(x,y,w,h,c,CREAM if c==INK else None)
for coords in [(270,325,307,325),(620,305,667,305),(620,495,667,495),(470,405,470,440),
               (1010,250,1057,250),(1010,375,1057,375),(1010,500,1057,500)]:
    b += line(*coords,CREAM,2)
    x,y=coords[2:]
    if coords[0]!=x: b+=f'<path d="M{x},{y} l-9,-6 v12 Z" fill="{CREAM}"/>'
for x,y,label,size,color,display in [
    (152,287,'Postulación',34,INK,True),(152,327,'CV o transcripción',17,INK,False),(152,359,'sin datos personales',16,INK,False),
    (470,245,'JEV (TypeSafe)',36,INK,True),(470,288,'noul: P(afirmación) ∈ [0,1]',16,INK,False),
    (470,325,'choice: opción + confianza',16,INK,False),(470,369,'una pregunta por requisito',16,INK,False),
    (470,480,'Código determinístico',30,INK,True),(470,518,'meses de experiencia · estudios',15,INK,False),
    (845,245,'Política explícita',34,CREAM,True),(845,290,'p > t+ en todo lo obligatorio',16,CREAM,False),(845,323,'→ invitar',19,ACID,False),
    (845,374,'p < t− en algo obligatorio',16,CREAM,False),(845,407,'→ rechazar',19,PINK,False),(845,458,'si no',18,CREAM,False),(845,498,'→ revisión humana',19,VIOLET,False),
    (1235,260,'Invitar a entrevista IA',33,INK,True),(1235,385,'Revisión de talent',33,INK,True),(1235,510,'Rechazar',33,INK,True)]:
    b += text(x,y,label,size,color,'middle',display)
save(1,1440,620,'Sistema y política','Modelo → política explícita → revisión humana',b,'native-workflow')

# 2. Preserve the published bar boundaries; do not infer exact counts from pixels.
b = ''
im=Image.open(OUT/'figure-2.png').convert('RGB')
panels=[(230,505,'Positivos claros',38),(560,835,'Negativos claros',296),(889,1163,'Dudosos',128),(1218,1492,'Desacuerdo',34)]
segments=[]
colors=[ACID,VIOLET,'#6b7467']
for i,(a,z,title,n) in enumerate(panels):
    x=240+i*285; w=235
    b+=text(x,207,title,30,CREAM,display=True)+text(x,235,f'n = {n}',17,'#b8beb0')
    for row,y in enumerate([120,225,330]):
        cats=[0 if sum(im.getpixel((p,y)))/3<80 else 1 if sum(im.getpixel((p,y)))/3<220 else 2 for p in range(a,z)]
        cats[0] = cats[1]  # Ignore the overlaid axis stroke, not a bar category.
        start=0
        for end in range(1,len(cats)+1):
            if end==len(cats) or cats[end]!=cats[start]:
                b+=rect(x+start/(z-a)*w,270+row*90,(end-start)/(z-a)*w,52,colors[cats[start]])
                segments.append({'panel':i,'row':row,'category':cats[start],'startPixel':start,'endPixel':end,'sourceWidth':z-a})
                start=end
    b+=line(x,510,x+w,510)
    for f,t in [(0,'0'),(.5,'50%'),(1,'100%')]:
        b+=line(x+f*w,510,x+f*w,520,CREAM)+text(x+f*w,549,t,18,CREAM,'middle')
for row,label in enumerate(['JEV','Claude Haiku 4.5','GPT-5.4-mini']): b+=text(215,304+row*90,label,18,CREAM,'end')
for i,label in enumerate(['Invitar','Revisar','Rechazar']):
    b+=rect(420+i*220,590,24,20,colors[i])+text(455+i*220,607,label,19)
save(2,1440,665,'Decisiones por estrato','Política original · R1 · 496 postulaciones',b,'published-bar-boundaries',{'barSegments':segments})

# 3. Vector contours of published points/medians; axes and typography rebuilt.
b=''
bounds3=[(172,80,532,480),(606,80,966,480),(1039,80,1399,480)]
ticks3=[[(186,'0,01'),(248,'0,05'),(327,'0,3'),(391,'0,7'),(532,'0,99')],
        [(649,'0,01'),(698,'0,05'),(760,'0,3'),(810,'0,7'),(922,'0,99')],
        [(1054,'0,01'),(1108,'0,05'),(1176,'0,3'),(1231,'0,7'),(1353,'0,99')]]
for i,bounds in enumerate(bounds3):
    x=190+i*420; y=205; w=350; h=380
    b+=text(x+w/2,187,['JEV','Claude Haiku 4.5','GPT-5.4-mini'][i],34,ACID if i==0 else CREAM,'middle',True)
    paths=trace(3,bounds,neutral,CREAM)
    if i==0: paths=trace(3,bounds,cyan,ACID)+paths
    # Preserve exact threshold pixel positions from each published panel.
    for col,dash in [(1,'8 5'),(2,None),(3,'2 5')]:
        sx=ticks3[i][col][0]; xx=x+(sx-bounds[0])/(bounds[2]-bounds[0])*w
        b+=line(xx,y,xx,y+h,GRID,2,dash)
    b+=group_plot(paths,bounds,x,y,w,h)+line(x,y,x,y+h)+line(x,y+h,x+w,y+h)
    for t,(sx,label) in enumerate(ticks3[i]):
        xx=x+(sx-bounds[0])/(bounds[2]-bounds[0])*w
        b+=line(xx,y+h,xx,y+h+8,CREAM)+text(xx,y+h+32+(t%2)*24,label,17,CREAM,'middle')
    b+=text(x+w/2,676,'Probabilidad R1 · escala logit',17,CREAM,'middle')
for sy,label in [(133,'Invitar'),(282,'Revisar'),(430,'Descartar')]: b+=text(166,205+(sy-80)/400*380+6,label,19,CREAM,'end')
b+=text(34,724,'Umbrales: continuo 0,3 · discontinuo 0,05 · punteado 0,7. Barra crema: mediana.',17,'#b8beb0')
save(3,1440,780,'Probabilidades y referencia humana','Puntos y medianas vectorizados de la figura publicada; sin recalcular datos.',b,'traced-published-marks')

# 4. Published operating-curve geometry; native axes, legend and annotations.
b=''; bounds=(135,37,918,561); x,y,w,h=205,225,1174.5,786
exclude=[(630,52,917,176),(190,199,240,229),(250,264,297,293),(170,300,216,327),
         (393,394,449,422),(352,516,409,542),(492,516,546,542)]
series=[('JEV',ACID,cyan),('Claude Haiku 4.5',CREAM,lambda r,g,b:r<100 and max(r,g,b)-min(r,g,b)<35),
        ('GPT-5.4-mini',VIOLET,lambda r,g,b:120<r<195 and max(r,g,b)-min(r,g,b)<35)]
for t in [0,20,40,60,80,100]:
    yy=y+((550-(t/100)*514)-37)/524*h
    b+=line(x,yy,x+w,yy)+text(x-20,yy+7,t,23,CREAM,'end')
for i,(label,c,predicate) in enumerate(series):
    b+=line(220+i*390,191,264+i*390,191,c,4)+text(278+i*390,198,label,19,c)
    b+=group_plot(trace(4,bounds,predicate,c,exclude,anchor=(154,158,165) if c==VIOLET else None),bounds,x,y,w,h)
b+=line(x,y,x,y+h)+line(x,y+h,x+w,y+h)
for t in [0,100,200,300,400]:
    xx=x+(134+t*1.579-135)/783*w
    b+=text(xx,y+h+35,t,22,CREAM,'middle')
for sx,sy,label,c in [(197,223,'0,3',ACID),(258,285,'0,3',CREAM),(178,320,'0,3',VIOLET),
                      (400,416,'0,05',CREAM),(361,537,'0,05',ACID),(500,537,'0,05',VIOLET)]:
    b+=text(x+(sx-135)/783*w,y+(sy-37)/524*h,label,19,c)
b+=text(x+w/2,1086,'CVs derivados a revisión humana (de 496)',23,CREAM,'middle')
b+=f'<g transform="translate(48 630) rotate(-90)">{text(0,0,"Invitables rechazados (%, estimado)",23,CREAM,"middle")}</g>'
save(4,1440,1150,'Revisión y riesgo de rechazo','Curvas publicadas vectorizadas · t+ = 0,7 fijo · etiquetas: t−',b,'traced-published-marks')

# 5. Exact published cell counts, not image contours.
matrices=[[[97,11,0],[27,77,1],[0,3,4]],[[104,4,0],[52,51,2],[0,1,6]],[[95,13,0],[57,45,3],[0,0,7]],[[103,5,0],[83,10,12],[1,0,6]]]
b=''
for i,rows in enumerate(matrices):
    x=180+i*310; y=240; cell=88
    b+=text(x+132,201,['JEV','Claude Haiku 4.5','GPT-5.4-mini','Evaluador histórico'][i],30,ACID if i==0 else CREAM,'middle',True)
    for r,row in enumerate(rows):
        total=sum(row)
        for c,value in enumerate(row):
            base=tuple(int((ACID if i==0 else VIOLET)[j:j+2],16) for j in (1,3,5))
            factor=value/total
            fill='#'+''.join(f'{round(8+(channel-8)*factor):02x}' for channel in base)
            b+=rect(x+c*cell,y+r*cell,cell-2,cell-2,fill)
            b+=text(x+c*cell+43,y+r*cell+54,value,26,INK if factor>.53 else CREAM,'middle')
    for col,label in enumerate(['Sí','Parcial','No']): b+=text(x+col*cell+43,540,label,18,CREAM,'middle')
for row,label in enumerate(['Sí','Parcial','No']): b+=text(156,294+row*88,label,20,CREAM,'end')
b+=text(790,597,'Predicción del sistema',22,CREAM,'middle')
b+=f'<g transform="translate(48 370) rotate(-90)">{text(0,0,"Referencia",22,CREAM,"middle")}</g>'
b+=text(180,644,'Color: proporción por fila. Conteos originales: 108 sí · 105 parcial · 7 no.',17,'#b8beb0')
save(5,1440,710,'Matrices de confusión','Mayoría del panel · 220 preguntas de 48 entrevistas',b,'native-published-counts',{'matrices':matrices})

# 6. All marks and connectors retain published coordinates; no CI estimation.
b=''; bounds=(328,23,1282,565); x,y,w,h=400,205,960,545
styles=[(ACID,cyan),(CREAM,lambda r,g,b:r<100 and max(r,g,b)-min(r,g,b)<35),
        (VIOLET,lambda r,g,b:100<=r<185 and max(r,g,b)-min(r,g,b)<35),
        (PINK,lambda r,g,b:185<=r<211 and max(r,g,b)-min(r,g,b)<25)]
for value in range(40,101,10):
    xx=x+(327+(value-40)/60*955-328)/954*w
    b+=line(xx,y,xx,y+h)
connectors=[]
im6=Image.open(OUT/'figure-6.png').convert('RGB')
for sy in [47,117,188,258,328,398,468,539]:
    candidates=[(yy,[sx for sx in range(328,1282) if im6.getpixel((sx,yy))==(213,215,219)]) for yy in range(sy-2,sy+3)]
    sy,columns=max(candidates,key=lambda row:len(row[1]))
    if not columns: raise ValueError('Published connector not found')
    a,z=min(columns),max(columns)
    connectors.append({'sourceY':sy,'sourceStartX':a,'sourceEndX':z})
    yy=y+(sy-23)/542*h
    b+=line(x+(a-328)/954*w,yy,x+(z-328)/954*w,yy,GRID,2)
for color,predicate in reversed(styles):
    core={CREAM:(43,47,54),VIOLET:(154,158,165),PINK:(200,203,208)}.get(color)
    b+=group_plot(trace(6,bounds,predicate,color,anchor=core),bounds,x,y,w,h)
labels=['mayoría de 3 (n=220)','unanimidad (n=142)','sin Opus (n=153)','sin Sonnet (n=168)','sin GPT-5.5 (n=183)',
        'solo Opus (n=221)','solo Sonnet (n=221)','solo GPT-5.5 (n=221)']
for sy,label in zip([47,117,188,258,328,398,468,539],labels): b+=text(x-26,y+(sy-23)/542*h+7,label,20,CREAM,'end')
for value in range(40,101,10): b+=text(x+(327+(value-40)/60*955-328)/954*w,y+h+38,value,22,CREAM,'middle')
b+=text(x+w/2,826,'Acuerdo con la referencia (%)',23,CREAM,'middle')
for i,(label,c) in enumerate([('JEV',ACID),('Claude Haiku 4.5',CREAM),('GPT-5.4-mini',VIOLET),('Evaluador histórico',PINK)]):
    xx=130+i*325
    b+=rect(xx,885,17,17,c)+text(xx+30,900,label,18,c)
save(6,1440,968,'Sensibilidad a la referencia','Ocho definiciones · posiciones y conectores de la figura publicada.',b,'traced-published-marks',{'connectors':connectors})

# 7. The published risk curve is traced; baseline 19.1% is stated in the paper.
b=''; bounds=(124,36,738,493); x,y,w,h=170,215,1190,885.73
for value in range(0,31,5):
    yy=y+(493-value/30*458-36)/457*h
    b+=line(x,yy,x+w,yy)+text(x-22,yy+7,value,24,CREAM,'end')
baseline=y+(202-36)/457*h
b+=line(x,baseline,x+w,baseline,VIOLET,3,'12 8')
b+=group_plot(trace(7,bounds,cyan,ACID,[(138,50,660,125)]),bounds,x,y,w,h)
b+=line(x,y,x,y+h)+line(x,y+h,x+w,y+h)
for value in [0,20,40,60,80,100]:
    xx=x+(149+value*5.62-124)/614*w
    b+=text(xx,y+h+40,value,24,CREAM,'middle')
b+=line(170,185,215,185,ACID,4)+text(230,192,'JEV (ordenado por confianza)',19,ACID)
b+=line(760,185,805,185,VIOLET,3,'8 4')+text(820,192,'Sin ordenar (abstención al azar)',18,VIOLET)
b+=text(x+w/2,1188,'Cobertura (% de preguntas decididas)',24,CREAM,'middle')
b+=f'<g transform="translate(45 660) rotate(-90)">{text(0,0,"Error sobre lo decidido (%)",24,CREAM,"middle")}</g>'
save(7,1440,1250,'Riesgo y cobertura','Curva publicada vectorizada · referencia al azar: 19,1 %',b,'traced-published-marks')

manifest={'version':2,'fonts':['Barlow Condensed Black','IBM Plex Mono Regular'],'rasterEmbedded':False,
          'provenance':'Native workflow/counts; other marks traced from published PNGs. Raw observations unavailable; no statistics recalculated.',
          'figures':figures,'traces':traces}
for filename,svg in pending_assets.items():
    (OUT/filename).write_text(svg,encoding='utf-8',newline='\n')
(ROOT/'src/content/jev-figure-style.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f'Built {len(figures)} vector figures; {len(traces)} traced layers; no embedded raster images.')
