'use client';

import { useEffect } from 'react';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Global Error Boundary for Next.js App Router
 */
export default function GlobalError({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Next.js Global Error:', error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border border-gray-100 max-w-2xl mx-4">
                <ErrorMessage
                    message={error?.message || "We encountered a critical error while rendering this page."}
                    onRetry={() => reset()}
                />
                <div className="mt-8 text-center">
                    <a href="/" className="text-red-600 font-bold hover:underline text-sm uppercase tracking-widest">
                        Return to Homepage
                    </a>
                </div>
            </div>
        </main>
    );
}
