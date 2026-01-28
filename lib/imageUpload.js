/**
 * Image Upload Utility for Nexlyn Admin
 * Handles validation, preview generation, and error reporting for image uploads.
 */

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates a single file
 * @param {File} file 
 * @returns {string|null} Error message or null if valid
 */
export const validateImage = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return `File type "${file.type}" is not supported. Use JPG, PNG or WEBP.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
        return `File "${file.name}" is too large. Max size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
};

/**
 * Processes multiple files for upload
 * @param {FileList|File[]} files 
 * @param {number} currentTotal - Current number of images already selected
 * @param {number} maxAllowed - Maximum total images allowed
 * @returns {Object} Result containing valid files, previews, and errors
 */
export const processImages = (files, currentTotal = 0, maxAllowed = 10) => {
    const fileArray = Array.from(files);
    const results = {
        validFiles: [],
        previews: [],
        errors: []
    };

    if (currentTotal + fileArray.length > maxAllowed) {
        results.errors.push(`Maximum ${maxAllowed} images allowed in total.`);
        return results;
    }

    fileArray.forEach(file => {
        const error = validateImage(file);
        if (error) {
            results.errors.push(error);
        } else {
            results.validFiles.push(file);
            results.previews.push(URL.createObjectURL(file));
        }
    });

    return results;
};

/**
 * Optimizes Cloudinary image URLs by adding auto-format and auto-quality
 * @param {string} url 
 * @returns {string} Optimized URL
 */
export const optimizeImage = (url) => {
    if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return url;
    if (url.includes('f_auto,q_auto')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

/**
 * Cleans up object URLs to prevent memory leaks
 * @param {string[]} previewUrls 
 */
export const cleanupPreviews = (previewUrls) => {
    previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    });
};
