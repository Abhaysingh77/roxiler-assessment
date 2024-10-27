import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/TransactionTable.css";

const CombinedDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("march"); // Default to March
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalUnsoldItems: 0,
  });
  const [chartData, setChartData] = useState([]);
  const perPage = 10;

  const fetchTransactions = async (search = "") => {
    try {
      const response = await axios.get(`http://localhost:8082/transaction?search=${search}`);
      setTransactions(response.data);
      setPageNo(1);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchStatistics = async (month) => {
    try {
      const response = await axios.get(`http://localhost:8082/transaction/${month}`);
      setStatistics(response.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const generateChartData = (transactions) => {
    const priceRanges = [
      { min: 0, max: 100, label: "0-100" },
      { min: 101, max: 200, label: "101-200" },
      { min: 201, max: 300, label: "201-300" },
      { min: 301, max: 400, label: "301-400" },
      { min: 401, max: 500, label: "401-500" },
      { min: 501, max: 600, label: "501-600" },
      { min: 601, max: 700, label: "601-700" },
      { min: 701, max: 800, label: "701-800" },
      { min: 801, max: 900, label: "801-900" },
      { min: 901, max: Infinity, label: "901-above" },
    ];

    const data = priceRanges.map(range => ({
      range: range.label,
      count: transactions.filter(t => t.price >= range.min && t.price <= range.max).length
    }));

    setChartData(data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchStatistics(selectedMonth);
  }, []);

  useEffect(() => {
    fetchStatistics(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    fetchTransactions(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    let startIndex = pageNo * perPage - perPage;
    setFilteredTransactions(
      transactions.slice(
        startIndex,
        startIndex + (transactions.length < perPage ? transactions.length : perPage)
      )
    );
    generateChartData(transactions);
  }, [transactions, pageNo]);

  const handleNext = () => {
    setPageNo((prev) =>
      prev === Math.ceil(transactions.length / perPage) ? prev : prev + 1
    );
  };

  const handlePrevious = () => {
    setPageNo((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="combined-dashboard">
      <h1>Transaction Dashboard</h1>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search transaction"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="month-select"
        >
          <option value="january">January</option>
          <option value="february">February</option>
          <option value="march">March</option>
          <option value="april">April</option>
          <option value="may">May</option>
          <option value="june">June</option>
          <option value="july">July</option>
          <option value="august">August</option>
          <option value="september">September</option>
          <option value="october">October</option>
          <option value="november">November</option>
          <option value="december">December</option>
        </select>
      </div>

      <div className="dashboard-section">
        <h2>Transaction Statistics</h2>
        <div className="statistics-box">
          <div className="statistic-item">
            <span className="statistic-label">Total sale amount:</span>
            <span className="statistic-value">{statistics.totalSaleAmount}</span>
          </div>
          <div className="statistic-item">
            <span className="statistic-label">Total sold items:</span>
            <span className="statistic-value">{statistics.totalSoldItems}</span>
          </div>
          <div className="statistic-item">
            <span className="statistic-label">Total unsold items:</span>
            <span className="statistic-value">{statistics.totalUnsoldItems}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Transactions Bar Chart</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#40E0D0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Transaction Table</h2>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
                <td>
                  <img
                    width="50px"
                    height="50px"
                    src={transaction.image}
                    alt={transaction.title}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Page No: {pageNo}</span>
          <div>
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
          </div>
          <span>Per Page: {perPage}</span>
        </div>
      </div>
    </div>
  );
};

export default CombinedDashboard;