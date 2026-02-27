import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import CurriculumView from './views/CurriculumView.vue'
import LessonsView from './views/LessonsView.vue'
import PlaygroundView from './views/PlaygroundView.vue'
import GamesView from './views/GamesView.vue'
import QuizzesView from './views/QuizzesView.vue'
import PuzzlesView from './views/PuzzlesView.vue'
import AchievementsView from './views/AchievementsView.vue'
import ProfileView from './views/ProfileView.vue'
import LeaderboardView from './views/LeaderboardView.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/curriculum', name: 'curriculum', component: CurriculumView },
    { path: '/lessons', name: 'lessons', component: LessonsView },
    { path: '/playground', name: 'playground', component: PlaygroundView },
    { path: '/games', name: 'games', component: GamesView },
    { path: '/quizzes', name: 'quizzes', component: QuizzesView },
    { path: '/puzzles', name: 'puzzles', component: PuzzlesView },
    { path: '/achievements', name: 'achievements', component: AchievementsView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView }
  ]
})

createApp(App).use(router).mount('#app')
