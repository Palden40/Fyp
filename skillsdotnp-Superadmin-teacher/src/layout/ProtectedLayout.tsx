import { Navigate, Outlet } from "react-router-dom";

function getCookieByName(cookieName: string) {
  const cookies = document.cookie.split("; ");
  console.log("cookies", cookies);
  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].split("=");
    console.log("cookies", name, value);

    if (name === cookieName) {
      return value;
    }
  }
}

export default function ProtectedLayout() {
  console.log("protectedlayout");
  if (getCookieByName("superToken")) return;
  const token = getCookieByName("token");

  return <>{token ? <Outlet /> : <Navigate to="/auth/signin" />}</>;
}
