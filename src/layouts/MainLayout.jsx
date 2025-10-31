import { Outlet } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { ToastContainer } from "react-toastify";
import Button from "@/components/atoms/Button";

export default function MainLayout() {
  const { logout } = useAuth();

  const outletContext = {
    // Add any app-level state or methods here
    // Example: theme, notifications, user preferences, etc.
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-green-600">Contact Hub</h1>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet context={outletContext} />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}