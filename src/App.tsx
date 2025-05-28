import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import NavBar from './components/NavBar';
import AppRoutes from './routes';
import './App.css';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <NavBar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
