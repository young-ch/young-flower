export default [
    {
      path: '/banner',
      redirect: 'banners'
    },
    {
      path: '/banners',
      name: 'banners',
      component: () => import('@/apps/banner/Banner.vue')
    },
    {
      path: '/banners/:id/form',
      name: 'banner-detail',
      props: true,
      component: () => import('@/apps/banner/BannerForm.vue')
    },
    {
      path: '/banners/form',
      name: 'banner-form',
      props: true,
      component: () => import('@/apps/banner/BannerForm.vue')
    },
  ]
