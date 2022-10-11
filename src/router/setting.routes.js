export default [
  {
    path: '/setting',
    redirect: 'settings'
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/apps/setting/Settings')
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('@/apps/setting/Config')
  }
]
