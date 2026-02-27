<template>
  <section class="profile">

    <!-- Hero banner -->
    <div class="profile-hero">
      <div class="hero-bg"></div>

      <div class="hero-inner">
        <!-- Avatar + edit -->
        <div class="avatar-wrap">
          <div class="avatar-ring">
            <div class="avatar">{{ user.avatar }}</div>
          </div>
          <button class="avatar-edit" @click="showAvatarPicker = !showAvatarPicker">✏️</button>
        </div>

        <!-- Identity -->
        <div class="hero-identity">
          <h1 class="hero-name">{{ user.name }}</h1>
          <p class="hero-sub">{{ user.school }} · Grade {{ user.grade }}</p>
          <div class="hero-chips">
            <span class="hchip level">⚡ Level {{ user.level }} — {{ user.levelName }}</span>
            <span class="hchip streak">🔥 {{ user.streak }}-day streak</span>
            <span class="hchip joined">📅 Joined {{ user.joined }}</span>
          </div>
        </div>

        <!-- XP ring -->
        <div class="xp-ring-wrap">
          <svg class="xp-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" class="ring-bg"/>
            <circle cx="60" cy="60" r="50" class="ring-fill"
              :stroke-dasharray="`${xpPercent * 3.14} 314`"
              stroke-dashoffset="78.5"
            />
          </svg>
          <div class="ring-label">
            <span class="ring-xp">{{ user.xp.toLocaleString() }}</span>
            <span class="ring-sub">/ {{ user.nextLevelXp.toLocaleString() }} XP</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar picker -->
    <Transition name="slide-down">
      <div v-if="showAvatarPicker" class="avatar-picker card">
        <p class="picker-label">Choose your avatar</p>
        <div class="picker-grid">
          <button
            v-for="av in avatarOptions" :key="av"
            class="picker-opt"
            :class="{ selected: user.avatar === av }"
            @click="user.avatar = av; showAvatarPicker = false"
          >{{ av }}</button>
        </div>
      </div>
    </Transition>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-card" v-for="s in stats" :key="s.label" :style="{ '--c': s.color }">
        <span class="sc-icon">{{ s.icon }}</span>
        <span class="sc-num">{{ s.value }}</span>
        <span class="sc-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Main grid -->
    <div class="main-grid">

      <!-- LEFT -->
      <div class="left-col">

        <!-- Activity chart -->
        <div class="card">
          <div class="card-head">
            <h3>📅 Activity This Week</h3>
            <span class="card-sub">{{ weeklyXp }} XP earned</span>
          </div>
          <div class="activity-chart">
            <div v-for="(day, i) in activity" :key="day.label" class="bar-col">
              <div class="bar-wrap">
                <div
                  class="bar"
                  :style="{
                    height: day.xp ? (day.xp / maxActivity * 100) + '%' : '4px',
                    background: day.today ? 'linear-gradient(180deg,#f59e0b,#f97316)' : day.xp ? 'linear-gradient(180deg,#0ea5e9,#8b5cf6)' : '#e2e8f0'
                  }"
                ></div>
              </div>
              <span class="bar-label" :class="{ today: day.today }">{{ day.label }}</span>
              <span class="bar-xp">{{ day.xp ? day.xp + ' XP' : '' }}</span>
            </div>
          </div>
        </div>

        <!-- Recent badges -->
        <div class="card">
          <div class="card-head">
            <h3>🏅 Recent Badges</h3>
            <RouterLink to="/achievements" class="card-link">See all →</RouterLink>
          </div>
          <div class="recent-badges">
            <div v-for="b in recentBadges" :key="b.name" class="rb-item">
              <div class="rb-icon">{{ b.icon }}</div>
              <div class="rb-info">
                <span class="rb-name">{{ b.name }}</span>
                <span class="rb-when">{{ b.when }}</span>
              </div>
              <span class="rb-xp">+{{ b.xp }} XP</span>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT -->
      <div class="right-col">

        <!-- Skill progress -->
        <div class="card">
          <div class="card-head"><h3>📚 Skill Progress</h3></div>
          <div class="skills-list">
            <div v-for="sk in skills" :key="sk.name" class="skill-row">
              <div class="skill-top">
                <span class="skill-name">{{ sk.icon }} {{ sk.name }}</span>
                <span class="skill-pct">{{ sk.pct }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: sk.pct + '%', background: sk.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Level path -->
        <div class="card">
          <div class="card-head"><h3>⚡ Level Path</h3></div>
          <div class="level-path">
            <div
              v-for="(lv, i) in levelPath" :key="lv.name"
              class="lp-item"
              :class="{
                done:    user.level > i + 1,
                current: user.level === i + 1,
                locked:  user.level < i + 1
              }"
            >
              <div class="lp-dot">{{ lv.icon }}</div>
              <div class="lp-line" v-if="i < levelPath.length - 1"></div>
              <div class="lp-info">
                <span class="lp-name">{{ lv.name }}</span>
                <span class="lp-xp">{{ lv.xp.toLocaleString() }} XP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div class="card settings-card">
          <div class="card-head"><h3>⚙️ Settings</h3></div>
          <div class="settings-list">
            <label class="setting-row" v-for="s in settings" :key="s.label">
              <span class="setting-icon">{{ s.icon }}</span>
              <span class="setting-label">{{ s.label }}</span>
              <input type="checkbox" class="toggle" v-model="s.on" />
              <span class="toggle-track" :class="{ on: s.on }">
                <span class="toggle-thumb"></span>
              </span>
            </label>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const showAvatarPicker = ref(false)

