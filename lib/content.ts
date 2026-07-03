export const site = {
  name: "Čokoladni Foto & Video",
  fullName: "Čokoladni Foto & Video Produkcija",
  tagline: "Uspomene koje izgledaju kao film.",
  heroTitle: "Trenutke pretvaramo u uspomene koje traju",
  heroSubtitle:
    "Svaki trenutak je priča koja čeka da bude ispričana. Zajedno beležimo trenutke, emocije i detalje koji govore više od reči.",
  description:
    "Čokoladni Foto & Video donosi premium fotografiju i video produkciju za svadbe, krštenja, rođendane i posebne trenutke koje želiš da pamtiš zauvek.",
  aboutEyebrow: "Priča iza kadra",
  aboutTitle: "Umetnost pripovedanja kroz objektiv",
  aboutLead:
    "Svaka fotografija je fragment života, lična priča uhvaćena u trenutku. Venčanja, proslave, krštenja i porodični trenutci — svaki zaslužuje pažnju, estetiku i emociju.",
  about:
    "Čokoladni Foto & Video je studio iz Kruševca koji spaja emociju, estetiku i moderan cinematic stil. Naš cilj je da svaki događaj izgleda prirodno, elegantno i filmski — bez ukočenih kadrova, bez generičnih scena, već sa pažnjom prema detaljima, atmosferi i pravim trenucima.",
  footerDescription:
    "Premium foto & video produkcija za svadbe, proslave i posebne trenutke.",
  location: "Kruševac, Srbija",
  phone: "062 187 2069",
  phoneHref: "tel:+381621872069",
  instagram: "https://instagram.com/cokoladni.photo",
  email: "info@cokoladni.photo",
};

