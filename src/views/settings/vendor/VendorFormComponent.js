import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import {orderBy} from "../../../lodash";
declare var $;
class VendorFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,vendorTypeList:[],stateList:[],countryList : [],cityList:[],'id':0,"vendorName": "","vendorTypeId":0,"address":'',"cityId":'',"stateId":0,'zip':'','countryId':'','primaryContactNo':'','email':'','phone':'','notes':'',"cityName":'', "stateName" :'' , "countryName" : '' , 'vendorTypeName':''};
    }
    componentDidMount()
    {
       
        this.dataTypeList()
    
    }

    dataTypeList=async()=>
    {
        let vendorTypeListData=this.props.vendorTypeListData;
        if(vendorTypeListData.length>0)
        {
            this.setState({vendorTypeList:vendorTypeListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/VendorType/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,vendorTypeList:ArrayHelper.getValue(response,'vendorTypes')});
          this.props.vendorTypeListInfo(ArrayHelper.getValue(response,'vendorTypes'));
        }
        }
        let countryListData=this.props.countryListData;
        if(countryListData.length>0)
        {
            this.setState({countryList:countryListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/City/CountryList');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            let countryList=ArrayHelper.getValue(response,'countries');
                countryList= countryList.map((item,key)=>{
                    if(item.countryName=='India')
                    {
                        item.id= -1;  
                    }
                    else if(item.countryName=='Bhutan')
                        {
                            item.id= 0;  
                        }
                        else
                        {
                            item.id=item.countryId;    
                        }
                     return item;
                })
                countryList =('asc') ? orderBy(countryList, [(o: any) => parseInt(o.id)], ['asc']) : countryList;
            this.setState({loader:false,countryList:countryList});
          this.props.countryListInfo(countryList);
        }
        }

        let cityListData=this.props.cityListData;
        if(cityListData.length>0)
        {
            this.setState({cityList:cityListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/City/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,cityList:ArrayHelper.getValue(response,'cities')});
          this.props.cityListInfo(ArrayHelper.getValue(response,'cities'));
        }
        }
        let stateListData=this.props.stateListData;
        if(stateListData.length>0)
        {
            this.setState({stateList:stateListData})
        }
        else
        {
            this.setState({loader:true});
            let responseSate= await SettingApi.GetSettingList('/api/State/List');
              if(ArrayHelper.getValue(responseSate,'isSuccess')== true)
              {
                this.setState({loader:false,stateList:ArrayHelper.getValue(responseSate,'states')})
                this.props.stateListInfo(ArrayHelper.getValue(responseSate,'states'));
              }
              else
              {
                this.setState({loader:false})
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
        if(error=="" && this.state.vendorName!='' && this.state.vendorName.length<4)
                {
                     alert('Please provide atleast 4 character of name.')
                    error='yes';
                 }             
                   else if(error=="" && this.state.zip!='' && this.state.zip.length<5)
                 {
                      alert('Please provide atleast 5 character of zip.')
                     error='yes';
                  }
                  else if(error=="" && this.state.phone!='' && this.state.phone.length<10)
                 {
                      alert('Please provide atleast 10 character of phone.')
                     error='yes';
                  } 
                  else if(error=="" && this.state.primaryContactNo!='' && this.state.primaryContactNo.length<10)
                 {
                      alert('Please provide atleast 10 character of primary Contact No.')
                     error='yes';
                  }
                
        if(error=="")   
        {  
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "vendor": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "vendorName": this.state.vendorName,
             "vendorTypeId": parseInt(this.state.vendorTypeId),
             "vendorTypeName" : this.state.vendorTypeName,
            "address": this.state.address,
            "cityId": parseInt(this.state.cityId),
            "cityName": this.state.cityName, 
            "stateId": parseInt(this.state.stateId),
            "stateName" : this.state.stateName,
             "zip": this.state.zip,
             "countryId":parseInt(this.state.countryId),
             "countryName": this.state.countryName,
             "primaryContactNo": this.state.primaryContactNo,
             "email": this.state.email,
             "phone": this.state.phone,
              "notes": this.state.notes
          }
        }
        this.setState({loader:true});

        let elmnt=""; 
       elmnt = document.getElementById("vendorMessage"+this.state.id);
       elmnt.scrollIntoView(false)
      
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Vendor/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':0,"vendorName": "","vendorTypeId":0,"address":'',"cityId":'',"state":'','zip':'','countryId':'','primaryContactNo':'','email':'','phone':'','notes':'','message':"Vendor has been added",'messageType':'success'})
         setTimeout(() => {
            
             this.props.getVendorList();
         }, 10);
         setTimeout(()=>{
            this.setState({"message":''});
           $(".close").click();
            },3000)
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
       
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Vendor/Update');
       console.log(response, 'response')
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Vendor has been Updated",'messageType':'success'})
         setTimeout(() => {
            
             this.props.updatedVendorList(ArrayHelper.getValue(formData,'vendor'));
         }, 10);
      
         setTimeout(()=>{
         this.setState({"message":''});
        $(".close").click();
         },3000)
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
            "id": ArrayHelper.getValue(this.props.selectedVendor,'id'),    
            "vendorName": ArrayHelper.getValue(this.props.selectedVendor,'vendorName'),
            "vendorTypeName": ArrayHelper.getValue(this.props.selectedVendor , 'vendorTypeName'),
            "vendorTypeId": ArrayHelper.getValue(this.props.selectedVendor,'vendorTypeId'),
            "address": ArrayHelper.getValue(this.props.selectedVendor,'address'),
            "cityId": ArrayHelper.getValue(this.props.selectedVendor,'cityId'),
            "cityName": ArrayHelper.getValue(this.props.selectedVendor , 'cityName'),
            "stateId": ArrayHelper.getValue(this.props.selectedVendor,'stateId'),
            "stateName":ArrayHelper.getValue(this.props.selectedVendor , 'stateName'),
            "zip": ArrayHelper.getValue(this.props.selectedVendor,'zip'),
            "countryId": ArrayHelper.getValue(this.props.selectedVendor,'countryId'),
            "countryName" : ArrayHelper.getValue(this.props.selectedVendor , 'countryName'),
            "primaryContactNo": ArrayHelper.getValue(this.props.selectedVendor,'primaryContactNo'),
            "email": ArrayHelper.getValue(this.props.selectedVendor,'email'),
            "phone": ArrayHelper.getValue(this.props.selectedVendor,'phone'),
            "notes": ArrayHelper.getValue(this.props.selectedVendor,'notes')
            });
           
            },100);
    }
   
   
    render(){
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip" >
     <p  id={`vendorMessage${this.state.id}`}  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>
                          <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="vendorName" value={this.state.vendorName} onChange={this.handleChange} placeholder="Enter Vender Name"/>
                                  
                                </div>
                            </div>
                           
                            
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Vendor Type </label>
                                      <select required className="form-select form-noradious" name="vendorTypeId" value={this.state.vendorTypeId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Vendor</option>
                                      {this.state.vendorTypeList.map((item,key)=>{
                                        return(<option  key={`vendorTypeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Address </label>
                                    <textarea maxLength={250} required  type="text" className="form-control form-noradious" name="address" value={this.state.address} onChange={this.handleChange} placeholder="Enter Address"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">Country </label>
                                    <select required className="form-select form-noradious" name="countryId" value={this.state.countryId} onChange={this.handleChange} >
                                        <option value="">Select Country</option>
                                        {this.state.countryList.map((item,key)=>{
                                          return(<option  key={`countryListData-${key}`}  value={ArrayHelper.getValue(item,'countryId')}>{ArrayHelper.getValue(item,'countryName')}</option>)
                                        })}
                                        </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">State </label>
                                    <select required className="form-select form-noradious" name="stateId" value={this.state.stateId} onChange={this.handleChange} >
                                        
                                        <option value="">Select State</option>
                                        {this.state.stateList.filter((_it) => _it.countryId == this.state.countryId).map((item,key)=>{
                                          return(<option  key={`stateList-${key}`}  value={ArrayHelper.getValue(item,'stateId')}>{ArrayHelper.getValue(item,'stateName')}</option>)
                                        })}
                                        </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">City </label>
                                    <select required className="form-select form-noradious" name="cityId" value={this.state.cityId} onChange={this.handleChange} >
                                        
                                      <option value="">Select City</option>
                                      {this.state.cityList.filter((_it)=>_it.stateId==this.state.stateId).map((item,key)=>{
                                        return(<option  key={`cityId-${key}`}  value={ArrayHelper.getValue(item,'cityId')}>{ArrayHelper.getValue(item,'cityName')}</option>)
                                      })}
                                      </select>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">Zip Code </label>
                                    <input maxLength={6} required  type="text" className="form-control form-noradious" name="zip" value={this.state.zip} onChange={this.handleChange} placeholder="Enter Zip Code"/>
                                </div>
                            </div>
                            {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Country</label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="country" value={this.state.country} onChange={this.handleChange} placeholder="Enter Country"/>
                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Primary Contact No</label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="primaryContactNo" value={this.state.primaryContactNo} onChange={this.handleChange} placeholder="Enter Primary Contact No"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Email Address</label>
                                    <input maxLength={100} required  type="email" className="form-control form-noradious" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter Email Address"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">Phone</label>
                                    <input maxLength={20}   type="text" className="form-control form-noradious" name="phone" value={this.state.phone} onChange={this.handleChange} placeholder="Enter Phone"/>
                                </div>
                            </div>
                            
                            {/* <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Notes </label>
                                    <textarea required  type="text" className="form-control form-noradious" name="notes" value={this.state.notes} onChange={this.handleChange} placeholder="Enter Notes"/>
                                </div>
                            </div> */}
                           
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
        vendorTypeListData : state.settingsData.vendorTypeList,
        cityListData : state.settingsData.cityList,
        stateListData : state.settingsData.stateList,
        countryListData : state.settingsData.countryList

    }
};

const mapDispatchToProps = dispatch => {
    return {
        vendorTypeListInfo:(data)=>dispatch({type: actionTypesUser.VENDOR_TYPE_LIST,payload:data}),
        cityListInfo:(data)=>dispatch({type: actionTypesUser.CITY_LIST,payload:data}),
        stateListInfo:(data)=>dispatch({type: actionTypesUser.STATE_LIST,payload:data}),
        countryListInfo:(data)=>dispatch({type: actionTypesUser.COUNTRY_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(VendorFormComponent);