const user = ref({
  name: 'Shravan Kumar',
  school: 'Sunrise Government School',
  grade: 6,
  avatar: '🐱',
  level: 3,
  levelName: 'Code Explorer',
  streak: 5,
  joined: 'Jan 2025',
  xp: 1240,
  nextLevelXp: 1500,
})

const avatarOptions = ['🐱','🦁','🐸','🦊','🐘','🐬','🦋','🌻','🐯','🦄','🐺','🦉']

const xpPercent = computed(() => Math.round((user.value.xp / user.value.nextLevelXp) * 100))

const stats = [
  { icon:'⭐', value:'1,240', label:'Total XP',     color:'#f59e0b' },
  { icon:'📖', value:'18',    label:'Lessons Done',  color:'#0ea5e9' },
  { icon:'🏅', value:'9',     label:'Badges',        color:'#22c55e' },
  { icon:'🕹️', value:'6',     label:'Games Played',  color:'#ec4899' },
  { icon:'🧩', value:'4',     label:'Puzzles Solved', color:'#8b5cf6' },
  { icon:'🧠', value:'3',     label:'Quizzes Done',  color:'#f97316' },
]

const activity = [
  { label:'Mon', xp:120, today:false },
  { label:'Tue', xp:80,  today:false },
  { label:'Wed', xp:200, today:false },
  { label:'Thu', xp:60,  today:false },
  { label:'Fri', xp:180, today:false },
  { label:'Sat', xp:40,  today:false },
  { label:'Sun', xp:90,  today:true  },
]

const maxActivity = computed(() => Math.max(...activity.map(d => d.xp)))
const weeklyXp    = computed(() => activity.reduce((s, d) => s + d.xp, 0))

const recentBadges = [
  { icon:'🔥', name:'5-Day Streak',   when:'Today',      xp:50 },
  { icon:'🥭', name:'Mango Catcher',  when:'Yesterday',  xp:60 },
  { icon:'🎮', name:'Game On!',       when:'3 days ago', xp:40 },
  { icon:'🧠', name:'Quiz Champ',     when:'Last week',  xp:80 },
]

const skills = [
  { icon:'💻', name:'Computer Basics',  pct:100, color:'linear-gradient(90deg,#22c55e,#16a34a)' },
  { icon:'🤖', name:'Algorithms',       pct:90,  color:'linear-gradient(90deg,#0ea5e9,#6366f1)' },
  { icon:'🧱', name:'Scratch / Blocks', pct:65,  color:'linear-gradient(90deg,#f59e0b,#f97316)' },
  { icon:'🐍', name:'Python',           pct:10,  color:'linear-gradient(90deg,#8b5cf6,#ec4899)' },
  { icon:'🌐', name:'HTML & Web',       pct:0,   color:'linear-gradient(90deg,#64748b,#94a3b8)' },
]

const levelPath = [
  { icon:'🌱', name:'Curious Coder',    xp:0    },
  { icon:'📱', name:'Digital Learner',  xp:300  },
  { icon:'🔭', name:'Code Explorer',    xp:800  },
  { icon:'🧱', name:'Scratch Builder',  xp:1500 },
  { icon:'🐍', name:'Python Coder',     xp:2500 },
  { icon:'🎓', name:'Graduate',         xp:6000 },
]

