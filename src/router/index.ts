import { createRouter, createWebHistory } from 'vue-router'
import DocsLayout from '../layouts/DocsLayout.vue'
import NotFoundView from '../views/NotFoundView.vue'
import HttpStatusView from '../views/HttpStatusView.vue'
import RouteErrorView from '../views/RouteErrorView.vue'
import { findNavigationItem } from '../config/navigation'
import { httpPages } from '../config/httpPages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ left: 0, top: 0, behavior: 'smooth' }),
  routes: [
    {
      path: '/',
      component: DocsLayout,
      redirect: '/dashboard',
      children: [
        { path: 'http-pages', name: 'http-pages', component: () => import('../views/HttpPagesView.vue') },
        ...httpPages.map((page) => ({
          path: 'http/' + page.code,
          name: 'http-' + page.code,
          component: HttpStatusView,
          props: { code: page.code },
          meta: { title: page.title },
        })),
        { path: 'grid', name: 'grid', component: () => import('../views/GridView.vue') },
        { path: 'utilities', name: 'utilities', component: () => import('../views/UtilitiesView.vue') },
        { path: 'states', name: 'states', component: () => import('../views/StatesView.vue') },
        { path: 'drawer', name: 'drawer', component: () => import('../views/DrawerView.vue') },
        { path: 'charts', name: 'charts', component: () => import('../views/ChartsView.vue') },
        { path: 'editor', name: 'editor', component: () => import('../views/EditorView.vue') },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'buttons',
          name: 'buttons',
          component: () => import('../views/ButtonsView.vue'),
        },
        {
          path: 'forms',
          name: 'forms',
          component: () => import('../views/FormsView.vue'),
        },
        {
          path: 'alerts',
          name: 'alerts',
          component: () => import('../views/AlertsView.vue'),
        },
        {
          path: 'cards',
          name: 'cards',
          component: () => import('../views/CardsView.vue'),
        },
        {
          path: 'tables',
          name: 'tables',
          component: () => import('../views/TablesView.vue'),
        },
        {
          path: 'modals',
          name: 'modals',
          component: () => import('../views/ModalsView.vue'),
        },
        {
          path: 'toasts',
          name: 'toasts',
          component: () => import('../views/ToastsView.vue'),
        },
        {
          path: 'dropdowns',
          name: 'dropdowns',
          component: () => import('../views/DropdownsView.vue'),
        },
        {
          path: 'tabs',
          name: 'tabs',
          component: () => import('../views/TabsView.vue'),
        },
        {
          path: 'accordion',
          name: 'accordion',
          component: () => import('../views/AccordionView.vue'),
        },
        {
          path: 'breadcrumbs',
          name: 'breadcrumbs',
          component: () => import('../views/BreadcrumbsView.vue'),
        },
        {
          path: 'stepper',
          name: 'stepper',
          component: () => import('../views/StepperView.vue'),
        },
        {
          path: 'badges',
          name: 'badges',
          component: () => import('../views/BadgesView.vue'),
        },
        {
          path: 'avatars',
          name: 'avatars',
          component: () => import('../views/AvatarsView.vue'),
        },
        {
          path: 'progress',
          name: 'progress',
          component: () => import('../views/ProgressView.vue'),
        },
        {
          path: 'pagination',
          name: 'pagination',
          component: () => import('../views/PaginationView.vue'),
        },
        {
          path: 'tooltips',
          name: 'tooltips',
          component: () => import('../views/TooltipsView.vue'),
        },
        {
          path: 'popovers',
          name: 'popovers',
          component: () => import('../views/PopoversView.vue'),
        },
        {
          path: 'timeline',
          name: 'timeline',
          component: () => import('../views/TimelineView.vue'),
        },
        {
          path: 'spinners',
          name: 'spinners',
          component: () => import('../views/SpinnersView.vue'),
        },
        {
          path: 'skeleton',
          name: 'skeleton',
          component: () => import('../views/SkeletonView.vue'),
        },
        {
          path: 'datepicker',
          name: 'datepicker',
          component: () => import('../views/DatePickerView.vue'),
        },
        {
          path: 'timepicker',
          name: 'timepicker',
          component: () => import('../views/TimePickerView.vue'),
        },
        {
          path: 'autocomplete',
          name: 'autocomplete',
          component: () => import('../views/AutocompleteView.vue'),
        },
        {
          path: 'input-mask',
          name: 'input-mask',
          component: () => import('../views/InputMaskView.vue'),
        },
        {
          path: 'input-groups',
          name: 'input-groups',
          component: () => import('../views/InputGroupsView.vue'),
        },
        {
          path: 'advanced-select',
          name: 'advanced-select',
          component: () => import('../views/AdvancedSelectView.vue'),
        },
        {
          path: 'file-upload',
          name: 'file-upload',
          component: () => import('../views/FileUploadView.vue'),
        },
        { path: 'select2', redirect: { name: 'advanced-select' } },
        {
          path: 'sortable',
          name: 'sortable',
          component: () => import('../views/SortableView.vue'),
        },
        {
          path: 'sweetalert2',
          name: 'sweetalert2',
          component: () => import('../views/SweetAlertView.vue'),
        },
        { path: 'error', name: 'route-error', component: RouteErrorView },
        { path: ':pathMatch(.*)*', name: 'not-found', component: NotFoundView },
      ],
    },
  ],
})

router.afterEach((to) => {
  const item = findNavigationItem(to.name)
  const specialTitle = to.name === 'not-found' ? 'Página no encontrada' : to.name === 'route-error' ? 'Error de carga' : undefined
  document.title = `${to.meta.title ?? specialTitle ?? item?.label ?? 'Vue Kit'} · Vue Kit`
})

router.onError(() => {
  if (router.currentRoute.value.name !== 'route-error') void router.replace({ name: 'route-error' })
})

export default router
