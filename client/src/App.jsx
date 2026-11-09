import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import AuthModal from './components/AuthModal.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import HomePage from './pages/HomePage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'
import OwnerMenuPage from './pages/OwnerMenuPage.jsx'
import OwnerOrdersPage from './pages/OwnerOrdersPage.jsx'
import DemoPage from './pages/DemoPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <MyOrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/owner/menu"
                      element={
                        <ProtectedRoute requireOwner>
                          <OwnerMenuPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/owner/orders"
                      element={
                        <ProtectedRoute requireOwner>
                          <OwnerOrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
              <AuthModal />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
