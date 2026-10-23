import sys, subprocess, pikepdf
from pikepdf import Name, Dictionary, Array, Stream
from PIL import Image
src_path, out_path, tmp = sys.argv[1], sys.argv[2], sys.argv[3]
subprocess.run(["pdftoppm","-r","300","-jpeg","-jpegopt","quality=90","-singlefile",src_path,tmp],check=True,stderr=subprocess.DEVNULL)
jpg=tmp+".jpg"; w,h=Image.open(jpg).size
src=pikepdf.open(src_path); out=pikepdf.new()
img=Stream(out,open(jpg,"rb").read()); img.Type=Name.XObject; img.Subtype=Name.Image; img.Width=w; img.Height=h
img.ColorSpace=Name.DeviceRGB; img.BitsPerComponent=8; img.Filter=Name.DCTDecode
page=Dictionary(Type=Name.Page, MediaBox=Array([0,0,612,792]), Contents=Stream(out,b"q 612 0 0 792 0 0 cm /Im0 Do Q"), Resources=Dictionary(XObject=Dictionary(Im0=img)))
annots=Array()
for a in src.pages[0].obj.get('/Annots',[]):
    annots.append(out.make_indirect(Dictionary(Type=Name.Annot, Subtype=Name.Link, Rect=Array(list(a.Rect)), Border=Array([0,0,0]), F=4, A=Dictionary(Type=Name.Action, S=Name.URI, URI=pikepdf.String(str(a.A.URI))))))
page.Annots=annots; out.pages.append(pikepdf.Page(page))
out.docinfo["/Title"]="DECAYSTATE EPK"; out.docinfo["/Author"]="DECAYSTATE"
out.save(out_path); print("links",len(annots))
