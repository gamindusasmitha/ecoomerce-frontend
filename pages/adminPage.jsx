import { Routes, Route, NavLink } from "react-router-dom";
import logo from "../public/logo.png";

import {
    FiShoppingBag,
    FiPackage,
    FiUsers,
    FiStar
} from "react-icons/fi";
import AdminProductPage from "./admin/adminProductPage";
import AdminAddProductPage from "./admin/adminAddProduct";

export default function AdminPage() {
    return (
        <div className="w-full h-full flex bg-accent overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            <div className="w-[280px] h-full shrink-0 bg-accent">

                {/* Logo + Admin */}
                <div className="w-full h-[100px] flex items-center px-4 gap-4">

                    <img
                        src={logo}
                        alt="Logo"
                        className="w-[90px] h-[70px] object-contain"
                    />

                    <h1 className="text-white text-2xl font-semibold">
                        Admin
                    </h1>

                </div>


                {/* Navigation */}
                <nav className="mt-4 px-4 flex flex-col gap-2">

                    {/* Orders */}
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `w-full h-[50px] flex items-center gap-4 px-3 rounded-lg
                            text-lg transition duration-200
                            ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <FiShoppingBag size={22} />
                        <span>Orders</span>
                    </NavLink>


                    {/* Products */}
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `w-full h-[50px] flex items-center gap-4 px-3 rounded-lg
                            text-lg transition duration-200
                            ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <FiPackage size={22} />
                        <span>Products</span>
                    </NavLink>


                    {/* Users */}
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `w-full h-[50px] flex items-center gap-4 px-3 rounded-lg
                            text-lg transition duration-200
                            ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <FiUsers size={22} />
                        <span>Users</span>
                    </NavLink>


                    {/* Reviews */}
                    <NavLink
                        to="/admin/reviews"
                        className={({ isActive }) =>
                            `w-full h-[50px] flex items-center gap-4 px-3 rounded-lg
                            text-lg transition duration-200
                            ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        <FiStar size={22} />
                        <span>Reviews</span>
                    </NavLink>

                </nav>

            </div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 h-full min-w-0 overflow-y-auto 
                            bg-primary border-[10px] border-accent 
                            rounded-tl-3xl">

                <Routes>

                    <Route
                        path="/"
                        element={
                            <h1 className="text-2xl text-black">
                                Orders
                            </h1>
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <AdminProductPage/>
                        }
                    />

                    <Route
                        path="/add-product"
                        element={
                            <AdminAddProductPage/>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <h1 className="text-2xl text-black">
                                Users
                            </h1>
                        }
                    />

                    <Route
                        path="/reviews"
                        element={
                            <h1 className="text-2xl text-black">
                                Reviews
                            </h1>
                        }
                    />

                </Routes>

            </div>

        </div>
    );
}