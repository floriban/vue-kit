import { createRouter, createWebHistory } from 'vue-router'
import AppDashboardLayout from '../layouts/AppDashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: AppDashboardLayout,
      children: [
        { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Dashboard' } },
        { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Página no encontrada' } },
      ],
    },
  ],
})

router.afterEach(to => {
  document.title = `${String(to.meta.title ?? 'Dashboard')} · Vue Kit`
})

export default router
