import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectSelectedItems } from '../../redux/reducers/user/selectedItemsSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate ,useLocation} from 'react-router-dom';
import { baseURL } from '../../common/api';

const Checkout = () => {
    const navigate = useNavigate();  
  const selectedItems = useSelector(selectSelectedItems);
  const [coupons, setCoupons] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isWalletUsed, setIsWalletUsed] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const studentName = location.state?.studentName; 
  

const calculateTotal = () => {
    let total = 0;
    
   
    Object.keys(selectedItems).forEach((mealType) => {
      Object.entries(selectedItems[mealType]).forEach(([itemName, { price, quantity }]) => {
        total += price * quantity;
      });
    });
  

    total = total - discount;
  
    // If wallet balance is used, 
    if (isWalletUsed) {
     
      if (total <= walletBalance) {
        return 0;
      }
      return total - walletBalance; 
    }
  
    return total; 
  };
  const total = calculateTotal();

  
  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/admin/coupons/validate`, {
        code: couponCode,
        userId: user, // Ensure 'user' contains the valid user ID
      });
  
      const { message, discountAmount, walletBalance } = response.data;
  
      if (response.status === 200) {
        setDiscount(discountAmount); // Update discount
        setWalletBalance(walletBalance); // Update wallet balance
        setIsCouponApplied(true);
        toast.success(`Coupon applied! ₹${discountAmount} added to wallet.`);
  
        // Update totalAmount based on the new discount
        setTotalAmount(calculateTotal(discountAmount));
      } else {
        toast.error(message || "Invalid coupon.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon.");
    }
  };
  
  
  
  const handleShowCoupons = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/admin/coupons`);
      setAvailableCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
     
    }
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/user/wallet/balance?userId=${user}`); 
        if (response.status === 200) {
          setWalletBalance(response.data.balance); 
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, []);

  const handleWalletApply = () => {
    const totalBeforeWallet = calculateTotal(); 
  
    if (walletBalance >= totalBeforeWallet) {
      setTotalAmount(0);
      setWalletBalance(walletBalance - totalBeforeWallet); 
    } else {
      setTotalAmount(totalBeforeWallet - walletBalance); 
      setWalletBalance(0);
    }
  
    setIsWalletUsed(true); 
  };
 

  
  const handleBooking = async (paymentDetails) => {
    const totalAfterDiscount = calculateTotal() + (isWalletUsed ? walletBalance : 0); // Add back wallet balance deduction
  
    const formattedItems = {
      breakfast: selectedItems.breakfast
        ? Object.keys(selectedItems.breakfast).map((itemName) => ({
            name: itemName,
            details: selectedItems.breakfast[itemName],
          }))
        : [],
      lunch: selectedItems.lunch
        ? Object.keys(selectedItems.lunch).map((itemName) => ({
            name: itemName,
            details: selectedItems.lunch[itemName],
          }))
        : [],
      snack: selectedItems.snack
        ? Object.keys(selectedItems.snack).map((itemName) => ({
            name: itemName,
            details: selectedItems.snack[itemName],
          }))
        : [],
    };
  
    const bookingData = {
      userId: user,
      meals: formattedItems,
      totalAmount: totalAfterDiscount, // Send total after applying the discount
      name: studentName,
      discount,
      walletBalanceUsed: isWalletUsed ? walletBalance : 0,
      paymentDetails,
    };
  
    try {
      const response = await axios.post(`${baseURL}/api/user/bookings`, bookingData);
      toast.success('Booking Successful');
      navigate('/payment-success');
      console.log('Booking Response:', response.data);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };
  
  const handleRazorpayPayment = async () => {
    try {
      const totalAmount = calculateTotal();
  console.log(totalAmount);
  
      
      const response = await axios.post(`${baseURL}/api/user/create-order`, {
        amount: totalAmount
      });
  
      const order = response.data;
  
      if (!order.id) {
        console.error('Failed to create Razorpay order:', order);
        return;
      }
  
   
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Monis Food',
        description: 'Meal Booking Payment',
        order_id: order.id,
        handler: async (response) => {
          const paymentDetails = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
  
          console.log(paymentDetails, "payy");
  
          await handleBooking(paymentDetails); 
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
    }
  };
  
  const handlePayment = () => {
    setIsPaymentProcessing(true);
  
    if (total === 0) {
      // for free booking
      handleBooking();
    } else {
      // for paid booking
      handleRazorpayPayment();
    }
  
    setIsPaymentProcessing(false);
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <ToastContainer />
      {/* Selected Items */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">Selected Items</h3>
        <div className="space-y-4">
          {Object.keys(selectedItems).map((mealType) => (
            <div key={mealType}>
              <h4 className="text-lg font-semibold">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
              {Object.entries(selectedItems[mealType] || {}).map(([itemName, { price, quantity }]) => (
                <div key={itemName} className="flex justify-between">
                  <span>{itemName} ({quantity} x ₹{price})</span>
                  <span>₹{price * quantity}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">Apply Coupon</h3>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleApplyCoupon}
          className="mt-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Apply Coupon
        </button>
        <button
          onClick={handleShowCoupons}
          className="mt-2 ml-3 p-2 bg-blue-500 text-white rounded-md"
        >
          Show Coupons
        </button>
      </div>

{/* Display available coupons */}
{availableCoupons.length > 0 && (
  <div className="mt-4">
    <h4 className="text-lg font-medium mb-4">Available Coupons</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {availableCoupons.map((coupon) => (
        <div
          key={coupon._id}
          className="border border-gray-300 shadow-lg rounded-md p-4 hover:shadow-xl transition-shadow"
        >
          <h5 className="text-lg font-semibold text-blue-600">{coupon.code}</h5>
          <p className="mt-2">
            <strong>Discount:</strong> ₹{coupon.discount}
          </p>
          <p>
            <strong>Expiry:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}
          </p>
          <button
            onClick={() => setCouponCode(coupon.code)} // Set coupon code for quick selection
            className="mt-4 p-2 w-full bg-blue-500 text-white text-center rounded-md hover:bg-blue-600"
          >
            Use Coupon
          </button>
        </div>
      ))}
    </div>
  </div>
)}


      {/* Wallet Section */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">Wallet</h3>
        <button
          onClick={handleWalletApply}
          className="p-2 bg-green-500 text-white rounded-md"
        >
          Use Wallet Balance
        </button>
        <p className="mt-2">Wallet Balance: ₹{walletBalance}</p>
      </div>

      {/* Total Amount */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">Total Amount</h3>
        <p>Total: ₹{calculateTotal()}</p>
      </div>

      {/* Payment Section */}
      <div className="mb-6">
      <button
        onClick={handlePayment}
        className="p-3 bg-blue-600 text-white rounded-md"
        disabled={isPaymentProcessing}
      >
        {isPaymentProcessing
          ? 'Processing...'
          : total === 0
          ? 'Book Now'
          : 'Proceed to Pay'}
      </button>
    </div>
    </div>
  );
};

export default Checkout;
