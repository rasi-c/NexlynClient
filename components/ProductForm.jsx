'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productAPI, categoryAPI } from '../lib/api';
import { processImages } from '../lib/imageUpload';
import { toast } from 'react-hot-toast';
import {
    FaPlus,
    FaTrash,
    FaImage,
    FaArrowLeft,
    FaArrowUp,
    FaArrowDown,
    FaInfoCircle,
    FaList,
    FaTable
} from 'react-icons/fa';

export default function ProductForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [useCases, setUseCases] = useState('');
    const [inStock, setInStock] = useState(true);
    const [youtubeLink, setYoutubeLink] = useState('');
    const [pdfLink, setPdfLink] = useState('');

    // Dynamic Lists
    const [keyFeatures, setKeyFeatures] = useState(['']);

    // Images
    const [existingImages, setExistingImages] = useState([]); // URLs from backend
    const [imageFiles, setImageFiles] = useState([]); // File objects for new upload
    const [imagePreviews, setImagePreviews] = useState([]); // Local URLs for previews

    useEffect(() => {
        fetchCategories();
        if (initialData) {
            setName(initialData.name || '');
            setPrice(initialData.price || '');
            setCategory(initialData.category?._id || initialData.category || '');
            setDescription(initialData.description || '');
            setDetailedDescription(initialData.detailedDescription || '');
            setSpecifications(initialData.specifications || '');
            setUseCases(initialData.useCases || '');
            setInStock(initialData.inStock !== undefined ? initialData.inStock : true);
            setKeyFeatures(initialData.keyFeatures?.length > 0 ? initialData.keyFeatures : ['']);
            setExistingImages(initialData.images || []);
            setYoutubeLink(initialData.youtubeLink || '');
            setPdfLink(initialData.pdfLink || '');
        }
    }, [initialData]);

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // --- Dynamic Field Handlers ---
    const addFeature = () => setKeyFeatures([...keyFeatures, '']);
    const updateFeature = (index, value) => {
        const newFeatures = [...keyFeatures];
        newFeatures[index] = value;
        setKeyFeatures(newFeatures);
    };
    const removeFeature = (index) => setKeyFeatures(keyFeatures.filter((_, i) => i !== index));



    // --- Image Handlers ---
    const handleImageChange = (e) => {
        const { validFiles, previews, errors } = processImages(
            e.target.files,
            existingImages.length + imageFiles.length,
            10
        );

        if (errors.length > 0) {
            toast.error(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            setImageFiles([...imageFiles, ...validFiles]);
            setImagePreviews([...imagePreviews, ...previews]);
        }
    };

    const removeNewImage = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const moveExistingUp = (index) => {
        if (index === 0) return;
        const newImgs = [...existingImages];
        [newImgs[index - 1], newImgs[index]] = [newImgs[index], newImgs[index - 1]];
        setExistingImages(newImgs);
    };

    const moveExistingDown = (index) => {
        if (index === existingImages.length - 1) return;
        const newImgs = [...existingImages];
        [newImgs[index + 1], newImgs[index]] = [newImgs[index], newImgs[index + 1]];
        setExistingImages(newImgs);
    };

    // --- Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('description', description);
            formData.append('detailedDescription', detailedDescription);
            formData.append('specifications', specifications);
            formData.append('useCases', useCases);
            formData.append('inStock', inStock);
            formData.append('youtubeLink', youtubeLink);
            formData.append('pdfLink', pdfLink);

            const filteredFeatures = keyFeatures.filter(f => f.trim() !== '');
            formData.append('keyFeatures', JSON.stringify(filteredFeatures));

            // --- THE FIX: Send the list of existing images to keep ---
            // This tells the backend: "Only keep these URLs, delete anything else"
            formData.append('existingImages', JSON.stringify(existingImages));

            // Append new files
            imageFiles.forEach(file => {
                formData.append('images', file);
            });

            if (isEdit) {
                await productAPI.update(initialData._id, formData);
                toast.success('Product updated successfully');
            } else {
                await productAPI.create(formData);
                toast.success('Product published successfully');
            }

            router.push('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error saving product');
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-red-600 font-bold transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Back to Products
                </button>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: General Info */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Main Info Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-xl font-bold flex items-center text-gray-900">
                            <FaInfoCircle className="mr-3 text-red-600" /> Basic Information
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Product Name</label>
                                <input
                                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold"
                                    placeholder="e.g. Ergonomic Office Chair"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                                    <select
                                        required value={category} onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Price ($)</label>
                                    <input
                                        type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-black text-red-600"
                                        placeholder="2500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 text-gray-900">Description</label>
                                <textarea
                                    required value={description} onChange={(e) => setDescription(e.target.value)} rows="5"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium resize-none"
                                    placeholder="Tell customers about your product..."
                                ></textarea>
                            </div>

                            <label className="flex items-center cursor-pointer group w-fit">
                                <input
                                    type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)}
                                    className="w-6 h-6 rounded-lg border-gray-200 text-red-600 focus:ring-blue-600"
                                />
                                <span className="ml-3 font-bold text-gray-700 group-hover:text-red-600 transition-colors">Mark as In Stock</span>
                            </label>
                        </div>
                    </div>

                    {/* Key Features Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center text-gray-900">
                                <FaList className="mr-3 text-red-600" /> Key Features
                            </h3>
                            <button
                                type="button" onClick={addFeature}
                                className="text-red-600 text-xs font-black uppercase tracking-widest flex items-center hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                            >
                                <FaPlus className="mr-2" /> Add Line
                            </button>
                        </div>

                        <div className="space-y-3">
                            {keyFeatures.map((feature, idx) => (
                                <div key={idx} className="flex space-x-3 items-center">
                                    <span className="text-gray-300 font-bold">{idx + 1}</span>
                                    <input
                                        type="text" value={feature} onChange={(e) => updateFeature(idx, e.target.value)}
                                        className="flex-grow px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none font-medium text-sm"
                                        placeholder="e.g. 5 Years Warranty"
                                    />
                                    <button type="button" onClick={() => removeFeature(idx)} className="text-gray-300 hover:text-red-500 p-2"><FaTrash /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Description Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-xl font-bold flex items-center text-gray-900">
                            <FaInfoCircle className="mr-3 text-red-600" /> Detailed Description
                        </h3>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Full Product Details</label>
                            <textarea
                                value={detailedDescription}
                                onChange={(e) => setDetailedDescription(e.target.value)}
                                rows="8"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium resize-none"
                                placeholder="Provide comprehensive product information, features, benefits, etc."
                            ></textarea>
                        </div>
                    </div>

                    {/* Specifications Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-xl font-bold flex items-center text-gray-900">
                            <FaTable className="mr-3 text-red-600" /> Technical Specifications
                        </h3>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Product Specs</label>
                            <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs font-bold text-blue-900 mb-2">📋 Formatting Guide:</p>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Add section headings (e.g., "SPECIFICATIONS", "POWERING") on separate lines, then add key-value pairs below each heading using format: <code className="bg-blue-100 px-1 rounded">Key: Value</code>
                                </p>
                                <p className="text-xs text-blue-700 mt-2 italic">
                                    Example:<br />
                                    SPECIFICATIONS<br />
                                    Product Code: E60iUGS<br />
                                    CPU: EN7562CT<br />
                                    RAM Size: 512 MB<br />
                                    <br />
                                    POWERING<br />
                                    Max Power: 23 W<br />
                                    DC Input: 12-57 V
                                </p>
                            </div>
                            <textarea
                                value={specifications}
                                onChange={(e) => setSpecifications(e.target.value)}
                                rows="12"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono text-sm resize-none"
                                placeholder="SPECIFICATIONS&#10;Product Code: E60iUGS&#10;Suggested Price: $69.00&#10;Architecture: ARM 32bit&#10;CPU: EN7562CT&#10;&#10;POWERING&#10;Number of DC Inputs: 2&#10;Max Power Consumption: 23 W"
                            ></textarea>
                        </div>
                    </div>

                    {/* Use Cases Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-xl font-bold flex items-center text-gray-900">
                            <FaList className="mr-3 text-red-600" /> Documents & External Links
                        </h3>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Where to Use This Product</label>
                            <textarea
                                value={useCases}
                                onChange={(e) => setUseCases(e.target.value)}
                                rows="8"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium resize-none"
                                placeholder="Describe ideal use cases, applications, and scenarios for this product"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">YouTube Video Link</label>
                                <input
                                    type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">PDF Document Link</label>
                                <input
                                    type="url" value={pdfLink} onChange={(e) => setPdfLink(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                                    placeholder="https://mikrotik.com/...pdf"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Images Section */}
                <div className="space-y-8">
                    <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-8 sticky top-28">
                        <div>
                            <h3 className="text-xl font-bold flex items-center mb-1">
                                <FaImage className="mr-3 text-red-500" /> Media
                            </h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Gallery & Main Image</p>
                        </div>

                        {/* Upload Area */}
                        <div className="relative group">
                            <div className="h-40 bg-white/5 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-white/10 transition-all">
                                <FaPlus className="text-2xl text-red-500 mb-2" />
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Add Images</span>
                                <input
                                    type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"
                                />
                            </div>
                        </div>

                        {/* Image Pool */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                            {/* Existing Images */}
                            {existingImages.map((url, idx) => (
                                <div key={`exist-${idx}`} className="relative h-24 rounded-2xl overflow-hidden border border-white/10 group">
                                    <img src={url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                        <button type="button" onClick={() => moveExistingUp(idx)} className="p-2 bg-white/10 hover:bg-red-600 rounded-lg"><FaArrowUp className="text-xs" /></button>
                                        <button type="button" onClick={() => moveExistingDown(idx)} className="p-2 bg-white/10 hover:bg-red-600 rounded-lg"><FaArrowDown className="text-xs" /></button>
                                        <button type="button" onClick={() => removeExistingImage(idx)} className="p-2 bg-white/10 hover:bg-red-500 rounded-lg"><FaTrash className="text-xs" /></button>
                                    </div>
                                    {idx === 0 && <span className="absolute top-2 left-2 bg-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Main</span>}
                                </div>
                            ))}

                            {/* New Previews */}
                            {imagePreviews.map((url, idx) => (
                                <div key={`new-${idx}`} className="relative h-24 rounded-2xl overflow-hidden border-2 border-blue-500/50 group">
                                    <img src={url} alt="" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-red-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => removeNewImage(idx)} className="p-2 bg-white/10 hover:bg-red-500 rounded-lg"><FaTrash className="text-sm" /></button>
                                    </div>
                                    <span className="absolute top-2 right-2 bg-red-500 text-[8px] font-bold px-2 py-0.5 rounded-full">New</span>
                                    {existingImages.length === 0 && idx === 0 && <span className="absolute top-2 left-2 bg-red-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Main</span>}
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 disabled:bg-gray-700 shadow-xl shadow-blue-900/40"
                        >
                            {submitting ? 'Processing...' : (isEdit ? 'Save Changes' : 'Publish Product')}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
