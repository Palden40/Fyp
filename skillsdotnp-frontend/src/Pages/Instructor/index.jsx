import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import TeacherCard from "../../Component/Cards/TeacherCard";
import GotoTop from "../../Component/GotoTop";
import baseUrl from "../../services/baseUrl";

function Instructor() {
  const [isLoading, setIsLoading] = useState(true);

  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);
  useGetAllTeachers();
  console.log("teachers", teachers);
  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>
        <Header logo="assets/images/ElearningLogo.webp" joinBtn={true} />
        <Banner title="Instructor" background="assets/images/banner.jpg" />
        <section className="instructor-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="sec-title mb-15">
                  <span>Classes Taught by</span> Real Creators
                </h2>
                <p className="sec-desc">
                  Online education is a flexible instructional delivery system
                  that encompasses any
                  <br /> kind of learning that takes place via the Internet.
                </p>
              </div>
            </div>
            <div className="row">
              {teachers.map((teacher, i) => (
                <TeacherCard
                  key={teacher._id}
                  teacher={{
                    img: `http://localhost:5500/api${teacher.profilePicture}`,
                    name: teacher?.username || "N/A",
                    subject: "Teacher",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
        <Footer getStart={true} />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Instructor;
