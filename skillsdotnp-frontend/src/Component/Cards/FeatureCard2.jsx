import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function FeatureCard2({ course }) {
  const {
    category,
    chapterPassMark,
    courseName,
    discountPrice,
    hadDiscount,
    price,
    banner,
    _id,
  } = course;
  return (
    <div className="col-lg-4 col-md-6">
      <div className="feature-course-item-2">
        <Link to={`/single-course/${_id}`} className="c-cate">
          {courseName}
        </Link>
        <h4>
          <Link to={`/single-course/${_id}`}>{courseName}</Link>
        </h4>
        <div className="fcf-bottom">
          <Link to={`/single-course/${_id}`}>
            <i className="icon_book_alt"></i>
            {courseName} Lessons
          </Link>
          <Link to={`/single-course/${_id}`}>
            <i className="icon_profile"></i>
            {courseName}
          </Link>
        </div>
        <div className="fcf-thumb">
          <img src={banner} alt="" />
        </div>
        <div className="hover-course">
          <div className="course-price">
            Rs. {price}
            <span>Rs. {price}</span>
          </div>
          <div className="author">
            <img src={banner} alt="" />
          </div>
          <div className="ratings">
            <i className="icon_star"></i>
            <i className="icon_star"></i>
            <i className="icon_star"></i>
            <i className="icon_star"></i>
            <i className="icon_star"></i>
            <span>{/* {rating} ({reviews} Reviews) */}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

FeatureCard2.propTypes = {
  course: ProtoTypes.object,
};

export default FeatureCard2;
