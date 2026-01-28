'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../../../components/ProductForm';
import { productAPI } from '../../../../../lib/api';

/**
 * Edit Product Page
 */
export default function EditProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const res = await productAPI.getById(id);
                    setProduct(res.data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                    alert('Failed to load product data');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Product Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {product ? (
                <ProductForm initialData={product} isEdit={true} />
            ) : (
                <div className="text-center py-20 text-gray-500 font-bold">Product not found.</div>
            )}
        </div>
    );
}
