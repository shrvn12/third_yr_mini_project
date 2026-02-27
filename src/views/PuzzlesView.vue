<template>
  <section class="puzzles">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">🧩 Puzzles</h1>
        <p class="subtitle">Logic puzzles, drag-and-drop challenges, and code jumbles!</p>
      </div>
      <div class="header-stats">
        <div class="hstat">
          <span class="hstat-num">{{ solvedCount }}/{{ puzzles.length }}</span>
          <span class="hstat-label">solved</span>
        </div>
        <div class="hstat">
          <span class="hstat-num">{{ totalXp }}</span>
          <span class="hstat-label">XP earned</span>
        </div>
      </div>
    </div>

    <!-- Workspace -->
    <div class="workspace" :class="{ 'has-active': activePuzzle }">

      <!-- Puzzle grid -->
      <div class="puzzle-grid">
        <article
          v-for="p in puzzles" :key="p.id"
          class="card"
          :class="{ active: activePuzzle?.id === p.id, solved: p.solved, locked: p.locked }"
          @click="!p.locked && openPuzzle(p)"
        >
          <div class="card-banner" :style="{ background: p.gradient }">
            <span class="banner-icon">{{ p.icon }}</span>
            <span v-if="p.solved" class="badge-solved">✓ Solved</span>
            <span v-if="p.locked" class="badge-locked">🔒</span>
            <span v-if="p.isNew"  class="badge-new">NEW</span>
          </div>
          <div class="card-body">
            <div class="card-top">
              <h3 class="card-title">{{ p.title }}</h3>
              <span class="xp-pill">+{{ p.xp }} XP</span>
            </div>
            <p class="card-desc">{{ p.desc }}</p>
            <div class="chips">
              <span class="chip type">{{ p.type }}</span>
              <span class="chip diff" :class="p.diff.toLowerCase()">{{ diffIcon(p.diff) }} {{ p.diff }}</span>
            </div>
            <button class="solve-btn" :disabled="p.locked">
              {{ p.locked ? '🔒 Locked' : p.solved ? '↩ Retry' : p.cta }}
            </button>
          </div>
        </article>
      </div>

      <!-- Active puzzle panel -->
      <Transition name="slide-in">
        <div v-if="activePuzzle" class="puzzle-panel">

          <div class="panel-header" :style="{ background: activePuzzle.gradient }">
            <button class="close-btn" @click="closePuzzle">✕</button>
            <span class="panel-icon">{{ activePuzzle.icon }}</span>
            <h2 class="panel-title">{{ activePuzzle.title }}</h2>
            <span class="panel-xp">+{{ activePuzzle.xp }} XP</span>
          </div>

          <div class="panel-body">

            <!-- CODE UNJUMBLER -->
            <template v-if="activePuzzle.id === 1">
              <p class="instruction">{{ unjumbler.instruction }}</p>
              <div class="unjumbler">
                <div
                  v-for="(line, i) in unjumbler.lines" :key="line.id"
                  class="uj-line"
                  :class="{
                    dragging:   dragIndex === i,
                    'drag-over': dragOver === i,
                    correct:    unjumbler.checked && line.order === i,
                    wrong:      unjumbler.checked && line.order !== i
                  }"
                  draggable="true"
                  @dragstart="onDragStart(i)"
                  @dragover.prevent="dragOver = i"
                  @dragleave="dragOver = null"
                  @drop="onDrop(i)"
                  @dragend="dragOver = null"
                >
                  <span class="uj-num">{{ i + 1 }}</span>
                  <span class="uj-handle">⠿</span>
                  <code class="uj-code">{{ line.text }}</code>
                  <span v-if="unjumbler.checked" class="uj-icon">
                    {{ line.order === i ? '✓' : '✗' }}
                  </span>
                </div>
              </div>
              <div v-if="unjumbler.checked" class="uj-result" :class="unjumbler.allCorrect ? 'correct' : 'wrong'">
                {{ unjumbler.allCorrect ? '🎉 Perfect! All lines in the right order!' : '🤔 Not quite — try rearranging again!' }}
              </div>
              <div class="panel-actions">
                <button class="btn-check" @click="checkUnjumbler" :disabled="unjumbler.checked && unjumbler.allCorrect">
                  {{ unjumbler.checked ? (unjumbler.allCorrect ? '✓ Solved!' : '↩ Try Again') : '✓ Check Order' }}
                </button>
                <button class="btn-reset" @click="resetUnjumbler">🔀 Shuffle</button>
              </div>
            </template>

            <!-- BUG HUNT -->
            <template v-else-if="activePuzzle.id === 2">
              <p class="instruction">{{ bugHunt.instruction }}</p>
              <div class="bug-snippet">
                <div
                  v-for="(line, i) in bugHunt.lines" :key="i"
                  class="bug-line"
                  :class="{
                    selected:  bugHunt.selected === i,
                    correct:   bugHunt.revealed && i === bugHunt.bugLine,
                    wrong:     bugHunt.revealed && bugHunt.selected === i && i !== bugHunt.bugLine,
                    highlight: !bugHunt.revealed
                  }"
                  @click="!bugHunt.revealed && selectBugLine(i)"
                >
                  <span class="bug-ln">{{ i + 1 }}</span>
                  <code class="bug-code">{{ line }}</code>
                  <span v-if="bugHunt.revealed && i === bugHunt.bugLine" class="bug-icon">🐛</span>
                </div>
              </div>
              <div v-if="bugHunt.revealed" class="bug-explain" :class="bugHunt.selected === bugHunt.bugLine ? 'correct' : 'wrong'">
                <strong>{{ bugHunt.selected === bugHunt.bugLine ? '🎉 Found it!' : '🤔 Wrong line…' }}</strong>
                <p>{{ bugHunt.explanation }}</p>
                <code class="fix-code">Fix: {{ bugHunt.fix }}</code>
              </div>
              <div class="panel-actions">
                <button class="btn-check" @click="checkBug" :disabled="bugHunt.selected === null || bugHunt.revealed">
                  🐛 Find the Bug
                </button>
                <button class="btn-reset" @click="resetBug">↩ Reset</button>
              </div>
            </template>

            <!-- MATCH THE BLOCKS -->
            <template v-else-if="activePuzzle.id === 3">
              <p class="instruction">{{ matcher.instruction }}</p>
              <div class="matcher">
                <div class="matcher-col">
                  <p class="matcher-heading">🧱 Scratch Block</p>
                  <div
                    v-for="(item, i) in matcher.scratch" :key="'s'+i"
                    class="match-item scratch"
                    :class="{ selected: matcher.selectedScratch === i, matched: matcher.pairs[i] !== undefined }"
                    @click="selectScratch(i)"
                  >{{ item }}</div>
                </div>
                <div class="matcher-divider">
                  <div v-for="i in matcher.scratch.length" :key="i" class="divider-dot"
                    :class="{ connected: matcher.pairs[i-1] !== undefined }">
                    {{ matcher.pairs[i-1] !== undefined ? '✓' : '↔' }}
                  </div>
                </div>
                <div class="matcher-col">
                  <p class="matcher-heading">🐍 Python Code</p>
                  <div
                    v-for="(item, i) in matcher.python" :key="'p'+i"
                    class="match-item python"
                    :class="{
                      selected: matcher.selectedPython === i,
                      matched:  Object.values(matcher.pairs).includes(i)
                    }"
                    @click="selectPython(i)"
                  >{{ item }}</div>
                </div>
              </div>
              <div v-if="matcher.checked" class="match-result" :class="matcher.allCorrect ? 'correct' : 'wrong'">
                {{ matcher.allCorrect ? '🎉 All matches correct! Great job!' : '🤔 Some matches are wrong — try again!' }}
              </div>
              <div class="panel-actions">
                <button class="btn-check" @click="checkMatches"
                  :disabled="Object.keys(matcher.pairs).length < matcher.scratch.length">
                  ✓ Check Matches
                </button>
                <button class="btn-reset" @click="resetMatcher">↩ Clear All</button>
              </div>
            </template>

            <!-- OTHER PUZZLES -->
            <template v-else>
              <div class="coming-soon">
                <span>🚧</span>
                <p>This puzzle is coming soon!</p>
                <p class="coming-sub">Check back after completing more lessons.</p>
              </div>
            </template>

          </div>
        </div>
      </Transition>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

