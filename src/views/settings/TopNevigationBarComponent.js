import React from "react";
// import {ArrayHelper} from '../../helpers/arrayhelper';
import {USER_TYPE_ID} from '../../helpers/constants';
import { NavLink } from 'react-router-dom';
const TopNevigationBarComponent = (props) => {
    let location = window.location.pathname; 
    console.log('location',location)  
    return (<React.Fragment> 
       <ul className="nav nav-tabs" id="settingTab" role="tablist">
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings" className={(location=="/settings")?'nav-link active':'nav-link disablecolor'}> Action Type</NavLink>
                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/agency-type" className="nav-link"> Agency Type</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/agent-type" className="nav-link"> Agent Type</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/client-status" className="nav-link">Client Status</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/contact-channel" className="nav-link">Contact Channel</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/state" className="nav-link"> State</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/city" className="nav-link"> City</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/department" className="nav-link"> Department</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/greaves-office" className="nav-link"> Greaves Office</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/greaves-status" className="nav-link"> Greaves Status</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/sales-category" className="nav-link"> Sales Category</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/sales-region" className="nav-link"> Sales Region</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/tour-type" className="nav-link"> Tour Type</NavLink>                
                </li>               
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/user-type" className="nav-link"> User Type</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/vendor-type" className="nav-link"> Vendor Type</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/vendor" className="nav-link"> Vendor</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink to="/settings/quote-type" className="nav-link"> Quote Type</NavLink>                
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/air-line" className="nav-link">Air Line</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/agency" className="nav-link">Agency</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/agent" className="nav-link">Agent</NavLink>                    
                </li>
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/sales-guide" className="nav-link">Sales Guide</NavLink>                    
                </li>  
                {/* <li className="nav-item" role="presentation">
                <NavLink  to="/settings/questionnaire" className="nav-link">Questionnaire</NavLink>                    
                </li>   */}
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/service" className="nav-link">Service</NavLink>                    
                </li> 
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/heared-about" className="nav-link">Heard About</NavLink>                    
                </li> 
                {(localStorage.getItem(USER_TYPE_ID)=='9' || localStorage.getItem(USER_TYPE_ID)=='8')?<li className="nav-item" role="presentation">
                <NavLink  to="/settings/app-setting" className="nav-link">App Setting</NavLink>                    
                </li>:''}
                <li className="nav-item" role="presentation">
                <NavLink  to="/settings/user" className="nav-link">User</NavLink>                    
                </li> 
            </ul>
      </React.Fragment>)
}

export default TopNevigationBarComponent;


