
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useSelector } from 'react-redux';
import { baseURL } from '../../common/api';

const WalletPage = () => {
 
  const [balance, setBalance] = useState(0.00);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
 
    const fetchWalletData = async () => {
      try {
        const response = await axios.get( `${baseURL}/api/user/wallet/data?userId=${user}`);
        setBalance(response.data.balance); 
        setTransactions(response.data.transactions); 
      } catch (error) {
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []); 

  if (loading) {
    return <p>Loading wallet data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Wallet</h2>

      
      <div className="bg-[#320e0e]  p-6 rounded-lg shadow-md mb-8 text-center">
        <h3 className="text-2xl font-semibold text-white">Wallet Balance</h3>
        <p className="text-4xl font-bold text-white mt-2">₹ {balance}</p>
     
      </div>


      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h3>
      <div className="space-y-6">
        {transactions?.length === 0 ? (
          <p>No transaction history available.</p>
        ) : (
          transactions?.map((transaction) => (
            <div
              key={transaction.id}
              className={`bg-white shadow-lg rounded-lg p-6 flex justify-between items-center ${
                transaction.type === 'credit' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
              }`}
            >
              <div>
                {/* <p className="text-lg font-semibold text-gray-800">{transaction.description}</p> */}
                <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString('en-US')}
                </p>


              </div>
              <p
                className={`text-xl font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'credit' ? '+ ' : '- '}₹{Math.abs(transaction.amount)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletPage;
