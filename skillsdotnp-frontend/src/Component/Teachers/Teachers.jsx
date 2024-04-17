import TeacherCard from "../Cards/TeacherCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useState } from "react";
import { useEffect } from "react";
import baseUrl from "../../services/baseUrl";

function Teachers() {
  const [teachers, setTeachers] = useState();
  console.log("teachers", teachers);
  useGetAllTeachers(setTeachers);
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + "</span>";
    },
  };
  return (
    <section className="teachers-section tw-mb-60">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="sec-title mb-15">
              <span>Classes Taught by</span> Real Creators
            </h2>
            <p className="sec-desc">
              Online education is a flexible instructional delivery system that
              encompasses any
              <br />
              kind of learning that takes place via the Internet.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Swiper
              slidesPerView={1}
              autoplay={true}
              spaceBetween={10}
              pagination={pagination}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {teachers?.map((teacher, i) => (
                <SwiperSlide key={teacher._id}>
                  <TeacherCard
                    teacher={{
                      img: `http://localhost:5500/api${teacher.profilePicture}`,
                      name: teacher?.username || "N/A",
                      subject: "Teacher",
                    }}
                    swiper={true}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
const useGetAllTeachers = (setTeachers) => {
  useEffect(() => {
    fetch(`${baseUrl}/teachers`)
      .then((res) => res.json())
      .then((data) => {
        console.log("ata", data);
        setTeachers(data?.teachers);
      });
  }, []);
};
export default Teachers;
