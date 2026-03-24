import Navbar from "./components/navBar";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StockListing from "./pages/StockListing";
import News from "./pages/News";
import BookmarkPage from "./pages/Bookmark";



import { useState } from "react";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stock-listing" element={<StockListing />} />
              <Route path="/news" element={<News />} />
              <Route path="/bookmarks" element={<BookmarkPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
   

  );
}

export default App;