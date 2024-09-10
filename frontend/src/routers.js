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
import HistoryOrder from "./pages/HistoryOrder/index";
import AdminDemo from "./components/ChartDemo/PageDemo/Amin";
import OrderOnline from "./pages/OrderOnline";
import BillKitchen from "./components/Print/BillKitchen/BillKitchen";
import BillBar from "./components/Print/BillBar/BillBar";
import RoleAdmin from "./components/ProtectedRoute/RoleAdmin";

const routers = [
  {
    path: "/menu-management",
    Conponent: () => <MenuManagement />,
  },
  {
    path: "/categories-management",
    Conponent: () => (
      <RoleAdmin>
        <CategoriesMenegement />
      </RoleAdmin>
    ),
  },
  {
    path: "/table-management",
    Conponent: () => (
      <RoleAdmin>
        <TableManagement />
      </RoleAdmin>
    ),
  },
  {
    path: "/area-management",
    Conponent: () => (
      <RoleAdmin>
        <AreaManagement />
      </RoleAdmin>
    ),
  },
  {
    path: "/sale-management",
    Conponent: () => (
      <RoleAdmin>
        <SaleManagement />
      </RoleAdmin>
    ),
  },
  {
    path: "/staff-management",
    Conponent: () => (
      <RoleAdmin>
        <StaffManagement />
      </RoleAdmin>
    ),
  },
  {
    path: "/printf-management",
    Conponent: () => (
      <RoleAdmin>
        <PrintManagement />
      </RoleAdmin>
    ),
  },
  {
    path: "/order-management",
    Conponent: () => <OrderManagement />,
  },
  {
    path: "/revenue-management",
    Conponent: () => <RevenusManagement />,
  },
  {
    path: "/history-order-management",
    Conponent: () => <HistoryOrder />,
  },
  {
    path: "/admin-chart",
    Conponent: () => <AdminDemo />,
  },
  {
    path: "/order-online",
    Conponent: () => <OrderOnline />,
  },
  {
    path: "/bill-kitchen",
    Conponent: () => <BillKitchen />,
  },
  {
    path: "/bill-bar",
    Conponent: () => <BillBar />,
  },
  // {
  //     path: '/sanpham/:userID',
  //     Conponent: () => <SanPham />
  // },
  // {
  //   path: "/payment/vnpay_return",
  //   Conponent: () => <WaitPayment />,
  // },
  {
    path: "/*",
    Conponent: () => <ErrPage />,
  },
];

export default routers;
