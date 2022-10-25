export default [
    {
      path: '/historystory"',
      redirect: 'historyStory-list'
    },
    {
      path: '/historystory',
      name: 'historyStory',
      component: () => import('@/apps/historyStory/historyStory.vue')
    },
    {
      path: '/historystory/:id/form',
      name: 'historyStory-detail',
      props: true,
      component: () => import('@/apps/historyStory/historyStoryForm.vue')
    },
    {
      path: '/historystory/form',
      name: 'historystory-form',
      props: true,
      component: () => import('@/apps/historyStory/historyStoryForm.vue')
    }

  ]
