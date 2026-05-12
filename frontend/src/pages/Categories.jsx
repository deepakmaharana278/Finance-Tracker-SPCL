import { useEffect, useState } from "react";
import api from "../api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => api.get("/categories/").then((r) => setCategories(r.data.results ?? r.data));

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setAdding(true);
    try {
      await api.post("/categories/", { name: name.trim(), type });
      setName("");
      load();
    } catch {
      setError("Could not create category.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}/`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Organize your transactions by creating custom categories</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fas fa-plus text-blue-600 dark:text-blue-400"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Category</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add custom categories to track your spending</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Shopping, Utilities, Freelance..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="expense">Expense 📉</option>
                  <option value="income">Income 📈</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400"></i>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={adding}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {adding ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Add Category
                </>
              )}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryGroup
            title="Income Categories"
            icon="fas fa-arrow-up"
            items={income}
            onDelete={handleDelete}
            color="green"
            bgColor="bg-green-100 dark:bg-green-900/30"
            textColor="text-green-600 dark:text-green-400"
            borderColor="border-green-200 dark:border-green-800"
          />

          <CategoryGroup
            title="Expense Categories"
            icon="fas fa-arrow-down"
            items={expense}
            onDelete={handleDelete}
            color="red"
            bgColor="bg-red-100 dark:bg-red-900/30"
            textColor="text-red-600 dark:text-red-400"
            borderColor="border-red-200 dark:border-red-800"
          />
        </div>

        {categories.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <i className="fas fa-tags text-6xl text-gray-400 dark:text-gray-600 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No categories yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Create your first category to start organizing your transactions</p>
          </div>
        )}

        {categories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-chart-bar text-gray-500 dark:text-gray-400"></i>
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Categories</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Income: {income.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Expense: {expense.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Total: {categories.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryGroup({ title, icon, items, onDelete, color, bgColor, textColor, borderColor }) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className={`px-6 py-4 border-b ${borderColor} bg-linear-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
              <i className={`${icon} text-lg ${textColor}`}></i>
            </div>
            <div>
              <h3 className={`text-base font-bold ${textColor}`}>{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {items.length} {items.length === 1 ? "category" : "categories"}
              </p>
            </div>
          </div>
          <div className={`w-1 h-8 rounded-full ${color === "green" ? "bg-green-500" : "bg-red-500"}`}></div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((c, i) => (
          <div key={c.id} className="group flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${color === "green" ? "bg-green-500" : "bg-red-500"} opacity-60`}></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</span>
            </div>

            <button
              onClick={() => onDelete(c.id)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              <i className="fas fa-trash-alt mr-1"></i>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <i className="fas fa-info-circle text-xs"></i>
          Categories help organize your transactions for better insights
        </p>
      </div>
    </div>
  );
}
