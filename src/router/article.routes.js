export default [
  {
    path: '/boards/:boardId/articles',
    name: 'article-list',
    props: true,
    component: () => import('@/apps/article/Article.vue')
    // component: () => import(/* webpackChunkName: "users-list" */ '@/apps/article/Article.vue')
  },
  {
    path: '/boards/:boardId/articles/:articleId?/form',
    name: 'article-form',
    props: true,
    component: () => import('@/apps/article/ArticleForm.vue')
  },
  {
    path: '/boards/:boardId/articles/:id',
    name: 'article-view',
    props: true,
    component: () => import('@/apps/article/ArticleView.vue')
  },
]
