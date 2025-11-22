// import { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../../Components/utils/axiosInstance';

// const Invoices = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('orders');
//   const [invoices, setInvoices] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [viewMode, setViewMode] = useState('list');

//   // Modals
//   const [showShipmentModal, setShowShipmentModal] = useState(false);
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedInvoiceForReturn, setSelectedInvoiceForReturn] = useState(null);

//   const [shipmentDetails, setShipmentDetails] = useState({
//     shipmentDate: '',
//     carrierName: '',
//     trackingNumber: '',
//     items: []
//   });

//   const [returnDetails, setReturnDetails] = useState({
//     returnDate: '',
//     carrierName: '',
//     carrierPhoneNumber: '',
//     trackingId: '',
//     customerReason: '',
//     items: []
//   });

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('currentUser');
//     navigate('/');
//   };

//   // Fetch vendor invoices and payments
//   useEffect(() => {
//     fetchVendorInvoices();
//     fetchVendorPayments();
//   }, []);

//   const fetchVendorInvoices = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/Vendor/invoices');
//       const invoicesData = response.data.invoices || response.data.Invoices || [];
//       setInvoices(invoicesData);
//     } catch (error) {
//       console.error('Error fetching vendor invoices:', error);
//       toast.error('Failed to load invoices');
//       setInvoices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVendorPayments = async () => {
//     try {
//       const response = await axiosInstance.get('/Vendor/payments');
//       const paymentsData = response.data.payments || response.data.Payments || [];
//       setPayments(paymentsData);
//     } catch (error) {
//       console.error('Error fetching vendor payments:', error);
//       toast.error('Failed to load payments');
//       setPayments([]);
//     }
//   };

//   // Create order function
//   const createOrder = async (orderData) => {
//     try {
//       const response = await axiosInstance.post('/Vendor/create-order', orderData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   };

//   // Update order status
//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await axiosInstance.post('/Vendor/update-order-status', {
//         orderId,
//         status
//       });
//       toast.success('Order status updated successfully');
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       toast.error('Failed to update order status');
//     }
//   };

//   // Initiate refund
//   const initiateRefund = async (refundData) => {
//     try {
//       const response = await axiosInstance.post('/Vendor/initiate-refund', refundData);
//       toast.success('Refund initiated successfully');
//       return response.data;
//     } catch (error) {
//       console.error('Error initiating refund:', error);
//       toast.error('Failed to initiate refund');
//       throw error;
//     }
//   };

//   // Confirm payment
//   const confirmPayment = async (paymentData) => {
//     try {
//       const response = await axiosInstance.post('/Vendor/confirm-payment', paymentData);
//       toast.success('Payment confirmed successfully');
//       return response.data;
//     } catch (error) {
//       console.error('Error confirming payment:', error);
//       toast.error('Failed to confirm payment');
//       throw error;
//     }
//   };

//   // Shipment Modal
//   const openShipmentModal = (order) => {
//     setSelectedOrder(order);
//     setShipmentDetails({
//       shipmentDate: new Date().toISOString().split('T')[0],
//       carrierName: '',
//       trackingNumber: '',
//       items: order.items.map(item => ({ ...item, shippedQty: item.quantity }))
//     });
//     setShowShipmentModal(true);
//   };

//   const confirmShipment = async () => {
//     if (!shipmentDetails.carrierName.trim() || !shipmentDetails.trackingNumber.trim()) {
//       toast.error('Carrier Name and Tracking Number are required!');
//       return;
//     }

//     try {
//       // Update order status to shipped
//       await updateOrderStatus(selectedOrder.orderId, 'Shipped');
      
//       toast.success(`Order ${selectedOrder.orderId} marked as shipped`);
//       setShowShipmentModal(false);
      
//       // Refresh data
//       fetchVendorInvoices();
//     } catch (error) {
//       console.error('Error confirming shipment:', error);
//     }
//   };

//   const cancelOrder = async (order) => {
//     if (window.confirm(`Cancel ${order.orderId}?`)) {
//       try {
//         await updateOrderStatus(order.orderId, 'Cancelled');
//         fetchVendorInvoices();
//       } catch (error) {
//         console.error('Error cancelling order:', error);
//       }
//     }
//   };

//   const markAsDelivered = async (order) => {
//     try {
//       await updateOrderStatus(order.orderId, 'Delivered');
//       fetchVendorInvoices();
//     } catch (error) {
//       console.error('Error marking as delivered:', error);
//     }
//   };

