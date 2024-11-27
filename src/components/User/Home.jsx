import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ParentHomePage = () => {
  const [students, setStudents] = useState([]); 
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    school: '',
  });
  
  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://monis-foods-backend.vercel.app/api/user/students');
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);
 
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("https://monis-foods-backend.vercel.app/api/admin/schools"); 
        
        setSchools(response.data.schools);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
  
    fetchSchools(); 
  }, [isAddStudentModalOpen]); 
  

  const handleBookMeals = (student) => {
    navigate(`/menu`);
  };

  
  const handleAddStudent = async () => {
    try {
      const response = await axios.post('https://monis-foods-backend.vercel.app/api/user/students', newStudent);
      setStudents((prevStudents) => [...prevStudents, response.data]);
      setNewStudent({ name: '', class: '', school: '' });
      setIsAddStudentModalOpen(false);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Monis Foods</h1>
        <p className="text-lg mb-4">
          Here at our mess, we ensure your child receives healthy and nutritious meals every day.
          Book meals for your child now and enjoy a hassle-free experience.
        </p>
        <button
          onClick={() => setIsAddStudentModalOpen(true)}
          className="bg-yellow-500 text-black py-2 px-6 rounded-full shadow-md hover:bg-yellow-400 transition duration-300"
        >
          Add a Student
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Students</h2>
      {students.length === 0 ? (
        <p className="text-center text-lg text-gray-300">You haven't added any students yet.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student.id}
              className="flex justify-between items-center bg-white text-black p-4 rounded-lg shadow-md"
            >
              <div>
              <h3 className="text-xl font-semibold">{student.name.toUpperCase()}</h3>

                <p className="text-sm">{student.class} - {student.school.toUpperCase()}</p>
              </div>
              <button
                onClick={() => handleBookMeals(student)}
                className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-400 transition duration-300"
              >
                Book Meals
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Student</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <input
                type="text"
                name="class"
                value={newStudent.class}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <select
              name="school"
              value={newStudent.school}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="" disabled>
                Select a school
              </option>
              {schools?.map((school) => (
                <option key={school._id} value={school.name}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-400 transition duration-300"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentHomePage;
