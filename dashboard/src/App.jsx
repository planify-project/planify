import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/AuthContext";

import Layout from "@/routes/layout";
import DashboardPage from "./routes/dashboard/page.jsx";
import Users from "./routes/users/page";
import Donations from "./routes/donations/page";
import Services from "./routes/services/page.jsx";
import Campaigns from "./routes/campaigns/page";
import Events from "./routes/events/page";
import Reports from "./routes/reports/page";
import Inventory from "./routes/inventory/page";
import Payments from "./routes/payments/page";
import DonationItemDetails from "./routes/donations/[id]";
import Login from "./routes/login/Login.jsx";
import Register from "./routes/register/Register.jsx";
import ProfilePage from "./routes/profile/page";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Optionally, show a loading spinner or null
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <ProtectedRoute />, // Require auth
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "manage-users", element: <Users /> },
            { path: "payments", element: <Payments /> },
            { path: "manage-donation-items", element: <Donations /> },
            { path: "manage-donation-items/:id", element: <DonationItemDetails /> },
            { path: "manage-inneed", element: <Services /> },
            { path: "manage-campaigns", element: <Campaigns /> },
            { path: "manage-events", element: <Events /> },
            { path: "reports", element: <Reports /> },
            { path: "inventory", element: <Inventory /> },
            { path: "profile", element: <ProfilePage /> },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <ThemeProvider storageKey="theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
