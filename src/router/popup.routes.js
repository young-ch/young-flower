export default [
    {
      path: '/popup',
      redirect: 'popup-list'
    },
    {
      path: '/popups',
      name: 'popups',
      component: () => import('@/apps/popup/Popup.vue')
    },
    {
      path: '/popups/:id/form',
      name: 'popup-detail',
      props: true,
      component: () => import('@/apps/popup/PopupForm.vue')
    },
    {
      path: '/popups/form',
      name: 'popup-form',
      props: true,
      component: () => import('@/apps/popup/PopupForm.vue')
    }

  ]
