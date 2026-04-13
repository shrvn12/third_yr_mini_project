<template>
  <div class="app-shell" :class="{ 'full-screen': isFullScreen }">

    <aside class="sidebar" v-if="!isFullScreen">
      <div class="brand">
        <h1>Code<span>Kids</span> 🚀</h1>
        <p>Digital Literacy Platform</p>
      </div>

      <div class="nav-group">
        <small>LEARN</small>
        <RouterLink to="/"            class="nav-item">🏠 Home</RouterLink>
        <RouterLink to="/curriculum"  class="nav-item">📚 Curriculum</RouterLink>
        <RouterLink to="/lessons"     class="nav-item">💡 Lessons</RouterLink>
        <RouterLink to="/playground"  class="nav-item">🎮 Playground</RouterLink>
      </div>

      <div class="nav-group">
        <small>PLAY</small>
        <!-- <RouterLink to="/games"   class="nav-item">🕹️ Games</RouterLink> -->
        <RouterLink to="/quizzes" class="nav-item">🧠 Quizzes</RouterLink>
        <RouterLink to="/puzzles" class="nav-item">🧩 Puzzles</RouterLink>
      </div>

      <div class="nav-group">
        <small>PROGRESS</small>
        <RouterLink to="/achievements" class="nav-item">🏆 Achievements</RouterLink>
        <RouterLink to="/leaderboard"  class="nav-item">📊 Leaderboard</RouterLink>
        <RouterLink to="/profile"      class="nav-item">👤 My Profile</RouterLink>
      </div>

      <div class="user-card">
        <div class="user-avatar">🐱</div>
        <div class="user-info">
          <p class="user-name">Shravan</p>
          <p class="user-meta">Grade 6 · 1,240 XP</p>
          <div class="user-bar">
            <div class="user-fill" style="width: 83%"></div>
          </div>
        </div>
      </div>
    </aside>

    <main class="content" :class="{ 'full-screen-content': isFullScreen }">
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

// Routes that should be full-screen (no sidebar)
const FULL_SCREEN_ROUTES = ['/', '/auth', '/landing']

const isFullScreen = computed(() =>
  FULL_SCREEN_ROUTES.includes(route.path) || route.path.startsWith('/auth')
)
</script>