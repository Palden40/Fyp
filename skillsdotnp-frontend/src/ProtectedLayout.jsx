import { Navigate, Outlet } from "react-router-dom";
import CookieHelper from "./utils/CookieHelper";

export default function ProtectedLayout() {
  const token = CookieHelper.getCookie("token");

  return <>{token ? <Outlet /> : <Navigate to="/auth/signin" />}</>;
}
