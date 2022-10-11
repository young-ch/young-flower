export default [
  {
    path: '/menu',
    redirect: 'menus'
  },
  {
    path: '/menus',
    name: 'menus',
    component: () => import('@/apps/menu/Menus')
  }
]
