import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import { Link } from "react-router-dom";
import ReviewForm from "../../Component/Form/ReviewForm";
import GotoTop from "../../Component/GotoTop";
import baseUrl from "../../services/baseUrl";
import { useParams } from "react-router-dom";
import Topbar from "../../Component/Headers/Topbar";
import CookieHelper from "../../utils/CookieHelper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CourseSingle() {
  const [courseData, setCourseData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("Overview");
  const [enrolled, setEnrolled] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  useFindLastContext(id, courseData?.content, setEnrolled);
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return "<span className=" + className + " myPagination" + "></span>";
    },
  };
  let content = undefined;

  useFetchCourseId(id, setCourseData, setIsLoading);

  const handleCourseEnroll = async (e) => {
    const token = CookieHelper.getCookie("token");
    try {
      if (!token) {
        toast.error("You must login before enrolling in a course");
        navigate("/login");
      } else if (!enrolled) {
        const payload = {
          return_url: window.location.origin + "/khalti",
          website_url: window.location.origin,
        };
        const res = await fetch(`${baseUrl}/course/${id}/initialEnrollment`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.payment?.paymentUrl) {
            console.log("khalti res", data.payment.paymentUrl);
            window.open(`${data?.payment?.paymentUrl}`, "_blank");
            // openInNewTab(data.payment.paymentUrl);
            return;
          } else toast.error("Something Went wrong");
        }
        return;
      }
      navigate(`/content/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Error:Something went wrong.");
    }
  };

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>
        <Header logo="assets/images/ElearningLogo.webp" joinBtn={true} />
        <Topbar />

        <Banner title="Courses Single" background="assets/images/banner5.jpg" />
        {/* course section start */}
        <section className="course-details-section">
          <div className="container">
            <div className="row h-">
              <div className="col-lg-9">
                <div className="single-course-area">
                  <div className="course-top">
                    <h4>{courseData?.courseName}</h4>
                    <div className="course-meta">
                      <div className="author">
                        <img src={`${baseUrl}${courseData?.teacherId?.profilePicture}`} alt="" />
                        <span>Teacher</span>
                        <Link to="/">{courseData?.teacherId?.username}</Link>
                      </div>
                      <div className="categories">
                        <span>Categories:</span>
                        <Link to="#">{courseData?.category}</Link>
                      </div>
                    </div>
                    <div className="course-price">Rs.{courseData?.price}</div>
                  </div>
                  <div className="sc-thumb">
                    <img src={courseData?.banner} alt="" />
                  </div>
                  <div className="course-tab-wrapper">
                    <ul className="course-tab-btn nav nav-tabs">
                      <li>
                        <a
                          onClick={(e) => setActiveView(e.target.innerText)}
                          className={activeView === "Overview" ? "active" : ""}
                        >
                          <i className="icon_ribbon_alt"></i>Overview
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={(e) => setActiveView(e.target.innerText)}
                          className={
                            activeView === "Curriculum" ? "active" : ""
                          }
                        >
                          <i className="icon_book_alt"></i>Curriculum
                        </a>
                      </li>
                    </ul>
                    {/* Tab Content  */}
                    <div className="tab-content">
                      {/* Overview Tab  */}
                      {activeView === "Overview" && (
                        <div
                          className="tab-pane fade in show active"
                          id="overview"
                          role="tabpanel"
                        >
                          <div className="overview-content">
                            <h4>Course Description</h4>
                            <p>{courseData?.description}</p>
                          </div>
                        </div>
                      )}
                      {/* Overview Tab  */}
                      {/* Curriculum Tab  */}
                      {activeView === "Curriculum" && (
                        <div
                          className="tab-pane fade in show active"
                          id="curriculum"
                          role="tabpanel"
                        >
                          <div className="curriculum-item" id="id_1">
                            <div
                              id="acc_1"
                              className="collapse show"
                              aria-labelledby="cc_1"
                              data-parent="#id_1"
                            >
                              <div className="card-body">
                                {courseData?.content.map((content, i) => (
                                  <div
                                    key={content._id}
                                    className="ci-item with-bg"
                                  >
                                    <h5>
                                      <i className="icon_menu-square_alt2"></i>
                                      <Link to="/">{content.title}</Link>
                                    </h5>
                                    <div className="ci-tools">
                                      <Link to="/" className="time">
                                        {content.content_type}
                                      </Link>
                                      <Link to="/" className="lock">
                                        <i className="icon_lock_alt"></i>
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Curriculum Tab  */}
                      {/* Instructors Tab  */}
                      {activeView === "Instructors" && (
                        <div
                          className="tab-pane fade in show active"
                          id="instructors"
                          role="tabpanel"
                        >
                          <div className="teacher-item-3">
                            <div className="teacher-thumb">
                              <img
                                src="assets/images/single-course/i1.jpg"
                                alt=""
                              />
                            </div>
                            <div className="teacher-meta">
                              <h5>
                                <Link to="/">Dianne Ameter</Link>
                              </h5>
                              <span>Illustrator</span>
                              <p>
                                I don't want no agro car boot lavatory wind up
                                twit haggle spiffing show off show off pick your
                                nose and blow off spend a penny David zonked
                                what a plonker are you taking.
                              </p>
                              <div className="teacher-social">
                                <a href="#">
                                  <i className="social_facebook"></i>
                                </a>
                                <a href="#">
                                  <i className="social_twitter"></i>
                                </a>
                                <a href="#">
                                  <i className="social_linkedin"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Instructors Tab  */}
                      {/* Reviews Tab  */}
                      {activeView === "Reviews" && (
                        <div
                          className="tab-pane fade in show active"
                          id="reviews"
                          role="tabpanel"
                        >
                          <div className="reviw-area">
                            <h4>Reviews</h4>
                            <div className="reating-details">
                              <div className="average-rate">
                                <p>Average Rating</p>
                                <div className="rate-box">
                                  <h2>4.8</h2>
                                  <div className="ratings">
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                  </div>
                                  <span>4 Reviews</span>
                                </div>
                              </div>
                              <div className="details-rate">
                                <p>Detailed Rating</p>
                                <div className="detail-rate-box">
                                  <div className="rate-item">
                                    <p>5</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "100%" }}
                                        aria-valuenow="100"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                    <span>100%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>4</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "30%" }}
                                        aria-valuenow="30"
                                        aria-valuemin="0"
                                        aria-valuemax="30"
                                      ></div>
                                    </div>
                                    <span>30%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>3</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "20%" }}
                                        aria-valuenow="20"
                                        aria-valuemin="0"
                                        aria-valuemax="20"
                                      ></div>
                                    </div>
                                    <span>20%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>2</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "10%" }}
                                        aria-valuenow="10"
                                        aria-valuemin="0"
                                        aria-valuemax="10"
                                      ></div>
                                    </div>
                                    <span>10%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>1</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "0%" }}
                                        aria-valuenow="0"
                                        aria-valuemin="0"
                                        aria-valuemax="0"
                                      ></div>
                                    </div>
                                    <span>0%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="review-rating">
                              <h5>Comments ( 3 )</h5>
                              <ol>
                                <li>
                                  <div className="single-comment">
                                    <img
                                      src="assets/images/single-course/r1.png"
                                      alt=""
                                    />
                                    <h5>
                                      <Link to="/">Dianne Ameter</Link>
                                    </h5>
                                    <span>August 8, 2012 at 9:22 am</span>
                                    <div className="comment">
                                      <p>
                                        I don't want no agro car boot lavatory
                                        wind up twit haggle spiffing show off
                                        show off pick your nose and blow off
                                        spend a penny David zonked what a
                                        plonker are you taking.
                                      </p>
                                    </div>
                                    <div className="ratings">
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                    </div>
                                    <div className="c-border"></div>
                                  </div>
                                </li>
                              </ol>
                            </div>
                            <div className="review-form-area">
                              <h5>Leave a Comment</h5>
                              <div className="comment-form">
                                <ReviewForm />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/*  Reviews Tab  */}
                    </div>
                    {/* Tab Content  */}
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="course-sidebar">
                  <aside className="widget">
                    <div className="info-course">
                      <ul>
                        <li>
                          <i className="icon_house_alt"></i>
                          <span>Instructor: </span> {courseData?.teacherId?.username}
                        </li>
                      </ul>
                      <button
                        className="bisylms-btn"
                        // to={`/single-course/${id}/content`}
                        onClick={handleCourseEnroll}
                      >
                        {enrolled ? "Resume Course" : "Enroll Course"}
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* course section end  */}
        <Footer />
        <GotoTop />
      </>
    );
  }
  return content;
}

const useFindLastContext = (id, content, setEnrolled) => {
  useEffect(() => {
    fetch(`${baseUrl}/course/${id}/enroll/user/check`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CookieHelper.getCookie("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setEnrolled(true);
        else setEnrolled(false);
      })
      .catch((err) => {
        console.error(err);
        setEnrolled(false);
      });
  }, [content]);
};

const useFetchCourseId = (id, setCourseData, setIsLoading) => {
  useEffect(() => {
    fetch(`${baseUrl}/course/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setCourseData(res.foundCourse);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
};

export default CourseSingle;

// const handleCourseEnroll = async (e) => {
//   const token = CookieHelper.getCookie("token");
//   try {
//     const res = await fetch(`${baseUrl}/course/${id}/enroll`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (res.status == 401) {
//       toast.error("You must login before enrolling in a course");
//       navigate("/login");
//     } else if (res.ok) navigate(`/single-course/${id}/content`);
//   } catch (err) {
//     console.error(err);
//   }
// };
