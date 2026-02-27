<template>
  <section class="quizzes">

    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">🧠 Quizzes</h1>
        <p class="subtitle">Test what you know. Earn XP with every correct answer!</p>
      </div>
      <div class="header-stats">
        <div class="hstat">
          <span class="hstat-num">{{ totalXpEarned }}</span>
          <span class="hstat-label">XP earned</span>
        </div>
        <div class="hstat">
          <span class="hstat-num">{{ quizzesDone }}/{{ quizList.length }}</span>
          <span class="hstat-label">completed</span>
        </div>
      </div>
    </div>

    <div class="workspace">

      <!-- LEFT: Active quiz or result screen -->
      <div class="quiz-col">

        <!-- Result screen -->
        <Transition name="fade" mode="out-in">
          <div v-if="showResult" class="result-card" key="result">
            <div class="result-emoji">{{ resultEmoji }}</div>
            <h2 class="result-title">{{ resultTitle }}</h2>
            <p class="result-sub">You scored <strong>{{ score }}/{{ activeQuiz.questions.length }}</strong> correct</p>
            <div class="result-xp">+{{ xpEarned }} XP earned!</div>
            <div class="result-bar-wrap">
              <div class="result-bar">
                <div class="result-bar-fill" :style="{ width: scorePercent + '%' }"></div>
              </div>
              <span class="result-pct">{{ scorePercent }}%</span>
            </div>
            <div class="result-actions">
              <button class="btn-retry" @click="retryQuiz">↩ Try Again</button>
              <button class="btn-next"  @click="closeQuiz">✓ Back to Quizzes</button>
            </div>
          </div>

          <!-- Active quiz -->
          <div v-else-if="activeQuiz" class="quiz-card" key="quiz">

            <!-- Quiz meta bar -->
            <div class="quiz-meta-bar">
              <span class="quiz-unit-tag">{{ activeQuiz.unit }}</span>
              <span class="quiz-counter">{{ currentIndex + 1 }} / {{ activeQuiz.questions.length }}</span>
              <span class="quiz-xp-live">⭐ {{ xpEarned }} XP</span>
            </div>

            <!-- Progress dots -->
            <div class="progress-dots" role="progressbar">
              <span
                v-for="(q, i) in activeQuiz.questions" :key="i"
                class="dot"
                :class="{
                  done:    answers[i] !== undefined,
                  current: i === currentIndex,
                  correct: answers[i] === q.correct,
                  wrong:   answers[i] !== undefined && answers[i] !== q.correct
                }"
              ></span>
            </div>

            <!-- Question -->
            <p class="question-text">{{ currentQ.text }}</p>

            <!-- Options -->
            <div class="options-grid">
              <button
                v-for="(opt, i) in currentQ.options" :key="i"
                class="option"
                :class="optionClass(i)"
                :disabled="answered"
                @click="selectAnswer(i)"
              >
                <span class="opt-letter">{{ letters[i] }}</span>
                <span class="opt-text">{{ opt }}</span>
                <span v-if="answered && i === currentQ.correct" class="opt-icon correct-icon">✓</span>
                <span v-else-if="answered && i === selected && i !== currentQ.correct" class="opt-icon wrong-icon">✗</span>
              </button>
            </div>

            <!-- Feedback banner -->
            <Transition name="slide-up">
              <div v-if="answered" class="feedback-banner" :class="isCorrect ? 'correct' : 'wrong'">
                <span class="feedback-emoji">{{ isCorrect ? '🎉' : '💡' }}</span>
                <div>
                  <p class="feedback-title">{{ isCorrect ? 'Correct!' : 'Not quite…' }}</p>
                  <p class="feedback-sub">{{ currentQ.explanation }}</p>
                </div>
                <button class="btn-next-q" @click="nextQuestion">
                  {{ isLastQuestion ? 'See Results →' : 'Next →' }}
                </button>
              </div>
            </Transition>

          </div>

          <!-- Empty / pick a quiz -->
          <div v-else class="pick-prompt" key="pick">
            <span>👈</span>
            <p>Pick a quiz from the list to get started!</p>
          </div>
        </Transition>

      </div>

      <!-- RIGHT: Quiz list -->
      <div class="list-col">
        <h3 class="list-title">Available Quizzes</h3>

        <div class="quiz-list">
          <button
            v-for="q in quizList" :key="q.id"
            class="quiz-item"
            :class="{
              active:  activeQuiz?.id === q.id,
              locked:  q.locked,
              done:    q.done
            }"
            :disabled="q.locked"
            @click="startQuiz(q)"
          >
            <span class="qi-icon">{{ q.icon }}</span>
            <div class="qi-info">
              <span class="qi-name">{{ q.name }}</span>
              <span class="qi-sub">{{ q.questions.length }} questions · {{ q.xpTotal }} XP</span>
            </div>
            <div class="qi-right">
              <span v-if="q.locked"  class="qi-status locked-icon">🔒</span>
              <span v-else-if="q.done" class="qi-status done-icon">✅</span>
              <span v-else            class="qi-status">▶</span>
            </div>
          </button>

          <!-- Daily challenge -->
          <div class="daily-card">
            <div class="daily-top">
              <span class="daily-icon">⚡</span>
              <div>
                <p class="daily-title">Daily Challenge</p>
                <p class="daily-sub">3 surprise questions · resets daily</p>
              </div>
              <span class="daily-xp">+50 XP</span>
            </div>
            <button class="daily-btn" @click="startQuiz(dailyQuiz)">Start Challenge →</button>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const letters = ['A', 'B', 'C', 'D']

