import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Components/utils/axiosInstance';

const Invoices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [returns, setReturns] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(false);

  // Modals
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedInvoiceForReturn, setSelectedInvoiceForReturn] = useState(null);

  const [shipmentDetails, setShipmentDetails] = useState({
    shipmentDate: '',
    carrierName: '',
    trackingNumber: '',
    items: []
  });

  const [returnDetails, setReturnDetails] = useState({
    returnDate: '',
    carrierName: '',
    carrierPhoneNumber: '',
    trackingId: '',
    customerReason: '',
    items: []
  });

  // Company return address
  const returnAddress = {
    name: 'Dealsy Furniture',
    street: '123 Furniture Plaza, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400059',
    country: 'India',
    phone: '+91 22 6789 4321',
    email: 'dealsyfurniture@gmail.com'
  };

  useEffect(() => {
    fetchVendorOrders();
    fetchInvoices();
    fetchReturns();
  }, []);

  const fetchVendorOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Order/vendor/orders');
      const ordersData = response.data.orders || [];
      setPurchaseOrders(ordersData);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      // This would be replaced with actual invoice API
      const response = await axiosInstance.get('/Vendor/invoices');
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    }
  };

  const fetchReturns = async () => {
    try {
      // This would be replaced with actual returns API
      const response = await axiosInstance.get('/Vendor/returns');
      setReturns(response.data.returns || []);
    } catch (error) {
      console.error('Error fetching returns:', error);
      setReturns([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Shipment Modal
  const openShipmentModal = (po) => {
    setSelectedPO(po);
    setShipmentDetails({
      shipmentDate: new Date().toISOString().split('T')[0],
      carrierName: '',
      trackingNumber: '',
      items: po.items?.map(item => ({ 
        ...item, 
        shippedQty: item.quantity || item.Quantity || 0 
      })) || []
    });
    setShowShipmentModal(true);
  };

  const confirmShipmentAndGenerateInvoice = async () => {
    if (!shipmentDetails.carrierName.trim() || !shipmentDetails.trackingNumber.trim()) {
      toast.error('Carrier Name and Tracking Number are required!');
      return;
    }
    
    const totalShipped = shipmentDetails.items.reduce((acc, item) => acc + (item.shippedQty || 0), 0);
    if (totalShipped === 0) {
      toast.error('At least one item must be shipped.');
      return;
    }

    try {
      // Call API to update order status and generate invoice
      await axiosInstance.post(`/Order/${selectedPO.orderId || selectedPO.id}/ship`, {
        carrier: shipmentDetails.carrierName,
        trackingNumber: shipmentDetails.trackingNumber,
        shippedItems: shipmentDetails.items.filter(i => i.shippedQty > 0)
      });

      toast.success('Shipment confirmed and invoice generated!');
      setShowShipmentModal(false);
      fetchVendorOrders(); // Refresh data
      setActiveTab('invoices');
    } catch (error) {
      console.error('Error confirming shipment:', error);
      toast.error('Failed to confirm shipment');
    }
  };

  const cancelOrder = async (po) => {
    if (window.confirm(`Cancel ${po.orderId || po.id} and issue full refund?`)) {
      try {
        await axiosInstance.post(`/Order/${po.orderId || po.id}/cancel`);
        toast.success('Order cancelled and refund initiated');
        fetchVendorOrders(); // Refresh data
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Failed to cancel order');
      }
    }
  };

  const markAsDelivered = async (po) => {
    try {
      await axiosInstance.post(`/Order/${po.orderId || po.id}/deliver`);
      toast.success('Order marked as delivered');
      fetchVendorOrders(); // Refresh data
    } catch (error) {
      console.error('Error marking as delivered:', error);
      toast.error('Failed to update order status');
    }
  };

  const openReturnModal = (invoice) => {
    const po = purchaseOrders.find(p => p.orderId === invoice.orderId);
    if (po?.deliveryStatus !== 'delivered') {
      toast.error('Order must be delivered before processing return.');
      return;
    }

    setSelectedInvoiceForReturn(invoice);
    setReturnDetails({
      returnDate: new Date().toISOString().split('T')[0],
      carrierName: '',
      carrierPhoneNumber: '',
      trackingId: '',
      customerReason: po.returnReason || 'No reason provided',
      items: invoice.items?.map(item => ({
        ...item,
        returnedQty: 0,
        customerSelected: false
      })) || []
    });
    setShowReturnModal(true);
  };

  const processReturn = async () => {
    if (!returnDetails.carrierName.trim() || !returnDetails.trackingId.trim()) {
      toast.error('Carrier Name and Tracking ID are required!');
      return;
    }
    
    const totalReturned = returnDetails.items.reduce((acc, i) => acc + (i.returnedQty || 0), 0);
    if (totalReturned === 0) {
      toast.error('Select at least one item to return.');
      return;
    }

    try {
      const returnedItems = returnDetails.items.filter(i => i.returnedQty > 0);
      const refundAmount = returnedItems.reduce((sum, i) => sum + i.returnedQty * i.unitPrice, 0);

      // Call API to process return
      await axiosInstance.post('/Payment/refund', {
        orderId: selectedInvoiceForReturn.orderId,
        paymentId: selectedInvoiceForReturn.paymentId,
        amount: refundAmount,
        reason: returnDetails.customerReason,
        items: returnedItems
      });

      toast.success(`Return processed! ₹${refundAmount.toLocaleString('en-IN')} refunded.`);
      setShowReturnModal(false);
      fetchReturns(); // Refresh returns data
    } catch (error) {
      console.error('Error processing return:', error);
      toast.error('Failed to process return');
    }
  };

  const calculateTotal = (items) => {
    if (!items) return 0;
    return items.reduce((sum, i) => sum + ((i.quantity || i.shippedQty || i.returnedQty || 0) * (i.unitPrice || i.price || 0)), 0);
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    minimumFractionDigits: 0 
  }).format(amt || 0);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      return new Date(d).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handlePrintInvoice = (invoice) => {
    const total = calculateTotal(invoice.items);
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>${invoice.invoiceId || invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #6B4E4E; padding-bottom: 20px; }
            .logo { font-size: 32px; font-weight: bold; color: #6B4E4E; }
            .tracking { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { background: #6B4E4E; color: white; padding: 14px; text-align: left; }
            td { padding: 14px; border-bottom: 1px solid #ddd; }
            .total { font-size: 26px; font-weight: bold; text-align: right; color: #6B4E4E; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Dealsy Furniture</div>
            <div><h1>INVOICE</h1><strong>${invoice.invoiceId || invoice.id}</strong><br>Date: ${formatDate(invoice.date)}</div>
          </div>
          <div class="tracking">
            <strong>Shipment:</strong> ${invoice.shipment?.carrier || 'N/A'} | Tracking: <strong>${invoice.shipment?.trackingNumber || 'N/A'}</strong>
          </div>
          <p><strong>Bill To:</strong> ${invoice.customer?.name || 'N/A'} | ${invoice.customer?.email || 'N/A'}</p>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${(invoice.items || []).map(i => `<tr><td>${i.productName || i.name}</td><td>${i.quantity}</td><td>₹${(i.unitPrice || i.price || 0).toLocaleString('en-IN')}</td><td>₹${((i.quantity || 0) * (i.unitPrice || i.price || 0)).toLocaleString('en-IN')}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="total">TOTAL: ${formatCurrency(total)}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const handleSendInvoice = (invoice) => {
    const total = calculateTotal(invoice.items);
    const subject = `Invoice ${invoice.invoiceId || invoice.id} - Shipment Confirmed`;
    const body = `Dear ${invoice.customer?.name || 'Customer'},\n\nYour order has been shipped!\n\nTracking: ${invoice.shipment?.trackingNumber || 'N/A'}\nCarrier: ${invoice.shipment?.carrier || 'N/A'}\nInvoice: ${invoice.invoiceId || invoice.id}\nAmount: ${formatCurrency(total)}\n\nThank you!\nDealsy Team`;
    window.location.href = `mailto:${invoice.customer?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening email client...');
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar handleLogout={handleLogout} activeView="invoices" />

        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order, Invoice & Return Management</h1>
          <p className="text-gray-600 mb-8">Pending → Shipped → Delivered → Returns</p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`px-6 py-3 font-medium ${activeTab === 'orders' ? 'text-[#586330] border-b-2 border-[#586330]' : 'text-gray-500'}`}
            >
              Orders ({purchaseOrders.length})
            </button>
            <button 
              onClick={() => setActiveTab('invoices')} 
              className={`px-6 py-3 font-medium ${activeTab === 'invoices' ? 'text-[#586330] border-b-2 border-[#586330]' : 'text-gray-500'}`}
            >
              Invoices ({invoices.length})
            </button>
            <button 
              onClick={() => setActiveTab('returns')} 
              className={`px-6 py-3 font-medium ${activeTab === 'returns' ? 'text-[#586330] border-b-2 border-[#586330]' : 'text-gray-500'}`}
            >
              Returns ({returns.length})
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#586330]"></div>
            </div>
          )}

          {/* Orders Tab */}
          {!loading && activeTab === 'orders' && (
            <div className="space-y-8">
              {/* Pending Orders */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-orange-50 p-4 font-bold">Purchased Orders</div>
                <table className="w-full">
                  <thead className="bg-[#586330] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Order ID</th>
                      <th className="px-6 py-4 text-left">Customer</th>
                      <th className="px-6 py-4 text-left">Total</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.filter(po => 
                      (po.status === 'Pending' || po.status === 'Confirmed') && 
                      po.deliveryStatus !== 'delivered'
                    ).map(po => (
                      <tr key={po.orderId || po.id} className="border-b hover:bg-[#F5F1E8]">
                        <td className="px-6 py-4 font-medium">{po.orderId || po.id}</td>
                        <td className="px-6 py-4">{po.customer?.name || 'Unknown Customer'}</td>
                        <td className="px-6 py-4 font-bold text-[#586330]">{formatCurrency(po.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            po.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => openShipmentModal(po)} 
                            className="px-4 py-2 bg-[#586330] text-white rounded mr-2 hover:bg-[#586330]/80"
                          >
                            Ship
                          </button>
                          <button 
                            onClick={() => cancelOrder(po)} 
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                    {purchaseOrders.filter(po => 
                      (po.status === 'Pending' || po.status === 'Confirmed') && 
                      po.deliveryStatus !== 'delivered'
                    ).length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No pending orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Shipped Orders */}
              {purchaseOrders.filter(po => po.deliveryStatus === 'in-transit' || po.status === 'Shipped').length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-50 p-4 font-bold text-blue-800">Now Shipping</div>
                  <table className="w-full">
                    <thead className="bg-[#586330] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Order ID</th>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Tracking</th>
                        <th className="px-6 py-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders.filter(po => po.deliveryStatus === 'in-transit' || po.status === 'Shipped').map(po => (
                        <tr key={po.orderId || po.id} className="border-b hover:bg-[#F5F1E8]">
                          <td className="px-6 py-4">{po.orderId || po.id}</td>
                          <td className="px-6 py-4">{po.customer?.name || 'Unknown Customer'}</td>
                          <td className="px-6 py-4">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {po.trackingNumber || 'No tracking'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => markAsDelivered(po)} 
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Mark Delivered
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {!loading && activeTab === 'invoices' && viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#586330] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Invoice</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Tracking</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => {
                    const po = purchaseOrders.find(p => p.orderId === inv.orderId);
                    const total = calculateTotal(inv.items);
                    
                    return (
                      <tr key={inv.invoiceId || inv.id} className="border-b hover:bg-[#F5F1E8]">
                        <td className="px-6 py-4 font-medium">{inv.invoiceId || inv.id}</td>
                        <td className="px-6 py-4">{inv.customer?.name || 'Unknown Customer'}</td>
                        <td className="px-6 py-4 font-bold text-[#586330]">{formatCurrency(total)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            po?.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                            po?.deliveryStatus === 'in-transit' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {po?.deliveryStatus === 'delivered' ? 'Delivered' : 
                             po?.deliveryStatus === 'in-transit' ? 'In Transit' : 
                             'Processing'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono">{inv.shipment?.trackingNumber || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => { setSelectedInvoice(inv); setViewMode('detail'); }} 
                            className="text-blue-600 mr-3 hover:underline"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handlePrintInvoice(inv)} 
                            className="text-gray-600 mr-3 hover:underline"
                          >
                            Print
                          </button>
                          <button 
                            onClick={() => handleSendInvoice(inv)} 
                            className="text-green-600 mr-3 hover:underline"
                          >
                            Email
                          </button>
                          {po?.deliveryStatus === 'delivered' && (
                            <button 
                              onClick={() => openReturnModal(inv)} 
                              className="text-red-600 hover:underline"
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Returns Tab */}
          {!loading && activeTab === 'returns' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#586330] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Return ID</th>
                    <th className="px-6 py-4 text-left">Order ID</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Reason</th>
                    <th className="px-6 py-4 text-left">Refund Amount</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500">
                        No returns yet
                      </td>
                    </tr>
                  ) : (
                    returns.map(r => (
                      <tr key={r.returnId || r.id} className="border-b hover:bg-[#F5F1E8]">
                        <td className="px-6 py-4">{r.returnId || r.id}</td>
                        <td className="px-6 py-4">{r.orderId}</td>
                        <td className="px-6 py-4">{formatDate(r.date)}</td>
                        <td className="px-6 py-4">{r.reason || 'No reason provided'}</td>
                        <td className="px-6 py-4 font-bold">{formatCurrency(r.refundAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            r.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {r.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Shipment Modal */}
          {showShipmentModal && selectedPO && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="bg-[#586330] text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Confirm Shipment - {selectedPO.orderId || selectedPO.id}</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-medium mb-2">Shipment Date</label>
                      <input 
                        type="date" 
                        value={shipmentDetails.shipmentDate} 
                        onChange={e => setShipmentDetails(prev => ({ ...prev, shipmentDate: e.target.value }))} 
                        className="w-full px-4 py-3 border rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Carrier Name *</label>
                      <input 
                        type="text" 
                        placeholder="FedEx, Delhivery, etc." 
                        value={shipmentDetails.carrierName} 
                        onChange={e => setShipmentDetails(prev => ({ ...prev, carrierName: e.target.value }))} 
                        className="w-full px-4 py-3 border rounded-lg" 
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block font-medium mb-2">Tracking Number (AWB) *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456789012" 
                      value={shipmentDetails.trackingNumber} 
                      onChange={e => setShipmentDetails(prev => ({ ...prev, trackingNumber: e.target.value }))} 
                      className="w-full px-4 py-3 border rounded-lg" 
                    />
                  </div>

                  <h3 className="font-bold text-lg mb-4">Items to Ship</h3>
                  <div className="space-y-4 mb-8">
                    {shipmentDetails.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.productName || item.name}</p>
                          <p className="text-sm text-gray-600">Ordered: {item.quantity || 0}</p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity || 0}
                          value={item.shippedQty || 0}
                          onChange={e => {
                            const qty = Math.max(0, Math.min(parseInt(e.target.value) || 0, item.quantity || 0));
                            setShipmentDetails(prev => ({
                              ...prev,
                              items: prev.items.map((it, idx) => idx === i ? { ...it, shippedQty: qty } : it)
                            }));
                          }}
                          className="w-24 px-3 py-2 border rounded text-center"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4">
                    <button 
                      onClick={() => setShowShipmentModal(false)} 
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmShipmentAndGenerateInvoice} 
                      className="px-8 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#5A3E3E]"
                    >
                      Confirm & Generate Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Return Modal */}
          {showReturnModal && selectedInvoiceForReturn && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="bg-red-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Process Return - {selectedInvoiceForReturn.invoiceId || selectedInvoiceForReturn.id}</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-medium mb-2">Return Date *</label>
                      <input 
                        type="date" 
                        value={returnDetails.returnDate} 
                        onChange={e => setReturnDetails(prev => ({ ...prev, returnDate: e.target.value }))} 
                        className="w-full px-4 py-3 border rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Carrier Name *</label>
                      <input 
                        type="text" 
                        placeholder="FedEx, Delhivery, etc." 
                        value={returnDetails.carrierName} 
                        onChange={e => setReturnDetails(prev => ({ ...prev, carrierName: e.target.value }))} 
                        className="w-full px-4 py-3 border rounded-lg" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-medium mb-2">Carrier Phone Number</label>
                      <input 
                        type="text" 
                        placeholder="+91 98765 43210" 
                        value={returnDetails.carrierPhoneNumber} 
                        onChange={e => setReturnDetails(prev => ({ ...prev, carrierPhoneNumber: e.target.value }))} 
                        className="w-full px-4 py-3 border rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Tracking ID *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. RET123456789" 
                        value={returnDetails.trackingId} 
                        onChange={e => setReturnDetails(prev => ({ ...prev, trackingId: e.target.value }))} 
                        className="w-full px-4 py-3 border rounded-lg" 
                      />
                    </div>
                  </div>

                  {/* Return Address Section */}
                  <div className="mb-6">
                    <label className="block font-medium mb-2">Return Shipping Address</label>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-medium text-green-800 mb-2">Ship returns to:</p>
                      <div className="text-gray-700">
                        <p className="font-semibold">{returnAddress.name}</p>
                        <p>{returnAddress.street}</p>
                        <p>{returnAddress.city}, {returnAddress.state} {returnAddress.zipCode}</p>
                        <p>{returnAddress.country}</p>
                        <p className="mt-2">📞 {returnAddress.phone}</p>
                        <p>✉ {returnAddress.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block font-medium mb-2">Customer Reason for Return</label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700">{returnDetails.customerReason}</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-4">Items for Return</h3>
                  {returnDetails.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName || item.name}</p>
                        <p className="text-sm text-gray-600">Delivered: {item.quantity || 0}</p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={item.quantity || 0}
                        value={item.returnedQty || 0}
                        onChange={e => {
                          const qty = Math.max(0, Math.min(parseInt(e.target.value) || 0, item.quantity || 0));
                          setReturnDetails(prev => ({
                            ...prev,
                            items: prev.items.map((it, idx) => idx === i ? { ...it, returnedQty: qty } : it)
                          }));
                        }}
                        className="w-24 px-3 py-2 border rounded text-center"
                        placeholder="0"
                      />
                    </div>
                  ))}

                  <div className="flex justify-end gap-4 mt-8">
                    <button 
                      onClick={() => setShowReturnModal(false)} 
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={processReturn} 
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Process Return & Refund
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Invoices;