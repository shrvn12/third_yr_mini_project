<template>
  <div class="curriculum">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1>📚 Curriculum</h1>
      <p>6 Units · 42 Lessons · Grades 3–8 · Learn coding step by step!</p>
    </div>

    <!-- FILTER TABS -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- UNITS -->
    <div
      v-for="(unit, index) in units"
      :key="unit.title"
      class="unit"
    >

      <!-- UNIT HEADER -->
      <div
        class="unit-header"
        :style="{ background: unit.headerBg }"
        @click="toggle(index)"
      >
        <div class="unit-header-left">
          <span class="unit-emoji">{{ unit.emoji }}</span>
          <div>
            <h3>{{ unit.title }}</h3>
            <p class="unit-sub">{{ unit.meta }}</p>
          </div>
        </div>

        <div class="unit-header-right">
          <span
            class="badge"
            :style="{ background: unit.badgeBg, color: unit.badgeColor }"
          >
            {{ unit.level }}
          </span>
          <span class="chevron" :class="{ open: unit.open }">›</span>
        </div>
      </div>

      <!-- LESSONS -->
      <transition name="slide">
        <div v-if="unit.open" class="unit-lessons">
          <div
            v-for="lesson in unit.lessons"
            :key="lesson.name"
            class="lesson-row"
            :class="{ locked: lesson.status === '🔒' }"
          >
            <div
              class="lesson-num"
              :style="{ background: unit.numBg, color: unit.numColor }"
            >
              {{ lesson.number }}
            </div>

            <div class="lesson-info">
              <div class="lesson-name">{{ lesson.name }}</div>
              <div class="lesson-meta">⏱ {{ lesson.meta }}</div>
            </div>

            <div class="lesson-status">{{ lesson.status }}</div>
          </div>
        </div>
      </transition>

    </div>

  </div>
</template>

<script>
export default {
  name: "CurriculumView",

  data() {
    return {
      activeTab: "All Grades",

      tabs: ["All Grades", "Grade 3–4", "Grade 5–6", "Grade 7–8"],

      units: [
        {
          emoji: "🌱",
          title: "Unit 1: Introduction to Computers",
          meta: "Grades 3–4 · 7 Lessons · No prior knowledge needed",
          level: "BEGINNER",
          open: true,
          headerBg: "linear-gradient(135deg, #dbeafe, #ede9fe)",
          badgeBg: "#dbeafe", badgeColor: "#1d4ed8",
          numBg:   "#dbeafe", numColor:  "#1d4ed8",
          lessons: [
            { number: 1, name: "What is a Computer?",       meta: "15 min", status: "✅" },
            { number: 2, name: "Input & Output Devices",    meta: "15 min", status: "✅" },
            { number: 3, name: "The Internet – What is it?",meta: "20 min", status: "🔒" }
          ]
        },
        {
          emoji: "🤖",
          title: "Unit 2: Algorithms & Thinking",
          meta: "Grades 4–5 · 7 Lessons · Unplugged activities included",
          level: "BEGINNER",
          open: false,
          headerBg: "linear-gradient(135deg, #dcfce7, #d1fae5)",
          badgeBg: "#dcfce7", badgeColor: "#15803d",
          numBg:   "#dcfce7", numColor:  "#15803d",
          lessons: [
            { number: 1, name: "What is an Algorithm?",        meta: "15 min", status: "✅" },
            { number: 2, name: "Sequences – Order Matters",    meta: "18 min", status: "⏳" },
            { number: 3, name: "Debugging – Finding Mistakes", meta: "15 min", status: "🔒" }
          ]
        },
        {
          emoji: "🧱",
          title: "Unit 3: Block Coding with Scratch",
          meta: "Grades 4–6 · 7 Lessons · Build animations & games",
          level: "IN PROGRESS",
          open: false,
          headerBg: "linear-gradient(135deg, #fef9c3, #fde68a)",
          badgeBg: "#fde68a", badgeColor: "#92400e",
          numBg:   "#fde68a", numColor:  "#92400e",
          lessons: [
            { number: 1, name: "Intro to Scratch",               meta: "20 min", status: "✅" },
            { number: 2, name: "Loops – Repeat After Me!",       meta: "20 min", status: "⏳" },
            { number: 3, name: "Mini Project – Catch the Mango!",meta: "35 min", status: "🔒" }
          ]
        }
      ]
    };
  },

  methods: {
    toggle(index) {
      this.units[index].open = !this.units[index].open;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.curriculum {
  font-family: 'Nunito', sans-serif;
  padding: 28px;
  background: #f8faff;
  min-height: 100vh;
  color: #1e1b4b;
}

/* ── Page Header ── */
.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  font-family: 'Baloo 2', cursive;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 6px;
}

.page-header p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

/* ── Tabs ── */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 26px;
  flex-wrap: wrap;
}

.tab {
  padding: 8px 20px;
  border-radius: 999px;
  border: 2.5px solid #e2e8f0;
  background: white;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s;
  color: #475569;
}

.tab:hover {
  border-color: #94a3b8;
  color: #1e1b4b;
}

.tab.active {
  background: #1e1b4b;
  color: white;
  border-color: #1e1b4b;
  box-shadow: 0 4px 12px rgba(30,27,75,0.25);
}

/* ── Unit card ── */
.unit {
  background: white;
  border-radius: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.unit:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.11);
}

/* ── Unit header ── */
.unit-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: filter 0.15s;
}

.unit-header:hover {
  filter: brightness(0.97);
}

.unit-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.unit-emoji {
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
}

.unit-header h3 {
  font-family: 'Baloo 2', cursive;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 2px;
  color: #1e1b4b;
}

.unit-sub {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.unit-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.badge {
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
}

.chevron {
  font-size: 22px;
  font-weight: 700;
  color: #94a3b8;
  transform: rotate(90deg);
  transition: transform 0.25s ease;
  display: inline-block;
  line-height: 1;
}

.chevron.open {
  transform: rotate(270deg);
}

/* ── Slide transition ── */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.28s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 600px;
}

/* ── Lesson list ── */
.unit-lessons {
  padding: 0 24px 16px;
}

.lesson-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 10px;
  border-bottom: 1px solid #f1f5f9;
  border-radius: 10px;
  transition: background 0.15s;
}

.lesson-row:hover {
  background: #f8fafc;
}

.lesson-row:last-child {
  border-bottom: none;
}

.lesson-row.locked {
  opacity: 0.5;
}

.lesson-num {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Baloo 2', cursive;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.lesson-info {
  flex: 1;
}

.lesson-name {
  font-weight: 700;
  font-size: 14px;
  color: #1e1b4b;
  margin-bottom: 2px;
}

.lesson-meta {
  font-size: 12px;
  color: #94a3b8;
}

.lesson-status {
  font-size: 18px;
  flex-shrink: 0;
}
</style>