import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const navigate = useNavigate();
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

   const activeView = 'customers';

  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      orders: [
        { 
          productId: 1, 
          productName: 'Modern Chair', 
          productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
          quantity: 2,
          price: 12000,
          orderDate: '2024-03-10',
          review: {
            rating: 4,
            comment: 'Very comfortable chair, good quality!',
            date: '2024-03-15'
          }
        },
        { 
          productId: 2, 
          productName: 'Queen Size Bed', 
          productImage: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
          quantity: 1,
          price: 8000,
          orderDate: '2024-03-12',
          review: {
            rating: 5,
            comment: 'Excellent bed, very comfortable and good value for money.',
            date: '2024-03-18'
          }
        }
      ]
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      joinDate: '2024-02-20',
      orders: [
        { 
          productId: 1, 
          productName: 'Modern Chair', 
          productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
          quantity: 1,
          price: 12000,
          orderDate: '2024-03-14',
          review: {
            rating: 3,
            comment: 'Good chair but delivery was delayed.',
            date: '2024-03-20'
          }
        }
      ]
    },
    { 
      id: 3, 
      name: 'Mike Chen', 
      email: 'mike.chen@email.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-01-08',
      orders: [
        { 
          productId: 2, 
          productName: 'Queen Size Bed', 
          productImage: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
          quantity: 1,
          price: 8000,
          orderDate: '2024-03-08',
          review: null // No review yet
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Search logic
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.orders.some(order => 
      order.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
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
          <input
            type="text"
            placeholder="Search customers by name, email, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer List</h2>
              <div className="space-y-3">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => handleCustomerSelect(customer)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCustomer?.id === customer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {customer.orders.length} order
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span>📧 {selectedCustomer.email}</span>
                      <span>📞 {selectedCustomer.phone}</span>
                      <span>📅 Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="bg-[#586330]/20 text-[#586330]/80 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCustomer.orders.length} Orders
                  </span>
                </div>

                {/* Orders and Reviews */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Orders & Reviews
                  </h3>
                  
                  {selectedCustomer.orders.map((order, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-20 h-20 object-cover rounded-lg"
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
                                Ordered: {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-lg font-bold text-[#586330]">
                              ₹{(order.quantity * order.price).toLocaleString()}
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
                                  Reviewed on {new Date(order.review.date).toLocaleDateString()}
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
                  ))}
                </div>
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
        {filteredCustomers.length === 0 && (
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