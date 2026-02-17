
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminFacebookPixel from './pages/AdminFacebookPixel';

export const PAGES = {
    "Home": Home,
    "Products": Products,
    "ProductDetail": ProductDetail,
    "Cart": Cart,
    "Checkout": Checkout,
    "About": About,
    "Contact": Contact,
    "AdminLogin": AdminLogin,
    "AdminDashboard": AdminDashboard,
    "AdminProducts": AdminProducts,
    "AdminOrders": AdminOrders,
    "AdminFacebookPixel": AdminFacebookPixel,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
}