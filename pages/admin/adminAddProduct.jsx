import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function AdminAddProductPage() {

    const [productID, setProductID] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [labeledPrice, setLabeledPrice] = useState("");
    const [images, setImages] = useState("");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const navigate =useNavigate()


    async function addProduct(params) {
        const token = localStorage.getItem("token")
        if (token==nul){
            toast.error("You must be login as admin to add product")
            Navigate("/login");
            return
        }
        if (productID==""|| name==""){
            toast.error("Please fill the alll required fields")
            return
        }

        try{
            await axios.post( import.meta.env.VITE_BACKEND_URL + "/products/",{ 
                productID : productID,

             },{headers :{
                Authorization : "Bearear" + token
             }} )

            toast.success("Product added succesfully")
            navigate("/admin/products")

        }catch{(error)
            toast.error("Error adding products")
        }
        
    }

    return (
        <div className="w-full  overflow-y-scroll flex justify-center p-8 items-center">

            <div className="w-[900px] bg-accent/50 rounded-2xl p-8 shadow-xl h-auto overflow-y-auto ">

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Add New Product
                    </h1>

                    <p className="text-white/60 mt-1">
                        Add a new product to your store
                    </p>
                </div>


                {/* ================= BASIC INFORMATION ================= */}

                <div className="bg-white/5 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-white mb-5">
                        Basic Information
                    </h2>


                    {/* Product ID */}
                    <div className="mb-5">
                        <label className="block text-white/80 mb-2">
                            Product ID
                        </label>

                        <input
                            type="text"
                            value={productID}
                            onChange={(e) => setProductID(e.target.value)}
                            placeholder="Enter product ID"
                            className="w-full h-[45px] px-4 rounded-lg
                                       bg-white/10 border border-white/20
                                       text-white placeholder-white/40
                                       outline-none focus:border-amber-500"
                        />
                    </div>


                    {/* Product Name */}
                    <div className="mb-5">
                        <label className="block text-white/80 mb-2">
                            Product Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            className="w-full h-[45px] px-4 rounded-lg
                                       bg-white/10 border border-white/20
                                       text-white placeholder-white/40
                                       outline-none focus:border-amber-500"
                        />
                    </div>


                    {/* Alternative Names */}
                    <div>
                        <label className="block text-white/80 mb-2">
                            Alternative Names
                        </label>

                        <input
                            type="text"
                            value={altNames}
                            onChange={(e) => setAltNames(e.target.value)}
                            placeholder="Example: RTX 4060, GeForce RTX 4060"
                            className="w-full h-[45px] px-4 rounded-lg
                                       bg-white/10 border border-white/20
                                       text-white placeholder-white/40
                                       outline-none focus:border-amber-500"
                        />

                        <p className="text-white/40 text-sm mt-2">
                            Separate multiple names using commas.
                        </p>
                    </div>

                </div>


                {/* ================= DESCRIPTION ================= */}

                <div className="bg-white/5 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-white mb-5">
                        Description
                    </h2>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product description"
                        rows="5"
                        className="w-full px-4 py-3 rounded-lg
                                   bg-white/10 border border-white/20
                                   text-white placeholder-white/40
                                   outline-none focus:border-amber-500
                                   resize-none"
                    />

                </div>


                {/* ================= PRICING ================= */}

                <div className="bg-white/5 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-white mb-5">
                        Pricing
                    </h2>

                    <div className="grid grid-cols-2 gap-5">

                        {/* Price */}
                        <div>
                            <label className="block text-white/80 mb-2">
                                Selling Price
                            </label>

                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-[45px] px-4 rounded-lg
                                           bg-white/10 border border-white/20
                                           text-white placeholder-white/40
                                           outline-none focus:border-amber-500"
                            />
                        </div>


                        {/* Labelled Price */}
                        <div>
                            <label className="block text-white/80 mb-2">
                                Labelled Price
                            </label>

                            <input
                                type="number"
                                value={labeledPrice}
                                onChange={(e) => setLabeledPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-[45px] px-4 rounded-lg
                                           bg-white/10 border border-white/20
                                           text-white placeholder-white/40
                                           outline-none focus:border-amber-500"
                            />
                        </div>

                    </div>

                </div>


                {/* ================= PRODUCT DETAILS ================= */}

                <div className="bg-white/5 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-white mb-5">
                        Product Details
                    </h2>


                    <div className="grid grid-cols-2 gap-5">

                        {/* Category */}
                        <div>
                            <label className="block text-white/80 mb-2">
                                Category
                            </label>
                            <select className="text-white border-[2px] border-white/50 w-full ">
                                <option className="text-black" value="CPU">CPU</option>
                                <option className="text-black" value="Graphic card">Graphic Card</option>
                                <option className="text-black" value="CPU">Mother board</option>
                                <option className="text-black" value="Ram">Ram</option>
                                <option className="text-black" value="Hard disk">Hard disk</option>
                                <option className="text-black" value="CPU">SSD</option>
                                <option className="text-black" value="CPU">Powe supply</option>
                                <option className="text-black" value="CPU">Mouse</option>
                                <option className="text-black" value="CPU">Keyboard</option>
                            </select>

                            
                        </div>


                        {/* Model */}
                        <div>
                            <label className="block text-white/80 mb-2">
                                Model Number
                            </label>

                            <input
                                type="text"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="Example: RTX4060"
                                className="w-full h-[45px] px-4 rounded-lg
                                           bg-white/10 border border-white/20
                                           text-white placeholder-white/40
                                           outline-none focus:border-amber-500"
                            />
                        </div>


                        {/* Brand */}
                        <div>
                            <label className="block text-white/80 mb-2">
                                Brand
                            </label>

                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="Example: ASUS"
                                className="w-full h-[45px] px-4 rounded-lg
                                           bg-white/10 border border-white/20
                                           text-white placeholder-white/40
                                           outline-none focus:border-amber-500"
                            />
                        </div>


                        {/* Stock */}
                        <div>
                            <label className="block text-white/80 mb-2">
                                Stock
                            </label>

                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="0"
                                className="w-full h-[45px] px-4 rounded-lg
                                           bg-white/10 border border-white/20
                                           text-white placeholder-white/40
                                           outline-none focus:border-amber-500"
                            />
                        </div>

                    </div>

                </div>


                {/* ================= IMAGES ================= */}

                <div className="bg-white/5 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold text-white mb-5">
                        Product Images
                    </h2>

                    <input
                        type="text"
                        value={images}
                        onChange={(e) => setImages(e.target.value)}
                        placeholder="Enter image URL"
                        className="w-full h-[45px] px-4 rounded-lg
                                   bg-white/10 border border-white/20
                                   text-white placeholder-white/40
                                   outline-none focus:border-amber-500"
                    />

                    <p className="text-white/40 text-sm mt-2">
                        You can add image upload functionality later.
                    </p>

                </div>


                {/* ================= AVAILABILITY ================= */}

                <div className="bg-white/5 rounded-xl p-6 mb-8">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Product Availability
                            </h2>

                            <p className="text-white/50 text-sm mt-1">
                                Make this product available for customers.
                            </p>
                        </div>


                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="w-5 h-5 accent-amber-500"
                        />

                    </div>

                </div>


               <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        onClick={addProduct}
                        className="flex-1 h-[50px] rounded-xl bg-amber-600 hover:bg-amber-500 
                         text-white font-semibold text-lg shadow-md 
                         transition duration-200"
                    >
                         Add Product
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="flex-1 h-[50px] rounded-xl bg-white/10 hover:bg-red/20 
                        border border-white/20 text-white font-semibold text-lg 
                         transition duration-200 hover:red-500/50"
                    >
                        Cancel
                    </button>
                </div>

            </div>

        </div>
    );
}

   