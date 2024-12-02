import axios from "axios";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { baseURL } from '../../common/api';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });

 
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios(`${baseURL}/api/admin/coupons`); 
        const data = await response.data;
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prevState) => ({ ...prevState, [name]: value }));
  };


  const handleAddCoupon = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/admin/coupons`,
        newCoupon, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
   
      setCoupons((prevCoupons) => [...prevCoupons, response.data]);
      setIsModalOpen(false);
      setNewCoupon({ code: "", discount: "", expiryDate: "" });
    } catch (error) {
      console.error("Error adding coupon:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl ml-2 font-bold mb-6">Coupon Management</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#eb671c] text-white py-2 px-4 ml-2 rounded-md hover:bg-blue-600"
      >
        Add Coupon
      </button>

      {/* Coupon Table */}
      <div className="mt-6 ml-2 mr-2">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#320e0e]">
              <th className="border text-white border-gray-300 px-4 py-2">Code</th>
              <th className="border text-white border-gray-300 px-4 py-2">Discount</th>
              <th className="border text-white border-gray-300 px-4 py-2">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="border border-gray-300 px-4 py-2">{coupon.code}</td>
                <td className="border border-gray-300 px-4 py-2">{coupon.discount}%</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Coupon</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={newCoupon.code}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={newCoupon.discount}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={newCoupon.expiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoupon}
                className="bg-[#eb671c] text-white py-2 px-6 rounded-full hover:bg-blue-400 transition duration-300"
              >
                Add Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CouponManagement;
