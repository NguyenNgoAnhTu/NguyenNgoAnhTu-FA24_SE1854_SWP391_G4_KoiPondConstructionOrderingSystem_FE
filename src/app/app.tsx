import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "app/home";
import About from "app/about";
import Layout from "components/layout/layout.tsx";
import Login from "./login";
import Pond_Construction from "./pond-construction";
import Pond_Cleaning from "./pond-cleaning";
import Contact from "./contact";
import Register from "./register";
import Dashboard from "app/dashboard/dashboard.tsx";
import FormServiceProgress from "app/dashboard/forms/service-progress.tsx";
import TableServiceProgress from "app/dashboard/tables/service-progress.tsx";
import LayoutAdmin from "components/layout/dashboard";
import ConstructionHistory from "app/dashboard/tables/construction-history.tsx";
import User from "app/user/user";
import TableServiceQuotation from "app/dashboard/tables/service-quotation.tsx";
import TableServiceRequest from "app/dashboard/tables/service-request.tsx"
import TableServiceDetail from "app/dashboard/tables/service-detail.tsx"
// import PondDesignTemplateForm from "app/dashboard/forms/pondDesignTemplate";
import ConstructionInfomation from "app/user/construction-infomation.tsx";
import ConsultForm from "app/dashboard/forms/consult.tsx";
import Consult from "app/dashboard/tables/consult";
import RequestDetailTable from "app/dashboard/tables/request-detail";
import PondDesignTemplateTable from "app/dashboard/tables/pondDesignTemplate";
// import DesignProfileForm from "app/dashboard/forms/design-profile.tsx"
import TableServicePayment from "app/dashboard/tables/service-payment.tsx";
import TableServiceFeedback from "app/dashboard/tables/service-feedback.tsx";
import ServiceCategoryTable from "app/dashboard/tables/service-category.tsx"
import ManagerUser from "app/dashboard/tables/managerUser.tsx"
import DesignProfileForm from "app/dashboard/forms/design-profile.tsx";
import DesignProfileManagerTable from "app/dashboard/tables/designprofile-manager";
import DesignProfileTable from "app/dashboard/tables/designProfile.tsx";
import Quotation from "app/dashboard/tables/quotation.tsx";
import ShowQuotation from "app/dashboard/tables/showQuotationCus";
import Constructors from "app/dashboard/tables/constructors.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const routes = [
  { path: "/", element: <Home /> },
  { path: "/contact", element: <Contact /> },
  { path: "/pond-construction", element: <Pond_Construction /> },
  { path: "/pond-cleaning", element: <Pond_Cleaning /> },
  { path: "/about", element: <About /> },
  { path: "/user", element: <User /> },
  { path: "/user/construction-infomation", element: <ConstructionInfomation /> },
];

const routesAdmin = [
  { path: "/admin", element: <Dashboard /> },
  { path: "/admin/dashboard", element: <Dashboard /> },
  {
    path: "/admin/constructions/form-service-progress",
    element: <FormServiceProgress />,
  },
  {
    path: "/admin/maintenances/service-progress",
    element: <TableServiceProgress />,
  },
  {
    path: "/admin/maintenances/service-payment",
    element: <TableServicePayment />,
  },
  {
    path: "/admin/maintenances/service-feedback",
    element: <TableServiceFeedback />,
  },
  {
    path: "/admin/maintenances/service-requests",
    element: <TableServiceRequest />,
  },
  {
    path: "/admin/maintenances/service-quotation",
    element: <TableServiceQuotation />,
  },
  {
    path: "/admin/maintenances/service-details",
    element: <TableServiceDetail />,
  },
  {
    path: "/admin/constructions/construction-history",
    element: <ConstructionHistory />,
  },
  {
    path: "/admin/forms/design-profile-form",
    element: <DesignProfileForm />,
  },
  // {
  //   path: "/admin/forms/pondDesignTemplate",
  //   element: <PondDesignTemplateForm />,
  // },
  {
    path: "/admin/constructions/design-profile-manager",
    element: <DesignProfileManagerTable />,
  },
  {
    path: "/admin/constructions/design-profile",
    element: <DesignProfileTable />,
  },
  {
    path: "/admin/tables/show-quotation-cus",
    element: < ShowQuotation />,
  },
  {
    path: "/admin/constructions/consult",
    element: < Consult />,
  },

  {
    path: "/admin/forms/form-consult",
    element: <ConsultForm />,
  },
  {
    path: "/admin/constructions/consult",
    element: <Consult />,
  },
  {
    path: "/admin/constructions/requestDetail",
    element: <RequestDetailTable />,
  },
  {
    path: "/admin/constructions/pondDesignTemplate",
    element: <PondDesignTemplateTable />,
  },
  {
    path: "/admin/constructions/quotation",
    element: <Quotation />,

  },
  {
    path: "/admin/maintenances/service-category",
    element: <ServiceCategoryTable />,
  },
  {
    path: "/admin/user-management",
    element: <ManagerUser />,
  },
  {
    path: "/admin/constructors-detail",
    element: <Constructors />,
  },
];

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={<Layout>{element}</Layout>} />
        ))}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {routesAdmin.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<LayoutAdmin>{element}</LayoutAdmin>}
          />
        ))}


      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
