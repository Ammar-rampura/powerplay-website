import { useState, useEffect, useRef } from 'react';

const PHONE = '+919926052234';
const WA = 'https://wa.me/919926052234?text=Hi%20PowerPlay!%20I%20want%20to%20book%20a%20PS5%20session.';
const MAP = 'https://www.google.com/maps/search/?api=1&query=PowerPlay+Khatiwala+Tank+Indore';

const NAV_ITEMS = [
  { symbol: '△', label: 'GTA Zone', href: '#gta-zone' },
  { symbol: '○', label: 'Games', href: '#games' },
  { symbol: '✕', label: 'Zones', href: '#zones' },
  { symbol: '□', label: 'Squad', href: '#squad' },
  { symbol: '📍', label: 'Visit', href: '#visit' },
];

const ZONES = [
  {
    title: '55" - 65" 4K HDR Arena',
    desc: 'OLED color richness, 120Hz high refresh rate, and HDR tuned for high-speed Los Santos and Vice City visuals.',
    badge: 'ULTRA HD',
    cssClass: 'c1',
    img: '/images/gaming_rig.jpg',
  },
  {
    title: 'Cockpit Racing Rigs',
    desc: 'Force-feedback steering wheels, authentic pedal sets, and bucket seat ergonomics for Grand Prix racing.',
    badge: 'SIM RIG',
    cssClass: 'c2',
    img: '/images/neon_supercar.jpg',
  },
  {
    title: 'Squad Couch Co-Op',
    desc: 'Spacious leather couches accommodating 2 to 6 players simultaneously with multi-controller setups.',
    badge: 'CO-OP',
    cssClass: 'c3',
    img: '/images/retro_gaming.jpg',
  },
  {
    title: 'Snack Respawn Hub',
    desc: 'Chilled energy drinks, sodas, and gourmet snacks delivered straight to your console station.',
    badge: 'REFUEL',
    cssClass: 'c4',
    img: '/images/cyberpunk_city.jpg',
  },
];

const GAMES = [
  { title: 'Grand Theft Auto V', genre: 'Open World', desc: 'Heists, high-speed getaways, and chaos across Los Santos.', rating: '4.9★', tag: 'MOST REQUESTED' },
  { title: 'Grand Theft Auto VI', genre: 'Open World', desc: 'Welcome to Vice City & Leonida. Pre-book opening week lounge passes.', rating: '5.0★', tag: 'LAUNCH ZONE' },
  { title: "Marvel's Spider-Man 2", genre: 'Open World', desc: 'Peter Parker & Miles Morales dynamic web-slinging in 4K.', rating: '4.8★', tag: '120 FPS' },
  { title: 'Red Dead Redemption 2', genre: 'Open World', desc: 'Arthur Morgan’s breathtaking western frontier journey.', rating: '4.9★', tag: 'CINEMATIC' },
  { title: 'Gran Turismo 7', genre: 'Racing', desc: 'Hyper-realistic simulation dialed for our cockpit racing rigs.', rating: '4.8★', tag: 'FORCE FEEDBACK' },
  { title: 'EA Sports FC 25', genre: 'Sports', desc: 'Tense 1v1 and 2v2 derby clashes with authentic match pacing.', rating: '4.7★', tag: 'TOURNAMENT' },
  { title: 'Tekken 8', genre: 'Fighting', desc: 'High-damage combos, Heat System counters, and local rivalries.', rating: '4.8★', tag: 'ARCADE' },
  { title: 'Mortal Kombat 1', genre: 'Fighting', desc: 'Fatalities, brutal Kameo combinations, and head-to-head brawls.', rating: '4.7★', tag: 'FATALITY' },
  { title: 'Call of Duty: Warzone', genre: 'Shooter', desc: 'Tactical gunplay, battle royale team play, and 3D audio.', rating: '4.6★', tag: 'SQUAD WAR' },
  { title: 'Need for Speed Unbound', genre: 'Racing', desc: 'Burst nitro drifting, graffiti art style, and police evasion.', rating: '4.6★', tag: 'STREET' },
  { title: 'It Takes Two', genre: 'Co-op', desc: 'The multi-award-winning two-player co-op puzzle adventure.', rating: '4.9★', tag: 'DUO HIT' },
  { title: 'Overcooked! All You Can Eat', genre: 'Co-op', desc: 'Fast-paced multiplayer kitchen mayhem for big groups.', rating: '4.7★', tag: 'PARTY' },
];

