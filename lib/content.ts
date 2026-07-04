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
    "Fotografisanje i snimanje veselja, venčanja, rođendana, krštenja i događaja.",
  location: "Kruševac, Srbija",
  phone: "062 187 2069",
  phoneHref: "tel:+381621872069",
  whatsapp: "https://wa.me/381621872069",
  instagram: "https://instagram.com/cokoladni.foto",
  email: "info@cokoladni.rs",
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
    image: "/images/services/foto.png",
  },
  {
    id: "video",
    title: "Video snimanje",
    description: "Profesionalno snimanje događaja sa filmskim pristupom i dinamikom.",
    icon: "video",
    image: "/images/services/video.png",
  },
  {
    id: "dron",
    title: "Dron snimci iz vazduha",
    description: "Spektakularni kadrovi iz vazduha koji dodaju novu dimenziju vašem događaju.",
    icon: "drone",
    image: "/images/services/dron.png",
  },
  {
    id: "zvuk",
    title: "Zvuk direktno iz miksete",
    description: "Kristalan zvuk sa proslave — govor, muzika i atmosfera bez kompromisa.",
    icon: "audio",
    image: "/images/services/zvuk.png",
  },
  {
    id: "film",
    title: "Montirani film",
    description: "Emotivan montirani film vašeg najlepšeg dana, spreman za deljenje.",
    icon: "film",
    image: "/images/services/film.png",
  },
  {
    id: "reels",
    title: "Reels snimci za društvene mreže",
    description: "Kratki, dinamični klipovi optimizovani za Instagram, TikTok i Facebook.",
    icon: "reels",
    image: "/images/services/reels.png",
  },
  {
    id: "hd",
    title: "Digitalna isporuka u HD-u",
    description: "Materijal u punoj rezoluciji — online galerija i brza digitalna isporuka.",
    icon: "hd",
    image: "/images/services/hd.png",
  },
  {
    id: "intervjui",
    title: "Intervjui i izjave gostiju",
    description: "Topli, iskreni trenutci i poruke od najmilijih — zauvek sačuvani.",
    icon: "mic",
    image: "/images/services/intervjui.png",
  },
  {
    id: "sync",
    title: "Usklađivanje zvuka i slike",
    description: "Profesionalna sinhronizacija zvuka i slike za besprekoran finalni produkt.",
    icon: "sync",
    image: "/images/services/sync.png",
  },
  {
    id: "celodnevno",
    title: "Snimanje celog dana",
    description: "Od pripreme do poslednjeg plesa — ni jedan važan trenutak ne prolazi nezabeležen.",
    icon: "clock",
    image: "/images/services/celodnevno.png",
  },
  {
    id: "love-story",
    title: "Love story snimanje",
    description:
      "Priča pre velikog dana — opušteni portreti, emocija i kadrovi koji uvode u venčanje.",
    icon: "heart",
    image: "/images/services/love-story.png",
  },
  {
    id: "preview",
    title: "Brzi preview istog dana",
    description:
      "Kratki klip ili foto selekcija spremna veče proslave — prvi osmeh pre finalne isporuke.",
    icon: "spark",
    image: "/images/services/preview.png",
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

export const footerNavLinks = [
  { label: "Početna", href: "/" },
  { label: "Radovi", href: "/portfolio" },
  { label: "Paketi", href: "/paketi" },
  { label: "Kontakt", href: "/kontakt" },
];

export const homeImages = {
  heroBg: "/images/home/hero-bg.png",
  heroNight: "/images/home/hero-night.png",
  charlieReflector: "/images/home/charlie-reflector.png",
  charlieStudio: "/images/home/charlie-studio.png",
  charlieNeon: "/images/home/charlie-neon.png",
  charlieEquipment: "/images/home/charlie-equipment.png",
  charlieTrunk: "/images/home/charlie-trunk.png",
  charliePortrait: "/images/home/charlie-portrait.png",
  charlieDesk: "/images/home/charlie-desk.png",
  venueInterior: "/images/home/venue-interior.png",
  processContact: "/images/home/process-contact.png",
  heroMobile: "/images/home/hero-mobile.png",
  charlieBanner: "/images/home/charlie-banner.png",
};

export const homeHero = {
  title: "Tvoj dan. Naš kadar. Uspomena zauvek.",
  subtitle:
    "Fotografisanje i snimanje venčanja, rođendana, krštenja i svih veselja — kroz moderan, emotivan i filmski pristup.",
  primaryCta: "Rezerviši termin",
  secondaryCta: "Pogledaj radove",
  tags: "Venčanja • Rođendani • Krštenja • Proslave • Događaji",
  background: homeImages.heroBg,
  backgroundMobile: homeImages.heroMobile,
};

export const emotiveIntro = {
  title: "Proslava traje jedan dan. Uspomene ostaju zauvek.",
  text: "Zato ne hvatamo samo osmehe, ples i dekoraciju. Hvatamo osećaj tog dana — pogled, zagrljaj, tremu, svetlo, atmosferu i sve one trenutke koji se više ne ponavljaju.",
};

export const whatWeShoot = [
  {
    id: "vencanja",
    title: "Venčanja",
    description:
      "Od priprema i dočeka svatova, do prvog plesa i poslednje pesme.",
    icon: "rings",
  },
  {
    id: "rodendani",
    title: "Rođendani",
    description:
      "18. rođendani, dečiji rođendani i proslave koje zaslužuju posebnu priču.",
    icon: "cake",
  },
  {
    id: "krstenja",
    title: "Krštenja",
    description:
      "Diskretno, emotivno i sa pažnjom na porodicu, detalje i atmosferu.",
    icon: "family",
  },
  {
    id: "dogadjaji",
    title: "Događaji i veselja",
    description:
      "Proslave, firme, lokali, koncerti, promocije i privatni događaji.",
    icon: "event",
  },
];

export const charlieSection = {
  title: "Ja hvatam kadar. Čarli čuva svetlo.",
  text: "Iza svakog dobrog kadra stoji priprema, oprema i malo magije. Čarli je naš mali čuvar svetla — simbol pažnje, detalja i energije koju unosimo u svaku priču.",
  slogan: "Kamera je moja. Svetlo je Čarlijevo. Uspomene su tvoje.",
  background: homeImages.charlieBanner,
  image: homeImages.charlieReflector,
};

export const homeProcessSteps = [
  {
    step: "01",
    title: "Dogovor",
    description:
      "Pričamo o događaju, lokaciji, satnici i svemu što ti je važno.",
  },
  {
    step: "02",
    title: "Snimanje",
    description:
      "Dolazimo spremni, pratimo emociju i hvatamo trenutke koji se ne ponavljaju.",
  },
  {
    step: "03",
    title: "Obrada",
    description:
      "Biramo najbolje kadrove, obrađujemo fotografije i montiramo video priču.",
  },
  {
    step: "04",
    title: "Isporuka",
    description:
      "Dobijaš materijal spreman za čuvanje, deljenje i gledanje iznova.",
  },
];

export const homePortfolioCategories = [
  "Venčanja",
  "Rođendani",
  "Krštenja",
  "Proslave",
  "Reels / video",
] as const;

export type HomePortfolioCategory = (typeof homePortfolioCategories)[number];

export const homePortfolioItems = [
  {
    id: "hp1",
    src: homeImages.heroBg,
    title: "Venčanje na otvorenom",
    category: "Venčanja" as HomePortfolioCategory,
  },
  {
    id: "hp2",
    src: homeImages.heroNight,
    title: "Večernji doček",
    category: "Venčanja" as HomePortfolioCategory,
  },
  {
    id: "hp3",
    src: homeImages.charlieNeon,
    title: "Portret u studiju",
    category: "Rođendani" as HomePortfolioCategory,
  },
  {
    id: "hp4",
    src: homeImages.charliePortrait,
    title: "Emotivni portret",
    category: "Krštenja" as HomePortfolioCategory,
  },
  {
    id: "hp5",
    src: homeImages.venueInterior,
    title: "Proslava u lokalu",
    category: "Proslave" as HomePortfolioCategory,
  },
  {
    id: "hp6",
    src: homeImages.charlieEquipment,
    title: "Atmosfera događaja",
    category: "Proslave" as HomePortfolioCategory,
  },
  {
    id: "hp7",
    src: homeImages.charlieStudio,
    title: "Montaža priče",
    category: "Reels / video" as HomePortfolioCategory,
  },
  {
    id: "hp8",
    src: homeImages.charlieDesk,
    title: "Video forma",
    category: "Reels / video" as HomePortfolioCategory,
  },
  {
    id: "hp9",
    src: homeImages.charlieTrunk,
    title: "Priprema opreme",
    category: "Venčanja" as HomePortfolioCategory,
  },
];

export const photoVideo = {
  title: "Jedan tim. Cela priča.",
  text: "Fotografija čuva trenutak. Video vraća atmosferu. Zato spajamo oba — da tvoj dan ostane zabeležen kroz emociju, pokret, zvuk i kadar.",
  columns: [
    {
      title: "Fotografija",
      text: "Za detalje, osmehe, portrete i trenutke koji stanu u jedan savršen kadar.",
      icon: "camera",
    },
    {
      title: "Video",
      text: "Za atmosferu, pokret, muziku, emociju i priču koju možeš da pogledaš iznova.",
      icon: "video",
    },
  ],
};

export const homeWhyUsBenefits = [
  { id: "stil", title: "Moderan i filmski stil", icon: "film" },
  { id: "paket", title: "Fotografija i video u paketu", icon: "camera" },
  { id: "dron", title: "Dron kadrovi po dogovoru", icon: "drone" },
  { id: "reels", title: "Reels za društvene mreže", icon: "reels" },
  { id: "iskustvo", title: "Iskustvo sa proslavama i događajima", icon: "clock" },
  { id: "obrada", title: "Emotivna obrada i pažnja na detalje", icon: "hd" },
];

export const homePackages = [
  {
    id: "foto",
    name: "Foto paket",
    description:
      "Fotografisanje događaja, obrada fotografija i isporuka materijala u digitalnom formatu.",
    highlighted: false,
  },
  {
    id: "foto-video",
    name: "Foto + Video paket",
    description:
      "Fotografisanje, video snimanje i kratka video forma za društvene mreže.",
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium paket",
    description:
      "Celodnevno praćenje događaja, foto, video priča, reels i dodatni kadrovi po dogovoru.",
    highlighted: true,
  },
];

export const testimonials = [
  {
    id: "t1",
    quote:
      "Fotografije su nam vratile ceo dan nazad. Svaki detalj, svaki osmeh, sve je tu.",
    author: "Mladenci",
  },
  {
    id: "t2",
    quote:
      "Video ima emociju, nije samo snimak. Baš ono što smo želeli.",
    author: "Porodica M.",
  },
  {
    id: "t3",
    quote: "Profesionalno, opušteno i drugačije. Sve preporuke.",
    author: "Klijent",
  },
];

export const closingCta = {
  title: "Tvoj datum zaslužuje da bude sačuvan.",
  text: "Venčanje, rođendan, krštenje ili proslava — javi nam datum i napravićemo priču koju ćeš gledati godinama.",
  brand: "Čokoladni Foto & Video",
  reservations: "Rezervacije: 062 187 2069",
  location: "Kruševac / Srbija",
  callCta: "Pozovi odmah",
  messageCta: "Pošalji poruku",
  instagramCta: "Pogledaj Instagram",
};

export const processContactCta = {
  eyebrow: "Sledeći korak",
  title: "Spremni da zakažemo tvoj dan?",
  subtitle:
    "Pošalji datum, tip događaja i lokaciju — proverićemo dostupnost i javićemo se sa ponudom.",
  image: homeImages.processContact,
  imageAlt: "Tim na obradi fotografija u studiju",
};

export type { Song, SongCategory } from "./songs/types";
export { songCategories } from "./songs/index";
