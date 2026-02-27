<template>
  <section class="leaderboard">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📊 Leaderboard</h1>
        <p class="subtitle">Compete with classmates and climb the ranks!</p>
      </div>
      <div class="header-right">
        <div class="your-rank-chip">
          <span class="yr-label">Your rank</span>
          <span class="yr-num">#{{ yourRank }}</span>
        </div>
      </div>
    </div>

    <!-- Scope tabs + time tabs -->
    <div class="controls-row">
      <div class="tabs">
        <button
          v-for="tab in scopeTabs" :key="tab"
          class="tab" :class="{ active: activeScope === tab }"
          @click="activeScope = tab"
        >{{ tab }}</button>
      </div>
      <div class="tabs">
        <button
          v-for="tab in timeTabs" :key="tab"
          class="tab sm" :class="{ active: activeTime === tab }"
          @click="activeTime = tab"
        >{{ tab }}</button>
      </div>
    </div>

    <div class="lb-grid">

      <!-- LEFT: Podium + rankings list -->
      <div class="rankings-col">

        <!-- Podium (top 3) -->
        <div class="podium">
          <!-- 2nd -->
          <div class="podium-col second">
            <div class="podium-avatar">{{ filtered[1]?.avatar }}</div>
            <p class="podium-name">{{ filtered[1]?.name }}</p>
            <p class="podium-xp">{{ filtered[1]?.xp.toLocaleString() }} XP</p>
            <div class="podium-block p2">
              <span class="podium-rank">🥈</span>
            </div>
          </div>
          <!-- 1st -->
          <div class="podium-col first">
            <div class="crown">👑</div>
            <div class="podium-avatar lg">{{ filtered[0]?.avatar }}</div>
            <p class="podium-name">{{ filtered[0]?.name }}</p>
            <p class="podium-xp gold">{{ filtered[0]?.xp.toLocaleString() }} XP</p>
            <div class="podium-block p1">
              <span class="podium-rank">🥇</span>
            </div>
          </div>
          <!-- 3rd -->
          <div class="podium-col third">
            <div class="podium-avatar">{{ filtered[2]?.avatar }}</div>
            <p class="podium-name">{{ filtered[2]?.name }}</p>
            <p class="podium-xp">{{ filtered[2]?.xp.toLocaleString() }} XP</p>
            <div class="podium-block p3">
              <span class="podium-rank">🥉</span>
            </div>
          </div>
        </div>

        <!-- Full list -->
        <div class="lb-list">
          <div
            v-for="(player, i) in filtered" :key="player.id"
            class="lb-row"
            :class="{
              you:  player.isYou,
              gold: i === 0,
              top3: i < 3
            }"
          >
            <span class="lb-rank-num">
              {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 }}
            </span>
            <div class="lb-av" :style="{ background: player.avatarBg }">
              {{ player.avatar }}
            </div>
            <div class="lb-info">
              <span class="lb-name">
                {{ player.name }}
                <span v-if="player.isYou" class="you-chip">YOU</span>
              </span>
              <span class="lb-detail">{{ player.school }} · Grade {{ player.grade }}</span>
            </div>
            <div class="lb-right">
              <span class="lb-streak" title="Streak">🔥{{ player.streak }}</span>
              <span class="lb-xp-val">{{ player.xp.toLocaleString() }}</span>
              <span class="lb-xp-label">XP</span>
            </div>
            <div class="lb-bar-col">
              <div class="lb-bar">
                <div class="lb-fill"
                  :style="{
                    width: (player.xp / filtered[0].xp * 100) + '%',
                    background: player.isYou
                      ? 'linear-gradient(90deg,#f59e0b,#f97316)'
                      : i < 3
                      ? 'linear-gradient(90deg,#0ea5e9,#8b5cf6)'
                      : 'linear-gradient(90deg,#22c55e,#16a34a)'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT: Stats + climb tips -->
      <div class="side-col">

        <!-- Your position card -->
        <div class="card your-card">
          <div class="yc-top">
            <div class="yc-avatar">🐱</div>
            <div>
              <p class="yc-name">Shravan Kumar</p>
              <p class="yc-sub">Grade 6 · Sunrise School</p>
            </div>
          </div>
          <div class="yc-stats">
            <div class="ycs">
              <span class="ycs-num">#{{ yourRank }}</span>
              <span class="ycs-label">Rank</span>
            </div>
            <div class="ycs">
              <span class="ycs-num">1,240</span>
              <span class="ycs-label">XP</span>
            </div>
            <div class="ycs">
              <span class="ycs-num">🔥5</span>
              <span class="ycs-label">Streak</span>
            </div>
          </div>
          <div class="yc-gap" v-if="xpToNextRank > 0">
            <p class="gap-text">
              <strong>{{ xpToNextRank }} XP</strong> to overtake
              <strong>{{ playerAbove?.name?.split(' ')[0] }}</strong>! 🚀
            </p>
            <div class="gap-bar">
              <div class="gap-fill" :style="{ width: gapProgress + '%' }"></div>
            </div>
          </div>
          <div class="yc-gap" v-else>
            <p class="gap-text" style="color:#15803d">🏆 You're at the top! Keep it up!</p>
          </div>
        </div>

        <!-- How to earn XP -->
        <div class="card">
          <h3 class="card-title">💡 How to Earn XP</h3>
          <div class="earn-list">
            <div v-for="e in earnWays" :key="e.act" class="earn-row">
              <span class="earn-icon">{{ e.icon }}</span>
              <span class="earn-act">{{ e.act }}</span>
              <span class="earn-xp">+{{ e.xp }} XP</span>
            </div>
          </div>
        </div>

        <!-- Weekly top mover -->
        <div class="card mover-card">
          <h3 class="card-title">📈 Biggest Climber This Week</h3>
          <div class="mover-row">
            <div class="mover-av">{{ topMover.avatar }}</div>
            <div class="mover-info">
              <p class="mover-name">{{ topMover.name }}</p>
              <p class="mover-sub">Climbed {{ topMover.climbed }} spots</p>
            </div>
            <span class="mover-xp">+{{ topMover.gained }} XP</span>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const scopeTabs  = ['My Class', 'My School', 'All India']
