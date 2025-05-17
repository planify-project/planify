import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://192.168.149.126:3000';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Transform image URLs to include the API URL
      const servicesWithFullUrls = response.data.data.map(service => ({
        ...service,
        imageUrl: service.imageUrl ? `${API_URL}${service.imageUrl}` : null
      }));
      
      setServices(servicesWithFullUrls);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Handle image upload
      if (serviceData.image && serviceData.image.uri) {
        formData.append('image', {
          uri: serviceData.image.uri,
          type: serviceData.image.type || 'image/jpeg',
          name: serviceData.image.name || 'photo.jpg'
        });
      }

      // Append other form data
      Object.keys(serviceData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, serviceData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/api/services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Transform the response data to include full image URL
      const serviceWithFullUrl = {
        ...response.data.data,
        imageUrl: response.data.data.imageUrl ? `${API_URL}${response.data.data.imageUrl}` : null
      };

      await fetchServices();
      setError(null);
      return serviceWithFullUrl;
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err.response?.data?.message || 'Failed to create service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Handle image upload
      if (serviceData.image && serviceData.image.uri) {
        formData.append('image', {
          uri: serviceData.image.uri,
          type: serviceData.image.type || 'image/jpeg',
          name: serviceData.image.name || 'photo.jpg'
        });
      }

      // Append other form data
      Object.keys(serviceData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, serviceData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/api/services/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Transform the response data to include full image URL
      const serviceWithFullUrl = {
        ...response.data.data,
        imageUrl: response.data.data.imageUrl ? `${API_URL}${response.data.data.imageUrl}` : null
      };

      await fetchServices();
      setError(null);
      return serviceWithFullUrl;
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err.response?.data?.message || 'Failed to update service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchServices();
      setError(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider value={{
      services,
      loading,
      error,
      createService,
      updateService,
      deleteService,
      fetchServices
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}; 