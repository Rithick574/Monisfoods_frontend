import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import { format } from "date-fns";
import { baseURL } from '../../common/api';
import Sidebar from "../../components/Admin/Sidebar";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the styles

const WeeklyMenu = () => {
  const [menu, setMenu] = useState({});
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedType, setSelectedType] = useState("Breakfast");
  const [selectedItem, setSelectedItem] = useState("");
  const [availableItems, setAvailableItems] = useState([]);

  const getDayOfWeek = (date) => {
    return format(new Date(date), "iiii"); // This will return the day of the week (e.g., "Monday", "Tuesday")
  };

  const getDateAndDay = (date) => {
    return format(new Date(date), "yyyy-MM-dd (iiii)"); // Format like "2024-11-30 (Saturday)"
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/api/admin/menu-items`)
      .then((response) => {
        setAvailableItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available items", error);
        toast.error("Failed to fetch menu items");
      });
  }, []);

  const daysInRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) return [];
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const days = [];
    while (start <= end) {
      days.push(format(new Date(start), "yyyy-MM-dd"));
      start.setDate(start.getDate() + 1);
    }
    return days;
  };

  const handleAddItem = () => {
    if (!selectedDay || !selectedItem) return alert("Please select all fields!");

    setMenu((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [selectedType]: [
          ...(prev[selectedDay]?.[selectedType] || []),
          selectedItem,
        ],
      },
    }));
    setSelectedItem("");
  };

  const handleSaveMenu = async () => {
    try {
      console.log(menu);
      const response = await axios.post(`${baseURL}/api/admin/save-menu`, {
        dateRange, // The selected start and end date range
        menu, // The menu object
      });
      toast.success("Menu saved successfully!");
    } catch (error) {
      toast.error("Failed to save menu");
    }
  };

  const handleRemoveItem = (day, type, index) => {
    setMenu((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: prev[day][type].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        <h2 className="text-2xl text-center font-bold mb-6">Add Menu</h2>

        {/* Date Range Selection */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="font-medium">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="font-medium">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
        </div>

        {/* Add Menu Items */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", flex: "1" }}
          >
            <option value="" disabled>
              Select Day
            </option>
            {daysInRange().map((day) => (
              <option key={day} value={day}>
                {getDateAndDay(day)} {/* Show both date and day */}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-1"
          >
            {["Breakfast", "Lunch", "Snacks"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={selectedItem} // This should store the selected item's _id
            onChange={(e) => setSelectedItem(e.target.value)} // Sets the selected item's _id
            style={{ padding: "8px", border: "1px solid #ccc", flex: "2" }}
          >
            <option value="" disabled>
              Select Item
            </option>
            {availableItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} {/* Display the item's name */}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Menu Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Day
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Breakfast
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Lunch
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Snacks
              </th>
            </tr>
          </thead>
          <tbody>
            {daysInRange().map((day) => (
              <tr key={day}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {getDayOfWeek(day)} {/* Display the day of the week */}
                </td>

                {["Breakfast", "Lunch", "Snacks"].map((type) => (
                  <td key={type} style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {(menu[day]?.[type] || []).map((itemId, index) => {
                        const item = availableItems.find((item) => item._id === itemId);
                        return (
                          <li
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {item ? item.name : "Unknown Item"}
                            <button
                              onClick={() => handleRemoveItem(day, type, index)}
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "2px 6px",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleSaveMenu}
          className="bg-[#eb671c] text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save Menu
        </button>

        {/* Toast container for showing notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default WeeklyMenu;
