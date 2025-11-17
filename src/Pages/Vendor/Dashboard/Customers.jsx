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
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  const activeView = 'customers';

  // Fetch customers who ordered vendor's products
  useEffect(() => {
    fetchVendorCustomers();
  }, []);

  const fetchVendorCustomers = async () => {
    try {
      setLoading(true);
      // CORRECTED: Fetch only customers who ordered THIS vendor's products
      const response = await axiosInstance.get('/Vendor/customers-with-orders');
      console.log('Vendor Customers API Response:', response.data);
      
      // Map the API response
      const customersData = response.data.Customers?.map(customer => ({
        id: customer.CustomerId,
        customerId: customer.CustomerId,
        userId: customer.UserId,
        fullName: customer.FullName,
        email: customer.Email,
        phoneNumber: customer.PhoneNumber,
        address: customer.Address,
        pincode: customer.Pincode,
        role: customer.Role,
        isBlocked: customer.IsBlocked,
        joinDate: customer.CreatedOn,
        isRegistrationComplete: customer.IsRegistrationComplete,
        // Include order statistics from vendor's products
        totalOrders: customer.TotalOrders || 0,
        totalSpent: customer.TotalSpent || 0,
        lastOrderDate: customer.LastOrderDate,
        orders: customer.Orders || [],
        invoices: customer.Invoices || [],
        payments: customer.Payments || []
      })) || [];
      
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching vendor customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer details with vendor-specific orders
  const fetchCustomerDetails = async (customerId) => {
    try {
      // CORRECTED: Fetch customer details with only THIS vendor's orders
      const response = await axiosInstance.get(`/Vendor/customers/${customerId}/details`);
      console.log('Customer details response:', response.data);
      
      const customerData = response.data;
      const mappedCustomer = {
        id: customerData.CustomerId,
        customerId: customerData.CustomerId,
        userId: customerData.UserId,
        fullName: customerData.FullName,
        email: customerData.Email,
        phoneNumber: customerData.PhoneNumber,
        address: customerData.Address,
        pincode: customerData.Pincode,
        role: customerData.Role,
        isBlocked: customerData.IsBlocked,
        joinDate: customerData.CreatedOn,
        isRegistrationComplete: customerData.IsRegistrationComplete,
        // Include vendor-specific order data
        orders: customerData.Orders || [],
        invoices: customerData.Invoices || [],
        payments: customerData.Payments || []
      };
      
      setSelectedCustomer(mappedCustomer);
      
      // Calculate statistics from vendor-specific orders
      const stats = {
        totalOrders: customerData.Orders?.length || 0,
        completedOrders: customerData.Orders?.filter(o => o.Status === 'Completed').length || 0,
        pendingOrders: customerData.Orders?.filter(o => o.Status === 'Pending' || o.Status === 'Processing').length || 0,
        totalSpent: customerData.Orders?.reduce((sum, order) => sum + (order.TotalAmount || 0), 0) || 0,
        averageOrderValue: customerData.Orders?.length > 0 
          ? customerData.Orders.reduce((sum, order) => sum + (order.TotalAmount || 0), 0) / customerData.Orders.length 
          : 0
      };
      setCustomerStats(stats);
      
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
    }
  };

  // Search customers (only among those who ordered vendor's products)
  const searchCustomers = async () => {
    if (!searchTerm.trim()) {
      fetchVendorCustomers();
      return;
    }

    try {
      setLoading(true);
      // CORRECTED: Search only within vendor's customers
      const response = await axiosInstance.get(`/Vendor/customers-with-orders/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      
      const customersData = response.data.Customers?.map(customer => ({
        id: customer.CustomerId,
        customerId: customer.CustomerId,
        userId: customer.UserId,
        fullName: customer.FullName,
        email: customer.Email,
        phoneNumber: customer.PhoneNumber,
        address: customer.Address,
        pincode: customer.Pincode,
        role: customer.Role,
        isBlocked: customer.IsBlocked,
        joinDate: customer.CreatedOn,
        isRegistrationComplete: customer.IsRegistrationComplete,
        totalOrders: customer.TotalOrders || 0,
        totalSpent: customer.TotalSpent || 0,
        lastOrderDate: customer.LastOrderDate,
        orders: customer.Orders || []
      })) || [];
      
      setCustomers(customersData);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(null);
    setCustomerStats(null);
    await fetchCustomerDetails(customer.customerId);
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      fetchVendorCustomers();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} activeView={activeView} />

      <div className="flex-1 p-6 text-black">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Customers</h1>
          <p className="text-gray-600 mt-2">Customers who ordered your products</p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search your customers by name, email, phone, address, or pincode..."
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
                    key={customer.customerId}
                    onClick={() => handleCustomerSelect(customer)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCustomer?.customerId === customer.customerId
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
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        customer.isBlocked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>{customer.address}, {customer.pincode}</p>
                    </div>
                    {customer.totalOrders > 0 && (
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {customer.totalOrders} orders
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {formatCurrency(customer.totalSpent)}
                        </span>
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
                    <div className="mt-2 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedCustomer.isBlocked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedCustomer.isBlocked ? 'Account Blocked' : 'Account Active'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-[#586330]/20 text-[#586330]/80 px-3 py-1 rounded-full text-sm font-medium">
                      Customer ID: {selectedCustomer.customerId}
                    </span>
                  </div>
                </div>

                {/* Customer Statistics (Vendor-specific) */}
                {customerStats && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Statistics (Your Products)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(customerStats.totalSpent)}</div>
                        <div className="text-xs text-purple-800">Total Spent</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-indigo-600">{formatCurrency(customerStats.averageOrderValue)}</div>
                        <div className="text-xs text-indigo-800">Avg Order</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order History */}
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order History</h3>
                    <div className="space-y-3">
                      {selectedCustomer.orders.map((order) => (
                        <div key={order.OrderId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Order #{order.OrderId}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.OrderDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#586330]">{formatCurrency(order.TotalAmount)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                                order.Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.Status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) && (
                  <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500">
                      This customer hasn't placed any orders for your products
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Customer</h3>
                <p className="text-gray-500">
                  Choose a customer from the list to view their order details
                </p>
              </div>
            )}
          </div>
        </div>

        

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Customers;