const GENRES = ['All', 'Open World', 'Racing', 'Sports', 'Fighting', 'Shooter', 'Co-op'];

const WANTED_DISPATCH = [
  'Zero heat. Tune your squad loadout.',
  '★ 1-Star: Local patrol alerted. Grab a controller.',
  '★★ 2-Star: Highway cruisers circling. Squad up.',
  '★★★ 3-Star: Police chopper overhead. Head into PowerPlay.',
  '★★★★ 4-Star: Tactical FIB units dispatched. Maximum chaos!',
  '★★★★★ 5-STAR HEAT: Full mobilization! Get to PowerPlay right now!',
];

// Web Audio API Synthesizer for Retro Gaming SFX
function playCyberBeep(frequency = 520, duration = 0.08, type = 'sine') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Ignore audio permission restrictions
  }
}

function playMissionPassedFanfare() {
  const notes = [440, 554, 659, 880];
  notes.forEach((f, idx) => {
    setTimeout(() => playCyberBeep(f, 0.25, 'triangle'), idx * 160);
  });
}

function useOpenStatus() {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    const evaluate = () => {
      const now = new Date();
      const current = now.getHours() + now.getMinutes() / 60;
      setOpen(current >= 12 && current < 22);
    };
    evaluate();
    const timer = setInterval(evaluate, 30000);
    return () => clearInterval(timer);
  }, []);
  return open;
}

function ReflexChallenge({ onWin }) {
  const [state, setState] = useState('idle');
  const [reactionMs, setReactionMs] = useState(null);
  const [personalBest, setPersonalBest] = useState(null);
  const startTime = useRef(0);
  const timeoutId = useRef(null);

  const handleClick = () => {
    if (state === 'idle' || state === 'done' || state === 'early') {
      playCyberBeep(440, 0.06);
      setState('wait');
      setReactionMs(null);
      timeoutId.current = setTimeout(() => {
        playCyberBeep(880, 0.12, 'square');
        startTime.current = performance.now();
        setState('now');
      }, 1200 + Math.random() * 2000);
    } else if (state === 'wait') {
      clearTimeout(timeoutId.current);
      playCyberBeep(220, 0.15, 'sawtooth');
      setState('early');
    } else if (state === 'now') {
      const duration = Math.round(performance.now() - startTime.current);
      setReactionMs(duration);
      if (duration < 280 && onWin) {
        onWin();
      } else {
        playCyberBeep(660, 0.1);
      }
      setPersonalBest((prev) => (prev === null ? duration : Math.min(prev, duration)));
      setState('done');
    }
  };

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  const titles = {
    idle: 'TEST YOUR REFLEXES',
    wait: 'WAIT FOR GREEN...',
    now: 'CLICK NOW!',
    early: 'TOO EARLY! RETRY',
    done: `${reactionMs} MS RESPONSE`,
  };

  const rank =
    reactionMs === null
      ? ''
      : reactionMs < 220
      ? 'PRO ESPORTS RANK'
      : reactionMs < 280
      ? 'LOS SANTOS SHOOTER'
      : reactionMs < 360
      ? 'CASUAL SPEED'
      : 'NEEDS MORE SESSIONS';

  return (
    <div className="reflex-widget">
      <button className={`reflex-btn ${state}`} onClick={handleClick} type="button">
        <span className="reflex-main-lbl">{titles[state]}</span>
        {state === 'done' ? (
          <span className="reflex-sub-lbl">{rank} • {reactionMs}ms</span>
        ) : (
          <span className="reflex-sub-lbl">Tap when screen turns green</span>
        )}
        {personalBest !== null && (
          <span className="reflex-best">Best Record: {personalBest} ms</span>
        )}
      </button>
    </div>
  );
}