/* Puzzle catalogue */
const puzzles = reactive([
  { id:1, icon:'🔀', title:'Code Unjumbler',   desc:'Drag and drop scrambled lines into the correct order to build a working Python program.',  cta:'🔀 Unjumble!',  type:'Drag & Drop', diff:'Beginner',     xp:60,  solved:false, locked:false, isNew:false, gradient:'linear-gradient(135deg,#1e1b4b,#4338ca)' },
  { id:2, icon:'🐛', title:'Bug Hunt',          desc:'Read broken code, click the buggy line, and explain the fix to earn XP.',                   cta:'🐛 Hunt Bugs!', type:'Debugging',   diff:'Beginner',     xp:80,  solved:false, locked:false, isNew:false, gradient:'linear-gradient(135deg,#14532d,#16a34a)' },
  { id:3, icon:'🔗', title:'Match the Blocks',  desc:'Connect Scratch visual blocks on the left to their Python text equivalents on the right.',  cta:'🔗 Match Now!', type:'Matching',    diff:'Beginner',     xp:70,  solved:false, locked:false, isNew:true,  gradient:'linear-gradient(135deg,#7c2d12,#c2410c)' },
  { id:4, icon:'🔢', title:'Binary Decoder',    desc:'Decode secret messages written in 8-bit binary. Learn how computers store every letter.',   cta:'🔢 Decode!',    type:'Logic',       diff:'Intermediate', xp:90,  solved:false, locked:false, isNew:true,  gradient:'linear-gradient(135deg,#0c4a6e,#0284c7)' },
  { id:5, icon:'🏗️', title:'Flowchart Builder', desc:'Drag decision boxes, loops, and outputs to assemble a correct algorithm flowchart.',       cta:'🏗️ Build!',     type:'Visual',      diff:'Intermediate', xp:100, solved:false, locked:false, isNew:false, gradient:'linear-gradient(135deg,#701a75,#a21caf)' },
  { id:6, icon:'📬', title:'Message the Robot', desc:'Write a precise sequence of movement instructions to guide the robot to the right house.',  cta:'📬 Go Robot!',  type:'Sequencing',  diff:'Advanced',     xp:120, solved:false, locked:true,  isNew:false, gradient:'linear-gradient(135deg,#292524,#57534e)' },
])