//   const openReturnModal = (invoice) => {
//     setSelectedInvoiceForReturn(invoice);
//     setReturnDetails({
//       returnDate: new Date().toISOString().split('T')[0],
//       carrierName: '',
//       carrierPhoneNumber: '',
//       trackingId: '',
//       customerReason: 'Customer requested return',
//       items: invoice.items.map(item => ({
//         ...item,
//         returnedQty: item.quantity,
//         customerSelected: true
//       }))
//     });
//     setShowReturnModal(true);
//   };

//   const processReturn = async () => {
//     if (!returnDetails.carrierName.trim() || !returnDetails.trackingId.trim()) {
//       toast.error('Carrier Name and Tracking ID are required!');
//       return;
//     }

//     try {
//       await initiateRefund({
//         orderId: selectedInvoiceForReturn.orderId,
//         paymentId: selectedInvoiceForReturn.paymentId,
//         razorpayPaymentId: selectedInvoiceForReturn.razorpayPaymentId,
//         amount: calculateTotal(selectedInvoiceForReturn.items),
//         reason: returnDetails.customerReason
//       });

//       // Update order status to refunded
//       await updateOrderStatus(selectedInvoiceForReturn.orderId, 'Refunded');
      
//       setShowReturnModal(false);
//       fetchVendorInvoices();
//     } catch (error) {
//       console.error('Error processing return:', error);
//     }
//   };

//   const calculateTotal = (items) => items.reduce((sum, i) => sum + ((i.quantity || i.shippedQty || i.returnedQty || 0) * i.unitPrice), 0);
  
//   const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { 
//     style: 'currency', 
//     currency: 'INR', 
//     minimumFractionDigits: 0 
//   }).format(amt || 0);
  
//   const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { 
//     day: 'numeric', 
//     month: 'short', 
//     year: 'numeric' 
//   });

