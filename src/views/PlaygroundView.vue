<template>
  <section class="playground">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">🎮 Code Playground</h1>
        <p class="subtitle">Write Python and see it run. Experiment freely!</p>
      </div>
      <div class="lang-badge">🐍 Python</div>
    </div>

    <!-- Main layout -->
    <div class="workspace">

      <!-- LEFT: Editor -->
      <div class="editor-panel">

        <!-- Editor chrome bar -->
        <div class="editor-bar">
          <div class="traffic-lights">
            <span class="tl red"></span>
            <span class="tl yellow"></span>
            <span class="tl green"></span>
          </div>
          <span class="filename">my_code.py</span>
          <span class="editor-lang">Python 3</span>
        </div>

        <!-- Textarea -->
        <div class="editor-body">
          <div class="line-numbers" aria-hidden="true">
            <span v-for="n in lineCount" :key="n">{{ n }}</span>
          </div>
          <textarea
            v-model="code"
            class="code-area"
            spellcheck="false"
            autocorrect="off"
            autocapitalize="off"
            @keydown.tab.prevent="insertTab"
          />
        </div>

        <!-- Editor footer -->
        <div class="editor-footer">
          <button class="btn run" @click="runCode" :disabled="running">
            <span v-if="running">⏳ Running…</span>
            <span v-else>▶ Run Code</span>
          </button>
          <button class="btn clear" @click="clearCode">🗑 Clear</button>
          <span class="line-count">{{ lineCount }} lines</span>
        </div>
      </div>

      <!-- RIGHT: Output + Challenges -->
      <div class="right-col">

        <!-- Output panel -->
        <div class="output-panel">
          <div class="output-bar">
            <span class="output-dot"></span>
            <span class="output-title">Output</span>
            <button class="btn-icon" @click="clearOutput" title="Clear output">✕</button>
          </div>
          <div class="output-body">
            <pre v-if="output" class="output-text">{{ output }}</pre>
            <div v-else class="output-empty">
              <span>🚀</span>
              <p>Hit <strong>Run Code</strong> to see your output here!</p>
            </div>
          </div>
        </div>

        <!-- Challenges -->
        <div class="challenges-panel">
          <h3 class="challenges-title">💡 Try a Challenge</h3>
          <div class="challenge-list">
            <button
              v-for="c in challenges"
              :key="c.label"
              class="challenge-item"
              :class="{ active: activeChallenge === c.label }"
              @click="loadChallenge(c)"
            >
              <span class="ch-icon">{{ c.icon }}</span>
              <div class="ch-info">
                <span class="ch-label">{{ c.label }}</span>
                <span class="ch-tag">{{ c.tag }}</span>
              </div>
              <span class="ch-xp">+{{ c.xp }} XP</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const STARTER = `# Welcome to the Playground! 🚀
# Write your Python code here and click Run!

name = "Shravan"
print("Hello, " + name + "!")

for i in range(1, 6):
    print("⭐" * i)
`

const code    = ref(STARTER)
const output  = ref('')
const running = ref(false)
const activeChallenge = ref(null)

const lineCount = computed(() => code.value.split('\n').length)

const challenges = [
  { icon: '🔢', label: 'Print 1 to 10',        tag: 'Loops',        xp: 40,  code: `# Print numbers 1 to 10\nfor i in range(1, 11):\n    print(i)` },
  { icon: '➕', label: 'Simple Calculator',     tag: 'Variables',    xp: 50,  code: `# Simple Calculator\na = 15\nb = 27\nprint("Sum:", a + b)\nprint("Difference:", a - b)\nprint("Product:", a * b)` },
  { icon: '🤔', label: 'Even or Odd?',          tag: 'If-Else',      xp: 60,  code: `# Even or Odd checker\nnum = 42\nif num % 2 == 0:\n    print(num, "is EVEN")\nelse:\n    print(num, "is ODD")` },
  { icon: '⭐', label: 'Star Pyramid',          tag: 'Loops',        xp: 70,  code: `# Draw a star pyramid!\nfor i in range(1, 6):\n    print("⭐" * i)` },
  { icon: '🔤', label: 'Reverse a Word',        tag: 'Strings',      xp: 80,  code: `# Reverse a string\nword = "CodeKids"\nprint("Reversed:", word[::-1])` },
]

function loadChallenge(c) {
  activeChallenge.value = c.label
  code.value = c.code
  output.value = ''
}

function insertTab(e) {
  const el  = e.target
  const s   = el.selectionStart
  const val = el.value
  code.value = val.slice(0, s) + '    ' + val.slice(s)
  // restore caret after Vue updates DOM
  setTimeout(() => { el.selectionStart = el.selectionEnd = s + 4 }, 0)
}

function clearCode() {
  code.value   = ''
  output.value = ''
  activeChallenge.value = null
}

function clearOutput() {
  output.value = ''
}

