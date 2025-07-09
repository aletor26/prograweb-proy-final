import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderComplete from './pages/OrderComplete/OrderComplete';
import Products from './pages/Products/Products';
import Category from './pages/Category/Category';
import About from './pages/About/About';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import Offers from './pages/Offers/Offers';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCategories from './pages/Admin/Categories/AdminCategories';
import AddCategory from './pages/Admin/Categories/AddCategory';
import EditCategory from './pages/Admin/Categories/EditCategory';
import AdminProducts from './pages/Admin/Products/AdminProducts';
import ProductForm from './pages/Admin/Products/ProductForm';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import SavedItems from './pages/SavedItems/SavedItems';
import UserForm from './pages/User/UserForm';
import DetalleProducto from './pages/DetalleProducto/DetalleProducto';
import UserDetail from './pages/Admin/Users/UserDetail';
import AdminOrdersList from './pages/Admin/Orders/AdminOrdersList';
import OrderDetailAdmin from './pages/Admin/Orders/OrderDetail';


interface AdminRouteProps {
  children: React.ReactNode;
}

interface CustomerRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const CustomerRoute = ({ children }: CustomerRouteProps) => {
  const { user } = useAuth();

  if (user?.role !== 'customer') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/detalle/:id" element={<DetalleProducto />} />
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/category/:category" element={<Category />} />
      <Route path="/nosotros" element={<About />} />
      <Route path="/search" element={<Search />} />
      <Route path="/ofertas" element={<Offers />} />
      <Route path="/cart" element={<Cart />} />

      {/* Rutas protegidas - Solo clientes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CustomerRoute>
            <Checkout />
          </CustomerRoute>
        </ProtectedRoute>
      } />
      <Route path="/order-complete" element={
        <ProtectedRoute>
          <CustomerRoute>
            <OrderComplete />
          </CustomerRoute>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <CustomerRoute>
            <Orders />
          </CustomerRoute>
        </ProtectedRoute>
      } />
      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <CustomerRoute>
            <OrderDetail />
          </CustomerRoute>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <CustomerRoute>
            <Profile />
          </CustomerRoute>
        </ProtectedRoute>
      } />
      <Route path="/saved-items" element={
        <ProtectedRoute>
          <CustomerRoute>
            <SavedItems />
          </CustomerRoute>
        </ProtectedRoute>
      } />

      {/* Rutas de administrador */}
      <Route path="/admin/orders" element={<ProtectedRoute><AdminRoute><AdminOrdersList /></AdminRoute></ProtectedRoute>} />
      <Route path="/admin/categories" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminCategories />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/categories/new" element={
        <ProtectedRoute>
          <AdminRoute>
            <AddCategory />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/categories/:categoryId/edit" element={
        <ProtectedRoute>
          <AdminRoute>
            <EditCategory />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/products/new" element={
        <ProtectedRoute>
          <AdminRoute>
            <ProductForm />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/products/:id/edit" element={
        <ProtectedRoute>
          <AdminRoute>
            <ProductForm />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/products/:id" element={
      <ProtectedRoute>
        <AdminRoute>
          <DetalleProducto />
        </AdminRoute>
      </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/users/:id" element={
        <ProtectedRoute>
          <AdminRoute>
            <UserDetail />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/users/:id/edit" element={
        <ProtectedRoute>
          <AdminRoute>
            <UserForm editMode={false} setEditMode={function (value: boolean): void {
              throw new Error('Function not implemented.');
            } } />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders/:id" element={
        <ProtectedRoute>
          <AdminRoute>
            <OrderDetailAdmin />
          </AdminRoute>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes; 