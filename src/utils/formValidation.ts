/**
 * Centralized form validation rules and error messages
 */

// Regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[\d\s\-\+\(\)]{7,}$/; // Basic phone validation

// Error messages
export const ERROR_MESSAGES = {
  email: {
    required: 'E-postadress krävs',
    invalid: 'Ogiltig e-postadress',
  },
  password: {
    required: 'Lösenord krävs',
    tooShort: 'Lösenord måste vara minst 6 tecken',
  },
  confirmPassword: {
    required: 'Bekräftelse av lösenord krävs',
    noMatch: 'Lösenorden matchar inte',
  },
  firstName: {
    required: 'Förnamn krävs',
  },
  lastName: {
    required: 'Efternamn krävs',
  },
  phone: {
    required: 'Telefonnummer krävs',
    invalid: 'Ogiltigt telefonnummer',
  },
  name: {
    required: 'Namn krävs',
  },
  message: {
    required: 'Meddelande krävs',
  },
};

// Validation functions
export const validateEmail = (
  email: string,
): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.email.required };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.email.invalid };
  }
  return { isValid: true };
};

export const validatePassword = (
  password: string,
): { isValid: boolean; error?: string } => {
  if (!password.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.password.required };
  }
  if (password.length < 6) {
    return { isValid: false, error: ERROR_MESSAGES.password.tooShort };
  }
  return { isValid: true };
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): { isValid: boolean; error?: string } => {
  if (!confirmPassword.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.confirmPassword.required };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.confirmPassword.noMatch };
  }
  return { isValid: true };
};

export const validatePhone = (
  phone: string,
): { isValid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.phone.required };
  }
  if (!PHONE_REGEX.test(phone)) {
    return { isValid: false, error: ERROR_MESSAGES.phone.invalid };
  }
  return { isValid: true };
};

export const validateRequired = (
  value: string,
  fieldName: string,
): { isValid: boolean; error?: string } => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} krävs` };
  }
  return { isValid: true };
};
