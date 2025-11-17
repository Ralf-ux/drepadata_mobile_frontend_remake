import React from 'react';
import CreateConsultationScreen from './create';

// This wrapper component allows us to set screen options to hide the tab bar
const CreateConsultationRoute = () => {
  return <CreateConsultationScreen />;
};

// Set screen options to hide tab bar
CreateConsultationRoute.options = {
  tabBarStyle: { display: 'none' },
  headerShown: false,
};

export default CreateConsultationRoute;