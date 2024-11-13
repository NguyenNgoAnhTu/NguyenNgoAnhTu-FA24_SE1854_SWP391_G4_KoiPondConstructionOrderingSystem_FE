import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Customer {
  customerId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface UpdateProfileRequest {
  customerId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("STAFF");
  const [editingCustomer, setEditingCustomer] = useState<UpdateProfileRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "STAFF" || "CONSTRUCTOR" || "DESIGNER" || "CONSULTANT" || "MAINTENANCE STAFF",
  });
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    
  });

  const roles = ["CUSTOMER", "STAFF","CONSTRUCTOR", "DESIGNER", "CONSULTANT", "MAINTENANCE"];
  const staffRoles = ["STAFF", "CONSTRUCTOR", "DESIGNER", "CONSULTANT", "MAINTENANCE"];

  const fetchCustomers = async (role: string) => {
    try {
      const token = localStorage.getItem("token");
    //  console.log("Fetching customers with role:", role);
    //  console.log("Token:", token);

      const response = await fetch(
        `http://localhost:8080/api/customer/${role}`,
        {   
          method: "GET",
          headers: {    
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      
      console.log("API Response:", response.status);
      console.log("Response data:", data);
      
      setCustomers(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updateData: UpdateProfileRequest) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/customer/${updateData.customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: updateData.name,
            email: updateData.email,
            phoneNumber: updateData.phoneNumber
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");
      
      const updatedCustomer = await response.json();
      setCustomers(prev => 
        prev.map(customer => 
          customer.customerId === updatedCustomer.customerId ? updatedCustomer : customer
        )
      );
      
      setEditingCustomer(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleDelete = async (customerId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/customer/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete customer");
      
      setCustomers(prev => prev.filter(customer => customer.customerId !== customerId));
      toast.success("Customer deleted successfully");
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete customer");
    }
  };

  const handleModalClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const handleAddStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/manager/add-staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStaff),
        }
      );

      if (!response.ok) throw new Error("Failed to add staff");
      
      const addedStaff = await response.json();
      setCustomers(prev => [...prev, addedStaff]);
      setShowAddForm(false);
      setNewStaff({ name: "", email: "", phoneNumber: "", password: "", role: "STAFF" || "CONSTRUCTOR" || "DESIGNER" || "CONSULTANT" || "MAINTENANCE" });
      toast.success("Staff added successfully");
      
      fetchCustomers(selectedRole);
    } catch (error) {
      console.error("Add staff error:", error);
      toast.error("Failed to add staff");
    }
  };

  const handleAddCustomer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCustomer),
        }
      );

      if (!response.ok) throw new Error("Failed to add customer");
      
      const addedCustomer = await response.json();
      setCustomers(prev => [...prev, addedCustomer]);
      setShowAddForm(false);
      setNewCustomer({ name: "", email: "", phoneNumber: "", password: ""});
      toast.success("Customer added successfully");
      
      fetchCustomers(selectedRole);
    } catch (error) {
      console.error("Add customer error:", error);
      toast.error("Failed to add customer");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log("Loading data for role:", selectedRole);
        await fetchCustomers(selectedRole);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError(error instanceof Error ? error.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedRole]);

  console.log("Current state:", {
    selectedRole,
    loading,
    customersCount: customers.length,
    error
  });

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

  if (customers.length === 0) {
    return <div className="text-center py-4">No data available.</div>;
  }

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

      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          className="text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2"
          onClick={() => setShowAddForm(true)}
        >
          Add New {selectedRole}  
        </button>
        
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">Select Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 shadow-sm"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-t-lg">
                <h3 className="text-lg font-bold text-black">
                  Add New {selectedRole}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newStaff.phoneNumber}
                    onChange={(e) => setNewStaff({...newStaff, phoneNumber: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedRole !== "CUSTOMER" && (
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      {staffRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                  





                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={selectedRole === "CUSTOMER" ? handleAddCustomer : handleAddStaff}
                    className="px-4 py-2 text-sm font-medium text-white bg-green rounded-md hover:bg-blue-600"
                  >
                    Add {selectedRole}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
        {customers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No {selectedRole} Found</h3>
            <p className="mt-1 text-sm text-gray-500">Click "Add New {selectedRole}" button above to create one.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-A0 border">
                <tr>
                  {["ID",
                    "Name",
                    "Email",
                    "Phone Number",
                    "Role",
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
                {customers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.customerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingCustomer?.customerId === customer.customerId ? (
                        <input
                          type="text"
                          value={editingCustomer.name}
                          onChange={(e) => setEditingCustomer({
                            ...editingCustomer,
                            name: e.target.value
                          })}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                      ) : (
                        customer.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingCustomer?.customerId === customer.customerId ? (
                        <input
                          type="email"
                          value={editingCustomer.email}
                          onChange={(e) => setEditingCustomer({
                            ...editingCustomer,
                            email: e.target.value
                          })}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                      ) : (
                        customer.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingCustomer?.customerId === customer.customerId ? (
                        <input
                          type="tel"
                          value={editingCustomer.phoneNumber}
                          onChange={(e) => setEditingCustomer({
                            ...editingCustomer,
                            phoneNumber: e.target.value
                          })}
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                      ) : (
                        customer.phoneNumber
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingCustomer?.customerId === customer.customerId ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleUpdateProfile(editingCustomer)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green  hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCustomer(null)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => setEditingCustomer({
                              customerId: customer.customerId,
                              name: customer.name,
                              email: customer.email,
                              phoneNumber: customer.phoneNumber 
                            })}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCustomerToDelete(customer);
                              setShowDeleteModal(true);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {showDeleteModal && customerToDelete && (
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
                  {/* Warning icon */}
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 shadow-lg">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>

                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      Delete Customer
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-200">
                        Are you sure you want to delete <span className="font-medium text-gray-100">"{customerToDelete.name}"</span>? 
                        <br />
                        <span className="text-red-200">This action cannot be undone.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-500 hover:shadow-lg sm:ml-3 sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => handleDelete(customerToDelete.customerId)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-md ring-1 ring-gray-300 hover:bg-gray-100 hover:shadow-lg sm:mt-0 sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCustomerToDelete(null);
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

export default CustomerTable;