/*
  DECAYSTATE — site content
  ---------------------------------------------------------------
  Everything the band will want to update lives in this one file:
  links, releases, shows, merch and payment handles.
  Edit, commit, push — GitHub Pages redeploys in about a minute.
*/
window.SITE = {
  email: "decaystateband@gmail.com",
  hometown: "Sioux Falls, SD",
  coords: "43.548° N, 96.729° W",
  genre: "Metalcore",
  ffo: ["Northlane", "Bad Omens", "Architects"],

  links: {
    spotify: "https://open.spotify.com/artist/7xYaNXIx3unPskGUKa6lCl",
    appleMusic: "https://music.apple.com/us/artist/decaystate/6791834499",
    youtube: "https://www.youtube.com/@decaystateband",
    instagram: "https://www.instagram.com/decaystateband",
    tiktok: "https://www.tiktok.com/@decaystateband",
    facebook: "https://www.facebook.com/share/1HRsn3rqWa/",
    threads: "https://www.threads.net/@decaystateband",
    linktree: "https://linktr.ee/DECAYSTATE"
  },

  // Newest first. date = release date (YYYY-MM-DD, Central time).
  // youtube = the video ID (the part after watch?v=). listen = a smart/pre-save link (optional,
  // otherwise Listen goes to the Spotify artist page). art = square cover in assets/img/.
  releases: [
    { title: "Unethical", note: "A Faouzia cover", date: "2026-10-20", featured: true,
      art: "assets/img/cover-unethical.jpg", youtube: "", listen: "https://open.spotify.com/album/4z0bm4hQK81RxLU7dVUUcc" },
    { title: "Bones", note: "Single", date: "2026-09-01",
      art: "assets/img/cover-bones.jpg", youtube: "JucNUIaQVwE", listen: "" },
    { title: "Hollow", note: "Single", date: "2026-08-11",
      art: "assets/img/cover-hollow.jpg", youtube: "QIzoH4O_Kco", listen: "" }
  ],

  // Shows. Only upcoming dates appear on the site; past ones stay here as a record
  // (the site doesn't show a "Past shows" list for now).
  // tickets: any ticket URL. The site adds utm_source=decaystate tags so the seller's
  //   report (or GoHighLevel, for shows where we sell our own tickets) can count our clicks.
  //   For our own shows, paste the GoHighLevel order page URL here.
  shows: [
    {
      date: "2026-12-18",
      title: "Long Rest",
      venue: "Icon",
      city: "Sioux Falls, SD",
      address: "402 N. Main Ave, Sioux Falls, SD",   // optional: adds a Directions link
      time: "7 PM",
      price: "$15 adv",
      lineup: ["Spirits and Sirens", "Decaystate", "Seagull Hazard"],
      ages: "All ages",
      flyer: "assets/img/flyer-2026-12-18.jpg",
      // Metro Presents (TicketWeb). If Metro gives us our own link, swap it in here.
      tickets: "https://www.ticketweb.com/event/long-rest-icon-events-dada-gastropub-tickets/14313664",
      promoCode: ""   // e.g. "DECAYSTATE" if Metro sets one up for us
    },
    { date: "2026-10-09", venue: "The Park", city: "Rapid City, SD",
      lineup: ["Opal in Sky", "Mirrorcell", "Levels", "Decaystate"] },
    { date: "2026-10-08", venue: "Icon", city: "Sioux Falls, SD",
      lineup: ["Opal in Sky", "Mirrorcell", "Levels", "Decaystate"] },
    { date: "2026-09-11", title: "Debut show", venue: "Icon", city: "Sioux Falls, SD",
      lineup: ["Decaystate", "Strange New Faces", "Useless Eyes", "Emerald Skies"] }
  ],

  /* GoHighLevel. For each form: in GHL go to Sites → Forms, open the form,
     Integrate → Embed, and copy the form ID (the code after /widget/form/ in the
     embed) or the whole https:// link from the iframe src. Paste either here.
     Each block appears on the site as soon as it's filled in; until then the
     email address stays the way to reach the band.                           */
  ghl: {
    locationId: "dzahKE9ALTGt1CnTFtFZ",   // DECAYSTATE sub-account, for reference; the forms don't need it
    signupForm: "v334OP0rgFX9SzqfU3Dt",   // "The Signal" email signup, under Music (GHL form: DECAYSTATE - The Signal)
    signupHeight: 270,   // starting height in px (GHL resizes it once it loads)
    bookingForm: "24dSWvhwDUTAjLRvFpMy",  // booking inquiry, in the Book DECAYSTATE section (GHL form: DECAYSTATE - Booking Inquiry)
    bookingHeight: 690
  },

  // Visitor + click stats: make a free account at goatcounter.com and put the
  // site code here (the part before .goatcounter.com). Every ticket, listen,
  // merch and press-kit click then shows up in your GoatCounter dashboard.
  // GoHighLevel counts form submissions and its own order pages; GoatCounter
  // counts clicks on everything else (Spotify, YouTube, TicketWeb...). Clear
  // this to turn it off.
  analytics: { goatcounter: "decaystate" },

  members: [
    { name: "Nick", role: "Vocals" },
    { name: "Paul", role: "Guitar" },
    { name: "Alex", role: "Drums" }
  ],

  /* ---------------- MERCH ----------------
     price: in dollars.
     pairPrice: optional deal for 2 (e.g. stickers 1 for $3 / 2 for $5).
     sizes: leave [] for one-size items.
     includes: for bundles, which shirts need a size picked.
     img: the card photo (square; bundles 16:10). It's also the first photo in the gallery.
     gallery: more photos shown when someone opens the item (any shape).
     designs: for items that come in more than one design; each design can
     have its own photo, shown when it's picked. The 2-for deal counts
     across designs (one of each = the pair price).                    */
  merch: [
    { id: "logo-tee", name: "Logo T-Shirt", price: 25, img: "assets/merch/logo-tee.jpg",
      gallery: ["assets/merch/logo-tee-2.jpg", "assets/merch/logo-tee-3.jpg"],
      sizes: ["S", "M", "L", "XL", "2XL"] },
    { id: "vintage-red-tee", name: "Acid Wash T-Shirt", price: 30, img: "assets/merch/vintage-red-tee.jpg",
      gallery: ["assets/merch/vintage-red-tee-2.jpg", "assets/merch/vintage-red-tee-detail-1.jpg",
        "assets/merch/vintage-red-tee-detail-2.jpg", "assets/merch/vintage-red-tee-detail-3.jpg", "assets/merch/vintage-red-tee-3.jpg"],
      sizes: ["S", "M", "L", "XL", "2XL"] },
    { id: "emblem-hat", name: "Emblem Dad Hat", price: 30, img: "assets/merch/emblem-hat.jpg",
      gallery: ["assets/merch/merch-flatlay.jpg", "assets/merch/emblem-hat-2.jpg"], sizes: [] },
    { id: "magnet", name: "Magnet", price: 5, pairPrice: 8, img: "assets/merch/magnet.jpg", sizes: [],
      designs: [{ name: "Red emblem", img: "assets/merch/magnet.jpg" }, { name: "Black logo", img: "assets/merch/magnet-black-logo.jpg" }],
      gallery: ["assets/merch/merch-flatlay.jpg"],
      note: "1 for $5 · 2 for $8" },
    { id: "sticker", name: "Sticker", price: 3, pairPrice: 5, img: "assets/merch/sticker.jpg", sizes: [],
      designs: [{ name: "Holographic emblem", img: "assets/merch/sticker.jpg" }, { name: "White logo", img: "assets/merch/sticker-white-logo.jpg" }],
      gallery: ["assets/merch/merch-flatlay.jpg"],
      note: "1 for $3 · 2 for $5" },

    { id: "bundle-logo-hat", name: "Logo Shirt + Dad Hat", price: 50, bundle: true,
      img: "assets/merch/bundle-logo-hat.jpg", gallery: ["assets/merch/bundle-all-2.jpg"], includes: ["Logo T-Shirt"] },
    { id: "bundle-red-hat", name: "Acid Wash Shirt + Dad Hat", price: 55, bundle: true,
      img: "assets/merch/bundle-red-hat.jpg", gallery: ["assets/merch/bundle-all-3.jpg"], includes: ["Acid Wash T-Shirt"] },
    { id: "bundle-all", name: "Both Shirts + Dad Hat", price: 75, bundle: true,
      img: "assets/merch/bundle-all.jpg", gallery: ["assets/merch/bundle-all-2.jpg", "assets/merch/bundle-all-3.jpg"],
      includes: ["Logo T-Shirt", "Acid Wash T-Shirt"],
      note: "Includes a high five from each band member" }
  ],
  merchPhotos: "20261024c",   // bump this after swapping merch photos so browsers load the new ones
  merchPerk: "Free sticker with any purchase",
  sizes: ["S", "M", "L", "XL", "2XL"],

  /* How people pay. Orders are emailed to the band, then paid here.
     Fill in your handles (no @ or $ needed). Leave blank to hide.
     shipping: flat US shipping in dollars, or null to confirm by email. */
  payments: {
    venmo: "",   // no band Venmo yet
    cashapp: ""
  },
  shipping: null
};
