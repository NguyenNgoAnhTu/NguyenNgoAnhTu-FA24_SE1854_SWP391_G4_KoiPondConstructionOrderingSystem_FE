import { useEffect, useState } from "react";
import { toast } from "react-toastify";


function ServiceRequestTable() {
  interface ServiceDetail {
    serviceDetailId: string;
    staff: {
      customerId: string;
      name: string;
    };
    serviceQuotation: {
      serviceQuotationId: string;
      customer: {
        name: string;
        email: string;
        role: string;
      };
      serviceRequest: {
        serviceRequestId: string;
        customer: {
          name: string;
          email: string;
          role: string;
        };
        serviceCategory: {
          serviceCategoryId: number;
          type: string;
          cost: number;
          note: string;
        };
        address: string;
      };
      description: string;
      note: string;
      cost: number;
      totalCost: number;
      vat: number;
      isActive: boolean;
    };
    description: string;
    isActive: boolean;
  }

  interface Staff {
    customerId: string;
    name: string;
    role: string;
  }

  const [serviceDetailsData, setServiceDetailsData] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDetail, setEditingDetail] = useState<ServiceDetail | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState<ServiceDetail | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/service-details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setServiceDetailsData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, []);

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/customer/STAFF", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch staff list");
        
        const data = await response.json();
        const filteredStaff = data.filter((staff: Staff) => staff.role !== "CUSTOMER");
        setStaffList(filteredStaff);
      } catch (error) {
        console.error("Error fetching staff list:", error);
        toast.error("Failed to load staff list");
      }
    };

    fetchStaffList();
  }, []);

  const handleEdit = async (serviceDetail: ServiceDetail) => {
    setEditingDetail(serviceDetail);
    setShowEditForm(true);
  };

  const handleDelete = async (serviceDetailId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/service-details/${serviceDetailId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete service detail");
      }

      setServiceDetailsData(prevData => 
        prevData.filter(detail => detail.serviceDetailId !== serviceDetailId)
      );
      setShowDeleteModal(false);
      setDetailToDelete(null);
      toast.success("Service detail deleted successfully!");

    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete service detail!");
    }
  };

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

  if (serviceDetailsData.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-A0 border">
            <tr>
              {[
                "Service Detail ID",
                "Staff Name",
                "Quotation ID",
                "Customer Name",
                "Description",
                "Address",
                "Actions",
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
            {serviceDetailsData.map((serviceDetail) => (
              <tr
                key={serviceDetail.serviceDetailId}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceDetailId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.staff.name}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.serviceQuotationId}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.customer.name}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.description}
                </td>
                <td className="px-6 py-4 text-sm text-black-15 text-center">
                  {serviceDetail.serviceQuotation.serviceRequest.address}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    onClick={() => handleEdit(serviceDetail)}
                    className="mx-1 text-white bg-green hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDetailToDelete(serviceDetail);
                      setShowDeleteModal(true);
                    }}
                    className="mx-1 text-white bg-red hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && detailToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm"></div>
          <div className="flex min-h-screen items-center justify-center">
            <div className="relative bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p>Are you sure you want to delete this service detail?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDetailToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(detailToDelete.serviceDetailId)}
                  className="px-4 py-2 bg-red text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditForm && editingDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm"></div>
          <div className="flex min-h-screen items-center justify-center">
            <div className="relative bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-4 text-white">Edit Service Detail</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem("token");
                  const response = await fetch(
                    `http://localhost:8080/api/service-details/${editingDetail.serviceDetailId}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        staffId: editingDetail.staff.customerId,
                        description: editingDetail.description,
                      }),
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to update service detail");
                  }

                  const updatedDetail = await response.json();
                  setServiceDetailsData(prevData =>
                    prevData.map(detail =>
                      detail.serviceDetailId === updatedDetail.serviceDetailId
                        ? updatedDetail
                        : detail
                    )
                  );
                  setShowEditForm(false);
                  setEditingDetail(null);
                  toast.success("Service detail updated successfully!");

                } catch (error) {
                  console.error("Update error:", error);
                  toast.error("Failed to update service detail!");
                }
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-white">Staff</label>
                  <select
                    value={editingDetail.staff.customerId}
                    onChange={(e) => {
                      const selectedStaff = staffList.find(staff => staff.customerId === e.target.value);
                      setEditingDetail({
                        ...editingDetail,
                        staff: {
                          customerId: e.target.value,
                          name: selectedStaff?.name || ''
                        }
                      });
                    }}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    required
                  >
                    <option value="">Select Staff</option>
                    {staffList.map(staff => (
                      <option 
                        key={staff.customerId} 
                        value={staff.customerId}
                      >
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-white">Description</label>
                  <textarea
                    value={editingDetail.description}
                    onChange={(e) => setEditingDetail({
                      ...editingDetail,
                      description: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    required
                  />
                </div>
                        
                <div className="flex justify-end gap-4">
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingDetail(null);
                    }}
                    className="px-4 py-2 bg-red text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green text-white rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceRequestTable;
