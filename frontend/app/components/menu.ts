export const menu = [
  {
    menuId: "999",
    menuName: "テスト",
    destination: "/test",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "テスト", isActive: true },
    ],
  },
  {
    menuId: "000",
    menuName: "ホーム",
    destination: "/",
    displayFlg: true,
    breadcrumbItems: [{ label: "ホーム", isActive: true }],
  },
  {
    menuId: "001",
    menuName: "基板登録",
    destination: "/registBoard",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "基板登録", isActive: true },
    ],
  },
  {
    menuId: "002",
    menuName: "基板一覧",
    destination: "/boardList",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "基板一覧", isActive: true },
    ],
  },
  {
    menuId: "003",
    menuName: "基板詳細",
    destination: "/boardDetail",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "基板一覧", path: "/boardList" },
      { label: "基板詳細", isActive: true },
    ],
  },
  {
    menuId: "004",
    menuName: "基板編集",
    destination: "/editBoard",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "基板一覧", path: "/boardList" },
      { label: "基板詳細", path: "/boardDetail" },
      { label: "基板編集", isActive: true },
    ],
  },
  {
    menuId: "005",
    menuName: "製品登録",
    destination: "/registProduct",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "基板登録", isActive: true },
    ],
  },
  {
    menuId: "006",
    menuName: "製品一覧",
    destination: "/productList",
    displayFlg: true,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "製品一覧", isActive: true },
    ],
  },
  {
    menuId: "007",
    menuName: "製品詳細",
    destination: "/productDetail",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "製品一覧", path: "/productList" },
      { label: "製品詳細", isActive: true },
    ],
  },
  {
    menuId: "008",
    menuName: "製品編集",
    destination: "/editProduct",
    displayFlg: false,
    breadcrumbItems: [
      { label: "ホーム", path: "/" },
      { label: "製品一覧", path: "/productList" },
      { label: "製品詳細", path: "/productDetail" },
      { label: "製品編集", isActive: true },
    ],
  },
];