const activePuzzle = ref(null)
const solvedCount  = computed(() => puzzles.filter(p => p.solved).length)
const totalXp      = computed(() => puzzles.filter(p => p.solved).reduce((s, p) => s + p.xp, 0))
const diffIcon     = d => ({ Beginner:'🟢', Intermediate:'🟡', Advanced:'🔴' })[d] ?? ''

function openPuzzle(p) {
  activePuzzle.value = p
  if (p.id === 1) resetUnjumbler()
  if (p.id === 2) resetBug()
  if (p.id === 3) resetMatcher()
}
function closePuzzle() { activePuzzle.value = null }

/* Puzzle 1 — Code Unjumbler */
const CORRECT_ORDER = [
  { id:'a', text:'name = input("What is your name? ")', order:0 },
  { id:'b', text:'print("Hello, " + name + "!")',       order:1 },
  { id:'c', text:'for i in range(3):',                  order:2 },
  { id:'d', text:'    print("Welcome to CodeKids!")',   order:3 },
]
const unjumbler = reactive({ lines:[], checked:false, allCorrect:false, instruction:'Drag the lines into the correct order to make a working Python program!' })
const dragIndex = ref(null)
const dragOver  = ref(null)

function resetUnjumbler() {
  unjumbler.lines      = [...CORRECT_ORDER].sort(() => Math.random() - 0.5)
  unjumbler.checked    = false
  unjumbler.allCorrect = false
}
function onDragStart(i) { dragIndex.value = i }
function onDrop(i) {
  if (dragIndex.value === null || dragIndex.value === i) return
  const arr = [...unjumbler.lines]
  const [moved] = arr.splice(dragIndex.value, 1)
  arr.splice(i, 0, moved)
  unjumbler.lines   = arr
  dragIndex.value   = null
  dragOver.value    = null
  unjumbler.checked = false
}
function checkUnjumbler() {
  if (unjumbler.checked && !unjumbler.allCorrect) { resetUnjumbler(); return }
  unjumbler.checked    = true
  unjumbler.allCorrect = unjumbler.lines.every((l, i) => l.order === i)
  if (unjumbler.allCorrect) puzzles.find(p => p.id === 1).solved = true
}

