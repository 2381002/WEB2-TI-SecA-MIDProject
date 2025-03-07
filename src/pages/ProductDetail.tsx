import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Interface untuk ProductDetail
interface ProductDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

// Fetch produk
const fetchProductDetail = async (id: string | undefined) => {
  if (!id) throw new Error("Invalid product ID");
  return await axios.get<ProductDetail>(`/product/${id}`);
};

// Hapus produk
const deleteProduct = async (id: string | undefined) => {
  if (!id) throw new Error("Invalid product ID");
  return await axios.delete(`/product/${id}`);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Query produk
  const { data, isFetching } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
  });

  // Mutasi untuk menghapus produk
  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => navigate("/product", { replace: true }),
  });

  useEffect(() => {
    if (data?.data?.images?.length && data.data.thumbnail) {
      setSelectedImage(data.data.thumbnail);
    }
  }, [data]);

  if (isFetching || !data) return <p className="text-center text-lg">Loading...</p>;

  const product: ProductDetail = data.data;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gray-50 shadow-md rounded-lg">
      {/* Grid tampilan produk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Galeri Gambar */}
        <div className="flex flex-col items-center">
          <img
            src={selectedImage || product.thumbnail}
            alt={product.title}
            className="w-full max-w-md rounded-lg shadow-lg"
          />
          <div className="flex mt-4 space-x-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index}`}
                className="w-16 h-16 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-blue-500"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Detail Produk */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>

          {/* Harga dan Diskon */}
          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            <p className="text-sm text-red-600 line-through">
              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </p>
            <p className="text-sm text-green-600">{product.discountPercentage.toFixed(2)}% OFF</p>
          </div>

          {/* Ketersediaan dan Merek */}
          <p className="text-sm">
            <span className="font-semibold">Brand:</span> {product.brand} |{" "}
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>
          <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.availabilityStatus} - {product.stock} left
          </p>

          {/* Tombol Aksi */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => navigate(`/product/edit/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Product
            </button>
            <button
              onClick={() => { 
                const confirmDelete = window.confirm("Are you sure you want to delete this product?");
                if (confirmDelete) {
                  deleteProductMutation.mutate();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>

      {/* Ulasan Produk */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="p-4 bg-white shadow rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{review.reviewerName}</p>
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">Rating: {review.rating} ⭐</p>
                <p className="text-gray-800 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informasi Tambahan */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
        <p><span className="font-semibold">Warranty:</span> {product.warrantyInformation}</p>
        <p><span className="font-semibold">Shipping:</span> {product.shippingInformation}</p>
        <p><span className="font-semibold">Return Policy:</span> {product.returnPolicy}</p>
        <p><span className="font-semibold">Minimum Order:</span> {product.minimumOrderQuantity} units</p>
      </div>
    </div>
  );
};

export default ProductDetail;
