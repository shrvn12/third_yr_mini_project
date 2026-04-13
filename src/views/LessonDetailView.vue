<template>
  <section class="lesson-detail">

    <!-- Loading state -->
    <div v-if="loading" class="state-screen">
      <div class="spinner"></div>
      <p>Loading lesson…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="state-screen error">
      <span class="state-icon">⚠️</span>
      <p class="state-title">Couldn't load lesson</p>
      <p class="state-sub">{{ error }}</p>
      <button class="retry-btn" @click="fetchLesson">↩ Try Again</button>
    </div>

    <!-- Lesson content -->
    <template v-else-if="lesson">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <RouterLink to="/lessons" class="bc-link">💡 Lessons</RouterLink>
        <span class="bc-sep">›</span>
        <span class="bc-cur">{{ lesson.meta.unit }}</span>
      </div>

      <div class="lesson-layout">

        <!-- ── LEFT: Content ── -->
        <article class="lesson-body">

          <!-- Lesson header -->
          <div class="lesson-header">
            <div class="lh-top">
              <span class="lh-unit">{{ lesson.meta.unit }}</span>
              <div class="lh-chips">
                <span class="chip">⏱ {{ lesson.meta.duration }} min</span>
                <span class="chip">⭐ {{ lesson.meta.xp }} XP</span>
                <span class="chip diff">{{ lesson.meta.difficulty }}</span>
              </div>
            </div>
            <h1 class="lesson-title">{{ lesson.meta.title }}</h1>
            <p class="lesson-subtitle">{{ lesson.meta.subtitle }}</p>

            <!-- Objectives -->
            <div class="objectives">
              <p class="obj-label">🎯 In this lesson you will:</p>
              <ul class="obj-list">
                <li v-for="o in lesson.objectives" :key="o">{{ o }}</li>
              </ul>
            </div>

            <!-- Progress bar -->
            <div class="lesson-progress-wrap">
              <div class="lesson-progress-bar">
                <div class="lesson-progress-fill" :style="{ width: readProgress + '%' }"></div>
              </div>
              <span class="lesson-progress-label">{{ readProgress }}% read</span>
            </div>
          </div>

          <!-- Content blocks -->
          <div class="content-blocks" ref="contentRef">
            <template v-for="(block, i) in lesson.content" :key="i">

              <!-- HEADING -->
              <h2 v-if="block.type === 'heading'" class="block-heading">
                {{ block.text }}
              </h2>

              <!-- PARAGRAPH -->
              <p
                v-else-if="block.type === 'paragraph'"
                class="block-para"
                v-html="renderMarkdown(block.text)"
              ></p>

              <!-- CALLOUT -->
              <div
                v-else-if="block.type === 'callout'"
                class="block-callout"
                :class="block.kind"
              >
                <span class="co-emoji">{{ block.emoji }}</span>
                <div class="co-body">
                  <p class="co-title">{{ block.title }}</p>
                  <p class="co-text" v-html="renderMarkdown(block.text)"></p>
                </div>
              </div>

              <!-- ILLUSTRATION -->
              <div v-else-if="block.type === 'illustration'" class="block-illustration">
                <div class="il-emoji">{{ block.emoji }}</div>
                <p class="il-caption">{{ block.caption }}</p>
              </div>

              <!-- ANALOGY -->
              <div v-else-if="block.type === 'analogy'" class="block-analogy">
                <div class="an-row">
                  <span class="an-icon">🌍</span>
                  <p class="an-scenario">{{ block.scenario }}</p>
                </div>
                <div class="an-arrow">↓ just like</div>
                <div class="an-row">
                  <span class="an-icon">💻</span>
                  <p class="an-connect">{{ block.connection }}</p>
                </div>
              </div>

              <!-- CODE BLOCK -->
              <div v-else-if="block.type === 'code'" class="block-code">
                <div class="code-header">
                  <div class="code-dots">
                    <span class="cd r"></span>
                    <span class="cd y"></span>
                    <span class="cd g"></span>
                  </div>
                  <span class="code-label">{{ block.label }}</span>
                  <span class="code-lang">{{ block.language }}</span>
                  <button class="copy-btn" @click="copyCode(block.code, i)">
                    {{ copied === i ? '✓ Copied' : '📋 Copy' }}
                  </button>
                </div>
                <pre class="code-body"><code>{{ block.code }}</code></pre>

                <!-- Output panel -->
                <div v-if="block.output" class="code-output">
                  <span class="co-out-label">▶ Output</span>
                  <pre class="co-pre">{{ block.output }}</pre>
                </div>

                <!-- Token annotations -->
                <div v-if="block.notes?.length" class="code-notes">
                  <div v-for="note in block.notes" :key="note.token" class="cn-row">
                    <code class="cn-token">{{ note.token }}</code>
                    <span class="cn-arrow">→</span>
                    <span class="cn-text">{{ note.explanation }}</span>
                  </div>
                </div>
              </div>

              <!-- STEPS -->
              <div v-else-if="block.type === 'steps'" class="block-steps">
                <p class="steps-title">{{ block.title }}</p>
                <div v-for="(step, si) in block.items" :key="si" class="step-row">
                  <div class="step-num">{{ si + 1 }}</div>
                  <p class="step-text" v-html="renderMarkdown(step)"></p>
                </div>
              </div>

              <!-- COMPARISON -->
              <div v-else-if="block.type === 'comparison'" class="block-comparison">
                <p class="cmp-title">{{ block.title }}</p>
                <div class="cmp-grid">
                  <div class="cmp-side">
                    <div class="cmp-lang">{{ block.left.emoji }} {{ block.left.lang }}</div>
                    <pre class="cmp-code scratch">{{ block.left.code }}</pre>
                  </div>
                  <div class="cmp-equals">≡</div>
                  <div class="cmp-side">
                    <div class="cmp-lang">{{ block.right.emoji }} {{ block.right.lang }}</div>
                    <pre class="cmp-code python">{{ block.right.code }}</pre>
                  </div>
                </div>
                <p v-if="block.note" class="cmp-note">💡 {{ block.note }}</p>
              </div>

              <!-- MISTAKE -->
              <div v-else-if="block.type === 'mistake'" class="block-mistakes">
                <p class="mistakes-label">🐛 Common Mistakes to Avoid</p>
                <div v-for="(m, mi) in block.items" :key="mi" class="mistake-card">
                  <div class="mk-wrong">
                    <span class="mk-badge wrong">✗ Wrong</span>
                    <pre class="mk-code">{{ m.wrong }}</pre>
                    <div class="mk-error">{{ m.error }}</div>
                  </div>
                  <div class="mk-arrow">↓ fix it</div>
                  <div class="mk-fix">
                    <span class="mk-badge fix">✓ Fixed</span>
                    <pre class="mk-code green">{{ m.fix }}</pre>
                    <div class="mk-explain">{{ m.explanation }}</div>
                  </div>
                </div>
              </div>

              <!-- CHALLENGE -->
              <div v-else-if="block.type === 'challenge'" class="block-challenge">
                <div class="ch-header">
                  <span class="ch-emoji">{{ block.emoji }}</span>
                  <div>
                    <span class="ch-diff" :class="block.difficulty.toLowerCase()">
                      {{ block.difficulty }}
                    </span>
                    <h4 class="ch-title">{{ block.title }}</h4>
                  </div>
                </div>
                <p class="ch-prompt">{{ block.prompt }}</p>
                <details class="ch-hint">
                  <summary>💡 Show hint</summary>
                  <p>{{ block.hint }}</p>
                </details>
                <div class="ch-editor">
                  <div class="ch-editor-bar">
                    <span class="cd r"></span>
                    <span class="cd y"></span>
                    <span class="cd g"></span>
                    <span class="ch-file">solution.py</span>
                  </div>
                  <textarea
                    class="ch-textarea"
                    v-model="challengeCode[i]"
                    spellcheck="false"
                    autocorrect="off"
                    autocapitalize="off"
                    @keydown.tab.prevent="insertTab($event, i)"
                  ></textarea>
                  <!-- Output -->
                  <div v-if="challengeOutput[i] !== undefined" class="ch-output">
                    <span class="cho-label">▶ Output</span>
                    <pre class="cho-pre">{{ challengeOutput[i] }}</pre>
                  </div>
                  <div class="ch-footer">
                    <button class="ch-run" @click="runChallenge(i, block)">▶ Run</button>
                    <button class="ch-solution" @click="loadSolution(i, block)">
                      👁 Show Solution
                    </button>
                    <button class="ch-reset" @click="resetChallenge(i, block)">
                      ↩ Reset
                    </button>
                  </div>
                </div>
              </div>

              <!-- SUMMARY -->
              <div v-else-if="block.type === 'summary'" class="block-summary">
                <p class="sum-label">📝 Summary</p>
                <ul class="sum-list">
                  <li
                    v-for="item in block.items"
                    :key="item"
                    v-html="renderMarkdown(item)"
                  ></li>
                </ul>
              </div>

            </template>
          </div>

          <!-- Quiz CTA -->
          <div class="lesson-quiz-cta">
            <div class="qcta-inner">
              <span class="qcta-icon">🧠</span>
              <div>
                <p class="qcta-title">Ready to test yourself?</p>
                <p class="qcta-sub">
                  Take the {{ lesson.quiz.questions.length }}-question quiz and earn
                  {{ lesson.meta.xp }} XP!
                </p>
              </div>
              <button class="qcta-btn" @click="showQuiz = true">Start Quiz →</button>
            </div>
          </div>

          <!-- Lesson navigation -->
          <div class="lesson-nav">
            <RouterLink
              v-if="lesson.navigation.prevLesson"
              :to="`/lessons/${lesson.navigation.prevLesson.id}`"
              class="lnav-btn prev"
            >
              ← {{ lesson.navigation.prevLesson.title }}
            </RouterLink>
            <div v-else></div>
            <RouterLink
              v-if="lesson.navigation.nextLesson"
              :to="`/lessons/${lesson.navigation.nextLesson.id}`"
              class="lnav-btn next"
            >
              {{ lesson.navigation.nextLesson.title }} →
            </RouterLink>
          </div>

        </article>

        <!-- ── RIGHT: Sidebar ── -->
        <aside class="lesson-sidebar">

          <!-- Progress card -->
          <div class="sb-card progress-card">
            <p class="sb-title">Your Progress</p>
            <div class="sb-xp">
              <span class="sbxp-num">{{ Math.round(lesson.meta.xp * readProgress / 100) }}</span>
              <span class="sbxp-label">/ {{ lesson.meta.xp }} XP</span>
            </div>
            <div class="sb-bar">
              <div class="sb-fill" :style="{ width: readProgress + '%' }"></div>
            </div>
            <p class="sb-hint">Scroll through the lesson, then take the quiz to earn full XP</p>
          </div>

          <!-- Table of contents -->
          <div class="sb-card">
            <p class="sb-title">On This Page</p>
            <ul class="toc-list">
              <li
                v-for="heading in headings"
                :key="heading"
                class="toc-item"
              >{{ heading }}</li>
            </ul>
          </div>

          <!-- Tags -->
          <div class="sb-card">
            <p class="sb-title">Topics</p>
            <div class="tag-wrap">
              <span
                class="tag-pill"
                v-for="tag in lesson.meta.tags"
                :key="tag"
              >#{{ tag }}</span>
            </div>
          </div>

        </aside>
      </div>

      <!-- Quiz modal -->
      <Transition name="modal">
        <div
          v-if="showQuiz"
          class="quiz-modal-backdrop"
          @click.self="showQuiz = false"
        >
          <div class="quiz-modal">
            <button class="qm-close" @click="showQuiz = false">✕</button>

            <!-- Question -->
            <div v-if="!quizDone">
              <p class="qm-label">🧠 Lesson Quiz · {{ lesson.meta.title }}</p>
              <div class="qm-progress">
                <div
                  v-for="(_, qi) in lesson.quiz.questions"
                  :key="qi"
                  class="qm-dot"
                  :class="{
                    done:    quizAnswers[qi] !== undefined,
                    current: qi === quizIndex
                  }"
                ></div>
              </div>
              <p class="qm-counter">
                Question {{ quizIndex + 1 }} of {{ lesson.quiz.questions.length }}
              </p>
              <h3 class="qm-question" v-html="renderMarkdown(currentQuestion.text)"></h3>
              <div class="qm-options">
                <button
                  v-for="(opt, oi) in currentQuestion.options"
                  :key="oi"
                  class="qm-opt"
                  :class="{
                    selected: quizSelected === oi,
                    correct:  quizAnswered && oi === currentQuestion.correct,
                    wrong:    quizAnswered && quizSelected === oi && oi !== currentQuestion.correct,
                    dimmed:   quizAnswered && oi !== currentQuestion.correct && oi !== quizSelected
                  }"
                  :disabled="quizAnswered"
                  @click="selectAnswer(oi)"
                >
                  <span class="qm-opt-letter">{{ ['A','B','C','D'][oi] }}</span>
                  {{ opt }}
                </button>
              </div>
              <div v-if="quizAnswered" class="qm-feedback"
                :class="quizSelected === currentQuestion.correct ? 'correct' : 'wrong'"
              >
                <span>{{ quizSelected === currentQuestion.correct ? '🎉 Correct!' : '🤔 Not quite…' }}</span>
                <p>{{ currentQuestion.explanation }}</p>
                <button class="qm-next-btn" @click="nextQuestion">
                  {{ quizIndex < lesson.quiz.questions.length - 1 ? 'Next →' : 'See Results →' }}
                </button>
              </div>
            </div>

            <!-- Results -->
            <div v-else class="qm-result">
              <div class="qmr-emoji">{{ quizScore === lesson.quiz.questions.length ? '🏆' : quizScore >= lesson.quiz.questions.length * 0.6 ? '🎉' : '💪' }}</div>
              <h3 class="qmr-title">
                {{ quizScore === lesson.quiz.questions.length ? 'Perfect!' : quizScore >= lesson.quiz.questions.length * 0.6 ? 'Well done!' : 'Keep practicing!' }}
              </h3>
              <p class="qmr-score">{{ quizScore }} / {{ lesson.quiz.questions.length }} correct</p>
              <p class="qmr-xp">+{{ Math.round(lesson.meta.xp * quizScore / lesson.quiz.questions.length) }} XP earned</p>
              <div class="qmr-actions">
                <button class="qmr-retry" @click="resetQuiz">↩ Retry Quiz</button>
                <button class="qmr-done" @click="showQuiz = false; router.push('/lessons')">
                  ✓ Done
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>

    </template>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, markRaw } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()

