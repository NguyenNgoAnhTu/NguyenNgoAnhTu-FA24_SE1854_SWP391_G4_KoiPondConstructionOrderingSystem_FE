import { useState } from "react";

const User = () => {
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
                {/* <hr className="my-4" />
                <ul className="list-none">
                  <li className="flex justify-between items-center py-2">
                    <h6 className="mb-0 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      Website
                    </h6>
                    <span className="text-gray-500">https://bootdey.com</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <h6 className="mb-0 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      Github
                    </h6>
                    <span className="text-gray-500">bootdey</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <h6 className="mb-0 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                      Twitter
                    </h6>
                    <span className="text-gray-500">@bootdey</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <h6 className="mb-0 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-pink-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        ></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      Instagram
                    </h6>
                    <span className="text-gray-500">bootdey</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <h6 className="mb-0 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      Facebook
                    </h6>
                    <span className="text-gray-500">bootdey</span>
                  </li>
                </ul> */}
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

                {/* <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <h6 className="mb-0">Mobile</h6>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {isEditingMobile ? (
                      <input
                        type="text"
                        className="form-input w-full"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    ) : (
                      <div className="flex justify-between">
                        <span>{mobile}</span>
                        <button onClick={() => setIsEditingMobile(true)}>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div> */}

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
            {/* <div className="mt-6">
              <div className="card bg-white shadow-lg">
                <div className="card-body p-6">
                  <h5 className="mb-4">Project Status</h5>
                  <p>Web Design</p>
                  <div className="w-full bg-gray-200 h-1 mb-4">
                    <div
                      className="bg-gray-A0 h-1"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <p>Website Markup</p>
                  <div className="w-full bg-gray-200 h-1 mb-4">
                    <div className="bg-red h-1" style={{ width: "72%" }}></div>
                  </div>
                  <p>One Page</p>
                  <div className="w-full bg-gray-200 h-1 mb-4">
                    <div
                      className="bg-green h-1"
                      style={{ width: "89%" }}
                    ></div>
                  </div>
                  <p>Mobile Template</p>
                  <div className="w-full bg-gray-200 h-1 mb-4">
                    <div
                      className="bg-yellow h-1"
                      style={{ width: "55%" }}
                    ></div>
                  </div>
                  <p>Backend API</p>
                  <div className="w-full bg-gray-200 h-1">
                    <div
                      className="bg-brown h-1"
                      style={{ width: "66%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
