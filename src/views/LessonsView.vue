<template>
  <section class="lessons">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">💡 Lessons</h1>
        <p class="subtitle">Pick a lesson and start learning at your pace!</p>
      </div>
      <div class="header-stat">
        <span class="header-stat-num">{{ completed }}/{{ allCards.length }}</span>
        <span class="header-stat-label">completed</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
        role="tab"
      >{{ tab }}</button>
    </div>

    <!-- Grid -->
    <div class="cards-grid">
      <article
        class="card"
        v-for="l in filtered"
        :key="l.title"
        :class="{ locked: l.locked }"
      >
        <!-- Cover -->
        <div class="card-cover" :style="{ background: l.color }">
          <span class="cover-icon">{{ l.icon }}</span>
          <span v-if="l.locked" class="lock-badge">🔒</span>
          <span v-else-if="l.progress === 100" class="done-badge">✓</span>
        </div>

        <!-- Body -->
        <div class="card-body">
          <span class="pill" :style="{ background: l.pillBg, color: l.pillColor }">
            {{ l.meta.unit }}
              <!-- unit 3 -->
          </span>
          <h3>{{ l.title }}</h3>
          <p class="meta">⏱ {{ l.time }} &nbsp;·&nbsp; ⭐ {{ l.xp }} XP</p>

          <!-- Progress -->
          <div class="progress-wrap">
            <div class="progress">
              <span
                class="progress-fill"
                :style="{
                  width: (l.progress || 0) + '%',
                  background: l.progress === 100 ? '#22c55e' : 'linear-gradient(90deg,#0ea5e9,#8b5cf6)'
                }"
              />
            </div>
            <span class="progress-label">{{ progressLabel(l) }}</span>
          </div>

          <button class="lesson-btn" :disabled="l.locked" @click="router.push(`/lessons/${l._id}`)">
            {{ l.locked ? 'Locked' : l.progress === 100 ? 'Review' : l.progress > 0 ? 'Continue' : 'Start' }}
          </button>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="empty">
      <span>🎉</span>
      <p>No lessons here yet — keep going!</p>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import router from '../router'

const tabs = ['All', 'In Progress', 'Completed', 'New']
const activeTab = ref('All')

const allCards = ref([])

const filtered = computed(() => {
  if (activeTab.value === 'Completed')
    return allCards.value.filter(c => c.progress === 100)

  if (activeTab.value === 'In Progress')
    return allCards.value.filter(c => c.progress > 0 && c.progress < 100)

  if (activeTab.value === 'New')
    return allCards.value.filter(c => c.progress === 0 && !c.locked)

  return allCards.value
})

getCards()

async function getCards() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    const data = await res.json()

    console.log('Fetched lessons:', data)

    allCards.value.push(
      ...data.lessons.map(lesson => ({
        icon: lesson.icon || '📘',
        _id: lesson._id,
        title: lesson.title,
        // unit: `UNIT ${lesson.unit}`,
        time: `${lesson.duration} min`,
        xp: lesson.xp,
        progress: lesson.progress,
        locked: lesson.locked,
        color: 'linear-gradient(135deg,#dbeafe,#c7d2fe)',
        pillBg: '#dbeafe',
        pillColor: '#1d4ed8',
        meta: lesson.meta,
        unit: lesson.meta.unit.split(".")[0].trim().split(" ")[1].trim(),
        order: lesson.order
      }))
    )

    allCards.value.sort((a,b) => +a.unit - +b.unit);

  } catch (err) {
    console.error('Error fetching lessons:', err)
  }
}
const completed = computed(() => allCards.value.filter(c => c.progress === 100).length)


function progressLabel(l) {
  if (l.locked)           return 'Locked'
  if (l.progress === 100) return 'Done!'
  if (l.progress === 0)   return 'Not started'
  return `${l.progress || 0}%`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.lessons {
  --sky:    #0ea5e9;
  --leaf:   #22c55e;
  --sun:    #f59e0b;
  --dark:   #1e1b4b;
  --muted:  #64748b;
  --white:  #ffffff;
  --radius: 18px;
  --shadow: 0 6px 24px rgba(0,0,0,0.08);

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

.subtitle {
  color: var(--muted);
  font-size: 15px;
}

.header-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: var(--white);
  border-radius: 14px;
  padding: 10px 18px;
  box-shadow: var(--shadow);
}

.header-stat-num {
  font-family: 'Baloo 2', cursive;
  font-size: 26px;
  font-weight: 800;
  color: var(--leaf);
  line-height: 1;
}

.header-stat-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
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

.tab:hover {
  border-color: var(--sky);
  color: var(--sky);
}

.tab.active {
  background: var(--dark);
  color: var(--white);
  border-color: var(--dark);
}

/* ── Cards grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Card ── */
.card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover:not(.locked) {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(0,0,0,0.13);
}

.card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Cover ── */
.card-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-icon {
  font-size: 50px;
}

.lock-badge,
.done-badge {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 18px;
  font-weight: 800;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.done-badge {
  background: var(--leaf);
  color: var(--white);
  font-size: 14px;
}

/* ── Body ── */
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pill {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  align-self: flex-start;
}

.card-body h3 {
  font-family: 'Baloo 2', cursive;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.3;
}

.meta {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
}

/* ── Progress ── */
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.progress {
  flex: 1;
  height: 7px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s ease;
}

.progress-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  white-space: nowrap;
  min-width: 68px;
  text-align: right;
}

/* ── CTA button ── */
.lesson-btn {
  margin-top: auto;
  padding: 9px 0;
  border-radius: 99px;
  border: none;
  width: 100%;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--sun), #f97316);
  color: #1e1b4b;
  box-shadow: 0 3px 12px rgba(245,158,11,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.lesson-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(245,158,11,0.45);
}

.lesson-btn:disabled {
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

/* ── Responsive ── */
@media (max-width: 960px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .cards-grid { grid-template-columns: 1fr; } }
</style>