/* Puzzle 2 — Bug Hunt */
const bugHunt = reactive({
  lines: [
    'total = 0',
    'numbers = [4, 8, 15, 16, 23]',
    'for num in numbers',
    '    total = total + num',
    'print("Total:", total)',
  ],
  selected: null, revealed: false, bugLine: 2,
  explanation: 'Line 3 is missing a colon (:) at the end of the for statement. Python requires a colon to open a code block.',
  fix: 'for num in numbers:',
  instruction: 'One line has a syntax bug. Click the line you think is broken!'
})
function selectBugLine(i) { bugHunt.selected = i }
function checkBug() {
  bugHunt.revealed = true
  if (bugHunt.selected === bugHunt.bugLine) puzzles.find(p => p.id === 2).solved = true
}
function resetBug() { bugHunt.selected = null; bugHunt.revealed = false }

/* Puzzle 3 — Match the Blocks */
const matcher = reactive({
  instruction: 'Click a Scratch block, then click its Python match. Pair all 4 to win!',
  scratch: ['repeat (10)', 'say "Hello!"', 'if <touching?> then', 'set score to 0'],
  python:  ['score = 0', 'for i in range(10):', 'print("Hello!")', 'if touching:'],
  correctPairs: [1, 2, 3, 0],
  pairs: {}, selectedScratch: null, selectedPython: null,
  checked: false, allCorrect: false,
})
function selectScratch(i) {
  if (matcher.pairs[i] !== undefined) return
  matcher.selectedScratch = i
  tryPair()
}
function selectPython(i) {
  if (Object.values(matcher.pairs).includes(i)) return
  matcher.selectedPython = i
  tryPair()
}
function tryPair() {
  if (matcher.selectedScratch === null || matcher.selectedPython === null) return
  matcher.pairs = { ...matcher.pairs, [matcher.selectedScratch]: matcher.selectedPython }
  matcher.selectedScratch = null
  matcher.selectedPython  = null
  matcher.checked = false
}
function checkMatches() {
  matcher.checked    = true
  matcher.allCorrect = matcher.correctPairs.every((cp, i) => matcher.pairs[i] === cp)
  if (matcher.allCorrect) puzzles.find(p => p.id === 3).solved = true
}
function resetMatcher() {
  matcher.pairs = {}; matcher.selectedScratch = null
  matcher.selectedPython = null; matcher.checked = false; matcher.allCorrect = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.puzzles {
  --dark:   #1e1b4b; --white: #ffffff; --muted: #64748b;
  --sun:    #f59e0b; --leaf:  #22c55e; --sky:   #0ea5e9;
  --berry:  #ec4899; --radius:18px;   --shadow:0 6px 24px rgba(0,0,0,0.09);
  --mono:   'JetBrains Mono', monospace;
  font-family: 'Nunito', sans-serif;
  color: var(--dark); padding: 28px; background: #f8faff; min-height: 100vh;
}

/* Header */
.page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; }
.page-title  { font-family:'Baloo 2',cursive; font-size:32px; font-weight:800; line-height:1.1; margin-bottom:4px; }
.subtitle    { color:var(--muted); font-size:15px; }
.header-stats{ display:flex; gap:14px; }
.hstat       { display:flex; flex-direction:column; align-items:center; background:var(--white); border-radius:14px; padding:10px 20px; box-shadow:var(--shadow); }
.hstat-num   { font-family:'Baloo 2',cursive; font-size:24px; font-weight:800; color:var(--sun); line-height:1; }
.hstat-label { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; margin-top:2px; }