export const navLinks = [
  { label: "Početna", href: "/" },
  { label: "Usluge", href: "/usluge" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Paketi", href: "/paketi" },
  { label: "O nama", href: "/o-nama" },
  { label: "Proces", href: "/proces" },
  { label: "Kontakt", href: "/kontakt" },
];

export const songsPageHref = "/pesme";

export function songsCategoryHref(categoryId: string) {
  return `/pesme?kategorija=${categoryId}`;
}

export const heroStats = [
  { label: "Foto", icon: "camera" },
  { label: "Video", icon: "video" },
  { label: "Dron", icon: "drone" },
  { label: "Reels", icon: "reels" },
];

export const services = [
  {
    id: "foto",
    title: "Profesionalna fotografija",
    description: "Kvalitetne, emotivne fotografije za svadbe, proslave i posebne trenutke.",
    icon: "camera",
  },
  {
    id: "video",
    title: "Video snimanje",
    description: "Profesionalno snimanje događaja sa filmskim pristupom i dinamikom.",
    icon: "video",
  },
  {
    id: "dron",
    title: "Dron snimci iz vazduha",
    description: "Spektakularni kadrovi iz vazduha koji dodaju novu dimenziju vašem događaju.",
    icon: "drone",
  },
  {
    id: "zvuk",
    title: "Zvuk direktno iz miksete",
    description: "Kristalan zvuk sa proslave — govor, muzika i atmosfera bez kompromisa.",
    icon: "audio",
  },
  {
    id: "film",
    title: "Montirani film",
    description: "Emotivan montirani film vašeg najlepšeg dana, spreman za deljenje.",
    icon: "film",
  },
  {
    id: "reels",
    title: "Reels snimci za društvene mreže",
    description: "Kratki, dinamični klipovi optimizovani za Instagram, TikTok i Facebook.",
    icon: "reels",
  },
  {
    id: "hd",
    title: "Digitalna isporuka u HD-u",
    description: "Materijal u punoj rezoluciji — online galerija i brza digitalna isporuka.",
    icon: "hd",
  },
  {
    id: "intervjui",
    title: "Intervjui i izjave gostiju",
    description: "Topli, iskreni trenutci i poruke od najmilijih — zauvek sačuvani.",
    icon: "mic",
  },
  {
    id: "sync",
    title: "Usklađivanje zvuka i slike",
    description: "Profesionalna sinhronizacija zvuka i slike za besprekoran finalni produkt.",
    icon: "sync",
  },
  {
    id: "celodnevno",
    title: "Snimanje celog dana",
    description: "Od pripreme do poslednjeg plesa — ni jedan važan trenutak ne prolazi nezabeležen.",
    icon: "clock",
  },
];

export const whyUsFeatures = [
  {
    id: "oprema",
    title: "Profesionalna oprema",
    description: "Foto, video i dron — sve što je potrebno za premium rezultat.",
    icon: "camera",
  },
  {
    id: "celodnevno",
    title: "Celodnevno snimanje",
    description: "Od pripreme do završetka proslave — tu smo za celu priču.",
    icon: "clock",
  },
  {
    id: "montaza",
    title: "Montaža i isporuka",
    description: "Film, reels i HD materijal — spremno za deljenje sa porodicom i prijateljima.",
    icon: "film",
  },
  {
    id: "lokalno",
    title: "Lokalno prisustvo",
    description: "Kruševac i okolina — ličan pristup i razumevanje lokalne atmosfere.",
    icon: "location",
  },
];

export const galleryImages = [
  { id: "g1", src: "/images/gallery/01.jpg", title: "Venčanje", category: "Svadbe" },
  { id: "g2", src: "/images/gallery/02.jpg", title: "Proslava", category: "Proslave" },
  { id: "g3", src: "/images/gallery/03.jpg", title: "Portret", category: "Portreti" },
  { id: "g4", src: "/images/gallery/04.jpg", title: "Detalji", category: "Svadbe" },
  { id: "g5", src: "/images/gallery/05.jpg", title: "Krštenje", category: "Krštenja" },
  { id: "g6", src: "/images/gallery/06.jpg", title: "Studio", category: "Studio" },
  { id: "g7", src: "/images/gallery/07.jpg", title: "Cinematic", category: "Video" },
  { id: "g8", src: "/images/gallery/08.jpg", title: "Dron", category: "Dron" },
];

export const portfolioCategories = [
  "Sve",
  "Svadbe",
  "Krštenja",
  "Rođendani",
  "Studio",
  "Video",
  "Dron",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export const heroImage = "/images/gallery/01.jpg";
export const aboutImage = "/images/gallery/03.jpg";
export const contactBgImage = "/images/gallery/06.jpg";

export const portfolioItems = [
  {
    id: "prvi-ples",
    src: "/images/portfolio/01-prvi-ples.jpg",
    title: "Prvi ples",
    category: "Svadbe" as PortfolioCategory,
    tag: "Wedding moment",
  },
  {
    id: "detalji",
    src: "/images/portfolio/02-detalji.jpg",
    title: "Detalji venčanja",
    category: "Svadbe" as PortfolioCategory,
    tag: "Details",
  },
  {
    id: "portret",
    src: "/images/portfolio/03-portret.jpg",
    title: "Portret mladenaca",
    category: "Svadbe" as PortfolioCategory,
    tag: "Portrait",
  },
  {
    id: "ples",
    src: "/images/portfolio/04-ples.jpg",
    title: "Plesni podijum",
    category: "Rođendani" as PortfolioCategory,
    tag: "Dance floor",
  },
  {
    id: "porodica",
    src: "/images/portfolio/05-porodica.jpg",
    title: "Porodična proslava",
    category: "Krštenja" as PortfolioCategory,
    tag: "Baptism",
  },
  {
    id: "studio",
    src: "/images/portfolio/06-studio.jpg",
    title: "Studio portret",
    category: "Studio" as PortfolioCategory,
    tag: "Studio",
  },
  {
    id: "video",
    src: "/images/portfolio/07-video.jpg",
    title: "Cinematic kadar",
    category: "Video" as PortfolioCategory,
    tag: "Cinematic frame",
  },
  {
    id: "dron",
    src: "/images/portfolio/08-dron.jpg",
    title: "Aerial view",
    category: "Dron" as PortfolioCategory,
    tag: "Drone",
  },
  {
    id: "prstenje",
    src: "/images/portfolio/09-prstenje.jpg",
    title: "Prstenje",
    category: "Svadbe" as PortfolioCategory,
    tag: "Rings",
  },
];

export const packages = [
  {
    id: "foto",
    name: "Foto paket",
    description: "Profesionalna fotografija za vaš poseban dan.",
    features: [
      "Profesionalno fotografisanje",
      "Obrada fotografija",
      "Online galerija",
      "Isporuka u punoj rezoluciji",
    ],
    highlighted: false,
  },
  {
    id: "video",
    name: "Video paket",
    description: "Filmski pristup snimanju i montaži vašeg događaja.",
    features: [
      "Snimanje događaja",
      "Montiran film",
      "Kratki reels",
      "Profesionalni zvuk",
    ],
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium Foto + Video",
    description: "Kompletna priča vašeg događaja — foto, video i dron.",
    features: [
      "Foto + video tim",
      "Dron snimci",
      "Kratki highlight video",
      "Kompletna priča događaja",
    ],
    highlighted: true,
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Upoznavanje i dogovor",
    description:
      "Razgovaramo o vašem događaju, viziji i očekivanjima — da sve bude po vašem ukusu.",
    animation: "meeting",
  },
  {
    step: "02",
    title: "Plan snimanja",
    description:
      "Pripremamo detaljan plan — lokacije, trenutci, timing i posebne zahteve.",
    animation: "plan",
  },
  {
    step: "03",
    title: "Fotografisanje i produkcija",
    description:
      "Snimamo sa pažnjom, diskretno i profesionalno — hvatamo prave emocije.",
    animation: "camera",
  },
  {
    step: "04",
    title: "Obrada i isporuka",
    description:
      "Montaža, obrada i isporuka materijala u punoj rezoluciji — spremno za deljenje.",
    animation: "delivery",
  },
];

export type { Song, SongCategory } from "./songs/types";
export { songCategories } from "./songs/index";
