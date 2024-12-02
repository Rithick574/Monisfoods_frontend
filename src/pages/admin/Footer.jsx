import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        <p>Admin Dashboard</p>
      </div>
    </footer>
  );
};

export default AdminFooter;
