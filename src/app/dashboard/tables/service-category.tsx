import { useState, useEffect, ChangeEvent } from "react";
import { storage } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ServiceCategory {
  serviceCategoryId: string;
  type: string;
  cost: number;
  note: string;
  description: string;
  imageUrl?: string;
}

interface FormData {
  type: string;
  cost: number;
  note: string;
  description: string;
  image: File | null;
}

// Thêm URL placeholder image
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

// Thêm interface cho validation errors
interface ValidationErrors {
  type?: string;
  cost?: string;
  description?: string;
  note?: string;
  image?: string;
}

function ServiceCategoryTable() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: "",
    cost: 0,
    note: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ServiceCategory | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `service-categories/${uuidv4()}`);
      const uploadResult = await uploadBytes(storageRef, file);
      // Lấy URL download ngay sau khi upload
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log("Download URL:", downloadURL); // Kiểm tra URL
      return downloadURL;
    } catch (error) {       
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Thêm hàm validate
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate type
    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
    } else if (formData.type.length < 3) {
      newErrors.type = "Type must be at least 3 characters";
    } else if (formData.type.length > 50) {
      newErrors.type = "Type must not exceed 50 characters";
    }

    // Validate cost
    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = "Cost must be greater than 0";
    } else if (formData.cost > 1000000000) {
      newErrors.cost = "Cost is too high";
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    // Validate note
    if (formData.note.length > 255) {
      newErrors.note = "Note must not exceed 255 characters";
    }

    // Validate image
    if (!formData.image && !imagePreview) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (category: ServiceCategory) => {
    setCategoryToEdit(category);
    setFormData({
      type: category.type,
      cost: category.cost,
      note: category.note || "",
      description: category.description,
      image: null
    });
    setImagePreview(category.imageUrl || null);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let imageUrl = categoryToEdit?.imageUrl || "";
      if (formData.image) {
        // Xóa ảnh cũ nếu đang edit và có ảnh mới
        if (isEditMode && categoryToEdit?.imageUrl) {
          try {
            const oldImageRef = ref(storage, categoryToEdit.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }
        imageUrl = await uploadImage(formData.image);
      }

      const token = localStorage.getItem("token");
      const url = isEditMode 
        ? `http://localhost:8080/api/service-categories/${categoryToEdit?.serviceCategoryId}`
        : "http://localhost:8080/api/service-categories";

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          cost: formData.cost,
          description: formData.description,
          note: formData.note,
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) throw new Error(isEditMode ? "Failed to update category" : "Failed to create category");
      
      const data = await response.json();
      
      if (isEditMode) {
        setCategories(prev => prev.map(cat => 
          cat.serviceCategoryId === categoryToEdit?.serviceCategoryId ? data : cat
        ));
        toast.success('Category updated successfully!');
      } else {
        setCategories(prev => [...prev, data]);
        toast.success('Category created successfully!');
      }

      // Reset form
      setShowForm(false);
      setIsEditMode(false);
      setCategoryToEdit(null);
      setFormData({ type: "", cost: 0, note: "", description: "", image: null });
      setImagePreview(null);
      
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(isEditMode ? 'Failed to update category!' : 'Failed to create category!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: ServiceCategory) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/service-categories/${categoryToDelete.serviceCategoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete category");

      if (categoryToDelete.imageUrl) {
        try {
          const imageRef = ref(storage, categoryToDelete.imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      setCategories(prev =>
        prev.filter(c => c.serviceCategoryId !== categoryToDelete.serviceCategoryId)
      );

      toast.success('Category deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error('Failed to delete category!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/service-categories",
          { 
            method: "GET",
            headers: {  
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        console.log("Fetched categories:", data); // Kiểm tra dữ liệu
        setCategories(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red py-4">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

  // Thêm hàm xử lý click outside cho form
  const handleFormClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
      setErrors({});
      setImagePreview(null);
      setFormData({ type: "", cost: 0, note: "", description: "", image: null });
    }
  };

  // Thêm hàm xử lý click outside cho modal delete
  const handleModalClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <button
        type="button"
        className="mb-4 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2"
        onClick={() => setShowForm(true)}
      >
        Add New Category
      </button>

      <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-A0 border">
            <tr>
              {["Category ID",
                "Image",
                "Type",
                "Cost",
                "Description",
                "Note",
                "Actions"
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-black-15 uppercase tracking-wider text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.serviceCategoryId} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {category.serviceCategoryId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.type}
                      className="w-16 h-16 object-cover rounded mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <img 
                      src={PLACEHOLDER_IMAGE}
                      alt="No image"
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {category.type || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {category.cost || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {category.description || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {category.note || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="mx-1 text-white bg-red hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    onClick={() => {
                      console.log("Delete clicked for category:", category); // Debug log
                      handleDelete(category);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          onClick={handleFormClickOutside}
        >
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({...formData, type: e.target.value});
                    if (errors.type) {
                      setErrors({...errors, type: undefined});
                    }
                  }}
                  required
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    errors.cost ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.cost}
                  onChange={(e) => {
                    setFormData({...formData, cost: Number(e.target.value)});
                    if (errors.cost) {
                      setErrors({...errors, cost: undefined});
                    }
                  }}
                  required
                />
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-500">{errors.cost}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({...formData, description: e.target.value});
                    if (errors.description) {
                      setErrors({...errors, description: undefined});
                    }
                  }}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <textarea
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    errors.note ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.note}
                  onChange={(e) => {
                    setFormData({...formData, note: e.target.value});
                    if (errors.note) {
                      setErrors({...errors, note: undefined});
                    }
                  }}
                />
                {errors.note && (
                  <p className="mt-1 text-sm text-red-500">{errors.note}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 max-w-full h-32 object-contain"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="mx-1 text-white bg-red hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
  <div 
    className="fixed inset-0 z-50 overflow-y-auto" 
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true"
    onClick={handleModalClickOutside}
  >
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"></div>
    
    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all sm:w-full sm:max-w-lg">
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-t-lg">
          <div className="sm:flex sm:items-start">
            {/* Enhanced warning icon */}
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 shadow-lg">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Modal content with enhanced styling */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3
                className="text-lg font-bold text-white sm:text-xl"
                id="modal-title"
              >
                Delete Category
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-200">
                  Are you sure you want to delete <span className="font-medium text-gray-100">"{categoryToDelete.type}"</span>? 
                  <br />
                  <span className="text-red-200">This action cannot be undone.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal actions with button animation */}
        <div className="bg-rgb(236,248,242) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-500 hover:shadow-lg hover:ring-2 hover:ring-red-500 sm:ml-3 sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
            onClick={confirmDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-md ring-1 ring-gray-300 hover:bg-gray-100 hover:shadow-lg sm:mt-0 sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => {
              setShowDeleteModal(false);
              setCategoryToDelete(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ServiceCategoryTable; 