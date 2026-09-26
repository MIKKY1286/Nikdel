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
      let backendSettings = {};
      if (response.data && response.data.data) {
        backendSettings = response.data.data;
      }
      
      const localExt = JSON.parse(localStorage.getItem('nikdel_extended_settings') || '{}');
      setSettings({ ...backendSettings, ...localExt });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      const localExt = JSON.parse(localStorage.getItem('nikdel_extended_settings') || '{}');
      setSettings(localExt);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const backendPayload = {
        storeName: newSettings.storeName,
        contactEmail: newSettings.contactEmail,
        storeDescription: newSettings.storeDescription,
        currency: newSettings.currency,
        timezone: newSettings.timezone
      };
      
      const extendedPayload = {
        maintenanceMode: newSettings.maintenanceMode || false,
        adminName: newSettings.adminName || '',
        adminEmail: newSettings.adminEmail || '',
        emailAlertsOrders: newSettings.emailAlertsOrders ?? true,
        emailAlertsStock: newSettings.emailAlertsStock ?? true,
        twoFactorAuth: newSettings.twoFactorAuth ?? false,
        stripeKey: newSettings.stripeKey || '',
        taxRate: newSettings.taxRate || 0
      };
      
      localStorage.setItem('nikdel_extended_settings', JSON.stringify(extendedPayload));

      const response = await api.put('/admin/settings', backendPayload);
      if (response.data && response.data.data) {
        setSettings({ ...response.data.data, ...extendedPayload });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  };

  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    fetchSettings();
    
    // Fetch live exchange rates
    const fetchRates = async () => {
      try {
        const cached = localStorage.getItem('nikdel_exchange_rates');
        if (cached) {
          const { rates, timestamp } = JSON.parse(cached);
          // Use cache if less than 24 hours old
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setExchangeRates(rates);
            return;
          }
        }
        
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates) {
          setExchangeRates(data.rates);
          localStorage.setItem('nikdel_exchange_rates', JSON.stringify({
            rates: data.rates,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err);
      }
    };
    
    fetchRates();
  }, []);

  const formatPrice = (price) => {
    const currency = settings?.currency || 'USD';
    let amount = Number(price);
    
    // Apply live market conversion if rates are available
    if (exchangeRates && exchangeRates[currency] && currency !== 'USD') {
      amount = amount * exchangeRates[currency];
    }
    
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
    exchangeRates,
    currency: settings?.currency || 'USD'
  };

  return (
    <SettingsContext.Provider value={value}>
      {!loading && children}
    </SettingsContext.Provider>
  );
}
