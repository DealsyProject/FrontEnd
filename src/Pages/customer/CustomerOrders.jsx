import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axiosInstance.get('/Order/customer/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      alert("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#586330] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">View your order history and track your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/customer/products')}
              className="bg-[#586330] text-white px-6 py-2 rounded-md hover:bg-[#586330]/80 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.Id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.Id}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed on {formatDate(order.CreatedOn)}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                        {order.Status}
                      </span>
                      <span className="text-lg font-bold text-[#586330]">
                        ₹{order.TotalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.Items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.Image || "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={item.ProductName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.ProductName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.Quantity} × ₹{item.Price?.toFixed(2)}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{(item.Quantity * item.Price)?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.Items?.length > 3 && (
                    <p className="text-sm text-gray-600 mb-4">
                      +{order.Items.length - 3} more items
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.Items?.length || 0} item{order.Items?.length !== 1 ? 's' : ''} • 
                        {order.RazorpayOrderId && ` Payment ID: ${order.RazorpayOrderId}`}
                      </p>
                    </div>
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-[#586330] hover:text-[#586330]/80 font-medium text-sm flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details #{selectedOrder.Id}
                  </h2>
                  <button
                    onClick={closeOrderDetails}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Order Date:</span> {formatDate(selectedOrder.CreatedOn)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.Status)}`}>
                      {selectedOrder.Status}
                    </span>
                  </div>
                  {selectedOrder.RazorpayOrderId && (
                    <div>
                      <span className="font-medium">Payment ID:</span> {selectedOrder.RazorpayOrderId}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.Items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.Image || "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={item.ProductName}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.ProductName}</h4>
                          <p className="text-sm text-gray-600 mt-1">Quantity: {item.Quantity}</p>
                          <p className="text-sm text-gray-600">Price: ₹{item.Price?.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{(item.Quantity * item.Price)?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!selectedOrder.Items || selectedOrder.Items.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        No items found for this order
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        ₹{selectedOrder.Items?.reduce((sum, item) => sum + (item.Quantity * item.Price), 0)?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹49.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span className="text-[#586330]">₹{selectedOrder.TotalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{selectedOrder.ShippingAddress || "No shipping address provided"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6">
                <button
                  onClick={closeOrderDetails}
                  className="w-full bg-[#586330] text-white py-3 rounded-md hover:bg-[#586330]/80 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}