// ── Data ────────────────────────────────────────────────
const lesson  = ref(null)
const loading = ref(true)
const error   = ref(null)

const pyodide = ref(null)

onMounted(async () => {
  pyodide.value = await window.loadPyodide()
})

async function fetchLesson() {
  loading.value = true
  error.value   = null
  try {
    // FIX: use route param so any lesson ID works, not a hardcoded OID
    const id  = route.params.id
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/${id}`, {
      headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    if (!res.ok) throw new Error(`Server returned ${res.status}`)
    const data  = await res.json()
    data.content = Object.freeze(data.content)
    lesson.value = markRaw(data.lesson);
    console.log('Fetched lesson:', data)

    // FIX: seed challenge textareas with starterCode after lesson loads
    lesson.value.content.forEach((block, i) => {
      if (block.type === 'challenge') {
        challengeCode.value[i] = block.starterCode ?? ''
      }
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// ── Read progress ────────────────────────────────────────
const contentRef   = ref(null)
const readProgress = ref(0)

function onScroll() {
  if (!contentRef.value) return
  const el      = contentRef.value
  const rect    = el.getBoundingClientRect()
  const total   = el.offsetHeight - window.innerHeight
  // FIX: guard against zero/negative total (short pages)
  if (total <= 0) { readProgress.value = 100; return }
  const scrolled = -rect.top
  readProgress.value = Math.min(100, Math.max(0, Math.round((scrolled / total) * 100)))
}

// ── Headings (table of contents) ────────────────────────
const headings = computed(() =>
  lesson.value?.content
    ?.filter(b => b.type === 'heading')
    .map(b => b.text) ?? []
)

// ── Clipboard ────────────────────────────────────────────
const copied = ref(null)

async function copyCode(code, idx) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = idx
    setTimeout(() => (copied.value = null), 2000)
  } catch {
    // clipboard API not available (HTTP context); silently ignore
  }
}

// ── Challenge editor ─────────────────────────────────────
const challengeCode   = ref({})
const challengeOutput = ref({})

// FIX: Tab key inserts 4 spaces instead of moving focus
function insertTab(event, idx) {
  const el  = event.target
  const s   = el.selectionStart
  const val = challengeCode.value[idx]
  challengeCode.value[idx] = val.slice(0, s) + '    ' + val.slice(s)
  // restore cursor position after Vue DOM update
  setTimeout(() => { el.selectionStart = el.selectionEnd = s + 4 }, 0)
}

// FIX: simulate output instead of just console.logging
// function runChallenge(idx, block) {
//   const code = challengeCode.value[idx] ?? ''
//   const lines = []
//   const printRe = /print\(([^)]*)\)/g
//   let match
//   while ((match = printRe.exec(code)) !== null) {
//     let arg = match[1].trim()
//     if ((arg.startsWith('"') && arg.endsWith('"')) ||
//         (arg.startsWith("'") && arg.endsWith("'"))) {
//       lines.push(arg.slice(1, -1))
//     } else {
//       lines.push(`[evaluates: ${arg}]`)
//     }
//   }
//   challengeOutput.value = {
//     ...challengeOutput.value,
//     [idx]: lines.length ? lines.join('\n') : '# No output — try adding a print() statement'
//   }
// }

async function runChallenge(idx) {
  const code = challengeCode.value[idx] ?? ''
  console.log('Running challenge code:', code)
  if (!pyodide.value) return
  // running.value = true
  // output.value = ''

  try {
    // Redirect stdout so print() calls are captured
    await pyodide.value.runPythonAsync(`
      import sys, io
      sys.stdout = io.StringIO()
    `)

    await pyodide.value.runPythonAsync(code)

    const result = await pyodide.value.runPythonAsync(`sys.stdout.getvalue()`)
    const output = result || '# No output — try adding a print() statement!'
    challengeOutput.value = {
      ...challengeOutput.value,
      [idx]: output
    }
  } catch (err) {
    challengeOutput.value = {
      ...challengeOutput.value,
      [idx]: `Error: ${err.message}`
    }
    // output.value = `Error: ${err.message}`
  } finally {
    // running.value = false
  }
}

function loadSolution(idx, block) {
  challengeCode.value   = { ...challengeCode.value,   [idx]: block.solution }
  challengeOutput.value = { ...challengeOutput.value, [idx]: undefined }
}

function resetChallenge(idx, block) {
  challengeCode.value   = { ...challengeCode.value,   [idx]: block.starterCode ?? '' }
  challengeOutput.value = { ...challengeOutput.value, [idx]: undefined }
}

// ── Inline quiz ──────────────────────────────────────────
const showQuiz     = ref(false)
const quizIndex    = ref(0)
const quizSelected = ref(null)
const quizAnswered = ref(false)
const quizAnswers  = ref([])
const quizDone     = ref(false)

const currentQuestion = computed(() =>
  lesson.value?.quiz.questions[quizIndex.value]
)

const quizScore = computed(() =>
  quizAnswers.value.filter(
    (a, i) => a === lesson.value?.quiz.questions[i]?.correct
  ).length
)

function selectAnswer(oi) {
  quizSelected.value = oi
  quizAnswered.value = true
  quizAnswers.value  = [...quizAnswers.value, oi]
}

function nextQuestion() {
  if (quizIndex.value < lesson.value.quiz.questions.length - 1) {
    quizIndex.value++
    quizSelected.value = null
    quizAnswered.value = false
  } else {
    quizDone.value = true
  }
}

function resetQuiz() {
  quizIndex.value    = 0
  quizSelected.value = null
  quizAnswered.value = false
  quizAnswers.value  = []
  quizDone.value     = false
}

// FIX: reset quiz state whenever the modal opens
watch(showQuiz, (val) => { if (val) resetQuiz() })

// ── Render inline markdown (**bold** and `code`) ─────────
function renderMarkdown(text) {
  if (!text) return ''
  if (typeof text !== 'string') {
    console.warn('Expected string for markdown rendering, got:', text)
    if (typeof text === 'object') {
      let str = '';
      for (let key in text){
        str += `${text[key]} `;
      }
      return str.trim();
    }
    return String(text)
  }
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g,       '<code>$1</code>')
}

// ── Lifecycle ────────────────────────────────────────────
// FIX: single onMounted — fetch + scroll listener together
onMounted(() => {
    console.log('Mounted LessonDetailView, fetching lesson…')
  fetchLesson()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.lesson-detail {
  --dark:   #1e1b4b; --white: #ffffff; --muted: #64748b;
  --sun:    #f59e0b; --leaf:  #22c55e; --sky:   #0ea5e9;
  --berry:  #ec4899; --grape: #8b5cf6;
  --mono:   'JetBrains Mono', monospace;
  --radius: 16px; --shadow: 0 4px 20px rgba(0,0,0,0.08);

  font-family: 'Nunito', sans-serif;
  color: var(--dark);
  padding: 28px;
  background: #f8faff;
  min-height: 100vh;
}

/* ── Loading / Error ── */
.state-screen {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; gap: 14px; color: var(--muted);
}
.state-icon  { font-size: 48px; }
.state-title { font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: 800; margin: 0; color: var(--dark); }
.state-sub   { font-size: 14px; margin: 0; }
.retry-btn   { padding: 10px 22px; border-radius: 99px; border: none; background: var(--dark); color: #fff; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; }
.spinner {
  width: 40px; height: 40px; border-radius: 50%;
  border: 4px solid #e2e8f0; border-top-color: var(--sky);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Breadcrumb ── */
.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; font-size: 14px; }
.bc-link    { color: var(--sky); font-weight: 700; text-decoration: none; }
.bc-link:hover { text-decoration: underline; }
.bc-sep     { color: var(--muted); }
.bc-cur     { color: var(--muted); font-weight: 600; }

/* ── Layout ── */
.lesson-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}

/* ── Lesson header ── */
.lesson-header {
  background: var(--white); border-radius: var(--radius);
  padding: 28px; margin-bottom: 20px; box-shadow: var(--shadow);
}
.lh-top     { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; }
.lh-unit    { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
.lh-chips   { display: flex; gap: 8px; }
.chip       { padding: 4px 12px; border-radius: 99px; background: #f1f5f9; color: var(--muted); font-size: 12px; font-weight: 700; }
.chip.diff  { background: #dcfce7; color: #15803d; }
.lesson-title    { font-family: 'Baloo 2', cursive; font-size: 30px; font-weight: 800; margin: 0 0 6px; line-height: 1.2; }
.lesson-subtitle { color: var(--muted); font-size: 15px; margin: 0 0 20px; }

/* Objectives */
.objectives { background: #f8faff; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; }
.obj-label  { font-weight: 800; font-size: 13px; margin: 0 0 10px; }
.obj-list   { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.obj-list li{ font-size: 14px; color: var(--dark); }

/* Progress bar */
.lesson-progress-wrap { display: flex; align-items: center; gap: 12px; }
.lesson-progress-bar  { flex: 1; height: 8px; background: #e2e8f0; border-radius: 99px; overflow: hidden; }
.lesson-progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--sky), var(--grape)); transition: width 0.4s ease; }
.lesson-progress-label{ font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; }

/* ── Content blocks ── */
.content-blocks { display: flex; flex-direction: column; gap: 20px; }

.block-heading {
  font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: 800;
  margin: 8px 0 0; padding-top: 8px; border-top: 2px solid #f1f5f9;
  color: var(--dark);
}

.block-para {
  font-size: 15px; line-height: 1.8; margin: 0; color: #334155;
}
.block-para strong { color: var(--dark); }
.block-para code   { background: #f1f5f9; padding: 1px 6px; border-radius: 5px; font-family: var(--mono); font-size: 13px; }

/* Callout */
.block-callout {
  display: flex; gap: 14px; padding: 16px 18px;
  border-radius: 14px; border-left: 4px solid;
}
.block-callout.fun-fact { background: #fefce8; border-color: var(--sun); }
.block-callout.warning  { background: #fdf2f8; border-color: var(--berry); }
.block-callout.tip      { background: #f0f9ff; border-color: var(--sky); }
.block-callout.info     { background: #f0fdf4; border-color: var(--leaf); }
.co-emoji  { font-size: 26px; flex-shrink: 0; }
.co-title  { font-weight: 800; font-size: 14px; margin: 0 0 4px; }
.co-text   { font-size: 14px; line-height: 1.6; margin: 0; color: #475569; }

/* Illustration */
.block-illustration { text-align: center; padding: 24px; background: #f8faff; border-radius: 14px; }
.il-emoji   { font-size: 72px; margin-bottom: 12px; }
.il-caption { font-size: 14px; color: var(--muted); margin: 0; font-style: italic; }

/* Analogy */
.block-analogy { background: var(--white); border: 2px solid #e2e8f0; border-radius: 14px; padding: 18px; }
.an-row      { display: flex; align-items: flex-start; gap: 12px; }
.an-icon     { font-size: 22px; flex-shrink: 0; }
.an-scenario { margin: 0; font-size: 14px; font-weight: 600; color: var(--dark); line-height: 1.5; }
.an-connect  { margin: 0; font-size: 14px; color: #475569; line-height: 1.5; }
.an-arrow    { text-align: center; font-size: 13px; color: var(--muted); font-weight: 700; margin: 8px 0; padding-left: 34px; }

/* Code block */
.block-code { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
.code-header {
  background: #161b22; padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid #30363d;
}
.code-dots  { display: flex; gap: 5px; }
.cd         { width: 11px; height: 11px; border-radius: 50%; }
.cd.r { background: #ff5f57; }
.cd.y { background: #febc2e; }
.cd.g { background: #28c840; }
.code-label { flex: 1; color: #8b949e; font-family: var(--mono); font-size: 12px; }
.code-lang  { font-size: 11px; color: #58a6ff; background: rgba(88,166,255,.1); padding: 2px 8px; border-radius: 6px; font-family: var(--mono); }
.copy-btn   { border: none; background: rgba(255,255,255,.08); color: #8b949e; font-size: 11px; padding: 4px 10px; border-radius: 6px; cursor: pointer; transition: all .15s; font-family: 'Nunito', sans-serif; }
.copy-btn:hover { background: rgba(255,255,255,.15); color: #fff; }
.code-body  { margin: 0; background: #0d1117; padding: 18px; font-family: var(--mono); font-size: 13.5px; color: #e6edf3; line-height: 1.75; overflow-x: auto; }
.code-body code { background: none; color: inherit; font-family: inherit; }

.code-output { background: #011a14; padding: 14px 18px; border-top: 1px solid #064e3b; }
.co-out-label{ font-family: var(--mono); font-size: 11px; color: #22c55e; font-weight: 600; display: block; margin-bottom: 6px; }
.co-pre      { margin: 0; font-family: var(--mono); font-size: 13px; color: #6ee7b7; line-height: 1.7; white-space: pre-wrap; }

.code-notes { background: #f8faff; padding: 14px 18px; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 8px; }
.cn-row     { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; }
.cn-token   { background: #1e1b4b; color: #93c5fd; font-family: var(--mono); padding: 2px 8px; border-radius: 6px; font-size: 12px; flex-shrink: 0; }
.cn-arrow   { color: var(--muted); flex-shrink: 0; margin-top: 1px; }
.cn-text    { color: #475569; line-height: 1.5; }

/* Steps */
.block-steps { background: var(--white); border-radius: 14px; padding: 20px; box-shadow: var(--shadow); }
.steps-title { font-family: 'Baloo 2', cursive; font-size: 16px; font-weight: 800; margin: 0 0 14px; }
.step-row    { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
.step-row:last-child { margin-bottom: 0; }
.step-num    { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, var(--sky), var(--grape)); color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.step-text   { font-size: 14px; line-height: 1.6; margin: 0; color: #334155; }
.step-text strong { color: var(--dark); }
.step-text code   { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-family: var(--mono); font-size: 12px; }

/* Comparison */
.block-comparison { background: var(--white); border-radius: 14px; padding: 20px; box-shadow: var(--shadow); }
.cmp-title  { font-family: 'Baloo 2', cursive; font-size: 16px; font-weight: 800; margin: 0 0 14px; }
.cmp-grid   { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; }
.cmp-lang   { font-size: 13px; font-weight: 800; margin-bottom: 8px; }
.cmp-code   { margin: 0; border-radius: 10px; padding: 14px; font-family: var(--mono); font-size: 13px; line-height: 1.7; white-space: pre; }
.cmp-code.scratch { background: #fef9c3; color: #92400e; }
.cmp-code.python  { background: #0d1117; color: #e6edf3; }
.cmp-equals { font-size: 28px; color: var(--muted); text-align: center; font-weight: 800; }
.cmp-note   { font-size: 13px; color: #475569; margin: 12px 0 0; background: #f8faff; padding: 10px 14px; border-radius: 10px; }

/* Mistakes */
.block-mistakes { display: flex; flex-direction: column; gap: 16px; }
.mistakes-label { font-family: 'Baloo 2', cursive; font-size: 18px; font-weight: 800; margin: 0; }
.mistake-card   { background: var(--white); border-radius: 14px; padding: 18px; box-shadow: var(--shadow); }
.mk-wrong, .mk-fix { border-radius: 10px; padding: 12px; }
.mk-wrong { background: #fdf2f8; }
.mk-fix   { background: #f0fdf4; }
.mk-badge { font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 99px; display: inline-block; margin-bottom: 8px; }
.mk-badge.wrong { background: #fce7f3; color: #9d174d; }
.mk-badge.fix   { background: #dcfce7; color: #15803d; }
.mk-code  { font-family: var(--mono); font-size: 13px; line-height: 1.7; margin: 0 0 8px; white-space: pre-wrap; color: #334155; }
.mk-code.green { color: #15803d; }
.mk-error  { font-size: 12px; color: #be185d; font-weight: 700; }
.mk-explain{ font-size: 13px; color: #15803d; line-height: 1.5; }
.mk-arrow  { text-align: center; font-size: 13px; font-weight: 700; color: var(--muted); padding: 6px 0; }

/* Challenge */
.block-challenge { background: var(--white); border-radius: 14px; padding: 20px; box-shadow: var(--shadow); }
.ch-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.ch-emoji  { font-size: 32px; flex-shrink: 0; }
.ch-diff   { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; padding: 2px 8px; border-radius: 99px; display: inline-block; margin-bottom: 4px; }
.ch-diff.easy   { background: #dcfce7; color: #15803d; }
.ch-diff.medium { background: #fef9c3; color: #92400e; }
.ch-diff.hard   { background: #fee2e2; color: #b91c1c; }
.ch-title  { font-family: 'Baloo 2', cursive; font-size: 17px; font-weight: 800; margin: 0; }
.ch-prompt { font-size: 14px; color: #475569; margin: 0 0 12px; line-height: 1.6; }
.ch-hint   { background: #fefce8; border-radius: 10px; padding: 10px 14px; font-size: 13px; cursor: pointer; margin-bottom: 12px; }
.ch-hint summary { font-weight: 700; color: var(--sun); }
.ch-hint p { margin: 8px 0 0; color: #92400e; }
.ch-editor { border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0; }
.ch-editor-bar { background: #161b22; padding: 8px 14px; display: flex; align-items: center; gap: 6px; }
.ch-file   { margin-left: 8px; font-family: var(--mono); font-size: 11px; color: #484f58; }
.ch-textarea {
  width: 100%; min-height: 120px; background: #0d1117; border: none; outline: none;
  font-family: var(--mono); font-size: 13px; color: #e6edf3; padding: 14px;
  line-height: 1.75; resize: vertical; tab-size: 4; caret-color: #58a6ff;
  display: block;
}
.ch-output { background: #011a14; padding: 10px 14px; border-top: 1px solid #064e3b; }
.cho-label { font-family: var(--mono); font-size: 11px; color: #22c55e; display: block; margin-bottom: 4px; }
.cho-pre   { margin: 0; font-family: var(--mono); font-size: 13px; color: #6ee7b7; line-height: 1.7; white-space: pre-wrap; }
.ch-footer { background: #161b22; padding: 8px 12px; display: flex; gap: 8px; }
.ch-run, .ch-solution, .ch-reset {
  padding: 6px 14px; border-radius: 99px; border: none;
  font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 12px;
  cursor: pointer; transition: all .15s;
}
.ch-run      { background: linear-gradient(135deg, var(--leaf), #16a34a); color: #fff; }
.ch-solution { background: rgba(255,255,255,.08); color: #8b949e; }
.ch-reset    { background: rgba(255,255,255,.05); color: #484f58; }
.ch-run:hover      { box-shadow: 0 3px 10px rgba(34,197,94,.4); }
.ch-solution:hover { color: #fff; background: rgba(255,255,255,.15); }

/* Summary */
.block-summary { background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 14px; padding: 22px 24px; }
.sum-label { font-family: 'Baloo 2', cursive; font-size: 16px; font-weight: 800; color: #fde68a; margin: 0 0 12px; }
.sum-list  { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
.sum-list li{ font-size: 14px; color: rgba(255,255,255,.8); line-height: 1.6; }
.sum-list strong { color: #fff; }
.sum-list code   { background: rgba(255,255,255,.1); padding: 1px 6px; border-radius: 4px; font-family: var(--mono); font-size: 12px; color: #93c5fd; }

/* ── Quiz CTA ── */
.lesson-quiz-cta { margin-top: 24px; }
.qcta-inner {
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border-radius: 18px; padding: 22px 24px;
  display: flex; align-items: center; gap: 16px;
}
.qcta-icon  { font-size: 36px; flex-shrink: 0; }
.qcta-title { font-family: 'Baloo 2', cursive; font-size: 18px; font-weight: 800; color: #fff; margin: 0 0 4px; }
.qcta-sub   { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; }
.qcta-btn   {
  margin-left: auto; flex-shrink: 0;
  padding: 10px 22px; border-radius: 99px; border: none;
  background: linear-gradient(135deg, var(--sun), #f97316);
  color: #1e1b4b; font-family: 'Nunito', sans-serif;
  font-weight: 800; font-size: 14px; cursor: pointer;
  box-shadow: 0 4px 16px rgba(245,158,11,.4); transition: all .15s;
}
.qcta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,158,11,.5); }

/* ── Lesson navigation ── */
.lesson-nav { display: flex; justify-content: space-between; gap: 12px; margin-top: 20px; }
.lnav-btn   {
  flex: 1; padding: 14px 18px; border-radius: 14px;
  border: 2px solid #e2e8f0; background: var(--white);
  color: var(--dark); font-weight: 700; font-size: 13px;
  text-decoration: none; transition: all .18s; line-height: 1.4;
  box-shadow: var(--shadow);
}
.lnav-btn:hover { border-color: var(--sky); transform: translateY(-2px); }
.lnav-btn.prev  { text-align: left; }
.lnav-btn.next  { text-align: right; }

/* ── Sidebar ── */
.lesson-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 20px; }
.sb-card { background: var(--white); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); }
.sb-title { font-family: 'Baloo 2', cursive; font-size: 14px; font-weight: 800; margin: 0 0 12px; text-transform: uppercase; letter-spacing: .6px; color: var(--muted); }
.progress-card { background: linear-gradient(135deg, #1e1b4b, #312e81); }
.progress-card .sb-title { color: rgba(255,255,255,.5); }
.sb-xp    { display: flex; align-items: baseline; gap: 4px; margin-bottom: 10px; }
.sbxp-num { font-family: 'Baloo 2', cursive; font-size: 28px; font-weight: 800; color: var(--sun); }
.sbxp-label{ font-size: 13px; color: rgba(255,255,255,.5); }
.sb-bar   { height: 8px; background: rgba(255,255,255,.15); border-radius: 99px; overflow: hidden; margin-bottom: 10px; }
.sb-fill  { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--leaf), var(--sky)); transition: width .4s ease; }
.sb-hint  { font-size: 12px; color: rgba(255,255,255,.4); margin: 0; line-height: 1.5; }
.toc-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
.toc-item { font-size: 13px; font-weight: 600; color: var(--muted); padding: 4px 8px; border-radius: 8px; cursor: default; transition: background .15s; }
.toc-item:hover { background: #f1f5f9; color: var(--dark); }
.tag-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-pill { background: #ede9fe; color: #6d28d9; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 99px; }

/* ── Quiz modal ── */
.quiz-modal-backdrop {
  position: fixed; inset: 0; background: rgba(15,10,40,.75);
  backdrop-filter: blur(4px); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.quiz-modal {
  background: var(--white); border-radius: 22px; padding: 30px;
  max-width: 520px; width: 100%; box-shadow: 0 24px 80px rgba(0,0,0,.4);
  position: relative; max-height: 90vh; overflow-y: auto;
}
.qm-close { position: absolute; top: 14px; right: 14px; width: 28px; height: 28px; border-radius: 50%; border: none; background: #f1f5f9; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.qm-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; color: var(--muted); margin: 0 0 14px; }
.qm-progress { display: flex; gap: 5px; margin-bottom: 6px; }
.qm-dot  { flex: 1; height: 6px; border-radius: 99px; background: #e2e8f0; transition: background .2s; }
.qm-dot.done    { background: var(--leaf); }
.qm-dot.current { background: var(--sky); }
.qm-counter { font-size: 12px; color: var(--muted); font-weight: 600; margin: 0 0 16px; }
.qm-question { font-family: 'Baloo 2', cursive; font-size: 18px; font-weight: 700; margin: 0 0 18px; line-height: 1.4; white-space: pre-line; }
.qm-question code { background: #f1f5f9; padding: 1px 6px; border-radius: 5px; font-family: var(--mono); font-size: 14px; }
.qm-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.qm-opt {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-radius: 12px;
  border: 2.5px solid #e2e8f0; background: var(--white);
  cursor: pointer; text-align: left; font-family: 'Nunito', sans-serif;
  font-size: 13px; font-weight: 600; transition: all .18s; color: var(--dark);
}
.qm-opt:hover:not(:disabled) { border-color: var(--sky); background: #f0f9ff; }
.qm-opt.correct { border-color: var(--leaf); background: #f0fdf4; color: #15803d; }
.qm-opt.wrong   { border-color: var(--berry); background: #fdf2f8; color: #be185d; }
.qm-opt.dimmed  { opacity: .4; }
.qm-opt:disabled { cursor: not-allowed; }
.qm-opt-letter  { width: 24px; height: 24px; border-radius: 50%; background: #f1f5f9; color: var(--muted); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qm-opt.correct .qm-opt-letter { background: var(--leaf); color: #fff; }
.qm-opt.wrong   .qm-opt-letter { background: var(--berry); color: #fff; }
.qm-feedback {
  padding: 14px 16px; border-radius: 12px; font-size: 13px; line-height: 1.6;
}
.qm-feedback.correct { background: #f0fdf4; border: 2px solid #bbf7d0; }
.qm-feedback.wrong   { background: #fdf2f8; border: 2px solid #fbcfe8; }
.qm-feedback span { font-weight: 800; display: block; margin-bottom: 4px; font-size: 15px; }
.qm-feedback.correct span { color: #15803d; }
.qm-feedback.wrong   span { color: #9d174d; }
.qm-feedback p { margin: 0 0 12px; color: var(--muted); }
.qm-next-btn { padding: 8px 18px; border-radius: 99px; border: none; background: var(--dark); color: #fff; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }

/* Quiz result */
.qm-result    { text-align: center; padding: 16px 0; }
.qmr-emoji    { font-size: 56px; margin-bottom: 10px; }
.qmr-title    { font-family: 'Baloo 2', cursive; font-size: 26px; font-weight: 800; margin: 0 0 6px; }
.qmr-score    { color: var(--muted); font-size: 15px; margin: 0 0 6px; }
.qmr-xp       { font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: 800; color: var(--sun); margin: 0 0 24px; }
.qmr-actions  { display: flex; gap: 10px; }
.qmr-retry    { flex: 1; padding: 11px; border-radius: 99px; border: 2.5px solid #e2e8f0; background: var(--white); color: var(--muted); font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; }
.qmr-done     { flex: 2; padding: 11px; border-radius: 99px; border: none; background: linear-gradient(135deg, var(--sun), #f97316); color: #1e1b4b; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 4px 14px rgba(245,158,11,.4); }

/* ── Modal transition ── */
.modal-enter-active, .modal-leave-active { transition: opacity .22s ease; }
.modal-enter-active .quiz-modal, .modal-leave-active .quiz-modal { transition: transform .22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .quiz-modal { transform: scale(.94) translateY(14px); }
.modal-leave-to   .quiz-modal { transform: scale(.94) translateY(14px); }

/* ── Responsive ── */
@media (max-width: 1024px) { .lesson-layout { grid-template-columns: 1fr; } .lesson-sidebar { display: grid; grid-template-columns: repeat(3, 1fr); position: static; } }
@media (max-width: 700px)  { .lesson-sidebar { grid-template-columns: 1fr; } .qm-options { grid-template-columns: 1fr; } .lnav-btn { font-size: 12px; padding: 12px 14px; } }
</style>