const timeTabs   = ['This Week', 'This Month', 'All Time']
const activeScope = ref('My Class')
const activeTime  = ref('All Time')

const allPlayers = [
  { id:1,  name:'Aryan Kumar',   avatar:'🦁', avatarBg:'linear-gradient(135deg,#fde68a,#f97316)', school:'Sunrise School', grade:6, xp:1820, streak:12, isYou:false },
  { id:2,  name:'Meena Ravi',    avatar:'🐘', avatarBg:'linear-gradient(135deg,#bfdbfe,#6366f1)', school:'Sunrise School', grade:6, xp:1560, streak:8,  isYou:false },
  { id:3,  name:'Sanjay Das',    avatar:'🐢', avatarBg:'linear-gradient(135deg,#d1fae5,#059669)', school:'Sunrise School', grade:6, xp:1390, streak:6,  isYou:false },
  { id:4,  name:'Shravan Kumar', avatar:'🐱', avatarBg:'linear-gradient(135deg,#fce7f3,#ec4899)', school:'Sunrise School', grade:6, xp:1240, streak:5,  isYou:true  },
  { id:5,  name:'Rohan Mehta',   avatar:'🦊', avatarBg:'linear-gradient(135deg,#ede9fe,#7c3aed)', school:'Sunrise School', grade:6, xp:980,  streak:3,  isYou:false },
  { id:6,  name:'Divya Singh',   avatar:'🦋', avatarBg:'linear-gradient(135deg,#fce7f3,#a21caf)', school:'Sunrise School', grade:6, xp:860,  streak:7,  isYou:false },
  { id:7,  name:'Kiran Patel',   avatar:'🐬', avatarBg:'linear-gradient(135deg,#dbeafe,#0ea5e9)', school:'Sunrise School', grade:6, xp:740,  streak:2,  isYou:false },
  { id:8,  name:'Priya Sharma',  avatar:'🌻', avatarBg:'linear-gradient(135deg,#fef9c3,#84cc16)', school:'Sunrise School', grade:6, xp:620,  streak:4,  isYou:false },
  { id:9,  name:'Amit Rao',      avatar:'🐯', avatarBg:'linear-gradient(135deg,#ffedd5,#f97316)', school:'Sunrise School', grade:6, xp:510,  streak:1,  isYou:false },
  { id:10, name:'Sneha Iyer',    avatar:'🦉', avatarBg:'linear-gradient(135deg,#f1f5f9,#64748b)', school:'Sunrise School', grade:6, xp:380,  streak:2,  isYou:false },
]

const filtered   = computed(() => [...allPlayers].sort((a, b) => b.xp - a.xp))
const yourRank   = computed(() => filtered.value.findIndex(p => p.isYou) + 1)
const playerAbove= computed(() => filtered.value[yourRank.value - 2])
const xpToNextRank = computed(() => {
  if (yourRank.value <= 1) return 0
  return (playerAbove.value?.xp ?? 0) - (allPlayers.find(p => p.isYou)?.xp ?? 0) + 1
})
const gapProgress = computed(() => {
  if (!playerAbove.value) return 100
  const you   = allPlayers.find(p => p.isYou)?.xp ?? 0
  const above = playerAbove.value.xp
  return Math.round((you / above) * 100)
})

