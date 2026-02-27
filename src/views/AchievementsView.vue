<template>
  <section class="achievements">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">🏆 Achievements</h1>
        <p class="subtitle">Earn badges by completing lessons, quizzes, and challenges!</p>
      </div>
      <div class="header-stats">
        <div class="hstat" style="--accent:#f59e0b">
          <span class="hstat-num">{{ earnedCount }}</span>
          <span class="hstat-label">badges earned</span>
        </div>
        <div class="hstat" style="--accent:#22c55e">
          <span class="hstat-num">{{ currentXp.toLocaleString() }}</span>
          <span class="hstat-label">total XP</span>
        </div>
        <div class="hstat" style="--accent:#0ea5e9">
          <span class="hstat-num">{{ streakDays }}</span>
          <span class="hstat-label">day streak</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs" :key="tab"
        class="tab" :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- BADGES -->
    <div class="section-card" v-show="activeTab === 'Badges'">
      <div class="section-header">
        <h2 class="section-title">🌟 Badges</h2>
        <span class="section-sub">{{ earnedCount }} / {{ badges.length }} earned</span>
      </div>

      <!-- Category groups -->
      <div v-for="cat in badgeCategories" :key="cat.label" class="badge-group">
        <h3 class="group-label">{{ cat.icon }} {{ cat.label }}</h3>
        <div class="badge-grid">
          <div
            v-for="badge in cat.items" :key="badge.name"
            class="badge-card"
            :class="{ locked: badge.locked, earned: !badge.locked }"
            @mouseenter="tooltip = badge"
            @mouseleave="tooltip = null"
          >
            <div class="badge-glow" v-if="!badge.locked"></div>
            <div class="badge-emoji">{{ badge.icon }}</div>
            <div class="badge-name">{{ badge.name }}</div>
            <div class="badge-xp" v-if="!badge.locked">+{{ badge.xp }} XP</div>
            <div class="badge-lock" v-else>🔒</div>
          </div>
        </div>
      </div>
    </div>

    <!-- XP MILESTONES -->
    <div class="section-card" v-show="activeTab === 'XP Levels'">
      <div class="section-header">
        <h2 class="section-title">📈 XP Levels</h2>
        <span class="section-sub">Level {{ currentLevel }} of {{ levels.length }}</span>
      </div>

      <div class="levels-list">
        <div
          v-for="(lvl, i) in levels" :key="lvl.name"
          class="level-row"
          :class="{
            current:   currentLevel === i + 1,
            completed: currentLevel > i + 1,
            locked:    currentLevel < i + 1
          }"
        >
          <div class="level-icon-wrap">
            <span class="level-icon">{{ lvl.icon }}</span>
            <span v-if="currentLevel > i + 1" class="level-check">✓</span>
          </div>
          <div class="level-info">
            <div class="level-name">
              Level {{ i + 1 }} — {{ lvl.name }}
              <span v-if="currentLevel === i + 1" class="current-chip">YOU ARE HERE</span>
            </div>
            <div class="level-range">{{ lvl.min.toLocaleString() }} – {{ lvl.max.toLocaleString() }} XP</div>
            <div class="level-bar" v-if="currentLevel === i + 1">
              <div class="level-fill" :style="{ width: levelProgress + '%' }"></div>
            </div>
            <div class="level-bar done" v-else-if="currentLevel > i + 1">
              <div class="level-fill" style="width:100%"></div>
            </div>
          </div>
          <div class="level-reward">
            <span class="reward-badge">{{ lvl.reward }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- WEEKLY CHALLENGES -->
    <div class="section-card" v-show="activeTab === 'Challenges'">
      <div class="section-header">
        <h2 class="section-title">🎯 Weekly Challenges</h2>
        <span class="section-sub">Resets every Monday · {{ doneCount }}/{{ challenges.length }} done</span>
      </div>

      <div class="challenges-grid">
        <div
          v-for="c in challenges" :key="c.label"
          class="challenge-card"
          :class="{ done: c.done }"
        >
          <div class="ch-top">
            <span class="ch-icon">{{ c.icon }}</span>
            <span class="ch-xp">+{{ c.xp }} XP</span>
          </div>
          <div class="ch-label">{{ c.label }}</div>
          <div class="ch-bar">
            <div class="ch-fill" :style="{ width: (c.progress / c.total * 100) + '%' }"></div>
          </div>
          <div class="ch-progress">{{ c.progress }}/{{ c.total }} {{ c.unit }}</div>
          <div class="ch-done-banner" v-if="c.done">🎉 Complete!</div>
        </div>
      </div>

      <!-- Weekly XP summary -->
      <div class="week-summary">
        <span class="ws-label">This week's XP</span>
        <div class="ws-bar-wrap">
          <div class="ws-bar">
            <div class="ws-fill" :style="{ width: weeklyProgress + '%' }"></div>
          </div>
          <span class="ws-num">{{ weeklyXp }} / {{ weeklyGoal }} XP</span>
        </div>
      </div>
    </div>

    <!-- Badge tooltip -->
    <Transition name="pop">
      <div v-if="tooltip" class="badge-tooltip">
        <span class="tt-icon">{{ tooltip.icon }}</span>
        <div>
          <p class="tt-name">{{ tooltip.name }}</p>
          <p class="tt-how">{{ tooltip.locked ? '🔒 ' + tooltip.howTo : '✅ ' + tooltip.earnedOn }}</p>
        </div>
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs      = ['Badges', 'XP Levels', 'Challenges']
const activeTab = ref('Badges')
const tooltip   = ref(null)

/* ── XP & level data ── */
const currentXp   = 1240
const streakDays  = 5

const levels = [
  { name:'Curious Coder',   icon:'🌱', min:0,    max:300,  reward:'🥚 Starter Pack',    xpGoal:300  },
  { name:'Digital Learner', icon:'📱', min:300,  max:800,  reward:'🎨 Custom Avatar',    xpGoal:800  },
  { name:'Code Explorer',   icon:'🔭', min:800,  max:1500, reward:'🎮 Bonus Game',       xpGoal:1500 },
  { name:'Scratch Builder', icon:'🧱', min:1500, max:2500, reward:'🏅 Silver Badge',     xpGoal:2500 },
  { name:'Python Coder',    icon:'🐍', min:2500, max:4000, reward:'⚡ XP Multiplier',    xpGoal:4000 },
  { name:'Web Maker',       icon:'🌐', min:4000, max:6000, reward:'🖼️ Profile Frame',    xpGoal:6000 },
  { name:'CodeKids Graduate',icon:'🎓',min:6000, max:9999, reward:'🏆 Gold Trophy',      xpGoal:9999 },
]

const currentLevel = computed(() => {
  const idx = levels.findIndex(l => currentXp >= l.min && currentXp < l.max)
  return idx === -1 ? levels.length : idx + 1
})

const levelProgress = computed(() => {
  const lvl = levels[currentLevel.value - 1]
  if (!lvl) return 100
  return Math.round(((currentXp - lvl.min) / (lvl.max - lvl.min)) * 100)
})

/* ── Badges ── */
const badgeCategories = [
  {
    label: 'Getting Started', icon: '🚀',
    items: [
      { icon:'🌱', name:'First Login!',     locked:false, xp:10,  howTo:'Log in for the first time',         earnedOn:'Earned Day 1' },
      { icon:'💻', name:'Digital Explorer', locked:false, xp:50,  howTo:'Complete Unit 1',                   earnedOn:'Earned Unit 1' },
      { icon:'⌨️', name:'Keyboard Ninja',   locked:false, xp:30,  howTo:'Complete the typing speed challenge',earnedOn:'Earned Week 1' },
    ]
  },
  {
    label: 'Learning', icon: '📚',
    items: [
      { icon:'🤖', name:'Algorithm Ace',  locked:false, xp:60,  howTo:'Complete Unit 2',          earnedOn:'Earned Unit 2' },
      { icon:'🧠', name:'Quiz Champ',     locked:false, xp:80,  howTo:'Score 100% on any quiz',   earnedOn:'Scored 100% on Unit 2' },
      { icon:'🧱', name:'Scratch Star',   locked:true,  xp:100, howTo:'Complete all Unit 3 lessons', earnedOn:'' },
      { icon:'🐍', name:'Python Pro',     locked:true,  xp:150, howTo:'Complete Unit 4',          earnedOn:'' },
      { icon:'🌐', name:'Web Wizard',     locked:true,  xp:200, howTo:'Complete Unit 5',          earnedOn:'' },
    ]
  },
  {
    label: 'Playing', icon: '🎮',
    items: [
      { icon:'🎮', name:'Game On!',       locked:false, xp:40,  howTo:'Play your first game',     earnedOn:'Earned Day 2' },
      { icon:'🥭', name:'Mango Catcher',  locked:false, xp:60,  howTo:'Score 3 stars in Catch the Mango', earnedOn:'Earned this week' },
      { icon:'🐢', name:'Maze Runner',    locked:true,  xp:80,  howTo:'Complete Turtle Maze without hints', earnedOn:'' },
      { icon:'🤖', name:'Robot Boss',     locked:true,  xp:90,  howTo:'Win Robot Factory 3 times', earnedOn:'' },
    ]
  },
  {
    label: 'Streaks & Milestones', icon: '🔥',
    items: [
      { icon:'🔥', name:'5-Day Streak',   locked:false, xp:50,  howTo:'Log in 5 days in a row',   earnedOn:'Earned this week' },
      { icon:'🐛', name:'Bug Buster',     locked:false, xp:70,  howTo:'Solve 5 Bug Hunt puzzles', earnedOn:'Earned last week' },
      { icon:'💎', name:'10-Day Streak',  locked:true,  xp:100, howTo:'Log in 10 days in a row',  earnedOn:'' },
      { icon:'🔐', name:'Cyber Guard',    locked:true,  xp:80,  howTo:'Complete Password Hero',   earnedOn:'' },
      { icon:'🎓', name:'Graduate',       locked:true,  xp:500, howTo:'Complete all 6 units',     earnedOn:'' },
    ]
  },
]

const badges      = computed(() => badgeCategories.flatMap(c => c.items))
const earnedCount = computed(() => badges.value.filter(b => !b.locked).length)

/* ── Weekly challenges ── */
const challenges = ref([
  { icon:'📖', label:'Complete 3 Lessons',   xp:50,  progress:3, total:3, unit:'lessons', done:true  },
  { icon:'🕹️', label:'Win 1 Game',           xp:30,  progress:1, total:1, unit:'wins',    done:true  },
  { icon:'🧩', label:'Solve 2 Puzzles',      xp:40,  progress:1, total:2, unit:'puzzles', done:false },
  { icon:'🧠', label:'Score 80%+ on a Quiz', xp:60,  progress:0, total:1, unit:'quizzes', done:false },
  { icon:'🔥', label:'Keep a 7-Day Streak',  xp:100, progress:5, total:7, unit:'days',    done:false },
  { icon:'⭐', label:'Earn 200 XP Today',    xp:50,  progress:140,total:200, unit:'XP',   done:false },
])

const doneCount     = computed(() => challenges.value.filter(c => c.done).length)
const weeklyXp      = computed(() => challenges.value.filter(c => c.done).reduce((s, c) => s + c.xp, 0))
const weeklyGoal    = computed(() => challenges.value.reduce((s, c) => s + c.xp, 0))
const weeklyProgress = computed(() => Math.round((weeklyXp.value / weeklyGoal.value) * 100))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.achievements {
  --dark:   #1e1b4b; --white: #ffffff; --muted: #64748b;
  --sun:    #f59e0b; --leaf:  #22c55e; --sky:   #0ea5e9;
  --berry:  #ec4899; --grape: #8b5cf6;
  --radius: 18px;    --shadow: 0 6px 24px rgba(0,0,0,0.09);
  font-family: 'Nunito', sans-serif;
  color: var(--dark); padding: 28px; background: #f8faff; min-height: 100vh;
}

/* ── Header ── */
.page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; }
.page-title  { font-family:'Baloo 2',cursive; font-size:32px; font-weight:800; line-height:1.1; margin-bottom:4px; }
.subtitle    { color:var(--muted); font-size:15px; }
.header-stats{ display:flex; gap:12px; }
.hstat {
  display:flex; flex-direction:column; align-items:center;
  background:var(--white); border-radius:14px; padding:10px 18px;
  box-shadow:var(--shadow); border-bottom:3px solid var(--accent,var(--sun));
}
.hstat-num   { font-family:'Baloo 2',cursive; font-size:24px; font-weight:800; color:var(--accent,var(--sun)); line-height:1; }
.hstat-label { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; margin-top:2px; }

