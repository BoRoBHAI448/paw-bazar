'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Plus, Trash2, Edit2, Package, X, RefreshCw } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Dry Food',
        description: '',
        image: '',
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await adminService.getProducts();
            const list = Array.isArray(res) ? res : res?.data || [];
            setProducts(list);
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await adminService.createProduct(formData);
            setModalOpen(false);
            setFormData({ name: '', price: '', stock: '', category: 'Dry Food', description: '', image: '' });
            fetchProducts(); // List Refresh
        } catch (err) {
            console.error('Failed to create product:', err);
            alert('Failed to save product. Please check backend validation.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await adminService.deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
            alert('Could not delete product.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Package className="w-6 h-6 text-teal-600" /> Products Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage stock, add new cat food inventory and updates</p>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-teal-600/20"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-500">Loading inventory...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-500 font-semibold">
                        No products found in database.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="p-4">ID</th>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-4 font-bold text-slate-400">#{item.id}</td>
                                    <td className="p-4 font-bold text-slate-800">{item.name}</td>

                                    {/* Correct Category Cell */}
                                    <td className="p-4">
                                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                                            {typeof item.category === 'object' ? item.category?.name : (item.category || 'General')}
                                        </span>
                                    </td>

                                    <td className="p-4 font-extrabold text-teal-700">৳{item.price}</td>
                                    <td className="p-4 font-semibold text-slate-600">{item.stock ?? 'N/A'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Product Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-extrabold text-slate-800 mb-4">Add New Product</h3>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                                    placeholder="e.g. Whiskas Adult Cat Food"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Price (৳)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                                        placeholder="1200"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Stock Qty</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white"
                                >
                                    <option value="Dry Food">Dry Food</option>
                                    <option value="Wet Food">Wet Food</option>
                                    <option value="Treats">Treats</option>
                                    <option value="Kitten Food">Kitten Food</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
                                    placeholder="Product description..."
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-xs"
                                >
                                    {submitting ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}