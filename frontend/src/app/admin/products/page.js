'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Plus, Trash2, Edit2, Package, X, RefreshCw, Save } from 'lucide-react';

const CATEGORIES = ['Dry Food', 'Wet Food', 'Treats', 'Kitten Food', 'Senior Food', 'Supplements'];

const emptyForm = {
    name: '',
    price: '',
    stock: '',
    category: 'Dry Food',
    description: '',
    image: '',
};

// ─── Shared Input Styles ────────────────────────────
const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-xs text-slate-800 transition-colors';
const labelCls = 'block font-bold text-slate-700 mb-1 text-xs';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null = create mode; object = edit mode

    const [formData, setFormData] = useState(emptyForm);

    // ─── Fetch Products ──────────────────────────────
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

    // ─── Open Modal (Create) ─────────────────────────
    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData(emptyForm);
        setModalOpen(true);
    };

    // ─── Open Modal (Edit) ──────────────────────────
    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name:        product.name || '',
            price:       product.price || '',
            stock:       product.stock ?? '',
            category:    (typeof product.category === 'object' ? product.category?.name : product.category) || 'Dry Food',
            description: product.description || '',
            image:       product.image || '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
        setFormData(emptyForm);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ─── Submit (Create or Edit) ─────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingProduct) {
                await adminService.updateProduct(editingProduct.id, formData);
            } else {
                await adminService.createProduct(formData);
            }
            closeModal();
            fetchProducts();
        } catch (err) {
            console.error('Failed to save product:', err);
            const msg = err?.response?.data?.message || 'Failed to save product. Check backend validation.';
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Delete ──────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to permanently delete this product?')) return;
        try {
            await adminService.deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
            alert(err?.response?.data?.message || 'Could not delete product.');
        }
    };

    return (
        <div className="space-y-6">
            {/* ─── Header ─────────────────────────────── */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Package className="w-6 h-6 text-teal-600" /> Products Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage stock, add new cat food inventory and updates</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-teal-600/20"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* ─── Products Table ──────────────────────── */}
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
                                <th className="p-4">Product</th>
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
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                                                />
                                            )}
                                            <span className="font-bold text-slate-800 line-clamp-1">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                                            {typeof item.category === 'object' ? item.category?.name : (item.category || 'General')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-extrabold text-teal-700">৳{item.price}</td>
                                    <td className="p-4 font-semibold text-slate-600">{item.stock ?? 'N/A'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        {/* Edit */}
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all cursor-pointer"
                                            title="Edit Product"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {/* Delete */}
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

            {/* ─── Add / Edit Product Modal ────────────── */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        {/* Close */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-extrabold text-slate-800 mb-5">
                            {editingProduct ? `Edit Product #${editingProduct.id}` : 'Add New Product'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className={labelCls}>Product Title *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="e.g. Whiskas Adult Cat Food 1.2kg"
                                />
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>Price (৳) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={inputCls}
                                        placeholder="1200"
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Stock Qty *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className={inputCls}
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className={labelCls}>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={inputCls}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className={labelCls}>Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="https://images.unsplash.com/..."
                                />
                                {/* Image Preview */}
                                {formData.image && (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="mt-2 w-full h-32 object-cover rounded-xl border border-slate-200"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className={labelCls}>Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="Product description..."
                                />
                            </div>

                            {/* Submit */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl transition-all cursor-pointer text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> {editingProduct ? 'Update Product' : 'Save Product'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}