# DECAYSTATE website

A static one-page site: music, shows, merch store with cart, band info and booking contact.
No build step and no framework, so it runs on GitHub Pages as-is.

## Put it online with GitHub Pages

1. Create a new public repo on GitHub (for example `decaystate-site`).
2. Upload everything in this folder to the repo root (drag the files into "Add file → Upload files", or `git push`).
3. In the repo go to **Settings → Pages**. Under "Build and deployment" pick **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/decaystate-site/`.

### Custom domain: decaystateband.com
The `CNAME` file in this folder tells GitHub the site lives at decaystateband.com (leave it in place). In **Settings → Pages → Custom domain** enter `decaystateband.com`, add the DNS records at Porkbun, then tick **Enforce HTTPS** once it's available.

## Updating the site

Almost everything lives in **`assets/js/config.js`**. Edit it on GitHub (pencil icon), commit, and the site updates in about a minute.

| To change… | Edit in `config.js` |
|---|---|
| Spotify / Apple Music buttons | `links.spotify`, `links.appleMusic` (until filled, Listen buttons go to the Linktree) |
| Link a song straight to its video | the release's `youtube` field: the ID after `watch?v=` |
| Pre-save link for a new release | the release's `listen` field |
| Add a show | add an entry to `shows` (past dates drop off the site on their own; there's no "Past shows" list for now) |
| Show flyer | put the image in `assets/img/` and set `flyer` |
| Ticket link | the show's `tickets` field (a promoter link, or a GoHighLevel order page for shows we sell ourselves) |
| Email signup / booking form | `ghl.signupForm`, `ghl.bookingForm` (see below) |
| Click stats | `analytics.goatcounter` |
| Merch prices, names, sizes | `merch` |
| Venmo / Cash App buttons at checkout | `payments.venmo`, `payments.cashapp` (handles without @ or $; leave blank until the band has one) |
| Flat shipping price | `shipping` (a number, or `null` to quote by email) |

### Merch photos
The product images in `assets/merch/` are simple mockups made from your artwork. Replace them with real product photos anytime: keep the same filename (square images look best for single items, 16:10 for bundles).

## GoHighLevel forms
1. In GoHighLevel go to **Sites → Forms** and build the form. Use a transparent or dark background and light text so it sits on the black site. For the signup, collect email (name optional); for booking, name, email, date, city/venue and a message.
2. Add hidden fields named `utm_source`, `utm_medium` and `utm_campaign` if you want GHL to record where each person came from. The site passes those tags through from its own URL (for example an Instagram bio link ending in `?utm_source=instagram`).
3. Open the form's **Integrate → Embed** code and copy the form ID (the part after `/widget/form/`), or the whole `https://...` link from the `iframe src`.
4. Paste it into `ghl.signupForm` or `ghl.bookingForm` in `config.js`. The section appears on the site as soon as the field is filled in. The booking email stays visible either way.

Form submissions are counted in GoHighLevel. GoatCounter (optional) counts clicks on everything else: listen, watch, ticket, merch and press-kit buttons.

## Tracking ticket sales
Every ticket button gets `utm_source=decaystate&utm_medium=website&utm_campaign=show-<date>` added to the link. For promoter shows, a link or promo code that's only ours (ask the promoter) is what actually shows up in their sales report; put a code in the show's `promoCode` field and the site displays it next to the ticket button. For shows where we sell our own tickets, make a GoHighLevel order page and paste its URL in `tickets`.

## How the store works
Fans add items to the cart and fill in name, email and shipping (or "pick up at a show"). The site then builds the order and opens their email app addressed to decaystateband@gmail.com with the order filled in, plus a copy button as backup. If you add Venmo / Cash App handles, they also get pay buttons with the exact amount and an order number for the note.

Nothing is charged automatically. You confirm stock and shipping by replying to the email. If orders pick up, the same product list can move to Shopify Starter, Big Cartel or Stripe Payment Links for card checkout.

## Files
```
index.html            page structure
assets/css/style.css  all styling
assets/js/config.js   content you edit
assets/js/main.js     cart, countdown, shows logic
assets/img/           logos, photos, flyers
assets/merch/         product images
```
