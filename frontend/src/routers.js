import CategoriesMenegement from "./pages/CategoriesMenegement";
import ErrPage from "./pages/ErrorPage";
import TableManagement from "./pages/TableManagement";
import MenuManagement from "./pages/MenuManagement";
import SaleManagement from "./pages/SaleManagement";
import AreaManagement from "./pages/AreaManagement";
import StaffManagement from "./pages/StaffManagement";
import PrintManagement from "./pages/PrintManagement";
import OrderManagement from "./pages/OrderManagement";
import RevenusManagement from "./pages/RevenusManagement/index";

const routers = [
  {
    path: "/menu-management",
    Conponent: () => <MenuManagement />,
  },
  {
    path: "/categories-management",
    Conponent: () => <CategoriesMenegement />,
  },
  {
    path: "/table-management",
    Conponent: () => <TableManagement />,
  },
  {
    path: "/area-management",
    Conponent: () => <AreaManagement />,
  },
  {
    path: "/sale-management",
    Conponent: () => <SaleManagement />,
  },
  {
    path: "/staff-management",
    Conponent: () => <StaffManagement />,
  },
  {
    path: "/printf-management",
    Conponent: () => <PrintManagement />,
  },
  {
    path: "/order-management",
    Conponent: () => <OrderManagement />,
  },
  {
    path: "/revenue-management",
    Conponent: () => <RevenusManagement />,
  },
  // {
  //     path: '/sanpham/:userID',
  //     Conponent: () => <SanPham />
  // },
  {
    path: "/*",
    Conponent: () => <ErrPage />,
  },
];

export default routers;
