import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/AxiosInstance";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
}

const fetchProductById = async (id: number) => {
  const response = await axios.get<Product>(`/product/${id}`);
  return response.data;
};

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<Product | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setProductData(data);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData) return;

    const isConfirmed = window.confirm("Are you sure you want to update this product? 🤔");

    if (isConfirmed) {
      alert("Product updated successfully! 🎉 Redirecting to product details...");
      navigate(`/product/${id}`); // ✅ Kembali ke halaman detail produk
    }
  };

  if (isLoading)
    return <p className="text-center text-lg text-gray-500">Loading product data...</p>;
  if (isError)
    return <p className="text-center text-lg text-red-500">Error fetching product data.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Edit Product</h2>
      {productData && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Product Title</label>
            <input
              type="text"
              value={productData.title}
              onChange={(e) => setProductData({ ...productData, title: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
            <input
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Thumbnail URL</label>
            <input
              type="text"
              value={productData.thumbnail || ""}
              onChange={(e) => setProductData({ ...productData, thumbnail: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/product/${id}`)}
              className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Update Product
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
