<template>
  <section class="games">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">🕹️ Games</h1>
        <p class="subtitle">Learn programming concepts through fun games!</p>
      </div>
      <div class="header-stats">
        <div class="hstat">
          <span class="hstat-num">{{ totalXpEarned }}</span>
          <span class="hstat-label">XP from games</span>
        </div>
        <div class="hstat">
          <span class="hstat-num">{{ gamesPlayed }}</span>
          <span class="hstat-label">games played</span>
        </div>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="tabs" role="tablist">
      <button
        v-for="tab in tabs" :key="tab"
        class="tab" :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- Games grid -->
    <div class="games-grid">
      <article
        v-for="g in filtered" :key="g.title"
        class="card"
        :class="{ locked: g.locked, played: g.played }"
        @click="!g.locked && openGame(g)"
      >
        <!-- Banner -->
        <div class="card-banner" :style="{ background: g.gradient }">
          <span class="banner-icon">{{ g.icon }}</span>
          <div class="banner-overlays">
            <span v-if="g.played" class="badge-played">✓ Played</span>
            <span v-if="g.locked" class="badge-locked">🔒 Locked</span>
            <span v-if="g.isNew" class="badge-new">NEW</span>
          </div>
          <div class="banner-shine"></div>
        </div>

        <!-- Body -->
        <div class="card-body">
          <div class="card-top">
            <h3 class="card-title">{{ g.title }}</h3>
            <span class="xp-pill">+{{ g.xp }} XP</span>
          </div>
          <p class="card-desc">{{ g.desc }}</p>

          <!-- Chips row -->
          <div class="chips">
            <span class="chip concept">{{ g.concept }}</span>
            <span class="chip difficulty" :class="g.difficulty.toLowerCase()">
              {{ diffIcon(g.difficulty) }} {{ g.difficulty }}
            </span>
            <span class="chip age">Ages {{ g.age }}+</span>
          </div>

          <!-- Stars -->
          <div class="stars-row">
            <span
              v-for="i in 3" :key="i"
              class="star" :class="{ lit: i <= g.stars }"
            >★</span>
            <span class="stars-label">{{ g.stars }}/3 stars</span>
          </div>

          <button class="play-btn" :disabled="g.locked">
            <span v-if="g.locked">🔒 Locked</span>
            <span v-else-if="g.played">↩ Play Again</span>
            <span v-else>▶ Play Now</span>
          </button>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="empty">
      <span>🎮</span>
      <p>No games in this category yet!</p>
    </div>

    <!-- Play modal -->
    <Transition name="modal">
      <div v-if="activeGame" class="modal-backdrop" @click.self="closeGame">
        <div class="modal">
          <button class="modal-close" @click="closeGame">✕</button>
          <div class="modal-banner" :style="{ background: activeGame.gradient }">
            <span class="modal-icon">{{ activeGame.icon }}</span>
          </div>
          <div class="modal-body">
            <h2>{{ activeGame.title }}</h2>
            <p>{{ activeGame.desc }}</p>
            <div class="modal-meta">
              <span class="chip concept">{{ activeGame.concept }}</span>
              <span class="chip difficulty" :class="activeGame.difficulty.toLowerCase()">
                {{ diffIcon(activeGame.difficulty) }} {{ activeGame.difficulty }}
              </span>
              <span class="xp-pill">+{{ activeGame.xp }} XP</span>
            </div>
            <div class="modal-instructions">
              <h4>How to Play</h4>
              <p>{{ activeGame.howTo }}</p>
            </div>
            <div class="modal-actions">
              <button class="play-btn" @click="startGame">▶ Start Game</button>
              <button class="btn-secondary" @click="closeGame">Maybe Later</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = ['All', 'Beginner', 'Intermediate', 'Advanced']
const activeTab  = ref('All')
const activeGame = ref(null)

