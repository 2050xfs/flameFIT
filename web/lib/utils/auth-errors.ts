/**
 * Authentication error handling utilities
 * Maps Supabase error codes to user-friendly messages
 */

export interface AuthError {
    code?: string;
    message: string;
    hint?: string;
}

/**
 * Map of common Supabase auth error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, { message: string; hint?: string }> = {
    // Email/Password errors
    'invalid_credentials': {
        message: 'Invalid email or password',
        hint: 'Please check your credentials and try again'
    },
    'email_not_confirmed': {
        message: 'Email not verified',
        hint: 'Please check your inbox for a verification email'
    },
    'user_not_found': {
        message: 'No account found with this email',
        hint: 'Please check your email or create a new account'
    },
    'invalid_grant': {
        message: 'Invalid email or password',
        hint: 'Please check your credentials and try again'
    },

    // Signup errors
    'user_already_exists': {
        message: 'An account with this email already exists',
        hint: 'Try logging in or use password reset if you forgot your password'
    },
    'weak_password': {
        message: 'Password is too weak',
        hint: 'Use at least 8 characters with a mix of letters, numbers, and symbols'
    },
    'email_address_invalid': {
        message: 'Invalid email address',
        hint: 'Please enter a valid email address'
    },

    // Rate limiting
    'over_email_send_rate_limit': {
        message: 'Too many requests',
        hint: 'Please wait a few minutes before trying again'
    },
    'email_rate_limit_exceeded': {
        message: 'Too many email requests',
        hint: 'Please wait before requesting another email'
    },

    // Password reset
    'same_password': {
        message: 'New password must be different',
        hint: 'Please choose a different password'
    },

    // Network/Server errors
    'network_error': {
        message: 'Network connection error',
        hint: 'Please check your internet connection and try again'
    },
    'server_error': {
        message: 'Server error occurred',
        hint: 'Please try again in a few moments'
    }
};

/**
 * Get user-friendly error message from Supabase error
 */
export function getAuthErrorMessage(error: any): AuthError {
    if (!error) {
        return {
            message: 'An unexpected error occurred',
            hint: 'Please try again'
        };
    }

    // Handle string errors
    if (typeof error === 'string') {
        return {
            message: error,
        };
    }

    // Extract error code and message
    const errorCode = error.code || error.error_code || error.status;
    const errorMessage = error.message || error.error_description || error.msg;

    // Check for specific error patterns in message
    if (errorMessage) {
        const lowerMessage = errorMessage.toLowerCase();

        if (lowerMessage.includes('invalid login credentials')) {
            return ERROR_MESSAGES['invalid_credentials'];
        }
        if (lowerMessage.includes('email not confirmed')) {
            return ERROR_MESSAGES['email_not_confirmed'];
        }
        if (lowerMessage.includes('user not found')) {
            return ERROR_MESSAGES['user_not_found'];
        }
        if (lowerMessage.includes('user already registered')) {
            return ERROR_MESSAGES['user_already_exists'];
        }
        if (lowerMessage.includes('password')) {
            if (lowerMessage.includes('weak') || lowerMessage.includes('short')) {
                return ERROR_MESSAGES['weak_password'];
            }
            if (lowerMessage.includes('same')) {
                return ERROR_MESSAGES['same_password'];
            }
        }
        if (lowerMessage.includes('rate limit')) {
            return ERROR_MESSAGES['over_email_send_rate_limit'];
        }
        if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
            return ERROR_MESSAGES['network_error'];
        }
    }

    // Check mapped error codes
    if (errorCode && ERROR_MESSAGES[errorCode]) {
        return ERROR_MESSAGES[errorCode];
    }

    // Fallback to original message or generic error
    return {
        message: errorMessage || 'An error occurred during authentication',
        hint: 'Please try again or contact support if the problem persists'
    };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
    score: number; // 0-4
    feedback: string[];
    isValid: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Check length
    if (password.length >= 8) {
        score++;
    } else {
        feedback.push('Use at least 8 characters');
    }

    // Check for uppercase
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        feedback.push('Include uppercase letters');
    }

    // Check for lowercase
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        feedback.push('Include lowercase letters');
    }

    // Check for numbers
    if (/\d/.test(password)) {
        score++;
    } else {
        feedback.push('Include numbers');
    }

    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score++;
    } else {
        feedback.push('Include special characters');
    }

    // Bonus for length
    if (password.length >= 12) {
        score++;
    }

    return {
        score: Math.min(score, 4),
        feedback,
        isValid: score >= 3 && password.length >= 8
    };
}
