import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseURL } from '../../common/api';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/user/get/bookings/${userId}`);
        setOrders(response.data); 
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center bg-gray-100 p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-600">No Orders Found</h3>
          <p className="text-gray-500 mt-4">It looks like you haven't made any bookings yet. Start by booking your first meal!</p>
          {/* <button
            onClick={() => window.location.href = '/book'} // Redirect to booking page (adjust the URL as necessary)
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Make a Booking
          </button> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#320e0e]  shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white">Order #{order._id}</h3>
                <p className="text-sm text-white mt-1">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-white mt-1">Order for: {order?.name}</p>
                <p className="text-sm text-white mt-1">Meal Date: {new Date(order?.mealDate).toLocaleDateString()}</p>

                <div className="mt-4">
                  {Object.keys(order.selectedItems).map((mealType) => (
                    <div key={mealType}>
                      <h4 className="text-xl font-semibold text-white">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                      {order.selectedItems[mealType].map((item, index) => (
                        <div key={index} className="flex justify-between text-white mt-2">
                          <p>{item.name} ({item.details.size})</p>
                          <p>{item.details.quantity} x ₹{item.details.price}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {order.discount > 0 && (
                  <p className="text-sm text-white mt-2">Discount: ₹{order.discount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
