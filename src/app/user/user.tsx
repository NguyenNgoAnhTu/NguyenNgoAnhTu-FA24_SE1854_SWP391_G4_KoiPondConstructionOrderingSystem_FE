import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import "./user.css"
const User = () => {
  interface ServiceRequest {
    serviceRequestId: string;
    serviceCategory: {
      serviceCategoryId: string;
      type: string;
      cost: number;
      note: string;
    };
    description: string;
    address: string;
    note: string;
  }

  interface ServiceQuotation {
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
  }

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceQuotation, setServiceQuotation] = useState<ServiceQuotation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(localStorage.getItem("name") || "John Doe");
  const [email, setEmail] = useState(
    localStorage.getItem("email") || "john@example.com"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || "(239) 816-9029"
  );
  const [mobile, setMobile] = useState(
    localStorage.getItem("mobile") || "(320) 380-4539"
  );
  const [address, setAddress] = useState(
    localStorage.getItem("address") || "Bay Area, San Francisco, CA"
  );

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  //const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showServiceRequests, setShowServiceRequests] = useState(false);
  const [showServiceQuotation, setShowServiceQuotation] = useState(false);
  //const [customerId] = useState(localStorage.getItem("customerId") || "");
  const [modal, setModal] = useState(false)
  const handleOpen = () => {
    setModal(!modal)
  }
  useEffect(() => {
// Modify the fetchServiceRequests function


    const fetchServiceRequests = async () => {
      // if (!customerId) {
      //   setError("No customer ID found");
      //   setLoading(false);
      //   return;
      // }
      try {
        const token = localStorage.getItem("token");
        const customerId = localStorage.getItem("customerId");
        const response = await fetch(
          `http://localhost:8080/api/service-requests/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setServiceRequests(data);
        console.log(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchServiceQuotation = async () => {
      try {
        const token = localStorage.getItem("token");
      
        const customerId = localStorage.getItem("customerId");
        console.log(customerId)
        console.log(token)
        const response = await fetch(
          `http://localhost:8080/api/service-quotations/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setServiceQuotation(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
    fetchServiceQuotation();
  }, [showServiceRequests, showServiceQuotation]);

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

  const handleSave = (field: any, value: any) => {
    switch (field) {
      case "name":
        setName(value);
        localStorage.setItem("name", value);
        setIsEditingName(false);
        break;
      case "email":
        setEmail(value);
        localStorage.setItem("email", value);
        setIsEditingEmail(false);
        break;
      case "phone":
        setPhone(value);
        localStorage.setItem("phone", value);
        setIsEditingPhone(false);
        break;
      case "mobile":
        setMobile(value);
        localStorage.setItem("mobile", value);
        //setIsEditingMobile(false);
        break;
      case "address":
        setAddress(value);
        localStorage.setItem("address", value);
        setIsEditingAddress(false);
        break;
      default:
        break;
    }
  };
  return (
    <div className="container mx-auto">
      <div className="main-body">
        <div className="flex flex-wrap">
          <div className="lg:w-1/3 w-full p-4">
            <div className="card bg-white shadow-lg">
              <div className="card-body p-6">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://i.pinimg.com/564x/72/32/98/72329823360e56269897813a3dbd99b6.jpg"
                    alt="Admin"
                    className="rounded-full p-1 bg-blue-500"
                    width="110"
                  />
                  <div className="mt-3">
                    <h4 className="text-lg font-semibold">{name}</h4>
                    <p className="text-gray-400 text-sm">{address}</p>
                  </div>
                </div>
                <hr className="my-4" />
                <nav className="mt-5">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <NavLink
                        to="/user/profile"
                        className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          />
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          />
                        </svg>
                        Profile
                      </NavLink>
                    </li>
                    <div
                    className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                     onClick={handleOpen}>
                     
                      <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5 9.75H1.5C1.0875 9.75 0.75 10.0875 0.75 10.5C0.75 10.9125 1.0875 11.25 1.5 11.25H16.5C16.9125 11.25 17.25 10.9125 17.25 10.5C17.25 10.0875 16.9125 9.75 16.5 9.75Z"
                            fill=""
                          />
                          <path
                            d="M16.5 13.5H1.5C1.0875 13.5 0.75 13.8375 0.75 14.25C0.75 14.6625 1.0875 15 1.5 15H16.5C16.9125 15 17.25 14.6625 17.25 14.25C17.25 13.8375 16.9125 13.5 16.5 13.5Z"
                            fill=""
                          />
                          <path
                            d="M16.5 6H1.5C1.0875 6 0.75 6.3375 0.75 6.75C0.75 7.1625 1.0875 7.5 1.5 7.5H16.5C16.9125 7.5 17.25 7.1625 17.25 6.75C17.25 6.3375 16.9125 6 16.5 6Z"
                            fill=""
                          />
                        </svg>
                         {/* mục lớn */}
                       <p> Service</p>
                      </div> 
                    <div className={`slide-container ${modal ? "open" : ""}`}>
                      {/* mục nhỏ */}
                    <li>
                      <NavLink
                        to="#"
                        className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowServiceRequests(!showServiceRequests);
                          setShowServiceQuotation(false);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5 9.75H1.5C1.0875 9.75 0.75 10.0875 0.75 10.5C0.75 10.9125 1.0875 11.25 1.5 11.25H16.5C16.9125 11.25 17.25 10.9125 17.25 10.5C17.25 10.0875 16.9125 9.75 16.5 9.75Z"
                            fill=""
                          />
                          <path
                            d="M16.5 13.5H1.5C1.0875 13.5 0.75 13.8375 0.75 14.25C0.75 14.6625 1.0875 15 1.5 15H16.5C16.9125 15 17.25 14.6625 17.25 14.25C17.25 13.8375 16.9125 13.5 16.5 13.5Z"
                            fill=""
                          />
                          <path
                            d="M16.5 6H1.5C1.0875 6 0.75 6.3375 0.75 6.75C0.75 7.1625 1.0875 7.5 1.5 7.5H16.5C16.9125 7.5 17.25 7.1625 17.25 6.75C17.25 6.3375 16.9125 6 16.5 6Z"
                            fill=""
                          />
                        </svg>
                        Service Requests
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="#"
                        className="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-A0"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowServiceQuotation(!showServiceQuotation);
                          setShowServiceRequests(false);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V3.15002C1.77227 2.89689 1.96914 2.70002 2.22227 2.70002H14.8285C15.0816 2.70002 15.2785 2.89689 15.2785 3.15002V6.44064C15.2785 6.77814 15.5598 7.08752 15.9254 7.08752C16.291 7.08752 16.5723 6.80627 16.5723 6.44064V3.15002C16.5723 2.18439 15.7941 1.40627 14.8285 1.40627H2.22227C1.25664 1.40627 0.478516 2.18439 0.478516 3.15002V14.8219C0.478516 15.7875 1.25664 16.5656 2.22227 16.5656H15.7785C16.7441 16.5656 17.5223 15.7875 17.5223 14.8219V12.3187C17.5223 11.9812 17.2129 11.6719 16.8754 11.6719Z"
                            fill=""
                          />
                          <path
                            d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.4726 7.53752C13.2195 7.2844 12.8257 7.2844 12.5726 7.53752L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.45699 7.53752C5.20387 7.2844 4.81012 7.2844 4.55699 7.53752C4.30387 7.79065 4.30387 8.1844 4.55699 8.43752L8.55074 12.3469Z"
                            fill=""
                          />
                        </svg>
                        Service Quotations
                      </NavLink>
                    </li>  
              </div>


                    
                    
                    {/* Add more menu items as needed */}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 w-full p-4">
            <div className="card bg-white shadow-lg">
              <div className="card-body p-6">
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingName ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{name}</span>
                        <button onClick={() => setIsEditingName(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingEmail ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{email}</span>
                        <button onClick={() => setIsEditingEmail(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingPhone ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{phone}</span>
                        <button onClick={() => setIsEditingPhone(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Address</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{address}</span>
                        <button onClick={() => setIsEditingAddress(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-green text-white px-4 py-2 rounded-lg"
                    onClick={() => {
                      handleSave("name", name);
                      handleSave("email", email);
                      handleSave("phone", phone);
                      handleSave("mobile", mobile);
                      handleSave("address", address);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
                    
          {/* Service Requests */}
          {showServiceRequests && (
            <div className="container mx-auto mt-8">
              <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
                <table className="min-w-full">
                  <thead className="bg-gray-A0 border">
                    <tr>
                      {[
                        "Service Request ID",
                        "Category Type",
                        "Cost",
                        "Description",
                        "Address",
                        "Note",
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
                    {serviceRequests.map((service: ServiceRequest) => (
                      <tr
                        key={service.serviceRequestId}
                        className="hover:bg-gray-50 transition duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {service.serviceRequestId}
                        </td>

                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {service.serviceCategory.type || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {service.serviceCategory.cost || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {service.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {service.address || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {service.note || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {/* <button
                                  type="button"
                                  className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                  Create Quotation
                                </button> */}

                          <button
                            type="button"
                            className="mx-1 text-white bg-red hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* Service Quotation */}
          {showServiceQuotation && (
            <div className="container mx-auto mt-8">
              <div className="overflow-hidden rounded-lg border border-b-black-27 shadow-md">
                <table className="min-w-full">
                  <thead className="bg-gray-A0 border">
                    <tr>
                      {[
                        "Quotation ID",
                        "Category Type",
                        "Category Cost",
                        "Customer Name",
                        "Request ID",
                        "Description",
                        "Address",
                        "Total Cost",
                        "VAT",
                        "Active Status",
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
                    {serviceQuotation.map((quotation: ServiceQuotation) => (
                      <tr
                        key={quotation.serviceQuotationId}
                        className="hover:bg-gray-50 transition duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.serviceQuotationId}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.serviceRequest.serviceCategory.type ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.serviceRequest.serviceCategory.cost ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.customer.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.serviceRequest.serviceRequestId}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.serviceRequest.address || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.totalCost || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.vat || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-black-15 text-center">
                          {quotation.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            type="button"
                            className="mx-1 text-white bg-green hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="mx-1 text-white bg-red hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
