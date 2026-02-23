import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { LineChart, Line } from "recharts";

const Dashboard = () => {
  const { currentUser } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [addLoadbar, setAddLoadbar] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch transactions when page loads
  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser]);
  useEffect(() => {
    if (type === "income") {
      setCategory("salary");
    } else {
      setCategory("food");
    }
  }, [type]);
  const fetchTransactions = async () => {
    const querySnapshot = await getDocs(
      collection(db, `users/${currentUser.uid}/transactions`),
    );

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTransactions(data);
  };

  // Add new transaction
  const addTransaction = async () => {
    if (!amount || !category || !currentUser) return;

    try {
      setAddLoadbar(true);
      const newTransaction = {
        amount: Number(amount),
        type,
        category,
        date: new Date(),
      };

      await addDoc(
        collection(db, `users/${currentUser.uid}/transactions`),
        newTransaction,
      );

      setAmount("");
      setCategory("");
      fetchTransactions();
    } catch (error) {
      console.log(error.message);
      setAddLoadbar(false);
    } finally {
      setAddLoadbar(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      setDeleteItemId(id);
      await deleteDoc(doc(db, `users/${currentUser.uid}/transactions`, id));

      fetchTransactions();
    } catch (error) {
      console.log(error.message);
    } finally {
      setDeleteItemId(null);
    }
  };

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  // Pie Chart Data (Income vs Expense)
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  //Line chart Data
  const dailyTrendData = transactions.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString();

    const existing = acc.find((item) => item.date === date);

    if (existing) {
      if (curr.type === "income") {
        existing.income += curr.amount;
      } else {
        existing.expense += curr.amount;
      }
    } else {
      acc.push({
        date,
        income: curr.type === "income" ? curr.amount : 0,
        expense: curr.type === "expense" ? curr.amount : 0,
      });
    }

    return acc;
  }, []);

  // Category Breakdown
  const categoryData = transactions.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.category);

    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ name: curr.category, amount: curr.amount });
    }

    return acc;
  }, []);

  // Filtering
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = filterType ? t.type === filterType : true;

    return matchesSearch && matchesType;
  });

  //Sort tranctions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount") {
      return a.amount - b.amount;
    }

    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    }

    return 0;
  });

  // Reset Transations
  const resetAllTransactions = async () => {
    if (!currentUser) return;

    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${currentUser.uid}/transactions`),
      );

      const deletePromises = querySnapshot.docs.map((document) =>
        deleteDoc(
          doc(db, `users/${currentUser.uid}/transactions`, document.id),
        ),
      );

      await Promise.all(deletePromises);

      setTransactions([]); // clear UI immediately
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Balance Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-500">Current Balance</h3>
          <p className="text-2xl md:text-3xl font-bold mt-2">₹{balance}</p>

          <button
            onClick={resetAllTransactions}
            className="mt-4 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
          >
            Reset
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500">Total Income</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
            ₹{income}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <h3 className="text-sm text-gray-500">Total Expense</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">
            ₹{expense}
          </p>
        </div>
      </div>

      <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 md:p-6 shadow-md rounded-xl">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-center md:text-left">
            Income vs Expense
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
            className="md:h-[300px]"
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={window.innerWidth < 768 ? 80 : 100}
                label
              >
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 md:p-6 shadow-md rounded-xl">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-center md:text-left">
            Category Breakdown
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
            className="md:h-[300px]"
          >
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Line Chart UI */}
      <div className="bg-white p-4 md:p-6 shadow-md rounded-xl mt-6 md:mt-8 mb-4">
        <h2 className="text-base md:text-lg font-semibold mb-4 text-center md:text-left">
          Daily Trend
        </h2>

        <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
          <LineChart data={dailyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />

            <YAxis tick={{ fontSize: 12 }} />

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "12px" }}
            />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#4ade80"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Add Transaction */}
      <div className="bg-white p-4 md:p-6 shadow-md rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* Category */}
          {type === "income" && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="salary">Salary</option>
              <option value="investment">Investment</option>
              <option value="freelancing">Freelancing</option>
            </select>
          )}

          {type === "expense" && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="food">Food</option>
              <option value="movie">Movie</option>
              <option value="shopping">Shopping</option>
            </select>
          )}

          {/* Button */}
          <button
            onClick={addTransaction}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition duration-200 w-full"
          >
            {addLoadbar ? "Loading..." : "Add"}
          </button>
        </div>
      </div>

      {/* Filtering */}
      <div className="bg-white p-4 md:p-6 shadow-md rounded-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">No Sort</option>
            <option value="amount">Sort by Amount</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white p-4 md:p-6 shadow-md rounded-xl">
        {sortedTransactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found.</p>
        ) : (
          sortedTransactions.map((t) => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                   border rounded-lg p-3 mb-3 hover:shadow-sm transition duration-200"
            >
              {/* Left Side */}
              <div className="mb-2 sm:mb-0">
                <p className="font-medium capitalize">{t.category}</p>
                <p className="text-sm text-gray-500">{t.type}</p>
              </div>

              {/* Right Side */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span
                  className={`font-semibold ${
                    t.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ₹{t.amount}
                </span>

                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-red-500 hover:text-red-600 text-sm transition"
                >
                  {deleteItemId === t.id ? "Loading..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
