import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../../common/api';
const Profile = () => {
  const userId = useSelector((state) => state.auth.user); 
  const [formData, setFormData] = useState({
    mobileNumber: '',
    name: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/user/${userId}`);
        const { mobileNumber, name, email, address } = response.data;
        setFormData({ mobileNumber, name, email, address });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/api/user/${userId}`, formData);
      console.log('Personal details updated:', response.data);
      setIsSubmitted(true);

      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Personal Details</h2>

      {isSubmitted && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-400 rounded-lg">
          <p>Your details have been updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

     
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your address"
            rows="3"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
          >
            Update Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
