import ProtoTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import useWindowPosition from "../../Hooks/useWindowPosition";
import { useLocation } from "react-router-dom";

function Header({ className, logo, joinBtn, search }) {
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const [activeMobileSubMenu, setActiveSubMobileMenu] = useState(false);
  const location = useLocation();
  console.log("location", location);

  const windowPosition = useWindowPosition();
  return (
    <header
      className={`${className ? className : "header-01"} sticky ${
        windowPosition > 0
          ? "fix-header animated fadeInDown"
          : location.pathname.includes("single-course")
          ? "tw-mt-8"
          : ""
      } `}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <nav className="navbar navbar-expand-lg">
              {/* logo Start */}
              <Link className="navbar-brand" to="/">
                <img src={logo} alt="" />
                <img
                  className="sticky-logo"
                  src="assets/images/ElearningLogo.webp"
                  alt="Website Logo"
                />
              </Link>
              {/* logo End */}

              {/* Moblie Btn Start  */}
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setActiveMobileMenu(!activeMobileMenu)}
              >
                <i className="fal fa-bars"></i>
              </button>
              {/*  Moblie Btn End  */}

              {/* Nav Menu Start  */}
              <div
                className="collapse navbar-collapse"
                style={{ display: activeMobileMenu && "block" }}
              >
                <ul className="navbar-nav">
                  <li
                    className="menu-item-has-children"
                    onClick={() =>
                      setActiveSubMobileMenu(
                        activeMobileSubMenu === "home" ? false : "home"
                      )
                    }
                  >
                    <Link to="/">Home</Link>
                    <span className="submenu-toggler">
                      <i
                        className={`fal ${
                          activeMobileSubMenu === "home"
                            ? "fa-minus"
                            : "fa-plus"
                        }`}
                      ></i>
                    </span>
                  </li>

                  {/* <li
                    className="menu-item-has-children"
                    name="pages"
                    onClick={(e) => {
                      setActiveSubMobileMenu(
                        e.target.name
                          ? e.target.name === activeMobileSubMenu
                            ? "pages"
                            : e.target.name
                          : activeMobileSubMenu === "pages"
                          ? false
                          : "pages"
                      );
                    }}
                  >
                    <Link to="/">About</Link>
                    <span className="submenu-toggler">
                      <i
                        className={`fal ${
                          activeMobileSubMenu === "pages"
                            ? "fa-minus"
                            : "fa-plus"
                        }`}
                      ></i>
                    </span>
                  </li> */}
                </ul>
              </div>
              {/* Nav Menu End  */}

              {/*  User Btn  */}
              {/* {className !== "header-02" && (
                <a href="#" className="user-btn">
                  <i className="ti-user"></i>
                </a>
              )} */}
              {/*  User Btn  */}

              {/* Join Btn  */}
              {/* {joinBtn && (
                <a href="#" className="join-btn">
                  Join for Free
                </a>
              )} */}

              {/* Join Btn   */}
              {/* {search && (
                <form className="search-box" method="post" action="#">
                  <input
                    type="search"
                    name="s"
                    placeholder="Search Courses..."
                  />
                  <button type="submit">
                    <i className="ti-search"></i>
                  </button>
                </form>
              )} */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  className: ProtoTypes.string,
  logo: ProtoTypes.string,
  joinBtn: ProtoTypes.bool,
  search: ProtoTypes.bool,
};

export default Header;