export default function App() {
  const isOpen = useOpenStatus();
  const [currentGenre, setCurrentGenre] = useState('All');
  const [wantedLevel, setWantedLevel] = useState(2);
  const [gtaUniverse, setGtaUniverse] = useState('gta6');
  const [showToast, setShowToast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mouseCoord, setMouseCoord] = useState({ x: 50, y: 30 });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Clean Minimalist Splash Screen (Timed to precisely ~2 seconds)
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2000; // 2 seconds exactly

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setLoadingProgress(progress);

      if (elapsed >= duration) {
        clearInterval(timer);
        setTimeout(() => setIsFadingOut(true), 100);
        setTimeout(() => setIsSplashActive(false), 550);
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  const handleWin = () => {
    if (soundEnabled) playMissionPassedFanfare();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  };

  const toggleStar = (lvl) => {
    const newLvl = wantedLevel === lvl ? 0 : lvl;
    setWantedLevel(newLvl);
    if (soundEnabled) playCyberBeep(newLvl * 120 + 300, 0.08, 'triangle');
  };

  const displayedGames = GAMES.filter(
    (g) => currentGenre === 'All' || g.genre === currentGenre
  );

  return (
    <div
      className={`app ${wantedLevel === 5 ? 'alarm-active' : ''}`}
      onMouseMove={(e) =>
        setMouseCoord({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        })
      }
      style={{ '--mx': `${mouseCoord.x}%`, '--my': `${mouseCoord.y}%` }}
    >
      {/* VERY CLEAN MINIMALIST GAMING SPLASH SCREEN */}
      {isSplashActive && (
        <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
          <div className="splash-ambient-aura" />
          <div className="splash-clean-wrap">
            <div className="splash-emblem">
              <img src="/images/gta6_midu_logo-vi.svg" alt="GTA VI" className="splash-vi-img" />
            </div>

            <h1 className="splash-title">POWER<span>PLAY</span></h1>
            <p className="splash-sub">PS5 ARENA • INDORE</p>

            <div className="splash-line-track">
              <div
                className="splash-line-bar"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <div className="splash-footer-row">
              <span className="splash-status-lbl">INITIALIZING ARENA</span>
              <span className="splash-status-num">{loadingProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SOUND FX TOGGLE BUTTON */}
      <button
        className="audio-hud-toggle"
        type="button"
        onClick={() => setSoundEnabled(!soundEnabled)}
        aria-label="Toggle SFX Sound"
      >
        <span>{soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF'}</span>
      </button>

      <div className="mouse-glow" />
      <div className="scanlines" />

      {/* TOP NAVBAR */}
      <header className="nav">
        <a href="#top" className="logo">
          <img src="/images/gta6_midu_logo-vi.svg" alt="GTA VI" className="logo-vi" />
          <span className="logo-text">POWER<b>PLAY</b></span>
          <span className="city-tag">INDORE</span>
        </a>

        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-item"
              onClick={() => {
                if (soundEnabled) playCyberBeep(520, 0.05);
                setMobileMenuOpen(false);
              }}
            >
              <i>{item.symbol}</i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className={`nav-status ${isOpen ? 'open' : 'closed'}`}>
            <span className="status-pip" />
            <span>{isOpen === null ? 'STATUS' : isOpen ? 'OPEN NOW' : 'CLOSED (12 PM)'}</span>
          </div>

          <button
            className="nav-mobile-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="top" className="hero">
        <div className="hero-bg-media">
          <img src="/images/gta6_hero-bg.webp" alt="GTA VI Vice City" className="hero-bg-img" />
          <div className="hero-vignette" />
        </div>

        <div className="hero-layout">
          <div className="hero-text-side">
            <div className="hero-tags">
              <span className="tag-badge green">
                <img src="/images/gta_series_logo.svg" alt="GTA" className="tag-logo" />
                GTA 5 & GTA 6 READY
              </span>
              <span className="tag-badge cyan">
                <img src="/images/gta6_midu_ps5.svg" alt="PS5" className="tag-logo" />
                PS5 ARENA
              </span>
              <span className="tag-badge pink">KHATIWALA TANK</span>
            </div>

            <h1 className="hero-title">
              THE NEXT-GEN <br />
              <span className="title-green">GAMING</span> <span className="title-yellow">LOUNGE</span>
            </h1>

            <p className="hero-lead">
              Indore’s premier PlayStation 5 lounge. Experience <strong>4K HDR visuals on 55"–65" displays</strong>,
              precision <strong>force-feedback racing rigs</strong>, and <strong>squad couch co-op heists</strong> in Los Santos & Vice City.
            </p>

            <div className="hero-ctas">
              <a className="btn btn-primary" href={WA} target="_blank" rel="noreferrer">
                ⚡ Book Session on WhatsApp
              </a>
              <a className="btn btn-secondary" href={`tel:${PHONE}`}>
                📞 Call: 99260 52234
              </a>
              <a className="btn btn-outline" href="#gta-zone">
                🌴 GTA Showcase
              </a>
            </div>

            {/* WANTED METER */}
            <div className="wanted-hud">
              <div className="wanted-header">
                <span className="wanted-lbl">WANTED LEVEL METER</span>
                <div className="wanted-stars" role="group" aria-label="GTA Wanted Level">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Set wanted level ${star}`}
                      className={`wanted-star ${star <= wantedLevel ? 'active' : ''}`}
                      onClick={() => toggleStar(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <span className="wanted-msg">{WANTED_DISPATCH[wantedLevel]}</span>
            </div>
          </div>

          {/* HERO RIGHT FEATURE CARD */}
          <div className="hero-art-side">
            <div className="hero-feature-card">
              <div className="hero-feature-media">
                <img src="/images/gta6_lucia-2.webp" alt="GTA VI Official Artwork" />
                <div className="hero-feature-media-grad" />
                <span className="hero-media-tag">FEATURED TITLE</span>
                <div className="corner-badge-pulse">
                  <span className="dot" />
                  <span>RAY TRACING READY</span>
                </div>
              </div>
              <div className="hero-feature-info">
                <div className="hero-feature-title">
                  <h3>GRAND THEFT AUTO VI</h3>
                  <span className="badge-nextgen">NEXT GEN</span>
                </div>
                <p className="hero-feature-desc">
                  Vice City & Leonida await. Play with Jason and Lucia on our 65-inch high-refresh rigs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER MARQUEE */}
      <div className="marquee-bar" aria-hidden="true">
        <div className="marquee-inner">
          {Array(3)
            .fill(
              '★ GTA VI VICE CITY READY ★ GTA V 4K LOS SANTOS HEISTS ★ FORCE FEEDBACK RACING COCKPITS ★ PS5 DUALSENSE 120HZ ★ KHATIWALA TANK INDORE ★ '
            )
            .join('')}
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stat-box">
          <div className="stat-icon">⭐</div>
          <div>
            <div className="stat-num">4.8 / 5.0</div>
            <div className="stat-lbl">90+ Verified Reviews</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🖥️</div>
          <div>
            <div className="stat-num">55" - 65"</div>
            <div className="stat-lbl">4K HDR Ultra-HD Screens</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🏎️</div>
          <div>
            <div className="stat-num">SIM RIGS</div>
            <div className="stat-lbl">Cockpit Wheels & Pedals</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🎮</div>
          <div>
            <div className="stat-num">SONY PS5</div>
            <div className="stat-lbl">DualSense Haptic Rig</div>
          </div>
        </div>
      </div>

      {/* DUAL GTA 5 & GTA 6 SHOWCASE */}
      <section id="gta-zone" className="section">
        <div className="sec-head">
          <span className="sec-badge">ROCKSTAR SPOTLIGHT</span>
          <h2 className="sec-title">THE GRAND THEFT AUTO EXPERIENCE</h2>
          <p className="sec-desc">
            Indore’s ultimate destination for open-world action. Switch between Los Santos in GTA V and Vice City in GTA VI.
          </p>
        </div>

        <div className="gta-tabs">
          <button
            className={`gta-tab-btn ${gtaUniverse === 'gta6' ? 'active' : ''}`}
            onClick={() => {
              if (soundEnabled) playCyberBeep(640, 0.06);
              setGtaUniverse('gta6');
            }}
            type="button"
          >
            <img src="/images/gta6_midu_logo-vi.svg" alt="VI" className="tab-badge-ico" />
            <span>GTA VI : VICE CITY</span>
          </button>
          <button
            className={`gta-tab-btn ${gtaUniverse === 'gta5' ? 'active' : ''}`}
            onClick={() => {
              if (soundEnabled) playCyberBeep(480, 0.06);
              setGtaUniverse('gta5');
            }}
            type="button"
          >
            <img src="/images/gta_series_logo.svg" alt="V" className="tab-badge-ico" />
            <span>GTA V : LOS SANTOS</span>
          </button>
        </div>

        {gtaUniverse === 'gta6' ? (
          <div className="gta-card-container gta6-mode">
            <div className="gta-content-pane">
              <span className="gta-tagline">STATE OF LEONIDA • NEXT-GEN PS5</span>
              <h3>WELCOME TO VICE CITY</h3>
              <p>
                Get ready for the most anticipated game of this generation. Experience sun-drenched beaches,
                neon-soaked nights, and high-stakes criminal runs with Jason and Lucia on our calibrated 65" displays.
              </p>
              <div className="gta-spec-list">
                <div className="gta-spec-item">
                  <strong>4K Ray-Tracing Display</strong>
                  <span>Tuned for realistic reflection & lighting</span>
                </div>
                <div className="gta-spec-item">
                  <strong>Vice City Atmosphere</strong>
                  <span>Neon synth aesthetics & spatial surround</span>
                </div>
                <div className="gta-spec-item">
                  <strong>Priority Squad Passes</strong>
                  <span>Pre-book launch day sessions for your crew</span>
                </div>
                <div className="gta-spec-item">
                  <strong>DualSense Haptics</strong>
                  <span>Feel engine throttle and weapons feedback</span>
                </div>
              </div>
              <div>
                <a className="btn btn-primary" href={WA} target="_blank" rel="noreferrer">
                  Reserve GTA VI Launch Slots
                </a>
              </div>
            </div>
            <div className="gta-media-pane">
              <img src="/images/gta6_jason-2.webp" alt="GTA VI Jason & Vice City" className="gta-main-art" />
            </div>
          </div>
        ) : (
          <div className="gta-card-container gta5-mode">
            <div className="gta-content-pane">
              <span className="gta-tagline">LOS SANTOS 60 FPS • HEIST CREWS</span>
              <h3>MICHAEL, FRANKLIN & TREVOR</h3>
              <p>
                Cruise Vinewood Boulevard, plan high-stakes bank heists with your friends, cause 5-star military
                pursuits, and conquer GTA Online on lightning-fast PS5 loading times.
              </p>
              <div className="gta-spec-list">
                <div className="gta-spec-item">
                  <strong>Co-Op Heist Squads</strong>
                  <span>Side-by-side multiplayer couch seating</span>
                </div>
                <div className="gta-spec-item">
                  <strong>High-Speed Getaways</strong>
                  <span>Zero-delay responsive TV gaming mode</span>
                </div>
                <div className="gta-spec-item">
                  <strong>3D Surround Audio</strong>
                  <span>Pinpoint sirens, choppers, and radio tunes</span>
                </div>
                <div className="gta-spec-item">
                  <strong>Instant Loading</strong>
                  <span>PS5 ultra-fast SSD jump straight to the action</span>
                </div>
              </div>
              <div>
                <a className="btn btn-primary" href={WA} target="_blank" rel="noreferrer">
                  Book GTA V Session Today
                </a>
              </div>
            </div>
            <div className="gta-media-pane">
              <img src="/images/gta5_main.webp" alt="GTA V Los Santos Heist Crew" className="gta-main-art" />
            </div>
          </div>
        )}
      </section>

      {/* GAME VAULT */}
      <section id="games" className="section">
        <div className="sec-head">
          <span className="sec-badge">GAME LIBRARY</span>
          <h2 className="sec-title">POPULAR PS5 TITLES</h2>
          <p className="sec-desc">
            From premier story blockbusters to intense local multiplayer and sports tournaments.
          </p>
        </div>

        <div className="genre-filter-bar">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              className={`genre-pill ${currentGenre === g ? 'active' : ''}`}
              onClick={() => {
                if (soundEnabled) playCyberBeep(580, 0.05);
                setCurrentGenre(g);
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="games-grid">
          {displayedGames.map((game) => (
            <article key={game.title} className="game-card">
              <div className="game-top-row">
                <span className="genre-tag">{game.genre}</span>
                <span className="game-tag-badge">{game.tag}</span>
              </div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-desc">{game.desc}</p>
              <div className="game-bottom-row">
                <span className="game-rating">{game.rating}</span>
                <a className="game-play-cta" href={WA} target="_blank" rel="noreferrer">
                  Book to Play →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BATTLEFIELD ZONES */}
      <section id="zones" className="section">
        <div className="sec-head">
          <span className="sec-badge">ARENA STATIONS</span>
          <h2 className="sec-title">CHOOSE YOUR ZONE</h2>
          <p className="sec-desc">Engineered for comfort, competition, and pure audiovisual immersion.</p>
        </div>

        <div className="zones-grid">
          {ZONES.map((zone) => (
            <article key={zone.title} className={`zone-card ${zone.cssClass}`}>
              <div className="zone-media">
                <img src={zone.img} alt={zone.title} />
                <span className="zone-badge">{zone.badge}</span>
              </div>
              <div className="zone-body">
                <h3>{zone.title}</h3>
                <p>{zone.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SQUAD SESSIONS & REFLEX CHALLENGE */}
      <section id="squad" className="section">
        <div className="reflex-section">
          <div>
            <span className="sec-badge">SQUAD LOADOUT</span>
            <h2 className="sec-title">SESSIONS & SQUADS</h2>
            <p className="sec-desc" style={{ marginBottom: '20px' }}>
              Play solo, 1v1, or bring your entire crew. Flexible hourly rates and customized tournament passes available.
            </p>
            <ul className="squad-slots-list">
              {[
                { p: 'P1', title: 'Solo Campaign', desc: 'GTA Story / Spider-Man / Elden Ring', rate: 'Hourly Pass' },
                { p: 'P2', title: 'Duo Match', desc: 'FC 25 / Mortal Kombat / It Takes Two', rate: 'Best for 2' },
                { p: 'P4', title: 'Squad Heist', desc: '4-Player Co-Op & Racing Rotation', rate: 'Party Favorite' },
                { p: 'VIP', title: 'Full Arena Pass', desc: 'Private lounge bookings for birthday & tourneys', rate: 'Custom' },
              ].map((s) => (
                <li key={s.title} className="squad-slot-item">
                  <span className="slot-badge">{s.p}</span>
                  <div className="slot-details">
                    <strong>{s.title}</strong>
                    <small>{s.desc}</small>
                  </div>
                  <span className="slot-rate">{s.rate}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="sec-badge">MINIGAME</span>
            <h2 className="sec-title">REACTION WARM-UP</h2>
            <p className="sec-desc" style={{ marginBottom: '20px' }}>
              Test your thumb reflexes before hitting the arena. Score under 280ms to trigger respect badge!
            </p>
            <ReflexChallenge onWin={handleWin} />
          </div>
        </div>
      </section>

      {/* VISIT SECTION */}
      <section id="visit" className="section">
        <div className="visit-panel">
          <span className="sec-badge">LOCATION & TIMINGS</span>
          <h2 className="sec-title">DROP INTO POWERPLAY INDORE</h2>
          <address>
            <strong>PowerPlay Gaming Lounge</strong>
            <br />
            603, Opposite Style Nation, Khatiwala Tank,
            <br />
            Indore, Madhya Pradesh 452014
            <span className="timing-highlight">🕒 Open 12:00 PM – 10:00 PM Daily</span>
          </address>
          <div className="hero-ctas" style={{ justifyContent: 'center', marginBottom: 0 }}>
            <a className="btn btn-primary" href={MAP} target="_blank" rel="noreferrer">
              📍 Google Maps Directions
            </a>
            <a className="btn btn-secondary" href={WA} target="_blank" rel="noreferrer">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* MISSION PASSED TOAST */}
      {showToast && (
        <div className="mission-toast" role="status">
          <div className="toast-title">★ MISSION PASSED! ★</div>
          <div className="toast-desc">RESPECT +100 • REFLEXES UNDER 280 MS</div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/images/gta6_midu_logo-vi.svg" alt="GTA VI" />
            <span>POWERPLAY INDORE</span>
          </div>
          <p>© {new Date().getFullYear()} PowerPlay Indore. PlayStation 5, GTA V, and GTA VI belong to Sony Interactive Entertainment & Rockstar Games.</p>
        </div>
      </footer>
    </div>
  );
}
