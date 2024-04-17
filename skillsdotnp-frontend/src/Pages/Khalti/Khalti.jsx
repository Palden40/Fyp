import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import baseUrl from "../../services/baseUrl";
import CookieHelper from "../../utils/CookieHelper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Khalti() {
  console.log("khlati");
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location", location.pathname, location);

  useVerifyKhalti(navigate);
  return <div>asdf</div>;
}
// ?pidx=ugeXyD397YLuNXb8LypzYQ&transaction_id=vyQeCe9mTDS44csJdqovCm&tidx=vyQeCe9mTDS44csJdqovCm&amount=1000&total_amount=1000&mobile=98XXXXX001&status=Completed&purchase_order_id=6605775858ca971aec066af6&purchase_order_name=React%20Coursepidx=ugeXyD397YLuNXb8LypzYQ&transaction_id=vyQeCe9mTDS44csJdqovCm&tidx=vyQeCe9mTDS44csJdqovCm&amount=1000&total_amount=1000&mobile=98XXXXX001&status=Completed&purchase_order_id=6605775858ca971aec066af6&purchase_order_name=React%20Course

const useVerifyKhalti = (navigate) => {
  useEffect(() => {
    fetch(`${baseUrl}/course/verifyEnrollment${location.search}`, {
      headers: {
        Authorization: `Bearer ${CookieHelper.getCookie("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(`/content/${data?.enrolled?.courseId?.id}`);
      })
      .catch((err) => {
        toast.error("Could not verify your payment. Please try again later.");
        navigate("/single-course");
      });
  }, []);
};
const res222 = {
  message: "You have successfully enrolled in this course",
  enrolled: {
    courseId: {
      category: "Web development",
      language: "English",
      courseName: "React Course",
      tagLine: "For Beginners",
      price: 1000,
      hadDiscount: false,
      discountPrice: 20,
      banner:
        "http://res.cloudinary.com/dohth1rzz/image/upload/v1678588114/q3yibe2md…",
      isFeatured: false,
      chapterPassMark: 60,
      content: [
        {
          content_type: "PUT",
          data: "asdf",
          _id: "65f080358dd0a8e93f65bb90",
        },
        {
          content_type: "asdf",
          data: "asdf",
          _id: "65f080358dd0a8e93f65bb90",
        },
      ],
      ReviewId: [],
      teacherId: "660576f158ca971aec066aea",
      id: "6605775858ca971aec066af6",
    },
    userId: "660d5b83a26879946b913dfb",
    enrolled_Date: "03/04/2024",
    completed_date: null,
    isCompleted: false,
    progress: {
      completedIndexes: [],
      completed: false,
    },
    _id: "660d61404f39f123b2f98c4d",
    __v: 0,
  },
};
