import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/DefaultLatout";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import Register from "./pages/Register";
import Order from "./pages/Order";
import OrderOnline from "./pages/OrderOnline";
import OrderHistory from "./pages/OrderHistory";
import OrderAtRestaurant from "./pages/Order/OrderAtRestaurant";
import CheckTokenOrder from "./pages/Order/CheckTokenOrder";
import GoogleCallback from "./pages/AuthGoogle/GoogleCallBack";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/google" element={<GoogleCallback />} />
          <Route path="/order/at-restaurant">
            <Route path="" element={<OrderAtRestaurant />} />
            <Route path="validate" element={<CheckTokenOrder />} />
          </Route>

          <Route path="/register" element={<Register />} />
          {/* <Route path="/order" element={<Order />} /> */}
          <Route path="/order-online" element={<OrderOnline />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/*" element={<DefaultLayout />} />
        </Routes>

        {/* <Header /> */}
        <div className="container">
          <Routes>
            {/* <Route path="/" element={<Homepage />} /> */}
            {/* <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/xuat-ban" element={<XuatBan />} />
            <Route path="*" element={<ErrPage />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
