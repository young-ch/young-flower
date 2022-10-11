export default [
  {
    path: '/content',
    redirect: 'contents'
  },
  {
    path: '/contents',
    name: 'contents',
    component: () => import('@/apps/content/Contents.vue')
  },
  {
    path: '/content/form',
    name: 'content-form',
    component: () => import('@/apps/content/ContentForm.vue')
  },
  {
    path: '/contents/:id',
    name: 'content-detail',
    props:true,
    component: () => import('@/apps/content/ContentForm.vue')
  }
]
