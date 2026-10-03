import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import BlogDetail from "./pages/BlogDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Categories from "./pages/Categories";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/blogs"
    element={
      <ProtectedRoute>
        <BlogList />
      </ProtectedRoute>
    }
  />
  <Route
    path="/create-blog"
    element={
      <ProtectedRoute>
        <CreateBlog />
      </ProtectedRoute>
    }
  />
  <Route
    path="/edit-blog/:id"
    element={
      <ProtectedRoute>
        <EditBlog />
      </ProtectedRoute>
    }
  />
  <Route
    path="/blog/:id"
    element={
      <ProtectedRoute>
        <BlogDetail />
      </ProtectedRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <ProtectedRoute adminOnly={true}>
        <AdminPanel />
      </ProtectedRoute>
  }
  
/>
<Route
  path="/categories"
  element={
    <ProtectedRoute>
      <Categories />
    </ProtectedRoute>
  }
/>
</Routes>
    </div>
  );
}

export default App;