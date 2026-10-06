import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiPlus, BiEdit, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);
    const [loaded , setLoaded] = useState(false)

    // Get products from backend
    useEffect(() => {
        if(!loaded){
            axios
            .get(import.meta.env.VITE_BACKEND_URL + "/products")
            .then((response) => {
                console.log(response.data);
                setProducts(response.data);
                setLoaded(true)
            })
            
            
        }

        

    }, [loaded]);


    return (
        <div className="w-full h-full overflow-y-auto bg-gray-50 p-6 md:p-10">

            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Products
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your products and inventory
                    </p>
                </div>


                {/* Add Product Button */}
                <Link
                    to="/admin/add-product"
                    className="flex items-center gap-2 px-5 py-3
                    bg-accent text-white rounded-xl
                    font-semibold shadow-sm
                    hover:opacity-90 transition"
                >
                    <BiPlus className="text-2xl" />
                    Add Product
                </Link>

            </div>


            {/* ================= PRODUCT TABLE ================= */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    {loaded? <table className="w-full">

                        {/* ================= TABLE HEADER ================= */}
                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Product
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Product ID
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Category
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Price
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Stock
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* ================= TABLE BODY ================= */}
                        <tbody className="divide-y divide-gray-100">

                            {products.map((item, index) => (

                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition"
                                >

                                    {/* PRODUCT */}
                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-4">

                                            <img
                                                src={item.images?.[0]}
                                                alt={item.name}
                                                className="w-14 h-14 rounded-xl
                                                object-cover border border-gray-200"
                                            />

                                            <div>

                                                <p className="font-semibold text-gray-800">
                                                    {item.name}
                                                </p>

                                                <p className="text-sm text-gray-400">
                                                    {item.brand}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* PRODUCT ID */}
                                    <td className="px-6 py-4">

                                        <span className="text-sm font-medium text-gray-600">
                                            {item.productID}
                                        </span>

                                    </td>


                                    {/* CATEGORY */}
                                    <td className="px-6 py-4">

                                        <span className="px-3 py-1 rounded-full
                                        bg-gray-100 text-gray-600 text-sm">
                                            {item.category}
                                        </span>

                                    </td>


                                    {/* PRICE */}
                                    <td className="px-6 py-4">

                                        <div>

                                            <p className="font-semibold text-gray-800">
                                                Rs. {item.price?.toLocaleString()}
                                            </p>

                                            <p className="text-xs text-gray-400 line-through">
                                                Rs. {item.labelledPrice?.toLocaleString()}
                                            </p>

                                        </div>

                                    </td>


                                    {/* STOCK */}
                                    <td className="px-6 py-4">

                                        <span
                                            className={`font-medium ${
                                                item.stock > 0
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {item.stock}
                                        </span>

                                    </td>


                                    {/* STATUS */}
                                    <td className="px-6 py-4">

                                        {item.isAvailable ? (

                                            <span className="px-3 py-1 rounded-full
                                            bg-green-100 text-green-700
                                            text-sm font-medium">
                                                Available
                                            </span>

                                        ) : (

                                            <span className="px-3 py-1 rounded-full
                                            bg-red-100 text-red-600
                                            text-sm font-medium">
                                                Unavailable
                                            </span>

                                        )}

                                    </td>


                                    {/* ================= ACTIONS ================= */}
                                    <td className="px-6 py-4">

                                        <div className="flex flex-col items-center gap-2">

                                            {/* EDIT BUTTON */}
                                            <button
                                                className="w-full max-w-[100px]
                                                px-4 py-2
                                                flex items-center justify-center
                                                gap-2 rounded-lg
                                                bg-blue-50 text-blue-600
                                                hover:bg-blue-100
                                                transition"
                                            >
                                                <BiEdit className="text-lg" />
                                                Edit
                                            </button>


                                            {/* DELETE BUTTON */}
                                            <button onClick={()=>{
                                                const token = localStorage.getItem("token");
                                                axios.delete(import.meta.env.VITE_BACKEND_URL + "/products" + item.productID ,{
                                                    headers: {
                                                        Authorization:"Bearer${token}"
                                                    }
                                                } ).then(()=>{
                                                    toast.success("Product Deleted Succesfully")
                                                    setLoaded(false)
                                                })
                                            }}
                                                className="w-full max-w-[100px]
                                                px-4 py-2
                                                flex items-center justify-center
                                                gap-2 rounded-lg
                                                bg-red-50 text-red-500
                                                hover:bg-red-100
                                                transition"
                                            >
                                                <BiTrash className="text-lg" />
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table> : 
                                 <div className="w-full h-full min-h-[250px] flex flex-col items-center justify-center gap-4">

                                    <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>

                                    <p className="text-gray-500 text-sm font-medium animate-pulse">
                                         Loading products...
                                    </p>

                                </div>   }
                    

                </div>


                {/* ================= EMPTY STATE ================= */}
                {products.length === 0 && (

                    <div className="py-16 text-center">

                        <p className="text-gray-500 text-lg">
                            No products found
                        </p>

                        <p className="text-gray-400 text-sm mt-1">
                            Add your first product to get started.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}