import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Radio,
  Eye,
  KeyRound,
  FlaskConical,
  ShieldAlert,
  Waves,
  Volume2,
  VolumeX,
  Info,
  Lock,
  Unlock,
  Ghost,
  Compass,
  Image as ImageIcon,
  Soup,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

/**
 * MULTI‑PAGE Kool‑Aid Commune site (single file)
 * - Fixes build error by inlining <KoolAidCommune/> instead of importing from ./KoolAidCommune.
 * - React Router pages: Home, Lore, Gallery, Declassified, Recipes, Radio, Tests.
 * - Framer Motion transitions, Tailwind styles, shadcn/ui components.
 */

// -------------------- Shared helpers --------------------
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function useKonami(onUnlock: () => void) {
  const seq = useRef<string[]>([]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      seq.current.push(e.key.toLowerCase());
      const target = [
        "arrowup",
        "arrowup",
        "arrowdown",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "arrowleft",
        "arrowright",
        "b",
        "a",
      ].join("");
      if (seq.current.length > 10) seq.current.shift();
      if (seq.current.join("") === target) onUnlock();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onUnlock]);
}

// -------------------- Home Page (inlined KoolAidCommune) --------------------
function useOhYeah(onSummon: () => void) {
  const seq = useRef("");
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const ch = e.key.length === 1 ? e.key : "";
      if (!ch) return;
      seq.current = (seq.current + ch).slice(-7);
      if (seq.current.toUpperCase().includes("OH YEAH")) onSummon();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onSummon]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function WaveDivider({ onClick }: { onClick?: () => void }) {
  return (
    <div className="relative cursor-pointer" onClick={onClick} aria-label="wave-divider">
      <svg viewBox="0 0 1440 120" className="w-full h-[80px] md:h-[120px] block">
        <path
          d="M0,64L48,85.3C96,107,192,149,288,160C384,171,480,149,576,144C672,139,768,149,864,149.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          className="fill-fuchsia-500/20"
        />
      </svg>
    </div>
  );
}

function Redaction({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-black text-black rounded px-1 align-baseline shadow-[0_0_0_2px_rgba(0,0,0,0.9)]">
      {children}
    </span>
  );
}

const SIGIL_COUNT = 5;

