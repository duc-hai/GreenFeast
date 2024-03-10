import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/DefaultLatout";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import Register from "./pages/Register";
import Order from "./pages/Order";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
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
