import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface ProductData {
  products: Product[];
}

const fetchProductList = async () => {
  return await axios.get<ProductData>("/product");
};

const addProduct = async (newProduct: { title: string; description: string; price: number; thumbnail?: string }) => {
  return await axios.post<Product>("/product", newProduct);
};

const ProductSkeleton = () => (
  <div className="group relative">
    <div className="aspect-square w-full rounded-md bg-gray-200 animate-pulse lg:aspect-auto lg:h-80"></div>
    <div className="mt-4 flex justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="mt-1 h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
    </div>
  </div>
);

const Product = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const getProductList = useQuery({
    queryKey: ["productList"],
    queryFn: fetchProductList,
  });

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      setModalOpen(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) return;
    mutation.mutate({ title, description, price: Number(price), thumbnail: thumbnail || "/placeholder.jpg" });
  };

  return (
    <div className="container mx-auto px-4">
      {/* Tombol Tambah Produk */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">List of Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {getProductList.isFetching
              ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
              : getProductList.data?.data.products.map((product) => (
                  <div key={product.id} className="group relative" onClick={() => navigate(`/product/${product.id}`)}>
                    <img
                      alt={product.title}
                      src={product.thumbnail || "/placeholder.jpg"}
                      className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                    />
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <a>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.title}
                          </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{product.price}$</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Product Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Price ($)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Thumbnail URL (Optional)</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;