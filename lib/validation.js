/**
 * Form Validation Utility for Nexlyn
 * Provides a set of reusable validation rules with consistent error messaging.
 */

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
const PHONE_REGEX = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/; // Indian phone format

/**
 * Validates if a field is not empty
 */
export const validateRequired = (value, fieldName = 'This field') => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} is required.`;
    }
    return null;
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
    if (!email) return 'Email is required.';
    if (!EMAIL_REGEX.test(email)) {
        return 'Please enter a valid email address.';
    }
    return null;
};

/**
 * Validates if the value is a positive number
 */
export const validatePrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
        return 'Price must be a positive number.';
    }
    return null;
};

/**
 * Validates URL format
 */
export const validateURL = (url) => {
    if (!url) return null; // URLs are usually optional
    if (!URL_REGEX.test(url)) {
        return 'Please enter a valid URL (e.g. https://example.com).';
    }
    return null;
};

/**
 * Validates Indian phone number format
 */
export const validatePhone = (phone) => {
    if (!phone) return null; // Optional by default
    if (!PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
        return 'Please enter a valid 10-digit phone number.';
    }
    return null;
};

/**
 * Validates string length
 */
export const validateLength = (value, min, max, fieldName = 'Field') => {
    if (!value) return null;
    const len = value.trim().length;
    if (min && len < min) {
        return `${fieldName} must be at least ${min} characters long.`;
    }
    if (max && len > max) {
        return `${fieldName} cannot exceed ${max} characters.`;
    }
    return null;
};

/**
 * Composite validator example:
 * Use this to run multiple checks on one value
 */
export const runValidators = (value, validators) => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }
    return null;
};
