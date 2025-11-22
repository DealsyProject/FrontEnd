import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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

  // Fetch all vendor customers
  useEffect(() => {
    fetchVendorCustomers();
  }, []);

  const fetchVendorCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Vendor/customers-with-orders');
      console.log('Vendor Customers API Response:', response.data);

      // API returns: { TotalCount, Customers: [...] }
      const customersData = (response.data.customers || response.data.Customers || []).map(customer => ({
        customerId: customer.customerId || customer.CustomerId,
        userId: customer.userId || customer.UserId,
        fullName: customer.fullName || customer.FullName,
        email: customer.email || customer.Email,
        phoneNumber: customer.phoneNumber || customer.PhoneNumber,
        address: customer.address || customer.Address,
        pincode: customer.pincode || customer.Pincode,
        role: customer.role || customer.Role,
        isBlocked: customer.isBlocked || customer.IsBlocked,
        createdOn: customer.createdOn || customer.CreatedOn,
        isRegistrationComplete: customer.isRegistrationComplete || customer.IsRegistrationComplete,
        totalOrders: customer.totalOrders || customer.TotalOrders || 0,
        totalSpent: customer.totalSpent || customer.TotalSpent || 0,
        lastOrderDate: customer.lastOrderDate || customer.LastOrderDate,
        orders: customer.orders || customer.Orders || [],
        invoices: customer.invoices || customer.Invoices || [],
        payments: customer.payments || customer.Payments || []
      }));

      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching vendor customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Search customers via API
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchVendorCustomers();
      return;
    }

    try {
      setLoading(true);
      // If you have a search endpoint, use it:
      // const response = await axiosInstance.get(`/Vendor/search-customers?searchTerm=${searchTerm}`);
      // Otherwise, filter client-side
      const filtered = customers.filter(customer =>
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber?.includes(searchTerm) ||
        customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.pincode?.includes(searchTerm)
      );
      setCustomers(filtered);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    const stats = {
      totalOrders: customer.totalOrders,
      completedOrders: customer.orders.filter(o => 
        ['Completed', 'Delivered', 'Confirmed'].includes(o.status || o.Status)
      ).length,
      pendingOrders: customer.orders.filter(o => 
        ['Pending', 'Processing'].includes(o.status || o.Status)
      ).length,
      totalSpent: customer.totalSpent,
      averageOrderValue: customer.totalOrders > 0 
        ? (customer.totalSpent / customer.totalOrders).toFixed(2)
        : 0
    };
    setCustomerStats(stats);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber?.includes(searchTerm) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.pincode?.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar handleLogout={handleLogout} activeView={activeView} />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Customers</h1>
          <p className="text-gray-600 mt-1">View customers who purchased your products</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name, email, phone, address or pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#5A3E3E] transition font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#586330]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#586330] text-white p-4">
                  <h2 className="text-xl font-semibold">Customers ({filteredCustomers.length})</h2>
                </div>
                <div className="max-h-screen overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-lg">No customers found</p>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.customerId}
                        onClick={() => handleCustomerSelect(customer)}
                        className={`p-5 border-b border-gray-200 cursor-pointer transition-all hover:bg-[#F5F1E8] ${
                          selectedCustomer?.customerId === customer.customerId 
                            ? 'bg-[#F5F1E8] border-l-4 border-l-[#586330]' 
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{customer.fullName}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            customer.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {customer.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {customer.totalOrders} orders
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            {formatCurrency(customer.totalSpent)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Customer Details Panel */}
            <div className="lg:col-span-2">
              {selectedCustomer ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.fullName}</h2>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span>Email: {selectedCustomer.email}</span>
                        <span>Phone: {selectedCustomer.phoneNumber}</span>
                        <span>
                          Location: {selectedCustomer.address}, Pin: {selectedCustomer.pincode}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCustomer.isBlocked 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedCustomer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  {customerStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{customerStats.totalOrders}</div>
                        <div className="text-xs text-blue-800">Total Orders</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{customerStats.completedOrders}</div>
                        <div className="text-xs text-green-800">Completed</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600">{customerStats.pendingOrders}</div>
                        <div className="text-xs text-yellow-800">Pending</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(customerStats.totalSpent)}</div>
                        <div className="text-xs text-purple-800">Total Spent</div>
                      </div>
                    </div>
                  )}

                  {/* Orders List */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Order History ({selectedCustomer.orders.length})
                    </h3>
                    {selectedCustomer.orders.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCustomer.orders.map((order) => {
                          const orderStatus = order.status || order.Status;
                          const productName = order.productName || order.ProductName;
                          const quantity = order.quantity || order.Quantity;
                          const price = order.price || order.Price;
                          const totalAmount = order.totalAmount || order.TotalAmount;
                          const productImage = order.productImage || order.ProductImage;
                          const productBookingDate = order.productBookingDate || order.ProductBookingDate;

                          return (
                            <div key={order.orderId || order.OrderId} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    {productImage && (
                                      <img 
                                        src={productImage} 
                                        alt={productName}
                                        className="w-16 h-16 object-cover rounded-lg"
                                      />
                                    )}
                                    <div>
                                      <p className="font-semibold text-gray-800">{productName}</p>
                                      <p className="text-sm text-gray-600">
                                        Qty: {quantity} × {formatCurrency(price)}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Booked on {formatDate(productBookingDate)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-[#586330]">{formatCurrency(totalAmount)}</p>
                                  <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                    orderStatus === 'Completed' || orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {orderStatus}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No orders from this customer yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-16 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">Select a Customer</h3>
                  <p className="text-gray-500">Click on a customer from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;


