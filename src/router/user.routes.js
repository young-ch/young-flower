export default [
  // {
  //   path: '/users',
  //   redirect: 'users/list'
  // },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/apps/user/Users.vue')
  },
  {
    path: '/users/roles/:searchRoleId',
    name: 'users-roles',
    component: () => import('@/apps/user/Users.vue')
  },
  {
    path: '/users/states/:searchState',
    name: 'users-states',
    component: () => import('@/apps/user/Users.vue')
  },
  {
    path: '/users/:id?/form',
    name: 'user-info',
    props: true,
    component: () => import('@/apps/user/UserForm.vue')
  }
]
