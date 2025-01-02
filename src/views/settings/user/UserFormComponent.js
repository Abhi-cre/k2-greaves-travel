import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import {formatDate} from "../../../vendor/datefns";
declare var $;
class UserFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,departmentList:[],userTypeList:[],'id':'',"firstName":'',"lastName":'',"email":'',"password":'','title':'',
        'accountId':'','departmentId':'','userTypeId':'','extention':'','signature':''};
    }
    componentDidMount()
    {
       
        this.dataTypeList()
    }

    dataTypeList=async()=>
    {
        let departmentListData=this.props.departmentListData;
        if(departmentListData.length>0)
        {
            this.setState({departmentList:departmentListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/Department/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,departmentList:ArrayHelper.getValue(response,'departments')});
            this.props.departmentListInfo(ArrayHelper.getValue(response,'departments'));
        }
        }

        let userTypeListData=this.props.userTypeListData;
        if(userTypeListData.length>0)
        {
            this.setState({userTypeList:userTypeListData})
        }
        else
        {
            this.setState({loader:true});
            let response= await SettingApi.GetSettingList('/api/UserType/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,userTypeList:ArrayHelper.getValue(response,'userTypes')});
            this.props.userTypeListInfo(ArrayHelper.getValue(response,'userTypes'));
        }
       }
      
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value; 
           
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
        if(error=="" && this.state.title!='' && this.state.title.length<3)
                {
                     alert('Please provide atleast 3 character of title.')
                    error='yes';
                 }
        else if(error=="" && this.state.firstName!='' && this.state.firstName.length<3)
                 {
                      alert('Please provide atleast 3 character of first Name.')
                     error='yes';
                  }  
      else if(error=="" && this.state.lastName!='' && this.state.lastName.length<3)
                  {
                       alert('Please provide atleast 3 character of last Name.')
                      error='yes';
                   }
     else if(error=="" && this.state.accountId!='' && this.state.accountId.length<5)
                   {
                        alert('Please provide atleast 5 character of account Id.')
                       error='yes';
                    } 
     else if(error=="" && this.state.extention!='' && this.state.extention.length<4)
                    {
                         alert('Please provide atleast 4 character of extention.')
                        error='yes';
                     }                                            
        if(error=="")   
        { 
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "user": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "departmentId": parseInt(this.state.departmentId),
            "userTypeId": parseInt(this.state.userTypeId),
            "title": this.state.title,
            "firstName": this.state.firstName, 
            "lastName": this.state.lastName, 
            "email": this.state.email, 
            "password": this.state.password, 
            "accountId": this.state.accountId,    
             "extention": parseInt(this.state.extention),
            "signature": this.state.signature
          }
        }
        this.setState({loader:true});
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/User/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':'',"firstName":'',"lastName":'',"email":'',"password":'','title':'',
         'accountId':'','departmentId':'','userTypeId':'','extention':'','signature':'','message':"User has been added",'messageType':'success'})
          this.props.getUserList();
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/User/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"User has been Updated",'messageType':'success'})
         this.props.updatedUserList(ArrayHelper.getValue(response,'Users')[0]);
         setTimeout(()=>{
          this.setState({"message":''});
          $(".close").click();
         },1000)
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
    }
    }
    componentWillReceiveProps()
    {
        setTimeout(() => {
         
            this.setState({ 
            "id": ArrayHelper.getValue(this.props.selectedUser,'id'),    
            "departmentId": ArrayHelper.getValue(this.props.selectedUser,'departmentId'),
            "userTypeId": ArrayHelper.getValue(this.props.selectedUser,'userTypeId'),
            "extention": ArrayHelper.getValue(this.props.selectedUser,'extention'),
            "firstName": ArrayHelper.getValue(this.props.selectedUser,'firstName'),
            "lastName": ArrayHelper.getValue(this.props.selectedUser,'lastName'),
            "email": ArrayHelper.getValue(this.props.selectedUser,'email'),
            "password": ArrayHelper.getValue(this.props.selectedUser,'password'),
            "title": ArrayHelper.getValue(this.props.selectedUser,'title'),
            "accountId": ArrayHelper.getValue(this.props.selectedUser,'accountId'),
            "signature": ArrayHelper.getValue(this.props.selectedUser,'signature'),
            });
            },100);
    }
  
    render(){
        let inputProps={
            required: true,
        }
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit} style={{ marginTop: '20px' }}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
      <div className="col-md-4">
                                <div className="mb-3">
                                    <label  className="form-label"> Title </label>
                                    <input maxLength={5} required  type="text" className="form-control form-noradious" name="title" value={this.state.title} onChange={this.handleChange} placeholder="Enter Title"/>
                                </div>
                            </div>
      <div className="col-md-4">
                               
                                <div className="mb-3">
                                    <label  className="form-label"> First Name </label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="Enter First Name"/>
                                </div>
                            </div>
                           
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label  className="form-label"> Last Name </label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Enter Last Name"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Email </label>
                                    <input maxLength={50} required  type="email" className="form-control form-noradious" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter Email"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Password </label>
                                    <input maxLength={20} required  type="password" className="form-control form-noradious" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Enter Password"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Department</label>
                                      <select required className="form-select form-noradious" name="departmentId" value={this.state.departmentId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Department</option>
                                      {this.state.departmentList.map((item,key)=>{
                                        return(<option key={`departmentId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">User Type</label>
                                      <select required className="form-select form-noradious" name="userTypeId" value={this.state.userTypeId} onChange={this.handleChange} >
                                        
                                      <option value="">Select User Type</option>
                                      {this.state.userTypeList.map((item,key)=>{
                                        return(<option  key={`userTypeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Account Id </label>
                                    <input maxLength={10} required  type="text" className="form-control form-noradious" name="accountId" value={this.state.accountId} onChange={this.handleChange} placeholder="Enter Account Id"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Extention </label>
                                    <input maxLength={5} required  type="text" className="form-control form-noradious" name="extention" value={this.state.extention} onChange={this.handleChange} placeholder="Enter Extention"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Signature </label>
                                    <input maxLength={100}   type="text" className="form-control form-noradious" name="signature" value={this.state.signature} onChange={this.handleChange} placeholder="Enter Signature"/>
                                </div>
                            </div>
                            
                            <div className="col-md-12 text-end">
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary me-2">{(this.props.formType=='add')?'Submit':'Update'}</button>
                            </div> 
                            </div>                     
                       
                           
                        </div>
                        </form>
            </React.Fragment>
        )
    }
}  






const mapStateToProps = state => {
    return {
        departmentListData : state.settingsData.departmentList,
        userTypeListData : state.settingsData.userTypeList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        departmentListInfo:(data)=>dispatch({type: actionTypesUser.DEPARTMENT_LIST,payload:data}), 
        userTypeListInfo:(data)=>dispatch({type: actionTypesUser.USER_TYPE_LIST,payload:data}),
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(UserFormComponent);