const earnWays = [
  { icon:'📖', act:'Complete a lesson',      xp:'50–100'  },
  { icon:'🧠', act:'Ace a quiz (80%+)',       xp:'150 bonus'},
  { icon:'🕹️', act:'Win a game',             xp:'80–130'  },
  { icon:'🧩', act:'Solve a puzzle',         xp:'60–120'  },
  { icon:'🔥', act:'Daily streak bonus',     xp:'10/day'  },
  { icon:'📅', act:'Weekly challenge done',  xp:'200'     },
]

const topMover = { avatar:'🦋', name:'Divya Singh', climbed:4, gained:320 }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.leaderboard {
  --dark:   #1e1b4b; --white:  #ffffff; --muted:  #64748b;
  --sun:    #f59e0b; --leaf:   #22c55e; --sky:    #0ea5e9;
  --berry:  #ec4899; --grape:  #8b5cf6;
  --radius: 18px; --shadow: 0 6px 24px rgba(0,0,0,0.09);
  font-family: 'Nunito', sans-serif;
  color: var(--dark); padding: 28px; background: #f8faff; min-height: 100vh;
}

/* Header */
.page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:22px; }
.page-title  { font-family:'Baloo 2',cursive; font-size:32px; font-weight:800; line-height:1.1; margin-bottom:4px; }
.subtitle    { color:var(--muted); font-size:15px; }
.your-rank-chip {
  background:linear-gradient(135deg,#1e1b4b,#312e81);
  border-radius:16px; padding:12px 20px; text-align:center;
  box-shadow:0 4px 20px rgba(30,27,75,.3);
}
.yr-label { font-size:11px; font-weight:700; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.6px; display:block; }
.yr-num   { font-family:'Baloo 2',cursive; font-size:32px; font-weight:800; color:var(--sun); line-height:1; display:block; }

/* Controls */
.controls-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; flex-wrap:wrap; gap:10px; }
.tabs { display:flex; gap:6px; }
.tab {
  padding:8px 18px; border-radius:99px; font-family:'Nunito',sans-serif;
  font-size:14px; font-weight:700; cursor:pointer;
  border:2.5px solid #e2e8f0; background:var(--white); color:var(--muted);
  transition:all .18s;
}
.tab.sm { padding:6px 14px; font-size:13px; }
.tab:hover  { border-color:var(--sky); color:var(--sky); }
.tab.active { background:var(--dark); color:var(--white); border-color:var(--dark); }

/* Main layout */
.lb-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:20px; align-items:start; }

