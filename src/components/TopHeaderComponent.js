import React from "react";
// import {ArrayHelper} from '../../helpers/arrayhelper';
 import { NavLink } from 'react-router-dom';
const TopHeaderComponent = (props) => {
    let userNamearray=[];
    if(props.userName!='' && props.userName!=null) 
    {
         userNamearray=props.userName.split(' ')
    }
  
    return (<React.Fragment> 
        <header className="p-2 ps-4 pe-4 bg-theme-color">
        <div className="row">           
            <NavLink to="/" className="col">  
                <img src="/images/greaves-india-logo.png" width="70px" alt="Greaves India"/>
            </NavLink>      
           
            <div className="col ms-auto text-end">
                <div className="dropdown pt-2">
                 
                    <NavLink to="/" className="text-decoration-none dropdown-toggle avtar"  data-bs-toggle="dropdown" aria-expanded="false">        
                        <div className="d-inline-block text-end text-white">
                            <strong>{props.userName}</strong>
                            <br/>
                            <span>{props.departmentName} </span>
                        </div>
                        {(userNamearray[1]!='' && userNamearray[1]!=null)?<div className="rounded-circle text-white" style={{'width':'32px','height':'32px','border':'2px solid #fff','padding':'8px 4px 4px 0px'}}>{userNamearray[1].substring(0, 1)} {userNamearray[2].substring(0, 1)}</div>:''}
                        {/* <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle"/> */}
                        </NavLink>    
                  
                    <ul className="dropdown-menu text-small shadow">
                        {/* <li><NavLink to="/settings" className="dropdown-item">Settings</NavLink></li>
                        <li><NavLink to="/profile" className="dropdown-item">Profile</NavLink></li> */}
                        {/* <li><hr className="dropdown-divider"/></li> */}
                        <li><a onClick={()=>props.logOut()} className="dropdown-item">Sign out</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
      </React.Fragment>)
}

export default TopHeaderComponent;