//   const handlePrintInvoice = (invoice) => {
//     const total = calculateTotal(invoice.items);
//     const win = window.open('', '_blank');
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>${invoice.invoiceId}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
//             .header { display: flex; justify-content: space-between; border-bottom: 3px solid #586330; padding-bottom: 20px; }
//             .logo { font-size: 32px; font-weight: bold; color: #586330; }
//             .tracking { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
//             table { width: 100%; border-collapse: collapse; margin: 30px 0; }
//             th { background: #586330; color: white; padding: 14px; text-align: left; }
//             td { padding: 14px; border-bottom: 1px solid #ddd; }
//             .total { font-size: 26px; font-weight: bold; text-align: right; color: #586330; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="logo">Dealsy Furniture</div>
//             <div>
//               <h1>INVOICE</h1>
//               <strong>${invoice.invoiceId}</strong><br>
//               Date: ${formatDate(invoice.date)}
//             </div>
//           </div>
//           <div class="tracking">
//             <strong>Shipment:</strong> ${invoice.carrier} | Tracking: <strong>${invoice.trackingNumber}</strong>
//           </div>
//           <p><strong>Bill To:</strong> ${invoice.customer?.name} | ${invoice.customer?.email}</p>
//           <table>
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${invoice.items.map(i => `
//                 <tr>
//                   <td>${i.productName}</td>
//                   <td>${i.quantity}</td>
//                   <td>${formatCurrency(i.unitPrice)}</td>
//                   <td>${formatCurrency(i.quantity * i.unitPrice)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//           <div class="total">TOTAL: ${formatCurrency(total)}</div>
//         </body>
//       </html>
//     `);
//     win.document.close();
//     win.focus();
//     setTimeout(() => win.print(), 500);
//   };

//   const handleSendInvoice = (invoice) => {
//     const total = calculateTotal(invoice.items);
//     const subject = `Invoice ${invoice.invoiceId} - Shipment Confirmed`;
//     const body = `Dear ${invoice.customer?.name},\n\nYour order has been shipped!\n\nTracking: ${invoice.trackingNumber}\nCarrier: ${invoice.carrier}\nInvoice: ${invoice.invoiceId}\nAmount: ${formatCurrency(total)}\n\nThank you!\nDealsy Team`;
//     window.location.href = `mailto:${invoice.customer?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//     toast.success('Opening email client...');
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" />
//       <div className="flex min-h-screen bg-gray-50">
//         <Sidebar handleLogout={handleLogout} activeView="invoices" />

//         <div className="flex-1 p-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Order & Invoice Management</h1>
//           <p className="text-gray-600 mb-8">Manage your orders, invoices, and returns</p>

//           {/* Tabs */}
//           <div className="flex border-b border-gray-200 mb-8">
//             <button 
//               onClick={() => setActiveTab('invoices')} 
//               className={`px-6 py-3 font-medium ${activeTab === 'invoices' ? 'text-[#586330] border-b-2 border-[#586330]' : 'text-gray-500'}`}
//             >
//               Invoices ({invoices.length})
//             </button>
//             <button 
//               onClick={() => setActiveTab('payments')} 
//               className={`px-6 py-3 font-medium ${activeTab === 'payments' ? 'text-[#586330] border-b-2 border-[#586330]' : 'text-gray-500'}`}
//             >
//               Payments ({payments.length})
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#586330]"></div>
//             </div>
//           ) : (
//             <>
//               {/* Invoices Tab */}
//               {activeTab === 'invoices' && viewMode === 'list' && (
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                   <table className="w-full">
//                     <thead className="bg-[#586330] text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-left">Invoice ID</th>
//                         <th className="px-6 py-4 text-left">Customer</th>
//                         <th className="px-6 py-4 text-left">Amount</th>
//                         <th className="px-6 py-4 text-left">Status</th>
//                         <th className="px-6 py-4 text-left">Date</th>
//                         <th className="px-6 py-4 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {invoices.map(invoice => (
//                         <tr key={invoice.invoiceId} className="border-b hover:bg-[#F5F1E8]">
//                           <td className="px-6 py-4 font-medium">{invoice.invoiceId}</td>
//                           <td className="px-6 py-4">{invoice.customer?.name}</td>
//                           <td className="px-6 py-4 font-bold text-[#586330]">
//                             {formatCurrency(calculateTotal(invoice.items))}
//                           </td>
//                           <td className="px-6 py-4">
//                             <span className={`px-3 py-1 rounded-full text-xs ${
//                               invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
//                               invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                               'bg-gray-100 text-gray-800'
//                             }`}>
//                               {invoice.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4">{formatDate(invoice.date)}</td>
//                           <td className="px-6 py-4">
//                             <button 
//                               onClick={() => { setSelectedInvoice(invoice); setViewMode('detail'); }} 
//                               className="text-blue-600 mr-3 hover:underline"
//                             >
//                               View
//                             </button>
//                             <button 
//                               onClick={() => handlePrintInvoice(invoice)} 
//                               className="text-gray-600 mr-3 hover:underline"
//                             >
//                               Print
//                             </button>
//                             <button 
//                               onClick={() => handleSendInvoice(invoice)} 
//                               className="text-green-600 hover:underline"
//                             >
//                               Email
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
                  
//                   {invoices.length === 0 && (
//                     <div className="text-center py-12">
//                       <p className="text-gray-500">No invoices found</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Invoice Detail View */}
//               {activeTab === 'invoices' && viewMode === 'detail' && selectedInvoice && (
//                 <div className="bg-white rounded-xl shadow-lg p-8">
//                   <button 
//                     onClick={() => setViewMode('list')} 
//                     className="flex items-center text-[#586330] hover:underline mb-6"
//                   >
//                     ← Back to Invoices
//                   </button>
                  
//                   <div className="flex justify-between items-start mb-8">
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-800">{selectedInvoice.invoiceId}</h2>
//                       <p className="text-gray-600 mt-2">Date: {formatDate(selectedInvoice.date)}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-3xl font-bold text-[#586330]">
//                         {formatCurrency(calculateTotal(selectedInvoice.items))}
//                       </p>
//                       <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
//                         selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
//                         selectedInvoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {selectedInvoice.status}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                     <div>
//                       <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <p className="font-medium">{selectedInvoice.customer?.name}</p>
//                         <p className="text-gray-600">{selectedInvoice.customer?.email}</p>
//                         <p className="text-gray-600">{selectedInvoice.customer?.phone}</p>
//                         <p className="text-gray-600 mt-2">{selectedInvoice.customer?.address?.street}</p>
//                         <p className="text-gray-600">{selectedInvoice.customer?.address?.city}, {selectedInvoice.customer?.address?.state} {selectedInvoice.customer?.address?.zipCode}</p>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="text-lg font-semibold mb-4">Order Items</h3>
//                       <div className="space-y-4">
//                         {selectedInvoice.items.map((item, index) => (
//                           <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
//                             <div>
//                               <p className="font-medium">{item.productName}</p>
//                               <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
//                             </div>
//                             <p className="font-bold text-[#586330]">
//                               {formatCurrency(item.quantity * item.unitPrice)}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-end space-x-4">
//                     <button 
//                       onClick={() => handlePrintInvoice(selectedInvoice)} 
//                       className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//                     >
//                       Print Invoice
//                     </button>
//                     <button 
//                       onClick={() => handleSendInvoice(selectedInvoice)} 
//                       className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#5A3E3E]"
//                     >
//                       Send via Email
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Invoices;





import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [returns, setReturns] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('list');

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
    name: 'Dealsy Furniture ',
    street: '123 Furniture Plaza, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400059',
    country: 'India',
    phone: '+91 22 6789 4321',
    email: 'dealsyfurniture@gmail.com'
  };

  // Dummy Data (November 20, 2025)
  const dummyPurchaseOrders = [
    {
      poId: 'PO-2025-0001',
      orderDate: '2025-11-10',
      customer: { 
        name: 'Rajesh Kumar', 
        email: 'rajesh.k@gmail.com', 
        phone: '+91 98201 23456', 
        address: { 
          street: 'Sector 17, Vashi', 
          city: 'Navi Mumbai', 
          state: 'Maharashtra', 
          zipCode: '400703', 
          country: 'India' 
        } 
      },
      items: [
        { productName: 'Royal Teak Wood Bed (King)', productImage: '/images/bed1.jpg', description: 'Hand-carved headboard', quantity: 1, unitPrice: 85000 },
        { productName: 'Memory Foam Mattress', productImage: '/images/mattress.jpg', description: '10-inch orthopedic', quantity: 1, unitPrice: 25000 }
      ],
      status: 'shipped',
      trackingNumber: 'DLV123456789IN',
      deliveryStatus: 'delivered',
      deliveredOn: '2025-11-18',
      returnRequests: [
        {
          id: 'RET-REQ-001',
          date: '2025-11-19',
          reason: 'The mattress is too firm for my back, causing discomfort. I need something softer.',
          itemsToReturn: [
            { productName: 'Memory Foam Mattress', quantity: 1, unitPrice: 25000 }
          ],
          status: 'pending'
        }
      ]
    },
    {
      poId: 'PO-2025-0002',
      orderDate: '2025-11-12',
      customer: { 
        name: 'Neha Gupta', 
        email: 'neha.gupta@company.com', 
        phone: '+91 99887 76655', 
        address: { 
          street: 'Bandra West', 
          city: 'Mumbai', 
          state: 'Maharashtra', 
          zipCode: '400050', 
          country: 'India' 
        } 
      },
      items: [
        { productName: 'L-Shaped Fabric Sofa (8 Seater)', productImage: '/images/lsofa.jpg', description: 'Grey with recliner', quantity: 1, unitPrice: 125000 }
      ],
      status: 'pending-fulfillment'
    },
    {
      poId: 'PO-2025-0003',
      orderDate: '2025-11-14',
      customer: { 
        name: 'Vikram Singh', 
        email: 'vikram88@yahoo.com', 
        phone: '+91 77381 22334', 
        address: { 
          street: 'Koramangala 6th Block', 
          city: 'Bengaluru', 
          state: 'Karnataka', 
          zipCode: '560095', 
          country: 'India' 
        } 
      },
      items: [
        { productName: 'Marble Top Dining Table', productImage: '/images/marble.jpg', description: 'Italian marble, 8 seater', quantity: 1, unitPrice: 98000 },
        { productName: 'Velvet Dining Chairs', productImage: '/images/chairs.jpg', description: 'Set of 6 - Navy Blue', quantity: 6, unitPrice: 8500 }
      ],
      status: 'shipped',
      trackingNumber: 'BLUEDART987654321',
      deliveryStatus: 'delivered',
      deliveredOn: '2025-11-19',
      returnRequests: [
        {
          id: 'RET-REQ-002',
          date: '2025-11-20',
          reason: 'Two of the dining chairs arrived with scratches on the legs. The velvet fabric also has a small tear on one chair.',
          itemsToReturn: [
            { productName: 'Velvet Dining Chairs', quantity: 2, unitPrice: 8500 }
          ],
          status: 'pending'
        }
      ]
    },
    {
      poId: 'PO-2025-0004',
      orderDate: '2025-11-16',
      customer: { 
        name: 'Ananya Patel', 
        email: 'ananya.patel@gmail.com', 
        phone: '+91 88776 55443', 
        address: { 
          street: 'Juhu Tara Road', 
          city: 'Mumbai', 
          state: 'Maharashtra', 
          zipCode: '400049', 
          country: 'India' 
        } 
      },
      items: [
        { productName: 'Recliner Leather Sofa (3 Seater)', productImage: '/images/recliner.jpg', description: 'Electric recliner, Brown', quantity: 2, unitPrice: 145000 }
      ],
      status: 'pending-fulfillment'
    },
    {
      poId: 'PO-2025-0006',
      orderDate: '2025-11-19',
      customer: { 
        name: 'Pooja Reddy', 
        email: 'pooja.reddy@zoho.com', 
        phone: '+91 81234 56789', 
        address: { 
          street: 'Hi-Tech City', 
          city: 'Hyderabad', 
          state: 'Telangana', 
          zipCode: '500081', 
          country: 'India' 
        } 
      },
      items: [
        { productName: 'Center Table (Glass Top)', productImage: '/images/center.jpg', description: 'Modern minimalist', quantity: 1, unitPrice: 22000 },
        { productName: 'TV Unit 6ft', productImage: '/images/tvunit.jpg', description: 'With LED lighting', quantity: 1, unitPrice: 38000 }
      ],
      status: 'shipped',
      trackingNumber: 'ECOMEXP11223344',
      deliveryStatus: 'in-transit'
    }
  ];

  const dummyInvoices = [
    {
      invoiceId: 'INV-2025-0001',
      date: '2025-11-12',
      dueDate: '2025-11-27',
      status: 'pending',
      notes: 'Thank you!',
      poId: 'PO-2025-0001',
      customer: dummyPurchaseOrders[0].customer,
      items: dummyPurchaseOrders[0].items,
      shipment: { asnDate: '2025-11-12', carrier: 'Delhivery', trackingNumber: 'DLV123456789IN', shippedOn: '12 Nov 2025, 14:30' }
    },
    {
      invoiceId: 'INV-2025-0003',
      date: '2025-11-20',
      dueDate: '2025-12-05',
      status: 'pending',
      notes: 'Express delivery',
      poId: 'PO-2025-0006',
      customer: dummyPurchaseOrders[4].customer,
      items: dummyPurchaseOrders[4].items,
      shipment: { asnDate: '2025-11-20', carrier: 'Ecom Express', trackingNumber: 'ECOMEXP11223344', shippedOn: '20 Nov 2025, 09:45' }
    }
  ];

  // Load from localStorage
  useEffect(() => {
    const savedPOs = localStorage.getItem('vendor_purchase_orders');
    const savedInv = localStorage.getItem('vendor_invoices');
    const savedRet = localStorage.getItem('vendor_returns');

    if (!savedPOs || savedPOs === '[]') {
      localStorage.setItem('vendor_purchase_orders', JSON.stringify(dummyPurchaseOrders));
      localStorage.setItem('vendor_invoices', JSON.stringify(dummyInvoices));
      localStorage.setItem('vendor_returns', JSON.stringify([]));
      setPurchaseOrders(dummyPurchaseOrders);
      setInvoices(dummyInvoices);
      setReturns([]);
    } else {
      setPurchaseOrders(JSON.parse(savedPOs));
      setInvoices(JSON.parse(savedInv || '[]'));
      setReturns(JSON.parse(savedRet || '[]'));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vendor_purchase_orders', JSON.stringify(purchaseOrders));
    localStorage.setItem('vendor_invoices', JSON.stringify(invoices));
    localStorage.setItem('vendor_returns', JSON.stringify(returns));
  }, [purchaseOrders, invoices, returns]);

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
      items: po.items.map(item => ({ ...item, shippedQty: item.quantity }))
    });
    setShowShipmentModal(true);
  };

  const confirmShipmentAndGenerateInvoice = () => {
    if (!shipmentDetails.carrierName.trim() || !shipmentDetails.trackingNumber.trim()) {
      toast.error('Carrier Name and Tracking Number are required!');
      return;
    }
    const totalShipped = shipmentDetails.items.reduce((acc, item) => acc + item.shippedQty, 0);
    if (totalShipped === 0) {
      toast.error('At least one item must be shipped.');
      return;
    }

    const invoiceId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;

    const shippedItems = shipmentDetails.items.filter(i => i.shippedQty > 0);

    const newInvoice = {
      invoiceId,
      date: shipmentDetails.shipmentDate,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      notes: 'Thank you for your business!',
      poId: selectedPO.poId,
      customer: { ...selectedPO.customer },
      items: shippedItems.map(i => ({ productName: i.productName, quantity: i.shippedQty, unitPrice: i.unitPrice })),
      shipment: {
        asnDate: shipmentDetails.shipmentDate,
        carrier: shipmentDetails.carrierName,
        trackingNumber: shipmentDetails.trackingNumber,
        shippedOn: new Date().toLocaleString('en-IN')
      }
    };

    setInvoices(prev => [...prev, newInvoice]);
    setPurchaseOrders(prev => prev.map(p =>
      p.poId === selectedPO.poId
        ? { ...p, status: 'shipped', trackingNumber: shipmentDetails.trackingNumber, deliveryStatus: 'in-transit' }
        : p
    ));
    toast.success(`Shipment confirmed! Invoice ${invoiceId} generated.`);
    setShowShipmentModal(false);
    setActiveTab('invoices');
  };

  const cancelOrder = (po) => {
    if (window.confirm(`Cancel ${po.poId} and issue full refund?`)) {
      setPurchaseOrders(prev => prev.map(p => p.poId === po.poId ? { ...p, status: 'cancelled' } : p));
      toast.success(`${po.poId} cancelled and refunded.`);
    }
  };

  const markAsDelivered = (po) => {
    setPurchaseOrders(prev => prev.map(p =>
      p.poId === po.poId
        ? { ...p, deliveryStatus: 'delivered', deliveredOn: new Date().toISOString().split('T')[0] }
        : p
    ));
    toast.success(`${po.poId} marked as delivered.`);
  };

  const openReturnModal = (invoice) => {
    const po = purchaseOrders.find(p => p.poId === invoice.poId);
    if (po?.deliveryStatus !== 'delivered') {
      toast.error('Order must be delivered before processing return.');
      return;
    }

    // Get the latest return request from customer
    const latestReturnRequest = po.returnRequests?.[po.returnRequests.length - 1];
    
    // Pre-fill items based on customer's selection
    const itemsWithCustomerSelection = invoice.items.map(item => {
      // Find if customer selected this item for return
      const customerSelectedItem = latestReturnRequest?.itemsToReturn?.find(
        returnItem => returnItem.productName === item.productName
      );
      
      return {
        ...item,
        returnedQty: customerSelectedItem ? customerSelectedItem.quantity : 0,
        customerSelected: !!customerSelectedItem
      };
    });
    
    setSelectedInvoiceForReturn(invoice);
    setReturnDetails({
      returnDate: new Date().toISOString().split('T')[0],
      carrierName: '',
      carrierPhoneNumber: '',
      trackingId: '',
      customerReason: latestReturnRequest?.reason || 'No reason provided',
      items: itemsWithCustomerSelection
    });
    setShowReturnModal(true);
  };

  const processReturn = () => {
    if (!returnDetails.carrierName.trim() || !returnDetails.trackingId.trim()) {
      toast.error('Carrier Name and Tracking ID are required!');
      return;
    }
    
    const totalReturned = returnDetails.items.reduce((acc, i) => acc + (i.returnedQty || 0), 0);
    if (totalReturned === 0) {
      toast.error('Select at least one item to return.');
      return;
    }

    const returnedItems = returnDetails.items.filter(i => i.returnedQty > 0);
    const refundAmount = returnedItems.reduce((sum, i) => sum + i.returnedQty * i.unitPrice, 0);

    const newReturn = {
      returnId: `RET-${new Date().getFullYear()}-${String(returns.length + 1).padStart(4, '0')}`,
      invoiceId: selectedInvoiceForReturn.invoiceId,
      poId: selectedInvoiceForReturn.poId,
      date: returnDetails.returnDate,
      carrierName: returnDetails.carrierName,
      carrierPhoneNumber: returnDetails.carrierPhoneNumber,
      trackingId: returnDetails.trackingId,
      reason: returnDetails.customerReason,
      status: 'refund-processed',
      refundAmount,
      items: returnedItems.map(i => ({ 
        productName: i.productName, 
        quantity: i.returnedQty, 
        unitPrice: i.unitPrice 
      }))
    };

    setReturns(prev => [...prev, newReturn]);
    
    // Update the return request status in purchase order
    setPurchaseOrders(prev => prev.map(po => {
      if (po.poId === selectedInvoiceForReturn.poId && po.returnRequests) {
        const updatedRequests = po.returnRequests.map(req => ({
          ...req,
          status: 'processed'
        }));
        return { ...po, returnRequests: updatedRequests };
      }
      return po;
    }));

    toast.success(`Return processed! ₹${refundAmount.toLocaleString('en-IN')} refunded.`);
    setShowReturnModal(false);
  };

  const calculateTotal = (items) => items.reduce((sum, i) => sum + ((i.quantity || i.shippedQty || i.returnedQty || 0) * i.unitPrice), 0);
  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amt || 0);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Function to handle refund navigation
  const handleRefund = (returnItem) => {
    // Navigate to payment page with return details
    navigate('/payments', { 
      state: { 
        returnDetails: returnItem,
        type: 'refund'
      }
    });
  };

  const handlePrintInvoice = (invoice) => {
    const total = calculateTotal(invoice.items);
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>${invoice.invoiceId}</title>
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
            <div><h1>INVOICE</h1><strong>${invoice.invoiceId}</strong><br>Date: ${formatDate(invoice.date)}</div>
          </div>
          <div class="tracking">
            <strong>Shipment:</strong> ${invoice.shipment.carrier} | Tracking: <strong>${invoice.shipment.trackingNumber}</strong>
          </div>
          <p><strong>Bill To:</strong> ${invoice.customer.name} | ${invoice.customer.email}</p>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${invoice.items.map(i => `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>₹${i.unitPrice.toLocaleString('en-IN')}</td><td>₹${(i.quantity * i.unitPrice).toLocaleString('en-IN')}</td></tr>`).join('')}
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
    const subject = `Invoice ${invoice.invoiceId} - Shipment Confirmed`;
    const body = `Dear ${invoice.customer.name},\n\nYour order has been shipped!\n\nTracking: ${invoice.shipment.trackingNumber}\nCarrier: ${invoice.shipment.carrier}\nInvoice: ${invoice.invoiceId}\nAmount: ${formatCurrency(total)}\n\nThank you!\nDealsy Team`;
    window.location.href = `mailto:${invoice.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              {/* Pending */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-orange-50 p-4 font-bold">Purchased Orders</div>
                <table className="w-full">
                  <thead className="bg-[#586330] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">PO ID</th>
                      <th className="px-6 py-4 text-left">Customer</th>
                      <th className="px-6 py-4 text-left">Total</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.filter(po => po.status !== 'shipped' && po.status !== 'cancelled').map(po => (
                      <tr key={po.poId} className="border-b hover:bg-[#F5F1E8]">
                        <td className="px-6 py-4 font-medium">{po.poId}</td>
                        <td className="px-6 py-4">{po.customer.name}</td>
                        <td className="px-6 py-4 font-bold text-[#586330]">{formatCurrency(calculateTotal(po.items))}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => openShipmentModal(po)} className="px-4 py-2 bg-[#586330] text-white rounded mr-2">Ship</button>
                          <button onClick={() => cancelOrder(po)} className="px-4 py-2 bg-red-600 text-white rounded">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* In Transit */}
              {purchaseOrders.filter(po => po.deliveryStatus === 'in-transit').length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-50 p-4 font-bold text-blue-800">Now Shipping</div>
                  <table className="w-full">
                    <thead className="bg-[#586330] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">PO ID</th>
                        <th className="px-6 py-4 text-left">Tracking</th>
                        <th className="px-6 py-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders.filter(po => po.deliveryStatus === 'in-transit').map(po => (
                        <tr key={po.poId}>
                          <td className="px-6 py-4">{po.poId}</td>
                          <td className="px-6 py-4"><span className="font-mono">{po.trackingNumber}</span></td>
                          <td className="px-6 py-4">
                            <button onClick={() => markAsDelivered(po)} className="px-4 py-2 bg-green-600 text-white rounded">Mark Delivered</button>
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
          {activeTab === 'invoices' && viewMode === 'list' && (
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
                    const po = purchaseOrders.find(p => p.poId === inv.poId);
                    const total = calculateTotal(inv.items);
                    const hasReturnRequest = po?.returnRequests?.some(req => req.status === 'pending');
                    const hasPendingReturnRequest = po?.returnRequests?.some(req => req.status === 'pending');
                    
                    return (
                      <tr key={inv.invoiceId} className="border-b hover:bg-[#F5F1E8]">
                        <td className="px-6 py-4 font-medium">{inv.invoiceId}</td>
                        <td className="px-6 py-4">{inv.customer.name}</td>
                        <td className="px-6 py-4 font-bold text-[#586330]">{formatCurrency(total)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${po?.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {po?.deliveryStatus === 'delivered' ? 'Delivered' : 'Shipped'}
                          </span>
                          {hasReturnRequest && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Return Requested</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">{inv.shipment.trackingNumber}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => { setSelectedInvoice(inv); setViewMode('detail'); }} className="text-blue-600 mr-3 hover:underline">View</button>
                          <button onClick={() => handlePrintInvoice(inv)} className="text-gray-600 mr-3 hover:underline">Print</button>
                          <button onClick={() => handleSendInvoice(inv)} className="text-green-600 mr-3 hover:underline">Email</button>
                          {/* Only show Return button if there's a pending return request AND order is delivered */}
                          {po?.deliveryStatus === 'delivered' && hasPendingReturnRequest && (
                            <button onClick={() => openReturnModal(inv)} className="text-red-600 hover:underline">Return</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Returns Tab */}
          {activeTab === 'returns' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#586330] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Return ID</th>
                    <th className="px-6 py-4 text-left">Invoice</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Carrier</th>
                    <th className="px-6 py-4 text-left">Tracking Id</th>
                    <th className="px-6 py-4 text-left">Refund Amount</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-500">No returns yet</td></tr>
                  ) : (
                    returns.map(r => (
                      <tr key={r.returnId}>
                        <td className="px-6 py-4">{r.returnId}</td>
                        <td className="px-6 py-4">{r.invoiceId}</td>
                        <td className="px-6 py-4">{formatDate(r.date)}</td>
                        <td className="px-6 py-4">{r.carrierName}</td>
                        <td className="px-6 py-4 font-mono">{r.trackingId}</td>
                        <td className="px-6 py-4 font-bold">{formatCurrency(r.refundAmount)}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleRefund(r)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Refund
                          </button>
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
                  <h2 className="text-2xl font-bold">Confirm Shipment - {selectedPO.poId}</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-medium mb-2">Shipment Date</label>
                      <input type="date" value={shipmentDetails.shipmentDate} onChange={e => setShipmentDetails(prev => ({ ...prev, shipmentDate: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Carrier Name *</label>
                      <input type="text" placeholder="FedEx, Delhivery, etc." value={shipmentDetails.carrierName} onChange={e => setShipmentDetails(prev => ({ ...prev, carrierName: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="block font-medium mb-2">Tracking Number (AWB) *</label>
                    <input type="text" placeholder="e.g. 123456789012" value={shipmentDetails.trackingNumber} onChange={e => setShipmentDetails(prev => ({ ...prev, trackingNumber: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
                  </div>

                  <h3 className="font-bold text-lg mb-4">Items to Ship</h3>
                  <div className="space-y-4 mb-8">
                    {shipmentDetails.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-600">Ordered: {item.quantity}</p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={item.shippedQty}
                          onChange={e => {
                            const qty = Math.max(0, Math.min(parseInt(e.target.value) || 0, item.quantity));
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
                    <button onClick={() => setShowShipmentModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={confirmShipmentAndGenerateInvoice} className="px-8 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#5A3E3E]">
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
                  <h2 className="text-2xl font-bold">Process Return - {selectedInvoiceForReturn.invoiceId}</h2>
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
                    <p className="text-sm text-gray-500 mt-2">This reason was provided by the customer</p>
                  </div>

                  <h3 className="font-bold text-lg mb-4">Items Selected by Customer for Return</h3>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm font-medium">
                      <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                      Items are pre-selected based on customer's return request. You can modify quantities if needed.
                    </p>
                  </div>
                  {returnDetails.items.map((item, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-lg mb-3 ${item.customerSelected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">Delivered: {item.quantity}</p>
                        {item.customerSelected && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            ✓ Customer selected for return
                          </p>
                        )}
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.returnedQty || 0}
                        onChange={e => {
                          const qty = Math.max(0, Math.min(parseInt(e.target.value) || 0, item.quantity));
                          setReturnDetails(prev => ({
                            ...prev,
                            items: prev.items.map((it, idx) => idx === i ? { ...it, returnedQty: qty } : it)
                          }));
                        }}
                        className={`w-24 px-3 py-2 border rounded text-center ${item.customerSelected ? 'border-blue-300 bg-blue-25' : ''}`}
                        placeholder="0"
                      />
                    </div>
                  ))}

                  <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => setShowReturnModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={processReturn} className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
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