/* ── Quiz data ── */
const quizList = ref([
  {
    id: 1, icon: '💻', name: 'Unit 1 · Computer Basics', unit: 'UNIT 1',
    xpTotal: 100, done: true, locked: false,
    questions: [
      { text: 'Which part of a computer processes all instructions?', options: ['Monitor', 'CPU', 'Keyboard', 'Speaker'], correct: 1, explanation: 'The CPU (Central Processing Unit) is the brain of the computer — it processes all instructions.' },
      { text: 'What does "WWW" stand for?', options: ['World Wide Web', 'Wide World Web', 'World Web World', 'Web Wide World'], correct: 0, explanation: 'WWW stands for World Wide Web — the system of linked pages on the internet.' },
      { text: 'Which of these is an INPUT device?', options: ['Monitor', 'Speaker', 'Mouse', 'Printer'], correct: 2, explanation: 'A mouse sends data INTO the computer, making it an input device. Monitors and speakers are output devices.' },
      { text: 'What is a file extension used for?', options: ['To name the file', 'To tell the OS what type of file it is', 'To lock the file', 'To copy the file'], correct: 1, explanation: 'File extensions like .txt, .jpg, or .py tell the operating system what kind of file it is.' },
    ]
  },
  {
    id: 2, icon: '🤖', name: 'Unit 2 · Algorithms', unit: 'UNIT 2',
    xpTotal: 80, done: true, locked: false,
    questions: [
      { text: 'What is an algorithm?', options: ['A type of computer', 'A step-by-step set of instructions', 'A programming language', 'A file format'], correct: 1, explanation: 'An algorithm is a precise, step-by-step set of instructions to solve a problem.' },
      { text: 'Which word best describes "decomposition" in computing?', options: ['Sorting data', 'Breaking a problem into smaller parts', 'Repeating a task', 'Storing information'], correct: 1, explanation: 'Decomposition means breaking a big, complex problem down into smaller, manageable parts.' },
      { text: 'A flowchart diamond shape represents:', options: ['A start/end point', 'A process step', 'A decision (yes/no)', 'A data store'], correct: 2, explanation: 'Diamond shapes in flowcharts represent decision points — a question with a yes or no answer.' },
    ]
  },
  {
    id: 3, icon: '🔄', name: 'Unit 3 · Loops & Logic', unit: 'UNIT 3',
    xpTotal: 150, done: false, locked: false,
    questions: [
      { text: 'What does a `for` loop do in Python?', options: ['Stops the program', 'Repeats code a set number of times', 'Asks the user a question', 'Prints text once only'], correct: 1, explanation: 'A for loop repeats a block of code for each item in a sequence — great for counting or lists!' },
      { text: 'How many times does this loop run?\n`for i in range(5):`', options: ['4 times', '5 times', '6 times', '1 time'], correct: 1, explanation: 'range(5) produces numbers 0, 1, 2, 3, 4 — so the loop body runs exactly 5 times.' },
      { text: 'Which keyword starts a conditional check in Python?', options: ['loop', 'when', 'if', 'check'], correct: 2, explanation: 'The `if` keyword starts a conditional block. Python checks the condition and runs the code only when it is True.' },
      { text: 'What does `else` do in an if-else block?', options: ['Repeats the if block', 'Runs when the if condition is False', 'Stops the program', 'Defines a variable'], correct: 1, explanation: 'The `else` block runs when the `if` condition evaluates to False — it\'s the fallback path.' },
      { text: 'What is an infinite loop?', options: ['A loop that runs 1000 times', 'A loop that never stops', 'A loop inside a function', 'A loop without a variable'], correct: 1, explanation: 'An infinite loop has a condition that is always True, so it never stops — usually a bug to avoid!' },
    ]
  },
  {
    id: 4, icon: '🐍', name: 'Unit 4 · Python Basics', unit: 'UNIT 4',
    xpTotal: 200, done: false, locked: true,
    questions: []
  },
])

