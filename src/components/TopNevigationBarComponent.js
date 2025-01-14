import React from "react";
// import {ArrayHelper} from '../../helpers/arrayhelper';
import { NavLink } from "react-router-dom";
import { ALLOWEDUSER, USER_EMAIL } from "../helpers/constants";
const TopNevigationBarComponent = (props) => {
  let location = window.location.pathname;

  return (
    <React.Fragment>
      <div className="bg-grey-color topNav">
        <div className="row m-0">
          <div className="col col-lg-2">
            <div className={`row navMob ${location != "/" ? "hideClass" : ""}`}>
              <div className="col">
                <span
                  className="sidebar-toggle ms-2"
                  onClick={() => props.showHideLeftNav()}
                >
                  <i className="hamburger align-self-center"></i>
                </span>
              </div>
              <div
                className="col text-end"
                onClick={() => props.showRightSide("compose")}
              >
                <button className="btn btn-primary ps-4 pe-4 ComposeWidth">
                  <i className="fa-solid fa-pen-to-square"></i> Compose
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-md-12">
                <nav className="navbar navbar-expand-lg p-0 moreMenu">
                  <div className="container-fluid">
                    <button
                      className="navbar-toggler navbar-sub-top"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      More
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          <NavLink to="/" className="nav-link">
                            {" "}
                            Mails
                          </NavLink>
                        </li>
                        {/* <li className="nav-item">
                                                <a className="nav-link" href="#">Message</a>
                                            </li> */}
                        <li className="nav-item">
                          <NavLink to="/tours" className="nav-link">
                            {" "}
                            Tours
                          </NavLink>
                        </li>
                        {/* <li className="nav-item">
                                                <a className="nav-link" href="#">Maintenance</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Operations</a>
                                            </li> */}
                        <li className="nav-item">
                          <NavLink to="/mobile-users" className="nav-link">
                            {" "}
                            Mobile Users
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/report" className="nav-link">
                            {" "}
                            Reports
                          </NavLink>
                        </li>
                        {ALLOWEDUSER.filter(
                          (item: any) =>
                            item == localStorage.getItem(USER_EMAIL)
                        ).length > 0 ? (
                          <li className="nav-item">
                            <NavLink to="/settings" className="nav-link">
                              {" "}
                              Settings
                            </NavLink>
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TopNevigationBarComponent;
