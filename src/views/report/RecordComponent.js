import React, { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ALLOWEDUSER, USER_EMAIL } from "../../helpers/constants";
import NoRecord from "./norecord/NoRecord";

const Report = lazy(() => import("./Report"));

const RecordComponent = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem(USER_EMAIL);
    if (!userEmail || !ALLOWEDUSER.includes(userEmail)) {
      console.log("User is not authorized");
      setIsAuthorized(false);
      setTimeout(() => {
        navigate("/tours");
      }, 500);
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  return (
    <React.Fragment>
      <div className="innerPage">
        <Suspense
          fallback={
            <div className="row">
              <div className="load">
                <img src="images/ajax-loader.gif" alt="loading" />
              </div>
            </div>
          }
        >
          <Report />
        </Suspense>
        <div className="tab-content">
          <div className="settingDisplay">
            <Routes>
              <Route path="/" element={<NoRecord />} />
            </Routes>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RecordComponent;
