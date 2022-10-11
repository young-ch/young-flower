export default [
  {
    path: '/board',
    redirect: 'board-list'
  },
  {
    path: '/boards',
    name: 'board-list',
    component: () => import(/* webpackChunkName: "users-list" */ '@/apps/board/Board.vue')
  },

  {
    path: '/boards/detail/:id?',
    name: 'board-detail',
    props: true,
    component: () => import('@/apps/board/BoardForm.vue')
  }

]
