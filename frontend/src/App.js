
import './App.css';
import { Route, Routes } from "react-router-dom";
import NavBar from './components/navBar/NavBar';
import TopNavBar from './components/navBar/TopNavBar';
import About from './pages/about/About';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import Collection from './pages/collection/Collection';
import Search from './components/search/Search';
import Product from './pages/product/Product';
import Cart from './pages/cart/Cart';

import { ToastContainer, toast } from 'react-toastify';
import PlaceOrder from './pages/plcaeOrder/PlaceOrder';
import Profil from './pages/profil/Profil';
import Order from './pages/order/Order';
import Login  from './pages/login/Login';
import Category from './pages/category/Category';
import HomePageCategory from './pages/homePageCategory/HomePageCategory';


  export const backendUrl = 'https://ecommerce2-production-a5f7.up.railway.app'
   //   export const backendUrl = 'http://localhost:5000'
function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <TopNavBar />
      <Search/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/product/:productId" element={<Product />}/>
        <Route path="/cart" element={<Cart/>} />
        <Route path="/placeorder" element={<PlaceOrder/>} />
        <Route path="/orders" element={<Order/>} />
        <Route path="/profil" element={<Profil/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/collection" element={<Collection />} />

         <Route path="/collection" element={<HomePageCategory />} />
        <Route path="/collection/:category" element={<Category />}  />

      </Routes>
      <Footer/>
      <NavBar />
    </div>
  );
}

export default App;