/* Podium */
.podium {
  display:flex; align-items:flex-end; justify-content:center; gap:0;
  margin-bottom:24px; padding:0 20px;
}
.podium-col {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  flex:1;
}
.podium-avatar {
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg,#e2e8f0,#cbd5e1);
  display:flex; align-items:center; justify-content:center;
  font-size:28px; border:3px solid #e2e8f0;
}
.podium-avatar.lg { width:68px; height:68px; font-size:36px; border-color:var(--sun); border-width:4px; }
.podium-name { font-weight:700; font-size:13px; text-align:center; margin:0; }
.podium-xp   { font-family:'Baloo 2',cursive; font-size:12px; font-weight:800; color:var(--muted); margin:0; }
.podium-xp.gold { color:var(--sun); font-size:14px; }
.crown { font-size:24px; }
.podium-block {
  width:100%; border-radius:12px 12px 0 0;
  display:flex; align-items:center; justify-content:center;
}
.p1 { height:80px; background:linear-gradient(180deg,#fde68a,#f59e0b); }
.p2 { height:60px; background:linear-gradient(180deg,#e2e8f0,#cbd5e1); }
.p3 { height:44px; background:linear-gradient(180deg,#fed7aa,#f97316); }
.podium-rank { font-size:22px; }

/* Rankings list */
.lb-list { display:flex; flex-direction:column; gap:6px; }
.lb-row {
  display:flex; align-items:center; gap:12px;
  padding:12px 14px; border-radius:14px;
  border:2px solid transparent; background:var(--white);
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  transition:all .18s;
}
.lb-row:hover  { transform:translateX(3px); border-color:#e2e8f0; }
.lb-row.you    { background:#fefce8; border-color:var(--sun); box-shadow:0 4px 16px rgba(245,158,11,.2); }
.lb-row.gold   { background:linear-gradient(135deg,#fefce8,#fff7ed); border-color:#fde68a; }

.lb-rank-num { font-family:'Baloo 2',cursive; font-size:18px; font-weight:800; width:32px; text-align:center; flex-shrink:0; color:var(--muted); }
.lb-row.gold .lb-rank-num { color:var(--sun); }

.lb-av {
  width:40px; height:40px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:20px; flex-shrink:0;
}

.lb-info { flex:1; min-width:0; }
.lb-name { font-weight:700; font-size:14px; display:flex; align-items:center; gap:6px; }
.lb-detail { font-size:11px; color:var(--muted); }
.you-chip {
  font-size:9px; font-weight:800; padding:2px 7px; border-radius:99px;
  background:var(--sun); color:#1e1b4b; text-transform:uppercase; letter-spacing:.5px;
}

.lb-right  { display:flex; align-items:baseline; gap:4px; flex-shrink:0; }
.lb-streak { font-size:12px; font-weight:700; color:var(--muted); margin-right:8px; }
.lb-xp-val { font-family:'Baloo 2',cursive; font-size:16px; font-weight:800; color:var(--dark); }
.lb-xp-label { font-size:10px; color:var(--muted); font-weight:700; }

.lb-bar-col { width:80px; flex-shrink:0; }
.lb-bar  { height:6px; background:#f1f5f9; border-radius:99px; overflow:hidden; }
.lb-fill { height:100%; border-radius:99px; transition:width .5s ease; }

/* Side column */
.side-col { display:flex; flex-direction:column; gap:16px; }
.card { background:var(--white); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
.card-title { font-family:'Baloo 2',cursive; font-size:17px; font-weight:800; margin:0 0 14px; }

/* Your card */
.your-card { background:linear-gradient(135deg,#1e1b4b,#312e81); }
.yc-top  { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.yc-avatar {
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg,#ec4899,#f59e0b);
  display:flex; align-items:center; justify-content:center; font-size:28px;
}
.yc-name { font-weight:800; font-size:16px; color:#fff; margin:0 0 2px; }
.yc-sub  { font-size:12px; color:rgba(255,255,255,.45); margin:0; }
.yc-stats { display:flex; gap:0; margin-bottom:16px; }
.ycs {
  flex:1; text-align:center; border-right:1px solid rgba(255,255,255,.1);
}
.ycs:last-child { border-right:none; }
.ycs-num   { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; color:var(--sun); display:block; }
.ycs-label { font-size:10px; color:rgba(255,255,255,.45); font-weight:700; text-transform:uppercase; letter-spacing:.5px; }
.yc-gap { background:rgba(255,255,255,.07); border-radius:12px; padding:12px 14px; }
.gap-text  { font-size:13px; color:rgba(255,255,255,.7); margin:0 0 10px; line-height:1.5; }
.gap-text strong { color:#fff; }
.gap-bar  { height:6px; background:rgba(255,255,255,.15); border-radius:99px; overflow:hidden; }
.gap-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,var(--sun),#f97316); transition:width .6s ease; }

/* Earn ways */
.earn-list { display:flex; flex-direction:column; gap:8px; }
.earn-row  {
  display:flex; align-items:center; gap:10px;
  padding:8px 10px; border-radius:10px; transition:background .15s;
}
.earn-row:hover { background:#f8faff; }
.earn-icon { font-size:20px; flex-shrink:0; }
.earn-act  { flex:1; font-size:13px; font-weight:600; }
.earn-xp   { font-family:'Baloo 2',cursive; font-size:14px; font-weight:800; color:var(--sun); white-space:nowrap; }

/* Mover card */
.mover-row { display:flex; align-items:center; gap:14px; }
.mover-av  {
  width:48px; height:48px; border-radius:50%;
  background:linear-gradient(135deg,#fce7f3,#a21caf);
  display:flex; align-items:center; justify-content:center; font-size:26px;
}
.mover-info { flex:1; }
.mover-name { font-weight:800; font-size:15px; margin:0 0 2px; }
.mover-sub  { font-size:12px; color:var(--leaf); font-weight:700; margin:0; }
.mover-xp   { font-family:'Baloo 2',cursive; font-size:18px; font-weight:800; color:var(--sun); }

/* Responsive */
@media (max-width:1100px) { .lb-grid { grid-template-columns:1fr; } }
@media (max-width:600px)  { .podium { padding:0; } .lb-bar-col { display:none; } }
</style>