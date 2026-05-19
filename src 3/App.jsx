import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import YouTube from 'react-youtube';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

// ── Add ALL your photos here (up to 30) ──
// Preview shows first 5, all get included in the zip download
const ALL_PHOTOS = [
  '/images/gallery/memory1.jpg',
  '/images/gallery/memory2.jpg',
  '/images/gallery/memory3.jpg',
  '/images/gallery/memory4.jpg',
  '/images/gallery/memory5.jpg',
  '/images/gallery/memory6.jpg',
  '/images/gallery/memory7.jpg',
  '/images/gallery/memory8.jpg',
  '/images/gallery/memory9.jpg',
  '/images/gallery/memory10.jpg',
  // add more lines here: '/images/gallery/memory11.jpg', etc.
];

const PREVIEW_COUNT = 5; // how many show in the gallery strip

// YouTube playlist ID — autoplay works best with a playlist
const PLAYLIST_ID = 'PLjp0AEEJ0-fGKG_3skl0e1FQlJfnx-TJz';

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [lightbox, setLightbox] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [downloading, setDownloading] = useState(false);
  const [songName, setSongName] = useState('Her Playlist');
  const playerRef = useRef(null);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlayerReady = (e) => {
    playerRef.current = e.target;
    e.target.setVolume(volume);
    // autoplay starts automatically via playerVars
  };

  const handleStateChange = (e) => {
    // Update song name when track changes
    try {
      const data = e.target.getVideoData();
      if (data?.title) setSongName(data.title);
    } catch (_) {}
  };

  const handlePlay = () => playerRef.current?.playVideo();
  const handlePause = () => playerRef.current?.pauseVideo();
  const handleNext = () => playerRef.current?.nextVideo();
  const handlePrev = () => playerRef.current?.previousVideo();

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
  };

  // Download all photos as a single zip file
  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('Loreta_Memories');

      const fetches = ALL_PHOTOS.map(async (src, i) => {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          const ext = src.split('.').pop();
          folder.file(`memory${i + 1}.${ext}`, blob);
        } catch (_) {}
      });

      await Promise.all(fetches);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'Loreta_35_Memories.zip');
    } catch (err) {
      console.error('Zip failed:', err);
    }
    setDownloading(false);
  };

  const previewPhotos = ALL_PHOTOS.slice(0, PREVIEW_COUNT);

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="nav-num">35</span>
          <div className="nav-dot" />
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {['hero', 'letter', 'memories', 'music'].map(s => (
              <button key={s} onClick={() => scrollTo(s)}>{s.toUpperCase()}</button>
            ))}
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url('/images/hero/hero.jpg')` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            THIRTY<br />FIVE
          </motion.h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Happy Birthday, Loreta
          </motion.p>
        </div>

        {/* Music bar */}
        <motion.div
          className="hero-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="bar-left">
            <div className="bar-thumb">♪</div>
            <div className="bar-info">
              <span className="<span className="bar-song">{songName}</span>
<span className="bar-artist">Ed Sheeran & more</span>">{songName}</span>
              <span className="bar-artist">Ed Sheeran & more</span>
            </div>
          </div>

          <div className="bar-center">
            {/* Hidden autoplay YouTube player */}
            <div className="yt-hidden">
              <YouTube
                opts={{
                  width: '1', height: '1',
                  playerVars: {
                    listType: 'playlist',
                    list: PLAYLIST_ID,
                    autoplay: 1,
                    rel: 0,
                    loop: 1,
                  },
                }}
                onReady={handlePlayerReady}
                onStateChange={handleStateChange}
              />
            </div>
            <div className="bar-controls">
              <button className="bar-btn" onClick={handlePrev} title="Previous">⏮</button>
              <button className="bar-btn bar-btn-play" onClick={handlePlay} title="Play">▶</button>
              <button className="bar-btn" onClick={handlePause} title="Pause">⏸</button>
              <button className="bar-btn" onClick={handleNext} title="Next">⏭</button>
              <div className="volume-wrap">
                <span className="volume-icon">🔉</span>
                <input
                  type="range" min="0" max="100" value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
          </div>

          <div className="bar-right">
            <button className="bar-scroll" onClick={() => scrollTo('letter')}>
              SCROLL DOWN ↓
            </button>
          </div>
        </motion.div>
      </section>

      {/* LETTER */}
      <section id="letter" className="letter-section">
        <div className="letter-inner">
          <FadeIn className="letter-left">
            <span className="eyebrow">A Letter For You</span>
            <h2 className="letter-heading">To the one who<br />makes life beautiful.</h2>
            <div className="pink-line" />
            <p className="letter-body">
              My best friend, my love, my everything. Wherever you go, you bring light
              that fills every room and every heart around you. This year is extra special —
              you are thirty-five, glowing, and growing our little miracle. You have never
              been more beautiful. Happy Birthday Loreta.
            </p>
            <span className="letter-heart">♡</span>
          </FadeIn>
          <FadeIn delay={0.2} className="letter-right">
            <div className="letter-photo-wrap">
              <img
                src="/images/letter/letter.jpg"
                alt="Loreta"
                className="letter-photo"
                onError={e => { e.target.src = '/images/hero/hero.jpg'; }}
              />
              <svg className="flower-svg" viewBox="0 0 100 160" fill="none">
                <line x1="50" y1="160" x2="50" y2="60" stroke="#c9a96e" strokeWidth="0.8" strokeDasharray="3,3"/>
                <ellipse cx="50" cy="45" rx="10" ry="18" fill="none" stroke="#c9a96e" strokeWidth="0.8" transform="rotate(-35 50 45)"/>
                <ellipse cx="50" cy="45" rx="10" ry="18" fill="none" stroke="#c9a96e" strokeWidth="0.8" transform="rotate(35 50 45)"/>
                <ellipse cx="50" cy="45" rx="10" ry="18" fill="none" stroke="#c9a96e" strokeWidth="0.8"/>
                <circle cx="50" cy="45" r="7" fill="none" stroke="#c9a96e" strokeWidth="0.8"/>
                <path d="M38 100 Q48 90 50 108 Q52 90 62 100" stroke="#c9a96e" strokeWidth="0.8" fill="none"/>
              </svg>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MEMORIES */}
      <section id="memories" className="memories-section">
        <FadeIn>
          <div className="memories-header">
            <span className="eyebrow light">Our Memories</span>
            <h2 className="memories-heading">Moments that<br />mean everything.</h2>
            <p className="memories-sub">{ALL_PHOTOS.length} photos · showing {PREVIEW_COUNT} preview</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="memories-strip">
            {previewPhotos.map((src, i) => (
              <div key={i} className="memory-item" onClick={() => setLightbox(src)}>
                <img src={src} alt={`Memory ${i + 1}`} className="memory-img" />
                <div className="memory-overlay">View</div>
              </div>
            ))}
            {/* +more indicator */}
            {ALL_PHOTOS.length > PREVIEW_COUNT && (
              <div className="memory-more" onClick={handleDownloadZip}>
                <span className="memory-more-num">+{ALL_PHOTOS.length - PREVIEW_COUNT}</span>
                <span className="memory-more-label">more photos<br />in download</span>
              </div>
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <button className="download-btn" onClick={handleDownloadZip} disabled={downloading}>
            {downloading ? '⏳ Preparing zip...' : '↓ \u00a0 DOWNLOAD ALL MEMORIES'}
          </button>
          <p className="download-note">Downloads all {ALL_PHOTOS.length} photos as a single zip file</p>
        </FadeIn>
      </section>

      {/* MUSIC */}
      <section id="music" className="music-section">
        <div className="music-inner">
          <FadeIn className="music-left">
            <span className="eyebrow">The Soundtrack</span>
            <h2 className="music-heading">Songs that<br />remind me of us.</h2>
            <div className="pink-line" />
            <p className="music-desc">
              A playlist for you,<br />
              filled with the songs<br />
              that tell our story.
            </p>
            <p className="music-cta"><em>Press play and enjoy ♡</em></p>
          </FadeIn>
          <FadeIn delay={0.2} className="music-right">
            <div className="yt-card">
              <YouTube
                opts={{
                  width: '100%', height: '100%',
                  playerVars: {
                    listType: 'playlist',
                    list: PLAYLIST_ID,
                    autoplay: 0,
                    rel: 0,
                    modestbranding: 1,
                  },
                }}
                className="yt-player"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-msg">HAPPY 35TH BIRTHDAY, MY LOVE</p>
        <span className="footer-heart">♥</span>
        <p className="footer-credit">thirty-five.love · made with love</p>
      </footer>

      {/* LIGHTBOX */}
      {lightbox && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setLightbox(null)}>
          <button className="lightbox-close">✕</button>
          <img src={lightbox} alt="Memory" className="lightbox-img" />
        </motion.div>
      )}
    </div>
  );
}
