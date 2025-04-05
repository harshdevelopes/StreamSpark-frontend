import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// --- Helper Function for Fetching ---

// Add these utility functions to manage the auth token
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

// Update the apiFetch function to include the auth token in headers
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = "http://localhost:8000/api";
  const url = `${baseUrl}${endpoint}`;

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    console.log(`API Request: ${options.method || "GET"} ${url}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// --- API Function Definitions ---

// AUTH
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store the token if it exists in the response
  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
};

// WAITLIST
export const joinWaitlist = async (data: {
  email: string /* Add other fields if needed */;
}) => {
  // Adjust body based on actual waitlist API requirement
  return apiFetch("/waitlist", {
    method: "POST",
    body: JSON.stringify({ email: data.email }),
  });
};

// TIPS
export const createTipOrder = async (data: {
  amount: number;
  currency: string;
  targetUsername: string;
}) => {
  return apiFetch("/tips/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const verifyTip = async (data: {
  paymentId: string;
  orderId: string;
  signature: string;
  tipId: string | null;
}) => {
  console.log("Verifying tip:", data);
  if (!data.tipId)
    throw new Error("Internal Tip ID is missing for verification.");
  return apiFetch("/tips/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// DASHBOARD
export const getDashboardStats = async () => {
  // Assume GET request, add auth header via apiFetch helper if needed
  return apiFetch("/dashboard/stats");
};

export const getRecentTips = async (limit: number = 5) => {
  return apiFetch(`/dashboard/tips?limit=${limit}`);
};

// Add functions for other dashboard endpoints as needed
// export const getFullTipHistory = async (page: number = 1, limit: number = 10) => { ... }
// export const getProfileData = async () => { ... }
// export const updateProfileData = async (profileData) => { ... }
// export const getSettings = async () => { ... }
// export const updateSettings = async (settingsData) => { ... }
// export const getWidgetData = async () => { ... }

// --- React Query Hooks ---

// UseMutation typically used for POST, PUT, DELETE
export const useLogin = (
  options?: UseMutationOptions<any, Error, { email: string; password: string }>
) => {
  return useMutation<any, Error, { email: string; password: string }>({
    mutationFn: loginUser,
    ...options,
  });
};

export const useJoinWaitlist = (
  options?: UseMutationOptions<any, Error, { email: string }>
) => {
  return useMutation<any, Error, { email: string }>({
    mutationFn: joinWaitlist,
    ...options,
  });
};

export const useCreateTipOrder = (
  options?: UseMutationOptions<
    any,
    Error,
    { amount: number; currency: string; targetUsername: string }
  >
) => {
  return useMutation<
    any,
    Error,
    { amount: number; currency: string; targetUsername: string }
  >({
    mutationFn: createTipOrder,
    ...options,
  });
};

export const useVerifyTip = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      paymentId: string;
      orderId: string;
      signature: string;
      tipId: string | null;
    }
  >
) => {
  return useMutation<
    any,
    Error,
    {
      paymentId: string;
      orderId: string;
      signature: string;
      tipId: string | null;
    }
  >({
    mutationFn: verifyTip,
    ...options,
  });
};

// UseQuery typically used for GET requests
export const useDashboardStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery<any, Error>({
    queryKey: ["dashboardStats"], // Unique key for caching
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    ...options,
  });
};

export const useRecentTips = (
  limit: number = 5,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery<any, Error>({
    queryKey: ["recentTips", limit], // Key includes limit
    queryFn: () => getRecentTips(limit),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    ...options,
  });
};

// Add hooks for other GET endpoints as needed
// useQuery(['fullTipHistory', page, limit], () => getFullTipHistory(page, limit), { ... });
// useQuery(['profileData'], getProfileData, { ... });
// useQuery(['settings'], getSettings, { ... });
// useQuery(['widgetData'], getWidgetData, { ... });
