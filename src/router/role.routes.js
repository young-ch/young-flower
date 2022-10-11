export default [
  {
    path: '/role',
    redirect: 'roles'
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@/apps/role/Roles.vue')
  },
  {
    path: '/roles/form',
    name: 'role-form',
    component: () => import('@/apps/role/RoleForm.vue')
  },
  {
    path: '/roles/:id',
    name: 'role-detail',
    props:true,
    component: () => import('@/apps/role/RoleForm.vue')
  }
]
