import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Components/utils/axiosInstance';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  const activeView = 'customers';

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/Customer/all');
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer details
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await axiosInstance.get(`/api/Customer/${customerId}`);
      setSelectedCustomer(response.data);
      
      // Fetch customer statistics
      try {
        const statsResponse = await axiosInstance.get(`/api/Customer/${customerId}/statistics`);
        setCustomerStats(statsResponse.data);
      } catch (statsError) {
        console.error('Error fetching customer statistics:', statsError);
        // Don't show toast for stats error as it's secondary data
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
    }
  };

  // Search customers
  const searchCustomers = async () => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/Customer/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
    } finally {
      setLoading(false);
    }
  };

  // Handle customer selection
  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(null); // Clear previous selection
    setCustomerStats(null); // Clear previous stats
    await fetchCustomerDetails(customer.id);
  };

  // Render star rating
  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  // Filter customers locally for quick search
  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.pincode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search term is empty, reset to all products
    if (!value.trim()) {
      fetchCustomers();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} activeView={activeView} />

      {/* Main Content */}
      <div className="flex-1 p-6 text-black">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-2">Manage and view customer information, orders, and reviews</p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search customers by name, email, phone, address, or pincode..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && searchCustomers()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={searchCustomers}
              className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition font-medium"
            >
              Search
            </button>
            <button
              onClick={fetchCustomers}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#586330]"></div>
            <p className="text-gray-600 mt-2">Loading customers...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
                <span className="bg-[#586330] text-white px-2 py-1 rounded-full text-sm">
                  {filteredCustomers.length} customers
                </span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => handleCustomerSelect(customer)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCustomer?.id === customer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{customer.fullName}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phoneNumber}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined: {formatDate(customer.joinDate)}
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>{customer.address}, {customer.pincode}</p>
                    </div>
                    {customer.orders && customer.orders.length > 0 && (
                      <div className="mt-2 text-xs text-blue-600">
                        {customer.orders.length} order(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-2">
            {selectedCustomer ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* Customer Header with Stats */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.fullName}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span>📧 {selectedCustomer.email}</span>
                      <span>📞 {selectedCustomer.phoneNumber}</span>
                      <span>📅 Joined: {formatDate(selectedCustomer.joinDate)}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>📍 {selectedCustomer.address}, {selectedCustomer.pincode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-[#586330]/20 text-[#586330]/80 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedCustomer.orders?.length || 0} Orders
                    </span>
                    {customerStats && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Total Spent: {formatCurrency(customerStats.totalSpent)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Statistics */}
                {customerStats && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-600">{customerStats.totalOrders}</div>
                        <div className="text-xs text-blue-800">Total Orders</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-green-600">{customerStats.completedOrders}</div>
                        <div className="text-xs text-green-800">Completed</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-yellow-600">{customerStats.pendingOrders}</div>
                        <div className="text-xs text-yellow-800">Pending</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(customerStats.averageOrderValue)}</div>
                        <div className="text-xs text-purple-800">Avg Order</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders and Reviews */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Orders & Reviews</h3>
                    <span className="text-sm text-gray-500">
                      {selectedCustomer.orders?.length || 0} orders
                    </span>
                  </div>
                  
                  {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                    selectedCustomer.orders.map((order, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <img
                            src={order.productImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}
                            alt={order.productName}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
                            }}
                          />
                          
                          {/* Order Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-800">{order.productName}</h4>
                                <p className="text-sm text-gray-600">
                                  Quantity: {order.quantity} 
                                </p>
                                <p className="text-sm text-gray-500">
                                  Ordered: {formatDate(order.orderDate)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Status: <span className={`font-medium ${
                                    order.status === 'Delivered' ? 'text-green-600' : 
                                    order.status === 'Pending' ? 'text-yellow-600' : 'text-blue-600'
                                  }`}>
                                    {order.status}
                                  </span>
                                </p>
                              </div>
                              <span className="text-lg font-bold text-[#586330]">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>

                            {/* Review Section */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              {order.review ? (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-700">Customer Review:</span>
                                    {renderRating(order.review.rating)}
                                  </div>
                                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                    "{order.review.comment}"
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 text-right">
                                    Reviewed on {formatDate(order.review.reviewDate)}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center py-3">
                                  <span className="text-gray-500 text-sm">
                                    No review submitted yet
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders</h3>
                      <p className="text-gray-500">
                        This customer hasn't placed any orders yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Invoices Section */}
                {selectedCustomer.invoices && selectedCustomer.invoices.length > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Invoices</h3>
                      <span className="text-sm text-gray-500">
                        {selectedCustomer.invoices.length} invoices
                      </span>
                    </div>
                    <div className="space-y-3">
                      {selectedCustomer.invoices.map((invoice, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-medium text-gray-800">{invoice.invoiceId}</p>
                            <p className="text-sm text-gray-600">
                              Date: {formatDate(invoice.date)} | Due: {formatDate(invoice.dueDate)}
                            </p>
                            {invoice.notes && (
                              <p className="text-xs text-gray-500 mt-1">{invoice.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{formatCurrency(invoice.amount)}</p>
                            <span className={`text-sm ${
                              invoice.status === 'Paid' ? 'text-green-600' : 
                              invoice.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payments Section */}
                {selectedCustomer.payments && selectedCustomer.payments.length > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Payments</h3>
                      <span className="text-sm text-gray-500">
                        {selectedCustomer.payments.length} payments
                      </span>
                    </div>
                    <div className="space-y-3">
                      {selectedCustomer.payments.map((payment, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-medium text-gray-800">{payment.paymentId}</p>
                            <p className="text-sm text-gray-600">
                              {payment.method} • {formatDate(payment.date)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Transaction: {payment.transactionId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{formatCurrency(payment.amount)}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${
                                payment.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                                {payment.status}
                              </span>
                              {payment.isRefunded && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                  Refunded
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Customer</h3>
                <p className="text-gray-500">
                  Choose a customer from the list to view their details, orders, and reviews
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Empty State for No Customers */}
        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No customers found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No customers in the system yet'}
            </p>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Customers;