const games = [
  {
    icon: '🐢', title: 'Turtle Maze Runner',
    desc: 'Guide a turtle through a maze by writing movement commands step by step.',
    howTo: 'Choose direction commands (UP, DOWN, LEFT, RIGHT) to move your turtle from start to finish without hitting walls!',
    concept: 'Sequences', difficulty: 'Beginner', age: 7, xp: 80,  stars: 3, played: true,  locked: false, isNew: false,
    gradient: 'linear-gradient(135deg,#0f172a 0%,#312e81 100%)',
  },
  {
    icon: '🥭', title: 'Catch the Mango!',
    desc: 'Write loop conditions to control your basket and catch every falling mango.',
    howTo: 'Set how many times your basket should move left or right using loop values. Catch mangoes, miss none!',
    concept: 'Loops', difficulty: 'Beginner', age: 8, xp: 100, stars: 2, played: true,  locked: false, isNew: false,
    gradient: 'linear-gradient(135deg,#14532d 0%,#065f46 100%)',
  },
  {
    icon: '🤖', title: 'Robot Factory',
    desc: 'Program robots on the assembly line using if-else rules to sort items correctly.',
    howTo: 'Write IF conditions to tell the robot which box to place each item in. More correct placements = more stars!',
    concept: 'If-Else', difficulty: 'Beginner', age: 9, xp: 120, stars: 1, played: true,  locked: false, isNew: false,
    gradient: 'linear-gradient(135deg,#7c2d12 0%,#9a3412 100%)',
  },
  {
    icon: '🌌', title: 'Code Rocket Launch',
    desc: 'Sequence the correct code blocks in order to launch your rocket into space!',
    howTo: 'Drag and drop code blocks into the correct sequence. Wrong order = no liftoff. Get it right to blast off!',
    concept: 'Drag & Drop', difficulty: 'Beginner', age: 7, xp: 90,  stars: 0, played: false, locked: false, isNew: true,
    gradient: 'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)',
  },
  {
    icon: '🔐', title: 'Password Hero',
    desc: 'Build strong passwords and spot phishing sites before time runs out.',
    howTo: 'Rate passwords as Weak/Medium/Strong and flag fake websites. Every correct answer earns you XP!',
    concept: 'Cybersecurity', difficulty: 'Intermediate', age: 10, xp: 110, stars: 0, played: false, locked: false, isNew: true,
    gradient: 'linear-gradient(135deg,#701a75 0%,#86198f 100%)',
  },
  {
    icon: '🏡', title: 'Build My Village',
    desc: 'Write HTML and CSS code blocks to build and style your own village webpage.',
    howTo: 'Match the correct HTML tags and CSS properties to construct buildings, roads, and fields on your page!',
    concept: 'HTML & CSS', difficulty: 'Intermediate', age: 11, xp: 150, stars: 0, played: false, locked: false, isNew: false,
    gradient: 'linear-gradient(135deg,#064e3b 0%,#065f46 100%)',
  },
  {
    icon: '🧮', title: 'Function Machine',
    desc: 'Feed inputs into mystery function machines and figure out what they do.',
    howTo: 'Observe outputs for different inputs, deduce the function logic, and write it in Python to unlock the next level.',
    concept: 'Functions', difficulty: 'Advanced', age: 12, xp: 180, stars: 0, played: false, locked: true, isNew: false,
    gradient: 'linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 100%)',
  },
  {
    icon: '🕵️', title: 'Debug Detective',
    desc: 'Solve coding crimes — find bugs in broken programs and fix them to save the day.',
    howTo: 'Read broken code snippets, identify the bug type (syntax, logic, runtime), and write the fix. Each case = XP!',
    concept: 'Debugging', difficulty: 'Advanced', age: 13, xp: 200, stars: 0, played: false, locked: true, isNew: false,
    gradient: 'linear-gradient(135deg,#292524 0%,#44403c 100%)',
  },
]

const filtered = computed(() => {
  if (activeTab.value === 'All') return games
  return games.filter(g => g.difficulty === activeTab.value)
})

const totalXpEarned = computed(() =>
  games.filter(g => g.played).reduce((s, g) => s + g.xp, 0)
)
const gamesPlayed = computed(() => games.filter(g => g.played).length)

function diffIcon(d) {
  return { Beginner: '🟢', Intermediate: '🟡', Advanced: '🔴' }[d] ?? ''
}

function openGame(g)  { activeGame.value = g }
function closeGame()  { activeGame.value = null }
function startGame()  {
  // mark as played & close modal (wire to router/game engine in real app)
  const g = games.find(x => x.title === activeGame.value.title)
  if (g) g.played = true
  closeGame()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.games {
  --dark:   #1e1b4b;
  --white:  #ffffff;
  --muted:  #64748b;
  --sun:    #f59e0b;
  --leaf:   #22c55e;
  --sky:    #0ea5e9;
  --berry:  #ec4899;
  --radius: 18px;
  --shadow: 0 6px 24px rgba(0,0,0,0.09);

  font-family: 'Nunito', sans-serif;
  color: var(--dark);
  padding: 28px;
  background: #f8faff;
  min-height: 100vh;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-family: 'Baloo 2', cursive;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4px;
}

.subtitle { color: var(--muted); font-size: 15px; }

.header-stats {
  display: flex;
  gap: 16px;
}

.hstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
  border-radius: 14px;
  padding: 10px 20px;
  box-shadow: var(--shadow);
}

.hstat-num {
  font-family: 'Baloo 2', cursive;
  font-size: 24px;
  font-weight: 800;
  color: var(--sun);
  line-height: 1;
}

