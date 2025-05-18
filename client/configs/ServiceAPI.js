import api from './api';

export const fetchServices = async (serviceType) => {
  try {
    console.log('Fetching services with type:', serviceType);
    const response = await api.get('/services', {
      params: { serviceType }
    });
    
    const formattedServices = response.data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      imageUrl: service.imageUrl,
      provider_id: service.provider_id,
      serviceType: service.serviceType
    }));

    console.log('Formatted services:', formattedServices);
    return formattedServices;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};