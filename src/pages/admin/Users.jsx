import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Admin/Sidebar';
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { baseURL } from '../../common/api';

const UsersPage = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null); 
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${baseURL}/api/admin/users?page=${currentPage}&limit=${limit}`);
      const { students, teachers } = response.data;

      setStudents(students.data);
      setTeachers(teachers.data);

      setLoading(false);
    } catch (err) {
      setError('Error fetching users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);


  const handleEdit = (user, type) => {
    setEditData({ ...user, type }); 
  };

  const saveEdit = async () => {
    try {
      const { type, ...userData } = editData;
      await axios.put(`${baseURL}/api/admin/${type}/${editData._id}`, userData);
      fetchUsers();
      setEditData(null);
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  // Delete 
  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${baseURL}/api/admin/${type}/${id}`);
      fetchUsers(); 
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const closeEditModal = () => {
    setEditData(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-8 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-bold text-center mb-4 ">Students</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md mb-6">
          <thead>
            <tr className="bg-[#eb671c] text-left">
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Class</th>
              <th className="px-4 py-2 border-b">School</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-b">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.class}</td>
                <td className="px-4 py-2">{student.school}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    // className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleEdit(student, 'students')}
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    // className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(student._id, 'students')}
                  >
                   <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-bold text-center mt-8 mb-4">Teachers</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#eb671c] text-left">
              <th className="px-4 py-2 border-b">Mobile</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="border-b">
                <td className="px-4 py-2">{teacher.mobileNumber}</td>
                <td className="px-4 py-2">{teacher.name}</td>
                <td className="px-4 py-2">{teacher.email}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    // className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleEdit(teacher, 'teachers')}
                  >
                  <FaPencilAlt />
                  </button>
                  <button
                    // className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(teacher._id, 'teachers')}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Edit {editData.type}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              {editData.type === 'students' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Class</label>
                    <input
                      type="text"
                      value={editData.class}
                      onChange={(e) => setEditData({ ...editData, class: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">School</label>
                    <input
                      type="text"
                      value={editData.school}
                      onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}
              {editData.type === 'teachers' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={saveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
