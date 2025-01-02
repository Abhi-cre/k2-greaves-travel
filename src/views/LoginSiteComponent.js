import React,{Suspense,lazy } from "react";
import {
    Route,
    Routes
  } from "react-router-dom";
 
const LoginComponent = lazy(() => import('./login/LoginComponent'));
const AuthenticationComponent= lazy(() => import('./login/AuthenticationComponent'));
const ForgetPasswordComponent = lazy(() => import('./login/ForgetPasswordComponent'));
const SignUpComponent = lazy(() => import('./login/SignUpComponent'));

class LoginSiteComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showLeftNav:true};
    }
    showHideLeftNav()
    {
        this.setState({showLeftNav:!this.state.showLeftNav})
    }
    render(){
     
        return(
            <React.Fragment>          
                <div className="loginBg">
        <div className="container">
            <div className="loginBox">
                <div className="mb-5 text-center">
                    <img src="/images/greaves-india-logo.png" alt="Greaves India"/>
                </div>
                <Suspense fallback={<div className="row">
  <div className="load"><img src="images/ajax-loader.gif" alt="" /> </div> 
</div>}>
                <Routes>  
                <Route   path="/authentication"  element={<AuthenticationComponent showLeftNav={this.state.showLeftNav} params={this.props.params} history={this.props.history}/>}/>                  
                <Route   path="/login"  element={<LoginComponent showLeftNav={this.state.showLeftNav} params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/forget-password"  element={<ForgetPasswordComponent showLeftNav={this.state.showLeftNav} params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/signup"  element={<SignUpComponent showLeftNav={this.state.showLeftNav} params={this.props.params} history={this.props.history}/>}/>
               
                </Routes>
                </Suspense>
                
            </div>
        </div>
    </div>
            </React.Fragment>
        )
    }
}  


export default  LoginSiteComponent;