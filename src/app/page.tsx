"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ClickSpark from "@/components/ui/ClickSpark";
import BubbleMenu from "@/components/ui/BubbleMenu";

const Ballpit = dynamic(() => import("@/components/ui/Ballpit"), {
  ssr: false,
});

const LightPillar = dynamic(() => import("@/components/ui/LightPillar"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface EventItem {
  id: string;
  title: string;
  date: string;
  tagline: string;
  gradient: string;
  accent: string;
  duration: string;
  description: string[];
  highlights: string[];
}

interface TeamMember {
  name: string;
  role: string;
  tagline: string;
  avatar: string;
  socials?: { label: string; url: string }[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const menuItems = [
  { label: "home", href: "#", ariaLabel: "Home", rotation: -8, hoverStyles: { bgColor: "#40e0d0", textColor: "#000000" } },
  { label: "about", href: "#about", ariaLabel: "About", rotation: 8, hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" } },
  { label: "events", href: "#events", ariaLabel: "Events", rotation: 8, hoverStyles: { bgColor: "#9900ff", textColor: "#ffffff" } },
  { label: "team", href: "#team", ariaLabel: "Team", rotation: 8, hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" } },
  { label: "contact", href: "#contact", ariaLabel: "Contact", rotation: -8, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
];

const pastEvents: EventItem[] = [
  {
    id: "sparklab",
    title: "NMIT Sparklab 2025",
    date: "March 15, 2025",
    tagline: "30-Hour Designathon",
    gradient: "from-rose-400 via-pink-300 to-amber-200",
    accent: "#f43f5e",
    duration: "30 hours",
    description: [
      "NMIT Sparklab 2025 was an exhilarating 30-hour designathon that brought together the brightest creative minds on campus. Teams of designers, developers, and innovators collaborated non-stop to solve real-world UX challenges.",
      "Participants were given problem statements from industry partners and had to ideate, prototype, and present fully functional design solutions within the time limit. The event featured mentorship sessions, surprise mini-challenges, and an electrifying final showcase.",
    ],
    highlights: [
      "120+ participants across 30 teams",
      "Industry mentors from top design studios",
      "Cash prizes worth \u20B950,000",
      "Best designs featured in the college newsletter",
    ],
  },
  {
    id: "figma-unplugged",
    title: "Figma Unplugged",
    date: "August 22, 2025",
    tagline: "1-Day Figma Workshop",
    gradient: "from-violet-500 via-purple-400 to-fuchsia-300",
    accent: "#8b5cf6",
    duration: "1 day",
    description: [
      "Figma Unplugged was a hands-on, full-day workshop dedicated to mastering Figma \u2014 from the fundamentals to advanced prototyping techniques. Whether you were a complete beginner or an intermediate user, there was something for everyone.",
      "The workshop covered auto-layout, components & variants, interactive prototyping, design tokens, and collaboration workflows. Attendees walked away with a polished portfolio-ready project built entirely during the session.",
    ],
    highlights: [
      "Beginner-to-advanced structured curriculum",
      "Live project: redesigning a campus app",
      "Certificate of completion for all attendees",
      "Free Figma swag kits for participants",
    ],
  },
  {
    id: "race-to-innovate",
    title: "Race to Innovate",
    date: "November 8, 2025",
    tagline: "Anaadyanta \u00B7 Geekmayhem",
    gradient: "from-cyan-400 via-teal-300 to-emerald-400",
    accent: "#14b8a6",
    duration: "2 days",
    description: [
      "Race to Innovate was Dise\u00F1o Divino\u2019s flagship event at NMIT\u2019s annual cultural-techno fest Anaadyanta, under the Geekmayhem tech track. It challenged participants to design innovative solutions for real community problems.",
      "The event blended design thinking, rapid prototyping, and pitch presentations. Teams raced against the clock to create user-centric solutions that were judged by a panel of industry experts and faculty.",
    ],
    highlights: [
      "Part of NMIT\u2019s Anaadyanta fest",
      "Design thinking + rapid prototyping format",
      "Judged by industry professionals",
      "Winning team featured at the main stage",
    ],
  },
];

const upcomingEvents: EventItem[] = [
  {
    id: "race-to-innovate-2",
    title: "Race to Innovate 2.0",
    date: "March 2026",
    tagline: "Anaadyanta \u00B7 Geekmayhem 2026",
    gradient: "from-[#40e0d0] via-cyan-400 to-blue-500",
    accent: "#40e0d0",
    duration: "2 days",
    description: [
      "Race to Innovate is back \u2014 bigger and bolder! The second edition returns as part of Anaadyanta, Geekmayhem 2026 with an expanded format, more industry partners, and higher stakes.",
      "This year\u2019s edition introduces a multi-round format: online qualifier, on-campus design sprint, and a grand finale pitch to a panel of VCs and design leaders. Expect workshops, networking sessions, and prizes that\u2019ll make your portfolio shine.",
    ],
    highlights: [
      "Multi-round competition format",
      "Industry partner challenge statements",
      "Workshops & networking sessions",
      "Grand prizes + internship opportunities",
    ],
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Srivathsa S Murthy",
    role: "President",
    tagline: "Leading the vision for divine design",
    avatar: "",
  },
  {
    name: "Rohith Vishwanath",
    role: "Secretary",
    tagline: "Orchestrating every move behind the scenes",
    avatar: "",
  },
  {
    name: "Sriram P S",
    role: "Treasurer",
    tagline: "Keeping the numbers as sharp as the designs",
    avatar: "",
  },
  {
    name: "Yogesh Kumar Singh",
    role: "UI/UX Head",
    tagline: "Crafting experiences that feel effortless",
    avatar: "",
  },
  {
    name: "Devanshu",
    role: "UI/UX Co-Head",
    tagline: "Pixel-perfect is the bare minimum",
    avatar: "",
  },
  {
    name: "Wilfred D'souza",
    role: "Tech Head",
    tagline: "Engineering the backbone of every experience",
    avatar: "",
  },
  {
    name: "Abhishek J C",
    role: "Tech Co-Head",
    tagline: "Turning designs into living, breathing code",
    avatar: "",
  },
  {
    name: "Vibhas Reddy",
    role: "Graphics Head",
    tagline: "Where aesthetics meet purpose",
    avatar: "",
  },
  {
    name: "Udit Jayan",
    role: "Graphics Co-Head",
    tagline: "Turning concepts into visual stories",
    avatar: "",
  },
  {
    name: "Aasiya Shariff",
    role: "Social Media Head",
    tagline: "Amplifying the Divino voice online",
    avatar: "",
  },
  {
    name: "Diya Sharma",
    role: "Social Media Co-Head",
    tagline: "Curating content that connects and inspires",
    avatar: "",
  },
  {
    name: "Sahil Yadav",
    role: "PR-Marketing & Sponsorship Head",
    tagline: "Building bridges between brands and creativity",
    avatar: "",
  },
  {
    name: "Anirudha Acharya P",
    role: "PR-Marketing & Sponsorship Co-Head",
    tagline: "Forging partnerships that fuel innovation",
    avatar: "",
  },
  {
    name: "Somesh K",
    role: "Operations Head",
    tagline: "Making sure everything runs like clockwork",
    avatar: "",
  },
  {
    name: "Prarthana T Raj",
    role: "Operations Co-Head",
    tagline: "The backbone of every flawless event",
    avatar: "",
  },
];

/* ------------------------------------------------------------------ */
/*  Event-Card Component                                               */
/* ------------------------------------------------------------------ */
function EventCard({ event, onOpen }: { event: EventItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full max-w-sm text-left rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
    >
      <div className={`relative h-48 w-full bg-gradient-to-br ${event.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white">
          {event.duration}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white group-hover:text-[#40e0d0] transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-white/50 mt-1">{event.tagline}</p>
        <div className="flex items-center gap-2 mt-3 text-white/40 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>{event.date}</span>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Event-Modal Component                                              */
/* ------------------------------------------------------------------ */
function EventModal({ event, onClose }: { event: EventItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0d1117]/95 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative h-44 w-full bg-gradient-to-br ${event.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <span className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-white">{event.duration}</span>
            <span className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-white">{event.date}</span>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{event.title}</h2>
          <p className="text-base font-medium mb-6" style={{ color: event.accent }}>{event.tagline}</p>
          <div className="space-y-4 mb-8">
            {event.description.map((para, i) => (
              <p key={i} className="text-white/70 text-base leading-relaxed">{para}</p>
            ))}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Highlights</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: event.accent }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Team-Card Component                                                */
/* ------------------------------------------------------------------ */
function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[300px] rounded-3xl border border-black/[0.08] bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:bg-white/60 group">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#40e0d0] to-[#9900ff] flex items-center justify-center mb-5 shadow-lg">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            width={96}
            height={96}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-white">{initials}</span>
        )}
      </div>

      {/* Info */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
      <span className="inline-block rounded-full bg-[#40e0d0]/15 px-3 py-0.5 text-xs font-semibold text-[#0d9488] mb-3 tracking-wide uppercase">
        {member.role}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{member.tagline}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsTab, setEventsTab] = useState<"upcoming" | "past">("upcoming");
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);
  const teamContentRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => setActiveEvent(null), []);

  /* ---- scroll-based dimming over Ballpit ---- */
  useEffect(() => {
    const onScroll = () => {
      const dim = dimRef.current;
      if (!dim) return;
      const heroH = window.innerHeight;
      const scrollY = window.scrollY;
      const start = heroH * 0.6;
      const end = heroH * 1.2;
      const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
      dim.style.opacity = String(progress * 0.55);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- team section: 3-phase scroll animation ---- */
  /* Phase 1 (0-25%): Just gradient background, content hidden            */
  /* Phase 2 (25-45%): Content + cards fade/slide in                      */
  /* Phase 3 (45-100%): Cards scroll horizontally right-to-left           */
  useEffect(() => {
    const section = teamSectionRef.current;
    const track = teamTrackRef.current;
    const content = teamContentRef.current;
    if (!section || !track || !content) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;

      // Overall progress through the section (0 → 1)
      const scrolled = -rect.top;
      const total = sectionH - viewH;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);

      // Phase 2: content reveal (progress 0.15 → 0.35)
      const revealStart = 0.15;
      const revealEnd = 0.35;
      const revealProgress = Math.min(Math.max((progress - revealStart) / (revealEnd - revealStart), 0), 1);
      // Ease-out cubic for smoother feel
      const easedReveal = 1 - Math.pow(1 - revealProgress, 3);
      content.style.opacity = String(easedReveal);
      content.style.transform = `translateY(${(1 - easedReveal) * 40}px)`;

      // Phase 3: horizontal scroll (progress 0.4 → 1.0)
      const scrollStart = 0.4;
      const scrollProgress = Math.min(Math.max((progress - scrollStart) / (1 - scrollStart), 0), 1);
      const container = track.parentElement;
      const visibleWidth = container ? container.offsetWidth : track.offsetWidth;
      const maxSlide = track.scrollWidth - visibleWidth + 96; // extra buffer for right margin
      if (maxSlide > 0) {
        track.style.transform = `translateX(-${scrollProgress * maxSlide}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shownEvents = eventsTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <ClickSpark sparkColor="#40e0d0" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <main className="relative bg-black">
        {/* Single Continuous Ballpit Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Ballpit
            count={50}
            gravity={0}
            friction={0.9975}
            wallBounce={0.95}
            followCursor={false}
            colors={["#40e0d0", "#40e0d0", "#000000", "#9900ff", "#ffffff"]}
          />
        </div>

        {/* Scroll-based dim overlay */}
        <div
          ref={dimRef}
          className="fixed inset-0 z-[1] bg-black pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Backdrop overlay when BubbleMenu is open */}
        <div
          className={`fixed inset-0 z-[97] bg-black/60 backdrop-blur-md transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        />

        {/* BubbleMenu Navbar */}
        <BubbleMenu
          logo={
            <Image
              src="/logos/Logo Transparent BG.png"
              alt="Dise&#241;o Divino Logo"
              width={120}
              height={40}
              style={{ objectFit: "contain", height: "32px", width: "auto" }}
              priority
            />
          }
          items={menuItems}
          onMenuClick={(isOpen) => setMenuOpen(isOpen)}
          menuAriaLabel="Toggle navigation"
          menuBg="#111111"
          menuContentColor="#ffffff"
          useFixedPosition={true}
          animationEase="elastic.out(1,0.5)"
          animationDuration={0.5}
          staggerDelay={0.19}
        />

        {/* ============================================================ */}
        {/*  HERO SECTION                                                 */}
        {/* ============================================================ */}
        <section className="relative z-10 h-screen w-full flex flex-col items-center justify-center text-center px-6">
          {/* NMIT Logo + Department */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logos/NMIT Blue.svg"
              alt="NMIT Logo"
              width={450}
              height={200}
              className="mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
            />
            <p className="text-xs md:text-base uppercase tracking-[0.5em] text-white/100 font-medium" style={{ textShadow: '0 0 15px rgba(255,255,255,0.15)' }}>
              Department of Artificial Intelligence &amp; Machine Learning
            </p>
          </div>

          <p className="text-sm md:text-base uppercase tracking-[0.35em] text-[#40e0d0] mb-4 font-medium" style={{ textShadow: "0 0 20px rgba(64,224,208,0.3)" }}>
            The UI/UX Club
          </p>
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.7), 0 0 80px rgba(0,0,0,0.5)" }}
          >
            <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">Dise&#241;o</span>{" "}
            <span className="text-[#40e0d0] drop-shadow-[0_0_35px_rgba(64,224,208,0.4)]">Divino</span>
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-white/70 leading-relaxed" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            Where creativity meets craft. We design, prototype, and build
            divine digital experiences &#8212; one pixel at a time.
          </p>
          <div className="mt-10 flex gap-4">
            <a href="#events" className="rounded-full bg-[#40e0d0] px-8 py-3 text-sm font-semibold text-black hover:bg-[#33b3a6] transition-colors">
              Explore Our Work
            </a>
            <a href="#contact" className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:border-[#40e0d0] hover:text-[#40e0d0] transition-colors">
              Join the Club
            </a>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  ABOUT SECTION                                                */}
        {/* ============================================================ */}
        <section id="about" className="relative z-10 min-h-screen w-full py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#40e0d0] mb-3 font-medium" style={{ textShadow: '0 0 20px rgba(64,224,208,0.4)' }}>Who We Are</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                About Dise&#241;o Divino
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl border border-[#40e0d0]/20 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] p-8 md:p-10 flex flex-col justify-center hover:border-[#40e0d0]/35 hover:shadow-[0_8px_40px_rgba(64,224,208,0.1)] transition-all duration-500">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ textShadow: '0 0 30px rgba(255,255,255,0.08)' }}>Our Story</h3>
                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                  Dise&#241;o Divino is a student-led organization dedicated to fostering a vibrant community of designers, artists, and developers. We believe in the power of collaboration and hands-on learning to push the boundaries of digital creativity.
                </p>
                <p className="text-white/80 text-base md:text-lg leading-relaxed mt-4">
                  Our goal is to provide a platform for students to grow their skills, connect with peers, and prepare for a career in the creative industries.
                </p>
              </div>

              <div className="lg:col-span-2 rounded-3xl border border-[#40e0d0]/30 bg-[#40e0d0]/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(64,224,208,0.15)] p-8 flex items-center justify-center hover:bg-[#40e0d0]/15 hover:shadow-[0_8px_48px_rgba(64,224,208,0.25)] transition-all duration-500">
                <h3 className="text-3xl md:text-4xl font-bold text-[#40e0d0] text-center" style={{ textShadow: '0 0 30px rgba(64,224,208,0.3)' }}>What We Do?</h3>
              </div>

              <div className="rounded-3xl border border-[#40e0d0]/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 flex flex-col group hover:bg-white/[0.12] hover:border-[#40e0d0]/30 hover:shadow-[0_8px_40px_rgba(64,224,208,0.12)] transition-all duration-400">
                <div className="w-12 h-12 rounded-2xl bg-[#40e0d0]/20 flex items-center justify-center mb-5 group-hover:bg-[#40e0d0]/30 group-hover:shadow-[0_0_20px_rgba(64,224,208,0.3)] transition-all duration-400">
                  <svg className="w-6 h-6 text-[#40e0d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Design Workshops</h4>
                <p className="text-white/70 text-sm leading-relaxed">Hands-on sessions covering UI/UX, graphic design, and 3D modeling.</p>
              </div>

              <div className="rounded-3xl border border-[#9900ff]/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 flex flex-col group hover:bg-white/[0.12] hover:border-[#9900ff]/30 hover:shadow-[0_8px_40px_rgba(153,0,255,0.12)] transition-all duration-400">
                <div className="w-12 h-12 rounded-2xl bg-[#9900ff]/20 flex items-center justify-center mb-5 group-hover:bg-[#9900ff]/30 group-hover:shadow-[0_0_20px_rgba(153,0,255,0.3)] transition-all duration-400">
                  <svg className="w-6 h-6 text-[#9900ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Creative Coding</h4>
                <p className="text-white/70 text-sm leading-relaxed">Explore the intersection of art and technology with generative art and interactive projects.</p>
              </div>

              <div className="rounded-3xl border border-[#40e0d0]/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 flex flex-col group hover:bg-white/[0.12] hover:border-[#40e0d0]/30 hover:shadow-[0_8px_40px_rgba(64,224,208,0.12)] transition-all duration-400">
                <div className="w-12 h-12 rounded-2xl bg-[#40e0d0]/20 flex items-center justify-center mb-5 group-hover:bg-[#40e0d0]/30 group-hover:shadow-[0_0_20px_rgba(64,224,208,0.3)] transition-all duration-400">
                  <svg className="w-6 h-6 text-[#40e0d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Industry Talks</h4>
                <p className="text-white/70 text-sm leading-relaxed">Learn from professionals who are leading and shaping the design industry.</p>
              </div>

              <div className="rounded-3xl border border-[#9900ff]/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 flex flex-col group hover:bg-white/[0.12] hover:border-[#9900ff]/30 hover:shadow-[0_8px_40px_rgba(153,0,255,0.12)] transition-all duration-400">
                <div className="w-12 h-12 rounded-2xl bg-[#9900ff]/20 flex items-center justify-center mb-5 group-hover:bg-[#9900ff]/30 group-hover:shadow-[0_0_20px_rgba(153,0,255,0.3)] transition-all duration-400">
                  <svg className="w-6 h-6 text-[#9900ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Collaborative Projects</h4>
                <p className="text-white/70 text-sm leading-relaxed">Team up to build real-world projects, honing your skills and building your portfolio.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  EVENTS SECTION                                               */}
        {/* ============================================================ */}
        <section id="events" className="relative z-10 min-h-screen w-full py-24 px-6 md:px-12 lg:px-20">
          {/* Dark base + animated LightPillar background */}
          <div className="absolute inset-0 bg-[#050a14] z-0" />
          <div className="absolute inset-0 z-[1] overflow-hidden">
            <LightPillar
              topColor="#5227FF"
              bottomColor="#40e0d0"
              intensity={0.5}
              rotationSpeed={0.5}
              interactive
              glowAmount={0.0012}
              pillarWidth={4.5}
              pillarHeight={0.4}
              noiseIntensity={0.4}
              pillarRotation={85}
              quality="medium"
            />
          </div>
          {/* Dim overlay to soften the effect */}
          <div className="absolute inset-0 z-[2] bg-black/35 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#40e0d0] mb-3 font-medium">What&apos;s Happening</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">Events</h2>
            </div>

            <div className="flex justify-center mb-14">
              <div className="inline-flex rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm p-1">
                <button
                  type="button"
                  onClick={() => setEventsTab("upcoming")}
                  className={`px-6 sm:px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${eventsTab === "upcoming" ? "bg-white text-black" : "text-white/50 hover:text-white/80"
                    }`}
                >
                  Upcoming Events
                </button>
                <button
                  type="button"
                  onClick={() => setEventsTab("past")}
                  className={`px-6 sm:px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${eventsTab === "past" ? "bg-white text-black" : "text-white/50 hover:text-white/80"
                    }`}
                >
                  Past Events
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {shownEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} onOpen={() => setActiveEvent(ev)} />
              ))}
            </div>

            {shownEvents.length === 0 && (
              <p className="text-center text-white/40 text-lg mt-12">No events to show yet. Stay tuned!</p>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  TEAM SECTION  (horizontal scroll-on-scroll carousel)         */}
        {/* ============================================================ */}
        <section
          id="team"
          ref={teamSectionRef}
          className="relative z-10 overflow-x-clip"
          style={{ height: "700vh" }}
        >
          {/* White-to-slight-gray gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f0f0f0] to-[#e8e8e8] z-0" />

          {/* Sticky container that holds the visible carousel viewport */}
          <div className="sticky top-0 h-screen z-10 flex flex-col py-6">
            {/* Animated content wrapper — starts hidden, revealed on scroll */}
            <div
              ref={teamContentRef}
              className="will-change-transform font-body flex flex-col h-full"
              style={{ opacity: 0, transform: "translateY(40px)" }}
            >
              {/* Section Header */}
              <div className="text-center pb-2 px-6 flex-shrink-0">
                <p className="text-sm uppercase tracking-[0.3em] text-[#0d9488] mb-2 font-medium font-body">
                  The People
                </p>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                  Meet Our Team
                </h2>
                <p className="mt-3 text-base text-gray-500 max-w-lg mx-auto font-body">
                  The creative minds behind every event, every pixel, and every experience.
                </p>
              </div>

              {/* Faculty Advisor — centered above the carousel */}
              <div className="flex justify-center px-6 md:px-12 mb-4 flex-shrink-0">
                <div className="flex-shrink-0 w-[280px] sm:w-[300px] rounded-3xl border border-[#d4a853]/30 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_12px_40px_rgba(212,168,83,0.15)] hover:bg-white/60 group">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 shadow-lg" style={{ background: 'linear-gradient(135deg, #d4a853, #b8860b)' }}>
                    <span className="text-2xl font-bold text-white drop-shadow-md">MGK</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Prof. Madhura G K</h3>
                  <span className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold text-white mb-3 tracking-wide uppercase" style={{ background: 'linear-gradient(135deg, #d4a853, #b8860b)' }}>
                    Faculty Advisor
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>Guiding the club with wisdom and vision</p>
                </div>
              </div>

              {/* Carousel Track */}
              <div className="flex-1 flex items-center w-full px-6 md:px-12 min-h-0">
                <div
                  ref={teamTrackRef}
                  className="flex gap-6 will-change-transform pr-24"
                  style={{ transform: "translateX(0px)", width: "max-content" }}
                >
                  {teamMembers.map((member, i) => (
                    <TeamCard key={i} member={member} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CONTACT SECTION                                              */}
        {/* ============================================================ */}
        <section id="contact" className="relative z-10 min-h-screen w-full py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 bg-[#050510] z-0" />
          <div
            className="absolute inset-0 z-[1] opacity-40"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 40%, rgba(64,224,208,0.15) 0%, transparent 70%),
                radial-gradient(ellipse 60% 80% at 80% 60%, rgba(153,0,255,0.12) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 50% 100%, rgba(82,39,255,0.1) 0%, transparent 60%)
              `,
            }}
          />

          {/* Floating decorative orbs */}
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-[#40e0d0]/5 blur-3xl z-[1]" style={{ animation: 'contactFloat 8s ease-in-out infinite' }} />
          <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-[#9900ff]/5 blur-3xl z-[1]" style={{ animation: 'contactFloat 10s ease-in-out infinite 2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5227FF]/5 blur-3xl z-[1]" style={{ animation: 'contactPulse 6s ease-in-out infinite' }} />

          {/* Grid lines decoration */}
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-[0.3em] text-[#40e0d0] mb-3 font-medium" style={{ textShadow: '0 0 20px rgba(64,224,208,0.4)' }}>Get In Touch</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight" style={{ textShadow: '0 0 60px rgba(255,255,255,0.08)' }}>
                Let&apos;s Create Together
              </h2>
              <p className="mt-5 text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                Have a question, idea, or want to collaborate? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left column — Info & Socials */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Contact info cards */}
                <a href="mailto:diseno.divino@nmit.ac.in" className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center gap-5 hover:border-[#40e0d0]/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(64,224,208,0.08)] transition-all duration-400">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#40e0d0]/20 to-[#40e0d0]/5 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_25px_rgba(64,224,208,0.25)] transition-all duration-400">
                    <svg className="w-6 h-6 text-[#40e0d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Email Us</p>
                    <p className="text-white/90 font-medium group-hover:text-[#40e0d0] transition-colors">diseno.divino@nmit.ac.in</p>
                  </div>
                </a>

                <a href="https://instagram.com/diseno.divino.nmit" target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center gap-5 hover:border-[#9900ff]/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(153,0,255,0.08)] transition-all duration-400">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9900ff]/20 to-[#9900ff]/5 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_25px_rgba(153,0,255,0.25)] transition-all duration-400">
                    <svg className="w-6 h-6 text-[#9900ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Instagram</p>
                    <p className="text-white/90 font-medium group-hover:text-[#9900ff] transition-colors">@diseno.divino.nmit</p>
                  </div>
                </a>

                <a href="https://linkedin.com/company/diseño-divino" target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center gap-5 hover:border-[#40e0d0]/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(64,224,208,0.08)] transition-all duration-400">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#40e0d0]/20 to-[#5227FF]/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_25px_rgba(64,224,208,0.25)] transition-all duration-400">
                    <svg className="w-6 h-6 text-[#40e0d0]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">LinkedIn</p>
                    <p className="text-white/90 font-medium group-hover:text-[#40e0d0] transition-colors">Diseño Divino</p>
                  </div>
                </a>

                {/* Location */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5227FF]/20 to-[#9900ff]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#9900ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Location</p>
                    <p className="text-white/90 font-medium">NMIT, Bangalore</p>
                  </div>
                </div>
              </div>

              {/* Right column — Newsletter */}
              <div className="lg:col-span-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_16px_64px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] p-8 md:p-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#40e0d0]/20 to-[#5227FF]/10 flex items-center justify-center mb-4">
                    <svg width="24" height="24" className="text-[#40e0d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
                  <p className="text-white/50 text-sm mb-8 leading-relaxed">Subscribe to our newsletter for the latest events, design inspiration, and club updates — delivered straight to your inbox.</p>

                  <form
                    className="space-y-6"
                    action="https://formsubmit.co/diseno.divino@nmit.ac.in"
                    method="POST"
                  >
                    <input type="hidden" name="_subject" value="New Newsletter Subscriber!" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="box" />
                    <input type="hidden" name="_next" value="https://diseno-divino.vercel.app/?subscribed=true" />

                    <div>
                      <label htmlFor="newsletter-name" className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Name</label>
                      <input
                        id="newsletter-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-white/25 focus:border-[#40e0d0]/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#40e0d0]/20 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="newsletter-email" className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Email</label>
                      <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-white/25 focus:border-[#40e0d0]/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#40e0d0]/20 transition-all duration-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group relative w-full rounded-full px-10 py-4 text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-400 cursor-pointer mt-2"
                      style={{
                        background: 'linear-gradient(135deg, #40e0d0, #5227FF)',
                        boxShadow: '0 4px 25px rgba(64,224,208,0.25), 0 0 0 0 rgba(64,224,208,0)',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(64,224,208,0.4), 0 0 60px rgba(82,39,255,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 25px rgba(64,224,208,0.25), 0 0 0 0 rgba(64,224,208,0)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                    >
                      <span className="relative z-10 text-white flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        Subscribe to Newsletter
                      </span>
                    </button>
                  </form>

                  <p className="text-white/25 text-xs mt-5 text-center">No spam, ever. Unsubscribe anytime.</p>
                </div>
              </div>
            </div>

            {/* Footer tagline */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-3 text-white/20 text-sm">
                <div className="w-8 h-px bg-white/20" />
                <span>Designed with &#10084; by Diseño Divino</span>
                <div className="w-8 h-px bg-white/20" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Event Detail Modal */}
      <EventModal event={activeEvent} onClose={closeModal} />
    </ClickSpark>
  );
}