const dailyQuiz = {
  id: 99, icon: '⚡', name: 'Daily Challenge', unit: 'DAILY',
  xpTotal: 50, done: false, locked: false,
  questions: [
    { text: 'What symbol is used for comments in Python?', options: ['// comment', '/* comment */', '# comment', '-- comment'], correct: 2, explanation: 'In Python, the # symbol starts a comment. Anything after it on that line is ignored by the interpreter.' },
    { text: 'Which data type stores True or False?', options: ['String', 'Integer', 'Boolean', 'Float'], correct: 2, explanation: 'A Boolean can only be True or False — perfect for conditions and flags.' },
    { text: 'What does `print("Hello")` do?', options: ['Stores "Hello"', 'Deletes "Hello"', 'Displays "Hello" on screen', 'Asks for input'], correct: 2, explanation: 'print() outputs whatever is inside the brackets to the screen — the most basic output function in Python.' },
  ]
}

/* ── State ── */
const activeQuiz    = ref(null)
const currentIndex  = ref(0)
const answers       = ref([])
const selected      = ref(null)
const answered      = ref(false)
const showResult    = ref(false)

/* ── Computed ── */
const currentQ       = computed(() => activeQuiz.value?.questions[currentIndex.value])
const isCorrect      = computed(() => selected.value === currentQ.value?.correct)
const isLastQuestion = computed(() => currentIndex.value === (activeQuiz.value?.questions.length ?? 0) - 1)

const score = computed(() =>
  answers.value.filter((a, i) => a === activeQuiz.value?.questions[i]?.correct).length
)

const scorePercent = computed(() =>
  activeQuiz.value ? Math.round((score.value / activeQuiz.value.questions.length) * 100) : 0
)

const xpEarned = computed(() => {
  if (!activeQuiz.value) return 0
  const perQ = Math.floor(activeQuiz.value.xpTotal / activeQuiz.value.questions.length)
  return score.value * perQ
})

const resultEmoji = computed(() => {
  if (scorePercent.value === 100) return '🏆'
  if (scorePercent.value >= 60)  return '🎉'
  return '💪'
})

const resultTitle = computed(() => {
  if (scorePercent.value === 100) return 'Perfect Score!'
  if (scorePercent.value >= 80)  return 'Great Job!'
  if (scorePercent.value >= 60)  return 'Good Effort!'
  return 'Keep Practicing!'
})

const quizzesDone  = computed(() => quizList.value.filter(q => q.done).length)
const totalXpEarned = computed(() => quizList.value.filter(q => q.done).reduce((s, q) => s + q.xpTotal, 0))

/* ── Methods ── */
function startQuiz(q) {
  if (q.locked || !q.questions.length) return
  activeQuiz.value   = q
  currentIndex.value = 0
  answers.value      = []
  selected.value     = null
  answered.value     = false
  showResult.value   = false
}

function selectAnswer(i) {
  if (answered.value) return
  selected.value = i
  answered.value = true
  answers.value  = [...answers.value, i]
}

function nextQuestion() {
  if (isLastQuestion.value) {
    showResult.value = true
    const q = quizList.value.find(x => x.id === activeQuiz.value?.id)
    if (q && scorePercent.value >= 60) q.done = true
  } else {
    currentIndex.value++
    selected.value = null
    answered.value = false
  }
}

function retryQuiz() {
  startQuiz(activeQuiz.value)
}

function closeQuiz() {
  showResult.value  = false
  activeQuiz.value  = null
}

function optionClass(i) {
  if (!answered.value) return ''
  if (i === currentQ.value.correct)                             return 'correct'
  if (i === selected.value && i !== currentQ.value.correct)    return 'wrong'
  return 'dimmed'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');

.quizzes {
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
  margin-bottom: 28px;
}
.page-title {
  font-family: 'Baloo 2', cursive;
  font-size: 32px; font-weight: 800;
  line-height: 1.1; margin-bottom: 4px;
}
.subtitle { color: var(--muted); font-size: 15px; }
.header-stats { display: flex; gap: 14px; }
.hstat {
  display: flex; flex-direction: column; align-items: center;
  background: var(--white); border-radius: 14px;
  padding: 10px 20px; box-shadow: var(--shadow);
}
.hstat-num {
  font-family: 'Baloo 2', cursive; font-size: 24px;
  font-weight: 800; color: var(--sun); line-height: 1;
}
.hstat-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; margin-top: 2px; }

