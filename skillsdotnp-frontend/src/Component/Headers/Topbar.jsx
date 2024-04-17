import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import baseUrl from "../../services/baseUrl";
import { useState } from "react";
import CookieHelper from "../../utils/CookieHelper";

function Topbar() {
  const [userData, setUserData] = useState();

  const navigate = useNavigate();
  const token = CookieHelper.getCookie("token");
  useGetCurrentUserData(setUserData, token);

  return (
    <div className="topbar">
      <div className="container">
        <div className="row tw-flex tw-justify-between">
          <div className="col-md-7">
            <div className="topinfo">
              <p>
                <i className="icon_mail_alt"></i>
                {token ? userData?.email : "yourname@gmail.com"}
              </p>
              <p>Role: {token ? "Student" : "guest"}</p>
            </div>
          </div>

          <div className="tw-flex tw-gap-2">
            {!CookieHelper.getCookie("token") ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="tw-h-8 tw-w-20 tw-flex tw-justify-center tw-items-center tw-ml-full tw-text-white tw-bg-[#fe7c54]"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="tw-h-8 tw-w-20 tw-flex tw-justify-center tw-items-center tw-ml-full tw-text-white tw-bg-[#fe7c54]"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    CookieHelper.deleteAllCookies();
                    navigate("/");
                  }}
                  className="tw-h-8 tw-w-20 tw-flex tw-justify-center tw-items-center tw-ml-full tw-text-white tw-bg-[#fe7c54]"
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate("/view-profile")}
                  className="tw-h-8 tw-w-20 tw-flex tw-justify-center tw-items-center tw-ml-full tw-text-white tw-bg-[#fe7c54]"
                >
                  Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
const useGetCurrentUserData = (setUserData, token) => {
  useEffect(() => {
    if (token) {
      fetch(`${baseUrl}/currentUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          setUserData(data);
        });
    }
  }, [token]);
};

export default Topbar;
