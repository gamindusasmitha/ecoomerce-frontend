import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";

export default function ProductPage(){

    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

     useEffect(() => {
        if (!loaded) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/products")
                .then((response) => {
                    console.log(response.data);
                    setProducts(response.data);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [loaded]);

    return (
    <div className="w-full h-[calc(100vh-100px)] ">
        {!loaded && (
            <div className="w-full h-full min-h-[250px] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
                <p className="text-gray-500 text-sm font-medium animate-pulse">
                    Loading products...
                </p>
            </div>
            
        )   
        
        }
        <div className="w-full flex justify-center p-4 flex flex-row flex-wrap">
            {
                products.map(
                    (item)=>{

                        return(
                            <ProductCard key={item.productID} product ={item}  />  )
                    }
                )
            } </div>
    </div>
);
}