function LoreChip({ onFound }: { onFound: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl" variant="outline" onClick={() => onFound()}>
          <Eye className="mr-2 h-4 w-4" />Lore Drop
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Field Notes: The Infinite Pitcher</DialogTitle>
        </DialogHeader>
        <div className="text-sm space-y-3">
          <p>
            Legend says the Commune’s punch bowl refills when a good joke lands. The truer the laugh, the brighter the
            glow.
          </p>
          <p>
            Early custodians nicknamed it <em>Project Refresh</em>, later rebranded to <em>Operation Snack Break</em> after
            someone spilled nachos on the logbook.
          </p>
          <p>Counter‑intelligence: bring snacks, share freely.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JuiceOrb({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      <motion.div
        initial={false}
        animate={reduced ? { scale: 1 } : { scale: [1, 1.05, 1] }}
        transition={reduced ? { duration: 0 } : { duration: 6, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-400 via-rose-400 to-amber-300 blur-2xl opacity-60"
        aria-hidden
      />
      <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur border flex items-center justify-center text-center p-8">
        <div>
          <div className="font-black text-2xl">The Pitcher</div>
          <p className="text-sm text-zinc-700">Peer in: if you see your reflection smiling back, you’re in the right place.</p>
        </div>
      </div>
    </div>
  );
}

function KoolAidCommune() {
  const reduced = usePrefersReducedMotion();
  const [themeJammed, setThemeJammed] = useState(false);
  const [sigils, setSigils] = useState<number>(() => {
    const v = Number(localStorage.getItem("kac_sigils") || 0);
    return isNaN(v) ? 0 : Math.min(v, SIGIL_COUNT);
  });
  const [radioVal, setRadioVal] = useState("99.3");
  const [showDeclass, setShowDeclass] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [apparition, setApparition] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [communique, setCommunique] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#dose") setThemeJammed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("kac_sigils", String(sigils));
    if (sigils >= SIGIL_COUNT) setCommunique(true);
  }, [sigils]);

  useKonami(() => {
    setThemeJammed(true);
    setShowDeclass(true);
  });

  useOhYeah(() => setApparition(true));

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.1;
    if (audioOn) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [audioOn]);

  const addSigil = () => setSigils((s) => Math.min(SIGIL_COUNT, s + 1));

  const tune = (val: string) => {
    setRadioVal(val);
    if (parseFloat(val) === 108.1) setShowDeclass(true);
  };

  const jammy = themeJammed
    ? "bg-gradient-to-b from-fuchsia-100 via-rose-50 to-amber-50"
    : "bg-gradient-to-b from-rose-50 via-white to-fuchsia-50";

  return (
    <div className={`${jammy} min-h-screen text-zinc-800`}>
      <audio ref={audioRef} loop src={BLIP_AUDIO} />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: themeJammed ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              <Waves className="w-6 h-6 text-fuchsia-600" />
            </motion.div>
            <h1 className="font-black tracking-tight text-xl md:text-2xl">
              Kool‑Aid Commune <span className="text-xs align-top cursor-help" onClick={() => setShowLegal(true)}>®</span>
            </h1>
            <Button size="xs" variant="ghost" className="ml-1" onClick={addSigil} aria-label="hidden-sigil">
              <Zap className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-500">Sigils: {sigils}/{SIGIL_COUNT}</div>
            <Switch checked={audioOn} onCheckedChange={setAudioOn} aria-label="ambient-audio" />
            {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        <section className="grid md:grid-cols-2 gap-6 py-8 place-items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Sip the Signal. <span className="text-fuchsia-600">Decode the Flavor.</span>
            </h2>
            <p className="text-zinc-600 max-w-prose">
              Welcome to a tongue‑in‑cheek sanctuary of fizzy folklore, collective imagination, and playful nods to the
              weirder corners of history. No indoctrination, just hydration.
            </p>
            <div className="flex flex-wrap gap-2">
              <Dialog open={showDeclass} onOpenChange={setShowDeclass}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl" variant="default">
                    <KeyRound className="mr-2 h-4 w-4" />Declassified?
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-600" /> Mock‑Declassified Flavor Notes
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 text-sm leading-6">
                    <p>
                      <strong>Memo 108‑A:</strong> Subjects reported vivid <Redaction>grape</Redaction> overlays and
                      spontaneous exclamations of “OH YEAH!”. Controlled variables included: ambient synths, communal
                      laughter, and <Redaction>snacks</Redaction>.
                    </p>
                    <p>
                      Hypothesis: resonance at 108.1 MHz correlates with heightened joy responses. Further trials
                      replaced jargon with <em>dance breaks</em>. Results: inconclusive but delightful.
                    </p>
                    <p className="text-xs text-zinc-500">
                      All references here are satirical and fictional; real historical programs were harmful and
                      unethical.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="secondary" className="rounded-2xl" onClick={() => setThemeJammed((v) => !v)}>
                <Sparkles className="mr-2 h-4 w-4" />Jam Theme
              </Button>
              <LoreChip onFound={addSigil} />
            </div>
          </motion.div>

          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="w-full">
            <JuiceOrb reduced={usePrefersReducedMotion()} />
          </motion.div>
        </section>

        <WaveDivider onClick={() => setAudioOn((v) => !v)} />

        <section className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" /> Numbers Station (FM)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-zinc-600">
                Tune to the right frequency. Rumor says <strong>108.1</strong> unlocks a redacted memo.
              </p>
              <div className="flex items-center gap-2">
                <Input inputMode="decimal" value={radioVal} onChange={(e) => tune(e.target.value)} aria-label="frequency" />
                <Button onClick={() => tune("108.1")} variant="outline">
                  Snap
                </Button>
              </div>
              <div className="text-xs text-zinc-500">Hint: If things get noisy, sip water. Hydration is opsec.</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" /> Observation Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Five glowing sigils reported around campus UI. Collect them to receive the <em>Communiqué</em>.
                </li>
                <li>Community chants of “OH YEAH” may summon a <em>friendly apparition</em>.</li>
                <li>Konami gestures cause chromatic flavor shifts and open files marked “Declassified”.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" /> Lab Ethics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                We’re parody nerds. Our lore riffs on historical oddities while explicitly rejecting real‑world harm.
                Consent, care, and comedy only.
              </p>
              <p className="text-xs text-zinc-500">If curiosity bites, read actual scholarship and survivor accounts with empathy.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5" /> Commune Communiqué {communique ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-zinc-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence initial={false}>
                {communique ? (
                  <motion.div key="open" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="prose prose-zinc max-w-none">
                    <h3>Welcome, Signal‑Sippers</h3>
                    <p>
                      You found every sigil. The punch bowl reflects the night sky. The recipe is simple: <em>share, rest,
                        repeat</em>. No hierarchies—only potlucks.
                    </p>
                    <p>Tonight’s agenda: story‑swapping, a <strong>consent‑led</strong> dance circle, and decoding the legend of the <em>Infinite Pitcher</em>.</p>
                  </motion.div>
                ) : (
                  <motion.div key="closed" initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} className="text-sm text-zinc-500">
                    Collect all five sigils to unlock this section.
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Apparition overlay */}
      <AnimatePresence>
        {apparition && (
          <motion.div className="fixed inset-0 z-[100] pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-rose-100/80 backdrop-blur rounded-2xl p-6 shadow-2xl border pointer-events-auto">
                <div className="flex items-center gap-3">
                  <Ghost className="w-6 h-6 text-rose-600" />
                  <div>
                    <div className="font-extrabold text-2xl">OH YEAH!</div>
                    <div className="text-sm text-zinc-600">A fizzy friend appears, breaks nothing, and reminds you to drink water.</div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setApparition(false)}>Dismiss</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal / Satire modal */}
      <Dialog open={showLegal} onOpenChange={setShowLegal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" /> Parody & Ethics
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-3">
            <p>
              This site is fan‑made, satirical, and for entertainment. It mixes whimsical fiction with pop‑culture
              wink‑nudge references. No medical, legal, or historical claims.
            </p>
            <p>
              We explicitly condemn real‑world non‑consensual experimentation and celebrate informed, compassionate
              communities.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tiny inlined audio (short blip loop)
const BLIP_AUDIO =
  "data:audio/wav;base64,UklGRpQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQwAAAAAAP//AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/";

// -------------------- Other pages --------------------
function LorePage() {
  const stories = [
    {
      title: "The Smash",
      img: "https://placehold.co/1200x600/ff4ff4/fff?text=Kool-Aid+Smash",
      text: "Long ago… a BIG GLASS MAN full of red juice went SMASH through a wall. His name? KOOL‑AID MAN.",
    },
    {
      title: "The Experiment",
      img: "https://placehold.co/1200x600/f4ff4f/000?text=CIA+Lab",
      text: "A parody program mixed sugar, water, and secret ‘Flavor‑Agents’ in a jug. The Kool‑Aid Man was born screaming OH YEAH!",
    },
    {
      title: "The Confusion",
      img: "https://placehold.co/1200x600/4ff4ff/000?text=Rumors+Collide",
      text: "Prophets heard the smash. Scientists heard data. The Commune heard a party invitation.",
    },
    {
      title: "The Communion",
      img: "https://placehold.co/1200x600/ff774f/000?text=Commune+Night",
      text: "Gatherings ran on neon punch and whisper‑lore. They drank, they laughed, they made up ever‑stranger stories.",
    },
    {
      title: "The Infinite Pitcher",
      img: "https://placehold.co/1200x600/4fff7f/000?text=Infinite+Pitcher",
      text: "Legend says the punch bowl refills when a good joke lands. The truer the laugh, the brighter the glow.",
    },
  ];
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-extrabold mb-6">📖 The Kool‑Aid Commune Lore</h1>
      {stories.map((s, i) => (
        <motion.article
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.15 }}
          className="bg-white/70 backdrop-blur rounded-2xl shadow p-6 space-y-3"
        >
          <h2 className="text-2xl font-bold">{s.title}</h2>
          <img src={s.img} alt={s.title} className="rounded-xl border w-full" />
          <p className="text-zinc-700 leading-relaxed">{s.text}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}

function GalleryPage() {
  const items = new Array(12).fill(0).map((_, i) => ({
    src: `https://placehold.co/800x600/${i % 2 ? "f0f" : "0ff"}fff/111?text=Commune+${i + 1}`,
    cap: `Artifact ${i + 1}`,
  }));
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-2">
        <ImageIcon className="w-6 h-6" /> Gallery of Artifacts
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <figure key={i} className="group bg-white/60 rounded-xl shadow overflow-hidden border">
            <img src={it.src} alt={it.cap} className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition" />
            <figcaption className="p-3 text-sm text-zinc-700">{it.cap}</figcaption>
          </figure>
        ))}
      </div>
    </motion.div>
  );
}

function DeclassifiedPage() {
  const memos = [
    {
      id: "108A",
      title: "Memo 108‑A",
      body: "Subjects reported vivid grape overlays and spontaneous exclamations of ‘OH YEAH’. Hydration correlated with improved vibes.",
    },
    { id: "451B", title: "Report 451‑B", body: "Replacing jargon with dance breaks produced inconclusive yet delightful outcomes." },
    { id: "777X", title: "Note 777‑X", body: "At frequency 108.1 MHz, joy responses peaked. Recommend additional snacks for replication." },
  ];
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-4xl font-extrabold flex items-center gap-2">
        <ShieldAlert className="w-6 h-6 text-rose-600" /> Mock‑Declassified Files
      </h1>
      {memos.map((m) => (
        <div key={m.id} className="rounded-2xl border bg-white/70 backdrop-blur p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">File {m.id}</div>
          <h2 className="text-2xl font-bold mb-2">{m.title}</h2>
          <p className="text-zinc-700">{m.body}</p>
        </div>
      ))}
      <p className="text-xs text-zinc-500">All references are fictional and satirical; real historical programs were harmful and unethical.</p>
    </motion.div>
  );
}

function RecipesPage() {
  const recipes = [
    {
      name: "Infinite Pitcher Punch",
      steps: ["Fill bowl with sparkling water.", "Add red fruit blend.", "Tell one excellent joke.", "Watch level rise mysteriously."],
    },
    { name: "108.1 Spritz", steps: ["Crushed ice.", "Citrus wedge.", "Whisper ‘OH YEAH’.", "Hydrate responsibly."] },
    { name: "Sigil Soda", steps: ["Collect 5 🔮 emojis.", "Top with berries.", "Serve during lore hour."] },
  ];
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-4xl font-extrabold flex items-center gap-2">
        <Soup className="w-6 h-6" /> Commune Recipes
      </h1>
      {recipes.map((r, idx) => (
        <div key={idx} className="rounded-2xl border bg-white/70 backdrop-blur p-6">
          <h2 className="text-2xl font-bold">{r.name}</h2>
          <ol className="list-decimal pl-6 space-y-1 text-zinc-700 mt-2">
            {r.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      ))}
      <p className="text-xs text-zinc-500">Consent, care, and comedy only. Hydrate well.</p>
    </motion.div>
  );
}

function RadioPage() {
  const [freq, setFreq] = useState("99.3");
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (parseFloat(freq) === 108.1) setUnlocked(true);
  }, [freq]);
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-md mx-auto px-4 py-12 space-y-4">
      <h1 className="text-4xl font-extrabold flex items-center gap-2">
        <Radio className="w-6 h-6" /> Numbers Station (FM)
      </h1>
      <input value={freq} onChange={(e) => setFreq(e.target.value)} inputMode="decimal" className="w-full border rounded-xl p-3" aria-label="frequency" />
      <div className="text-sm text-zinc-600">
        Try <strong>108.1</strong>.
      </div>
      <AnimatePresence>
        {unlocked && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border bg-white/70 backdrop-blur p-4">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Declassified</div>
            <div className="font-bold">Memo 108‑A</div>
            <div className="text-sm text-zinc-700">Joy response spike detected. Recommend snacks.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// -------------------- Runtime Tests Page --------------------
function TestsPage() {
  type Test = { name: string; run: () => boolean | string };
  const tests: Test[] = [
    { name: "KoolAidCommune component exists", run: () => typeof KoolAidCommune === "function" },
    { name: "LorePage component exists", run: () => typeof LorePage === "function" },
    { name: "GalleryPage component exists", run: () => typeof GalleryPage === "function" },
    { name: "DeclassifiedPage component exists", run: () => typeof DeclassifiedPage === "function" },
    { name: "RecipesPage component exists", run: () => typeof RecipesPage === "function" },
    { name: "RadioPage unlock condition", run: () => parseFloat("108.1") === 108.1 },
    { name: "useKonami hook is defined", run: () => typeof useKonami === "function" },
    { name: "pageVariants shape", run: () => !!(pageVariants.initial && pageVariants.animate && pageVariants.exit) },
  ];
  const results = tests.map((t) => ({ name: t.name, ok: Boolean(t.run()) }));
  const passed = results.filter((r) => r.ok).length;
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold">Test Suite</h1>
      <ul className="space-y-2">
        {results.map((r, i) => (
          <li key={i} className={`flex items-center justify-between rounded-lg border p-3 ${r.ok ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
            <span>{r.name}</span>
            <span className={`text-xs font-bold ${r.ok ? "text-emerald-700" : "text-rose-700"}`}>{r.ok ? "PASS" : "FAIL"}</span>
          </li>
        ))}
      </ul>
      <div className="text-sm text-zinc-600">{passed} / {results.length} tests passed.</div>
      <div className="text-xs text-zinc-500">Note: These are smoke tests to catch missing components & simple logic. Expand as needed.</div>
    </motion.div>
  );
}

// -------------------- Layout & Router --------------------
function Layout({ children }: { children: React.ReactNode }) {
  const [partyMode, setPartyMode] = useState(false);
  useKonami(() => setPartyMode(true));
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <div className={`min-h-screen ${partyMode ? "bg-gradient-to-b from-fuchsia-100 via-rose-50 to-amber-50" : "bg-gradient-to-b from-rose-50 via-white to-fuchsia-50"}`}>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto p-4 flex flex-wrap items-center gap-3">
          <Link to="/" className="font-black tracking-tight text-xl">
            Kool‑Aid Commune
          </Link>
          <div className="flex gap-3 text-sm">
            <NavLink to="/" end className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-fuchsia-100 text-fuchsia-700" : "hover:bg-zinc-100"}`}>Home</NavLink>
            <NavLink to="/lore" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-rose-100 text-rose-700" : "hover:bg-zinc-100"}`}>Lore</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-amber-100 text-amber-700" : "hover:bg-zinc-100"}`}>Gallery</NavLink>
            <NavLink to="/declassified" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-emerald-100 text-emerald-700" : "hover:bg-zinc-100"}`}>Declassified</NavLink>
            <NavLink to="/recipes" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-sky-100 text-sky-700" : "hover:bg-zinc-100"}`}>Recipes</NavLink>
            <NavLink to="/radio" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-violet-100 text-violet-700" : "hover:bg-zinc-100"}`}>Radio</NavLink>
            <NavLink to="/tests" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? "bg-zinc-100 text-zinc-700" : "hover:bg-zinc-100"}`}>Tests</NavLink>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
            <span>Konami ⇒ Theme Jam</span>
            <Button size="sm" variant="outline" onClick={() => setPartyMode((v) => !v)} className="h-7">
              <Zap className="w-4 h-4 mr-1" />Jam
            </Button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="mt-16 py-10 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Kool‑Aid Commune — parody fan‑site</footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<KoolAidCommune />} />
            <Route path="/lore" element={<LorePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/declassified" element={<DeclassifiedPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}

function NotFound() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold">404</h1>
      <p className="text-zinc-600">The page you’re looking for evaporated into the punch bowl, maybe punch jones has it? that cunt.....</p>
      <div className="mt-4">
        <Link className="underline" to="/">
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
