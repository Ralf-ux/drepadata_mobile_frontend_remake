import Constants from 'expo-constants';

// API Base URL
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ||
                      process.env.EXPO_PUBLIC_API_URL ||
                      'http://localhost:4000/api';

// Helper function to make API calls with better error handling
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((err: any) => err.msg || err.message).join(', ');
        throw new Error(errorMessages || data.message || 'Validation error');
      }
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection and API URL.');
    }
    
    // SECURITY: Don't log full error details that might contain sensitive information
    // Only log error message, not full error object
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('API Error:', errorMessage);
    
    // Sanitize error message before throwing
    // Remove any potential sensitive data
    const sanitizedMessage = errorMessage
      .replace(/password[=:]\s*[^\s,}]+/gi, 'password=***')
      .replace(/token[=:]\s*[^\s,}]+/gi, 'token=***')
      .replace(/secret[=:]\s*[^\s,}]+/gi, 'secret=***');
    
    throw new Error(sanitizedMessage);
  }
};

// Patient API
export const patientAPI = {
  create: async (patientData: any) => {
    return apiCall('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  getAll: async () => {
    return apiCall('/patients');
  },

  getById: async (id: string, includeRelated: boolean = false) => {
    const query = includeRelated ? '?include=all' : '';
    return apiCall(`/patients/${id}${query}`);
  },

  update: async (id: string, patientData: any) => {
    return apiCall(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patientData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Consultation API
export const consultationAPI = {
  create: async (consultationData: any) => {
    return apiCall('/consultations', {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  },

  getAll: async () => {
    return apiCall('/consultations');
  },

  getById: async (id: string) => {
    return apiCall(`/consultations/${id}`);
  },

  getByPatientId: async (patientId: string) => {
    return apiCall(`/consultations/patient/${patientId}`);
  },

  update: async (id: string, consultationData: any) => {
    return apiCall(`/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(consultationData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/consultations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Follow-up API
export const followUpAPI = {
  create: async (followUpData: any) => {
    return apiCall('/follow-ups', {
      method: 'POST',
      body: JSON.stringify(followUpData),
    });
  },

  getAll: async () => {
    return apiCall('/follow-ups');
  },

  getById: async (id: string) => {
    return apiCall(`/follow-ups/${id}`);
  },

  getByPatientId: async (patientId: string) => {
    return apiCall(`/follow-ups/patient/${patientId}`);
  },

  update: async (id: string, followUpData: any) => {
    return apiCall(`/follow-ups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(followUpData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/follow-ups/${id}`, {
      method: 'DELETE',
    });
  },
};

// Vaccination API
export const vaccinationAPI = {
  create: async (vaccinationData: any) => {
    return apiCall('/vaccinations', {
      method: 'POST',
      body: JSON.stringify(vaccinationData),
    });
  },

  getAll: async () => {
    return apiCall('/vaccinations');
  },

  getById: async (id: string) => {
    return apiCall(`/vaccinations/${id}`);
  },

  getByPatientId: async (patientId: string) => {
    return apiCall(`/vaccinations/patient/${patientId}`);
  },

  update: async (id: string, vaccinationData: any) => {
    return apiCall(`/vaccinations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(vaccinationData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/vaccinations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Helper to get patient identities for dropdowns
export const getPatientIdentities = async () => {
  try {
    const response = await patientAPI.getAll();
    if (response.success && response.data) {
      return response.data.map((patient: any) => ({
        id: patient._id || patient.id,
        nom: patient.nom,
        prenom: patient.prenom,
        numero_identification_unique: patient.numero_identification_unique,
        sexe: patient.sexe,
        type_de_drepanocytose: patient.type_drepanocytose,
        date_du_diagnostic: patient.date_diagnostic,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching patient identities:', error);
    return [];
  }
};

export interface PatientIdentity {
  id: string;
  nom: string;
  prenom: string;
  numero_identification_unique: string;
  sexe?: string;
  type_de_drepanocytose?: string;
  date_du_diagnostic?: string;
}

