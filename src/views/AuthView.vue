<template>
  <div class="auth-page">

    <!-- Background -->
    <div class="auth-bg" aria-hidden="true">
      <div class="bg-orb bo1"></div>
      <div class="bg-orb bo2"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- Left panel -->
    <div class="auth-left">
      <RouterLink to="/" class="back-link">← Back to home</RouterLink>

      <div class="left-content">
        <div class="left-brand">
          <span class="lb-icon">🚀</span>
          <span class="lb-text">Code<strong>Kids</strong></span>
        </div>

        <h2 class="left-title">
          {{ isLogin ? 'Welcome back,\nyoung coder! 👋' : 'Join 12,000+\nkids learning to code! 🚀' }}
        </h2>
        <p class="left-sub">
          {{ isLogin
            ? 'Log in to continue your learning journey and keep your streak alive!'
            : 'Start learning programming through games, puzzles, and challenges — completely free.' }}
        </p>

        <!-- Feature pills -->
        <div class="left-pills">
          <div class="pill-item" v-for="p in pills" :key="p">
            <span class="pill-check">✓</span>{{ p }}
          </div>
        </div>

        <!-- Testimonial -->
        <div class="left-testi">
          <div class="lt-stars">★★★★★</div>
          <p class="lt-quote">"My students went from never touching a computer to writing Python in 3 months."</p>
          <p class="lt-author">— Priya Madam, Rajasthan Govt. School</p>
        </div>
      </div>
    </div>

    <!-- Right panel: form -->
    <div class="auth-right">
      <div class="form-card">

        <!-- Tab switcher -->
        <div class="form-tabs">
          <button class="ftab" :class="{ active: isLogin }" @click="isLogin = true">Log In</button>
          <button class="ftab" :class="{ active: !isLogin }" @click="isLogin = false">Sign Up</button>
          <div class="tab-indicator" :style="{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }"></div>
        </div>

        <!-- Login form -->
        <Transition name="form-fade" mode="out-in">
          <form v-if="isLogin" class="auth-form" key="login" @submit.prevent="handleLogin">
            <div class="form-greeting">
              <p class="fg-title">Good to see you again!</p>
              <p class="fg-sub">Enter your details to continue your journey.</p>
            </div>

            <div class="field">
              <label class="field-label">Student ID or Name</label>
              <div class="field-wrap">
                <span class="field-icon">👤</span>
                <input v-model="loginForm.studentId" class="field-input" type="text" placeholder="Your name or student ID" required />
              </div>
            </div>

            <div class="field">
              <label class="field-label">Password</label>
              <div class="field-wrap">
                <span class="field-icon">🔑</span>
                <input v-model="loginForm.password" class="field-input"
                  :type="showPwd ? 'text' : 'password'"
                  placeholder="Your password" required />
                <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="form-extras">
              <label class="remember-row">
                <input type="checkbox" v-model="loginForm.remember" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="btn-submit" :class="{ loading: submitting }">
              <span v-if="!submitting">Log In to CodeKids →</span>
              <span v-else class="spinner">⏳ Logging in…</span>
            </button>

            <p class="form-switch">
              New here?
              <button type="button" class="switch-link" @click="isLogin = false">Create a free account</button>
            </p>
          </form>

          <!-- Signup form -->
          <form v-else class="auth-form" key="signup" @submit.prevent="handleSignup">
            <div class="form-greeting">
              <p class="fg-title">Let's get you started!</p>
              <p class="fg-sub">It only takes 30 seconds. No email needed.</p>
            </div>

            <!-- Avatar picker -->
            <div class="field">
              <label class="field-label">Pick your avatar</label>
              <div class="avatar-row">
                <button
                  type="button"
                  v-for="av in avatars" :key="av"
                  class="av-opt"
                  :class="{ selected: signupForm.avatar === av }"
                  @click="signupForm.avatar = av"
                >{{ av }}</button>
              </div>
            </div>

            <div class="fields-row">
              <div class="field">
                <label class="field-label">Your Name</label>
                <div class="field-wrap">
                  <span class="field-icon">✏️</span>
                  <input v-model="signupForm.name" class="field-input" type="text" placeholder="First name" required />
                </div>
              </div>
              <div class="field">
                <label class="field-label">Grade</label>
                <div class="field-wrap">
                  <span class="field-icon">📚</span>
                  <select v-model="signupForm.grade" class="field-input field-select" required>
                    <option value="" disabled>Select</option>
                    <option v-for="g in [3,4,5,6,7,8]" :key="g" :value="g">Grade {{ g }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="field-label">School Name</label>
              <div class="field-wrap">
                <span class="field-icon">🏫</span>
                <input v-model="signupForm.school" class="field-input" type="text" placeholder="Your school name" required />
              </div>
            </div>

            <div class="field">
              <label class="field-label">Create a Password</label>
              <div class="field-wrap">
                <span class="field-icon">🔑</span>
                <input v-model="signupForm.password" class="field-input"
                  :type="showPwd ? 'text' : 'password'"
                  placeholder="At least 6 characters" required minlength="6" />
                <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
              <!-- Password strength -->
              <div class="pwd-strength" v-if="signupForm.password">
                <div class="ps-bars">
                  <div class="ps-bar" :class="{ active: pwdStrength >= 1 }"></div>
                  <div class="ps-bar" :class="{ active: pwdStrength >= 2 }"></div>
                  <div class="ps-bar" :class="{ active: pwdStrength >= 3 }"></div>
                </div>
                <span class="ps-label" :class="pwdStrengthLabel.toLowerCase()">{{ pwdStrengthLabel }}</span>
              </div>
            </div>

            <button type="submit" class="btn-submit" :class="{ loading: submitting }">
              <span v-if="!submitting">Create My Account →</span>
              <span v-else class="spinner">⏳ Creating account…</span>
            </button>

            <p class="form-terms">
              By signing up you agree to our
              <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </p>

            <p class="form-switch">
              Already have an account?
              <button type="button" class="switch-link" @click="isLogin = true">Log in</button>
            </p>
          </form>
        </Transition>

        <!-- Success overlay -->
        <Transition name="pop">
          <div v-if="success" class="success-overlay">
            <div class="success-inner">
              <div class="success-icon">🎉</div>
              <h3>{{ isLogin ? 'Welcome back!' : 'Account created!' }}</h3>
              <p>Taking you to your dashboard…</p>
              <div class="success-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </Transition>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route  = useRoute()
const toast = useToast();

const isLogin   = ref(route.query.mode !== 'signup')
const showPwd   = ref(false)
const submitting = ref(false)
const success    = ref(false)

const loginForm = ref({ studentId:'', password:'', remember:false })
const signupForm = ref({ name:'', grade:'', school:'', password:'', avatar:'🐱' })

const apiUrl = import.meta.env.VITE_API_URL;

const avatars = ['🐱','🦁','🐸','🦊','🐘','🐬','🦋','🌻','🐯','🦄','🐺','🦉']

const pills = [
  'Free for all government schools',
  '6 units · 42 structured lessons',
  'Games, quizzes & coding puzzles',
  'Track progress & earn badges',
]

const pwdStrength = computed(() => {
  const p = signupForm.value.password
  let s = 0
  if (p.length >= 6) s++
  if (/[A-Z]/.test(p) || /[0-9]/.test(p)) s++
  if (p.length >= 10 && /[^a-zA-Z0-9]/.test(p)) s++
  return s
})
const pwdStrengthLabel = computed(() => ['Weak','Medium','Strong'][pwdStrength.value - 1] ?? 'Weak')

async function handleLogin() {
    // console.log(apiUrl);
    // console.log('Login', JSON.stringify(loginForm.value))
    submitting.value = true
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value),
      credentials: 'include' // to include cookies for session
    }).then(async (r) => {
        let ok = r.ok;
        const data = await r.json();
        submitting.value = false
        if (ok){
            console.log('Login successful:', data);
            success.value = true
            router.push('/home')
        } else {
            toast.error(data.message || data.msg || 'Login failed. Please try again.');
            console.log('Login failed:', data);
        }
        return data;
    }).catch((e) => {
        console.error('Login error:', e);
        toast.error('An error occurred. Please try again.');
        submitting.value = false
    });

    // console.log('Login response:', res)
    //   submitting.value = true
    //   await new Promise(r => setTimeout(r, 1000))
    //   submitting.value = false
    //   success.value = true
    //   setTimeout(() => router.push('/home'), 1400)
}

