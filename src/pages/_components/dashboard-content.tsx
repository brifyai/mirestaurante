
'use client';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurant } from '../../contexts/RestaurantContext';
import GeneralDashboard from '../../components/general-dashboard';
import SpecificDashboard from '../../components/specific-dashboard';

export default function DashboardContent() {
  const { restaurantSlug } = useParams();
  const { viewMode, restaurants, setSelectedRestaurant, setViewMode } = useRestaurant();

  useEffect(() => {
    if (restaurantSlug) {
      // Find restaurant by slug
      const restaurant = restaurants.find(r =>
        r.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === restaurantSlug
      );
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        setViewMode('specific');
      }
    } else {
      setSelectedRestaurant(null);
      setViewMode('general');
    }
  }, [restaurantSlug, restaurants, setSelectedRestaurant, setViewMode]);

  return (
    <div className="space-y-8">
      {/* Dashboard Condicional */}
      {viewMode === 'general' ? (
        <GeneralDashboard />
      ) : (
        <SpecificDashboard />
      )}
    </div>
  );
}
