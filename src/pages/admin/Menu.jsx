/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Admin/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { baseURL } from '../../common/api';

const AddMenu = () => {
  const [menuType, setMenuType] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates());
  const [mealType, setMealType] = useState('breakfast');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [dailyMeals, setDailyMeals] = useState({
    breakfast: [],
    lunch: [],
    snack: []
  });

  const [weeklyMeals, setWeeklyMeals] = useState({
    monday: { breakfast: [], lunch: [], snack: [] },
    tuesday: { breakfast: [], lunch: [], snack: [] },
    wednesday: { breakfast: [], lunch: [], snack: [] },
    thursday: { breakfast: [], lunch: [], snack: [] },
    friday: { breakfast: [], lunch: [], snack: [] },
    saturday: { breakfast: [], lunch: [], snack: [] },
    sunday: { breakfast: [], lunch: [], snack: [] }
  });
  const [weekRange, setWeekRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0]
  });

  useEffect(() => {
    if (menuType === 'daily') {
      axios.get(`${baseURL}/api/admin/daily-menu/${date}`)
        .then((response) => {
          if (response.data && response.data.meals) {
            setDailyMeals(response.data.meals);
          } else {
            setDailyMeals({
              breakfast: [],
              lunch: [],
              snack: []
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching daily menu:", error);
          setDailyMeals({
            breakfast: [],
            lunch: [],
            snack: []
          });
        });
    }
  }, [date, menuType]);

  const getDatesInRange = (startDate, endDate) => {
    const dates = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      if (currentDate <= end) {
        dates[days[i]] = currentDate.toISOString().split('T')[0];
      } else {
        break;
      }
    }

    return dates;
  };

  const handleDateRangeChange = (type, value) => {
    let newRange = { ...weekRange, [type]: value };

    if (type === 'startDate' && new Date(value) > new Date(weekRange.endDate)) {
      const endDate = new Date(value);
      endDate.setDate(endDate.getDate() + 6);
      newRange.endDate = endDate.toISOString().split('T')[0];
    }

    if (type === 'endDate' && new Date(value) < new Date(weekRange.startDate)) {
      const startDate = new Date(value);
      startDate.setDate(startDate.getDate() - 6);
      newRange.startDate = startDate.toISOString().split('T')[0];
    }

    setWeekRange(newRange);
    setSelectedWeek(getDatesInRange(newRange.startDate, newRange.endDate));
  };

  const fetchWeeklyMenu = async (startDate, endDate) => {
    try {
      const response = await axios.get(`${baseURL}/api/admin/weekly-menu`, {
        params: { startDate, endDate }
      });
      
      const newWeeklyMeals = {
        monday: { breakfast: [], lunch: [], snack: [] },
        tuesday: { breakfast: [], lunch: [], snack: [] },
        wednesday: { breakfast: [], lunch: [], snack: [] },
        thursday: { breakfast: [], lunch: [], snack: [] },
        friday: { breakfast: [], lunch: [], snack: [] },
        saturday: { breakfast: [], lunch: [], snack: [] },
        sunday: { breakfast: [], lunch: [], snack: [] }
      };
      
      Object.entries(response.data).forEach(([date, meals]) => {
        const dayOfWeek = new Date(date)
          .toLocaleString('en-US', { weekday: 'long' })
          .toLowerCase();
        
        if (newWeeklyMeals[dayOfWeek]) {
          newWeeklyMeals[dayOfWeek] = {
            breakfast: meals.breakfast || [],
            lunch: meals.lunch || [],
            snack: meals.snack || []
          };
        }
      });
      
      setWeeklyMeals(newWeeklyMeals);
    } catch (error) {
      console.error("Error fetching weekly menu:", error);
      toast.error("Failed to fetch weekly menu");
    }
  };
  
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  };
  
  useEffect(() => {
    if (menuType === 'weekly') {
      fetchWeeklyMenu(weekRange.startDate, weekRange.endDate);
    }
  }, [menuType, weekRange.startDate, weekRange.endDate]);

  const getItemDisplayPrice = (portions) => {
    if (!portions) return '';

    if (portions.small) return `₹${portions.small}`;
    if (portions.medium) return `₹${portions.medium}`;
    if (portions.large) return `₹${portions.large}`;

    return '';
  };

  const getPortionSizes = (portions) => {
    if (!portions) return '';

    const sizes = [];
    if (portions.small) sizes.push(`Small: ₹${portions.small}`);
    if (portions.medium) sizes.push(`Medium: ₹${portions.medium}`);
    if (portions.large) sizes.push(`Large: ₹${portions.large}`);

    return sizes.join(', ');
  };

  function getWeekDates() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    const week = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      week[day] = date.toISOString().split('T')[0];
    });

    return week;
  }

  useEffect(() => {
    axios.get(`${baseURL}/api/admin/menu-items`)
      .then((response) => {
        console.log(response.data, "items")
        setAvailableItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available items", error);
        toast.error("Failed to fetch menu items");
      });
  }, []);

  const handleAddMenuItem = () => {
    if (!selectedItem) {
      toast.error('Please select an item to add');
      return;
    }

    const itemToAdd = availableItems.find(item => item._id === selectedItem);
    if (!itemToAdd) {
      toast.error('Invalid item selected');
      return;
    }

    const newItem = {
      ...itemToAdd,
      id: Date.now(),
      displayPrice: getPortionSizes(itemToAdd.portions)
    };

    if (menuType === 'daily') {
      if (dailyMeals[mealType].some(item => item._id === itemToAdd._id)) {
        toast.error('This item is already added to this meal');
        return;
      }

      setDailyMeals(prev => ({
        ...prev,
        [mealType]: [...prev[mealType], newItem]
      }));
    } else {
      const updatedWeeklyMeals = { ...weeklyMeals };
      Object.keys(updatedWeeklyMeals).forEach(day => {
        if (!updatedWeeklyMeals[day][mealType].some(item => item._id === itemToAdd._id)) {
          updatedWeeklyMeals[day] = {
            ...updatedWeeklyMeals[day],
            [mealType]: [...updatedWeeklyMeals[day][mealType], newItem]
          };
        }
      });
      setWeeklyMeals(updatedWeeklyMeals);
    }

    toast.success('Item added successfully');
    setSelectedItem(''); 
  };

  const handleDeleteMenuItem = (dayKey, mealTypeKey, itemId) => {
    if (menuType === 'daily') {
      setDailyMeals(prev => ({
        ...prev,
        [mealTypeKey]: prev[mealTypeKey].filter(item => item.id !== itemId)
      }));
    } else {
      setWeeklyMeals(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          [mealTypeKey]: prev[dayKey][mealTypeKey].filter(item => item.id !== itemId)
        }
      }));
    }
    toast.success('Item removed successfully');
  };

  const handleSubmit = async () => {
    try {
      if (menuType === 'daily') {
        const formattedMeals = {
          breakfast: dailyMeals.breakfast.map(item => item._id),
          lunch: dailyMeals.lunch.map(item => item._id),
          snack: dailyMeals.snack.map(item => item._id)
        };
  
        await axios.post(`${baseURL}/api/admin/daily-menu`, {
          date,
          meals: formattedMeals
        });
      } else {
        const startDate = new Date(weekRange.startDate);
        const endDate = new Date(weekRange.endDate);
        const datesInRange = {};
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          const dayName = d.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
          datesInRange[dateString] = dayName;
        }
  
        const formattedWeeklyMeals = {};
        Object.entries(datesInRange).forEach(([date, dayName]) => {
          formattedWeeklyMeals[date] = {
            breakfast: weeklyMeals[dayName].breakfast.map(item => item._id),
            lunch: weeklyMeals[dayName].lunch.map(item => item._id),
            snack: weeklyMeals[dayName].snack.map(item => item._id)
          };
        });
  
        await axios.post(`${baseURL}/api/admin/weekly-menu`, {
          startDate: weekRange.startDate,
          endDate: weekRange.endDate,
          meals: formattedWeeklyMeals
        });
      }
      
      toast.success(`${menuType.charAt(0).toUpperCase() + menuType.slice(1)} menu saved successfully!`);
      
      if (menuType === 'weekly') {
        await fetchWeeklyMenu(weekRange.startDate, weekRange.endDate);
      }
    } catch (error) {
      console.error("Error saving menu:", error);
      toast.error(`Failed to save ${menuType} menu`);
    }
  };

  useEffect(() => {
    if (menuType === 'weekly') {
      fetchWeeklyMenu(weekRange.startDate, weekRange.endDate);
    }
  }, [menuType, weekRange.startDate, weekRange.endDate]);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar className="hidden md:block" />
      <ToastContainer />

      <div className="flex-1 p-4 mt-8 md:p-6">
        <h2 className="text-2xl font-bold mb-6">Update Menu</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Menu Type</label>
          <div className="flex gap-4">
            <button
              onClick={() => setMenuType('daily')}
              className={`px-4 py-2 rounded-lg ${menuType === 'daily'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              Daily Menu
            </button>
            <button
              onClick={() => setMenuType('weekly')}
              className={`px-4 py-2 rounded-lg ${menuType === 'weekly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              Weekly Menu
            </button>
          </div>
        </div>

        {menuType === 'daily' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={weekRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={weekRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Selected Week Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(selectedWeek).map(([day, date]) => (
                  <div key={day} className="text-sm text-blue-600">
                    {day.charAt(0).toUpperCase() + day.slice(1)}: {date}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        {/* Item Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Item</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select an item</option>
            {availableItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} ({getPortionSizes(item.portions)})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddMenuItem}
          className="w-full mb-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Add Item to Menu
        </button>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Current Menu</h3>

          {menuType === 'daily' ? (
            Object.entries(dailyMeals).map(([mealTypeKey, items]) => (
              <div key={mealTypeKey} className="mb-6">
                <h4 className="text-lg font-medium capitalize mb-2">{mealTypeKey}</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">{item.displayPrice}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteMenuItem(null, mealTypeKey, item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-6">
              {Object.entries(weeklyMeals).map(([day, dayMeals]) => (
                <div key={day} className="border-b pb-4">
                  <h4 className="text-lg font-medium capitalize mb-3">
                    {day} ({selectedWeek[day]})
                  </h4>
                  {Object.entries(dayMeals).map(([mealTypeKey, items]) => (
                    <div key={mealTypeKey} className="mb-4">
                      <h5 className="text-md font-medium capitalize mb-2">{mealTypeKey}</h5>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-col">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-600">{item.displayPrice}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteMenuItem(day, mealTypeKey, item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600"
        >
          Save {menuType.charAt(0).toUpperCase() + menuType.slice(1)} Menu
        </button>
      </div>
    </div>
  );
};

export default AddMenu;