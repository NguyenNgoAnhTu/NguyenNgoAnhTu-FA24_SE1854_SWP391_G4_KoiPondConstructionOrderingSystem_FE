import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "app/home";
import Layout from "components/layout/layout.tsx";
import Login from "./login";
import Pond_Construction from "./pond-construction";
import Contact from "./contact";
import Register from "./register";
import Dashboard from "app/dashboard/dashboard.tsx";
import FormServiceProgress from "app/dashboard/forms/service-progress.tsx";
import TableServiceProgress from "app/dashboard/tables/service-progress.tsx";
import LayoutAdmin from "components/layout/dashboard";
import User from "app/user/user";
import Pond_Cleaning from "./pond-cleaning";
import ConstructionHistory from "app/dashboard/tables/construction-history.tsx";
import TableServiceRequest from "app/dashboard/tables/service-request.tsx"
import ConsultForm from "app/dashboard/forms/consult.tsx";
import Consult from "app/dashboard/tables/consult";
const routes = [
  { path: "/", element: <Home /> },
  { path: "/contact", element: <Contact /> },
  { path: "/pond-construction", element: <Pond_Construction /> },
  { path: "/pond-cleaning", element: <Pond_Cleaning /> },
  { path: "/user", element: <User /> },
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
    path: "/admin/tables/table-service-requests",
    element: <TableServiceRequest />,
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
    path: "/admin/tables/table-construction-history",
    element: <ConstructionHistory />,
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
    </Router>
  );
}

export default App;
