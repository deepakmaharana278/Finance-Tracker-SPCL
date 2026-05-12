import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddTransaction() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data.results ?? r.data));
  }, []);

  const filtered = categories.filter((c) => c.type === form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { category: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.amount || !form.date) {
      setError("Title, amount, and date are required.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/transactions/", {
        ...form,
        amount: parseFloat(form.amount),
        category: form.category || null,
      });
      navigate("/transactions");
    } catch (err) {
      setError(err.response?.data?.detail ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/transactions")}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            Back to Transactions
          </button>

          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">Add Transaction</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Record a new financial transaction</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <i className="fas fa-calendar-alt text-sm"></i>
              Transaction Type
            </label>
            <div className="flex gap-3">
              {[
                { value: "expense", label: "Expense", icon: "fas fa-arrow-down", color: "red", bgColor: "bg-red-500", hoverBg: "hover:bg-red-600", shadowColor: "shadow-red-500/30" },
                { value: "income", label: "Income", icon: "fas fa-arrow-up", color: "green", bgColor: "bg-green-500", hoverBg: "hover:bg-green-600", shadowColor: "shadow-green-500/30" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setForm((p) => ({ ...p, type: t.value, category: "" }))}
                  className={`
                    flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center justify-center gap-2
                    ${
                      form.type === t.value
                        ? `${t.bgColor} text-white shadow-lg ${t.shadowColor} scale-105`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    }
                  `}
                >
                  <i className={`${t.icon} text-sm`}></i>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <i className="fas fa-tag text-sm"></i>
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Grocery Shopping, Salary, etc."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="fas fa-rupee-sign text-sm"></i>
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="far fa-calendar-alt text-sm"></i>
                Date
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <i className="fas fa-folder-open text-sm"></i>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">— Select a category —</option>
              {filtered.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {filtered.length === 0 && (
              <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <i className="fas fa-exclamation-triangle text-sm text-yellow-600 dark:text-yellow-400"></i>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">No {form.type} categories available. Create one in Categories section.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <i className="fas fa-pen text-sm"></i>
              Note (Optional)
            </label>
            <textarea
              name="note"
              rows={3}
              value={form.note}
              onChange={handleChange}
              placeholder="Add any additional details about this transaction..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Maximum 500 characters</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-shake">
              <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400"></i>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </span>
              ) : (
                "Add Transaction"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <i className="fas fa-lightbulb text-blue-600 dark:text-blue-400"></i>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Quick Tip</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">Adding categories to your transactions helps you track spending patterns and get better insights in your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
