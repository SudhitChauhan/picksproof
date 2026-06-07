/**
 * About page imagery — URLs are cropped to each section's display ratio so
 * object-cover fills the frame without awkward clipping.
 *
 * Display ratios (from components):
 *   hero     ~2.5:1  full-bleed banner
 *   problem  3:2     aspect-[3/2]
 *   story    3:2     wide card ~440–600px
 *   mission  16:9    full-bleed under dark overlay
 *   method   ~5.2:1  220px × ~1152px strip
 *   money    ~3.8:1  200px × ~760px strip
 *   bento    ~2.8:1  200px tile headers
 *   products 1:1     56px thumbnails
 */
type Crop = { w: number; h: number };

const unsplash = (id: string, { w, h }: Crop) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=90`;

export const ABOUT_IMAGES = {
  /** Hero — wide modern workspace; subject spans the full banner width */
  hero: {
    main: unsplash("photo-1497366216548-37526070297c", { w: 2400, h: 960 }),
    mainAlt: "Bright modern workspace used for product research"
  },
  /** Square product shots for mock comparison thumbnails */
  heroProducts: [
    {
      src: unsplash("photo-1590658268037-6bf12165a8df", { w: 400, h: 400 }),
      alt: "Wireless earbuds product photo"
    },
    {
      src: unsplash("photo-1572569511254-d8f925fe2cbb", { w: 400, h: 400 }),
      alt: "In-ear headphones product photo"
    }
  ],
  /** Problem — multi-screen desk (too many tabs open) */
  problem: {
    src: unsplash("photo-1587825140708-dfaf72ae4b04", { w: 1800, h: 1200 }),
    alt: "Shopper juggling multiple screens while comparing products"
  },
  /** Story — team at a wide table with laptops */
  story: {
    src: unsplash("photo-1522202176988-66273c2fd55f", { w: 1200, h: 800 }),
    alt: "Team collaborating over product research at a shared desk"
  },
  /** Mission — cinematic wide gradient; reads well when darkened */
  mission: {
    src: unsplash("photo-1519681393784-d120267933ba", { w: 2400, h: 1350 }),
    alt: "Soft atmospheric gradient background"
  },
  bento: {
    reviews: unsplash("photo-1505740420928-5e560c06d30e", { w: 1120, h: 400 }),
    comparisons: unsplash("photo-1551288049-bebda4e38f71", { w: 1120, h: 400 }),
    guides: unsplash("photo-1556911220-bff31c812dba", { w: 1120, h: 400 }),
    budget: unsplash("photo-1523275335684-37898b6baf30", { w: 1120, h: 400 })
  },
  /** Method — analytics dashboard in an ultrawide strip crop */
  method: {
    src: unsplash("photo-1460925895917-afdab827c52f", { w: 2300, h: 440 }),
    alt: "Laptop screen showing structured product comparison data"
  },
  /** Trust — flat-lay documents, landscape crop */
  trust: {
    src: unsplash("photo-1450101499163-c8848c66ca85", { w: 1600, h: 1200 }),
    alt: "Editor reviewing notes for accuracy and disclosure"
  },
  /** Money — horizontal mobile checkout scene in a wide strip */
  money: {
    src: unsplash("photo-1563013544-824ae1b704d3", { w: 1520, h: 400 }),
    alt: "Straightforward mobile checkout — price stays the same for you"
  }
} as const;
