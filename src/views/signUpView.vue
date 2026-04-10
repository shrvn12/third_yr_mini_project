<template>
  <div class="auth-wrapper">
    <div class="card">
      <h2>Create Account 🎯</h2>
      <p class="sub">Start your coding journey</p>

      <input v-model="name" placeholder="Full Name" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button class="primary" @click="handleSignup">Sign Up</button>

      <p class="switch">
        Already have an account?
        <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')

const handleSignup = () => {
  console.log('Signup', name.value, email.value, password.value)
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
.card {
  width: 380px;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
}
h2 {
  margin-bottom: 0.3rem;
}
.sub {
  color: var(--text-muted);
  margin-bottom: 1rem;
}
input {
  margin: 0.5rem 0;
  padding: 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid #ddd;
}
.primary {
  margin-top: 1rem;
  padding: 0.9rem;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.switch {
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
