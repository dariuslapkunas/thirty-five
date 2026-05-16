import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import YouTube from 'react-youtube';
import './App.css';

const PLAYLIST_ID = 'PLVE-SETlYfQdCCv9cMRteaKW1oyk4cFkm';

const galleryImages = [
  { id: 1, src: '/images/gallery/memory1.jpg', label: 'Then' },
  { id: 2, src: '/images/gallery/memory2.jpg', label: 'Always' },
  { id: 3, src: '/images/gallery/memory3.jpg', label: 'Together' },
  { id: 4, src: '/images/gallery/memory4.jpg', label: 'Joy' },
  { id: 5, src: '/images/gallery/memory5.jpg', label: 'Love' },
  { id: 6, src: '/images/gallery/memory6.jpg', label: 'Life' },
  { id: 7, src: '/images/gallery/memory7.jpg', label: 'Now' },
];

const partyImages = [
  { id: 1, src: '/images/party/party1.jpg' },
  { id: 2, src: '/images/party/party2.jpg' },
  { id: 3, src: '/images/party/party3.jpg' },
  { id: 4, src: '/images/party/party4.jpg' },
  { id: 5, src: '/images/party/party5.jpg' },
  { id: 6, src: '/images/party/party6.jpg' },
  { id: 7, src: '/images/party/party7.jpg' },
  { id: 8, src: '/images/party/party8.jpg' },
  { id: 9, src: '/images/party/party9.jpg' },
  { id: 10, src: '/images/party/party10.jpg' },
];

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [lightbox, setLightbox] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-logo">
          <span className="nav-logo-num">35</span>
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['hero', 'music', 'memories', 'party'].map((s) => (
            <li key={s}>
              <button onClick={() => scrollTo(s)}>
                {s.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="hero">
        <div className="hero-image-bg" style={{ backgroundImage: `url('/images/hero/hero.jpg')` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="hero-title-wrap"
          >
            <h1 className="hero-title" style={{ backgroundImage: `url('/images/hero/hero.jpg')` }}>
              THIRTY<br />FIVE
            </h1>
          </motion.div>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Happy Birthday, Loreta
          </motion.p>
        </div>
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          onClick={() => scrollTo('music')}
        >
          <span>SCROLL DOWN</span>
          <div className="scroll-chevron">&#8964;</div>
        </motion.div>
      </section>

      {/* ── MUSIC ── */}
      <section id="music" className="music-section">
        <div className="music-inner">
          <FadeIn>
            <div className="section-meta">
              <span className="section-num">01</span>
              <div>
                <h2 className="section-title">THE<br />SOUNDTRACK</h2>
                <p className="section-desc">A playlist for the best<br />moments in life.</p>
                <span className="section-link">PLAY &amp; ENJOY ›</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="yt-wrap">
            <div className="yt-card">
              <YouTube
                opts={{
                  width: '100%',
                  height: '100%',
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

      {/* ── MEMORIES ── */}
      <section id="memories" className="memories-section">
        <div className="memories-inner">
          <FadeIn>
            <div className="section-meta dark">
              <span className="section-num pink">02</span>
              <div>
                <h2 className="section-title white">THE<br />MEMORIES</h2>
                <p className="section-desc muted">A journey of beautiful<br />moments.</p>
                <button
  className="section-link pink"
  onClick={() => document.getElementById('memories').scrollIntoView({ behavior: 'smooth' })}
  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
>
  VIEW GALLERY ›
</button>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="bento-wrap">
            <div className="bento-grid">
              {galleryImages.map((img, i) => (
                <div
                  key={img.id}
                  className={`bento-item bento-${i + 1}`}
                  onClick={() => setLightbox(img.src)}
                >
                  <div
                    className="bento-img"
                    style={{ backgroundImage: `url(${img.src})` }}
                  />
                  <div className="bento-overlay">
                    <span>VIEW PHOTO &#8981;</span>
                  </div>
                  <span className="bento-label">{img.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PARTY ── */}
      <section id="party" className="party-section">
        <div className="party-inner">
          <FadeIn>
            <div className="section-meta dark">
              <span className="section-num pink">03</span>
              <div>
                <h2 className="section-title white">35TH<br />BIRTHDAY<br />NIGHT</h2>
                <p className="section-desc muted">The night we celebrate<br />you.</p>
                <span className="section-link pink">VIEW LIVE FEED ›</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="party-grid-wrap">
            <div className="party-grid">
              {partyImages.map((img) => (
                <div
                  key={img.id}
                  className="party-slot"
                  style={img.src ? { backgroundImage: `url(${img.src})` } : {}}
                  onClick={() => img.src && setLightbox(img.src)}
                >
                  {!img.src && (
                    <div className="party-empty">
                      <span className="party-plus">+</span>
                      <span className="party-add-label">ADD PHOTO</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer-msg">HAPPY 35TH BIRTHDAY, MY LOVE</p>
        <span className="footer-heart">♥</span>
        <p className="footer-credit">MADE WITH LOVE</p>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setLightbox(null)}
        >
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="Memory" className="lightbox-img" />
        </motion.div>
      )}
    </div>
  );
}
