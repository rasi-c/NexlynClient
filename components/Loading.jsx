'use client';

/**
 * Reusable Loading Spinner Component
 * @param {Object} props
 * @param {boolean} props.fullScreen - Whether to take up the full viewport
 * @param {string} props.text - Optional text to display below the spinner
 */
const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[100]"
        : "flex flex-col items-center justify-center py-12 w-full";

    return (
        <div className={containerClasses}>
            <div className="relative w-16 h-16">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                {/* Inner Pulse */}
                <div className="absolute inset-4 bg-red-50 rounded-full animate-pulse opacity-50"></div>
            </div>
            {text && (
                <p className="mt-6 text-xs font-black text-red-600 uppercase tracking-[0.2em] animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loading;
