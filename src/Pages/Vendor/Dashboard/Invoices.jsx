import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Components/utils/axiosInstance';

const Invoices = () => {
  const navigate = useNavigate();
  const printRef = useRef();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  const activeView = 'invoices';

  // Fetch invoices from customer data
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/Customer/all');
      const customers = response.data.customers || [];
      
      // Extract invoices from all customers
      const allInvoices = [];
      customers.forEach(customer => {
        if (customer.invoices && customer.invoices.length > 0) {
          customer.invoices.forEach(invoice => {
            allInvoices.push({
              ...invoice,
              customer: {
                id: customer.id,
                name: customer.fullName,
                email: customer.email,
                phone: customer.phoneNumber,
                address: {
                  street: customer.address || 'Not specified',
                  city: 'Unknown',
                  state: 'Unknown',
                  zipCode: customer.pincode || '000000',
                  country: 'India'
                }
              }
            });
          });
        }
      });
      
      setInvoices(allInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate invoice totals
  const calculateInvoiceTotals = (invoice) => {
    const subtotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
    const taxRate = invoice.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const shipping = invoice.shipping || 0;
    const total = subtotal + taxAmount + shipping;
    return { subtotal, taxAmount, total };
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Print invoice function
  const handlePrintInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      const printContent = printRef.current;
      const printWindow = window.open('', '_blank');
      
      const { subtotal, taxAmount, total } = calculateInvoiceTotals(invoice);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice.invoiceId}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                color: #333;
              }
              .invoice-header { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .company-info h1 { 
                margin: 0; 
                color: #1f2937;
                font-size: 24px;
              }
              .invoice-info { 
                text-align: right; 
              }
              .invoice-details { 
                margin: 30px 0; 
              }
              .address-section { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 30px;
              }
              .address-box { 
                background: #f9fafb; 
                padding: 15px; 
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
              }
              th { 
                background: #f9fafb; 
                padding: 12px; 
                text-align: left; 
                border-bottom: 2px solid #e5e7eb;
                font-weight: 600;
              }
              td { 
                padding: 12px; 
                border-bottom: 1px solid #e5e7eb; 
              }
              .totals { 
                margin-top: 30px; 
                text-align: right; 
              }
              .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 8px 0;
                max-width: 300px;
                margin-left: auto;
              }
              .grand-total { 
                font-size: 18px; 
                font-weight: bold; 
                border-top: 2px solid #333;
                padding-top: 10px;
                margin-top: 10px;
              }
              .notes { 
                margin-top: 30px; 
                padding: 15px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
              }
              .status-paid { background: #dcfce7; color: #166534; }
              .status-pending { background: #fef9c3; color: #854d0e; }
              .status-overdue { background: #fee2e2; color: #991b1b; }
              @media print {
                body { margin: 0; padding: 15px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <div class="company-info">
                <h1>Dealsy Furniture Store</h1>
                <p>123 Business Avenue, Mumbai, MH 400001</p>
                <p>contact@dealsy.com | +91 98765 43210</p>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Invoice No:</strong> ${invoice.invoiceId}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                <span class="status-badge status-${invoice.status}">${invoice.status.toUpperCase()}</span>
              </div>
            </div>

            <div class="address-section">
              <div class="address-box">
                <strong>From:</strong><br/>
                Dealsy Furniture Store<br/>
                123 Business Avenue<br/>
                Mumbai, MH 400001<br/>
                India<br/>
                contact@dealsy.com<br/>
                +91 98765 43210
              </div>
              <div class="address-box">
                <strong>Bill To:</strong><br/>
                ${invoice.customer.name}<br/>
                ${invoice.customer.email}<br/>
                ${invoice.customer.phone}<br/>
                ${invoice.customer.address.street}<br/>
                ${invoice.customer.address.city}, ${invoice.customer.address.state} ${invoice.customer.address.zipCode}<br/>
                ${invoice.customer.address.country}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items?.map(item => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.description || 'N/A'}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.unitPrice?.toLocaleString() || '0'}</td>
                    <td>₹${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Tax (${invoice.taxRate || 0}%):</span>
                <span>₹${taxAmount.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>₹${(invoice.shipping || 0).toLocaleString()}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total Amount:</span>
                <span>₹${total.toLocaleString()}</span>
              </div>
            </div>

            ${invoice.notes ? `
              <div class="notes">
                <strong>Notes:</strong><br/>
                ${invoice.notes}
              </div>
            ` : ''}

            <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>Thank you for your business!</p>
              <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => {
                  window.close();
                }, 100);
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    }, 100);
  };

  // Send invoice
  const handleSendInvoice = (invoice) => {
    toast.success(`Invoice ${invoice.invoiceId} sent to ${invoice.customer.email}`);
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

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#586330]"></div>
                <p className="text-gray-600 mt-2">Loading invoices...</p>
              </div>
            )}

            {/* Filters and Search */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by invoice ID, customer name, or email..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices List */}
            {!loading && (
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
                          <tr key={invoice.invoiceId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{invoice.invoiceId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{invoice.customer.name}</div>
                              <div className="text-sm text-gray-500">{invoice.customer.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(invoice.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(invoice.dueDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {formatCurrency(total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={invoice.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewDetails(invoice)}
                                  className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handlePrintInvoice(invoice)}
                                  className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50"
                                >
                                  Print
                                </button>
                                <button
                                  onClick={() => handleSendInvoice(invoice)}
                                  className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50"
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
            )}
          </>
        ) : (
          // Invoice Detail View
          selectedInvoice && (
            <div>
              {/* Hidden printable content */}
              <div ref={printRef} style={{ display: 'none' }}>
                {/* This div will be used for printing */}
              </div>

              {/* Visible detail view */}
              <div className="bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <button
                      onClick={handleBackToList}
                      className="flex items-center text-[#586330] hover:text-[#586330]/80 mb-4 transition-colors"
                    >
                      ← Back to Invoices
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Invoice {selectedInvoice.invoiceId}</h1>
                    <StatusBadge status={selectedInvoice.status} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {formatCurrency(calculateInvoiceTotals(selectedInvoice).total)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePrintInvoice(selectedInvoice)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Print Invoice
                      </button>
                      <button
                        onClick={() => handleSendInvoice(selectedInvoice)}
                        className="px-4 py-2 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition-colors"
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
                    <p className="font-semibold">{formatDate(selectedInvoice.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tax Rate</p>
                    <p className="font-semibold">{selectedInvoice.taxRate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-semibold">{formatCurrency(selectedInvoice.shipping || 0)}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
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
                                    src={item.productImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}
                                    alt={item.productName}
                                    className="w-12 h-12 object-cover rounded mr-3"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
                                    }}
                                  />
                                  <span className="font-medium">{item.productName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{item.description || 'N/A'}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                              <td className="px-4 py-3">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-3 font-semibold">
                                {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items found in this invoice</p>
                  )}
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full md:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(calculateInvoiceTotals(selectedInvoice).subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax ({selectedInvoice.taxRate || 0}%):</span>
                          <span>{formatCurrency(calculateInvoiceTotals(selectedInvoice).taxAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{formatCurrency(selectedInvoice.shipping || 0)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(calculateInvoiceTotals(selectedInvoice).total)}</span>
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
            </div>
          )
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Invoices;