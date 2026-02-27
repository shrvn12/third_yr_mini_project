<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-text">
        <p class="hero-eyebrow">🔥 5-day streak — keep it up!</p>
        <h2>Welcome back, Shravan! 👋</h2>
        <p class="hero-sub">
          You're 65% through
          <strong>Unit 3: Loops &amp; Logic</strong> — so close!
        </p>
        <div class="btn-row">
          <button class="btn primary">▶ Continue Learning</button>
          <button class="btn ghost">🧠 Quick Quiz</button>
        </div>
      </div>
      <div class="hero-emoji">🌱</div>
    </section>


    <!-- STATS -->
    <section class="stats-grid">

      <div class="stat" style="--accent:#0ea5e9">
        <div class="stat-icon">⭐</div>
        <div class="stat-num">1,240</div>
        <div class="stat-label">Total XP Earned</div>
      </div>

      <div class="stat" style="--accent:#22c55e">
        <div class="stat-icon">📖</div>
        <div class="stat-num">18</div>
        <div class="stat-label">Lessons Done</div>
      </div>

      <div class="stat" style="--accent:#ec4899">
        <div class="stat-icon">🏅</div>
        <div class="stat-num">7</div>
        <div class="stat-label">Badges Earned</div>
      </div>

      <div class="stat" style="--accent:#f59e0b">
        <div class="stat-icon">🔥</div>
        <div class="stat-num">5</div>
        <div class="stat-label">Day Streak</div>
      </div>

    </section>


    <!-- MAIN CONTENT -->
    <section class="main-grid">

      <!-- CONTINUE LEARNING -->
      <div>
        <h3 class="section-title">📖 Continue Learning</h3>

        <div class="lesson-cards">

          <div class="card">
            <div class="card-cover" style="background:linear-gradient(135deg,#dbeafe,#c7d2fe)">
              🔄
            </div>
            <div class="card-body">
              <span class="tag" style="background:#dbeafe;color:#1d4ed8">Unit 3</span>
              <h4>Loops – Repeat After Me!</h4>
              <p class="meta">⏱ 20 min · ⭐ 80 XP</p>
              <div class="progress">
                <span class="progress-fill" style="width:65%;background:linear-gradient(90deg,#0ea5e9,#8b5cf6)"></span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-cover" style="background:linear-gradient(135deg,#dcfce7,#a7f3d0)">
              🤔
            </div>
            <div class="card-body">
              <span class="tag" style="background:#dcfce7;color:#15803d">Unit 3</span>
              <h4>If-Else – Making Decisions</h4>
              <p class="meta">⏱ 18 min · ⭐ 70 XP</p>
              <div class="progress">
                <span class="progress-fill" style="width:0%;background:var(--leaf)"></span>
              </div>
            </div>
          </div>

        </div>
      </div>


      <!-- LEADERBOARD -->
      <div>
        <h3 class="section-title">🏆 Leaderboard</h3>

        <div class="panel">

          <div class="leader-row">
            <span class="rank gold">🥇</span>
            <span class="lb-name">Aryan K.</span>
            <span class="lb-xp">1,820 XP</span>
          </div>

          <div class="leader-row">
            <span class="rank silver">🥈</span>
            <span class="lb-name">Meena R.</span>
            <span class="lb-xp">1,560 XP</span>
          </div>

          <div class="leader-row you">
            <span class="rank">🐱</span>
            <span class="lb-name">You</span>
            <span class="lb-xp">1,240 XP</span>
          </div>

          <div class="leader-row">
            <span class="rank muted">5</span>
            <span class="lb-name">Rohan M.</span>
            <span class="lb-xp">980 XP</span>
          </div>

          <button class="btn primary full-width">
            See Full Leaderboard →
          </button>

        </div>
      </div>

    </section>

  </div>
</template>

<script>
export default {
  name: "HomeView"
}
</script>

<style scoped>
/* ── Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

/* ── Tokens ── */
.home {
  --sky:    #0ea5e9;
  --leaf:   #22c55e;
  --sun:    #f59e0b;
  --berry:  #ec4899;
  --grape:  #8b5cf6;
  --dark:   #1e1b4b;
  --white:  #ffffff;
  --cream:  #fefce8;
  --muted:  #64748b;
  --radius: 18px;
  --shadow: 0 6px 24px rgba(0,0,0,0.09);

  font-family: 'Nunito', sans-serif;
  color: var(--dark);
  padding: 28px;
  background: #f8faff;
  min-height: 100vh;
}

/* ── Hero ── */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #0f172a 100%);
  border-radius: 24px;
  padding: 36px 40px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  right: -80px; top: -80px;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,158,11,0.22), transparent 70%);
  pointer-events: none;
}

.hero-eyebrow {
  display: inline-block;
  background: rgba(245,158,11,0.18);
  color: #fde68a;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 12px;
}

.hero-text h2 {
  font-family: 'Baloo 2', cursive;
  font-size: 28px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 8px;
  line-height: 1.2;
}

.hero-sub {
  color: rgba(255,255,255,0.62);
  font-size: 15px;
  line-height: 1.6;
  max-width: 380px;
}

.hero-sub strong {
  color: #fde68a;
}

.hero-emoji {
  font-size: 88px;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
  user-select: none;
}

@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
}

/* ── Buttons ── */
.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 99px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn.primary {
  background: linear-gradient(135deg, var(--sun), #f97316);
  color: var(--dark);
  box-shadow: 0 4px 14px rgba(245,158,11,0.4);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245,158,11,0.5);
}

.btn.ghost {
  background: rgba(255,255,255,0.1);
  color: var(--white);
  border: 2px solid rgba(255,255,255,0.2);
}

.btn.ghost:hover {
  background: rgba(255,255,255,0.18);
}

.btn.full-width {
  width: 100%;
  justify-content: center;
  margin-top: 14px;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px 18px;
  box-shadow: var(--shadow);
  border-bottom: 4px solid var(--accent, var(--sky));
  transition: transform 0.2s;
}

.stat:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 26px;
  margin-bottom: 8px;
}

.stat-num {
  font-family: 'Baloo 2', cursive;
  font-size: 30px;
  font-weight: 800;
  color: var(--dark);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
}

/* ── Main two-column grid ── */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.section-title {
  font-family: 'Baloo 2', cursive;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--dark);
}

/* ── Lesson cards ── */
.lesson-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: row;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.13);
}

.card-cover {
  width: 110px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
}

.card-body {
  padding: 16px 18px;
  flex: 1;
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}

.card-body h4 {
  font-family: 'Baloo 2', cursive;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--dark);
}

.meta {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 10px;
}

.progress {
  height: 7px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}

/* ── Leaderboard panel ── */
.panel {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.leader-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 12px;
  margin-bottom: 4px;
  transition: background 0.15s;
}

.leader-row:hover {
  background: #f8fafc;
}

.leader-row.you {
  background: #f0fdf4;
  border: 2px dashed var(--leaf);
}

.rank {
  font-size: 20px;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}

.rank.muted {
  font-family: 'Baloo 2', cursive;
  font-size: 16px;
  font-weight: 800;
  color: var(--muted);
}

.lb-name {
  flex: 1;
  font-weight: 700;
  font-size: 15px;
  color: var(--dark);
}

.lb-xp {
  font-family: 'Baloo 2', cursive;
  font-weight: 800;
  font-size: 15px;
  color: var(--sun);
}
</style>