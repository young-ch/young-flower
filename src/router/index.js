import Vue from 'vue'
import Router from 'vue-router'

// Routes
// import AppsRoutes from './apps.routes'
// import UIRoutes from './ui.routes'
import PagesRoutes from './pages.routes'
import UserRoutes from './user.routes'
import BoardRoutes from './board.routes'
import ArticleRoutes from './article.routes'
import BannerRoutes from './banner.routes'
import PopupRoutes from './popup.routes'
import EndpointRoutes from './endpoint.routes'
import RoleRoutes from './role.routes'
import PolicyRoutes from './policy.routes'
import MenuRoutes from './menu.routes'
import SettingRoutes from './setting.routes'
import ContentRoutes from './content.routes'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    redirect: '/auth/signin'
    // redirect: '/dashboard/analytics'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/apps/dashboard/Main.vue')
  },
  {
    path: '/dashboard/analytics',
    name: 'dashboard-analytics',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/dashboard/DashboardPage.vue')
  },
...PagesRoutes,
...UserRoutes,
...BoardRoutes,
...ArticleRoutes,
...BannerRoutes,
...PopupRoutes,
...EndpointRoutes,
...RoleRoutes,
...PolicyRoutes,
...MenuRoutes,
...SettingRoutes,
...ContentRoutes,
{
  path: '/blank',
  name: 'blank',
  component: () => import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
},
{
  path: '*',
  name: 'error',
  component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  return next()
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
