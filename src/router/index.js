import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/landingView.vue';
import AuthView from '../views/AuthView.vue';
import HomeView from '../views/HomeView.vue';
import CurriculumView from '../views/CurriculumView.vue';
import LessonsView from '../views/LessonsView.vue';
import LessonDetailView from '../views/LessonDetailView.vue';
import SignUpView from '../views/signUpView.vue';
import PlaygroundView from '../views/PlaygroundView.vue';
import GamesView from '../views/GamesView.vue';
import QuizzesView from '../views/QuizzesView.vue';
import PuzzlesView from '../views/PuzzlesView.vue';
import AchievementsView from '../views/AchievementsView.vue';
import ProfileView from '../views/ProfileView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';
import { useUserStore } from '../store/userStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView  },   // was HomeView — swap this
    { path: '/home', name: 'home', component: HomeView },   // dashboard moves here
    { path: '/auth', name: 'auth', component: AuthView },
    {path: '/signup', name: 'signup', component: SignUpView},
    { path: '/curriculum', name: 'curriculum', component: CurriculumView },
    { path: '/lessons', name: 'lessons', component: LessonsView },
    { path: '/lessons/:id', name: 'lessonsDetail', component: LessonDetailView },
    { path: '/playground', name: 'playground', component: PlaygroundView },
    { path: '/games', name: 'games', component: GamesView },
    { path: '/quizzes', name: 'quizzes', component: QuizzesView },
    { path: '/puzzles', name: 'puzzles', component: PuzzlesView },
    { path: '/achievements', name: 'achievements', component: AchievementsView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView }
  ]
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  console.log('Navigating from', from.name, 'to', to.name);
    console.log('Current user in store:', userStore.user);
  // 1️⃣ Fetch user info only once
  if (!userStore.user._id) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include'
      }).then(r => r.json());
      console.log('Fetched user info:', res);
      if (res.success) {
        userStore.user = res.user;
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  }

  const user = userStore.user;

  // 3️⃣ Redirect logged-in users away from auth pages
  if (
    user?._id &&
    ['auth', 'landing'].includes(to.name)
  ) {
    return { name: 'home', replace: true };
  }
  return true;
});

export default router;