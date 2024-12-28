import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from "react-hot-toast";


export const useUserStore = create((set,get)=>({
    user:null,
    loading:false,
    checkingAuth:true,

    signup:async({name,email,password,confirmPassword})=>{
        set({loading:true});
        if(password !== confirmPassword){
            set({loading:false});
            return toast.error('password do not match ');
        }
        try {
            const res = await axios.post('/auth/signup',{name,email,password});
            set({user:res.data,loading:false});
            console.log(res.data);
        } catch (error) {
            set({loading:false});
            toast.error(error?.response?.data?.message || "An error occured ");
        }
    },

    login:async(email,password)=>{
        set({loading:true});

        try {
            const res = await axios.post("/auth/login",{email,password});

            set({user:res.data,loading:false});
        } catch (error) {
            set({loading : false});
            toast.error(error.response.data.message || "An error occured");
        }
    },
    
    checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},
    
    logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

    refreshToken:async () =>{
        //prevent multiple simultaneous refersh attemts.
        if(get().checkingAuth) return ;

        set({checkingAuth:true});
        try {
            const response = await axios.post("/auth/refersh-token");

            set({checkingAuth:false});
            return response.data;

        } catch (error) {
            set({user:null,checkingAuth:false});
            throw error;
        }
    }

}))

let refreshPromise = null; // Shared variable to track ongoing token refresh requests

// Add Axios response interceptor
axios.interceptors.response.use(
  (response) => {
    // Pass successful responses directly
    return response;
  },
  async (error) => {
    const originalRequest = error.config; // Get the original request that caused the error

    // Check if the error is due to an expired token (401) and if it hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried to avoid loops

      try {
        // Check if a refresh request is already in progress
        if (refreshPromise) {
          // Wait for the existing refresh request to complete
          await refreshPromise;
          // Retry the original request with the new token
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken(); // Call the refreshToken function
        await refreshPromise; // Wait for the token to be refreshed
        refreshPromise = null; // Reset the shared variable after refresh is done

        // Retry the original request with the refreshed token
        return axios(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, log the user out
        useUserStore.getState().logout(); // Clear user state and redirect to login
        return Promise.reject(refreshError); // Pass the error back to the caller
      }
    }

    // If the error is not a 401 or the request has already been retried, reject the error
    return Promise.reject(error);
  }
);
