import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import GotoTop from "../../Component/GotoTop";
import CookieHelper from "../../utils/CookieHelper";
import baseUrl from "../../services/baseUrl";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

const purchased = [
  {
    id: 1,
    name: "Getting Started with LESS",
    date: "24/03/2020",
    grade: "50%",
    progress: "0%",
    status: "Finished",
    result: "Passed",
    link: "/",
  },
  {
    id: 2,
    name: "LMS Interactive Content",
    date: "24/03/2020",
    grade: "40%",
    progress: "0%",
    status: "Finished",
    result: "Passed",
    link: "/",
  },
  {
    id: 3,
    name: "From Zero to Hero with Nodejs",
    date: "14/04/2019",
    grade: "70%",
    progress: "0%",
    status: "running",
    result: "Failed",
    link: "/",
  },
  {
    id: 4,
    name: "Helping to change the world",
    date: "04/07/2018",
    grade: "50%",
    progress: "0%",
    status: "running",
    result: "Failed",
    link: "/",
  },
];

function InstructorProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Owned");
  const [userData, setUserData] = useState();
  const [editable, setEditable] = useState(false);

  const [filter, setFilter] = useState("All");

  const token = CookieHelper.getCookie("token");
  useGetCurrentUserData(setUserData, token);

  const [activeData, setActiveData] = useState(purchased);
  //handle course data
  useEffect(() => {
    if (filter === "All") {
      setActiveData(purchased);
    } else if (filter === "Finished") {
      setActiveData(purchased.filter((data) => data.status === "Finished"));
    } else {
      setActiveData(purchased.filter((data) => data.result === filter));
    }
  }, [filter]);

  //handle Loading
  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  const handleImageChange = async (e) => {
    try {
      if (e.target.files) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        console.log("e.target.value", e.target.value);
        console.log("formdata", formData);
        const res1 = await fetch(`${baseUrl}/file`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${CookieHelper.getCookie("token")}`,
          },
        });
        const jsonRes1 = await res1.json();
        console.log("res2", jsonRes1);
        if (!jsonRes1.url) return toast.error("Something went wrong.");

        const payload = {
          username: userData?.username,
          profilePicture: jsonRes1.url,
        };

        const res2 = await fetch(`${baseUrl}/profile`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${CookieHelper.getCookie("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (res2.ok) {
          toast.success("Profile picture updated.");
          window.location.reload();
        } else {
          toast.success("Something went wrong.");
        }
      }
    } catch (err) {
      console.error("err", err);
    }
  };

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>
        <Header logo="assets/images/ElearningLogo.webp" joinBtn={true} />
        <section className="profile-section">
          <div className="teacher-profile tw-w-[30rem] tw-mx-auto">
            <div className="teacher-thumb tw-flex tw-flex-col tw-items-end">
              <img
                src={
                  userData?.profilePicture
                    ? `http://localhost:5500/api${userData?.profilePicture}`
                    : "assets/images/home2/teacher/1.png"
                }
                alt="Profile Picture"
              />
              <label
                className="tw-text-3xl tw-rounded-full tw-bg-blue-500 tw-p-3 tw-cursor-pointer tw-text-white tw-w-fit tw-relative tw-opacity-95 tw-bottom-7 hover:tw-opacity-85 tw-transition-opacity tw-duration-300"
                htmlFor="profile"
                onChange={handleImageChange}
              >
                <input id="profile" type="file" className="tw-hidden" />
                <MdEdit />
              </label>
            </div>
            <div className="tw-flex tw-flex-col tw-justify-between teacher-meta">
              <span className="tw-flex tw-items-center tw-justify-start tw-group">
                {!editable ? (
                  <>
                    <h5>{userData?.username}</h5>
                    <button
                      onClick={() => setEditable(true)}
                      className=" tw-hidden tw-transition-opacity tw-duration-500 tw-p-2 tw-rounded-2xl group-hover:tw-inline-block tw-text-black tw-bg-gray-500 tw-cursor-pointer"
                    >
                      <MdEdit />
                    </button>
                  </>
                ) : (
                  <input
                    type="text"
                    className="tw-mb-4"
                    defaultValue={userData?.username}
                    onBlur={async (e) => {
                      setEditable(false);
                      console.log("e", e?.target?.value);
                      const payload = {
                        username: e.target.value,
                        profilePicture: userData?.profilePicture,
                      };
                      const res2 = await fetch(`${baseUrl}/profile`, {
                        method: "PATCH",
                        body: JSON.stringify(payload),
                        headers: {
                          Authorization: `Bearer ${CookieHelper.getCookie(
                            "token"
                          )}`,
                          "Content-Type": "application/json",
                        },
                      });
                      if (res2.ok) {
                        const json = await res2.json();
                        console.log("window.location", window.location);
                        toast.success(
                          "Username updated to " + json?.updateduser?.username
                        );
                      } else {
                        toast.success("Something went wrong.");
                      }
                    }}
                    onBlurCapture={(e) => console.log}
                  />
                )}
              </span>
              <p>Student</p>
            </div>
          </div>
        </section>
        <Footer />
        <GotoTop />
      </>
    );
  }
  return content;
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

export default InstructorProfile;
