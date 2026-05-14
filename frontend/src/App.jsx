import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import Categories from "./pages/Categories";

const navItems = [
  { to: "/", label: "Dashboard", icon: "fas fa-chart-line" },
  { to: "/transactions", label: "Transactions", icon: "fas fa-credit-card" },
  { to: "/categories", label: "Categories", icon: "fas fa-tags" },
  { to: "/add", label: "Add", icon: "fas fa-plus", special: true },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <NavLink to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <i className="fas fa-money-bill-wave text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">FinTrack</span>
              </NavLink>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map(({ to, label, icon, special }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) => {
                      if (special) {
                        return `ml-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center gap-2`;
                      }
                      return `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`;
                    }}
                  >
                    <i className={`${icon} text-base`}></i>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 safe-bottom">
          <div className="flex items-center justify-around px-4 py-2">
            {navItems.map(({ to, label, icon, special }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => {
                  if (special) {
                    return `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 bg-blue-500 text-white shadow-lg shadow-blue-500/30 -mt-6`;
                  }
                  return `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`;
                }}
              >
                <i className={`${icon} text-xl`}></i>
                <span className="text-xs font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id/edit" element={<EditTransaction />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add" element={<AddTransaction />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
