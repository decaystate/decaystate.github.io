# EPK PDF

Rebuilds `assets/epk/Decaystate_EPK.pdf` from `epk.html`.

    pip install playwright pikepdf pillow   # plus poppler-utils for pdftoppm
    python3 tools/epk-pdf/pdf.py . /tmp/epk_text.pdf
    python3 tools/epk-pdf/flatten.py /tmp/epk_text.pdf assets/epk/Decaystate_EPK.pdf /tmp/epk_flat

- `pdf.py` prints the page with static font files from `fonts/` so they embed cleanly (variable fonts became Type 3 and clipped letters on iPhone/Mac).
- `flatten.py` turns it into one 300 dpi image page and keeps the links. This stops iOS from drawing the bottom half white.
- Check it's still one page before publishing.
