import React,{Suspense,lazy } from "react";
import {
    Route,
    Routes
  } from "react-router-dom";
 import {connect} from 'react-redux';
 //import * as actionTypesUser from "../store/action/user.action";
 const TopHeaderComponent = lazy(() => import('../components/TopHeaderComponent'));
 const TopNevigationBarComponent = lazy(() => import('../components/TopNevigationBarComponent'));
const HomeSystemComponent = lazy(() => import('./system/HomeComponent'));

class LoginComponent extends React.Component {
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
           <TopHeaderComponent/>     
  <div className="page-container">
  <TopNevigationBarComponent showHideLeftNav={()=>this.showHideLeftNav()}/>    
    {(this.state.token!==null)?<div>    
                <Suspense fallback={<div className="row">
  <div className="load"><img src="images/ajax-loader.gif" alt="" /> </div> 
</div>}>
                <Routes>                
                <Route   path="/"  element={<HomeSystemComponent showLeftNav={this.state.showLeftNav} params={this.props.params} history={this.props.history}/>}/>
               
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

export default  connect(mapStateToProps, mapDispatchToProps)(LoginComponent);