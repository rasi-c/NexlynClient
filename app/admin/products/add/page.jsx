'use client';

import ProductForm from '../../../../components/ProductForm';

/**
 * Add Product Page
 */
export default function AddProductPage() {
    return (
        <div className="min-h-screen">
            <ProductForm isEdit={false} />
        </div>
    );
}