/* ── Tabs ── */
.tabs { display:flex; gap:8px; margin-bottom:22px; }
.tab  { padding:8px 22px; border-radius:99px; font-family:'Nunito',sans-serif; font-size:14px; font-weight:700; cursor:pointer; border:2.5px solid #e2e8f0; background:var(--white); color:var(--muted); transition:all .18s; }
.tab:hover  { border-color:var(--sky); color:var(--sky); }
.tab.active { background:var(--dark); color:var(--white); border-color:var(--dark); }

/* ── Section card ── */
.section-card   { background:var(--white); border-radius:var(--radius); padding:26px; box-shadow:var(--shadow); }
.section-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:22px; }
.section-title  { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; margin:0; }
.section-sub    { font-size:13px; font-weight:700; color:var(--muted); }

/* ── Badge groups ── */
.badge-group  { margin-bottom:28px; }
.badge-group:last-child { margin-bottom:0; }
.group-label  { font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); margin-bottom:14px; }
.badge-grid   { display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:14px; }

/* ── Badge card ── */
.badge-card {
  border-radius:16px; padding:16px 10px; text-align:center;
  position:relative; cursor:default; transition:transform .2s, box-shadow .2s;
  border:2px solid transparent;
}
.badge-card.earned {
  background:var(--white); border-color:#e2e8f0;
  box-shadow:0 4px 16px rgba(0,0,0,.07);
}
.badge-card.earned:hover { transform:translateY(-5px); box-shadow:0 10px 28px rgba(0,0,0,.12); border-color:var(--sun); }
.badge-card.locked {
  background:#f8faff; border-color:#f1f5f9;
  opacity:.45; filter:grayscale(1);
}
.badge-glow {
  position:absolute; inset:0; border-radius:14px;
  background:radial-gradient(circle at 50% 0%, rgba(245,158,11,.12), transparent 70%);
  pointer-events:none;
}
.badge-emoji { font-size:36px; margin-bottom:8px; line-height:1; }
.badge-name  { font-size:12px; font-weight:700; color:var(--dark); line-height:1.3; margin-bottom:4px; }
.badge-xp    { font-family:'Baloo 2',cursive; font-size:11px; font-weight:800; color:var(--sun); }
.badge-lock  { font-size:14px; margin-top:2px; }

