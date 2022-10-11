export default [
  {
    path: '/policy',
    redirect: 'policies'
  },
  {
    path: '/policies',
    name: 'policies',
    component: () => import('@/apps/policy/Policies.vue')
  },
  {
    path: '/policy/form',
    name: 'policy-form',
    component: () => import('@/apps/policy/PolicyForm.vue')
  },
  {
    path: '/policies/:id',
    name: 'policy-detail',
    props:true,
    component: () => import('@/apps/policy/PolicyForm.vue')
  }
]
