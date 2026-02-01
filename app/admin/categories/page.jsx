'use client';

import { useState, useEffect } from 'react';
import { categoryAPI, productAPI } from '../../../lib/api';
import { validateImage } from '../../../lib/imageUpload';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaLayerGroup, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Category Management Page
 * Handles CRUD operations for product categories.
 */
export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, prodRes] = await Promise.all([
                categoryAPI.getAll(),
                productAPI.getAll()
            ]);
            setCategories(catRes.data);
            // Normalize products response shape: some endpoints return { products: [...] } while others return an array directly
            setProducts(prodRes.data?.products || prodRes.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load category data');
        } finally {
            setLoading(false);
        }
    };

    const getProductCount = (categoryId) => {
        if (!Array.isArray(products)) return 0;
        return products.filter(p => p.category?._id === categoryId || p.category === categoryId).length;
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name || '',
                description: category.description || '',
            });
            setImagePreview(category.image);
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            setImagePreview(null);
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateImage(file);
            if (error) {
                toast.error(error);
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingCategory) {
                await categoryAPI.update(editingCategory._id, data);
                toast.success('Category updated successfully');
            } else {
                await categoryAPI.create(data);
                toast.success('Category created successfully');
            }

            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data?.message || 'Error saving category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (category) => {
        const count = getProductCount(category._id);

        if (count > 0) {
            toast.error(`Category "${category.name}" is not empty (${count} products).`);
            return;
        }

        if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
            try {
                await categoryAPI.delete(category._id);
                toast.success('Category deleted');
                fetchData();
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Error deleting category');
            }
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Categories</h1>
                    <p className="text-gray-500 font-medium">Organize your products into logical groups</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-3 shadow-xl shadow-blue-200 hover:bg-red-700 transition-all transform active:scale-95"
                >
                    <FaPlus />
                    <span>New Category</span>
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Products</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((category) => {
                                const count = getProductCount(category._id);
                                return (
                                    <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-100">
                                                    <img
                                                        src={category.image || '/placeholder-category.png'}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{category.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">slug: {category.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-gray-500 text-sm line-clamp-1 max-w-xs">
                                                {category.description || 'No description provided'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${count > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {count} Items
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {categories.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <FaLayerGroup className="text-6xl text-gray-100 mx-auto" />
                            <p className="text-gray-400 font-bold">No categories found. Start by creating one!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
                                    <FaLayerGroup />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h2>
                            </div>
                            <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-black shadow-sm transition-colors"><FaTimes /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
                            <div className="space-y-6">
                                {/* Image Upload Area */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Category Image</label>
                                    <div className="relative h-56 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-red-50/10 transition-all group">
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                        />
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover p-2 rounded-[2rem]" />
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <FaImage className="text-2xl text-red-600" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Drop image or click to browse</span>
                                                <span className="text-[10px] text-gray-300 mt-2 font-medium">JPG, PNG or WEBP (Max 5MB)</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-bold placeholder:font-normal"
                                        placeholder="e.g. Modern Furniture"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                                    <textarea
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium resize-none placeholder:font-normal"
                                        placeholder="Describe what items belong in this collection..."
                                    ></textarea>
                                </div>
                            </div>

                            {editingCategory && getProductCount(editingCategory._id) > 0 && (
                                <div className="flex items-start space-x-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                    <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-1" />
                                    <p className="text-xs font-bold text-amber-700 leading-relaxed">
                                        Note: This category contains {getProductCount(editingCategory._id)} products. Changing the name will update the category slug, but existing product associations will remain intact.
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 disabled:bg-gray-400"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Saving Changes...
                                        </div>
                                    ) : (editingCategory ? 'Update Category' : 'Create Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
