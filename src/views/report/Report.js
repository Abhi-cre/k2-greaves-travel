import React from "react";
import { NavLink } from "react-router-dom";

const Report = () => {
  return (
    <React.Fragment>
      <ul className="nav nav-tabs" id="settingTab" role="tablist">
        <li className="nav-item" role="presentation">
          <NavLink
            to="/report"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link disablecolor"
            }
          >
            Tour Record
          </NavLink>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default Report;
