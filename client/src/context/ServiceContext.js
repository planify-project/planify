import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, API_URL, getImageUrl } from '../../config';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching services from:', `${API_BASE}/services`);
      const response = await axios.get(`${API_BASE}/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Raw API Response:', response.data);
      
      // Transform image URLs to include the API URL
      const servicesWithFullUrls = response.data.data.map(service => {
        console.log('Processing service:', service);
        
        // Use the getImageUrl helper for all image fields
        const imageUrl = getImageUrl(service.imageUrl);
        const coverImage = getImageUrl(service.coverImage);
        const mainImage = getImageUrl(service.mainImage);
        const images = service.images ? service.images.map(getImageUrl) : [];

        console.log('Service image data:', {
          original: {
            imageUrl: service.imageUrl,
            coverImage: service.coverImage,
            mainImage: service.mainImage,
            images: service.images
          },
          processed: {
            imageUrl,
            coverImage,
            mainImage,
            images
          }
        });

        // Use the first available image
        const finalImageUrl = imageUrl || coverImage || mainImage || (images.length > 0 ? images[0] : null);

        return {
          ...service,
          imageUrl: finalImageUrl,
          images: images.length > 0 ? images : (finalImageUrl ? [finalImageUrl] : [])
        };
      });
      
      console.log('Final processed services:', servicesWithFullUrls);
      setServices(servicesWithFullUrls);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
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

      const response = await axios.post(`${API_BASE}/services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Transform the response data to include full image URL
      const serviceWithFullUrl = {
        ...response.data.data,
        imageUrl: getImageUrl(response.data.data.imageUrl)
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

      const response = await axios.put(`${API_BASE}/services/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Transform the response data to include full image URL
      const serviceWithFullUrl = {
        ...response.data.data,
        imageUrl: getImageUrl(response.data.data.imageUrl)
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
      await axios.delete(`${API_BASE}/services/${id}`, {
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