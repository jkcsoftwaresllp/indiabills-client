// Authentication helper functions with enhanced multi-org support

// Password validation rules (must match backend: user.helper.js)
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for digit
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (!/[@$!%*?&#^()_+=\-]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&#^()_+=-');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Session management with localStorage (can be migrated to cookies later)
export const setSession = (sessionData) => {
  localStorage.setItem('session', JSON.stringify(sessionData));
  localStorage.setItem('token', sessionData.token);
};

export const getSessions = () => {
  const session = localStorage.getItem('session');
  return session ? JSON.parse(session) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const clearSession = () => {
  localStorage.removeItem('session');
  localStorage.removeItem('token');
  localStorage.removeItem('tempUserSession');
  localStorage.removeItem('organizationContext');
};

// Organization context management
export const setOrganizationContext = (orgContext) => {
  localStorage.setItem('organizationContext', JSON.stringify(orgContext));
};

export const getOrganizationContext = () => {
  const context = localStorage.getItem('organizationContext');
  return context ? JSON.parse(context) : null;
};

export const clearOrganizationContext = () => {
  localStorage.removeItem('organizationContext');
};

// Temporary session for multi-org flow
export const setTempSession = (sessionData) => {
  localStorage.setItem('tempUserSession', JSON.stringify(sessionData));
};

export const getTempSession = () => {
  const session = localStorage.getItem('tempUserSession');
  return session ? JSON.parse(session) : null;
};

export const clearTempSession = () => {
  localStorage.removeItem('tempUserSession');
};

// Check if user needs organization setup
export const needsOrganizationSetup = (user) => {
  return !user.orgs || user.orgs.length === 0;
};

// Check if user has multiple organizations
export const hasMultipleOrganizations = (user) => {
  return user.orgs && user.orgs.length > 1;
};

// Get user role in current organization
export const getCurrentRole = (user) => {
  return user.activeOrg?.role?.toLowerCase() || 'none';
};

// Validate organization data according to new API specs
export const validateOrganizationData = (data) => {
  const errors = {};

  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Organization name is required';
  }

  // Domain/subdomain validation - at least one must be provided
  if (!data.domain && !data.subdomain) {
    errors.domain = 'Either domain or subdomain must be provided';
  }

  // Domain validation (optional but if provided)
  if (data.domain && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(data.domain)) {
    errors.domain = 'Must be a valid domain (example.com)';
  }

  // Subdomain validation (optional but if provided)
  if (data.subdomain && (!/^[a-z0-9-]+$/.test(data.subdomain) || data.subdomain.length > 100)) {
    errors.subdomain = 'Subdomain must be lowercase alphanumeric/hyphen, max 100 chars';
  }

  // Email validation (optional but if provided)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  // Phone validation (optional but if provided)
  if (data.phone && !/^(\+)?[1-9]\d{6,14}$/.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Invalid phone format (7-15 digits)';
  }

  // Website validation (optional but if provided)
  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.website = 'Website must be a valid HTTP(S) URL';
  }

  // Logo URL validation (optional but if provided)
  if (data.logoUrl && !/^https?:\/\/.+/.test(data.logoUrl)) {
    errors.logoUrl = 'Logo URL must be a valid HTTP(S) URL';
  }

  // Brand color validation (optional but if provided)
  if (data.brandPrimaryColor && !/^#[0-9A-Fa-f]{6}$/.test(data.brandPrimaryColor)) {
    errors.brandPrimaryColor = 'Primary color must be a valid hex color (#RRGGBB)';
  }

  if (data.brandAccentColor && !/^#[0-9A-Fa-f]{6}$/.test(data.brandAccentColor)) {
    errors.brandAccentColor = 'Accent color must be a valid hex color (#RRGGBB)';
  }

  // PIN code validation (optional but if provided)
  if (data.pinCode && !/^[a-zA-Z0-9\s-]{3,10}$/.test(data.pinCode)) {
    errors.pinCode = 'PIN code must be 3-10 alphanumeric characters';
  }

  // Country validation
  if (data.country && !['India', 'Other'].includes(data.country)) {
    errors.country = 'Country must be either "India" or "Other"';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate user data according to new API specs
export const validateUserData = (data, isUpdate = false) => {
  const errors = {};

  // Required fields for creation
  if (!isUpdate) {
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    }
    if (!data.password) {
      errors.password = 'Password is required';
    }
    if (!data.re_enter_password) {
      errors.re_enter_password = 'Please confirm password';
    }
    if (!data.first_name || data.first_name.trim() === '') {
      errors.first_name = 'First name is required';
    }
    if (!data.last_name || data.last_name.trim() === '') {
      errors.last_name = 'Last name is required';
    }
    if (!data.role) {
      errors.role = 'Role is required';
    }
  }

  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  // Password validation
  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join(' ');
    }
  }

  // Password confirmation
  if (data.password && data.password !== data.re_enter_password) {
    errors.re_enter_password = 'Passwords do not match';
  }

  // Username validation (optional but if provided)
  if (data.username && data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  // Phone validation (optional but if provided)
  if (data.phone && !/^(\+)?[1-9]\d{6,14}$/.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Invalid phone number (7-15 digits)';
  }

  // Avatar URL validation (optional but if provided)
  if (data.avatar_url && !/^https?:\/\/.+/.test(data.avatar_url)) {
    errors.avatar_url = 'Invalid avatar URL';
  }

  // Role validation
  if (data.role && !['admin', 'manager', 'operator', 'customer'].includes(data.role)) {
    errors.role = 'Role must be one of: admin, manager, operator, customer';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};