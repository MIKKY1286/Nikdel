import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data && response.data.data) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put('/admin/settings', newSettings);
      if (response.data && response.data.data) {
        setSettings(response.data.data);
        return true;
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (price) => {
    const currency = settings?.currency || 'USD';
    const amount = Number(price);
    
    // NGN formatting
    if (currency === 'NGN') {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
      }).format(amount);
    }
    
    // EUR formatting
    if (currency === 'EUR') {
      return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    }
    
    // GBP formatting
    if (currency === 'GBP') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(amount);
    }
    
    // USD formatting (default)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const value = {
    settings,
    loading,
    updateSettings,
    formatPrice,
    currency: settings?.currency || 'USD'
  };

  return (
    <SettingsContext.Provider value={value}>
      {!loading && children}
    </SettingsContext.Provider>
  );
}
