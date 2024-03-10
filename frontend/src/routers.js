import CategoriesMenegement from "./pages/CategoriesMenegement";
import ErrPage from "./pages/ErrorPage";
import TableManagement from "./pages/TableManagement";
import MenuManagement from "./pages/MenuManagement";
import Order from "./pages/Order";
import SaleManagement from "./pages/SaleManagement";
import AreaManagement from "./pages/AreaManagement";
import StaffManagement from "./pages/StaffManagement";
import PrintManagement from "./pages/PrintManagement";

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