const settings = ref([
  { icon:'🔔', label:'Daily reminder notifications', on: true  },
  { icon:'🔊', label:'Sound effects in games',       on: true  },
  { icon:'🌙', label:'Dark mode',                    on: false },
  { icon:'🏆', label:'Show my rank on leaderboard',  on: true  },
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.profile {
  --dark:   #1e1b4b; --white:  #ffffff; --muted:  #64748b;
  --sun:    #f59e0b; --leaf:   #22c55e; --sky:    #0ea5e9;
  --berry:  #ec4899; --grape:  #8b5cf6;
  --radius: 18px; --shadow: 0 6px 24px rgba(0,0,0,0.09);
  font-family: 'Nunito', sans-serif;
  color: var(--dark); padding: 28px; background: #f8faff; min-height: 100vh;
}

/* ── Hero ── */
.profile-hero {
  border-radius: 24px; overflow: hidden;
  margin-bottom: 20px; position: relative;
}
.hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%);
}
.hero-bg::after {
  content:''; position:absolute; right:-80px; top:-80px;
  width:360px; height:360px; border-radius:50%;
  background:radial-gradient(circle,rgba(245,158,11,.22),transparent 70%);
}
.hero-inner {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 28px;
  padding: 32px 36px;
}

/* Avatar */
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar-ring {
  width: 96px; height: 96px; border-radius: 50%;
  background: linear-gradient(135deg, var(--sun), var(--berry));
  padding: 3px;
}
.avatar {
  width: 100%; height: 100%; border-radius: 50%;
  background: #1e1b4b;
  display: flex; align-items: center; justify-content: center;
  font-size: 48px;
}
.avatar-edit {
  position: absolute; bottom: 0; right: 0;
  width: 28px; height: 28px; border-radius: 50%; border: none;
  background: var(--sun); font-size: 13px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  transition: transform .15s;
}
.avatar-edit:hover { transform: scale(1.15); }

