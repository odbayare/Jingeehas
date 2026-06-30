import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const outDir = join(repoRoot, "audits", "sprint-35C-locked-grid-prototype");
const outputPdf = join(outDir, "report-1-locked-grid-prototype.pdf");
const debugPdf = join(outDir, "report-1-grid-debug.pdf");
const tempPy = join(tmpdir(), "weight-test-locked-grid-prototype.py");

mkdirSync(outDir, { recursive: true });

const py = String.raw`
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUT = r"${outputPdf}"
DEBUG_OUT = r"${debugPdf}"

PAGE_W = 595
PAGE_H = 842
SPINE_W = 32
MARGIN_L = 64
MARGIN_R = 42
MARGIN_T = 42
MARGIN_B = 42
CONTENT_X = MARGIN_L
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R
GUTTER = 14
COLS = 6
COL_W = (CONTENT_W - GUTTER * 5) / 6
BASELINE = 8
CARD_RADIUS = 12
CARD_PAD = 14

BG = colors.HexColor("#F7F2E8")
INK = colors.HexColor("#20332B")
MUTED = colors.HexColor("#667269")
GREEN = colors.HexColor("#173B2E")
GREEN_2 = colors.HexColor("#235544")
GREEN_SOFT = colors.HexColor("#DCE8DE")
GREEN_PALE = colors.HexColor("#EDF4EE")
GOLD = colors.HexColor("#B9925B")
GOLD_SOFT = colors.HexColor("#E9DCC4")
CARD = colors.HexColor("#FFFDF7")
LINE = colors.HexColor("#D7CBB8")
WHITE = colors.HexColor("#FFFFFF")

font_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
try:
    pdfmetrics.registerFont(TTFont("MongolianFont", font_path))
    FONT = "MongolianFont"
except Exception:
    FONT = "Helvetica"

def gridX(col):
    return CONTENT_X + col * (COL_W + GUTTER)

def gridW(span):
    return COL_W * span + GUTTER * (span - 1)

def yTop(y, h):
    return PAGE_H - y - h

def style(size=10.5, leading=14, color=INK, align=TA_LEFT):
    return ParagraphStyle("s", fontName=FONT, fontSize=size, leading=leading, textColor=color, alignment=align)

def esc(text):
    return str(text or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def para(c, text, x, y, w, h, size=10.5, leading=14, color=INK, align=TA_LEFT):
    p = Paragraph(esc(text).replace("\n", "<br/>"), style(size, leading, color, align))
    p.wrapOn(c, w, h)
    p.drawOn(c, x, yTop(y, h) + h - p.height)
    return p.height

def drawRounded(c, x, y, w, h, fill=CARD, stroke=LINE, radius=CARD_RADIUS, width=0.8):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(width)
    c.roundRect(x, yTop(y, h), w, h, radius, fill=1, stroke=1)

def drawSpine(c):
    c.setFillColor(GREEN)
    c.rect(0, 0, SPINE_W, PAGE_H, fill=1, stroke=0)

def drawPageFrame(c, pageNumber, reportTitle, sectionName, debug=False):
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    drawSpine(c)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(CONTENT_X, MARGIN_B, PAGE_W - MARGIN_R, MARGIN_B)
    c.setFont(FONT, 8)
    c.setFillColor(MUTED)
    c.drawString(CONTENT_X, MARGIN_B - 18, "Жин хасалтын гүн зураглал")
    c.drawRightString(PAGE_W - MARGIN_R, MARGIN_B - 18, f"Хуудас {pageNumber}")
    if pageNumber > 1:
        c.setFillColor(GOLD)
        c.setFont(FONT, 8.5)
        c.drawString(CONTENT_X, PAGE_H - MARGIN_T - 8, "Жин хасалтын гүн зураглал")
        para(c, reportTitle, CONTENT_X, MARGIN_T + 22, CONTENT_W, 54, 26, 31, GREEN)
        c.setFont(FONT, 10)
        c.setFillColor(MUTED)
        c.drawString(CONTENT_X, PAGE_H - 112, sectionName)
    if debug:
        drawGrid(c)

def drawGrid(c):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#A9BBAF"))
    c.setLineWidth(0.25)
    for i in range(COLS):
        x = gridX(i)
        c.rect(x, MARGIN_B, COL_W, PAGE_H - MARGIN_T - MARGIN_B, fill=0, stroke=1)
    c.setStrokeColor(colors.HexColor("#E1CDAA"))
    y = MARGIN_B
    while y <= PAGE_H - MARGIN_T:
        c.line(CONTENT_X, y, PAGE_W - MARGIN_R, y)
        y += BASELINE
    c.restoreState()

def drawCard(c, x, y, w, h, title, body, options=None):
    options = options or {}
    fill = options.get("fill", CARD)
    title_color = options.get("titleColor", GREEN_2)
    body_color = options.get("bodyColor", INK)
    accent = options.get("accent", False)
    drawRounded(c, x, y, w, h, fill=fill, stroke=LINE)
    if accent:
        c.setFillColor(GREEN_2)
        c.roundRect(x, yTop(y, h), 5, h, 2.5, fill=1, stroke=0)
    para(c, title, x + CARD_PAD, y + CARD_PAD, w - CARD_PAD * 2, 20, 11.5, 14, title_color)
    if isinstance(body, list):
        text = "\n".join([f"• {item}" for item in body])
    else:
        text = body
    para(c, text, x + CARD_PAD, y + CARD_PAD + 28, w - CARD_PAD * 2, h - CARD_PAD * 2 - 24, options.get("bodySize", 10.5), options.get("leading", 14.2), body_color)

def drawMetaChip(c, x, y, w, h, label, value):
    drawRounded(c, x, y, w, h, fill=GREEN_PALE, stroke=LINE, radius=10)
    para(c, label, x + 11, y + 10, w - 22, 14, 8.2, 10, GOLD)
    para(c, value, x + 11, y + 27, w - 22, h - 34, 9.2, 11.5, INK)

def drawHeroTitleBlock(c):
    x = gridX(0)
    y = 42
    w = gridW(4)
    h = 148
    c.setFillColor(GREEN)
    c.roundRect(x, yTop(y, h), w, h, CARD_RADIUS, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(x + 16, yTop(y, h) + 18, 5, h - 36, fill=1, stroke=0)
    para(c, "Жин хасалтын гүн зураглал", x + 32, y + 22, w - 50, 38, 29, 34, WHITE)
    para(c, "Тайлан 1 — Шөнийн ээлжийн сувилагч", x + 32, y + 86, w - 50, 28, 16.5, 20, colors.HexColor("#F5EEE1"))
    para(c, "Хувийн зан төлөвийн гүн тайлан", x + 32, y + 122, w - 50, 18, 9.2, 11, colors.HexColor("#DDE7DD"))

def drawQuoteCard(c, x, y, w, h, quote):
    drawRounded(c, x, y, w, h, fill=GREEN, stroke=GREEN)
    para(c, "Гол санаа", x + CARD_PAD, y + CARD_PAD, w - CARD_PAD * 2, 18, 9, 11, GOLD_SOFT)
    para(c, "“" + quote + "”", x + CARD_PAD, y + 42, w - CARD_PAD * 2, h - 56, 12.2, 16, WHITE)

def drawTwoColumnCards(c, y, h, leftTitle, leftBody, rightTitle, rightBody):
    drawCard(c, gridX(0), y, gridW(3), h, leftTitle, leftBody, {"accent": True})
    drawCard(c, gridX(3), y, gridW(3), h, rightTitle, rightBody, {"accent": True})

def drawNumberedRows(c, y, steps):
    marker_x = gridX(0) + 24
    card_x = gridX(1)
    card_w = gridW(5)
    card_h = 50
    gap = 14
    line_top = y + 22
    line_bottom = y + (card_h + gap) * (len(steps) - 1) + 25
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.line(marker_x, yTop(line_top, line_bottom - line_top), marker_x, PAGE_H - line_top)
    for i, step in enumerate(steps, start=1):
        sy = y + (i - 1) * (card_h + gap)
        c.setFillColor(GREEN)
        c.circle(marker_x, PAGE_H - sy - card_h / 2, 15, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(FONT, 12)
        c.drawCentredString(marker_x, PAGE_H - sy - card_h / 2 - 4, str(i))
        drawRounded(c, card_x, sy, card_w, card_h, fill=CARD, stroke=LINE, radius=11)
        para(c, step, card_x + CARD_PAD, sy + 15, card_w - CARD_PAD * 2, 24, 10.8, 14, INK)

def drawFlowDiagram(c):
    steps = [
        "Шөнийн ээлж эхэлнэ",
        "Унтах цаг, хоолны цаг хоёр зэрэг солигдоно",
        "Ээлжийн дараа бие, толгой хоёр суларна",
        "Цайны газар, ойр дэлгүүр эсвэл бэлэн хоол хамгийн амар санагдана",
        "Давслаг эсвэл амттай зүйл тэнхээ өгөх шиг болно",
        "Дараа нь хоолны хэмнэл дахин сарнина",
        "Дараагийн ээлжинд бэлэн сонголт байхгүй бол тойрог буцаж ирнэ",
    ]
    drawNumberedRows(c, 136, steps)
    drawCard(c, gridX(0), 624, gridW(6), 78, "Дахин эргэх цэг", "Дараагийн ээлжинд бэлэн сонголт байхгүй үед энэ тойрог буцаж ирдэг.", {"fill": GREEN_SOFT})

def drawPlanTimeline(c):
    steps = [
        ("Эхний 3 өдөр", "ээлж, унтсан цаг, ээлжийн дараах өлсөлтөө тэмдэглэ."),
        ("4-10 дахь өдөр", "ээлжийн өмнө эсвэл дараа идэх нэг бодит хоолоо бэлд. Болохгүй өдөр ойр дэлгүүрээс авах нөөц сонголтоо урьдчилж сонго."),
        ("11-14 дэх өдөр", "бэлэн сонголттой өдөр давслаг/амттай зүйл рүү татах хүч өөрчлөгдсөн эсэхийг анзаар."),
        ("Хэрвээ нэг өдөр алгасвал", "дараагийн ээлжийн дараа хатуу барих биш, нэг төлөвлөсөн хоол болон нөөц сонголт руугаа буц."),
    ]
    marker_x = gridX(0) + 24
    card_x = gridX(1)
    card_w = gridW(5)
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.line(marker_x, PAGE_H - 338, marker_x, PAGE_H - 664)
    for i, (title, body) in enumerate(steps, start=1):
        sy = 300 + (i - 1) * 86
        c.setFillColor(GREEN if i < 4 else GOLD)
        c.circle(marker_x, PAGE_H - sy - 34, 16, fill=1, stroke=0)
        c.setFillColor(WHITE if i < 4 else INK)
        c.setFont(FONT, 12)
        c.drawCentredString(marker_x, PAGE_H - sy - 38, str(i))
        drawRounded(c, card_x, sy, card_w, 70, fill=GREEN_SOFT if i == 4 else CARD, stroke=LINE, radius=11)
        para(c, title, card_x + CARD_PAD, sy + 11, card_w - CARD_PAD * 2, 18, 12, 14, GREEN)
        para(c, body, card_x + CARD_PAD, sy + 34, card_w - CARD_PAD * 2, 30, 9.6, 12.5, INK)

def drawPromptCards(c):
    y = 232
    h = 236
    cards = [
        ("1", "Ажиглах асуулт", "Шөнийн ээлжийн дараах өлсөлт, ядаргаа ямар үед хүчтэй байна вэ?"),
        ("2", "Ажиглах асуулт", "Цайны газар, ойр дэлгүүр, бэлэн хоол аль нь хамгийн их татаж байна вэ?"),
    ]
    for col, (num, label, body) in zip([0, 3], cards):
        x = gridX(col)
        w = gridW(3)
        drawRounded(c, x, y, w, h, fill=CARD, stroke=LINE)
        c.setFillColor(GREEN)
        c.setFont(FONT, 34)
        c.drawString(x + CARD_PAD, PAGE_H - y - 56, num)
        para(c, label, x + CARD_PAD, y + 74, w - CARD_PAD * 2, 16, 9, 11, GOLD)
        para(c, body, x + CARD_PAD, y + 102, w - CARD_PAD * 2, 74, 12, 16, INK)

def drawProfessionalSafetyCard(c, x, y, w, h, title, body):
    drawCard(c, x, y, w, h, title, body, {"fill": GREEN_SOFT, "accent": True})

def drawTitle(c, section):
    para(c, section, CONTENT_X, 96, CONTENT_W, 36, 18, 22, GREEN)

def page1(c, debug=False):
    drawPageFrame(c, 1, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Гол зураглал", debug)
    drawHeroTitleBlock(c)
    chip_x = gridX(4)
    chip_w = gridW(2)
    drawMetaChip(c, chip_x, 42, chip_w, 42, "Тайлан", "1")
    drawMetaChip(c, chip_x, 95, chip_w, 42, "Профайл", "Шөнийн ээлжийн сувилагч")
    drawMetaChip(c, chip_x, 148, chip_w, 42, "Зорилго", "Гол тойргоо ойлгох")
    drawCard(c, gridX(0), 222, gridW(4), 156, "Товч хариу", "Шөнийн ээлжийн дараа унтах цаг, хоолны цаг хоёр зэрэг солигддог. Тэр үед давслаг, амттай, бэлэн хоол илүү хүчтэй татдаг.", {"fill": GREEN_SOFT, "bodySize": 12, "leading": 16})
    drawQuoteCard(c, gridX(4), 222, gridW(2), 156, "Ээлжийн дараа суларсан үед хоол амсхийх, тэнхээ авах хамгийн ойрын арга болж байна.")
    drawTwoColumnCards(c, 406, 118, "Ил харагдаж байгаа зүйл", "Шөнийн ээлж таны хоол, нойрны цагийг бодитоор хөдөлгөж байна.", "Цаана нь ажиллаж байгаа зүйл", "Ээлжийн дараа суларсан үед хоол амсхийх, тэнхээ авах хамгийн ойрын арга болж байна.")
    drawCard(c, gridX(0), 552, gridW(6), 100, "Эхлээд хийх нэг жижиг зүйл", "Ээлжийн дараах өлсөлтөөс өмнө нэг төлөвлөсөн хоол, ойр дэлгүүрийн нэг нөөц сонголт бэлд.", {"fill": CARD, "accent": True, "bodySize": 12, "leading": 16})

def page2(c, debug=False):
    drawPageFrame(c, 2, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Далд сэтгэлзүйн механизм", debug)
    drawCard(c, gridX(0), 138, gridW(6), 180, "Гол зураг", "Шөнийн ээлжийн дараа унтах цаг, хоолны цаг хоёр зэрэг солигддог.\n\nЭэлжийн дараах ядаргаа дээр эмнэлгийн цайны газар, ойр дэлгүүр, бэлэн хоол илүү амар харагдана.\n\nТэр үед давслаг, амттай, хурдан зүйл зүгээр нэг дуршил биш, тэнхээ оруулах ойрын арга шиг санагдаж болно.", {"fill": GREEN_SOFT, "bodySize": 11, "leading": 15})
    drawTwoColumnCards(c, 344, 156, "Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?", "Ээлжийн дараа хоол хурдан амсхийх мэдрэмж өгч байна.\n\n• Ээлжийн дараа хурдан тэнхээ авах\n• Солигдсон унтах цагийн дараах ядаргааг намдаах\n• Өөрийгөө жаахан шагнах", "Яагаад ингэж хэлж байна вэ?", "Та шөнийн ээлж, унтах цаг солигдох, ээлжийн дараах ядаргаа, хурдан тэнхээ өгөх мэт санагдах амттай зүйл давхцдаг гэж тэмдэглэсэн.")
    drawCard(c, gridX(0), 536, gridW(6), 116, "Гол буруу ойлголт", "Гол нь зөвхөн нойр муудсандаа биш. Ээлжийн дараах ядаргаа дээр бэлэн хоол хамгийн амар зам болж байна.", {"fill": CARD, "accent": True, "bodySize": 12, "leading": 16})

def page3(c, debug=False):
    drawPageFrame(c, 3, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Давтагддаг тойрог", debug)
    drawFlowDiagram(c)

def page4(c, debug=False):
    drawPageFrame(c, 4, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Эхний 14 хоногийн туршилт", debug)
    drawCard(c, gridX(0), 138, gridW(3), 132, "Одоохондоо хэт яарахгүй зүйлс", ["Шөнийн ээлжийн дараа хатуу хязгаарлалт эхлүүлэх", "Ээлжийн дараах өлсөлтийг зөвхөн сахилга бат гэж тайлбарлах", "Ойр дэлгүүрийг цорын ганц төлөвлөгөө болгох"], {"fill": CARD})
    drawCard(c, gridX(3), 138, gridW(3), 132, "Эхний жижиг өөрчлөлт", "Ээлжийн дараах өлсөлт эхлэхээс өмнө нэг төлөвлөсөн хоол, ойр дэлгүүрийн нэг нөөц сонголт бэлдэх.", {"fill": GREEN_SOFT, "bodySize": 11, "leading": 15})
    drawPlanTimeline(c)

def page5(c, debug=False):
    drawPageFrame(c, 5, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "7 хоногийн тэмдэглэл", debug)
    drawCard(c, gridX(0), 138, gridW(6), 76, "Энэ тэмдэглэл юу тодруулах вэ?", "Энэ тэмдэглэл нь гол тойрог яг ямар өдөр, ямар нөхцөлд хүчтэй болдгийг тодруулахад тусална.", {"fill": GREEN_SOFT, "bodySize": 11.5, "leading": 15})
    drawPromptCards(c)
    drawCard(c, gridX(0), 506, gridW(6), 116, "Дараагийн алхам", "Энэ хэсэг нь дараагийн 7 хоногийн тэмдэглэлээр илүү тодорно.", {"fill": CARD, "accent": True, "bodySize": 13, "leading": 17})

def build(path, debug=False):
    c = canvas.Canvas(path, pagesize=(PAGE_W, PAGE_H))
    pages = [page1, page2, page3, page4, page5]
    for fn in pages:
        fn(c, debug)
        c.showPage()
    c.save()

build(OUT, False)
build(DEBUG_OUT, True)
print(OUT)
print(DEBUG_OUT)
`;

writeFileSync(tempPy, py);

const pythonCandidates = [
  "/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
  "python3",
];

let result;
for (const python of pythonCandidates) {
  result = spawnSync(python, [tempPy], { stdio: "inherit" });
  if (result.status === 0) {
    process.exit(0);
  }
}

process.exit(result?.status || 1);
