import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set)=> ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    login: async(data)=>{
        set({isLoggingIn: true});
        try{
            const loginResponse = await axiosInstance.post("/auth/login", data);
            set({authUser: loginResponse.data});
            toast.success("Logged in Successfully");
        }catch(error){
            console.log("useAuth Store login error: ", error);
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
        }
    },

    signUp: async (data)=>{
        set({isSigningUp: true})
        try{
            const signupResponse = await axiosInstance.post("/auth/signup", data);
            console.log(signupResponse)
            set({authUser: signupResponse.data});

            toast.success("Signed up successfully");
        }catch(error){
            console.error("signup store error: ", error);
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        }
    },

    checkAuth: async ()=>{
        try{
            const authResponse = await axiosInstance.get("/auth/check");
            set({authUser: authResponse.data});
        }catch(error){
            console.error("useAuthStore error: ", error);
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    }
}));