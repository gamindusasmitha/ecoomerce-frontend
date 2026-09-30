import { Routes, Route, Link } from "react-router-dom";
import logo from "../public/logo.png";

export default function AdminPage() {
    return (
        <div className="w-full h-full max-h-full flex bg-accent">

            <div className="w-[300px] h-full bg-accent ">

                

                <div className="w-full h-[100px]  flex items-center gap-3 px-4">
                    <img src={logo} alt="Logo" className="h-full w-auto object-contain shrink-0" />
                    <h1 className="text-white text-2xl font-semibold">Admin</h1>
                </div>
                <div className="w-full h-[400px] border border-white">
                    
                </div>
                

                
                
            </div>

            <div className="w-[calc(100%-300px)] h-full max-h-full overflow-y-scroll border-[10px] rounded-3xl border-accent bg-primary">

                <Routes>
                    <Route path="/" element={<h1>Orders</h1>} />
                    <Route path="/products" element={<h1>Products</h1>} />
                    <Route path="/users" element={<h1>Users</h1>} />
                    <Route path="/reviews" element={<h1>Reviews</h1>} />
                </Routes>

            </div>

        </div>
    );
}