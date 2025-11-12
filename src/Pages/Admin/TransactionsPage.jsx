// TransactionsPage.jsx - Updated to Olive Theme (#586330)
import React, { useState } from 'react';
import { Search, Eye, Check, X, SlidersHorizontal, Download, FileText } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx';

export default function TransactionsPage() {
  const colors = {
    backgroundLight: '#f8f8f8',
    surfaceLight: '#ffffff',
    primary: '#586330',
    borderLight: '#e5e7eb',
    textLight: '#1f2937',
    textSecondaryLight: '#6b7280',
    accentBlue: '#586330',
    hoverGray: '#f3f4f6',

    pendingBg: 'bg-[#e5e9d3] text-[#586330]',
    completedBg: 'bg-[#dce3c0] text-[#586330]',
    failedBg: 'bg-red-100 text-red-700',
  };

  const [activeTab, setActiveTab] = useState('pending');
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    id: '',
    customer: '',
    amount: '',
    type: 'All',
    fromDate: '',
    toDate: '',
  });

  const [transactions] = useState([
    { id: 'TXN12345', customer: 'Alice Johnson', amount: 150, date: '2024-01-15', status: 'Pending', type: 'Sale' },
    { id: 'TXN67890', customer: 'Bob Smith', amount: 200, date: '2024-01-16', status: 'Completed', type: 'Payout' },
    { id: 'TXN11223', customer: 'Charlie Brown', amount: 75, date: '2024-01-17', status: 'Failed', type: 'Refund' },
    { id: 'TXN44556', customer: 'Diana Prince', amount: 300, date: '2024-01-18', status: 'Pending', type: 'Sale' },
    { id: 'TXN77889', customer: 'Ethan Hunt', amount: 100, date: '2024-01-19', status: 'Completed', type: 'Sale' },
    { id: 'TXN88990', customer: 'Fiona Glenanne', amount: 450, date: '2024-01-20', status: 'Pending', type: 'Sale' },
    { id: 'TXN00112', customer: 'George Kirk', amount: 50, date: '2024-01-21', status: 'Completed', type: 'Sale' },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return colors.pendingBg;
      case 'completed': return colors.completedBg;
      case 'failed': return colors.failedBg;
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (activeTab !== 'all' && txn.status.toLowerCase() !== activeTab) return false;
    if (filter.id && !txn.id.toLowerCase().includes(filter.id.toLowerCase())) return false;
    if (filter.customer && !txn.customer.toLowerCase().includes(filter.customer.toLowerCase())) return false;
    if (filter.amount && txn.amount !== Number(filter.amount)) return false;
    if (filter.type !== 'All' && txn.type !== filter.type) return false;
    if (filter.fromDate && txn.date < filter.fromDate) return false;
    if (filter.toDate && txn.date > filter.toDate) return false;
    return true;
  });

  const summary = {
    total: transactions.length,
    pending: transactions.filter(t => t.status.toLowerCase() === 'pending').length,
    completed: transactions.filter(t => t.status.toLowerCase() === 'completed').length,
    failed: transactions.filter(t => t.status.toLowerCase() === 'failed').length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
  };

  const TabButton = ({ tab, label }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`pb-3 transition-colors text-sm font-medium ${
        activeTab === tab 
          ? `text-[${colors.accentBlue}] border-b-2 border-[${colors.accentBlue}]` 
          : `text-[${colors.textSecondaryLight}] hover:text-[${colors.textLight}] border-b-2 border-transparent`
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight }}>
      <main className="py-8">
        <Navbar />
        <div className="px-10">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-semibold">Transactions & Billing</h1>
              <p className="mt-1 text-sm" style={{ color: colors.textSecondaryLight }}>
                Review, approve, or decline financial transactions and invoices.
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`px-4 py-2 border rounded-lg text-sm transition-colors flex items-center gap-2`}
                style={{ backgroundColor: colors.surfaceLight, borderColor: colors.borderLight, color: colors.textSecondaryLight }}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>

              <button 
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
                style={{ backgroundColor: colors.primary, transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b572a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
              >
                <Download className="w-4 h-4" /> Export Data
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="rounded-xl p-4 w-48 shadow-sm" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
              <div className="text-sm" style={{ color: colors.textSecondaryLight }}>Total Transactions</div>
              <div className="text-xl font-semibold">{summary.total}</div>
            </div>
            <div className="rounded-xl p-4 w-48 shadow-sm" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
              <div className="text-sm" style={{ color: colors.textSecondaryLight }}>Pending</div>
              <div className="text-xl font-semibold">{summary.pending}</div>
            </div>
            <div className="rounded-xl p-4 w-48 shadow-sm" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
              <div className="text-sm" style={{ color: colors.textSecondaryLight }}>Completed</div>
              <div className="text-xl font-semibold">{summary.completed}</div>
            </div>
            <div className="rounded-xl p-4 w-48 shadow-sm" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
              <div className="text-sm" style={{ color: colors.textSecondaryLight }}>Failed</div>
              <div className="text-xl font-semibold">{summary.failed}</div>
            </div>
            <div className="rounded-xl p-4 w-48 shadow-sm" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
              <div className="text-sm" style={{ color: colors.textSecondaryLight }}>Total Amount</div>
              <div className="text-xl font-semibold">${summary.totalAmount}</div>
            </div>
          </div>

          <div className="flex gap-8 mb-6 border-b" style={{ borderColor: colors.borderLight }}>
            <TabButton tab="pending" label="Pending Transactions" />
            <TabButton tab="completed" label="Completed Transactions" />
            <TabButton tab="failed" label="Failed Transactions" />
            <TabButton tab="all" label="All Transactions" />
          </div>

          {showFilter && (
            <div className="rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
              <input type="text" placeholder="Transaction ID" className="border rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} value={filter.id} onChange={e => setFilter({...filter, id: e.target.value})}/>
              <input type="text" placeholder="Customer Name" className="border rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} value={filter.customer} onChange={e => setFilter({...filter, customer: e.target.value})}/>
              <input type="number" placeholder="Amount" className="border rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} value={filter.amount} onChange={e => setFilter({...filter, amount: e.target.value})}/>
              <select value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }}>
                <option value="All">All Types</option>
                <option value="Sale">Sale</option>
                <option value="Payout">Payout</option>
                <option value="Refund">Refund</option>
              </select>
              <input type="date" className="border rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} value={filter.fromDate} onChange={e => setFilter({...filter, fromDate: e.target.value})}/>
              <input type="date" className="border rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} value={filter.toDate} onChange={e => setFilter({...filter, toDate: e.target.value})}/>
              <button className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: colors.textSecondaryLight }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b572a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.textSecondaryLight} onClick={() => setFilter({id:'', customer:'', amount:'', type:'All', fromDate:'', toDate:''})}>
                Reset
              </button>
            </div>
          )}

          <div className="rounded-lg shadow-xl overflow-x-auto" style={{ backgroundColor: colors.surfaceLight, border: `1px solid ${colors.borderLight}` }}>
            <table className="w-full min-w-[950px]" style={{ color: colors.textLight }}>
              <thead>
                <tr className="border-b" style={{ borderColor: colors.borderLight, backgroundColor: colors.backgroundLight }}>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Transaction ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Invoice</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondaryLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn, index) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: index !== filteredTransactions.length - 1 ? `1px solid ${colors.borderLight}` : 'none' }}>
                      <td className="px-6 py-4 font-medium" style={{ color: colors.accentBlue }}>{txn.id}</td>
                      <td className="px-6 py-4">{txn.customer}</td>
                      <td className="px-6 py-4" style={{ color: colors.textSecondaryLight }}>{txn.type}</td>
                      <td className="px-6 py-4 font-medium">${txn.amount}</td>
                      <td className="px-6 py-4" style={{ color: colors.textSecondaryLight }}>{txn.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.backgroundLight, color: colors.textSecondaryLight, border: `1px solid ${colors.borderLight}` }}>
                          <FileText className="w-3 h-3" /> Invoice
                        </button>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button title="View Details" className="p-2 rounded-full transition-colors group" style={{ backgroundColor: colors.backgroundLight, color: colors.textSecondaryLight }}>
                          <Eye className="w-4 h-4" />
                        </button>
                        {txn.status.toLowerCase() === 'pending' && (
                          <>
                            <button title="Approve" className="p-2 rounded-full transition-colors group" style={{ backgroundColor: colors.backgroundLight, color: colors.primary }}>
                              <Check className="w-4 h-4" />
                            </button>
                            <button title="Decline" className="p-2 rounded-full transition-colors group" style={{ backgroundColor: colors.backgroundLight, color: '#ef4444' }}>
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-lg" style={{ color: colors.textSecondaryLight }}>
                      No {activeTab} transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
