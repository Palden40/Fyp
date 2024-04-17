import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import setCookie from "../../services/setCookie";
import baseUrl from "../../services/baseUrl";
import SignInPic from "../../../public/assets/images/SignInPic.svg";
import ElearningLogo from "../../../public/assets/images/ElearningLogo.webp";

const SignUp = () => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const registerUser = (data) => {
    console.log("JSON data", data);
    fetch(`${baseUrl}/user/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res.token", res?.message);
        if (res.message) {
          console.log("res.asjkfk");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error`, { position: "top-right" });
      });
  };
  return (
    <>
      <div className="tw-rounded-sm tw-border tw-border-stroke tw-bg-white tw-shadow-default dark:tw-border-strokedark dark:tw-bg-boxdark">
        <div className="tw-flex tw-flex-wrap tw-items-center">
          <div className="tw-hidden tw-w-full xl:tw-block xl:tw-w-1/2">
            <div className="tw-py-17.5 tw-px-26 tw-text-center">
              <Link className="tw-mb-5.5 tw-inline-block" to="/">
                <img
                  className="dark:tw-hidden"
                  src={ElearningLogo}
                  alt="Logo"
                />
              </Link>

              <span className="tw-mt-15 tw-inline-block">
                <img src={SignInPic} alt="signinpis" />
              </span>
            </div>
          </div>

          <div className="tw-w-full tw-border-stroke dark:tw-border-strokedark xl:tw-w-1/2 xl:tw-border-l-2">
            <div className="tw-w-full tw-p-4 sm:tw-p-12.5 xl:tw-p-17.5">
              <h2 className="tw-mb-9 tw-text-2xl tw-font-bold tw-text-black dark:tw-text-white sm:tw-text-title-xl2">
                Sign Up to E-learning
              </h2>

              <form onSubmit={handleSubmit(registerUser)}>
                <div className="tw-mb-4">
                  <label className="tw-mb-2.5 tw-block tw-font-medium tw-text-black dark:tw-text-white">
                    Username
                  </label>
                  <div className="tw-relative">
                    <input
                      type="text"
                      placeholder="Enter your Username"
                      className="tw-w-full tw-rounded-lg tw-border tw-border-stroke tw-bg-transparent tw-py-4 tw-pl-6 tw-pr-10 tw-outline-none focus:tw-border-primary focus-visible:tw-shadow-none dark:tw-border-form-strokedark"
                      {...register("username", {
                        required: "Username required",
                      })}
                    />
                  </div>

                  <span className="tw-text-red-500">
                    {errors?.name?.message}
                  </span>
                </div>
                <div className="tw-mb-4">
                  <label className="tw-mb-2.5 tw-block tw-font-medium tw-text-black dark:tw-text-white">
                    Email
                  </label>
                  <div className="tw-relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="tw-w-full tw-rounded-lg tw-border tw-border-stroke tw-bg-transparent tw-py-4 tw-pl-6 tw-pr-10 tw-outline-none focus:tw-border-primary focus-visible:tw-shadow-none dark:tw-border-form-strokedark"
                      {...register("email", { required: "email required" })}
                    />

                    <span className="tw-text-red-500">
                      {errors?.email?.message}
                    </span>
                  </div>
                </div>

                <div className="tw-mb-6">
                  <label className="tw-mb-2.5 tw-block tw-font-medium tw-text-black dark:tw-text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="6+ Characters, 1 Capital letter"
                      className="tw-w-full tw-rounded-lg tw-border tw-border-stroke tw-bg-transparent tw-py-4 tw-pl-6 tw-pr-10 tw-outline-none focus:tw-border-primary focus-visible:tw-shadow-none dark:tw-border-form-strokedark dark:tw-bg-form-input dark:focus:tw-border-primary"
                      {...register("password", {
                        required: "Password required",
                      })}
                    />

                    <span className="tw-text-red-500">
                      {errors?.password?.message}
                    </span>
                  </div>
                </div>

                <div className="tw-mb-5">
                  <button
                    type="submit"
                    className="tw-w-full tw-cursor-pointer tw-rounded-lg tw-border tw-border-primary tw-bg-primary tw-p-4 tw-text-white tw-transition hover:tw-bg-opacity-90"
                  >
                    Sign Up
                  </button>
                </div>

                <div className="tw-mt-6 tw-text-center">
                  <p>
                    Already have an account?
                    <Link to="/login" className="text-primary">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
