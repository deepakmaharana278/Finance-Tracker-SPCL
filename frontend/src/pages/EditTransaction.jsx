import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get(`/transactions/${id}/`), api.get("/categories/")]).then(([t, c]) => {
      const tx = t.data;
      setForm({
        title: tx.title,
        amount: tx.amount,
        type: tx.type,
        category: tx.category ?? "",
        date: tx.date,
        note: tx.note,
      });
      setCategories(c.data.results ?? c.data);
    });
  }, [id]);

  if (!form) return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading transaction...</p>
      </div>
    </div>
  );

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
    setSaving(true);
    try {
      await api.patch(`/transactions/${id}/`, {
        ...form,
        amount: parseFloat(form.amount),
        category: form.category || null,
      });
      navigate("/transactions");
    } catch {
      setError("Could not save changes.");
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
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            Back to Transactions
          </button>
          
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">
              Edit Transaction
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Update your transaction details
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          {/* Transaction Type Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Type
            </label>
            <div className="flex gap-3">
              {[
                { value: "expense", label: "Expense", icon: "fas fa-arrow-down", color: "red" },
                { value: "income", label: "Income", icon: "fas fa-arrow-up", color: "green" }
              ].map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setForm((p) => ({ ...p, type: t.value, category: "" }))}
                  className={`
                    flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center justify-center gap-2
                    ${form.type === t.value 
                      ? t.value === "income"
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105"
                        : "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105"
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

          {/* Title Field */}
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
            />
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="fas fa-rupee-sign text-sm"></i>
                Amount (₹)
              </label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
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

          {/* Category Select */}
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
              <option value="">— None —</option>
              {filtered.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {filtered.length === 0 && (
              <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <i className="fas fa-exclamation-triangle text-sm text-yellow-600 dark:text-yellow-400"></i>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  No categories available for {form.type}. Create one in Categories section.
                </p>
              </div>
            )}
          </div>

          {/* Note Field */}
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
              placeholder="Add any additional details..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400"></i>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
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
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}