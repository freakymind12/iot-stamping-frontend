export default [
  // {
  //   component: 'CNavItem',
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: 'cil-speedometer',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Live Dashboard',
  //   to: '/live_dashboard',
  //   icon: 'cil-speedometer',
  // },
  {
    component: 'CNavTitle',
    name: 'Realtime',
  },
  {
    component: 'CNavItem',
    name: 'Production',
    to: '/live_dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavItem',
    name: 'Shoot Counter',
    to: '/live_maintenance',
    icon: 'cil-settings',
  },
  // {
  //   component: 'CNavItem',
  //   name: '',
  //   to: '/data',
  //   icon: 'cil-notes',
  //   items: [
  //     {
  //       component: 'CNavItem',
  //       name: 'Planning',
  //       to: '/data/planner',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'List Production',
  //       to: '/data/production',
  //     },
  //   ]
  // },
  // {
  //   component: 'CNavTitle',
  //   name: 'Production Data',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Production',
  //   to: '/production',
  //   icon: 'cil-file',
  //   items: [
  //     {
  //       component: 'CNavItem',
  //       name: 'List Production',
  //       to: '/production/list_production',
  //     },
  //   ]
  // },
  // {
  //   component: 'CNavTitle',
  //   name: 'Theme',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: 'cil-drop',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: 'cil-pencil',
  // },
  {
    component: 'CNavTitle',
    name: 'Report',
  },
  {
    component: 'CNavItem',
    name: 'Production',
    to: '/production_report',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Daily & Weekly',
        to: '/production_report/daily_weekly',
      },
      {
        component: 'CNavItem',
        name: 'Monthly',
        to: '/production_report/monthly',
      },
      {
        component: 'CNavItem',
        name: 'Yearly',
        to: '/production_report/yearly',
      },
      {
        component: 'CNavItem',
        name: 'Performance',
        to: '/production_report/performance',
      },
      {
        component: 'CNavItem',
        name: 'Summary',
        to: '/production_report/summary',
      },
    ]
  },
  {
    component: 'CNavTitle',
    name: 'Data',
  },
  {
    component: 'CNavItem',
    name: 'Production',
    to: '/data',
    icon: 'cil-notes',
    items: [
      {
        component: 'CNavItem',
        name: 'Planning',
        to: '/data/planner',
      },
      {
        component: 'CNavItem',
        name: 'List Production',
        to: '/data/production',
      },
      {
        component: 'CNavItem',
        name: 'Machine History',
        to: '/data/machine_history',
      },
    ]
  },
  {
    component: 'CNavTitle',
    name: 'Master',
  },
  {
    component: 'CNavItem',
    name: 'Master',
    to: '/master',
    icon: 'cil-file',
    items: [
      {
        component: 'CNavItem',
        name: 'Kanagata',
        to: '/master/kanagata',
      },
      {
        component: 'CNavItem',
        name: 'Machine',
        to: '/master/machine',
      },
      {
        component: 'CNavItem',
        name: 'Product',
        to: '/master/product',
      },
      {
        component: 'CNavItem',
        name: 'PCA',
        to: '/master/pca',
      },
    ]
  }
]
