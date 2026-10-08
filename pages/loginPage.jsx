import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage(){

    const [email , setEmail] = useState("");
    const [password, setPassword ] = useState("")
    const navigate = useNavigate();

   async function login() {
    try {
        const res = await axios.post(
            import.meta.env.VITE_BACKEND_URL + "/users/login",
            {
                email: email,
                password: password,
            }
        );

        // Your backend sends "User not found" without a token
        if (!res.data.token) {
            toast.error(res.data.message || "Login failed");
            return;
        }

        // Save the token FIRST (no space in the name!)
        localStorage.setItem("token", res.data.token);

        toast.success("Login successful");

        if (res.data.role == "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
    } catch (err) {
        console.log(err);
        toast.error("This didn't work.");
    }
}



    return(
        <div className="w-full h-screen bg-[url('/bg.jpg')] bg-center bg-cover bg-no-repeat flex ">
            <div className="w-[50%] h-full flex flex-col justify-center items-center p-[50px] ">
                <img src ='/logo.png' alt="logo" className="w-[200px] h-[200px] mb-[20px] object-cover"/>
                <h1 className=" text-[50px] text-gold text-shadow-accent text-shadow-2xs font-bold text-center">
                    Plug In . Power UP. Play Hard</h1>
                <p className=" text-[30px] text-white text-center italic ">
                    Your Ultimate Gaming Gear
                </p>

            </div>
            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[450px] h-[600px] backdrop-blur-lg bg-black/30 shadow-2xl rounded-xl flex flex-col justify-center px-12">

    {/* Title */}
    <h1 className="text-4xl font-bold text-white text-center mb-2">
        Welcome Back
    </h1>

    <p className="text-white/70 text-center mb-10">
        Login to your account
    </p>


    {/* Email */}
    <div className="mb-5">
        <label className="text-white text-sm font-medium">
            Email
        </label>

        <input
            onChange={(e)=>{
                setEmail(e.target.value)
            }}
            type="email"
            placeholder="Enter your email"
            className="w-full h-[50px] mt-2 px-4 rounded-lg 
                       bg-white/10 border border-white/20 
                       text-white placeholder-white/50 
                       outline-none focus:border-amber-500 
                       focus:bg-white/15 transition"
        />
    </div>


    {/* Password */}
    <div className="mb-6">
        <label className="text-white text-sm font-medium">
            Password
        </label>

        <input
            onChange={(p)=>{
                setPassword(p.target.value)
            }}
            type="password"
            placeholder="Enter your password"
            className="w-full h-[50px] mt-2 px-4 rounded-lg 
                       bg-white/10 border border-white/20 
                       text-white placeholder-white/50 
                       outline-none focus:border-amber-500 
                       focus:bg-white/15 transition"
        />
    </div>


    {/* Login Button */}
    
    <button onClick={login}
        className="w-full h-[50px] rounded-lg 
                   bg-amber-600 hover:bg-amber-500 
                   text-white font-semibold text-lg 
                   transition duration-300 shadow-lg"
    >
        Login
    </button>



    {/* Register */}
    <div className="text-center mt-8">
        <p className="text-white/70">
            Don't have an account?
        </p>

        <Link
            to="/register"
            className="text-amber-400 hover:text-amber-300 font-semibold"
        >
            Register here
        </Link>
    </div>


    {/* Create account */}
    <div className="text-center mt-4">
        <p className="text-white/60 text-sm">
            No account yet?
        </p>

        <Link
            to="/register"
            className="text-white hover:text-amber-400 transition"
        >
            Create an account
        </Link>
    </div>

</div>

            </div>

        </div>
    )
}