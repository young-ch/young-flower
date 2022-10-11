export default [
    {
      path: '/endpoint',
      redirect: 'endpoints'
    },
    {
      path: '/endpoints',
      name: 'endpoints',
      component: () => import('@/apps/endpoint/Endpoints.vue')
    }
  ]