/* Identity */
.hero-identity { flex: 1; }
.hero-name { font-family:'Baloo 2',cursive; font-size:28px; font-weight:800; color:#fff; margin:0 0 4px; }
.hero-sub  { color:rgba(255,255,255,.5); font-size:14px; margin:0 0 14px; }
.hero-chips { display:flex; flex-wrap:wrap; gap:8px; }
.hchip {
  font-size:12px; font-weight:700; padding:4px 12px; border-radius:99px;
}
.hchip.level  { background:rgba(245,158,11,.2); color:#fde68a; }
.hchip.streak { background:rgba(34,197,94,.2);  color:#86efac; }
.hchip.joined { background:rgba(255,255,255,.1); color:rgba(255,255,255,.6); }

/* XP ring */
.xp-ring-wrap { position:relative; flex-shrink:0; width:110px; height:110px; }
.xp-ring { width:100%; height:100%; transform:rotate(-90deg); }
.ring-bg   { fill:none; stroke:rgba(255,255,255,.1); stroke-width:8; }
.ring-fill {
  fill:none; stroke:url(#grad); stroke-width:8;
  stroke-linecap:round; transition:stroke-dasharray .8s ease;
  stroke: var(--sun);
}
.ring-label {
  position:absolute; inset:0;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.ring-xp  { font-family:'Baloo 2',cursive; font-size:20px; font-weight:800; color:#fff; line-height:1; }
.ring-sub { font-size:10px; color:rgba(255,255,255,.45); }

/* Avatar picker */
.avatar-picker { margin-bottom:16px; padding:18px; }
.picker-label  { font-weight:800; font-size:13px; margin-bottom:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; }
.picker-grid   { display:flex; flex-wrap:wrap; gap:10px; }
.picker-opt {
  width:46px; height:46px; border-radius:12px; border:2.5px solid #e2e8f0;
  background:var(--white); font-size:24px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:all .15s;
}
.picker-opt:hover    { border-color:var(--sky); transform:scale(1.1); }
.picker-opt.selected { border-color:var(--sun); background:#fefce8; }

/* Stats row */
.stats-row {
  display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:20px;
}
.stat-card {
  background:var(--white); border-radius:16px; padding:16px 12px;
  text-align:center; box-shadow:var(--shadow);
  border-bottom:3px solid var(--c,var(--sky));
  transition:transform .2s;
}
.stat-card:hover { transform:translateY(-3px); }
.sc-icon  { font-size:24px; display:block; margin-bottom:6px; }
.sc-num   { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; display:block; line-height:1; }
.sc-label { font-size:11px; color:var(--muted); font-weight:700; display:block; margin-top:3px; }

/* Main grid */
.main-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:18px; }
.left-col, .right-col { display:flex; flex-direction:column; gap:18px; }

/* Card */
.card { background:var(--white); border-radius:var(--radius); padding:22px; box-shadow:var(--shadow); }
.card-head {
  display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;
}
.card-head h3 { font-family:'Baloo 2',cursive; font-size:18px; font-weight:800; margin:0; }
.card-sub  { font-size:13px; font-weight:700; color:var(--sun); }
.card-link { font-size:13px; font-weight:700; color:var(--sky); text-decoration:none; }
.card-link:hover { text-decoration:underline; }

/* Activity chart */
.activity-chart { display:flex; align-items:flex-end; gap:8px; height:120px; }
.bar-col  { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; }
.bar-wrap { flex:1; display:flex; align-items:flex-end; width:100%; }
.bar {
  width:100%; border-radius:8px 8px 0 0; min-height:4px;
  transition:height .5s ease; max-height:90px;
}
.bar-label { font-size:11px; font-weight:700; color:var(--muted); }
.bar-label.today { color:var(--sun); }
.bar-xp { font-size:10px; color:var(--muted); height:14px; }

/* Recent badges */
.recent-badges { display:flex; flex-direction:column; gap:10px; }
.rb-item {
  display:flex; align-items:center; gap:12px;
  padding:10px; border-radius:12px; border:2px solid #f1f5f9;
  transition:border-color .15s;
}
.rb-item:hover { border-color:var(--sun); }
.rb-icon  { font-size:28px; width:40px; text-align:center; }
.rb-info  { flex:1; display:flex; flex-direction:column; gap:2px; }
.rb-name  { font-weight:700; font-size:14px; }
.rb-when  { font-size:12px; color:var(--muted); }
.rb-xp    { font-family:'Baloo 2',cursive; font-size:14px; font-weight:800; color:var(--sun); }

/* Skills */
.skills-list { display:flex; flex-direction:column; gap:14px; }
.skill-row   {}
.skill-top   { display:flex; justify-content:space-between; margin-bottom:6px; }
.skill-name  { font-weight:700; font-size:14px; }
.skill-pct   { font-family:'Baloo 2',cursive; font-size:14px; font-weight:800; color:var(--muted); }
.skill-bar   { height:8px; background:#f1f5f9; border-radius:99px; overflow:hidden; }
.skill-fill  { height:100%; border-radius:99px; transition:width .6s ease; }

/* Level path */
.level-path { display:flex; gap:0; overflow-x:auto; padding-bottom:4px; }
.lp-item {
  display:flex; flex-direction:column; align-items:center;
  gap:6px; position:relative; min-width:72px;
}
.lp-dot {
  width:44px; height:44px; border-radius:50%; border:3px solid #e2e8f0;
  background:var(--white); display:flex; align-items:center; justify-content:center;
  font-size:22px; transition:all .2s; position:relative; z-index:1;
}
.lp-item.done .lp-dot    { border-color:var(--leaf); background:#f0fdf4; }
.lp-item.current .lp-dot { border-color:var(--sky); background:#f0f9ff; box-shadow:0 0 0 4px rgba(14,165,233,.15); }
.lp-item.locked .lp-dot  { opacity:.4; filter:grayscale(1); }
.lp-line {
  position:absolute; top:22px; left:calc(50% + 22px);
  width:calc(100% - 44px); height:2px;
  background:#e2e8f0; z-index:0;
}
.lp-item.done .lp-line { background:var(--leaf); }
.lp-info { text-align:center; }
.lp-name { font-size:10px; font-weight:700; display:block; line-height:1.3; }
.lp-xp   { font-size:9px; color:var(--muted); }

/* Settings */
.settings-list { display:flex; flex-direction:column; gap:2px; }
.setting-row {
  display:flex; align-items:center; gap:12px;
  padding:10px; border-radius:12px; cursor:pointer;
  transition:background .15s;
}
.setting-row:hover { background:#f8faff; }
.setting-icon  { font-size:20px; flex-shrink:0; }
.setting-label { flex:1; font-size:14px; font-weight:600; }
input.toggle   { display:none; }
.toggle-track {
  width:42px; height:24px; border-radius:99px; background:#e2e8f0;
  position:relative; flex-shrink:0; transition:background .2s; cursor:pointer;
}
.toggle-track.on { background:var(--leaf); }
.toggle-thumb {
  position:absolute; top:3px; left:3px;
  width:18px; height:18px; border-radius:50%; background:#fff;
  box-shadow:0 1px 4px rgba(0,0,0,.2); transition:transform .2s;
}
.toggle-track.on .toggle-thumb { transform:translateX(18px); }

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active { transition:opacity .22s, transform .22s; }
.slide-down-enter-from, .slide-down-leave-to       { opacity:0; transform:translateY(-10px); }

/* Responsive */
@media (max-width:1100px) { .stats-row { grid-template-columns:repeat(3,1fr); } }
@media (max-width:860px)  { .main-grid { grid-template-columns:1fr; } }
@media (max-width:600px)  { .stats-row { grid-template-columns:repeat(2,1fr); } .hero-inner { flex-direction:column; text-align:center; } .hero-chips { justify-content:center; } }
</style>