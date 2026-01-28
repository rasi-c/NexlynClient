'use client';

import { FaExclamationTriangle, FaSync } from 'react-icons/fa';

/**
 * Reusable Error Message Component
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {function} props.onRetry - Function to call when retry is clicked
 */
const ErrorMessage = ({
    message = "Something went wrong. Please try again later.",
    onRetry
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8 border border-red-100 shadow-sm animate-bounce">
                <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Oops! encountered an error</h3>
            <p className="text-gray-500 max-w-sm mb-10 font-medium">
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center space-x-3 bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95"
                >
                    <FaSync className="text-sm" />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
