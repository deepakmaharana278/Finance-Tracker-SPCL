import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const fmt = (v) => Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const StatCard = ({ label, value, color, icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform duration-300">
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className={`w-8 h-8 rounded-xl ${color === 'text' ? 'bg-gray-100 dark:bg-gray-700' : color === 'accent' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center`}>
        <i className={`${icon} text-lg`}></i>
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-bold ${color === 'text' ? 'text-gray-900 dark:text-white' : color === 'accent' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        ₹{fmt(value)}
      </span>
      {trend && (
        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
          {trend}
        </span>
      )}
    </div>
  </div>
);

const MonthlyChart = ({ data }) => {
  if (!data.length) return null;
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Overview</h2>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Expense
          </span>
        </div>
      </div>
      
      <div className="relative pt-4">
        <div className="flex items-end gap-2 h-48">
          {data.map((d) => (
            <div key={d.month} className="flex flex-col items-center gap-2 flex-1">
              <div className="flex items-end gap-1 w-full h-36">
                {/* Income bar */}
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-100 bg-green-500" 
                     style={{ height: `${Math.max((d.income / max) * 126, 4)}px`, opacity: 0.85 }} />
                {/* Expense bar */}
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-100 bg-red-500" 
                     style={{ height: `${Math.max((d.expense / max) * 126, 4)}px`, opacity: 0.85 }} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {d.month.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryProgress = ({ name, total, maxTotal }) => {
  const percentage = (total / maxTotal) * 100;
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700 dark:text-gray-300">{name}</span>
        <span className="font-semibold text-red-600 dark:text-red-400">
          ₹{Number(total).toLocaleString("en-IN")}
        </span>
      </div>
      <div className="relative w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-linear-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/summary/"), api.get("/monthly/"), api.get("/transactions/")])
      .then(([s, m, t]) => {
        setSummary(s.data);
        setMonthly(m.data);
        setRecent(t.data.results ?? t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );

  const maxCategoryTotal = summary?.top_categories?.length 
    ? Math.max(...summary.top_categories.map(c => Number(c.total)))
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">
              Financial Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Your financial health at a glance
            </p>
          </div>
          
          <button
            onClick={() => navigate("/transactions")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
          >
            <i className="fas fa-plus text-sm"></i>
            Add Transaction
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Total Balance" 
            value={summary?.balance || 0} 
            color="text"
            icon="fas fa-wallet"
            trend={summary?.balance > 0 ? "+12%" : null}
          />
          <StatCard 
            label="Total Income" 
            value={summary?.income || 0} 
            color="accent"
            icon="fas fa-arrow-trend-up"
            trend="+8%"
          />
          <StatCard 
            label="Total Expenses" 
            value={summary?.expense || 0} 
            color="danger"
            icon="fas fa-arrow-trend-down"
            trend="-3%"
          />
        </div>

        <MonthlyChart data={monthly} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {summary?.top_categories?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Spending Categories</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Where your money goes</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <i className="fas fa-bullseye text-xl"></i>
                </div>
              </div>
              
              <div className="space-y-4">
                {summary.top_categories.map((c) => (
                  <CategoryProgress 
                    key={c.category__name || 'uncategorised'}
                    name={c.category__name ?? "Uncategorised"}
                    total={Number(c.total)}
                    maxTotal={maxCategoryTotal}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Latest financial activity</p>
              </div>
              <button 
                onClick={() => navigate("/transactions")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View All →
              </button>
            </div>
            
            {recent.slice(0, 5).length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recent.slice(0, 5).map((t) => (
                  <div key={t.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          t.type === "income" 
                            ? "bg-green-100 dark:bg-green-900/30" 
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}>
                          <i className={`${t.type === "income" ? "fas fa-circle-dollar-sign" : "fas fa-money-bill-wave"} text-lg`}></i>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {t.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t.category_name ?? "Uncategorised"} • {t.date}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`text-sm font-bold ${
                        t.type === "income" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {t.type === "income" ? "+" : "-"}₹{fmt(t.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No transactions yet
                </p>
                <button
                  onClick={() => navigate("/transactions/new")}
                  className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                >
                  Add your first transaction →
                </button>
              </div>
            )}
          </div>
        </div>

        {summary && (
          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <i className={`${summary.expense > summary.income ? "fas fa-exclamation-triangle" : "fas fa-chart-line"} text-2xl`}></i>
                <div>
                  <h3 className="text-lg font-bold mb-1">Financial Insights</h3>
                  <p className="text-blue-100 text-sm">
                    {summary.expense > summary.income 
                      ? "⚠️ Your expenses exceed your income. Consider reviewing your spending." 
                      : "🎉 Great job! You're maintaining a healthy financial balance."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {((summary.income - summary.expense) / (summary.income || 1) * 100).toFixed(1)}%
                </div>
                <div className="text-blue-100 text-xs">Savings Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}