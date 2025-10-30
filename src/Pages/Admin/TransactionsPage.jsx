import React, { useState } from 'react';
import { Search, Eye, Check, X, SlidersHorizontal, Download, FileText } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx';

export default function TransactionsPage() {
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
      case 'pending': return 'bg-blue-600/20 text-blue-400';
      case 'completed': return 'bg-green-600/20 text-green-400';
      case 'failed': return 'bg-red-600/20 text-red-400';
      default: return 'bg-slate-600/20 text-slate-400';
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

  // Summary stats
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
          ? 'text-blue-400 border-b-2 border-blue-400' 
          : 'text-slate-400 hover:text-white border-b-2 border-transparent'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-6 pt-24">
      <main className="py-8">
        <Navbar />
        <div className="px-10">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-semibold">Transactions & Billing</h1>
              <p className="text-slate-400 mt-1 text-sm">
                Review, approve, or decline financial transactions and invoices.
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>

              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Data
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-slate-900 rounded-xl p-4 w-48 shadow">
              <div className="text-sm text-slate-400">Total Transactions</div>
              <div className="text-xl font-semibold">{summary.total}</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 w-48 shadow">
              <div className="text-sm text-slate-400">Pending</div>
              <div className="text-xl font-semibold">{summary.pending}</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 w-48 shadow">
              <div className="text-sm text-slate-400">Completed</div>
              <div className="text-xl font-semibold">{summary.completed}</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 w-48 shadow">
              <div className="text-sm text-slate-400">Failed</div>
              <div className="text-xl font-semibold">{summary.failed}</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 w-48 shadow">
              <div className="text-sm text-slate-400">Total Amount</div>
              <div className="text-xl font-semibold">${summary.totalAmount}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-slate-800">
            <TabButton tab="pending" label="Pending Transactions" />
            <TabButton tab="completed" label="Completed Transactions" />
            <TabButton tab="failed" label="Failed Transactions" />
            <TabButton tab="all" label="All Transactions" />
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Transaction ID"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={filter.id}
                onChange={e => setFilter({...filter, id: e.target.value})}
              />
              <input
                type="text"
                placeholder="Customer Name"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={filter.customer}
                onChange={e => setFilter({...filter, customer: e.target.value})}
              />
              <input
                type="number"
                placeholder="Amount"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={filter.amount}
                onChange={e => setFilter({...filter, amount: e.target.value})}
              />
              <select
                value={filter.type}
                onChange={e => setFilter({...filter, type: e.target.value})}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Sale">Sale</option>
                <option value="Payout">Payout</option>
                <option value="Refund">Refund</option>
              </select>
              <input
                type="date"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={filter.fromDate}
                onChange={e => setFilter({...filter, fromDate: e.target.value})}
              />
              <input
                type="date"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={filter.toDate}
                onChange={e => setFilter({...filter, toDate: e.target.value})}
              />
              <button 
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors"
                onClick={() => setFilter({id:'', customer:'', amount:'', type:'All', fromDate:'', toDate:''})}
              >
                Reset
              </button>
            </div>
          )}

          {/* Transactions Table */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn, index) => (
                    <tr 
                      key={txn.id} 
                      className={`${index !== filteredTransactions.length - 1 ? 'border-b border-slate-800' : ''} hover:bg-slate-800/50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-medium text-blue-400">{txn.id}</td>
                      <td className="px-6 py-4 text-slate-300">{txn.customer}</td>
                      <td className="px-6 py-4 text-slate-400">{txn.type}</td>
                      <td className="px-6 py-4 text-white font-medium">${txn.amount}</td>
                      <td className="px-6 py-4 text-slate-400">{txn.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 text-xs">
                          <FileText className="w-3 h-3" /> Invoice
                        </button>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button title="View Details" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                          <Eye className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </button>
                        {txn.status.toLowerCase() === 'pending' && (
                          <>
                            <button title="Approve" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                              <Check className="w-4 h-4 text-green-500 group-hover:text-green-400" />
                            </button>
                            <button title="Decline" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                              <X className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-slate-500 text-lg">
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
