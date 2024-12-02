


import React, { useState, useEffect } from "react";
import {
  setSelectedItems,
  setTotalAmount,
  selectSelectedItems,
  selectTotalAmount,
} from "../../redux/reducers/user/selectedItemsSlice";
import axios from "axios";
import { useNavigate,useLocation  } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { baseURL } from "../../common/api";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-1/3">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const FoodMenu = () => {
  const [menuData, setMenuData] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [bookingType, setBookingType] = useState("daily"); // 'daily' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(""); // For weekly booking
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [weeklyMenu, setWeeklyMenu] = useState("");

  const selectedItems = useSelector(selectSelectedItems);
  const totalAmount = useSelector(selectTotalAmount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const studentName = location.state?.studentName; 
  // Fetch Menu Data
  useEffect(() => {
    const fetchMenu = async () => {
      let targetDate;
      let targetURL;
  
      if (bookingType === "daily") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        targetDate = tomorrow.toISOString().split("T")[0]; 
        targetURL = `${baseURL}/api/user/menu/${targetDate}`; 
      } else if (bookingType === "weekly" ) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        targetDate = tomorrow.toISOString().split("T")[0];
        targetURL = `${baseURL}/api/user/weekly-menu/${targetDate}`; 
      }
  
      if (targetDate) {
        try {
          const response = await axios.get(targetURL);
          if (bookingType === "daily") {
            setMenuData(response.data);  
          } else if (bookingType === "weekly") {
            setWeeklyMenu(response.data);  
            console.log(response.data); 
          }
          setTargetDate(targetDate); 
        } catch (error) {
          console.error("Error fetching menu:", error);
        }
      }
    };
  
    fetchMenu();
  }, [bookingType, selectedDate]);
  

  // Handle Portion Selection
  const handlePortionSelect = (mealType, itemName, size, price) => {
    const updatedItems = {
      ...selectedItems,
      [mealType]: {
        ...selectedItems[mealType],
        [itemName]: { size, price, quantity: 1 },
      },
    };
    dispatch(setSelectedItems(updatedItems));
  };

  // Handle Quantity Changes
  const handleQuantityChange = (mealType, itemName, change) => {
    const currentItem = selectedItems[mealType]?.[itemName];
    if (!currentItem) return;

    const newQuantity = Math.max(0, currentItem.quantity + change);
    let updatedItems;
    if (newQuantity === 0) {
      const { [itemName]: _, ...remainingItems } = selectedItems[mealType];
      updatedItems = { ...selectedItems, [mealType]: remainingItems };
    } else {
      updatedItems = {
        ...selectedItems,
        [mealType]: {
          ...selectedItems[mealType],
          [itemName]: { ...currentItem, quantity: newQuantity },
        },
      };
    }
    dispatch(setSelectedItems(updatedItems));
  };

  // Calculate Total Amount
  const calculateTotalAmount = () => {
    let total = 0;
    Object.keys(selectedItems).forEach((mealType) => {
      Object.values(selectedItems[mealType] || {}).forEach(({ price, quantity }) => {
        total += price * quantity;
      });
    });
    dispatch(setTotalAmount(total));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [selectedItems]);

  const handleBooking = () => {
  // Prepare booking details to pass to checkout
  const bookingDetails = {
    studentName: studentName,
    bookingType: bookingType, // 'daily' or 'weekly'
    targetDate: targetDate, // The date for which meals are being booked
    selectedItems: selectedItems,
    totalAmount: totalAmount
  };

  navigate("/checkout", { 
    state: bookingDetails 
  });
};

  // Check Time Limit for Daily Booking
  const isDailyBookingAvailable = () => {
    const now = new Date();
    return now.getHours() < 20; // Allow booking until 8 PM
  };



  // const isDailyBookingAvailable = () => {
  //   const now = new Date();
  //   const hours = now.getHours();
  //   return hours >= 9 && hours < 20; // Allow booking between 9 AM and 8 PM
  // };

  const daysOfWeek = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Book Your Meals</h1>

      {/* Booking Type Selector */}
      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={() => setBookingType("daily")}
          className={`px-4 py-2 ${bookingType === "daily" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"} rounded hover:bg-blue-700`}
        >
          Daily
        </button>
        <button
          onClick={() => setBookingType("weekly")}
          className={`px-4 py-2 ${bookingType === "weekly" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"} rounded hover:bg-blue-700`}
        >
          Weekly
        </button>
      </div>

      {!isDailyBookingAvailable() && (
        <p className="text-center text-red-500 mb-8">
          Daily bookings are closed for today. Please try again tomorrow .
        </p>
      )}

      {/* Daily Menu */}
      {bookingType === "daily" && (
        
    <div>
    {Object.keys(menuData).map((mealType) => (
      <div key={mealType} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuData[mealType]?.map((item) => (
            <div key={item.name} className="p-4 bg-white shadow rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center mb-4">
                {Object.entries(item.portions || {}).map(([size, price]) => (
                  <div key={size} className="flex flex-col space-y-2">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name={`${mealType}-${item.name}`}
                        onChange={() =>
                          handlePortionSelect(mealType, item.name, size, price)
                        }
                        className="mr-2"
                      />
                      <span>{`${size.charAt(0).toUpperCase() + size.slice(1)} - ₹${price}`}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleQuantityChange(mealType, item.name, -1)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  -
                </button>
                <span className="px-4">
                  {selectedItems[mealType]?.[item.name]?.quantity || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(mealType, item.name, 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div> 
  )}
  
{/* Weekly Menu */}
{bookingType === "weekly" && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Object.keys(weeklyMenu).map((day, index) => (
      <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-4">
          <h2 className="text-xl font-semibold">{day}</h2>
        </div>
        <div className="p-4">
          {/* Loop over meal types (breakfast, lunch, snack) */}
          {['breakfast', 'lunch', 'snack'].map((mealType, i) => {
            const meals = weeklyMenu[day][mealType]; 

            return meals && meals.length > 0 ? (
              <div key={i} className="mb-8">
                <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Loop over meals */}
                  {meals.map((meal, index) => (
                    <div key={index} className="p-4 bg-white shadow rounded-lg">
                      <img
                        src={meal.image} // Assuming `meal.image` exists in your data
                        alt={meal.name}
                        className="w-full h-40 object-cover rounded-t-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
                      <p className="text-gray-600 mb-2">{meal.description}</p>

                      {/* Loop over portions */}
                      <div className="flex justify-between items-center mb-4">
                        {Object.entries(meal.portions || {}).map(([size, price]) => (
                          <div key={size} className="flex flex-col space-y-2">
                            <label className="flex items-center text-gray-700">
                              <input
                                type="radio"
                                name={`${mealType}-${meal.name}`}
                                onChange={() =>
                                  handlePortionSelect(day, meal.name, size, price)
                                }
                                className="mr-2"
                              />
                              <span>{`${size.charAt(0).toUpperCase() + size.slice(1)} - ₹${price}`}</span>
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Quantity control buttons */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleQuantityChange(day, meal.name, -1)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                          -
                        </button>
                        <span className="px-4">
                          {selectedItems[day]?.[meal.name]?.quantity || 0}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(day, meal.name, 1)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null; // Don't render anything if no meals for this type
          })}
          
          {/* Display a message if no meals available for the day */}
          {['breakfast', 'lunch', 'snack'].every(mealType => !weeklyMenu[day][mealType]?.length) && (
            <p>No meals available for this day.</p>
          )}
        </div>
      </div>
    ))}
  </div>
)}


<button
        onClick={handleBooking}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!isDailyBookingAvailable()} // Disable if outside 9 AM to 8 PM
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default FoodMenu;
