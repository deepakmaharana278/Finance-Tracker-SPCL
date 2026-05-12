import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (filter !== "all") params.type = filter;
    if (search.trim()) params.search = search.trim();
    if (month) params.month = month;
    api
      .get("/transactions/", { params })
      .then((r) => {
        setTransactions(r.data.results ?? r.data);
        setTotal(r.data.count ?? (r.data.results ?? r.data).length);
      })
      .finally(() => setLoading(false));
  }, [filter, search, month, page]);

  useEffect(() => {
    setPage(1);
  }, [filter, search, month]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}/`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">
              Transactions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage and track all your financial activities
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-48 lg:w-64"
              />
            </div>
            

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "All", icon: "fas fa-chart-simple" },
            { value: "income", label: "Income", icon: "fas fa-arrow-up" },
            { value: "expense", label: "Expense", icon: "fas fa-arrow-down" }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                flex items-center gap-2
                ${filter === f.value 
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              <i className={`${f.icon} text-sm`}></i>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading your transactions...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <i className="fas fa-inbox text-6xl text-gray-400 dark:text-gray-600 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or add a new transaction</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400">
              <div className="col-span-5">Description</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            
            {/* Transaction Items */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map((t, i) => (
                <div
                  key={t.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="px-4 py-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between md:justify-start gap-3">
                          
                          <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                            ${t.type === "income" 
                              ? "bg-green-100 dark:bg-green-900/30" 
                              : "bg-red-100 dark:bg-red-900/30"
                            }
                          `}>
                            <i className={`${t.type === "income" ? "fas fa-arrow-up" : "fas fa-arrow-down"} text-lg ${t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}></i>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {t.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1 md:hidden">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                {t.category_name ?? "Uncategorised"}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {t.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-4 flex-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-32">
                          {t.category_name ?? "Uncategorised"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-24">
                          {t.date}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3">
                        <div className="text-right">
                          <div className={`
                            text-lg font-bold
                            ${t.type === "income" 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                            }
                          `}>
                            {t.type === "income" ? "+" : "−"}₹{Number(t.amount).toLocaleString("en-IN")}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => navigate(`/transactions/${t.id}/edit`)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                          >
                            <i className="fas fa-trash-alt mr-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                flex items-center gap-2
                ${page === 1
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              <i className="fas fa-chevron-left text-sm"></i>
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm font-medium">
                {page}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                of {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                flex items-center gap-2
                ${page === totalPages
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              Next
              <i className="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}