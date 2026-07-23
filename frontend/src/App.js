
import './App.css';

import {
  Route,
  Routes
} from "react-router-dom";

import {
  GoogleOAuthProvider
} from "@react-oauth/google";

import {
  HelmetProvider
} from "react-helmet-async";

import {
  ToastContainer
} from 'react-toastify';


// COMPONENTS
import NavBar from './components/navBar/NavBar';
import TopNavBar from './components/navBar/TopNavBar';
import Footer from './components/footer/Footer';
import Search from './components/search/Search';
import ScrollToTop from './components/scrollToTop/ScrollToTop';


// HOME
import Home from './components/home/Home';


// PAGES
import About from './pages/about/About';
import Collection from './pages/collection/Collection';
import Product from './pages/product/Product';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/plcaeOrder/PlaceOrder';
import Profil from './pages/profil/Profil';
import Order from './pages/order/Order';
import Login from './pages/login/Login';
import Category from './pages/category/Category';
import Video from './pages/video/Video';
import Favorites from './pages/favorite/Favorites';
import SubCategory from './pages/subCategory/SubCategory';
import SocialMedia from './pages/socialMedia/SocialMedia';
import Message from './pages/message/Message';


// BACKEND API
export const backendUrl = 'https://api.k-mystore.com';
//  export const backendUrl = 'http://localhost:5000'
// export const backendUrl = 'https://ecommerce2-4jwd.onrender.com';


function App() {

  return (

    <HelmetProvider>

      <GoogleOAuthProvider
        clientId="242570790563-no0fguencfhn43euu64bsgetcepng53k.apps.googleusercontent.com"
      >

        <div className="App">

          <ToastContainer />

          <TopNavBar />

          <ScrollToTop />

          <Search />

          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* ABOUT */}
            <Route
              path="/about"
              element={<About />}
            />

            {/* PRODUCT SEO URL */}
            <Route
              path="/product/:slug"
              element={<Product />}
            />

            {/* COLLECTION */}
            <Route
              path="/collection"
              element={<Collection />}
            />

            {/* CATEGORY */}
            <Route
              path="/collection/:category"
              element={<Category />}
            />

            {/* SUB CATEGORY SEO */}
            <Route
              path="/category/:category/subcategory/:subcategory"
              element={<SubCategory />}
            />

            {/* CART */}
            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* ORDER */}
            <Route
              path="/placeorder"
              element={<PlaceOrder />}
            />

            <Route
              path="/orders"
              element={<Order />}
            />

            {/* PROFILE */}
            <Route
              path="/profil"
              element={<Profil />}
            />

            {/* ASSISTANCE */}
            <Route
              path="/assistance"
              element={<Message />}
            />

            {/* VIDEO */}
            <Route
              path="/video"
              element={<Video />}
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* FAVORITES */}
            <Route
              path="/favorites"
              element={<Favorites />}
            />

            {/* SOCIAL */}
            <Route
              path="/nos-sites"
              element={<SocialMedia />}
            />

          </Routes>

          {/* <Footer /> */}

          <NavBar />

        </div>

      </GoogleOAuthProvider>

    </HelmetProvider>
  );
}

export default App;