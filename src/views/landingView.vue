<template>
  <div class="landing">

    <!-- Floating orbs background -->
    <div class="bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- NAV -->
    <nav class="nav">
      <div class="nav-brand">
        <span class="brand-icon">🚀</span>
        <span class="brand-text">Code<strong>Kids</strong></span>
      </div>
      <div class="nav-links">
        <a href="#features" class="nav-link">What We Teach</a>
        <a href="#curriculum" class="nav-link">Curriculum</a>
        <a href="#how" class="nav-link">How It Works</a>
      </div>
      <div class="nav-ctas">
        <RouterLink to="/auth?mode=login" class="btn-nav-ghost">Log In</RouterLink>
        <RouterLink to="/auth?mode=signup" class="btn-nav-solid">Get Started Free →</RouterLink>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="eyebrow-dot"></span>
          Free for rural government schools across India
        </div>

        <h1 class="hero-title">
          Every kid deserves to<br>
          <span class="title-highlight">learn to code.</span>
        </h1>

        <p class="hero-desc">
          CodeKids is a playful, gamified digital literacy platform built for
          grades 3–8. Learn programming through games, puzzles, and challenges —
          no internet speed or device required.
        </p>

        <div class="hero-actions">
          <RouterLink to="/auth?mode=signup" class="btn-hero-primary">
            Start Learning Free
            <span class="btn-arrow">→</span>
          </RouterLink>
          <a href="#how" class="btn-hero-ghost">
            <span class="play-dot">▶</span>
            See how it works
          </a>
        </div>

        <div class="hero-trust">
          <div class="trust-item">
            <span class="trust-num">12,000+</span>
            <span class="trust-label">Students learning</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <span class="trust-num">420+</span>
            <span class="trust-label">Schools enrolled</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <span class="trust-num">6</span>
            <span class="trust-label">States covered</span>
          </div>
        </div>
      </div>

      <!-- Hero visual -->
      <div class="hero-visual">
        <div class="screen-mockup">
          <div class="mockup-bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="mockup-url">codekids.app</span>
          </div>
          <div class="mockup-body">
            <div class="mock-hero-banner">
              <div class="mock-text">
                <div class="mock-line w60"></div>
                <div class="mock-line w80 mt4"></div>
                <div class="mock-line w40 mt4"></div>
              </div>
              <span class="mock-emoji">🌱</span>
            </div>
            <div class="mock-stats">
              <div class="mock-stat c1"><span>⭐</span><div class="mock-line w70"></div></div>
              <div class="mock-stat c2"><span>📖</span><div class="mock-line w60"></div></div>
              <div class="mock-stat c3"><span>🏅</span><div class="mock-line w50"></div></div>
              <div class="mock-stat c4"><span>🔥</span><div class="mock-line w70"></div></div>
            </div>
            <div class="mock-cards">
              <div class="mock-card">
                <div class="mock-cover" style="background:linear-gradient(135deg,#dbeafe,#c7d2fe)">🔄</div>
                <div class="mock-card-body">
                  <div class="mock-line w80"></div>
                  <div class="mock-line w50 mt4"></div>
                  <div class="mock-progress"><div class="mock-fill" style="width:65%"></div></div>
                </div>
              </div>
              <div class="mock-card">
                <div class="mock-cover" style="background:linear-gradient(135deg,#dcfce7,#a7f3d0)">🤔</div>
                <div class="mock-card-body">
                  <div class="mock-line w90"></div>
                  <div class="mock-line w40 mt4"></div>
                  <div class="mock-progress"><div class="mock-fill" style="width:0%"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating badges -->
        <div class="float-badge fb-1">🏆 +80 XP earned!</div>
        <div class="float-badge fb-2">🔥 5 day streak!</div>
        <div class="float-badge fb-3">🎉 Badge unlocked!</div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features" id="features">
      <div class="section-label">WHAT WE TEACH</div>
      <h2 class="section-title">Everything a young coder needs</h2>
      <p class="section-sub">From "what is a computer" to building real Python programs — all in one place.</p>

      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.title">
          <div class="feature-icon" :style="{ background: f.bg }">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CURRICULUM STRIP -->
    <section class="curriculum-strip" id="curriculum">
      <div class="cs-inner">
        <div class="section-label light">CURRICULUM</div>
        <h2 class="section-title light">6 Units, 42 Lessons. Grades 3–8.</h2>
        <div class="units-row">
          <div class="unit-pill" v-for="u in units" :key="u.name">
            <span class="unit-icon">{{ u.icon }}</span>
            <div>
              <p class="unit-name">{{ u.name }}</p>
              <p class="unit-grade">{{ u.grade }}</p>
            </div>
          </div>
        </div>
        <RouterLink to="/auth?mode=signup" class="btn-cs">Explore the Full Curriculum →</RouterLink>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how" id="how">
      <div class="section-label">HOW IT WORKS</div>
      <h2 class="section-title">Learn. Play. Level up.</h2>

      <div class="steps">
        <div class="step" v-for="(s, i) in steps" :key="s.title">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-icon">{{ s.icon }}</div>
          <h3 class="step-title">{{ s.title }}</h3>
          <p class="step-desc">{{ s.desc }}</p>
          <div class="step-connector" v-if="i < steps.length - 1"></div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials">
      <div class="section-label">STORIES</div>
      <h2 class="section-title">Kids across India are learning to code</h2>
      <div class="testi-grid">
        <div class="testi-card" v-for="t in testimonials" :key="t.name">
          <p class="testi-quote">"{{ t.quote }}"</p>
          <div class="testi-person">
            <div class="testi-avatar">{{ t.avatar }}</div>
            <div>
              <p class="testi-name">{{ t.name }}</p>
              <p class="testi-role">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="cta-banner">
      <div class="cta-inner">
        <div class="cta-orb"></div>
        <h2 class="cta-title">Ready to start coding? 🚀</h2>
        <p class="cta-sub">Join 12,000+ students already learning. It's completely free.</p>
        <RouterLink to="/auth?mode=signup" class="btn-cta">
          Create Your Free Account →
        </RouterLink>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-brand">
        <span class="brand-icon">🚀</span>
        <span class="brand-text">Code<strong>Kids</strong></span>
      </div>
      <p class="footer-sub">Built for rural government schools across India. Free, always.</p>
      <p class="footer-copy">© 2025 CodeKids · Made with ❤️ for every curious child</p>
    </footer>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const features = [
  { icon:'💻', title:'Computer Basics',      desc:'Hardware, internet, typing, digital safety — the essential foundation for every student.',   bg:'linear-gradient(135deg,#dbeafe,#c7d2fe)' },
  { icon:'🤖', title:'Algorithms & Logic',   desc:'Sequences, patterns, decomposition, and flowcharts — learn to think like a computer.',        bg:'linear-gradient(135deg,#dcfce7,#a7f3d0)' },
  { icon:'🧱', title:'Block Coding',         desc:'Build animations and games in Scratch. The perfect bridge from thinking to making.',           bg:'linear-gradient(135deg,#fde68a,#fca5a5)' },
  { icon:'🐍', title:'Python Programming',   desc:'Write real text-based code. Variables, loops, functions — proper programming from scratch.',   bg:'linear-gradient(135deg,#ede9fe,#c7d2fe)' },
  { icon:'🌐', title:'HTML & Web',           desc:'Build a webpage about your village. Tags, CSS, and a taste of JavaScript interaction.',        bg:'linear-gradient(135deg,#ffedd5,#fed7aa)' },
  { icon:'🎮', title:'Games & Puzzles',      desc:'Every concept has a game. Catch the Mango, Bug Hunt, Code Rocket — learning disguised as fun.', bg:'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
]

const units = [
  { icon:'🌱', name:'Computer Basics',    grade:'Grades 3–4' },
  { icon:'🤖', name:'Algorithms',         grade:'Grades 4–5' },
  { icon:'🧱', name:'Block Coding',       grade:'Grades 4–6' },
  { icon:'🐍', name:'Python',             grade:'Grades 6–8' },
  { icon:'🌐', name:'HTML & Web',         grade:'Grades 7–8' },
  { icon:'💼', name:'Tech & Careers',     grade:'Grades 7–8' },
]

const steps = [
  { icon:'👤', title:'Create your account',   desc:'Sign up in seconds. Pick your avatar, enter your grade, and you\'re ready to go.' },
  { icon:'📚', title:'Follow the curriculum', desc:'Lessons unlock progressively. Short, focused, and designed for real classroom contexts.' },
  { icon:'🎮', title:'Play to learn',         desc:'Every concept has a matching game, quiz, or puzzle. XP rewards every correct answer.' },
  { icon:'🏆', title:'Level up & earn',       desc:'Badges, streaks, and leaderboards keep you coming back. See your rank in your class.' },
]

const testimonials = [
  { avatar:'👩‍🏫', name:'Priya Madam',     role:'Teacher, Rajasthan Govt. School',   quote:'My students who never touched a computer before are now writing Python loops. CodeKids made that possible in 3 months.' },
  { avatar:'🧒',   name:'Arjun, Age 11',   role:'Grade 6, Madhya Pradesh',            quote:'I made a game in Scratch! My dad was so proud. I want to make more games when I grow up.' },
  { avatar:'👨‍💼',  name:'Ramesh Sir',      role:'Principal, Sunrise School Bihar',    quote:'We had zero infrastructure for coding education. CodeKids ran on our 5 shared computers with slow internet. It still worked perfectly.' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap');

.landing {
  --dark:   #1e1b4b;
  --white:  #ffffff;
  --cream:  #fefce8;
  --muted:  #64748b;
  --sun:    #f59e0b;
  --leaf:   #22c55e;
  --sky:    #0ea5e9;
  --berry:  #ec4899;
  --grape:  #8b5cf6;
  font-family: 'Nunito', sans-serif;
  background: #0d0a2e;
  color: var(--white);
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── Background orbs ── */
.bg-orbs { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
.orb {
  position:absolute; border-radius:50%;
  filter:blur(80px); opacity:.35;
}
.orb-1 { width:600px; height:600px; background:radial-gradient(circle,#4338ca,transparent); top:-200px; right:-100px; animation:drift1 18s ease-in-out infinite; }
.orb-2 { width:400px; height:400px; background:radial-gradient(circle,#f59e0b,transparent); bottom:10%; left:-100px; animation:drift2 22s ease-in-out infinite; }
.orb-3 { width:300px; height:300px; background:radial-gradient(circle,#ec4899,transparent); top:50%; left:40%; animation:drift3 16s ease-in-out infinite; }
@keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,60px)} }
@keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,-40px)} }
@keyframes drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,50px)} }

/* All content above orbs */
.nav, .hero, .features, .curriculum-strip, .how, .testimonials, .cta-banner, .footer {
  position: relative; z-index: 1;
}

/* ── Nav ── */
.nav {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px 60px; max-width:1280px; margin:0 auto;
}
.nav-brand { display:flex; align-items:center; gap:10px; }
.brand-icon { font-size:26px; }
.brand-text { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; color:var(--white); }
.brand-text strong { color:var(--sun); }
.nav-links { display:flex; gap:32px; }
.nav-link  { color:rgba(255,255,255,.6); font-size:14px; font-weight:700; text-decoration:none; transition:color .2s; }
.nav-link:hover { color:var(--white); }
.nav-ctas { display:flex; gap:12px; align-items:center; }
.btn-nav-ghost {
  padding:9px 20px; border-radius:99px; font-family:'Nunito',sans-serif; font-weight:700;
  font-size:14px; color:rgba(255,255,255,.7); border:2px solid rgba(255,255,255,.2);
  background:transparent; text-decoration:none; transition:all .2s;
}
.btn-nav-ghost:hover { color:var(--white); border-color:rgba(255,255,255,.5); }
.btn-nav-solid {
  padding:9px 20px; border-radius:99px; font-family:'Nunito',sans-serif; font-weight:700;
  font-size:14px; color:#1e1b4b; background:linear-gradient(135deg,var(--sun),#f97316);
  text-decoration:none; box-shadow:0 4px 18px rgba(245,158,11,.4); transition:all .2s;
}
.btn-nav-solid:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(245,158,11,.5); }

/* ── Hero ── */
.hero {
  display:grid; grid-template-columns:1fr 1fr; gap:60px;
  align-items:center; padding:60px 60px 80px;
  max-width:1280px; margin:0 auto;
}

.hero-eyebrow {
  display:flex; align-items:center; gap:8px;
  font-size:13px; font-weight:700; color:var(--leaf);
  margin-bottom:20px;
}
.eyebrow-dot {
  width:8px; height:8px; border-radius:50%; background:var(--leaf);
  box-shadow:0 0 8px var(--leaf); animation:pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

.hero-title {
  font-family:'Baloo 2',cursive; font-size:56px; font-weight:900;
  line-height:1.1; margin:0 0 20px; color:var(--white);
}
.title-highlight {
  background:linear-gradient(135deg,var(--sun),var(--berry));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text;
}

.hero-desc { font-size:17px; color:rgba(255,255,255,.6); line-height:1.7; margin:0 0 32px; max-width:480px; }

.hero-actions { display:flex; gap:16px; align-items:center; margin-bottom:40px; flex-wrap:wrap; }

.btn-hero-primary {
  display:inline-flex; align-items:center; gap:10px;
  padding:14px 28px; border-radius:99px; font-family:'Nunito',sans-serif;
  font-weight:800; font-size:16px; color:#1e1b4b;
  background:linear-gradient(135deg,var(--sun),#f97316); text-decoration:none;
  box-shadow:0 6px 24px rgba(245,158,11,.45); transition:all .2s;
}
.btn-hero-primary:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(245,158,11,.55); }
.btn-arrow { font-size:18px; transition:transform .2s; }
.btn-hero-primary:hover .btn-arrow { transform:translateX(4px); }

.btn-hero-ghost {
  display:inline-flex; align-items:center; gap:10px;
  padding:14px 24px; border-radius:99px; font-family:'Nunito',sans-serif;
  font-weight:700; font-size:15px; color:rgba(255,255,255,.8);
  background:rgba(255,255,255,.08); border:2px solid rgba(255,255,255,.15);
  text-decoration:none; transition:all .2s;
}
.btn-hero-ghost:hover { background:rgba(255,255,255,.14); color:var(--white); }
.play-dot { font-size:12px; }

.hero-trust { display:flex; align-items:center; gap:24px; }
.trust-item { display:flex; flex-direction:column; gap:2px; }
.trust-num   { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; color:var(--sun); line-height:1; }
.trust-label { font-size:12px; color:rgba(255,255,255,.45); font-weight:600; }
.trust-divider { width:1px; height:36px; background:rgba(255,255,255,.15); }

/* ── Screen mockup ── */
.hero-visual { position:relative; }
.screen-mockup {
  background:#0d1117; border-radius:16px; overflow:hidden;
  box-shadow:0 24px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08);
  animation:float 4s ease-in-out infinite;
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.mockup-bar {
  background:#161b22; padding:10px 16px;
  display:flex; align-items:center; gap:6px;
  border-bottom:1px solid rgba(255,255,255,.06);
}
.dot { width:10px; height:10px; border-radius:50%; }
.dot.r { background:#ef4444; }
.dot.y { background:#f59e0b; }
.dot.g { background:#22c55e; }
.mockup-url { margin-left:8px; font-size:11px; color:#484f58; font-family:monospace; }
.mockup-body { padding:16px; background:#f8faff; }

.mock-hero-banner {
  background:linear-gradient(135deg,#1e1b4b,#312e81);
  border-radius:12px; padding:16px; display:flex;
  align-items:center; justify-content:space-between; margin-bottom:12px;
}
.mock-text { flex:1; }
.mock-line { height:8px; border-radius:99px; background:rgba(255,255,255,.25); }
.mock-line.w40 { width:40%; }
.mock-line.w60 { width:60%; }
.mock-line.w70 { width:70%; }
.mock-line.w80 { width:80%; }
.mock-line.w90 { width:90%; }
.mock-line.mt4 { margin-top:6px; }
.mock-emoji { font-size:36px; }

.mock-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }
.mock-stat  {
  border-radius:10px; padding:10px 8px;
  display:flex; flex-direction:column; align-items:center; gap:4px;
  font-size:16px;
}
.mock-stat.c1 { background:#dbeafe; }
.mock-stat.c2 { background:#dcfce7; }
.mock-stat.c3 { background:#fce7f3; }
.mock-stat.c4 { background:#fef9c3; }
.mock-stat .mock-line { width:100%; }

.mock-cards { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.mock-card { background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.06); }
.mock-cover { height:60px; display:flex; align-items:center; justify-content:center; font-size:28px; }
.mock-card-body { padding:10px; }
.mock-progress { height:5px; background:#f1f5f9; border-radius:99px; overflow:hidden; margin-top:8px; }
.mock-fill { height:100%; background:linear-gradient(90deg,#0ea5e9,#8b5cf6); border-radius:99px; }

/* Floating badges */
.float-badge {
  position:absolute; background:var(--white); color:#1e1b4b;
  font-size:13px; font-weight:800; padding:8px 14px;
  border-radius:99px; box-shadow:0 6px 24px rgba(0,0,0,.2);
  white-space:nowrap;
}
.fb-1 { top:-16px; left:-24px; animation:fbFloat1 3s ease-in-out infinite; }
.fb-2 { bottom:60px; left:-32px; animation:fbFloat2 3.5s ease-in-out infinite; }
.fb-3 { top:40%; right:-20px; animation:fbFloat3 4s ease-in-out infinite; }
@keyframes fbFloat1 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(-2deg)} }
@keyframes fbFloat2 { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
@keyframes fbFloat3 { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-6px) rotate(-1deg)} }

/* ── Shared section styles ── */
.section-label {
  font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:2px;
  color:var(--sun); margin-bottom:12px;
}
.section-label.light { color:rgba(255,255,255,.5); }
.section-title { font-family:'Baloo 2',cursive; font-size:36px; font-weight:800; margin:0 0 10px; }
.section-title.light { color:var(--white); }
.section-sub   { color:rgba(255,255,255,.55); font-size:16px; margin:0 0 48px; }

/* ── Features ── */
.features {
  padding:80px 60px;
  max-width:1280px; margin:0 auto;
  text-align:center;
}
.features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:48px; }
.feature-card  {
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
  border-radius:20px; padding:28px 24px; text-align:left;
  transition:all .25s;
}
.feature-card:hover { background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.15); transform:translateY(-4px); }
.feature-icon  { width:54px; height:54px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; margin-bottom:16px; }
.feature-title { font-family:'Baloo 2',cursive; font-size:18px; font-weight:800; margin:0 0 8px; color:var(--white); }
.feature-desc  { font-size:14px; color:rgba(255,255,255,.55); line-height:1.6; margin:0; }

/* ── Curriculum strip ── */
.curriculum-strip {
  background:rgba(255,255,255,.03); border-top:1px solid rgba(255,255,255,.08);
  border-bottom:1px solid rgba(255,255,255,.08); padding:60px;
}
.cs-inner { max-width:1280px; margin:0 auto; }
.units-row { display:flex; gap:12px; flex-wrap:wrap; margin:28px 0; }
.unit-pill {
  display:flex; align-items:center; gap:10px;
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12);
  border-radius:14px; padding:12px 18px; transition:all .2s;
}
.unit-pill:hover { background:rgba(255,255,255,.1); border-color:var(--sun); }
.unit-icon { font-size:24px; }
.unit-name  { font-weight:800; font-size:14px; color:var(--white); margin:0; }
.unit-grade { font-size:11px; color:rgba(255,255,255,.45); margin:0; }
.btn-cs {
  display:inline-block; padding:12px 26px; border-radius:99px;
  background:linear-gradient(135deg,var(--sun),#f97316); color:#1e1b4b;
  font-family:'Nunito',sans-serif; font-weight:800; font-size:15px;
  text-decoration:none; box-shadow:0 4px 18px rgba(245,158,11,.4);
  transition:all .2s;
}
.btn-cs:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(245,158,11,.5); }

/* ── How it works ── */
.how { padding:80px 60px; max-width:1280px; margin:0 auto; }
.steps {
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:0; margin-top:48px; position:relative;
}
.step {
  text-align:center; padding:0 20px; position:relative;
}
.step-num {
  width:36px; height:36px; border-radius:50%;
  background:linear-gradient(135deg,var(--sky),var(--grape));
  color:#fff; font-family:'Baloo 2',cursive; font-weight:800; font-size:16px;
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 14px;
}
.step-icon  { font-size:42px; margin-bottom:14px; }
.step-title { font-family:'Baloo 2',cursive; font-size:18px; font-weight:800; margin:0 0 8px; color:var(--white); }
.step-desc  { font-size:14px; color:rgba(255,255,255,.55); line-height:1.6; margin:0; }
.step-connector {
  position:absolute; top:18px; left:calc(50% + 30px);
  width:calc(100% - 60px); height:2px;
  background:linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.05));
}

/* ── Testimonials ── */
.testimonials { padding:80px 60px; max-width:1280px; margin:0 auto; }
.testi-grid {
  display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:48px;
}
.testi-card {
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
  border-radius:20px; padding:28px;
}
.testi-quote  { font-size:15px; color:rgba(255,255,255,.75); line-height:1.7; margin:0 0 20px; font-style:italic; }
.testi-person { display:flex; align-items:center; gap:12px; }
.testi-avatar {
  width:44px; height:44px; border-radius:50%;
  background:linear-gradient(135deg,#ede9fe,#4338ca);
  display:flex; align-items:center; justify-content:center; font-size:22px;
}
.testi-name { font-weight:800; font-size:14px; margin:0 0 2px; color:var(--white); }
.testi-role { font-size:12px; color:rgba(255,255,255,.45); margin:0; }

/* ── CTA banner ── */
.cta-banner {
  padding:60px; text-align:center;
}
.cta-inner {
  max-width:600px; margin:0 auto;
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1);
  border-radius:28px; padding:56px 40px; position:relative; overflow:hidden;
}
.cta-orb {
  position:absolute; width:300px; height:300px; border-radius:50%;
  background:radial-gradient(circle,rgba(245,158,11,.2),transparent 70%);
  top:-80px; right:-80px; pointer-events:none;
}
.cta-title { font-family:'Baloo 2',cursive; font-size:36px; font-weight:800; margin:0 0 12px; }
.cta-sub   { color:rgba(255,255,255,.6); font-size:16px; margin:0 0 28px; line-height:1.6; }
.btn-cta {
  display:inline-block; padding:14px 32px; border-radius:99px;
  background:linear-gradient(135deg,var(--sun),#f97316); color:#1e1b4b;
  font-family:'Nunito',sans-serif; font-weight:800; font-size:16px;
  text-decoration:none; box-shadow:0 6px 24px rgba(245,158,11,.45);
  transition:all .2s;
}
.btn-cta:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(245,158,11,.55); }

/* ── Footer ── */
.footer {
  text-align:center; padding:40px 60px 50px;
  border-top:1px solid rgba(255,255,255,.08);
}
.footer-brand { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:10px; }
.footer-sub   { color:rgba(255,255,255,.4); font-size:14px; margin:0 0 6px; }
.footer-copy  { color:rgba(255,255,255,.25); font-size:12px; margin:0; }

/* ── Responsive ── */
@media (max-width:1024px) {
  .nav   { padding:16px 32px; }
  .nav-links { display:none; }
  .hero  { grid-template-columns:1fr; padding:40px 32px 60px; }
  .hero-visual { display:none; }
  .hero-title { font-size:40px; }
  .features, .how, .testimonials, .cta-banner, .curriculum-strip { padding:60px 32px; }
  .features-grid { grid-template-columns:1fr 1fr; }
  .steps { grid-template-columns:1fr 1fr; gap:32px; }
  .step-connector { display:none; }
  .testi-grid { grid-template-columns:1fr; }
}
@media (max-width:600px) {
  .nav { padding:14px 20px; }
  .features-grid, .steps { grid-template-columns:1fr; }
  .hero-title { font-size:32px; }
  .section-title { font-size:28px; }
  .units-row { flex-direction:column; }
}
</style>