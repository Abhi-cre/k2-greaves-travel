import React from "react";
import SettingApi from '../../api/Setting.api';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/action/outLook.action';

import {ArrayHelper} from '../../helpers/arrayhelper';

import LoaderComponent from '../../components/LoaderComponent';
import  {PublicClientApplication} from "@azure/msal-browser"
import {USER_NAME,USER_ID,DEPARTMENT_NAME,config,ENYCRYPTVALUE,DECRTIPTVALUE,USER_EMAIL,USER_TYPE_ID,USER_LOCAL_STORAGE_LOGOUT_TIME,AUTHORIZED_TOKEN} from '../../helpers/constants';
declare var $;
class AuthenticationComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {errorMessage:'',loader:false, isAuthonticate:true};
        this.login = this.login.bind(this);
        this.publicClientApplication = new PublicClientApplication({
          auth:{
            clientId : config.appid,
            redirectUrl : config.redirectUrl,
            authority : config.authority
          },
          cache : {
            cacheLocation : "sessionStorage",
            storeAuthStateInCookie : true
          }
        })
    }
    componentWillMount()
    {
      const authTotken = localStorage.getItem(USER_NAME); 
           
            if (authTotken !== null && authTotken !== undefined && authTotken !== '')
            {
              this.props.history("/");
              setTimeout(()=>{
                this.props.history("/");    
              },10)
    
            }

          
            const location = this.props.params;
  if(location.logout=='yes')
  {
    this.publicClientApplication.logout()
    this.setState({
      isAuthonticate:false
    })
  }
  
    }
   
  login=async() => {
    try{
       let responseAuth= await this.publicClientApplication.loginPopup({
        scope:config.scropes,
        prompt:'select_account'
        })
        
        if(ArrayHelper.getValue(responseAuth, 'account.username')!='')
        {
       
            let data={
              "encEmail": ENYCRYPTVALUE(ArrayHelper.getValue(responseAuth, 'account.username'))
            }
            
          this.setState({ errorMessage:'',loader:true });
          let response= await SettingApi.PostSettingList(data,'/api/User/AuthenticateToken');
             if(ArrayHelper.getValue(response,'isSuccess')=== true)
                    {
                      let userResponse = JSON.parse(DECRTIPTVALUE(ArrayHelper.getValue(response, 'userResponse')));
                      console.log('userResponse',userResponse,ArrayHelper.getValue(userResponse,'[0].id'))
                      if(ArrayHelper.getValue(userResponse,'[0].id')!='')
                    {
                      let logOutTime= new Date().getTime() + 10*60*60*1000;
                        localStorage.setItem(AUTHORIZED_TOKEN,ArrayHelper.getValue(userResponse,'[0].Token'))  
                        localStorage.setItem(USER_LOCAL_STORAGE_LOGOUT_TIME , logOutTime);
                        localStorage.setItem(USER_EMAIL,ArrayHelper.getValue(userResponse,'[0].Email'))  
                        localStorage.setItem(USER_ID,ArrayHelper.getValue(userResponse,'[0].id'));
                        localStorage.setItem(USER_TYPE_ID,ArrayHelper.getValue(userResponse,'[0].userTypeId'));
                        localStorage.setItem(DEPARTMENT_NAME,ArrayHelper.getValue(userResponse,'[0].DepartmentName'))
                        localStorage.setItem(USER_NAME,ArrayHelper.getValue(userResponse,'[0].Title')+' '+ArrayHelper.getValue(userResponse,'[0].FirstName')+' '+ArrayHelper.getValue(userResponse,'[0].LastName'));
                        this.setState({ loader:false });
                        this.props.history("/tours"); 
                    }
                    else
                    {
                    
                      this.setState({loader:false,errorMessage:'User is not exist!' });
                    }
                    }
                    else
                    {
                  
                      this.setState({loader:false,errorMessage:'User is not exist!'  });
                    }
        }
        else
        {
         this.setState({isAuthonticate:false});
        }
    }
    catch(err)
    {
    
      this.setState({
        isAuthonticate:false,
        user:{},
        error:err
      })
    }


  }
  logout()
  {
    this.publicClientApplication.logout()

  }
    render(){
      
        return(
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
                
                <div > 
                {(this.state.isAuthonticate===true)?<div className="authontication-page">
           <h2 className="txt-white">User Authentication</h2>
           <div className="mAuth"><img src="/images/Microsoft-Logo.png"/></div>
           {(this.state.errorMessage!='')?<p className="authontication-error">{this.state.errorMessage}</p>:''}
           <button onClick={()=>this.login()}>For User Authentication Click Here </button>
        </div>:<div className="authontication-page">
           
           <div className="mAuth"><img src="/images/Microsoft-Logo.png"/></div>
           <h4 className="txt-white">You signed out of your account</h4>
           <p className="txt-white">It's a good idea to close all browser windows.</p>
         
        </div>}
                </div>
            </React.Fragment>
        )
    }
}  


const mapStateToProps = state => {
    return {
        folderListsData : state.outLookData.folderLists,
        selectedEmailListsData : state.outLookData.selectedEmailLists,
    }
  };
  
  const mapDispatchToProps = dispatch => {
    return { 
        folderList : (dataval) => dispatch({type:actionTypes.FOLDER_LIST,payload:dataval}),
        selectedEmailLists : (dataval) => dispatch({type:actionTypes.SELECTED_EMAIL_LIST,payload:dataval})
    }
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationComponent);