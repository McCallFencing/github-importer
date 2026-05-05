import { useState, useEffect, useCallback } from "react";

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const STORAGE_KEY = "mccall_contact_info";

const defaultContactInfo: ContactInfo = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export function useContactInfo() {
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
        };
      }
    } catch {
      // localStorage not available or invalid JSON
    }
    return defaultContactInfo;
  });

  // Persist to localStorage whenever contactInfo changes
  useEffect(() => {
    try {
      // Only save if at least one field has a value
      if (contactInfo.name || contactInfo.email || contactInfo.phone || contactInfo.address) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contactInfo));
      }
    } catch {
      // localStorage not available
    }
  }, [contactInfo]);

  const setContactInfo = useCallback((updates: Partial<ContactInfo>) => {
    setContactInfoState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearContactInfo = useCallback(() => {
    setContactInfoState(defaultContactInfo);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  return { contactInfo, setContactInfo, clearContactInfo };
}