/* ── Level rows ── */
.levels-list { display:flex; flex-direction:column; gap:14px; }
.level-row {
  display:flex; align-items:center; gap:16px;
  padding:16px 18px; border-radius:14px; border:2px solid #e2e8f0;
  transition:border-color .2s;
}
.level-row.completed { border-color:#bbf7d0; background:#f0fdf4; }
.level-row.current   { border-color:var(--sky); background:#f0f9ff; box-shadow:0 0 0 3px rgba(14,165,233,.1); }
.level-row.locked    { opacity:.5; }

.level-icon-wrap { position:relative; flex-shrink:0; }
.level-icon  { font-size:36px; display:block; }
.level-check {
  position:absolute; bottom:-4px; right:-6px;
  width:20px; height:20px; border-radius:50%;
  background:var(--leaf); color:#fff;
  font-size:11px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  border:2px solid var(--white);
}

.level-info  { flex:1; }
.level-name  { font-weight:800; font-size:15px; margin-bottom:3px; display:flex; align-items:center; gap:8px; }
.current-chip{
  font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.8px;
  background:var(--sky); color:#fff; padding:2px 8px; border-radius:99px;
}
.level-range { font-size:12px; color:var(--muted); margin-bottom:8px; }
.level-bar   { height:8px; background:#e2e8f0; border-radius:99px; overflow:hidden; }
.level-bar.done .level-fill { background:var(--leaf); }
.level-fill  { height:100%; border-radius:99px; background:linear-gradient(90deg,var(--sky),var(--grape)); transition:width .6s ease; }

.level-reward{ flex-shrink:0; }
.reward-badge{
  background:#fef9c3; color:#854d0e;
  font-size:12px; font-weight:700;
  padding:5px 10px; border-radius:10px;
  white-space:nowrap; display:block; text-align:center;
}

/* ── Weekly challenges ── */
.challenges-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:22px; }
.challenge-card  {
  border-radius:16px; border:2px solid #e2e8f0; padding:16px;
  background:var(--white); position:relative; overflow:hidden;
  transition:transform .2s, border-color .2s;
}
.challenge-card:hover { transform:translateY(-2px); border-color:var(--sky); }
.challenge-card.done  { border-color:var(--leaf); background:#f0fdf4; }

.ch-top   { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.ch-icon  { font-size:26px; }
.ch-xp    { font-family:'Baloo 2',cursive; font-size:14px; font-weight:800; color:var(--sun); }
.ch-label { font-weight:700; font-size:14px; margin-bottom:10px; line-height:1.3; }
.ch-bar   { height:7px; background:#e2e8f0; border-radius:99px; overflow:hidden; margin-bottom:5px; }
.ch-fill  { height:100%; border-radius:99px; background:linear-gradient(90deg,var(--sky),var(--leaf)); transition:width .5s ease; }
.challenge-card.done .ch-fill { background:var(--leaf); }
.ch-progress { font-size:12px; color:var(--muted); font-weight:600; }
.ch-done-banner {
  position:absolute; bottom:0; left:0; right:0;
  background:linear-gradient(135deg,var(--leaf),#16a34a);
  color:#fff; font-size:12px; font-weight:800;
  text-align:center; padding:5px;
}

/* Weekly summary bar */
.week-summary { padding:16px 18px; background:#f8faff; border-radius:14px; border:2px solid #e2e8f0; }
.ws-label    { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.7px; color:var(--muted); display:block; margin-bottom:10px; }
.ws-bar-wrap { display:flex; align-items:center; gap:14px; }
.ws-bar      { flex:1; height:12px; background:#e2e8f0; border-radius:99px; overflow:hidden; }
.ws-fill     { height:100%; border-radius:99px; background:linear-gradient(90deg,var(--sun),#f97316); transition:width .6s ease; }
.ws-num      { font-family:'Baloo 2',cursive; font-size:16px; font-weight:800; color:var(--sun); white-space:nowrap; }

/* ── Tooltip ── */
.badge-tooltip {
  position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
  background:var(--dark); color:#fff;
  border-radius:14px; padding:12px 18px;
  display:flex; align-items:center; gap:12px;
  box-shadow:0 8px 32px rgba(0,0,0,.25);
  z-index:100; pointer-events:none;
}
.tt-icon { font-size:28px; flex-shrink:0; }
.tt-name { font-weight:800; font-size:14px; margin-bottom:2px; }
.tt-how  { font-size:12px; color:rgba(255,255,255,.6); }

/* Tooltip transition */
.pop-enter-active, .pop-leave-active { transition:opacity .2s, transform .2s; }
.pop-enter-from, .pop-leave-to       { opacity:0; transform:translateX(-50%) translateY(8px); }

/* ── Responsive ── */
@media (max-width:860px) {
  .challenges-grid { grid-template-columns:repeat(2,1fr); }
  .header-stats    { display:none; }
}
@media (max-width:500px) {
  .challenges-grid { grid-template-columns:1fr; }
  .badge-grid { grid-template-columns:repeat(3,1fr); }
}
</style>