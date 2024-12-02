import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../common/api';
import Sidebar from '../../components/Admin/Sidebar';

const RevenueDashboard = () => {
  const [revenue, setRevenue] = useState({
    totalBreakfastRevenue: 0,
    totalLunchRevenue: 0,
    totalSnackRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch revenue data (daily or monthly)
  const fetchRevenue = async (timePeriod = 'monthly') => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/admin/revenue/${timePeriod}`);
      setRevenue(response.data);
    } catch (err) {
      setError('Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch revenue data when component mounts
  useEffect(() => {
    fetchRevenue(); // Default to monthly revenue
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <Sidebar className="hidden md:block w-1/4" />
      
      <div className="container p-6 w-full md:w-3/4 mx-auto">
        <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6"></h1>

        {/* Time Period Selection */}
        <div className="flex justify-center mb-6 space-x-4">
          <button 
            onClick={() => fetchRevenue('daily')}
            className="bg-[#320e0e] text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
          >
            Daily
          </button>
          <button 
            onClick={() => fetchRevenue('monthly')}
            className="bg-[#320e0e] text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
          >
            Monthly
          </button>
        </div>

        {/* Display Loading or Error */}
        {loading && <p className="text-center text-gray-500">Loading revenue data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Display Revenue Data */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#eb671c] p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-200">
              <h2 className="font-semibold text-gray-700 text-xl">Breakfast Revenue</h2>
              <p className="text-2xl font-bold text-black-600">₹{revenue.totalBreakfastRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-[#eb671c] p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-200">
              <h2 className="font-semibold text-gray-700 text-xl">Lunch Revenue</h2>
              <p className="text-2xl font-bold text-black-600">₹{revenue.totalLunchRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-[#eb671c] p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-200">
              <h2 className="font-semibold text-gray-700 text-xl">Snack Revenue</h2>
              <p className="text-2xl font-bold text-black-600">₹{revenue.totalSnackRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueDashboard;
