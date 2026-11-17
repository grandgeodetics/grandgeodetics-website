/* ==================================================================================================
   WEBSITE CONTENT — the cards, lists and links on every page come from this file.

   How to edit
   • Add a card:    copy one { ... } block in a list, paste it where you want it, change the words.
   • Remove a card: delete its { ... } block, including the comma after it.
   • Reorder:       move blocks up or down. The page shows them in this order.
   • Images:        upload the picture to assets/img/ (WebP or JPG, about 1200 px wide), then write its path,
                    for example image: '/assets/img/my-picture.webp'.
   • Icons:         write the name of a Phosphor icon from the list in README.md, for example icon: 'map-trifold'.
   • Leave a link empty ('') to hide that item (useful for social pages you have not opened yet).

   Keep the quotes and commas exactly as they are. If a page goes blank after an edit, a comma or quote is missing:
   undo the last change on GitHub (History › Revert) and try again.
   ================================================================================================== */
window.CONTENT = {

  /* Top menu, in page order. "spy" is the home-page section that lights the link up while you scroll. */
  nav: [
    { label: 'Services',      href: '/#services',   icon: 'stack',                 spy: 'services' },
    { label: 'About',         href: '/#about',      icon: 'users-three',           spy: 'about' },
    { label: 'Learn',         href: '/learn/',      icon: 'play-circle',           spy: 'learn' },
    { label: 'Geoportal',     href: '/geoportal/',  icon: 'globe-hemisphere-east', spy: 'geoportal' },
    { label: 'Verify a plan', href: '/verify/',     icon: 'seal-check',            spy: 'resources' },
        { label: 'Contact',       href: '/#contact',    icon: 'chats-circle',          spy: 'contact' }
  ],
  /* Extra links shown only in the phone menu. */
  navMore: [
    { label: 'Training',  href: '/training/',  icon: 'graduation-cap' },
    { label: "What's new", href: '/changelog/', icon: 'clock-counter-clockwise' },
    { label: 'Open data', href: '/data/',      icon: 'database' }
  ],

  /* Home › "Why it matters" numbers. value counts up from 0; suffix is added after it. */
  numbers: [
    { value: 170, suffix: '+', title: 'Geoprocessing tools',    text: 'From buffers to kriging and flood models.', icon: 'tree-structure' },
    { value: 6,   suffix: '',  title: 'Workspaces in one file', text: 'GIS, sketch plans, adjudication, analytics, architecture, irrigation.', icon: 'stack' },
    { value: 28,  suffix: '',  title: 'Districts built in',     text: 'With regions, lakes, rivers and towns.', icon: 'map-pin' },
    { value: 100, suffix: '%', title: 'Offline daily work',     text: 'In the office or the field, no internet needed.', icon: 'wifi-slash' }
  ],

  /* Home › Workspaces. size: 'wide' (two columns), 'full' (whole row, picture on the right) or '' (one column).
     Leave image empty to draw the parcel sketch instead of a picture. */
  workspaces: [
    { tag: 'Map & GIS', icon: 'map-trifold', size: 'wide', image: '/assets/img/mw_map.webp',
      title: 'Every layer, every coordinate system', text: 'Layers, symbology and print layouts, with toolboxes for hazards, terrain, hydrology and image classification, in Arc 1950 or any of 7,000 systems.' },
    { tag: 'Sketch plans', icon: 'pen-nib', size: '', image: '/assets/img/sheet.webp',
      title: 'A checked A4 plan', text: 'Type or import beacons; get distance, bearing and coordinate tables, a QR code and a register entry.' },
    { tag: 'Analytics', icon: 'chart-bar', size: '', image: '/assets/img/an_mw.webp',
      title: 'Cases by Traditional Authority', text: 'Stalled cases, hearings and the case lifecycle, with printable reports.' },
    { tag: 'Architecture', icon: 'house-line', size: '', image: '/assets/img/arch_sheet.webp',
      title: 'House plans to A3 sets', text: 'Templates, elevations, sections and a full drawing set with your title block.' },
    { tag: 'Irrigation', icon: 'drop', size: '', image: '/assets/img/irr_edit.webp',
      title: 'Drip to canals', text: 'Design systems, structures and scheme buildings, with a bill of quantities.' },
    { tag: 'Adjudication & certificates', icon: 'certificate', size: 'full', image: '',
      title: 'From parcel map to customary land certificate', text: 'Parcel maps, data cleaning, field app exchange and certificates. Issuing needs an approved computer and a PIN, and every certificate goes into an audit log.' }
  ],

  /* Home › How it works. These are numbered automatically, in this order. */
  steps: [
    { icon: 'crosshair',  title: 'Bring in the beacons', text: 'Type coordinates, paste a CSV, read an instrument file or a GPS track.' },
    { icon: 'polygon',    title: 'Check the parcel',     text: 'Closure, areas, overlaps and gaps are checked before anything is printed.' },
    { icon: 'file-text',  title: 'Produce the plan',     text: 'A sketch plan or adjudication record lays itself out on your template.' },
    { icon: 'seal-check', title: 'Register and verify',  text: 'Every plan goes into the register; its QR code lets anyone check a paper copy.' }
  ],

  /* Home › Why Land Studio (the dark band). */
  why: [
    { icon: 'globe-hemisphere-east', title: 'Made for Malawi',           text: 'Arc 1950 / UTM zone 36S by default, the districts and lakes built in, forms that follow Ministry of Lands practice.' },
    { icon: 'wifi-slash',            title: 'Works without internet',    text: 'Projects live on your computer. Go online only for open data, the registry or updates.' },
    { icon: 'stack',                 title: 'One tool instead of five',  text: 'Mapping, drafting, records, design and reports share one project, so data is typed once.' },
    { icon: 'shield-check',          title: 'Certificates under control', text: 'Bound to an approved computer and a PIN, recorded in an audit log, withdrawable if a laptop is lost.' },
    { icon: 'laptop',                title: 'Runs on modest computers',  text: 'A light mode switches on by itself, so offices use the laptops they already have.' },
    { icon: 'hard-drives',           title: 'Your records kept safe',    text: 'The plan register is backed up daily, projects can be locked with a password, and backups go to a USB stick.' }
  ],

  /* Home › Resources cards. */
  resources: [
    { icon: 'seal-check',              title: 'Verify a sketch plan',    href: '/verify/',    text: "Scan the plan's QR code with a phone and see at once whether it matches the issued list." },
    { icon: 'books',                   title: 'Tutorials and manual',    href: '/learn/',     text: 'Short videos and an 84-page manual to print or keep on your phone.' },
    { icon: 'clock-counter-clockwise', title: "What's new",              href: '/changelog/', text: 'Every version of Land Studio and what it added or fixed.' },
    { icon: 'graduation-cap',          title: 'Training for your office', href: '/training/', text: 'Hands-on training for land clerks and surveyors at your council.' }
  ],

  /* Home › the moving strip "Pages on the site". It scrolls by itself and stops when touched. */
  pages: [
    { title: 'Geoportal',     path: '/geoportal/', icon: 'globe-hemisphere-east',   image: '/assets/img/pages/geoportal.webp' },
    { title: 'Verify a plan', path: '/verify/',    icon: 'seal-check',              image: '/assets/img/pages/verify.webp' },
    { title: 'Tutorials',     path: '/learn/',     icon: 'books',                   image: '/assets/img/pages/learn.webp' },
    { title: 'Training',      path: '/training/',  icon: 'graduation-cap',          image: '/assets/img/pages/training.webp' },
    { title: "What's new",    path: '/changelog/', icon: 'clock-counter-clockwise', image: '/assets/img/pages/changelog.webp' },
    { title: 'Open data',     path: '/data/',      icon: 'database',                image: '/assets/img/pages/data.webp' },
    { title: 'Statistics',    path: '/stats/',     icon: 'chart-line',              image: '/assets/img/pages/stats.webp' }
  ],

  /* Home › Support us. copy is the number without spaces (what the Copy button copies). */
  support: [
    { icon: 'bank',          label: 'National Bank of Malawi', number: '1004673898',       copy: '1004673898' },
    { icon: 'device-mobile', label: 'Airtel Money',            number: '+265 99 592 6300', copy: '265995926300' },
    { icon: 'device-mobile', label: 'TNM Mpamba',              number: '+265 88 103 5153', copy: '265881035153' }
  ],

  /* Social pages: home contact section and every footer. Paste the full address of each page; empty ones stay hidden. */
  socials: [
    { name: 'WhatsApp', icon: 'whatsapp-logo',  url: 'https://wa.me/265881035153' },
    { name: 'Facebook', icon: 'facebook-logo',  url: '' },
    { name: 'LinkedIn', icon: 'linkedin-logo',  url: '' },
    { name: 'YouTube',  icon: 'youtube-logo',   url: '' },
    { name: 'TikTok',   icon: 'tiktok-logo',    url: '' },
    { name: 'GitHub',   icon: 'github-logo',    url: 'https://github.com/grandgeodetics/land-studio' }
  ],

  /* Home › questions under "Connect with us". */
  faq: [
    { q: 'Is Land Studio really free?',      a: 'Yes. Issuing customary land certificates needs an activation for each computer, given after an identity check.' },
    { q: 'Does it need the internet?',       a: 'No. Everyday work is offline; the internet is used only for open data, the registry account and updates.' },
    { q: 'Will it run on our office laptops?', a: 'Windows 10 or 11 with 4 GB of memory. On low-power computers a light mode turns on by itself.' },
    { q: 'Can we get training?',             a: 'Yes. Request a session for your district office on the Training page, in person or online.' }
  ],

  /* Open data page › the download table. Put the GeoJSON file in /data/ and add a line. */
  data: [
    { name: 'Malawi national boundary',             file: '/data/malawi_country.geojson',   features: '1 polygon',   size: '71 kB',  source: 'geoBoundaries gbOpen ADM0', licence: 'CC BY 4.0' },
    { name: 'Regions (Northern, Central, Southern)', file: '/data/malawi_regions.geojson',   features: '3 polygons',  size: '89 kB',  source: 'geoBoundaries gbOpen ADM1', licence: 'CC BY 4.0' },
    { name: 'Districts',                            file: '/data/malawi_districts.geojson', features: '28 polygons', size: '367 kB', source: 'geoBoundaries gbOpen ADM2', licence: 'CC BY 4.0' },
    { name: 'Lakes (Lake Malawi, Lake Malombe)',    file: '/data/malawi_lakes.geojson',     features: '2 polygons',  size: '11 kB',  source: 'Natural Earth',             licence: 'Public domain' },
    { name: 'Rivers (Shire River)',                 file: '/data/malawi_rivers.geojson',    features: '1 line',      size: '3 kB',   source: 'Natural Earth 1:10m',       licence: 'Public domain' },
    { name: 'Main roads',                           file: '/data/malawi_roads.geojson',     features: '33 lines',    size: '16 kB',  source: 'Natural Earth 1:10m',       licence: 'Public domain' },
    { name: 'Railway',                              file: '/data/malawi_railways.geojson',  features: '4 lines',     size: '12 kB',  source: 'Natural Earth 1:10m',       licence: 'Public domain' },
    { name: 'Cities and district centres',          file: '/data/malawi_towns.geojson',     features: '20 points',   size: '3 kB',   source: 'Natural Earth 1:10m',       licence: 'Public domain' }
  ],

  /* Learn page › tutorials. Upload each video to YouTube and put its ID (the part after v= in the address).
     A short video (under 25 MB) can go in assets/video/ instead: file: '/assets/video/name.mp4'. */
  tutorials: [
    { title: 'Land Studio in one minute', youtube: '', file: '/assets/video/land-studio-ad.mp4', poster: '/assets/img/ad-poster.jpg', minutes: 1, about: 'What Land Studio does, from the map to certificates.' },
    { title: 'Your first sketch plan',          youtube: '', minutes: 6, about: 'Type the beacon coordinates, check closure and export a checked A4 plan.' },
    { title: 'Adding Malawi data to the map',   youtube: '', minutes: 5, about: 'Districts, Traditional Authorities, open data and your own files.' },
    { title: 'Adjudication and certificates',   youtube: '', minutes: 8, about: 'From the parcel register to a printed customary land certificate.' },
    { title: 'Drawing and editing shapes',      youtube: '', minutes: 4, about: 'Select and edit corners, move shapes and keep a clean Shapes list.' },
    { title: 'Print layouts and map sheets',    youtube: '', minutes: 6, about: 'Titles, legends, grids and exporting at 300 dpi.' }
  ],

  /* Footer columns on every page. */
  footer: [
    { title: 'Land Studio', links: [
      { label: 'Services', href: '/#services' }, { label: 'About us', href: '/#about' }, { label: 'Download', href: '/#download' },
      { label: "What's new", href: '/changelog/' }, { label: 'Statistics', href: '/stats/' } ] },
    { title: 'Resources', links: [
      { label: 'Geoportal', href: '/geoportal/' }, { label: 'Verify a plan', href: '/verify/' }, { label: 'Tutorials and manual', href: '/learn/' },
      { label: 'Open data', href: '/data/' }, { label: 'Training', href: '/training/' } ] },
    { title: 'Company', links: [
      { label: 'Contact', href: '/#contact' }, { label: 'Licence', href: '/licence/' },
      { label: 'Privacy', href: '/privacy/' }, { label: 'Ciba Creatives', href: 'mailto:cibacreatives@gmail.com' } ] }
  ],

  /* The parent company panel at the top of every footer. */
  parent: {
    title: 'Part of Ciba Creatives',
    text: 'Grand Geodetics is an affiliate of Ciba Creatives, its parent company, and works hand in hand with Nyasa Digital Labs.',
    linkLabel: 'Contact Ciba Creatives',
    link: 'mailto:cibacreatives@gmail.com'
  }
};
