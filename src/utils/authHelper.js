// Authentication helper functions

// Session management with cookies
export const setSession = (sessionData) => {
  // Store in localStorage for now, can be changed to cookies later
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

// Validate organization data
export const validateOrganizationData = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Organization name is required';
  }

  if (!data.domain && !data.subdomain) {
    errors.domain = 'Either domain or subdomain must be provided';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (data.phone && !/^\+?[1-9]\d{6,14}$/.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Invalid phone format (7-15 digits)';
  }

  if (data.website && !/^https?:\/\/.+/.test(data.website)) {
    errors.website = 'Website must be a valid HTTP(S) URL';
  }

  if (data.logoUrl && !/^https?:\/\/.+/.test(data.logoUrl)) {
    errors.logoUrl = 'Logo URL must be a valid HTTP(S) URL';
  }

  if (data.brandPrimaryColor && !/^#[0-9A-Fa-f]{6}$/.test(data.brandPrimaryColor)) {
    errors.brandPrimaryColor = 'Primary color must be a valid hex color (#RRGGBB)';
  }

  if (data.brandAccentColor && !/^#[0-9A-Fa-f]{6}$/.test(data.brandAccentColor)) {
    errors.brandAccentColor = 'Accent color must be a valid hex color (#RRGGBB)';
  }

  if (data.pinCode && !/^[a-zA-Z0-9\s-]{3,10}$/.test(data.pinCode)) {
    errors.pinCode = 'PIN code must be 3-10 alphanumeric characters';
  }

  if (data.subdomain && (!/^[a-z0-9-]+$/.test(data.subdomain) || data.subdomain.length > 100)) {
    errors.subdomain = 'Subdomain must be lowercase alphanumeric/hyphen, max 100 chars';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};