// Simulated Python runner — evaluates a safe subset client-side
function runCode() {
  running.value = true
  output.value  = ''

  setTimeout(() => {
    const lines  = []
    const src    = code.value

    // Capture print() calls for a safe preview
    const printRe = /print\(([^)]*)\)/g
    let match
    while ((match = printRe.exec(src)) !== null) {
      let arg = match[1].trim()
      // strip wrapping quotes for string literals
      if ((arg.startsWith('"') && arg.endsWith('"')) ||
          (arg.startsWith("'") && arg.endsWith("'"))) {
        lines.push(arg.slice(1, -1))
      } else {
        lines.push(`[evaluates: ${arg}]`)
      }
    }

    output.value  = lines.length
      ? lines.join('\n')
      : '# No output — try adding a print() statement!'
    running.value = false
  }, 600)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.playground {
  --dark:    #1e1b4b;
  --editor:  #0d1117;
  --bar:     #161b22;
  --border:  #30363d;
  --sky:     #0ea5e9;
  --leaf:    #22c55e;
  --sun:     #f59e0b;
  --muted:   #64748b;
  --white:   #ffffff;
  --radius:  16px;
  --shadow:  0 6px 24px rgba(0,0,0,0.10);
  --mono:    'JetBrains Mono', monospace;

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
  margin-bottom: 4px;
  line-height: 1.1;
}

.subtitle { color: var(--muted); font-size: 15px; }

.lang-badge {
  background: #1c2333;
  color: #6ee7b7;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 99px;
  border: 1px solid #30363d;
}

/* ── Workspace ── */
.workspace {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 20px;
  align-items: start;
}

/* ── Editor panel ── */
.editor-panel {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  display: flex;
  flex-direction: column;
}

.editor-bar {
  background: var(--bar);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.traffic-lights { display: flex; gap: 6px; }
.tl {
  width: 12px; height: 12px;
  border-radius: 50%;
}
.tl.red    { background: #ff5f57; }
.tl.yellow { background: #febc2e; }
.tl.green  { background: #28c840; }

.filename {
  flex: 1;
  color: #8b949e;
  font-family: var(--mono);
  font-size: 13px;
}

.editor-lang {
  color: #58a6ff;
  font-family: var(--mono);
  font-size: 11px;
  background: rgba(88,166,255,0.1);
  padding: 2px 8px;
  border-radius: 6px;
}

/* ── Editor body ── */
.editor-body {
  background: var(--editor);
  display: flex;
  min-height: 300px;
}

.line-numbers {
  padding: 18px 0;
  min-width: 44px;
  background: #0d1117;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 12px;
  padding-left: 8px;
  gap: 0;
  user-select: none;
}

.line-numbers span {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.75;
  color: #484f58;
}

.code-area {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e6edf3;
  font-family: var(--mono);
  font-size: 13.5px;
  line-height: 1.75;
  padding: 18px 16px;
  resize: none;
  min-height: 300px;
  tab-size: 4;
  caret-color: #58a6ff;
}

.code-area::selection { background: rgba(88,166,255,0.25); }

/* ── Editor footer ── */
.editor-footer {
  background: var(--bar);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 99px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}

.btn.run {
  background: linear-gradient(135deg, var(--leaf), #16a34a);
  color: var(--white);
  box-shadow: 0 3px 12px rgba(34,197,94,0.4);
}

.btn.run:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(34,197,94,0.5);
}

.btn.run:disabled { opacity: 0.6; cursor: not-allowed; }

.btn.clear {
  background: rgba(255,255,255,0.07);
  color: #8b949e;
  border: 1px solid var(--border);
}

.btn.clear:hover { background: rgba(255,255,255,0.12); color: #e6edf3; }

.line-count {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 11px;
  color: #484f58;
}

/* ── Right column ── */
.right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Output panel ── */
.output-panel {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}

.output-bar {
  background: #022c22;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #064e3b;
}

.output-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--leaf);
  box-shadow: 0 0 8px rgba(34,197,94,0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.4; }
}

.output-title {
  color: #6ee7b7;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  flex: 1;
}

.btn-icon {
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s;
}

.btn-icon:hover { color: #6ee7b7; }

.output-body {
  background: #011a14;
  min-height: 160px;
  padding: 18px;
}

.output-text {
  font-family: var(--mono);
  font-size: 13.5px;
  color: #6ee7b7;
  line-height: 1.75;
  white-space: pre-wrap;
  margin: 0;
}

.output-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  text-align: center;
  gap: 8px;
}

.output-empty span { font-size: 32px; }
.output-empty p { font-size: 13px; color: #374151; font-family: var(--mono); }
.output-empty strong { color: var(--leaf); }

/* ── Challenges panel ── */
.challenges-panel {
  background: var(--white);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow);
}

.challenges-title {
  font-family: 'Baloo 2', cursive;
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--dark);
}

.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.challenge-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8faff;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  text-align: left;
  font-family: 'Nunito', sans-serif;
  transition: all 0.18s;
  width: 100%;
}

.challenge-item:hover {
  border-color: var(--sky);
  background: #f0f9ff;
  transform: translateX(3px);
}

.challenge-item.active {
  border-color: var(--sun);
  background: #fefce8;
}

.ch-icon { font-size: 22px; flex-shrink: 0; }

.ch-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ch-label {
  font-weight: 700;
  font-size: 14px;
  color: var(--dark);
}

.ch-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.ch-xp {
  font-family: 'Baloo 2', cursive;
  font-size: 14px;
  font-weight: 800;
  color: var(--sun);
  white-space: nowrap;
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .workspace { grid-template-columns: 1fr; }
}
</style>