/* Workspace */
.workspace { display:grid; grid-template-columns:1fr; gap:22px; transition:grid-template-columns .3s ease; }
.workspace.has-active { grid-template-columns:1fr 1.1fr; }

/* Puzzle grid */
.puzzle-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; align-content:start; }

/* Card */
.card {
  background:var(--white); border-radius:var(--radius); overflow:hidden;
  box-shadow:var(--shadow); cursor:pointer; display:flex; flex-direction:column;
  border:2.5px solid transparent; transition:transform .22s, box-shadow .22s, border-color .22s;
}
.card:hover:not(.locked) { transform:translateY(-5px); box-shadow:0 14px 44px rgba(0,0,0,0.14); }
.card.active { border-color:var(--sky); box-shadow:0 0 0 3px rgba(14,165,233,.2); }
.card.solved { border-color:var(--leaf); }
.card.locked { opacity:.5; cursor:not-allowed; }

/* Banner */
.card-banner { height:110px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.banner-icon { font-size:52px; position:relative; z-index:1; filter:drop-shadow(0 3px 10px rgba(0,0,0,.3)); transition:transform .3s; }
.card:hover:not(.locked) .banner-icon { transform:scale(1.15); }
.badge-solved, .badge-locked, .badge-new {
  position:absolute; top:8px; right:10px; font-size:10px; font-weight:800;
  padding:3px 8px; border-radius:99px; text-transform:uppercase; letter-spacing:.5px;
}
.badge-solved { background:rgba(34,197,94,.85); color:#fff; }
.badge-locked { background:rgba(0,0,0,.45); color:#fff; }
.badge-new    { background:rgba(245,158,11,.9); color:#1e1b4b; }

/* Card body */
.card-body  { padding:14px 15px 16px; display:flex; flex-direction:column; flex:1; gap:7px; }
.card-top   { display:flex; align-items:flex-start; justify-content:space-between; gap:6px; }
.card-title { font-family:'Baloo 2',cursive; font-size:15px; font-weight:700; line-height:1.2; flex:1; }
.xp-pill    { background:#fef9c3; color:#854d0e; font-family:'Baloo 2',cursive; font-size:12px; font-weight:800; padding:2px 8px; border-radius:99px; white-space:nowrap; flex-shrink:0; }
.card-desc  { font-size:12px; color:var(--muted); line-height:1.5; flex:1; }
.chips      { display:flex; gap:5px; flex-wrap:wrap; }
.chip       { font-size:10px; font-weight:700; padding:3px 8px; border-radius:99px; text-transform:uppercase; letter-spacing:.4px; }
.chip.type  { background:#ede9fe; color:#6d28d9; }
.chip.diff.beginner     { background:#dcfce7; color:#15803d; }
.chip.diff.intermediate { background:#fef9c3; color:#92400e; }
.chip.diff.advanced     { background:#fee2e2; color:#b91c1c; }
.solve-btn {
  margin-top:auto; padding:9px 0; border-radius:99px; border:none; width:100%;
  font-family:'Nunito',sans-serif; font-weight:700; font-size:13px; cursor:pointer;
  background:linear-gradient(135deg,var(--sun),#f97316); color:#1e1b4b;
  box-shadow:0 3px 10px rgba(245,158,11,.35); transition:transform .15s, box-shadow .15s;
}
.solve-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 18px rgba(245,158,11,.45); }
.solve-btn:disabled { background:#e2e8f0; color:var(--muted); box-shadow:none; cursor:not-allowed; }

/* Puzzle panel */
.puzzle-panel { background:var(--white); border-radius:var(--radius); box-shadow:0 10px 40px rgba(0,0,0,.13); overflow:hidden; display:flex; flex-direction:column; position:sticky; top:20px; }
.panel-header { padding:24px 22px 20px; position:relative; display:flex; flex-direction:column; align-items:center; gap:6px; }
.close-btn    { position:absolute; top:12px; right:14px; width:28px; height:28px; border-radius:50%; border:none; background:rgba(0,0,0,.3); color:#fff; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.close-btn:hover { background:rgba(0,0,0,.5); }
.panel-icon  { font-size:52px; filter:drop-shadow(0 4px 12px rgba(0,0,0,.3)); }
.panel-title { font-family:'Baloo 2',cursive; font-size:22px; font-weight:800; color:#fff; margin:0; }
.panel-xp    { background:rgba(245,158,11,.9); color:#1e1b4b; font-family:'Baloo 2',cursive; font-size:14px; font-weight:800; padding:3px 12px; border-radius:99px; }
.panel-body  { padding:22px; overflow-y:auto; flex:1; }
.instruction { font-size:14px; color:var(--muted); margin-bottom:18px; line-height:1.6; }

/* Unjumbler */
.unjumbler { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.uj-line {
  display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:12px;
  border:2px solid #e2e8f0; background:#f8faff; cursor:grab; transition:all .18s; user-select:none;
}
.uj-line:hover        { border-color:var(--sky); background:#f0f9ff; }
.uj-line.dragging     { opacity:.4; }
.uj-line.drag-over    { border-color:var(--sun); background:#fefce8; transform:scale(1.01); }
.uj-line.correct      { border-color:var(--leaf); background:#f0fdf4; }
.uj-line.wrong        { border-color:var(--berry); background:#fdf2f8; }
.uj-num    { width:22px; height:22px; border-radius:50%; background:#e2e8f0; color:var(--muted); font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.uj-handle { color:#cbd5e1; font-size:16px; cursor:grab; }
.uj-code   { font-family:var(--mono); font-size:13px; color:#1e293b; flex:1; white-space:pre; }
.uj-icon   { font-size:16px; font-weight:800; }
.uj-line.correct .uj-icon { color:var(--leaf); }
.uj-line.wrong   .uj-icon { color:var(--berry); }
.uj-result { padding:12px 16px; border-radius:12px; font-weight:700; font-size:14px; margin-bottom:16px; }
.uj-result.correct { background:#f0fdf4; color:#15803d; border:2px solid #bbf7d0; }
.uj-result.wrong   { background:#fdf2f8; color:#9d174d; border:2px solid #fbcfe8; }

/* Bug Hunt */
.bug-snippet { border-radius:12px; overflow:hidden; border:2px solid #e2e8f0; margin-bottom:16px; }
.bug-line    { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #f1f5f9; transition:background .18s; cursor:pointer; }
.bug-line:last-child    { border-bottom:none; }
.bug-line.highlight:hover { background:#fefce8; }
.bug-line.selected      { background:#fef9c3; }
.bug-line.correct       { background:#f0fdf4; }
.bug-line.wrong         { background:#fdf2f8; }
.bug-ln   { font-family:var(--mono); font-size:11px; color:#94a3b8; width:20px; text-align:right; flex-shrink:0; }
.bug-code { font-family:var(--mono); font-size:13px; color:#1e293b; flex:1; }
.bug-icon { font-size:16px; }
.bug-explain { padding:14px 16px; border-radius:12px; margin-bottom:16px; font-size:13px; line-height:1.6; }
.bug-explain.correct { background:#f0fdf4; border:2px solid #bbf7d0; }
.bug-explain.wrong   { background:#fdf2f8; border:2px solid #fbcfe8; }
.bug-explain strong  { display:block; margin-bottom:6px; font-size:15px; }
.fix-code { display:block; margin-top:10px; padding:8px 12px; border-radius:8px; background:#0d1117; color:#6ee7b7; font-family:var(--mono); font-size:13px; }

/* Matcher */
.matcher         { display:grid; grid-template-columns:1fr 40px 1fr; gap:8px; align-items:start; margin-bottom:16px; }
.matcher-heading { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); margin-bottom:10px; }
.matcher-col     { display:flex; flex-direction:column; gap:8px; }
.match-item {
  padding:10px 14px; border-radius:12px; border:2.5px solid #e2e8f0;
  font-family:var(--mono); font-size:12px; cursor:pointer;
  transition:all .18s; background:var(--white); line-height:1.4;
}
.match-item:hover:not(.matched) { border-color:var(--sky); background:#f0f9ff; }
.match-item.selected { border-color:var(--sun); background:#fefce8; }
.match-item.matched  { border-color:var(--leaf); background:#f0fdf4; cursor:default; }
.matcher-divider { display:flex; flex-direction:column; gap:8px; align-items:center; padding-top:32px; }
.divider-dot     { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; background:#f1f5f9; color:var(--muted); transition:all .2s; }
.divider-dot.connected { background:var(--leaf); color:#fff; }
.match-result { padding:12px 16px; border-radius:12px; font-weight:700; font-size:14px; margin-bottom:16px; text-align:center; }
.match-result.correct { background:#f0fdf4; color:#15803d; border:2px solid #bbf7d0; }
.match-result.wrong   { background:#fdf2f8; color:#9d174d; border:2px solid #fbcfe8; }

/* Panel actions */
.panel-actions { display:flex; gap:10px; }
.btn-check {
  flex:2; padding:11px; border-radius:99px; border:none;
  background:linear-gradient(135deg,var(--sun),#f97316); color:#1e1b4b;
  font-family:'Nunito',sans-serif; font-weight:700; font-size:14px; cursor:pointer;
  box-shadow:0 4px 14px rgba(245,158,11,.4); transition:transform .15s, box-shadow .15s;
}
.btn-check:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 20px rgba(245,158,11,.5); }
.btn-check:disabled { background:#e2e8f0; color:var(--muted); box-shadow:none; cursor:not-allowed; }
.btn-reset {
  flex:1; padding:11px; border-radius:99px; border:2.5px solid #e2e8f0;
  background:var(--white); color:var(--muted); font-family:'Nunito',sans-serif;
  font-weight:700; font-size:13px; cursor:pointer; transition:border-color .15s;
}
.btn-reset:hover { border-color:var(--muted); }

/* Coming soon */
.coming-soon { text-align:center; padding:48px 20px; color:var(--muted); }
.coming-soon span        { font-size:48px; display:block; margin-bottom:12px; }
.coming-soon p           { font-size:16px; font-weight:700; margin-bottom:4px; }
.coming-soon .coming-sub { font-size:13px; font-weight:400; }

/* Transitions */
.slide-in-enter-active, .slide-in-leave-active { transition:opacity .25s ease, transform .25s ease; }
.slide-in-enter-from, .slide-in-leave-to       { opacity:0; transform:translateX(20px); }

/* Responsive */
@media (max-width:1100px) { .puzzle-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:860px)  { .workspace, .workspace.has-active { grid-template-columns:1fr; } .puzzle-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:500px)  { .puzzle-grid { grid-template-columns:1fr; } }
</style>