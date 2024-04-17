// import { course } from "../../Data/course";
import FeatureCard2 from "../Cards/FeatureCard2";
import baseUrl from "../../services/baseUrl";
import { useEffect } from "react";
import { useState } from "react";
function FeatureHome2() {
  const [courseData, setCourseData] = useState();
  useFetchAllCourse(setCourseData);

  console.log("courseData", courseData);
  return (
    <section id="home-course-section" className="feature-course-section-2">
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <h2 className="sec-title">
              <span>Find the Right</span> Online Course for you
            </h2>
          </div>
          {/* <div className="col-md-7 text-right">
            <a href="#" className="bisylms-btn-2">
              course View All Courses
            </a>
          </div> */}
        </div>
        <div className="row">
          {courseData?.allCourse?.map((course) => (
            <FeatureCard2 key={course._id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

const useFetchAllCourse = (setCourseData) => {
  // console.log("askldfjalsdkf");
  useEffect(() => {
    fetch(`${baseUrl}/course`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        setCourseData(res);
      })
      .catch((err) => console.error(err));
  }, []);
};

export default FeatureHome2;
