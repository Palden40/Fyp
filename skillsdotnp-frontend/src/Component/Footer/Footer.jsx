import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function Footer({ getStart }) {
  return (
    <>
      <div className="copyright tw-flex tw-justify-center tw-bg-[#f7f6fa]">
        <p>
          © 2024 Copyright all Right Reserved Design by{"Palden Lama"}
          <a href="https://www.instagram.com/skill.np/"> SkillsDotNepal</a>
        </p>
      </div>
    </>
  );
}

Footer.propTypes = {
  getStart: ProtoTypes.bool,
};

export default Footer;
