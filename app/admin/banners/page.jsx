'use client';

import { useState, useEffect } from 'react';
import { bannerAPI } from '../../../lib/api';
import { validateImage } from '../../../lib/imageUpload';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaImage, FaLink, FaSort } from 'react-icons/fa';

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        order: 0,
        isActive: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await bannerAPI.getAll();
            setBanners(res.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || '',
                link: banner.link || '',
                order: banner.order || 0,
                isActive: banner.isActive,
            });
            setImagePreview(banner.image);
        } else {
            setEditingBanner(null);
            setFormData({ title: '', link: '', order: 0, isActive: true });
            setImagePreview(null);
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
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
            data.append('title', formData.title);
            data.append('link', formData.link);
            data.append('order', formData.order);
            data.append('isActive', formData.isActive);

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingBanner) {
                await bannerAPI.update(editingBanner._id, data);
            } else {
                if (!imageFile) {
                    toast.error('Image is required for new banners');
                    setSubmitting(false);
                    return;
                }
                const res = await bannerAPI.create(data);
                toast.success('Banner created successfully');
            }

            fetchBanners();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Error saving banner');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await bannerAPI.delete(id);
                toast.success('Banner deleted');
                fetchBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
                toast.error('Error deleting banner');
            }
        }
    };

    if (loading && banners.length === 0) {
        return <div className="text-center py-10 font-bold text-gray-500">Loading Banners...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Banner Management</h1>
                    <p className="text-gray-500 font-medium">Manage home page promotional sliders</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-blue-200 hover:bg-red-700 transition-all"
                >
                    <FaPlus />
                    <span>Add New Banner</span>
                </button>
            </div>

            {/* Banners Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Image</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Order</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {banners.map((banner) => (
                                <tr key={banner._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="w-24 h-12 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-900 text-sm">
                                        {banner.title || <span className="text-gray-300 font-normal italic">No Title</span>}
                                    </td>
                                    <td className="px-8 py-5 text-center font-bold text-gray-600">
                                        {banner.order}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center">
                                            {banner.isActive ? (
                                                <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    <FaCheck className="mr-1" /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-gray-400 bg-gray-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    <FaTimes className="mr-1" /> Inactive
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(banner)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900">
                                {editingBanner ? 'Edit Banner' : 'New Banner'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-black transition-colors"><FaTimes /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                {/* Image Upload Area */}
                                <div className="relative group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                                    <div className="relative h-48 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                        />
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <FaImage className="text-4xl text-gray-300 mb-2" />
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Click to Upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                                        placeholder="Summer Collection Sale"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><FaLink className="mr-2 text-gray-400" /> Redirect Link</label>
                                    <input
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                                        placeholder="https://example.com/products"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><FaSort className="mr-2 text-gray-400" /> Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-end pb-3 pl-4">
                                        <label className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="w-5 h-5 rounded-md border-gray-300 text-red-600 focus:ring-blue-600 transition-all cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-red-600 transition-colors">Active Banner</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 disabled:bg-gray-400"
                                >
                                    {submitting ? 'Saving...' : (editingBanner ? 'Update Banner' : 'Create Banner')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