async function handleSignup() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  submitting.value = false
  success.value = true
  setTimeout(() => router.push('/'), 1400)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap');

.auth-page {
  --dark:   #1e1b4b; --white:  #ffffff; --muted:  #64748b;
  --sun:    #f59e0b; --leaf:   #22c55e; --sky:    #0ea5e9;
  --berry:  #ec4899; --grape:  #8b5cf6;
  font-family: 'Nunito', sans-serif;
  display:grid; grid-template-columns:1fr 1fr;
  min-height:100vh; position:relative; overflow:hidden;
  background:#0d0a2e;
}

/* ── Background ── */
.auth-bg { position:fixed; inset:0; pointer-events:none; z-index:0; }
.bg-orb  { position:absolute; border-radius:50%; filter:blur(80px); }
.bo1 { width:500px; height:500px; background:radial-gradient(circle,rgba(67,56,202,.5),transparent); top:-100px; left:-100px; animation:sway1 14s ease-in-out infinite; }
.bo2 { width:400px; height:400px; background:radial-gradient(circle,rgba(236,72,153,.35),transparent); bottom:-80px; right:-80px; animation:sway2 18s ease-in-out infinite; }
.bg-grid {
  position:absolute; inset:0;
  background-image:linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,.03) 1px, transparent 1px);
  background-size:48px 48px;
}
@keyframes sway1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,40px)} }
@keyframes sway2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-30px)} }