.hstat-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-top: 2px;
}

/* ── Tabs ── */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab {
  padding: 8px 20px;
  border-radius: 99px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: 2.5px solid #e2e8f0;
  background: var(--white);
  color: var(--muted);
  transition: all 0.18s;
}

.tab:hover  { border-color: var(--sky); color: var(--sky); }
.tab.active { background: var(--dark); color: var(--white); border-color: var(--dark); }

/* ── Grid ── */
.games-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* ── Card ── */
.card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s;
  display: flex;
  flex-direction: column;
}

.card:hover:not(.locked) {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.15);
}

.card.locked { opacity: 0.55; cursor: not-allowed; }

/* ── Banner ── */
.card-banner {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.banner-icon {
  font-size: 62px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  transition: transform 0.3s;
}

.card:hover:not(.locked) .banner-icon { transform: scale(1.12); }

.banner-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%);
  pointer-events: none;
}

.banner-overlays {
  position: absolute;
  top: 10px; right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
  z-index: 2;
}

.badge-played,
.badge-locked,
.badge-new {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 99px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge-played { background: rgba(34,197,94,0.85);  color: #fff; }
.badge-locked { background: rgba(0,0,0,0.45);       color: #fff; }
.badge-new    { background: rgba(245,158,11,0.9);   color: #1e1b4b; }

/* ── Card body ── */
.card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card-title {
  font-family: 'Baloo 2', cursive;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  flex: 1;
}

.xp-pill {
  background: #fef9c3;
  color: #854d0e;
  font-family: 'Baloo 2', cursive;
  font-size: 12px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
}

.card-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
  flex: 1;
}

/* ── Chips ── */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.chip.concept    { background: #ede9fe; color: #6d28d9; }
.chip.age        { background: #f1f5f9; color: #475569; }
.chip.difficulty.beginner     { background: #dcfce7; color: #15803d; }
.chip.difficulty.intermediate { background: #fef9c3; color: #92400e; }
.chip.difficulty.advanced     { background: #fee2e2; color: #b91c1c; }

/* ── Stars ── */
.stars-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.star {
  font-size: 16px;
  color: #e2e8f0;
  transition: color 0.2s;
}

.star.lit { color: var(--sun); }

.stars-label {
  font-size: 11px;
  color: var(--muted);
  font-weight: 600;
  margin-left: 4px;
}

/* ── Play button ── */
.play-btn {
  margin-top: auto;
  padding: 9px 0;
  border-radius: 99px;
  border: none;
  width: 100%;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--sun), #f97316);
  color: #1e1b4b;
  box-shadow: 0 3px 10px rgba(245,158,11,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.play-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(245,158,11,0.45);
}

.play-btn:disabled {
  background: #e2e8f0;
  color: var(--muted);
  box-shadow: none;
  cursor: not-allowed;
}

/* ── Empty state ── */
.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
}
.empty span { font-size: 48px; display: block; margin-bottom: 12px; }
.empty p    { font-size: 16px; font-weight: 600; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,10,40,0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: var(--white);
  border-radius: 24px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 14px; right: 14px;
  width: 30px; height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.3);
  color: var(--white);
  font-size: 14px;
  cursor: pointer;
  z-index: 2;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.modal-close:hover { background: rgba(0,0,0,0.5); }

.modal-banner {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-icon { font-size: 80px; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.35)); }

.modal-body { padding: 24px; }

.modal-body h2 {
  font-family: 'Baloo 2', cursive;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 6px;
}

.modal-body > p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 14px;
}

.modal-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }

.modal-instructions {
  background: #f8faff;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.modal-instructions h4 {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--muted);
  margin-bottom: 6px;
}

.modal-instructions p {
  font-size: 14px;
  color: var(--dark);
  line-height: 1.6;
}

.modal-actions { display: flex; gap: 10px; }

.btn-secondary {
  flex: 1;
  padding: 10px;
  border-radius: 99px;
  border: 2.5px solid #e2e8f0;
  background: var(--white);
  color: var(--muted);
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.btn-secondary:hover { border-color: var(--muted); }

.modal-actions .play-btn { flex: 2; font-size: 15px; padding: 12px; }

/* ── Modal transition ── */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.22s ease;
}
.modal-enter-active .modal, .modal-leave-active .modal {
  transition: transform 0.22s ease;
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal  { transform: scale(0.93) translateY(16px); }
.modal-leave-to .modal    { transform: scale(0.93) translateY(16px); }

/* ── Responsive ── */
@media (max-width: 1100px) { .games-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 780px)  { .games-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px)  { .games-grid { grid-template-columns: 1fr; } }
</style>