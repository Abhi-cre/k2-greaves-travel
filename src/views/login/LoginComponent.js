import React from "react";
import SettingApi from '../../api/Setting.api';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/action/outLook.action';

import {ArrayHelper} from '../../helpers/arrayhelper';

import LoaderComponent from '../../components/LoaderComponent';
import {USER_NAME,USER_ID,DEPARTMENT_NAME} from '../../helpers/constants';
declare var $;
class LoginComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {email:'',code: '',UserEmail:'',loader:false, errors: {},pageType:'login'};
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
  
    }
    submit = async(event: any) => {
      event.preventDefault();
      let data={
        "email": this.state.email,
        "password":this.state.code,
      }
      
    this.setState({ errors:{},loader:true });
    let response= await SettingApi.PostSettingList(data,'/api/User/Authenticate');
       if(ArrayHelper.getValue(response,'isSuccess')=== true)
              {
                if(ArrayHelper.getValue(response,'userDetails').length>0)
              {
                this.setState({ errors:{},loader:false });
                  localStorage.setItem(USER_ID,ArrayHelper.getValue(response,'userDetails[0].id'))
                  localStorage.setItem(DEPARTMENT_NAME,ArrayHelper.getValue(response,'userDetails[0].departmentName'))
                  localStorage.setItem(USER_NAME,ArrayHelper.getValue(response,'userDetails[0].title')+' '+ArrayHelper.getValue(response,'userDetails[0].firstName')+' '+ArrayHelper.getValue(response,'userDetails[0].lastName'));
                  this.props.history("/"); 
               
              }
              else
              {
                this.state.errors['code'] = 'User is not Authenticated';
                this.setState({ errors: this.state.errors,loader:false });
              }
              }
              else
              {
                this.state.errors['code'] = 'User is not Authenticated';
                this.setState({ errors: this.state.errors,loader:false });
              }
  
                 
  };
  handleChange = (e) => {
    const name = e.target.name;
    let  value = e.target.value;
    
  this.setState({ ...this.state, [name]: value });
  }
  changeType(str)
  {
    this.setState({pageType:str,errors: {}});
  }
  submitforgetpassword = async(event: any) => {
    event.preventDefault();
    let data ={
      email:this.state.UserEmail,
  }
  this.setState({ errors:{},loader:true });
  let response= await SettingApi.PostSettingList(data,'/api/User/ForgetPassword');
  console.log('sssssss',response)
            if(ArrayHelper.getValue(response,'isSuccess')=== true)
            {
              if(ArrayHelper.getValue(response,'forgetPassword').length>0)
              {
              this.setState({loader:false ,UserEmail:''});
              this.state.errors['code'] = 'Login information send on your email address';
              this.setState({ errors: this.state.errors});
              }
            }
            else
            {
              this.state.errors['code'] = 'User Email Not Exist.';
              this.setState({ errors: this.state.errors,loader:false });
            }
               
  };
  showPasswordForMate(str)
  {
    $("#"+str+'_lable').toggleClass('fa-eye');
    $("#"+str+'_lable').toggleClass('fa-eye-slash');
    let password = document.querySelector('#'+str);
    let input =password.getAttribute('type');
   
    if (input == "password") {
      password.setAttribute('type','text')
    } else {
      password.setAttribute('type','password')
    }
  }
    render(){
      
        return(
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
                 <div className={(this.state.pageType!=='login')?'hideClass':''}>  
                 <form method="post" onSubmit={this.submit}>
                 {(this.state.errors.code) ?<p className="error mb-4">{this.state.errors.code}<br/></p> : false}
                    <div className="mb-4 form-floating">
                        <input type="text" onChange={this.handleChange} name="email" value={this.state.email} className="form-control" id="floatingUser" placeholder="" required/>
                        <label htmlFor="floatingUser">User Name</label>
                    </div>
                    <div className="mb-4 form-floating">
                        <input type="password" id="NewPW" onChange={this.handleChange} name="code" value={this.state.code} className="form-control"  placeholder="" required/>
                        <label htmlFor="floatingPassword">Password</label>
                        <span className="input-icon"><i onClick={()=>this.showPasswordForMate('NewPW')} id="NewPW_lable" className="fa-solid fa-eye"></i></span>
                       
                    </div>
                   
                    <div className="mb-5 text-end text-white">
                    <a onClick={()=>this.changeType('fogetPassword')} className="text-theme-color">Forget Password?  </a><br/>
                      {/* New User <strong><NavLink to="/user/signup" className="text-theme-color">Sign Up Here </NavLink></strong> */}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg">Login</button>
                </form>
                </div>
                <div className={(this.state.pageType!=='fogetPassword')?'hideClass':''}> 
                <form method="post" onSubmit={this.submitforgetpassword}>
                    <div className="mb-4 form-floating">
                    {(this.state.errors.code) ?<p className="error mb-4">{this.state.errors.code}</p> : false}
                        <input type="text" onChange={this.handleChange} name="UserEmail" value={this.state.UserEmail} className="form-control" id="floatingUser" placeholder="" required/>
                        <label htmlFor="floatingUser">Email</label>
                    </div>
                    <div className="mb-5 text-end">
                     
                      <a onClick={()=>this.changeType('login')} className="text-theme-color">login  </a>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg">Submit</button>
                </form>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);