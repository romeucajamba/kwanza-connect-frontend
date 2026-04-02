/**
 * Security utilities for KwanzaConnect frontend.
 * Focuses on preventing XSS and sensitive data leakage.
 */

/**
 * Basic HTML Sanitizer to prevent XSS in user-provided strings.
 * Disables tags and attributes that can execute JavaScript.
 */
export const sanitizeHTML = (str: string): string => {
  if (!str) return '';
  
  // Replace direct script tags
  let sanitized = str.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
  
  // Replace event handlers (onclick, onerror, etc)
  sanitized = sanitized.replace(/on\w+="[^"]*"/gim, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/gim, '');
  
  // Replace javascript: pseudo-protocol
  sanitized = sanitized.replace(/javascript:/gim, '');
  
  return sanitized;
};

/**
 * Escapes characters for safe rendering in HTML.
 * Use this when you are not using React's default escaping ({{ }}).
 */
export const escapeHTML = (str: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Security-focused log masking.
 * Ensures tokens or passwords aren't accidentally logged.
 */
export const maskSensitiveData = (data: any): any => {
  if (!data) return data;
  
  const sensitiveKeys = ['token', 'password', 'secret', 'access_token', 'cpf', 'nif'];
  const masked = { ...data };
  
  Object.keys(masked).forEach(key => {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      masked[key] = '********';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  });
  
  return masked;
};
