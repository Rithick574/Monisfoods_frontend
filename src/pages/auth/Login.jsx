import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/reducers/user/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);
  const authError = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handlePasswordLogin = async () => {
    try {
      await dispatch(loginUser({ email, password }));
    } catch (err) {
      setError('Login failed! Please check your credentials.');
    }
  };

  // const TestCredentials = () => (
  //   <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
  //     <div className="flex justify-between items-center mb-2">
  //       <h3 className="text-sm font-semibold text-gray-700">Test Credentials</h3>
  //       <button
  //         onClick={() => setShowCredentials(!showCredentials)}
  //         className="text-xs text-blue-500 hover:text-blue-700"
  //       >
  //         {showCredentials ? 'Hide' : 'Show'}
  //       </button>
  //     </div>
  //     {showCredentials && (
  //       <div className="space-y-4">
  //         <div>
  //           <h4 className="text-sm font-medium text-gray-600 mb-2">User Account</h4>
  //           <div className="text-sm space-y-1">
  //             <p className="text-gray-600">Mobile: <span className="font-mono">9539285746</span></p>
  //             <p className="text-gray-600">Password: <span className="font-mono">1234</span></p>
  //           </div>
  //         </div>
  //         <div>
  //           <h4 className="text-sm font-medium text-gray-600 mb-2">Admin Account</h4>
  //           <div className="text-sm space-y-1">
  //             <p className="text-gray-600">Mobile: <span className="font-mono">9539285744</span></p>
  //             <p className="text-gray-600">Password: <span className="font-mono">1234</span></p>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {authError && <p className="text-red-500">{authError}</p>}
          <button
            onClick={handlePasswordLogin}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
          >
            Login with Password
          </button>
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
          {/* <TestCredentials /> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
