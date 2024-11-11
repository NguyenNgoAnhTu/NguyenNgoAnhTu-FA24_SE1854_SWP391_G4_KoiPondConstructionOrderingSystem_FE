import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "app/home";
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
import ConstructionInfomation from "app/user/construction-infomation.tsx";
import ConsultForm from "app/dashboard/forms/consult.tsx";
import Consult from "app/dashboard/tables/consult";
import Quotation from "./dashboard/forms/quotation";
import QuotationTable from "app/dashboard/tables/quotation"
import RequestDetailTable from "app/dashboard/tables/request-detail";
import DesignProfile from "./dashboard/tables/designProfile";
import DesignProfileForm from "app/dashboard/forms/design-profile.tsx"
import DesignProfileManager from "app/dashboard/tables/designprofile-manager.tsx"
import TableServicePayment from "app/dashboard/tables/service-payment.tsx";
import TableServiceFeedback from "app/dashboard/tables/service-feedback.tsx";
import ServiceCategoryTable from "app/dashboard/tables/service-category.tsx"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const routes = [
  { path: "/", element: <Home /> },
  { path: "/contact", element: <Contact /> },
  { path: "/pond-construction", element: <Pond_Construction /> },
  { path: "/pond-cleaning", element: <Pond_Cleaning /> },
  { path: "/user", element: <User /> },
  { path: "/user/construction-infomation", element: <ConstructionInfomation /> },
];

const routesAdmin = [
  { path: "/admin", element: <Dashboard /> },
  { path: "/admin/dashboard", element: <Dashboard /> },
  {
    path: "/admin/forms/form-service-progress",
    element: <FormServiceProgress />,
  },
  {
    path: "/admin/tables/table-service-progress",
    element: <TableServiceProgress />,
  },
  {
    path: "/admin/tables/table-service-payment",
    element: <TableServicePayment />,
  },
  {
    path: "/admin/tables/table-service-feedback",
    element: <TableServiceFeedback />,
  },
  {
    path: "/admin/tables/table-service-requests",
    element: <TableServiceRequest />,
  },
  {
    path: "/admin/tables/table-service-quotation",
    element: <TableServiceQuotation />,
  },
  {
    path: "/admin/tables/table-service-details",
    element: <TableServiceDetail />,
  },
  {
    path: "/admin/tables/table-construction-history",
    element: <ConstructionHistory />,
  },

  {
    path: "/admin/forms/quotation",
    element: <Quotation />,
  },
  {
    path: "/admin/tables/table-designProfile",
    element: <DesignProfile />,
  },
  {
    path: "/admin/forms/design-profile-form",
    element: <DesignProfileForm />,
  },
  {
    path: "/admin/tables/designProfile-manager",
    element: <DesignProfileManager />,
  },
  {
    path: "/admin/forms/form-consult",
    element: <ConsultForm />,
  },
  {
    path: "/admin/tables/table-consult",
    element: <Consult />,
  },
  {
    path: "/admin/tables/table-requestDetail",
    element: <RequestDetailTable />,
  },
  {
    path: "/admin/tables/table-quotation",
    element: <QuotationTable />,
  },
  {
    path: "/admin/tables/table-service-category",
    element: <ServiceCategoryTable />,
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
