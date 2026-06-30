import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);
const outDir = join(repoRoot, "audits", "sprint-35E-botanical-premium-polish");
const outputPdf = join(outDir, "report-1-botanical-premium-prototype.pdf");
const debugPdf = join(outDir, "report-1-grid-debug.pdf");
const tempPy = join(tmpdir(), "weight-test-botanical-premium-polish.py");

mkdirSync(outDir, { recursive: true });

const py = String.raw`
import os
import sys
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

BG = colors.HexColor("#F7F3EA")
INK = colors.HexColor("#1F2A27")
MUTED = colors.HexColor("#5E6D64")
GREEN = colors.HexColor("#123D32")
GREEN_2 = colors.HexColor("#1F5A46")
GREEN_SOFT = colors.HexColor("#DDE9DE")
GREEN_PALE = colors.HexColor("#EEF5ED")
GOLD = colors.HexColor("#C49A4A")
GOLD_SOFT = colors.HexColor("#E8D7B8")
CARD = colors.HexColor("#FFFDF8")
LINE = colors.HexColor("#D8C7AA")
WHITE = colors.HexColor("#FFFFFF")
DRAWN_BOXES = []
CURRENT_PAGE = 0

def first_existing(paths):
    for path in paths:
        expanded = os.path.expanduser(path)
        if os.path.exists(expanded):
            return expanded
    return None

sys.path.insert(0, "/private/tmp/fonttools35d")
try:
    from fontTools.varLib import instancer
    from fontTools.ttLib import TTFont as FontToolsTTFont
except Exception as exc:
    raise SystemExit("fontTools is required to instantiate readable Montserrat weights from the local variable font. Install with: python3 -m pip install fonttools --target /private/tmp/fonttools35d") from exc

montserrat_variable = first_existing([
    "./assets/fonts/Montserrat-VariableFont_wght.ttf",
    "~/Library/Fonts/Montserrat-VariableFont_wght.ttf",
    "/Library/Fonts/Montserrat-VariableFont_wght.ttf",
    "/System/Library/Fonts/Montserrat-VariableFont_wght.ttf",
])
montserrat_regular_static = first_existing([
    "./assets/fonts/Montserrat-Regular.ttf",
    "~/Library/Fonts/Montserrat-Regular.ttf",
    "/Library/Fonts/Montserrat-Regular.ttf",
    "/System/Library/Fonts/Montserrat-Regular.ttf",
])
if not montserrat_variable and not montserrat_regular_static:
    raise SystemExit("Montserrat font not found. Place Montserrat-VariableFont_wght.ttf or Montserrat-Regular.ttf in ~/Library/Fonts or project assets/fonts.")

def instantiate_montserrat(weight, label):
    if montserrat_variable:
        out = f"/private/tmp/weight-test-montserrat-{label}.ttf"
        font = FontToolsTTFont(os.path.expanduser(montserrat_variable))
        static_font = instancer.instantiateVariableFont(font, {"wght": weight}, inplace=False)
        readable_label = label.capitalize()
        family = "Montserrat"
        full_name = f"Montserrat {readable_label}"
        postscript = f"Montserrat-{readable_label}"
        name_table = static_font["name"]
        for platform_id, encoding_id, lang_id in [(3, 1, 0x409), (1, 0, 0)]:
            name_table.setName(family, 1, platform_id, encoding_id, lang_id)
            name_table.setName(readable_label, 2, platform_id, encoding_id, lang_id)
            name_table.setName(full_name, 4, platform_id, encoding_id, lang_id)
            name_table.setName(postscript, 6, platform_id, encoding_id, lang_id)
        static_font.save(out)
        return out
    if weight == 400 and montserrat_regular_static:
        return os.path.expanduser(montserrat_regular_static)
    raise SystemExit("Montserrat variable font is required for Medium/SemiBold/Bold weights. Place Montserrat-VariableFont_wght.ttf in ~/Library/Fonts or project assets/fonts.")

pdfmetrics.registerFont(TTFont("MontserratRegular", instantiate_montserrat(400, "regular")))
pdfmetrics.registerFont(TTFont("MontserratMedium", instantiate_montserrat(500, "medium")))
pdfmetrics.registerFont(TTFont("MontserratSemiBold", instantiate_montserrat(600, "semibold")))
pdfmetrics.registerFont(TTFont("MontserratBold", instantiate_montserrat(700, "bold")))
FONT = "MontserratRegular"
FONT_MED = "MontserratMedium"
FONT_SEMI = "MontserratSemiBold"
FONT_BOLD = "MontserratBold"

def gridX(col):
    return CONTENT_X + col * (COL_W + GUTTER)

def gridW(span):
    return COL_W * span + GUTTER * (span - 1)

def yTop(y, h):
    return PAGE_H - y - h

def style(size=10.5, leading=14, color=INK, align=TA_LEFT, font=FONT):
    return ParagraphStyle("s", fontName=font, fontSize=size, leading=leading, textColor=color, alignment=align)

def esc(text):
    return str(text or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def assert_grid_box(name, x, y, w, h):
    if x < CONTENT_X - 0.2 or x + w > PAGE_W - MARGIN_R + 0.2:
        raise ValueError(f"{name} is outside content grid: x={x}, w={w}")
    if y < MARGIN_T - 0.2 or y + h > PAGE_H - MARGIN_B + 0.2:
        raise ValueError(f"{name} is outside page safe area: y={y}, h={h}")

def reset_boxes():
    DRAWN_BOXES.clear()

def register_box(name, x, y, w, h, page_number):
    assert_grid_box(name, x, y, w, h)
    for other_name, ox, oy, ow, oh, opage in DRAWN_BOXES:
        if opage != page_number:
            continue
        overlap = not (x + w <= ox + 0.5 or ox + ow <= x + 0.5 or y + h <= oy + 0.5 or oy + oh <= y + 0.5)
        if overlap:
            raise ValueError(f"Card overlap on page {page_number}: {name} overlaps {other_name}")
    DRAWN_BOXES.append((name, x, y, w, h, page_number))

def para(c, text, x, y, w, h, size=10.5, leading=14, color=INK, align=TA_LEFT, font=FONT):
    p = Paragraph(esc(text).replace("\n", "<br/>"), style(size, leading, color, align, font))
    p.wrapOn(c, w, h)
    if p.height > h + 0.5:
        raise ValueError(f"Text overflow: '{str(text)[:48]}' needs {p.height:.1f}pt but box allows {h:.1f}pt")
    p.drawOn(c, x, yTop(y, h) + h - p.height)
    return p.height

def drawRounded(c, x, y, w, h, fill=CARD, stroke=LINE, radius=CARD_RADIUS, width=0.8, name=None):
    if name:
        register_box(name, x, y, w, h, CURRENT_PAGE)
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(width)
    c.roundRect(x, yTop(y, h), w, h, radius, fill=1, stroke=1)

def set_alpha(c, stroke=None, fill=None):
    if stroke is not None:
        try:
            c.setStrokeAlpha(stroke)
        except Exception:
            pass
    if fill is not None:
        try:
            c.setFillAlpha(fill)
        except Exception:
            pass

def reset_alpha(c):
    set_alpha(c, 1, 1)

def leaf_path(c, cx, cy, length, width, angle=0, fill=False):
    import math
    rad = math.radians(angle)
    dx = math.cos(rad)
    dy = math.sin(rad)
    px = -dy
    py = dx
    base_x = cx - dx * length / 2
    base_y = cy - dy * length / 2
    tip_x = cx + dx * length / 2
    tip_y = cy + dy * length / 2
    left_x = cx + px * width
    left_y = cy + py * width
    right_x = cx - px * width
    right_y = cy - py * width
    p = c.beginPath()
    p.moveTo(base_x, base_y)
    p.curveTo(left_x, left_y, left_x, left_y, tip_x, tip_y)
    p.curveTo(right_x, right_y, right_x, right_y, base_x, base_y)
    c.drawPath(p, fill=1 if fill else 0, stroke=1)

def drawBotanicalSpine(c):
    c.saveState()
    set_alpha(c, stroke=0.16, fill=0.04)
    c.setStrokeColor(GOLD_SOFT)
    c.setLineWidth(0.7)
    x = 16
    for y in [190, 360, 540, 710]:
        c.line(x, y - 18, x, y + 18)
        leaf_path(c, x + 4, y + 6, 30, 7, 30, False)
        leaf_path(c, x - 4, y - 8, 27, 6, -150, False)
    reset_alpha(c)
    c.restoreState()

def drawCornerBotanical(c, variant=0):
    c.saveState()
    set_alpha(c, stroke=0.035, fill=0.018)
    c.setStrokeColor(GREEN_2)
    c.setFillColor(GREEN_2)
    c.setLineWidth(1.1)
    if variant % 2 == 0:
        stem_x, stem_y = PAGE_W - 80, 120
        c.line(stem_x, stem_y, PAGE_W - 38, 270)
        leaf_path(c, PAGE_W - 76, 170, 88, 22, 64, False)
        leaf_path(c, PAGE_W - 54, 230, 106, 26, 50, False)
    else:
        stem_x, stem_y = PAGE_W - 74, PAGE_H - 290
        c.line(stem_x, stem_y, PAGE_W - 34, PAGE_H - 120)
        leaf_path(c, PAGE_W - 84, PAGE_H - 230, 96, 24, 65, False)
        leaf_path(c, PAGE_W - 52, PAGE_H - 176, 112, 28, 46, False)
    reset_alpha(c)
    c.restoreState()

def drawSpine(c):
    c.setFillColor(GREEN)
    c.rect(0, 0, SPINE_W, PAGE_H, fill=1, stroke=0)
    drawBotanicalSpine(c)

def drawPageFrame(c, pageNumber, reportTitle, sectionName, debug=False):
    global CURRENT_PAGE
    CURRENT_PAGE = pageNumber
    reset_boxes()
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    drawCornerBotanical(c, pageNumber)
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
        c.setFont(FONT_MED, 8.5)
        c.drawString(CONTENT_X, PAGE_H - MARGIN_T - 8, "Жин хасалтын гүн зураглал")
        para(c, reportTitle, CONTENT_X, MARGIN_T + 22, CONTENT_W, 50, 21.5, 26, GREEN, font=FONT_BOLD)
        para(c, sectionName, CONTENT_X, 112, CONTENT_W, 14, 10, 12, MUTED, font=FONT_MED)
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
    drawRounded(c, x, y, w, h, fill=fill, stroke=LINE, name=options.get("name", title or "card"))
    if accent:
        c.setFillColor(GREEN_2)
        c.roundRect(x, yTop(y, h), 5, h, 2.5, fill=1, stroke=0)
    title_h = options.get("titleHeight", 34)
    para(c, title, x + CARD_PAD, y + CARD_PAD, w - CARD_PAD * 2, title_h, 11.3, 14, title_color, font=FONT_SEMI)
    if isinstance(body, list):
        text = "\n".join([f"• {item}" for item in body])
    else:
        text = body
    para(c, text, x + CARD_PAD, y + CARD_PAD + title_h + 6, w - CARD_PAD * 2, h - CARD_PAD * 2 - title_h - 2, options.get("bodySize", 10.2), options.get("leading", 14.2), body_color)

def drawMetaChip(c, x, y, w, h, label, value):
    drawRounded(c, x, y, w, h, fill=GREEN_PALE, stroke=LINE, radius=10, name=f"meta-{label}")
    para(c, label, x + 11, y + 10, w - 22, 14, 8.2, 10, GOLD, font=FONT_MED)
    para(c, value, x + 11, y + 27, w - 22, h - 31, 9.2, 11.5, INK)

def drawHeroTitleBlock(c):
    x = gridX(0)
    y = 42
    w = gridW(4)
    h = 166
    c.setFillColor(GREEN)
    register_box("hero-title-block", x, y, w, h, CURRENT_PAGE)
    c.roundRect(x, yTop(y, h), w, h, CARD_RADIUS, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(x + 16, yTop(y, h) + 18, 5, h - 36, fill=1, stroke=0)
    para(c, "Жин хасалтын гүн зураглал", x + 32, y + 18, w - 50, 70, 28, 33, WHITE, font=FONT_BOLD)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.2)
    c.line(x + 32, PAGE_H - y - 148, x + 128, PAGE_H - y - 148)
    para(c, "Тайлан 1 — Шөнийн ээлжийн сувилагч", x + 32, y + 94, w - 50, 38, 15, 18, colors.HexColor("#F5EEE1"), font=FONT_MED)
    para(c, "Хувийн зан төлөвийн гүн тайлан", x + 32, y + 136, w - 50, 18, 9.2, 11, colors.HexColor("#DDE7DD"))

def drawQuoteCard(c, x, y, w, h, quote):
    drawRounded(c, x, y, w, h, fill=GOLD_SOFT, stroke=GOLD, name="quote-card")
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 38)
    c.drawString(x + CARD_PAD, PAGE_H - y - 44, "“")
    para(c, "Гол санаа", x + CARD_PAD + 30, y + CARD_PAD + 2, w - CARD_PAD * 2 - 30, 18, 9, 11, GREEN, font=FONT_MED)
    para(c, quote, x + CARD_PAD, y + 54, w - CARD_PAD * 2, h - 66, 12.2, 16, INK, font=FONT_MED)

def drawTwoColumnCards(c, y, h, leftTitle, leftBody, rightTitle, rightBody):
    drawCard(c, gridX(0), y, gridW(3), h, leftTitle, leftBody, {"accent": True})
    drawCard(c, gridX(3), y, gridW(3), h, rightTitle, rightBody, {"accent": True})

def drawNumberedRows(c, y, steps):
    marker_x = gridX(0) + 24
    card_x = gridX(1)
    card_w = gridW(5)
    card_h = 56
    gap = 10
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
        c.setFont(FONT_BOLD, 12)
        c.drawCentredString(marker_x, PAGE_H - sy - card_h / 2 - 4, str(i))
        drawRounded(c, card_x, sy, card_w, card_h, fill=CARD, stroke=LINE, radius=11, name=f"flow-step-{i}")
        para(c, step, card_x + CARD_PAD, sy + 13, card_w - CARD_PAD * 2, 34, 10.6, 13.5, INK)

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
        c.setFont(FONT_BOLD, 12)
        c.drawCentredString(marker_x, PAGE_H - sy - 38, str(i))
        drawRounded(c, card_x, sy, card_w, 70, fill=GREEN_SOFT if i == 4 else CARD, stroke=LINE, radius=11, name=f"plan-step-{i}")
        para(c, title, card_x + CARD_PAD, sy + 11, card_w - CARD_PAD * 2, 18, 12, 14, GREEN)
        para(c, body, card_x + CARD_PAD, sy + 34, card_w - CARD_PAD * 2, 30, 9.6, 12.5, INK)

def drawPromptCards(c):
    y = 258
    h = 236
    cards = [
        ("1", "Ажиглах асуулт", "Шөнийн ээлжийн дараах өлсөлт, ядаргаа ямар үед хүчтэй байна вэ?"),
        ("2", "Ажиглах асуулт", "Цайны газар, ойр дэлгүүр, бэлэн хоол аль нь хамгийн их татаж байна вэ?"),
    ]
    for col, (num, label, body) in zip([0, 3], cards):
        x = gridX(col)
        w = gridW(3)
        drawRounded(c, x, y, w, h, fill=CARD, stroke=LINE, name=f"prompt-{num}")
        c.setFillColor(GREEN)
        c.setFont(FONT_BOLD, 34)
        c.drawString(x + CARD_PAD, PAGE_H - y - 56, num)
        para(c, label, x + CARD_PAD, y + 74, w - CARD_PAD * 2, 16, 9, 11, GOLD, font=FONT_MED)
        para(c, body, x + CARD_PAD, y + 102, w - CARD_PAD * 2, 74, 12, 16, INK, font=FONT_MED)

def drawProfessionalSafetyCard(c, x, y, w, h, title, body):
    drawCard(c, x, y, w, h, title, body, {"fill": GREEN_SOFT, "accent": True})

def drawTitle(c, section):
    para(c, section, CONTENT_X, 96, CONTENT_W, 36, 18, 22, GREEN)

def page1(c, debug=False):
    drawPageFrame(c, 1, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Гол зураглал", debug)
    drawHeroTitleBlock(c)
    chip_x = gridX(4)
    chip_w = gridW(2)
    drawMetaChip(c, chip_x, 42, chip_w, 56, "Тайлан", "1")
    drawMetaChip(c, chip_x, 106, chip_w, 56, "Профайл", "Шөнийн ээлжийн сувилагч")
    drawMetaChip(c, chip_x, 170, chip_w, 56, "Зорилго", "Гол тойргоо ойлгох")
    drawCard(c, gridX(0), 238, gridW(4), 168, "Товч хариу", "Шөнийн ээлжийн дараа унтах цаг, хоолны цаг хоёр зэрэг солигддог. Тэр үед давслаг, амттай, бэлэн хоол илүү хүчтэй татдаг.", {"fill": GREEN_SOFT, "bodySize": 12, "leading": 16})
    drawQuoteCard(c, gridX(4), 238, gridW(2), 168, "Ээлжийн дараа суларсан үед хоол амсхийх, тэнхээ авах хамгийн ойрын арга болж байна.")
    drawTwoColumnCards(c, 430, 112, "Ил харагдаж байгаа зүйл", "Шөнийн ээлж таны хоол, нойрны цагийг бодитоор хөдөлгөж байна.", "Цаана нь ажиллаж байгаа зүйл", "Ээлжийн дараа суларсан үед хоол амсхийх, тэнхээ авах хамгийн ойрын арга болж байна.")
    drawCard(c, gridX(0), 570, gridW(6), 96, "Эхлээд хийх нэг жижиг зүйл", "Ээлжийн дараах өлсөлтөөс өмнө нэг төлөвлөсөн хоол, ойр дэлгүүрийн нэг нөөц сонголт бэлд.", {"fill": CARD, "accent": True, "bodySize": 12, "leading": 16})

def page2(c, debug=False):
    drawPageFrame(c, 2, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Далд сэтгэлзүйн механизм", debug)
    drawCard(c, gridX(0), 138, gridW(6), 180, "Гол зураг", "Шөнийн ээлжийн дараа унтах цаг, хоолны цаг хоёр зэрэг солигддог.\n\nЭэлжийн дараах ядаргаа дээр эмнэлгийн цайны газар, ойр дэлгүүр, бэлэн хоол илүү амар харагдана.\n\nТэр үед давслаг, амттай, хурдан зүйл зүгээр нэг дуршил биш, тэнхээ оруулах ойрын арга шиг санагдаж болно.", {"fill": GREEN_SOFT, "bodySize": 11, "leading": 15})
    drawTwoColumnCards(c, 344, 176, "Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?", "Ээлжийн дараа хоол хурдан амсхийх мэдрэмж өгч байна.\n\n• Ээлжийн дараа хурдан тэнхээ авах\n• Солигдсон унтах цагийн дараах ядаргааг намдаах\n• Өөрийгөө жаахан шагнах", "Яагаад ингэж хэлж байна вэ?", "Та шөнийн ээлж, унтах цаг солигдох, ээлжийн дараах ядаргаа, хурдан тэнхээ өгөх мэт санагдах амттай зүйл давхцдаг гэж тэмдэглэсэн.")
    drawCard(c, gridX(0), 552, gridW(6), 116, "Гол буруу ойлголт", "Гол нь зөвхөн нойр муудсандаа биш. Ээлжийн дараах ядаргаа дээр бэлэн хоол хамгийн амар зам болж байна.", {"fill": CARD, "accent": True, "bodySize": 12, "leading": 16})

def page3(c, debug=False):
    drawPageFrame(c, 3, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Давтагддаг тойрог", debug)
    drawFlowDiagram(c)

def page4(c, debug=False):
    drawPageFrame(c, 4, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "Эхний 14 хоногийн туршилт", debug)
    drawCard(c, gridX(0), 138, gridW(3), 156, "Одоохондоо хэт яарахгүй зүйлс", ["Шөнийн ээлжийн дараа хатуу хязгаарлалт эхлүүлэх", "Ээлжийн дараах өлсөлтийг зөвхөн сахилга бат гэж тайлбарлах", "Ойр дэлгүүрийг цорын ганц төлөвлөгөө болгох"], {"fill": CARD})
    drawCard(c, gridX(3), 138, gridW(3), 156, "Эхний жижиг өөрчлөлт", "Ээлжийн дараах өлсөлт эхлэхээс өмнө нэг төлөвлөсөн хоол, ойр дэлгүүрийн нэг нөөц сонголт бэлдэх.", {"fill": GREEN_SOFT, "bodySize": 11, "leading": 15})
    drawPlanTimeline(c)

def page5(c, debug=False):
    drawPageFrame(c, 5, "Тайлан 1 — Шөнийн ээлжийн сувилагч", "7 хоногийн тэмдэглэл", debug)
    drawCard(c, gridX(0), 138, gridW(6), 96, "Энэ тэмдэглэл юу тодруулах вэ?", "Энэ тэмдэглэл нь гол тойрог яг ямар өдөр, ямар нөхцөлд хүчтэй болдгийг тодруулахад тусална.", {"fill": GREEN_SOFT, "bodySize": 11.5, "leading": 15, "titleHeight": 22})
    drawPromptCards(c)
    drawCard(c, gridX(0), 518, gridW(6), 116, "Дараагийн алхам", "Энэ хэсэг нь дараагийн 7 хоногийн тэмдэглэлээр илүү тодорно.", {"fill": CARD, "accent": True, "bodySize": 13, "leading": 17, "titleHeight": 22})

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
