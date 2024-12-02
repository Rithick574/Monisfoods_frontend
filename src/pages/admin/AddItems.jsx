
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Admin/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { baseURL } from '../../common/api';


function AddItems() {

  const initialValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("School name is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(`${baseURL}/api/admin/schools`, values);
      toast.success("School added successfully!");
      resetForm();
    } catch (error) {
      toast.error("Failed to add school");
    }
  };


    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableItems, setAvailableItems] = useState([]);
    const [newItem, setNewItem] = useState({
      name: '',
      description: '',
      portions: { small: '', medium: '', large: '' },
      image:''
    });
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showAvailableItemsModal, setShowAvailableItemsModal] = useState(false);
    //const [showDailyMenuModal, setShowDailyMenuModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [preview, setPreview] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false); 

    const [schools, setSchools] = useState([]);



  const fetchSchools = async () => {


   
      const response = await axios.get(`${baseURL}/api/admin/schools`);
      setSchools(response.data.schools);
   
   
    
  };
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

      
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ov79qmw3'); 
      
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/ddgwtndbb/image/upload`, {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          setNewItem((prev) => ({ ...prev, image: data.secure_url })); 
          console.log('Uploaded Image URL:', data.secure_url);
          setImageUploaded(true);
        } catch (error) {
          console.error('Image upload failed:', error);
          setImageUploaded(false)
        }
      };
  
 
  useEffect(() => {
    axios.get(`${baseURL}/api/admin/menu-items`)
      .then((response) => {
        setAvailableItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available items", error);
      });
  }, []);

  
  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddOrEditItem = () => {
    if (!newItem.name || !newItem.description) {
      toast.error("Name and Description are required!");
      return;
    }
  
    if (!newItem.portions.small && !newItem.portions.medium && !newItem.portions.large) {
      toast.error("At least one portion size must have a price!");
      return;
    }
  
    const apiUrl = editingItem
      ? `${baseURL}/api/admin/menu-item/${editingItem._id}`
      : `${baseURL}/api/admin/menu-item`;
  
    const method = editingItem ? axios.put : axios.post;
  
    method(apiUrl, newItem)
      .then((response) => {
        if (editingItem) {
          setAvailableItems((prev) =>
            prev.map((item) => (item._id === editingItem._id ? response.data : item))
          );
          toast.success('Item updated successfully');
        } else {
          setAvailableItems((prev) => [...prev, response.data]);
          toast.success('Item added successfully');
        }
        setEditingItem(null);
        setNewItem({
          name: '',
          description: '',
          portions: { small: '', medium: '', large: '' },
          image: '',
        });
        setPreview(null);
        setImageUploaded(false); 
        setShowAddItemModal(false);
      })
      .catch((error) => {
        console.error("Error saving item", error);
        toast.error("Failed to save item");
      });
  };
  
  const handleDeleteItem = (id) => {
    axios.delete(`${baseURL}/api/admin/menu-item/${id}`)
      .then(() => {
        setAvailableItems((prev) => prev.filter(item => item._id !== id));
        toast.success('Item deleted successfully');
      })
      .catch((error) => {
        console.error("Error deleting item", error);
      });
  };


  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddItemModal(true);
  };

  
    return (
        <div className="flex flex-col md:flex-row">
       
        <Sidebar className="hidden md:block" />
        <ToastContainer />
        <div className="flex-1 p-4 mt-8  md:p-6">
          <h2 className="text-2xl font-bold mt-4 mb-4 md:mb-6">Add Items</h2>
    
        
          
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <button
            onClick={() => setShowAddItemModal(true)}
            className="bg-[#320e0e] text-white py-2 px-4 rounded"
          >
            Add Available Menu 
          </button>
          <button
            onClick={() => setShowAvailableItemsModal(true)}
            className="bg-[#eb671c] text-white py-2 px-4 rounded"
          >
            View Available Menus
          </button>
        </div>

  {/* Add Item Modal */}
{showAddItemModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6 relative">
      <button
        onClick={() => {
          setShowAddItemModal(false);
          setEditingItem(null);
          setNewItem({
            name: '',
            description: '',
            portions: { small: '', medium: '', large: '' },
            image: '',
          });
        }}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
      >
        X
      </button>
      <h3 className="text-xl font-semibold mb-4">
        {editingItem ? 'Edit' : 'Add'} Available Menu Option
      </h3>
      
      <input
        type="text"
        placeholder="Item Name"
        value={newItem.name}
        onChange={(e) => handleNewItemChange('name', e.target.value)}
        className="p-2 border rounded mb-2 w-full"
      />
     
      <input
        type="text"
        placeholder="Description"
        value={newItem.description}
        onChange={(e) => handleNewItemChange('description', e.target.value)}
        className="p-2 border rounded mb-2 w-full"
      />
      
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Portion Sizes</h4>
        {['small', 'medium', 'large'].map((size) => (
          <div key={size} className="flex items-center justify-between mb-2">
            <label className="capitalize w-1/3">{size}</label>
            <input
              type="number"
              placeholder={`Price for ${size}`}
              value={newItem.portions[size]}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  portions: { ...prev.portions, [size]: e.target.value },
                }))
              }
              className="p-2 border rounded w-2/3"
            />
          </div>
        ))}
      </div>
    
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {newItem.image && (
          <div className="mt-4">
            <img src={newItem.image} alt="Uploaded menu item" className="w-32 h-32 rounded-lg" />
          </div>
        )}
      </div>
    
      <button
        onClick={handleAddOrEditItem}
        className={`${
          imageUploaded ? 'bg-green-500' : 'bg-gray-500'
        } text-white py-2 px-4 rounded cursor-pointer`}
        disabled={!imageUploaded}
      >
        {editingItem ? 'Update' : 'Add'} Item
      </button>
    </div>
  </div>
)}


        {showAvailableItemsModal && (
        <div className="overflow-x-auto">
          
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.description}</td>
                  <td className="border px-4 py-2">
                    Small: ₹{item?.portions?.small || 'N/A'}, Medium: ₹
                    {item?.portions?.medium || 'N/A'}, Large: ₹{item?.portions?.large || 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
   )}


    <h2 className="text-2xl font-bold mt-7 mb-4 md:mb-6">Schools</h2>
  <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      
      <h1 className="text-xl font-bold mb-4">Add School</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">
              School Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              placeholder="Enter school name"
              className="w-full px-3 py-2 border rounded"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#320e0e] text-white rounded hover:bg-blue-600"
          >
            Add School
          </button>
        </Form>
      </Formik>
      
    </div>

   
    <button
        onClick={fetchSchools}
        className="px-4 mt-4 py-2 bg-[#eb671c] text-white rounded hover:bg-blue-600"
      >
        Load Schools
      </button>

      {schools.length > 0 && (
  <div className="mt-6">
   
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {schools.map((school) => (
        <div key={school._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-maroon-700">{school.name}</h3>
       
          
        </div>
      ))}
    </div>
  </div>
)}

  </div>
  </div>  
  )
}

export default AddItems
