import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerCheckout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay"
  });

  useEffect(() => {
    fetchCart();
    fetchCustomerDetails();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get(`/Cart`);
      setCart(res.data);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async () => {
    try {
      const response = await axiosInstance.get('/Customer/profile');
      setCustomer(response.data);
      setForm(prev => ({
        ...prev,
        name: response.data.fullName || "",
        email: response.data.email || "",
        phone: response.data.phoneNumber || "",
        address: response.data.address || "",
        pincode: response.data.pincode || ""
      }));
    } catch (error) {
      console.error("❌ Error fetching customer details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrderWithItems = async () => {
    try {
      const orderItems = cart.map(item => ({
        productId: item.ProductId,
        quantity: item.Quantity,
        price: item.Price
      }));

      const orderResponse = await axiosInstance.post('/Order/create', {
        shippingAddress: `${form.address}, ${form.city}, ${form.pincode}`,
        items: orderItems
      });
      return orderResponse.data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw new Error('Failed to create order');
    }
  };

  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessing(true);
    try {
      const total = cart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0) + 49;

      // Step 1: Create the actual order with items first
      const order = await createOrderWithItems();
      console.log('✅ Order created with items:', order);

      // Step 2: Create Razorpay order for payment
      const razorpayResponse = await axiosInstance.post('/Order/razorpay/create', {
        amount: total,
        currency: 'INR'
      });
      
      const razorpayOrder = razorpayResponse.data;
      console.log('✅ Razorpay order response:', razorpayOrder);

      // Verify that key exists (backend returns 'Key' with capital K)
      const key = razorpayOrder.key || razorpayOrder.Key;
      if (!key) {
        console.error('❌ Razorpay key is missing from response:', razorpayOrder);
        alert('Payment configuration error. Please contact support.');
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const options = {
        key: key, // Use the key variable we validated above
        amount: razorpayOrder.amount || razorpayOrder.Amount * 100, // Convert to paise
        currency: razorpayOrder.currency || razorpayOrder.Currency,
        name: 'Dealsy Furniture',
        description: 'Order Payment',
        order_id: razorpayOrder.orderId || razorpayOrder.OrderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            await axiosInstance.post('/Order/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            // Clear cart after successful payment
            await clearCart();
            alert('✅ Payment Successful! Your order has been placed.');
            navigate('/customer/orders');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        notes: {
          address: form.address,
          orderId: order.id
        },
        theme: {
          color: '#586330'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('❌ Payment failed:', error);
      alert(error.message || 'Payment initialization failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const clearCart = async () => {
    try {
      for (const item of cart) {
        await axiosInstance.delete(`/Cart/remove/${item.Id}`);
      }
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
  const shippingFee = total > 0 ? 49 : 0;
  const finalTotal = total + shippingFee;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading checkout...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#586330]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#586330]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#586330]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#586330]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#586330]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#586330]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={form.paymentMethod === "razorpay"}
                    onChange={handleChange}
                    className="text-[#586330] focus:ring-[#586330]"
                  />
                  <span>Razorpay (Credit/Debit Card, UPI, Net Banking)</span>
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="w-10" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/MasterCard_Logo.svg" className="w-10" alt="MasterCard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Amex_logo.svg" className="w-10" alt="Amex" />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.Id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.Product?.Images?.[0]?.ImageData || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={item.ProductName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.ProductName}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.Quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{(item.Price * item.Quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-[#586330]">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={processing || cart.length === 0}
              className={`w-full mt-6 py-3 rounded-md font-semibold transition ${
                processing || cart.length === 0
                  ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                  : "bg-[#586330] text-white hover:bg-[#586330]/80"
              }`}
            >
              {processing ? "Processing..." : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}