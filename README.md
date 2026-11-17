# Grand Geodetics website (Land Studio)

A complete static website: plain HTML, CSS and JavaScript. No build step, no database, no server code.
Upload this folder to a GitHub repository and connect it to Cloudflare Pages; the step-by-step guide explains how.

## The home page (new in November 2026)

`index.html` is the new home page: the flying survey drone, *What we do*, *About us* (with the CEO card) and the closing *Land Studio / Talk to us* page. It is self-contained — its styles and scripts are inside the file — and it reads only the contact details, the founding year and the GitHub repository from `assets/js/config.js`.

| To change on the home page | Where |
|---|---|
| Email, phone, founding year | `assets/js/config.js` (`email`, `phoneDisplay`, `phone`, `founded`) |
| Download buttons | they open `/download`, which `_redirects` sends to the latest GitHub release of `githubRepo` |
| Headline, cards, services, About text, partners | `index.html` — find the words with Ctrl+F on GitHub and edit them |
| Your portrait | replace `assets/img/ceo.jpg` (square JPG, about 640 × 640) |
| Published reviews on the home page | `reviews.json` — see the guide, section 5 |
| Logos on the home page | `assets/img/orb.svg`, `assets/img/orb-white.svg`, `assets/img/ciba-creatives.png` |

All other pages (Verify, Geoportal, Open data, Learn, Training, What's new, Statistics, Licence, Privacy, 404) work as before and are edited through the two files below. The home page no longer uses the home-page lists in `content.js` (numbers, workspaces, steps, video); the menu, footer and the other pages still do.

## The two files you edit

| File | What is in it |
|---|---|
| `assets/js/config.js` | Settings: website address, GitHub repository, contacts, location, the home-page video |
| `assets/js/content.js` | **Everything you see as a card or list**: the menu, the home-page numbers, workspaces, steps, "Why Land Studio", resources, the moving page strip, support numbers, social links, questions, the open-data table, tutorials and the footer columns |

A change in either file shows on every page at once. You can edit them straight on GitHub: open the file, press the pencil, change it, press **Commit changes**. Cloudflare publishes the new version in about a minute.

### Adding, removing or moving a card

Every list in `content.js` is a set of blocks like this:

```js
{ icon: 'seal-check', title: 'Verify a sketch plan', href: '/verify/', text: 'Scan the plan's QR code …' },
```

* **Add:** copy a whole block (from `{` to `},`), paste it below, change the words.
* **Remove:** delete the whole block, including its comma.
* **Reorder:** move blocks up or down; the page follows the order.
* **Pictures:** upload the image to `assets/img/` (WebP or JPG, about 1200 px wide) and write its path, e.g. `image: '/assets/img/my-picture.webp'`.
* **Social pages:** paste the full address in `url:` (Facebook, LinkedIn, YouTube, TikTok are empty for now, so they stay hidden). An empty `url: ''` hides the button.
* **A new data layer:** put the GeoJSON in `data/`, add a line to `data:` in `content.js` (download table) and to `LAYERS` in `assets/js/geoportal.js` (map).
* **A tutorial video:** upload it to YouTube and put its ID in `youtube:` in the `tutorials:` list.

If a page goes blank after an edit, a comma or quote is missing: on GitHub open the file's **History** and revert the last change.

### Icons

Icons are Phosphor (outline). Use any of these names in `icon:`:

`arrow-counter-clockwise`, `arrow-down`, `arrow-left`, `arrow-right`, `arrow-up-right`, `arrows-out`, `bank`, `book-open`, `books`, `browser`, `buildings`, `calendar`, `camera`, `caret-down`, `caret-right`, `certificate`, `chart-bar`, `chart-line`, `chat-text`, `chats-circle`, `check`, `check-circle`, `clock-counter-clockwise`, `compass`, `copy`, `crosshair`, `database`, `device-mobile`, `download-simple`, `drop`, `envelope-open`, `envelope-simple`, `eye`, `facebook-logo`, `file-pdf`, `file-text`, `folder`, `gear`, `github-logo`, `globe`, `globe-hemisphere-east`, `graduation-cap`, `hand-pointing`, `handshake`, `hard-drives`, `heart`, `house`, `house-line`, `image`, `info`, `instagram-logo`, `key`, `laptop`, `lightning`, `link`, `linkedin-logo`, `list`, `lock`, `magnifying-glass`, `map-pin`, `map-pin-line`, `map-trifold`, `megaphone`, `moon`, `mountains`, `newspaper`, `paper-plane-tilt`, `path`, `pen-nib`, `phone`, `plant`, `play`, `play-circle`, `polygon`, `presentation-chart`, `printer`, `qr-code`, `question`, `ranking`, `road-horizon`, `rocket`, `ruler`, `seal-check`, `share-network`, `shield-check`, `stack`, `star`, `sun`, `tag`, `target`, `telegram-logo`, `tiktok-logo`, `timer`, `train`, `tree`, `tree-structure`, `upload-simple`, `user`, `users`, `users-three`, `video-camera`, `warning`, `waves`, `whatsapp-logo`, `wifi-slash`, `x`, `x-circle`, `x-logo`, `youtube-logo`

To add another Phosphor icon, copy its `<symbol>` into `assets/img/icons.svg` with the id `i-` plus its name.

## Link previews (WhatsApp, Facebook, LinkedIn, X)

Every page has its own large preview picture (1200 × 630) in `assets/img/og/` and the full set of preview tags (title, description, picture, size). When you share a link, apps show a big card with the picture, title and description.

* Check a link before sharing: <https://developers.facebook.com/tools/debug/> (also refreshes WhatsApp and Facebook after a change) and <https://www.linkedin.com/post-inspector/>.
* Apps remember a preview for a few days. After changing a picture, give it a new file name (e.g. `home-2.jpg`) and change it in the page's `og:image` and `twitter:image` lines.

## What is in the folder

| Path | What it is |
|---|---|
| `index.html` | Home page: hero, why it matters, workspaces, how it works, video, why Land Studio, geoportal, resources and the moving page strip, download, support, contact |
| `geoportal/` | Malawi Geoportal: boundaries, districts, lakes, rivers, main roads, railway and towns; search, measure, share a view, download layers |
| `verify/` | Verify a sketch plan: scan the plan's QR code; checks it against `verify/plans.json`, the signed list of issued plans (no names or places) |
| `learn/` | Tutorials (list in `content.js`) and the user manual PDF |
| `changelog/` | What's new: every GitHub release and its notes |
| `training/` | Training request form (opens e-mail or WhatsApp; stores nothing) |
| `data/` | The GeoJSON layers and their download page |
| `stats/` | Download statistics, read live from GitHub Releases |
| `licence/`, `privacy/` | Licence agreement and privacy notice |
| `404.html` | The "page not found" page |
| `assets/css/site.css` | All styles. Colours are at the top: 60 % neutrals, 30 % deep blue, 10 % oxblood for actions |
| `assets/js/layout.js` | Draws the menu and footer of every page from `content.js` |
| `assets/js/site.js` | Draws the cards, the motion (scroll reveals, moving strip, progress line), live download info, forms |
| `assets/js/geoportal.js`, `verify.js`, `learn.js`, `changelog.js`, `stats.js`, `training.js` | Each page's own behaviour |
| `assets/fonts/` | Outfit and Instrument Serif, served from the site (no Google Fonts needed) |
| `assets/img/icons.svg` | The icon set |
| `assets/img/og/` | Link-preview pictures, one per page |
| `assets/img/pages/` | Thumbnails used in the moving page strip |
| `assets/video/` | The one-minute Land Studio video |
| `assets/vendor/` | OpenLayers, proj4 and jsQR, served from the site itself |
| `_headers`, `_redirects` | Cloudflare Pages settings: security headers, caching, short links (`/download`, `/map`, `/manual`) |
| `robots.txt`, `sitemap.xml` | Help Google find and list the pages (with their pictures) |

## Before going live

1. In `assets/js/config.js` check `githubRepo` (owner/name) and the contacts.
2. In `assets/js/content.js` paste your Facebook, LinkedIn, YouTube and TikTok page addresses (or leave them empty).
3. If your address is not `grandgeodetics.pages.dev`, replace it in `config.js`, `robots.txt`, `sitemap.xml`, and the `canonical`, `og:` and `twitter:` lines of each page, and the repository name in `_redirects`.
4. Publish the Land Studio installer as a GitHub Release. The Download buttons, version, size and download count fill themselves in.

## The installer is too big for Cloudflare Pages

Cloudflare Pages accepts files up to 25 MB, so the installer (.exe) is never put in this folder. It lives in GitHub Releases (files up to 2 GB), and the website's Download buttons point there. If the browser upload to GitHub keeps failing, upload from the command line: `gh release upload v2.11.2 "Land Studio_2.11.2_x64-setup.exe"`, or make the installer smaller by leaving the optional engines (PROJ grids, WhiteboxTools) out and offering them as a separate download.

## Publishing the list of issued plans

1. In Land Studio: Sketch, Register, **List for the website**. It saves `plans-unsigned.json`.
2. Open the Land Studio key issuer (the private file, never on the website), go to **Sign plan list**, choose that file and the current `verify/plans.json` (to keep plans already published), and press **Sign plan list**.
3. Upload the downloaded `plans.json` into the `verify` folder on GitHub, replacing the old one.

## Withdrawing a lost or stolen computer's activation

In the key issuer, under **Withdraw activations**, type the computer's device code and sign. Upload the downloaded `revoked.json` into the `licence` folder on GitHub. Land Studio checks it about once a week when online and stops certificate work on that computer.

## Changing things later

- Text: edit the HTML file, save, upload to GitHub. Cloudflare publishes it within a minute or two.
- A new Land Studio version: only publish a new GitHub Release. The website picks it up by itself.
- New screenshots: save them as WebP in `assets/img/` with the same name, or change the `src` in `index.html`.

Map data: geoBoundaries (CC BY 4.0), Natural Earth (public domain). Libraries: OpenLayers (BSD-2), proj4js (MIT), jsQR (Apache 2.0).
