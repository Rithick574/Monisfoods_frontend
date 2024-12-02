import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { baseURL } from '../../common/api';

const AddAvailableItem = () => {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    portions: { small: '', medium: '', large: '' },
    image: ''
  });

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); 

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      setNewItem((prev) => ({ ...prev, image: data.secure_url }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed!');
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.description) {
      toast.error('Name and Description are required!');
      return;
    }
    axios.post(`${baseURL}/api/admin/menu-item`, newItem)
      .then(() => {
        toast.success('Item added successfully!');
        setNewItem({
          name: '',
          description: '',
          portions: { small: '', medium: '', large: '' },
          image: ''
        });
      })
      .catch(() => {
        toast.error('Failed to add item.');
      });
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold mb-4">Add Available Menu Item</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => handleNewItemChange('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => handleNewItemChange('description', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label>Upload Image:</label>
        <input type="file" onChange={handleImageUpload} className="block w-full mt-2" />
      </div>
      {newItem.image && <img src={newItem.image} alt="Uploaded" className="w-full mb-4" />}
      <button
        onClick={handleAddItem}
        className="bg-green-500 text-white p-2 rounded"
      >
        Add Item
      </button>
    </div>
  );
};

export default AddAvailableItem;
