export default [
    {
      path: '/histories"',
      redirect: 'histories-list'
    },
    {
      path: '/histories',
      name: 'histories',
      component: () => import('@/apps/histories/histories.vue')
    },
    {
      path: '/histories/:id/form',
      name: 'histories-detail',
      props: true,
      component: () => import('@/apps/histories/historiesForm.vue')
    },
    {
      path: '/histories/form',
      name: 'histories-form',
      props: true,
      component: () => import('@/apps/histories/historiesForm.vue')
    }

  ]
