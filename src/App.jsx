// App.jsx
import Navbar from "./components/navBar";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import StockPredictionResult from "./pages/Prediction/components/prediction_result";
import StockListing from "./pages/StockListing";
import News from "./pages/News";
import BookmarkPage from "./pages/Bookmark";
import Auth from "./pages/Auth/Auth";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/stock-listing" element={
          <ProtectedRoute>
            <MainLayout><StockListing /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/prediction-panel" element={
          <ProtectedRoute>
            <MainLayout><Prediction /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/news" element={
          <ProtectedRoute>
            <MainLayout><News /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/predict/result" element={
          <ProtectedRoute>
            <MainLayout><StockPredictionResult /></MainLayout>
          </ProtectedRoute>} />
        <Route path="/bookmarks" element={
          <ProtectedRoute>
            <MainLayout><BookmarkPage /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;