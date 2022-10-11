export default [
  {
    icon: 'mdi-view-dashboard', text: 'Dashboard', regex: /^\/dashboard/, id:0, link: '/dashboard', depth: 1
  },
  {
    icon: 'mdi-account-multiple-outline', text: '회원 관리', regex: /^\/users/, id:1, link: '/users',
    items: [
      { text: '관리자 목록', link: '/users/roles/1',id:11, exact: true },
      { text: '탈퇴 회원 목록', link: '/users/states/STATE_WITHDRAW',id:13, exact: true }
      // { key: 'menu.usersEdit', text: 'Edit', link: '/users/edit' }
    ]
  },
  {
    icon: 'mdi-bulletin-board', text: '게시판', key: 'menu.boards.menu', regex: /^\/boards/, id:1000,
    items: [
      { key: 'menu.boards.board', text: '게시판 목록', link: '/boards',id:1001, value:13, regex: /(^\/boards$|^\/boards\/detail(\/\d+)?)/, exact: true},
      { key: 'menu.boards.article', text: '게시물 목록', regex: /^\/boards\/\d+\/articles/, id:1002,
          // items: [
          //   { text: '공지사항', link: '/boards/1/articles',id:14},
          //   { text: 'FAQ', link: '/531/article/list',id:15 },
          //   { text: '1:1 문의', link: '/530/article/list',id:16 }
          // ]
      }
    ]
  },
  {
    icon: 'mdi-format-float-right', text: '정적 페이지 관리', regex: /^\/content/, id:5, link: '/contents', depth: 1
    // items: [
    //   { text: '정적페이지 목록', link: '/contents',id:13},
    // ]
  },
  {
    icon: 'mdi-dns', text: '배너 관리', regex: /^\/banner/, id:6, link: '/banners', depth: 1,
    items: [
      { icon:'', text: '배너 목록', link: '/banners',id:36}
    ]
  },
  {
    icon:'mdi-page-layout-body', text:'팝업 관리', regex: /^\/popup/, id:7, link: '/popups', depth: 1
    // items:[
    //   {icon:'', text:'팝업 목록',link:'/popups',id:38}
    // ]
  },
  {
    icon: 'mdi-cog-outline', text: '설정 관리', regex: /(^\/setting|^\/endpoint|^\/polic|^\/role|^\/menu)/, id: 9, depth: 1,
    items: [
      { text: '환경 설정', link: '/settings',id:13},
      { text: 'API 공개 관리', link: '/endpoints',id:13},
      { text: '정책 정의 관리', link: '/policies',id:13},
      { text: '메뉴 관리', link: '/menus',id:13},
      { text: '역할 관리', link: '/roles',id:13},
    ]
  },
  // {
  //   icon: 'mdi-routes', text: 'API 공개 관리', regex: /^\/endpoint/, id:2, link: '/endpoints', depth: 1
  //   // items: [
  //   //   { icon:'', text: '엔드포인트 목록', link: '/endpoints'}
  //   // ]
  // },
  // {
  //   icon: 'mdi-check-decagram', text: '정책 정의 관리', regex: /^\/polic/, id:20, link: '/policies', depth: 1
  // },
  // {
  //   icon: 'mdi-certificate', text: '역할 관리', regex: /^\/role/, id:3, link: '/roles', depth: 1
  //   // items: [
  //   //   { icon:'', text: '역할 목록', link: '/roles'},
  //   // // { icon:'', text: '역할 추가', link: '/role/form'}
  //   // ]
  // },
  // {
  //   icon: 'mdi-file-tree', text: '메뉴 관리', regex: /^\/menu/, id:4, link: '/menus', depth: 1
  //   // items: [
  //   //   { icon:'', text: '메뉴 목록', link: '/menus'}
  //   // ]
  // },

  // {
  //   icon: 'mdi-frequently-asked-questions', text: '팁 관리', regex: /^\/tip/, id:17,
  //   items: [
  //     { text: '팁 목록', link: '/tip/list',id:18},
  //   ]
  // }

]
