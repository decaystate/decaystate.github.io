# Renders epk.html to a one-page Letter PDF with embedded static fonts (avoids Type 3 fonts that clip on Apple viewers).
# Usage: python3 tools/epk-pdf/pdf.py <repo_root> <out.pdf>   then   python3 tools/epk-pdf/flatten.py <out.pdf> assets/epk/Decaystate_EPK.pdf /tmp/flat
import sys, os
ROOT=os.path.abspath(sys.argv[1]); OUT=sys.argv[2]
FONTS=os.path.join(os.path.dirname(os.path.abspath(__file__)),'fonts')
import asyncio
from playwright.async_api import async_playwright

css=("""
@font-face{font-family:'Cinzel';src:url('file://'+FONTS+'/Cinzel-wght400.ttf');font-weight:400}
@font-face{font-family:'JetBrains Mono';src:url('file://'+FONTS+'/JBM-wght400.ttf');font-weight:400}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth88-wght400.ttf');font-weight:400;font-stretch:88%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth92-wght400.ttf');font-weight:400;font-stretch:92%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth95-wght400.ttf');font-weight:400;font-stretch:95%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth100-wght400.ttf');font-weight:400;font-stretch:100%}
@font-face{font-family:'Cinzel';src:url('file://'+FONTS+'/Cinzel-wght500.ttf');font-weight:500}
@font-face{font-family:'JetBrains Mono';src:url('file://'+FONTS+'/JBM-wght500.ttf');font-weight:500}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth88-wght500.ttf');font-weight:500;font-stretch:88%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth92-wght500.ttf');font-weight:500;font-stretch:92%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth95-wght500.ttf');font-weight:500;font-stretch:95%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth100-wght500.ttf');font-weight:500;font-stretch:100%}
@font-face{font-family:'Cinzel';src:url('file://'+FONTS+'/Cinzel-wght600.ttf');font-weight:600}
@font-face{font-family:'JetBrains Mono';src:url('file://'+FONTS+'/JBM-wght600.ttf');font-weight:600}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth88-wght600.ttf');font-weight:600;font-stretch:88%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth92-wght600.ttf');font-weight:600;font-stretch:92%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth95-wght600.ttf');font-weight:600;font-stretch:95%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth100-wght600.ttf');font-weight:600;font-stretch:100%}
@font-face{font-family:'Cinzel';src:url('file://'+FONTS+'/Cinzel-wght700.ttf');font-weight:700}
@font-face{font-family:'JetBrains Mono';src:url('file://'+FONTS+'/JBM-wght700.ttf');font-weight:700}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth88-wght700.ttf');font-weight:700;font-stretch:88%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth92-wght700.ttf');font-weight:700;font-stretch:92%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth95-wght700.ttf');font-weight:700;font-stretch:95%}
@font-face{font-family:'Archivo';src:url('file://'+FONTS+'/Archivo-wdth100-wght700.ttf');font-weight:700;font-stretch:100%}
@font-face{font-family:'Archivo';font-style:italic;src:url('file://'+FONTS+'/ArchivoI-wdth92-wght400.ttf');font-weight:400;font-stretch:92%}
@font-face{font-family:'Archivo';font-style:italic;src:url('file://'+FONTS+'/ArchivoI-wdth92-wght600.ttf');font-weight:600;font-stretch:92%}
""").replace("'+FONTS+'", FONTS)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        await pg.goto("file://"+ROOT+"/epk.html", wait_until="load")
        await pg.add_style_tag(content=css)
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(500)
        await pg.emulate_media(media="print")
        await pg.pdf(path=OUT, width="8.5in", height="11in", print_background=True, prefer_css_page_size=True)
        await b.close()
asyncio.run(main())
