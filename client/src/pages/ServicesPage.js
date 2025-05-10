import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServiceList from '../components/ServiceList';
import ServiceForm from '../components/ServiceForm';

const ServicesPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ServiceList />} />
      <Route path="/new" element={<ServiceForm />} />
      <Route path="/:id/edit" element={<ServiceForm />} />
    </Routes>
  );
};

export default ServicesPage; 