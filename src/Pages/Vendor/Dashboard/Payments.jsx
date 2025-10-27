import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
  const navigate = useNavigate();
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };
const activeView = 'payments';
  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      customer: {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com'
      },
      amount: 30500,
      date: '2024-03-16',
      method: 'credit_card', // credit_card, debit_card, upi, bank_transfer, cash
      status: 'completed', // completed, pending, failed, refunded
      transactionId: 'TXN_789012345',
      items: [
        {
          productName: 'Modern Chair',
          quantity: 2,
          price: 12000
        },
        {
          productName: 'Coffee Table',
          quantity: 1,
          price: 8000
        }
      ],
      fees: 150,
      netAmount: 30350
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-002',
      customer: {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com'
      },
      amount: 27000,
      date: '2024-03-19',
      method: 'upi',
      status: 'pending',
      transactionId: 'TXN_789012346',
      items: [
        {
          productName: 'Queen Size Bed',
          quantity: 1,
          price: 25000
        }
      ],
      fees: 135,
      netAmount: 26865
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-003',
      customer: {
        id: 3,
        name: 'Mike Chen',
        email: 'mike.chen@email.com'
      },
      amount: 66600,
      date: '2024-03-11',
      method: 'bank_transfer',
      status: 'failed',
      transactionId: 'TXN_789012347',
      items: [
        {
          productName: 'Modern Chair',
          quantity: 4,
          price: 12000
        },
        {
          productName: 'Dining Table',
          quantity: 1,
          price: 18000
        }
      ],
      fees: 333,
      netAmount: 66267,
      failureReason: 'Insufficient funds'
    },
    {
      id: 'PAY-004',
      invoiceId: 'INV-004',
      customer: {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.davis@email.com'
      },
      amount: 45000,
      date: '2024-03-20',
      method: 'debit_card',
      status: 'refunded',
      transactionId: 'TXN_789012348',
      refundId: 'REF_789012349',
      items: [
        {
          productName: 'Sofa Set',
          quantity: 1,
          price: 45000
        }
      ],
      fees: 225,
      netAmount: 44775,
      refundDate: '2024-03-22',
      refundReason: 'Customer changed mind'
    },
    {
      id: 'PAY-005',
      invoiceId: 'INV-005',
      customer: {
        id: 5,
        name: 'Robert Wilson',
        email: 'robert.w@email.com'
      },
      amount: 18900,
      date: '2024-03-21',
      method: 'cash',
      status: 'completed',
      transactionId: 'CASH_789012350',
      items: [
        {
          productName: 'Office Desk',
          quantity: 1,
          price: 18900
        }
      ],
      fees: 0,
      netAmount: 18900
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Payment method configuration
  const paymentMethods = {
    credit_card: { name: 'Credit Card', icon: '💳', color: 'bg-purple-100 text-purple-800' },
    debit_card: { name: 'Debit Card', icon: '💳', color: 'bg-blue-100 text-blue-800' },
    upi: { name: 'UPI', icon: '📱', color: 'bg-green-100 text-green-800' },
    bank_transfer: { name: 'Bank Transfer', icon: '🏦', color: 'bg-indigo-100 text-indigo-800' },
    cash: { name: 'Cash', icon: '💵', color: 'bg-green-100 text-green-800' }
  };

  // Status configuration
  const statusConfig = {
    completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate totals
  const calculateTotals = () => {
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalFees = completedPayments.reduce((sum, payment) => sum + payment.fees, 0);
    const netRevenue = completedPayments.reduce((sum, payment) => sum + payment.netAmount, 0);
    
    return { totalRevenue, totalFees, netRevenue };
  };

  const { totalRevenue, totalFees, netRevenue } = calculateTotals();

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Method badge component
  const MethodBadge = ({ method }) => {
    const config = paymentMethods[method] || paymentMethods.credit_card;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center space-x-1`}>
        <span>{config.icon}</span>
        <span>{config.name}</span>
      </span>
    );
  };

  // Handle payment actions
  const handleRefund = (payment) => {
    if (payment.status !== 'completed') {
      toast.error('Only completed payments can be refunded');
      return;
    }
    
    const refundAmount = prompt(`Enter refund amount for ${payment.id}:`, payment.amount);
    if (refundAmount && !isNaN(refundAmount)) {
      toast.success(`Refund of ₹${refundAmount} processed for ${payment.customer.name}`);
      // In real app, this would update the payment status
    }
  };

  const handleRetryPayment = (payment) => {
    if (payment.status !== 'failed') {
      toast.error('Only failed payments can be retried');
      return;
    }
    
    toast.info(`Retrying payment ${payment.id} for ${payment.customer.name}`);
    // In real app, this would trigger payment retry logic
  };

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
    return `₹${amount.toLocaleString()}`;
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">From completed payments</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processing Fees</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalFees)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💸</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Total fees deducted</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(netRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">After fees deduction</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by payment ID, customer, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Methods</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                            <div className="text-sm text-gray-500">Invoice: {payment.invoiceId}</div>
                            <div className="text-xs text-gray-400">TXN: {payment.transactionId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.customer.name}</div>
                          <div className="text-sm text-gray-500">{payment.customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                          {payment.fees > 0 && (
                            <div className="text-xs text-gray-500">Fees: {formatCurrency(payment.fees)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <MethodBadge method={payment.method} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            {payment.status === 'completed' && (
                              <button
                                onClick={() => handleRefund(payment)}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Refund
                              </button>
                            )}
                            {payment.status === 'failed' && (
                              <button
                                onClick={() => handleRetryPayment(payment)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">💳</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No payments found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
                      ? 'Try adjusting your search or filters' 
                      : 'No payment transactions yet'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          // Payment Detail View
          selectedPayment && (
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <button
                    onClick={handleBackToList}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                  >
                    ← Back to Payments
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800">{selectedPayment.id}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <StatusBadge status={selectedPayment.status} />
                    <MethodBadge method={selectedPayment.method} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {formatCurrency(selectedPayment.amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Net: {formatCurrency(selectedPayment.netAmount)}
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
                      <span className="font-mono font-medium">{selectedPayment.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice ID:</span>
                      <span className="font-medium">{selectedPayment.invoiceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">{new Date(selectedPayment.date).toLocaleDateString()}</span>
                    </div>
                    {selectedPayment.refundDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refund Date:</span>
                        <span className="font-medium">{new Date(selectedPayment.refundDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedPayment.refundId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refund ID:</span>
                        <span className="font-mono font-medium">{selectedPayment.refundId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div>
                      <p className="font-semibold text-gray-800">{selectedPayment.customer.name}</p>
                      <p className="text-gray-600">{selectedPayment.customer.email}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Customer since:</p>
                      <p className="text-sm font-medium">March 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Amount Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fees:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedPayment.fees)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Net Amount:</span>
                      <span className="text-green-600">{formatCurrency(selectedPayment.netAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Items Purchased</h3>
                <div className="space-y-3">
                  {selectedPayment.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price)} each</p>
                        <p className="text-sm text-gray-600">
                          Total: {formatCurrency(item.quantity * item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              {(selectedPayment.failureReason || selectedPayment.refundReason) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {selectedPayment.failureReason ? 'Failure Reason' : 'Refund Reason'}
                  </h4>
                  <p className="text-yellow-700">
                    {selectedPayment.failureReason || selectedPayment.refundReason}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                {selectedPayment.status === 'completed' && (
                  <button
                    onClick={() => handleRefund(selectedPayment)}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Process Refund
                  </button>
                )}
                {selectedPayment.status === 'failed' && (
                  <button
                    onClick={() => handleRetryPayment(selectedPayment)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Retry Payment
                  </button>
                )}
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Download Receipt
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