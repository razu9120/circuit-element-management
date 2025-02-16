export const menu = [
  {
    menuId: "000",
    menuName: "ホーム",
    destination: "/",
    displayFlg: true,
    breadcrumbItems: [{ label: "ホーム", menuId: "000", isActive: true }],
  },
  {
    menuId: "001",
    menuName: "基板登録",
    destination: "/registBoard",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "基板登録", menuId: "001", isActive: true },
    ],
  },
  {
    menuId: "002",
    menuName: "基板一覧",
    destination: "/boardList",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "基板一覧", menuId: "002", isActive: true },
    ],
  },
  {
    menuId: "003",
    menuName: "基板詳細",
    destination: "/boardDetail",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "基板一覧", menuId: "002", path: "/boardList" },
      { label: "基板詳細", menuId: "003", isActive: true },
    ],
  },
  {
    menuId: "004",
    menuName: "基板編集",
    destination: "/editBoard",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "基板一覧", menuId: "002", path: "/boardList" },
      { label: "基板詳細", menuId: "003", path: "/boardDetail" },
      { label: "基板編集", menuId: "004", isActive: true },
    ],
  },
  {
    menuId: "005",
    menuName: "製品登録",
    destination: "/registProduct",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "製品登録", menuId: "005", isActive: true },
    ],
  },
  {
    menuId: "006",
    menuName: "製品一覧",
    destination: "/productList",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "製品一覧", menuId: "006", isActive: true },
    ],
  },
  {
    menuId: "007",
    menuName: "製品詳細",
    destination: "/productDetail",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "製品一覧", menuId: "006", path: "/productList" },
      { label: "製品詳細", menuId: "007", isActive: true },
    ],
  },
  {
    menuId: "008",
    menuName: "製品編集",
    destination: "/editProduct",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", menuId: "000", path: "/" },
      { label: "製品一覧", menuId: "006", path: "/productList" },
      { label: "製品詳細", menuId: "007", path: "/productDetail" },
      { label: "製品編集", menuId: "008", isActive: true },
    ],
  },
];

export const breadcrumbs = [
  { menuId: "000", menuName: "ホーム", destination: "/" },
  { menuId: "001", menuName: "基板登録", destination: "/registBoard" },
  { menuId: "002", menuName: "基板一覧", destination: "/boardList" },
  {
    menuId: "003",
    menuName: "基板詳細",
    destination: "/boardList/:id/boardDetail",
  },
  {
    menuId: "004",
    menuName: "基板編集",
    destination: "/boardList/:id/boardDetail/editBoard",
  },
  { menuId: "005", menuName: "製品登録", destination: "/registProduct" },
  { menuId: "006", menuName: "製品一覧", destination: "/productList" },
  {
    menuId: "007",
    menuName: "製品詳細",
    destination: "/productList/:id/productDetail",
  },
  {
    menuId: "008",
    menuName: "製品編集",
    destination: "/productList/:id/productDetail/editProduct",
  },
];