/* ── Workspace ── */
.workspace {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 22px;
  align-items: start;
}

/* ── Quiz column ── */
.quiz-col { display: flex; flex-direction: column; }

/* ── Quiz card ── */
.quiz-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow);
}

/* meta bar */
.quiz-meta-bar {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px;
}
.quiz-unit-tag {
  font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 1px; padding: 3px 10px; border-radius: 99px;
  background: #ede9fe; color: #6d28d9;
}
.quiz-counter {
  font-size: 13px; font-weight: 700; color: var(--muted); flex: 1;
}
.quiz-xp-live {
  font-family: 'Baloo 2', cursive; font-size: 14px; font-weight: 800; color: var(--sun);
}

/* progress dots */
.progress-dots {
  display: flex; gap: 6px; margin-bottom: 22px;
}
.dot {
  flex: 1; height: 8px; border-radius: 99px;
  background: #e2e8f0; transition: background 0.25s;
}
.dot.current { background: var(--sky); }
.dot.correct { background: var(--leaf); }
.dot.wrong   { background: var(--berry); }
.dot.done:not(.correct):not(.wrong) { background: #94a3b8; }

/* question */
.question-text {
  font-family: 'Baloo 2', cursive;
  font-size: 20px; font-weight: 700;
  line-height: 1.45; margin-bottom: 22px;
  color: var(--dark);
  white-space: pre-line;
}

/* options */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 0;
}
.option {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 14px;
  border: 2.5px solid #e2e8f0;
  background: var(--white);
  cursor: pointer; text-align: left;
  font-family: 'Nunito', sans-serif;
  font-size: 14px; font-weight: 600;
  transition: all 0.18s; width: 100%;
  color: var(--dark);
}
.option:hover:not(:disabled) {
  border-color: var(--sky); background: #f0f9ff;
  transform: translateY(-2px);
}
.option:disabled { cursor: not-allowed; }
.option.correct  { border-color: var(--leaf); background: #f0fdf4; color: #15803d; }
.option.wrong    { border-color: var(--berry); background: #fdf2f8; color: #be185d; }
.option.dimmed   { opacity: 0.4; }

.opt-letter {
  width: 28px; height: 28px; border-radius: 50%;
  background: #f1f5f9; color: var(--muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; flex-shrink: 0;
}
.option.correct .opt-letter { background: var(--leaf); color: #fff; }
.option.wrong   .opt-letter { background: var(--berry); color: #fff; }

.opt-text { flex: 1; }
.opt-icon { font-size: 16px; font-weight: 800; flex-shrink: 0; }
.correct-icon { color: var(--leaf); }
.wrong-icon   { color: var(--berry); }

/* feedback banner */
.feedback-banner {
  display: flex; align-items: center; gap: 14px;
  margin-top: 18px; padding: 16px 18px;
  border-radius: 14px;
}
.feedback-banner.correct { background: #f0fdf4; border: 2px solid #bbf7d0; }
.feedback-banner.wrong   { background: #fdf2f8; border: 2px solid #fbcfe8; }
.feedback-emoji { font-size: 28px; flex-shrink: 0; }
.feedback-title {
  font-family: 'Baloo 2', cursive; font-size: 16px; font-weight: 800;
  margin-bottom: 2px;
}
.feedback-banner.correct .feedback-title { color: #15803d; }
.feedback-banner.wrong   .feedback-title { color: #9d174d; }
.feedback-sub { font-size: 13px; color: var(--muted); line-height: 1.5; flex: 1; }
.btn-next-q {
  padding: 9px 18px; border-radius: 99px; border: none;
  background: var(--dark); color: var(--white);
  font-family: 'Nunito', sans-serif; font-weight: 700;
  font-size: 13px; cursor: pointer; white-space: nowrap;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.btn-next-q:hover { opacity: 0.85; }

/* ── Result card ── */
.result-card {
  background: var(--white); border-radius: var(--radius);
  padding: 40px 32px; box-shadow: var(--shadow);
  text-align: center;
}
.result-emoji { font-size: 64px; margin-bottom: 12px; }
.result-title {
  font-family: 'Baloo 2', cursive; font-size: 28px; font-weight: 800;
  margin-bottom: 6px;
}
.result-sub { color: var(--muted); font-size: 15px; margin-bottom: 14px; }
.result-xp {
  font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: 800;
  color: var(--sun); margin-bottom: 18px;
}
.result-bar-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.result-bar {
  flex: 1; height: 12px; background: #f1f5f9;
  border-radius: 99px; overflow: hidden;
}
.result-bar-fill {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, var(--sky), var(--leaf));
  transition: width 0.8s ease;
}
.result-pct { font-family: 'Baloo 2', cursive; font-size: 18px; font-weight: 800; color: var(--dark); }
.result-actions { display: flex; gap: 12px; }
.btn-retry {
  flex: 1; padding: 12px; border-radius: 99px;
  border: 2.5px solid #e2e8f0; background: var(--white);
  color: var(--muted); font-family: 'Nunito', sans-serif;
  font-weight: 700; font-size: 14px; cursor: pointer;
  transition: border-color 0.15s;
}
.btn-retry:hover { border-color: var(--muted); }
.btn-next {
  flex: 2; padding: 12px; border-radius: 99px; border: none;
  background: linear-gradient(135deg, var(--sun), #f97316);
  color: #1e1b4b; font-family: 'Nunito', sans-serif;
  font-weight: 700; font-size: 14px; cursor: pointer;
  box-shadow: 0 4px 14px rgba(245,158,11,0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-next:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }

/* ── Pick prompt ── */
.pick-prompt {
  background: var(--white); border-radius: var(--radius);
  padding: 60px 32px; box-shadow: var(--shadow);
  text-align: center; color: var(--muted);
}
.pick-prompt span { font-size: 48px; display: block; margin-bottom: 12px; }
.pick-prompt p    { font-size: 16px; font-weight: 600; }

/* ── Quiz list ── */
.list-col { display: flex; flex-direction: column; }
.list-title {
  font-family: 'Baloo 2', cursive; font-size: 20px; font-weight: 800;
  margin-bottom: 14px;
}
.quiz-list { display: flex; flex-direction: column; gap: 10px; }

.quiz-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 14px;
  border: 2.5px solid #e2e8f0; background: var(--white);
  cursor: pointer; text-align: left; width: 100%;
  font-family: 'Nunito', sans-serif;
  transition: all 0.18s; box-shadow: var(--shadow);
}
.quiz-item:hover:not(:disabled) { border-color: var(--sky); transform: translateX(3px); }
.quiz-item.active  { border-color: var(--sky); background: #f0f9ff; }
.quiz-item.done    { border-color: #bbf7d0; background: #f0fdf4; }
.quiz-item.locked  { opacity: 0.5; cursor: not-allowed; }

.qi-icon { font-size: 28px; flex-shrink: 0; }
.qi-info { display: flex; flex-direction: column; flex: 1; gap: 2px; }
.qi-name { font-weight: 700; font-size: 14px; color: var(--dark); }
.qi-sub  { font-size: 12px; color: var(--muted); }
.qi-right { flex-shrink: 0; }
.qi-status { font-size: 18px; }
.locked-icon { opacity: 0.5; }

/* daily card */
.daily-card {
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border-radius: 16px; padding: 18px;
  box-shadow: 0 8px 24px rgba(30,27,75,0.3);
}
.daily-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.daily-icon { font-size: 28px; }
.daily-title { font-weight: 800; font-size: 15px; color: var(--white); }
.daily-sub   { font-size: 12px; color: rgba(255,255,255,0.5); }
.daily-xp {
  margin-left: auto; font-family: 'Baloo 2', cursive;
  font-size: 16px; font-weight: 800; color: var(--sun);
}
.daily-btn {
  width: 100%; padding: 10px; border-radius: 99px; border: none;
  background: linear-gradient(135deg, var(--sun), #f97316);
  color: #1e1b4b; font-family: 'Nunito', sans-serif;
  font-weight: 700; font-size: 13px; cursor: pointer;
  box-shadow: 0 4px 14px rgba(245,158,11,0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}
.daily-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(245,158,11,0.5); }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; transform: translateY(8px); }

.slide-up-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(10px); }

/* ── Responsive ── */
@media (max-width: 860px) { .workspace { grid-template-columns: 1fr; } }
@media (max-width: 500px) { .options-grid { grid-template-columns: 1fr; } }
</style>