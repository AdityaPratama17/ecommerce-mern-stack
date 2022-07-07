import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import NavbarAdmin from "./components/NavbarAdmin";
import NavbarUser from "./components/NavbarUser";
import ProductAdmin from "./components/admin/ProductAdmin";
import AddProduct from "./components/admin/AddProduct";
import EditProduct from "./components/admin/EditProduct";
import OrderList from "./components/admin/OrderList";
import RegisterAdmin from "./components/auth/RegisterAdmin";
import RegisterUser from "./components/auth/RegisterUser";
import Login from "./components/auth/Login";
import ProductUser from "./components/user/ProductUser";
import DetailProduct from "./components/user/DetailProduct";
import Cart from "./components/user/Cart";

function App() {
  return (
    <Router>
      <Routes>
        {/* user */}
        <Route path="/" element={<><NavbarUser/><ProductUser/></>} exact></Route>
        <Route path="/product/:id" element={<><NavbarUser/><DetailProduct/></>}></Route>
        <Route path="/cart" element={<><NavbarUser/><Cart/></>}></Route>
        {/* admin */}
        <Route path="/product" element={<><NavbarAdmin/><ProductAdmin/></>}></Route>
        <Route path="/product/add" element={<><NavbarAdmin/><AddProduct/></>}></Route>
        <Route path="/product/edit/:id" element={<><NavbarAdmin/><EditProduct/></>}></Route>
        <Route path="/order" element={<><NavbarAdmin/><OrderList/></>}></Route>
        {/* auth */}
        <Route path="/register-admin" element={<><NavbarAdmin/><RegisterAdmin/></>}></Route>
        <Route path="/register" element={<><RegisterUser/></>}></Route>
        <Route path="/login" element={<Login/>}></Route>

        <Route
            path="*"
            element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;