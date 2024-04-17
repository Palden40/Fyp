import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ECommerce from "./pages/Dashboard/E-Learning";
import Loader from "./common/Loader";
import { routes, superAdminRoutes } from "./routes";
import ProtectedLayout from "./layout/ProtectedLayout";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import AdminSignIn from "./pages/Authentication/AdminSignIn";
import SuperAdminLayout from "./layout/SuperAdminLayout";

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/superadmin/signin" element={<AdminSignIn />} />

        <Route element={<DefaultLayout />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route path="/superadmin" element={<ECommerce />} />
            {superAdminRoutes?.map((routes, i) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={i}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route index element={<ECommerce />} />
            {routes.map((routes, i) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={i}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
