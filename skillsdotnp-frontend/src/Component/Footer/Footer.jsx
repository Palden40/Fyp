import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function Footer({ getStart }) {
  return (
    <>
      <div className="copyright tw-flex tw-justify-center tw-bg-[#f7f6fa]">
        <p>
          © 2021 Copyright all Right Reserved Design by{" "}
          <a href="http://quomodosoft.com/"> SkillsDotNepal</a>
        </p>
      </div>
    </>
  );
}

Footer.propTypes = {
  getStart: ProtoTypes.bool,
};

export default Footer;
