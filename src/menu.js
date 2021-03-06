let menus = [
  {
    action: "home",
    title: "首页",
    path:"/index",
    items: [{ title: "统计", path: "/dashboard" }]
  },
  {
    action: "apps",
    title: "商品管理",
    path:"/item",
    items: [
      { title: "分类管理", path: "/specGroup" },
      // { title: "品牌管理", path: "/brand" },
      { title: "商品列表", path: "/list" },
      // { title: "规格参数", path: "/specification" }
    ]
  },
  {
    action: "attach_money",
    title: "广告管理",
    path:"/advertise",
    items: [
      { title: "轮播广告", path: "/adver" },
      { title: "商品活动", path: "/newProduct" },
    ]
  },
  {
    action: "people",
    title: "会员管理",
    path:"/user",
    items: [
      { title: "会员管理", path: "/UserManage" }
    ]
  },
  {
    action: "attach_money",
    title: "销售管理",
    path:"/trade",
    items: [
      { title: "待退订单", path: "/statistics" },
      { title: "订单管理", path: "/order" },
      { title: "物流管理", path: "/logistics" },
      { title: "促销管理", path: "/promotion" }
    ]
  },
  {
    action: "settings",
    title: "权限管理",
    path:"/auth",
    items: [
      { title: "权限管理", path: "/manage" },
      { title: "角色管理", path: "/role" },
      { title: "人员管理", path: "/user" }
    ]
  }
]

export default menus;