/* ── Left panel ── */
.auth-left {
  position:relative; z-index:1;
  padding:32px 52px;
  display:flex; flex-direction:column;
  border-right:1px solid rgba(255,255,255,.07);
}
.back-link {
  color:rgba(255,255,255,.45); font-size:14px; font-weight:700;
  text-decoration:none; margin-bottom:40px; display:inline-block;
  transition:color .2s;
}
.back-link:hover { color:var(--white); }

.left-content { flex:1; display:flex; flex-direction:column; justify-content:center; max-width:440px; }

.left-brand { display:flex; align-items:center; gap:10px; margin-bottom:32px; }
.lb-icon    { font-size:32px; }
.lb-text    { font-family:'Baloo 2',cursive; font-size:26px; font-weight:800; color:var(--white); }
.lb-text strong { color:var(--sun); }

.left-title {
  font-family:'Baloo 2',cursive; font-size:38px; font-weight:900;
  color:var(--white); line-height:1.2; white-space:pre-line; margin:0 0 16px;
}
.left-sub   { color:rgba(255,255,255,.55); font-size:16px; line-height:1.7; margin:0 0 32px; }

.left-pills { display:flex; flex-direction:column; gap:10px; margin-bottom:36px; }
.pill-item  { display:flex; align-items:center; gap:10px; font-size:14px; font-weight:600; color:rgba(255,255,255,.75); }
.pill-check {
  width:20px; height:20px; border-radius:50%; background:var(--leaf);
  display:flex; align-items:center; justify-content:center;
  font-size:11px; color:#fff; font-weight:800; flex-shrink:0;
}

.left-testi {
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
  border-radius:16px; padding:20px;
}
.lt-stars  { color:var(--sun); font-size:16px; margin-bottom:8px; letter-spacing:2px; }
.lt-quote  { font-size:14px; color:rgba(255,255,255,.7); line-height:1.6; margin:0 0 10px; font-style:italic; }
.lt-author { font-size:12px; color:rgba(255,255,255,.4); margin:0; font-weight:700; }

/* ── Right panel ── */
.auth-right {
  position:relative; z-index:1;
  display:flex; align-items:center; justify-content:center;
  padding:40px 52px;
}

.form-card {
  background:rgba(255,255,255,.97); border-radius:24px;
  padding:36px; width:100%; max-width:460px;
  box-shadow:0 24px 80px rgba(0,0,0,.4);
  position:relative; overflow:hidden;
  color:#1e1b4b;
}

