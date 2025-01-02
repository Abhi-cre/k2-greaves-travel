import React,{Suspense,lazy } from "react";
import {
    Route,
    Routes
  } from "react-router-dom";
 import {connect} from 'react-redux';
 import {USER_NAME,USER_ID,DEPARTMENT_NAME,USER_LOCAL_STORAGE_LOGOUT_TIME,USER_EMAIL} from '../helpers/constants';
 import SettingApi from '../api/Setting.api';
 //import * as actionTypesUser from "../store/action/user.action";
 const TopHeaderComponent = lazy(() => import('../components/TopHeaderComponent'));
 const TopNevigationBarComponent = lazy(() => import('../components/TopNevigationBarComponent'));
const HomeSystemComponent = lazy(() => import('./system/HomeComponent'));
const SettingsComponent = lazy(() => import('./settings/SettingsComponent'));
const ToursComponent= lazy(() => import('./tours/ToursComponent'));
const MobileUsersComponent = lazy(() => import('./mobile-users/MobileUsersComponent.js')); 

class SiteComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showLeftNav:true,disPlayRight:'email',userName:'',departmentName:''};
    }
    componentWillMount()
    {
        const userName = localStorage.getItem(USER_NAME); 
        const userId = localStorage.getItem(USER_ID);
        this.setState({userName:userName,departmentName:localStorage.getItem(DEPARTMENT_NAME)});
        if ((userName != null && userName !== undefined) && (userId != null && userId !== undefined)) {

           
        //    setTimeout(()=>{
        //     this.logOutExpired();
        //    },1000)
          
        }
        else{  
            setTimeout(()=>{
                this.logOutExpired();
               },1000)        
            //this.props.history("/user/login");
            this.props.history("/user/authentication");
                        
        }
        if (userName === null || userName === undefined)
        {    
          setTimeout(()=>{
            this.logOutExpired();
            //this.props.history("/user/login");   
            this.props.history("/user/authentication"); 
          },100)

        }
    }
    showHideLeftNav()
    {
        this.setState({showLeftNav:!this.state.showLeftNav})
    }
    showRightSide(str)
{
    this.setState({disPlayRight:str})
}
    logOut=async()=>
    {
       
        let response= await SettingApi.PostSettingList({
            "email": localStorage.getItem(USER_EMAIL)
          },'/api/User/LogOut');
        console.log(response)
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(DEPARTMENT_NAME);
        localStorage.removeItem(USER_LOCAL_STORAGE_LOGOUT_TIME);
        setTimeout(()=>{
           // window.location.reload(); 
            this.props.history("/user/authentication?logout=yes");
        },10)
        
      
     
           
    }
    componentWillReceiveProps(nextProps: any)
    {
        this.logOutExpired();
          
        }
        logOutExpired=async()=>
        {
            
            let logOutTime= localStorage.getItem(USER_LOCAL_STORAGE_LOGOUT_TIME);
            let user_id= localStorage.getItem(USER_ID);
            let currentTime= new Date().getTime();
           
             if(currentTime>logOutTime || logOutTime==null || logOutTime==undefined || user_id==undefined)
             {
              
                if(user_id!=undefined && user_id!=null) 
                {
                   
                let response= await SettingApi.PostSettingList({
                    "email": localStorage.getItem(USER_EMAIL)
                  },'/api/User/LogOut');
                console.log(response)
                alert('Your log-in time has been expired.');
                }
                localStorage.removeItem(USER_NAME);
                localStorage.removeItem(USER_ID);
                localStorage.removeItem(DEPARTMENT_NAME);
                localStorage.removeItem(USER_LOCAL_STORAGE_LOGOUT_TIME);
               this.props.history("/user/authentication");
             }
        }
    render(){
     
        return(
            <React.Fragment>
           <TopHeaderComponent logOut={()=>this.logOut()} userName={this.state.userName} departmentName={this.state.departmentName}/>     
  <div className="page-container">
  <TopNevigationBarComponent showRightSide={(str)=>this.showRightSide(str)}
   showHideLeftNav={()=>this.showHideLeftNav()}/>    
    {(this.state.token!==null)?<div>    
                <Suspense fallback={<div className="row">
  <div className="load"><img src="images/ajax-loader.gif" alt="" /> </div> 
</div>}>
                <Routes>  
                                                
                <Route   path="/"  element={<HomeSystemComponent showRightSide={(str)=>this.showRightSide(str)} disPlayRight={this.state.disPlayRight} showLeftNav={this.state.showLeftNav} params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/settings/*"  element={<SettingsComponent    params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/tours/*"  element={<ToursComponent    params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/mobile-users"  element={<MobileUsersComponent    params={this.props.params} history={this.props.history}/>}/>
                </Routes>
                </Suspense>
                </div>:''}
              
                </div>
                
            </React.Fragment>
        )
    }
}  

const mapStateToProps = state => {
    return {
       
    }
};

const mapDispatchToProps = dispatch => {
    return {
      
        //userInfo:(data)=>dispatch({type: actionTypesUser.USER_LOGIN,payload:data}),
        //logOut:(data)=>dispatch({type: actionTypesUser.USER_LOGOUT,payload:data}),
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(SiteComponent);