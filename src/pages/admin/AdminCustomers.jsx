import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Mail } from "lucide-react";
import adminService from "../../services/admin.service";
import AdminCustomerForm from "../../components/admin/AdminCustomerForm";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      const usersList = Array.isArray(data) ? data : (data.data || data.users || []);
      // Map to format expected by UI if needed
      const mapped = usersList.map(u => ({
        ...u,
        id: u._id || u.id,
        totalOrders: u.totalOrders || 0,
        totalSpent: u.totalSpent || 0,
        status: u.status || (u.isActive !== false ? 'active' : 'suspended')
      }));
      setCustomers(mapped);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this customer?")) {
      const updated = customers.filter(c => c.id !== id);
      setCustomers(updated);
      saveAdminData("customers", updated);
    }
  };

  const filtered = customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (customer = null) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSaveCustomer = (customerData) => {
    let updated;
    if (editingCustomer) {
      updated = customers.map(c => c.id === customerData.id ? customerData : c);
    } else {
      updated = [customerData, ...customers];
    }
    setCustomers(updated);
    saveAdminData("customers", updated);
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage customer accounts.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                        {(customer.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{customer.name || 'Unnamed'}</p>
                        <p className="text-xs text-slate-500">{customer.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{customer.totalOrders}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      customer.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      customer.status === 'suspended' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Send Email">
                        <Mail size={16} />
                      </button>
                      <button onClick={() => handleOpenForm(customer)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <AdminCustomerForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveCustomer} 
        editingCustomer={editingCustomer} 
      />
    </div>
  );
}
