import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Components/utils/axiosInstance';

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productPurchasedFilter, setProductPurchasedFilter] = useState('all');
  const [returnProductFilter, setReturnProductFilter] = useState('all');
  const [refundFilter, setRefundFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [stats, setStats] = useState(null);
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  const activeView = 'payments';

  // Fetch payments from customer data
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/Customer/all');
      const customers = response.data.customers || [];
      
      // Extract payments from all customers
      const allPayments = [];
      customers.forEach(customer => {
        if (customer.payments && customer.payments.length > 0) {
          customer.payments.forEach(payment => {
            // Find corresponding order for this payment
            const relatedOrder = customer.orders?.find(order => 
              order.totalAmount === payment.amount || 
              order.orderDate === payment.date
            );

            allPayments.push({
              ...payment,
              customer: {
                id: customer.id,
                name: customer.fullName,
                email: customer.email,
                phone: customer.phoneNumber,
                address: customer.address,
                pincode: customer.pincode
              },
              // Enhanced data mapping
              productPurchased: payment.status === 'Completed' ? 'paid' : 'pending',
              returnProduct: payment.isRefunded ? 'completed' : (relatedOrder?.status === 'Processing' ? 'processing' : 'pending'),
              fees: payment.amount * 0.02, // 2% fee
              netAmount: payment.amount * 0.98, // After 2% fee
              items: relatedOrder ? [
                {
                  productName: relatedOrder.productName,
                  productImage: relatedOrder.productImage,
                  quantity: relatedOrder.quantity,
                  price: relatedOrder.price,
                  total: relatedOrder.totalAmount
                }
              ] : [
                {
                  productName: 'Product Purchase',
                  quantity: 1,
                  price: payment.amount
                }
              ],
              // Add additional fields for better UI
              orderDate: relatedOrder?.orderDate || payment.date,
              deliveryDate: relatedOrder?.deliveryDate || null
            });
          });
        }
      });
      
      setPayments(allPayments);
      calculateStatistics(allPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate simplified statistics - ONLY 3 METRICS
  const calculateStatistics = (paymentData) => {
    const paidPayments = paymentData.filter(p => p.productPurchased === 'paid');
    const totalRevenue = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate refunded amount
    const refundedPayments = paymentData.filter(p => p.isRefunded);
    const totalRefunded = refundedPayments.reduce((sum, payment) => sum + payment.amount, 0);

    setStats({
      totalRevenue,
      totalRefunded,
      totalPayments: paymentData.length
    });
  };

  // Payment method configuration
  const paymentMethods = {
    credit_card: { name: 'Credit Card', icon: '💳', color: 'bg-purple-100 text-purple-800' },
    debit_card: { name: 'Debit Card', icon: '💳', color: 'bg-blue-100 text-blue-800' },
    upi: { name: 'UPI', icon: '📱', color: 'bg-green-100 text-green-800' },
    bank_transfer: { name: 'Bank Transfer', icon: '🏦', color: 'bg-indigo-100 text-indigo-800' },
    cash: { name: 'Cash', icon: '💵', color: 'bg-green-100 text-green-800' },
    wallet: { name: 'Wallet', icon: '👛', color: 'bg-orange-100 text-orange-800' }
  };

  // Product Purchased Status configuration
  const productPurchasedConfig = {
    paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800', label: 'Failed' }
  };

  // Return Product Status configuration
  const returnProductConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
  };

  // Refund status configuration
  const refundConfig = {
    true: { color: 'bg-red-100 text-red-800', label: 'Refunded' },
    false: { color: 'bg-green-100 text-green-800', label: 'Not Refunded' }
  };

  // Status badge components
  const ProductPurchasedBadge = ({ status }) => {
    const config = productPurchasedConfig[status] || productPurchasedConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const ReturnProductBadge = ({ status }) => {
    if (!status) return null;
    const config = returnProductConfig[status] || returnProductConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const RefundBadge = ({ isRefunded }) => {
    const config = refundConfig[isRefunded];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const MethodBadge = ({ method }) => {
    const config = paymentMethods[method] || paymentMethods.credit_card;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center space-x-1`}>
        <span>{config.icon}</span>
        <span>{config.name}</span>
      </span>
    );
  };

  // Handle refund toggle with API call - WITH PAYMENT VALIDATION
const handleRefundToggle = async (paymentId) => {
  try {
    const payment = payments.find(p => p.paymentId === paymentId);
    if (!payment) return;

    // Check if payment is actually paid before allowing refund
    if (payment.productPurchased !== 'paid') {
      toast.error(`Cannot process refund: Payment status is ${payment.productPurchased}`);
      return;
    }

    // Check if payment is already completed/successful
    if (payment.status !== 'Completed' && payment.status !== 'Success') {
      toast.error('Cannot process refund: Payment was not successful');
      return;
    }

    const newRefundStatus = !payment.isRefunded;
    
    // Update payments state
    setPayments(prevPayments => {
      const updatedPayments = prevPayments.map(payment => {
        if (payment.paymentId === paymentId) {
          const updatedPayment = {
            ...payment,
            isRefunded: newRefundStatus,
            returnProduct: newRefundStatus ? 'completed' : 'pending',
            refundId: newRefundStatus ? `REF_${Date.now()}` : null,
            refundDate: newRefundStatus ? new Date().toISOString().split('T')[0] : null,
            refundReason: newRefundStatus ? 'Manual refund processing' : null
          };

          if (newRefundStatus) {
            toast.success(`Payment ${paymentId} marked as refunded`);
          } else {
            toast.info(`Payment ${paymentId} marked as not refunded`);
          }

          return updatedPayment;
        }
        return payment;
      });

      // Recalculate statistics with the updated payments
      calculateStatistics(updatedPayments);
      
      return updatedPayments;
    });

    // Update selected payment if it's the one being modified
    if (selectedPayment && selectedPayment.paymentId === paymentId) {
      setSelectedPayment(prev => ({
        ...prev,
        isRefunded: newRefundStatus,
        returnProduct: newRefundStatus ? 'completed' : 'pending',
        refundId: newRefundStatus ? `REF_${Date.now()}` : null,
        refundDate: newRefundStatus ? new Date().toISOString().split('T')[0] : null,
        refundReason: newRefundStatus ? 'Manual refund processing' : null
      }));
    }

  } catch (error) {
    console.error('Error updating refund status:', error);
    toast.error('Failed to update refund status');
  }
};
  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProductPurchased = productPurchasedFilter === 'all' || payment.productPurchased === productPurchasedFilter;
    const matchesReturnProduct = returnProductFilter === 'all' || payment.returnProduct === returnProductFilter;
    const matchesRefund = refundFilter === 'all' || 
      (refundFilter === 'refunded' && payment.isRefunded) ||
      (refundFilter === 'not_refunded' && !payment.isRefunded);
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesProductPurchased && matchesReturnProduct && matchesRefund && matchesMethod;
  });

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPayment(null);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setProductPurchasedFilter('all');
    setReturnProductFilter('all');
    setRefundFilter('all');
    setMethodFilter('all');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} activeView={activeView} />

      {/* Main Content */}
      <div className="flex-1 p-6 text-black">
        {viewMode === 'list' ? (
          <>
            {/* Header */}
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
              <p className="text-gray-600 mt-2">Manage and track all payment transactions</p>
            </header>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#586330]"></div>
                <p className="text-gray-600 mt-2">Loading payments...</p>
              </div>
            )}

            {!loading && (
              <>
                {/* SIMPLIFIED Stats Cards - Only 3 metrics */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Revenue */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Payments */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Payments</p>
                          <p className="text-2xl font-bold text-gray-800">{stats.totalPayments}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Refunded */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Refunded</p>
                          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRefunded)}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">↩️</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Filters and Search */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search by payment ID, customer, transaction ID, or invoice..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <select
                        value={productPurchasedFilter}
                        onChange={(e) => setProductPurchasedFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                      <select
                        value={returnProductFilter}
                        onChange={(e) => setReturnProductFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Returns</option>
                        <option value="pending">Return Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                      <select
                        value={refundFilter}
                        onChange={(e) => setRefundFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Refund Status</option>
                        <option value="refunded">Refunded</option>
                        <option value="not_refunded">Not Refunded</option>
                      </select>
                      <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Methods</option>
                        {Object.entries(paymentMethods).map(([key, method]) => (
                          <option key={key} value={key}>{method.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleResetFilters}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                      >
                        Reset
                      </button>
                      <button
                        onClick={fetchPayments}
                        className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition font-medium"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Payments Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPayments.map((payment) => (
                          <tr key={payment.paymentId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{payment.paymentId}</div>
                                <div className="text-sm text-gray-500">Invoice: {payment.invoiceId}</div>
                                <div className="text-xs text-gray-400">TXN: {payment.transactionId}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDateTime(payment.date)}
                                </div>
                                {payment.returnReference && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Return: {payment.returnReference}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{payment.customer.name}</div>
                              <div className="text-sm text-gray-500">{payment.customer.email}</div>
                              <div className="text-xs text-gray-400">{payment.customer.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                              {payment.fees > 0 && (
                                <div className="text-xs text-gray-500">Fees: {formatCurrency(payment.fees)}</div>
                              )}
                              <div className="text-xs text-green-600">Net: {formatCurrency(payment.netAmount)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <MethodBadge method={payment.method} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <ProductPurchasedBadge status={payment.productPurchased} />
                                <ReturnProductBadge status={payment.returnProduct} />
                                <RefundBadge isRefunded={payment.isRefunded} />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex flex-col space-y-2">
                                <button
                                  onClick={() => handleViewDetails(payment)}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleRefundToggle(payment.paymentId)}
                                  disabled={payment.productPurchased !== 'paid'}
                                  className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                                    payment.productPurchased !== 'paid'
                                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                      : payment.isRefunded 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                  }`}
                                >
                                  {payment.isRefunded ? 'Mark Not Refunded' : 'Mark Refunded'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Empty State */}
                  {filteredPayments.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">💳</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No payments found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || productPurchasedFilter !== 'all' || returnProductFilter !== 'all' || refundFilter !== 'all' || methodFilter !== 'all'
                          ? 'Try adjusting your search or filters' 
                          : 'No payment transactions yet'}
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition font-medium"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          // Enhanced Payment Detail View
          selectedPayment && (
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <button
                    onClick={handleBackToList}
                    className="flex items-center text-[#586330] hover:text-[#586330]/80 mb-4 transition-colors"
                  >
                    ← Back to Payments
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800">{selectedPayment.paymentId}</h1>
                  <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
                    <ProductPurchasedBadge status={selectedPayment.productPurchased} />
                    <ReturnProductBadge status={selectedPayment.returnProduct} />
                    <RefundBadge isRefunded={selectedPayment.isRefunded} />
                    <MethodBadge method={selectedPayment.method} />
                  </div>
                  {selectedPayment.returnReference && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Linked Return: </span>
                      <span className="text-sm font-medium text-blue-600">{selectedPayment.returnReference}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {formatCurrency(selectedPayment.amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Net: {formatCurrency(selectedPayment.netAmount)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Fees: {formatCurrency(selectedPayment.fees)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono font-medium text-sm">{selectedPayment.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice ID:</span>
                      <span className="font-medium">{selectedPayment.invoiceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">{formatDateTime(selectedPayment.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(selectedPayment.orderDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <MethodBadge method={selectedPayment.method} />
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div>
                      <p className="font-semibold text-gray-800">{selectedPayment.customer.name}</p>
                      <p className="text-gray-600">{selectedPayment.customer.email}</p>
                      <p className="text-gray-500 text-sm">{selectedPayment.customer.phone}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Address:</p>
                      <p className="text-sm font-medium">
                        {selectedPayment.customer.address}, {selectedPayment.customer.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Amount Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Amount Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fees (2%):</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedPayment.fees)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Net Amount:</span>
                      <span className="text-green-600">{formatCurrency(selectedPayment.netAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Items Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Items Purchased</h3>
                <div className="space-y-4">
                  {selectedPayment.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{formatCurrency(item.total || item.quantity * item.price)}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No detailed item information available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Additional Information */}
              {(selectedPayment.failureReason || selectedPayment.refundReason || selectedPayment.refundId) && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    {selectedPayment.refundId && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Refund Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Refund ID:</span>
                            <span className="font-mono">{selectedPayment.refundId}</span>
                          </div>
                          {selectedPayment.refundDate && (
                            <div className="flex justify-between">
                              <span className="text-blue-700">Refund Date:</span>
                              <span>{formatDate(selectedPayment.refundDate)}</span>
                            </div>
                          )}
                          {selectedPayment.refundReason && (
                            <div>
                              <span className="text-blue-700">Reason: </span>
                              <span>{selectedPayment.refundReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedPayment.failureReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">Payment Status</h4>
                        <p className="text-red-700">{selectedPayment.failureReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleRefundToggle(selectedPayment.paymentId)}
                  disabled={selectedPayment.productPurchased !== 'paid'}
                  className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                    selectedPayment.productPurchased !== 'paid'
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : selectedPayment.isRefunded 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {selectedPayment.isRefunded ? 'Mark as Not Refunded' : 'Mark as Refunded'}
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Download Receipt
                </button>
                <button className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition font-medium">
                  Send Invoice
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                  Contact Customer
                </button>
              </div>
            </div>
          )
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Payments;