/* Tabs */
.form-tabs {
  display:grid; grid-template-columns:1fr 1fr;
  background:#f1f5f9; border-radius:12px; padding:4px;
  position:relative; margin-bottom:28px;
}
.ftab {
  padding:10px; border:none; background:transparent;
  font-family:'Nunito',sans-serif; font-weight:700; font-size:14px;
  color:#64748b; cursor:pointer; border-radius:9px; z-index:1;
  transition:color .2s; position:relative;
}
.ftab.active { color:#1e1b4b; }
.tab-indicator {
  position:absolute; top:4px; left:4px;
  width:calc(50% - 4px); height:calc(100% - 8px);
  background:var(--white); border-radius:9px;
  box-shadow:0 2px 8px rgba(0,0,0,.1);
  transition:transform .25s cubic-bezier(.4,0,.2,1);
}

/* Form */
.auth-form { display:flex; flex-direction:column; gap:16px; }

.form-greeting { margin-bottom:4px; }
.fg-title { font-family:'Baloo 2',cursive; font-size:20px; font-weight:800; margin:0 0 3px; }
.fg-sub   { font-size:13px; color:var(--muted); margin:0; }

/* Fields */
.field { display:flex; flex-direction:column; gap:6px; }
.field-label { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.6px; color:var(--muted); }
.field-wrap {
  display:flex; align-items:center; gap:10px;
  background:#f8faff; border:2.5px solid #e2e8f0; border-radius:12px;
  padding:0 14px; transition:border-color .2s;
}
.field-wrap:focus-within { border-color:var(--sky); background:var(--white); }
.field-icon { font-size:18px; flex-shrink:0; }
.field-input {
  flex:1; border:none; background:transparent; outline:none;
  font-family:'Nunito',sans-serif; font-size:14px; font-weight:600;
  color:#1e1b4b; padding:12px 0;
}
.field-input::placeholder { color:#94a3b8; }
.field-select { appearance:none; cursor:pointer; }
.pwd-toggle {
  border:none; background:none; cursor:pointer; font-size:18px;
  padding:0; flex-shrink:0; opacity:.6; transition:opacity .2s;
}
.pwd-toggle:hover { opacity:1; }

.fields-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

/* Avatar row */
.avatar-row { display:flex; flex-wrap:wrap; gap:8px; }
.av-opt {
  width:40px; height:40px; border-radius:10px; border:2.5px solid #e2e8f0;
  background:var(--white); font-size:20px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:all .15s;
}
.av-opt:hover    { border-color:var(--sky); transform:scale(1.1); }
.av-opt.selected { border-color:var(--sun); background:#fefce8; transform:scale(1.1); }

/* Password strength */
.pwd-strength { display:flex; align-items:center; gap:8px; margin-top:6px; }
.ps-bars { display:flex; gap:4px; }
.ps-bar  { height:4px; width:40px; border-radius:99px; background:#e2e8f0; transition:background .2s; }
.ps-bar.active:nth-child(1) { background:#ef4444; }
.ps-bar.active:nth-child(2) { background:#f59e0b; }
.ps-bar.active:nth-child(3) { background:var(--leaf); }
.ps-label        { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.5px; }
.ps-label.weak   { color:#ef4444; }
.ps-label.medium { color:#f59e0b; }
.ps-label.strong { color:var(--leaf); }

/* Form extras */
.form-extras {
  display:flex; align-items:center; justify-content:space-between;
}
.remember-row { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; cursor:pointer; }
.forgot-link  { font-size:13px; font-weight:700; color:var(--sky); text-decoration:none; }
.forgot-link:hover { text-decoration:underline; }

/* Submit button */
.btn-submit {
  padding:14px; border-radius:12px; border:none; width:100%;
  background:linear-gradient(135deg,#1e1b4b,#4338ca);
  color:var(--white); font-family:'Nunito',sans-serif;
  font-weight:800; font-size:15px; cursor:pointer;
  box-shadow:0 4px 18px rgba(67,56,202,.4);
  transition:all .2s; margin-top:4px;
}
.btn-submit:hover:not(.loading) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(67,56,202,.5); }
.btn-submit.loading { opacity:.7; cursor:not-allowed; }

/* Switch link */
.form-switch  { text-align:center; font-size:13px; color:var(--muted); margin:0; }
.switch-link  { border:none; background:none; color:var(--sky); font-family:'Nunito',sans-serif; font-weight:700; font-size:13px; cursor:pointer; padding:0; }
.switch-link:hover { text-decoration:underline; }

.form-terms { text-align:center; font-size:12px; color:var(--muted); margin:0; }
.form-terms a { color:var(--sky); font-weight:700; text-decoration:none; }

/* Success overlay */
.success-overlay {
  position:absolute; inset:0; background:var(--white);
  display:flex; align-items:center; justify-content:center;
  border-radius:24px; z-index:10;
}
.success-inner { text-align:center; }
.success-icon { font-size:64px; margin-bottom:12px; animation:bounce .5s ease; }
.success-inner h3 { font-family:'Baloo 2',cursive; font-size:24px; font-weight:800; margin:0 0 6px; }
.success-inner p  { color:var(--muted); font-size:15px; margin:0 0 20px; }
.success-dots { display:flex; justify-content:center; gap:6px; }
.success-dots span {
  width:8px; height:8px; border-radius:50%; background:#1e1b4b;
  animation:dotBounce 1s infinite;
}
.success-dots span:nth-child(2) { animation-delay:.15s; }
.success-dots span:nth-child(3) { animation-delay:.3s; }
@keyframes bounce { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
@keyframes dotBounce { 0%,100%{opacity:.2} 50%{opacity:1} }

/* Transitions */
.form-fade-enter-active, .form-fade-leave-active { transition:opacity .2s ease, transform .2s ease; }
.form-fade-enter-from, .form-fade-leave-to       { opacity:0; transform:translateX(12px); }
.pop-enter-active { transition:opacity .25s ease; }
.pop-enter-from   { opacity:0; }

/* Responsive */
@media (max-width:900px) {
  .auth-page { grid-template-columns:1fr; }
  .auth-left { display:none; }
  .auth-right { padding:32px 24px; align-items:flex-start; padding-top:60px; }
  .form-card { max-width:100%; }
}
</style>