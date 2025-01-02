import React from "react";
import { useNavigate,useSearchParams} from "react-router-dom";
import LoginSiteComponent from "./LoginSiteComponent";

const SiteComponentMain = () => {
  
  const history = useNavigate();
  const [searchParams] =  useSearchParams();
  
  return <LoginSiteComponent history={history} params={Object.fromEntries([...searchParams])}/>
 
};
export default SiteComponentMain;
