import React from "react";
import { useNavigate,useSearchParams} from "react-router-dom";
import SiteComponent from "./siteComponent";

const SiteComponentMain = () => {
  
  const history = useNavigate();
  const [searchParams] =  useSearchParams();
  
  return <SiteComponent history={history} params={Object.fromEntries([...searchParams])}/>
 
};
export default SiteComponentMain;
