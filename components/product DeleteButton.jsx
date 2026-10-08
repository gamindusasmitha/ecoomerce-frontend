import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProductDeleteButton(props) {
  const productID = props.productID;
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const token = localStorage.getItem("token");

    axios
      .delete(import.meta.env.VITE_BACKEND_URL + "/products/" + productID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Product deleted successfully " + productID);
        setIsMessageOpen(false);
        setIsDeleting(false);
        if (props.onDeleted) {
          props.onDeleted();
        }
      })
      .catch((error) => {
        console.log(error.response?.data);
        toast.error(error.response?.data?.message || "Failed to delete product");
        setIsDeleting(false);
      });
  }

  return (
    <>
      <button
        onClick={() => setIsMessageOpen(true)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>

      {isMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl animate-popIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Product
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsMessageOpen(false)}
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}