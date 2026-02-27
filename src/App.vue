<template>
  <div class="app-shell">

    <aside class="sidebar">

      <!-- Brand -->
      <div class="brand">
        <h1>Code<span>Kids</span> 🚀</h1>
        <p>Digital Literacy Platform</p>
      </div>

      <!-- Learn -->
      <div class="nav-group">
        <small>LEARN</small>
        <RouterLink to="/"            class="nav-item">🏠 Home</RouterLink>
        <RouterLink to="/curriculum"  class="nav-item">📚 Curriculum</RouterLink>
        <RouterLink to="/lessons"     class="nav-item">💡 Lessons</RouterLink>
        <RouterLink to="/playground"  class="nav-item">🎮 Playground</RouterLink>
      </div>

      <!-- Play -->
      <div class="nav-group">
        <small>PLAY</small>
        <RouterLink to="/games"   class="nav-item">🕹️ Games</RouterLink>
        <RouterLink to="/quizzes" class="nav-item">🧠 Quizzes</RouterLink>
        <RouterLink to="/puzzles" class="nav-item">🧩 Puzzles</RouterLink>
      </div>

      <!-- Progress -->
      <div class="nav-group">
        <small>PROGRESS</small>
        <RouterLink to="/achievements" class="nav-item">🏆 Achievements</RouterLink>
        <RouterLink to="/leaderboard"  class="nav-item">📊 Leaderboard</RouterLink>
        <RouterLink to="/profile"      class="nav-item">👤 My Profile</RouterLink>
      </div>

      <!-- User card -->
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

    <main class="content">
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>