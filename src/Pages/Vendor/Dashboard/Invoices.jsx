import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const navigate = useNavigate();
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  const activeView = 'invoices';
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      customer: {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      date: '2024-03-15',
      dueDate: '2024-04-15',
      status: 'paid', // paid, pending, overdue
      items: [
        {
          id: 1,
          productName: 'Modern Chair',
          description: 'Comfortable modern chair with ergonomic design',
          quantity: 2,
          unitPrice: 12000,
          productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
        },
        {
          id: 2,
          productName: 'Coffee Table',
          description: 'Glass top coffee table with wooden legs',
          quantity: 1,
          unitPrice: 8000,
          productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
        }
      ],
      taxRate: 10,
      shipping: 500,
      notes: 'Thank you for your business!'
    },
    {
      id: 'INV-002',
      customer: {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 987-6543',
        address: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      date: '2024-03-18',
      dueDate: '2024-04-18',
      status: 'pending',
      items: [
        {
          id: 3,
          productName: 'Queen Size Bed',
          description: 'Luxury queen size bed with memory foam mattress',
          quantity: 1,
          unitPrice: 25000,
          productImage: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171'
        }
      ],
      taxRate: 8,
      shipping: 750,
      notes: 'Delivery within 5-7 business days'
    },
    {
      id: 'INV-003',
      customer: {
        id: 3,
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 456-7890',
        address: {
          street: '789 Pine Road',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        }
      },
      date: '2024-03-10',
      dueDate: '2024-03-25',
      status: 'overdue',
      items: [
        {
          id: 1,
          productName: 'Modern Chair',
          description: 'Comfortable modern chair with ergonomic design',
          quantity: 4,
          unitPrice: 12000,
          productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
        },
        {
          id: 4,
          productName: 'Dining Table',
          description: '6-seater wooden dining table',
          quantity: 1,
          unitPrice: 18000,
          productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
        }
      ],
      taxRate: 10,
      shipping: 1000,
      notes: 'Please make payment within due date'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Calculate invoice totals
  const calculateInvoiceTotals = (invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const total = subtotal + taxAmount + invoice.shipping;
    return { subtotal, taxAmount, total };
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Print invoice
  const handlePrintInvoice = (invoice) => {
    toast.info('Print functionality would be implemented here');
    // In a real app, this would open print dialog or generate PDF
  };

  // Send invoice
  const handleSendInvoice = (invoice) => {
    toast.success(`Invoice ${invoice.id} sent to ${invoice.customer.email}`);
  };

  // View invoice details
  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('detail');
  };

  // Back to list view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInvoice(null);
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
              <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
              <p className="text-gray-600 mt-2">Manage and view all customer invoices</p>
            </header>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by invoice ID, customer name, or email..."
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
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                    {filteredInvoices.map((invoice) => {
                      const { total } = calculateInvoiceTotals(invoice);
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{invoice.customer.name}</div>
                            <div className="text-sm text-gray-500">{invoice.customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ₹{total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={invoice.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(invoice)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handlePrintInvoice(invoice)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Print
                              </button>
                              <button
                                onClick={() => handleSendInvoice(invoice)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Send
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No invoices found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'No invoices have been created yet'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          // Invoice Detail View
          selectedInvoice && (
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <button
                    onClick={handleBackToList}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                  >
                    ← Back to Invoices
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800">Invoice {selectedInvoice.id}</h1>
                  <StatusBadge status={selectedInvoice.status} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    ₹{calculateInvoiceTotals(selectedInvoice).total.toLocaleString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePrintInvoice(selectedInvoice)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleSendInvoice(selectedInvoice)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Send to Customer
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* From Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">From:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">Dealsy Furniture Store</p>
                    <p>123 Business Avenue</p>
                    <p>Mumbai, MH 400001</p>
                    <p>India</p>
                    <p>contact@dealsy.com</p>
                    <p>+91 98765 43210</p>
                  </div>
                </div>

                {/* To Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{selectedInvoice.customer.name}</p>
                    <p>{selectedInvoice.customer.email}</p>
                    <p>{selectedInvoice.customer.phone}</p>
                    <p>{selectedInvoice.customer.address.street}</p>
                    <p>
                      {selectedInvoice.customer.address.city}, {selectedInvoice.customer.address.state} {selectedInvoice.customer.address.zipCode}
                    </p>
                    <p>{selectedInvoice.customer.address.country}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
                <div>
                  <p className="text-gray-600">Invoice Date</p>
                  <p className="font-semibold">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-semibold">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tax Rate</p>
                  <p className="font-semibold">{selectedInvoice.taxRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-semibold">₹{selectedInvoice.shipping.toLocaleString()}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                              <span className="font-medium">{item.productName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">₹{item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-3 font-semibold">
                            ₹{(item.quantity * item.unitPrice).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{calculateInvoiceTotals(selectedInvoice).subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({selectedInvoice.taxRate}%):</span>
                        <span>₹{calculateInvoiceTotals(selectedInvoice).taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{selectedInvoice.shipping.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{calculateInvoiceTotals(selectedInvoice).total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Invoices;