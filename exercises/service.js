// done
// Separation of Concerns for Service Files Exercise
//
// This service file mixes general utility functions with business logic:
// 1. Contains both general API service functions and specific business operations
// 2. Mixes authentication logic with data fetching
// 3. Includes UI-related logic (alerts, redirects) within the service layer
// 4. Has inconsistent error handling patterns
//
// Your task: Refactor this to:
// 1. Separate general-purpose API functions from business logic
// 2. Remove UI-related code from the service layer
// 3. Create a clean, reusable service structure
// 4. Implement consistent error handling

// src/services/api.js
// General API service 
export const api = {
   baseUrl: "/api",
   // Makes a GET request to the API
   async get(endpoint) {
      try {
         const response = await fetch(`${this.baseUrl}${endpoint}`);

         if (!response.ok) throw new Error(data.message || "Something went wrong");

         const data = await response.json();

         return { ok: true, data };
      } catch (error) {
         console.error("API GET error:", error);
         return { ok: false, error: error.message };
      }
   },
   // Makes a POST request to the API
   async post(endpoint, body) {
      try {
         const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         });

         if (!response.ok) throw new Error(data.message || "Something went wrong");

         const data = await response.json();

         return { ok: true, data };
      } catch (error) {
         console.error("API POST error:", error);
         return { ok: false, error: error.message };
      }
   },
   // Makes a PUT request to the API
   async put(endpoint, body) {
      try {
         const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         });

         if (!response.ok) throw new Error(data.message || "Something went wrong");

         const data = await response.json();

         return { ok: true, data };
      } catch (error) {
         console.error("API PUT error:", error);
         return { ok: false, error: error.message };
      }
   },
};

// src/services/userService.js
import { api } from "./api";

export const login = async (userData) => {
   const response = await api.post("/auth/login", userData);

   if (!response.ok) return { success: false, error: response.error };

   return { success: true, user: response.data };
};

// User register
export const register = async (userData) => {
   const response = await api.post("/auth/register", userData);

   if (!response.ok) return { success: false, error: response.error };

   return { success: true, user: response.data };
};

// Get user profile
export const getUserProfile = async () => {
   const response = await api.get("/user/profile");

   if (!response.ok) return { success: false, error: response.error };

   return { success: true, user: response.data };
};

// Update user profile
export const updateUserProfile = async (profileData) => {
   const response = await api.put("/user/profile", profileData);

   if (!response.ok) return { success: false, error: response.error };

   return { success: true, user: response.data };
};
