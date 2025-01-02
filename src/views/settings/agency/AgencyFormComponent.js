import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
declare var $;
class AgencyFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,agencyTypeList:[],greavesOfficeList:[],salesRegionList:[],'id':'',"name": "","agnecyTypeId":'',"status":'',"greavesOfficeId":'',"salesRegionId":'','address':'',
        'cityName':'','stateName':'','zip':'','countryName':'' , countryList :[], cityList:[] ,"cityId":'' , stateList : [], "stateId":'' ,"countryId":'','contactNo':'','email':'','notes':'','agnecyTypeName':'','greavesOfficeName':'','salesRegionName':'',"message":'',"messageType":''};
    }
    componentDidMount()
    {
       console.log(this.props.selectedAgency , 'this.props.selectedAgency')
        this.dataTypeList()
    }

    dataTypeList=async()=>
    {
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
            this.setState({loader:false,countryList:ArrayHelper.getValue(response,'countries')});
          this.props.countryListInfo(ArrayHelper.getValue(response,'countries'));
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

        let agencyTypeListData=this.props.agencyTypeListData;
        if(agencyTypeListData.length>0)
        {
            this.setState({agencyTypeList:agencyTypeListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/AgencyType/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,agencyTypeList:ArrayHelper.getValue(response,'agencyTypes')});
          this.props.agencyTypeListInfo(ArrayHelper.getValue(response,'agencyTypes'));
        }
        }

        let greavesOfficeListData=this.props.greavesOfficeListData;
        if(greavesOfficeListData.length>0)
        {
            this.setState({greavesOfficeList:greavesOfficeListData})
        }
        else
        {
            this.setState({loader:true});
            let response= await SettingApi.GetSettingList('/api/GreavesOffice/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,greavesOfficeList:ArrayHelper.getValue(response,'greavesOffices')});
            this.props.greavesOfficeListInfo(ArrayHelper.getValue(response,'greavesOffices'));
        }
       }
        let salesRegionListData=this.props.salesRegionListData;
        if(salesRegionListData.length>0)
        {
            this.setState({salesRegionList:salesRegionListData})
        }
        else
        {
            this.setState({loader:true});
            let response= await SettingApi.GetSettingList('/api/SalesRegion/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,salesRegionList:ArrayHelper.getValue(response,'salesRegions')});
            this.props.salesRegionListInfo(ArrayHelper.getValue(response,'salesRegions'));
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
        if(error=="" && this.state.name.length<3)
        {
            alert('Please provide atleast 3 character of name.')
            error='yes';
        }
        // else if(error=="" && this.state.cityName.length<3)
        // {
        //     alert('Please provide atleast 3 character of city.')
        //     error='yes';
        // }
        // else if(error=="" && this.state.stateName.length<3)
        // {
        //     alert('Please provide atleast 3 character of state.')
        //     error='yes';
        // }
        // else if(error=="" && this.state.countryName.length<3)
        // {
        //     alert('Please provide atleast 3 character of country.')
        //     error='yes';
        // }
        else if(error=="" && this.state.zip.length<5)
        {
            alert('Please provide atleast 5 character of zip code.')
            error='yes';
        }
        else if(error=="" && this.state.contactNo.length<10)
        {
            alert('Please provide atleast 10 character of contact No.')
            error='yes';
        }
      
        if(error=="")
        {
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "agency": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "name": this.state.name,
             "agnecyTypeId": parseInt(this.state.agnecyTypeId),
            "status": this.state.status,
             "greavesOfficeId": parseInt(this.state.greavesOfficeId),
             "greavesOfficeName" : this.state.greavesOfficeName,
            "salesRegionId": parseInt(this.state.salesRegionId),
             "address": this.state.address,
             "cityId" : parseInt(this.state.cityId),
            "cityName": this.state.cityName,
            "stateId" : parseInt(this.state.stateId),
              "stateName": this.state.stateName,
             "zip": this.state.zip,
             "countryId": parseInt(this.state.countryId),
           "countryName": this.state.countryName,
               "contactNo": this.state.contactNo,
             "email": this.state.email,
              "notes": this.state.notes
          }
        }
        this.setState({loader:true});
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Agency/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':'',"name": "","agnecyTypeId":'',"status":'',"greavesOfficeId":'',"salesRegionId":'','address':'','cityId':'','stateId':'','countryId':'',
         'cityName':'','stateName':'','zip':'','countryName':'','contactNo':'','email':'','notes':'','message':"Agency has been added",'messageType':'success'})
          this.props.getAgencyList();
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
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Agency/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Agency has been Updated",'messageType':'success'})
         
         setTimeout(()=>{
             this.props.updatedAgencyList(ArrayHelper.getValue(response,'agencies')[0]);
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
            "id": ArrayHelper.getValue(this.props.selectedAgency,'id'),    
            "name": ArrayHelper.getValue(this.props.selectedAgency,'name'),
            "agnecyTypeId": ArrayHelper.getValue(this.props.selectedAgency,'agnecyTypeId'),
            "status": ArrayHelper.getValue(this.props.selectedAgency,'status'),
            "greavesOfficeId": ArrayHelper.getValue(this.props.selectedAgency,'greavesOfficeId'),
            "greavesOfficeName" : ArrayHelper.getValue(this.props.selectedAgency , 'greavesOfficeName'),
            "salesRegionId": ArrayHelper.getValue(this.props.selectedAgency,'salesRegionId'),
            "address": ArrayHelper.getValue(this.props.selectedAgency,'address'),
            "cityId": ArrayHelper.getValue(this.props.selectedAgency,'cityId'),
            "stateId": ArrayHelper.getValue(this.props.selectedAgency,'stateId'),
            "zip": ArrayHelper.getValue(this.props.selectedAgency,'zip'),
            "countryId": ArrayHelper.getValue(this.props.selectedAgency,'countryId'),
            "email":ArrayHelper.getValue(this.props.selectedAgency,'email'),
            "contactNo": ArrayHelper.getValue(this.props.selectedAgency,'contactNo'),
            "notes": ArrayHelper.getValue(this.props.selectedAgency,'notes')
            });
            },100);
    }
    render(){
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
                          <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter Agency Name"/>
                                  
                                </div>
                            </div>
                            <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Agency Type</label>
                                      <select required className="form-select form-noradious" name="agnecyTypeId" value={this.state.agnecyTypeId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Agency Type</option>
                                      {this.state.agencyTypeList.map((item,key)=>{
                                        return(<option key={`agnecyTypeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Greaves Office</label>
                                      <select required className="form-select form-noradious" name="greavesOfficeId" value={this.state.greavesOfficeId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Greaves Office</option>
                                      {this.state.greavesOfficeList.map((item,key)=>{
                                        return(<option  key={`greavesOfficeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Sales Region</label>
                                      <select required className="form-select form-noradious" name="salesRegionId" value={this.state.salesRegionId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Sales Region</option>
                                      {this.state.salesRegionList.map((item,key)=>{
                                        return(<option  key={`salesRegionId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Contact No </label>
                                    <input maxLength={15} required  type="text" className="form-control form-noradious" name="contactNo" value={this.state.contactNo} onChange={this.handleChange} placeholder="Enter Contact No"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Email </label>
                                    <input required  type="email" className="form-control form-noradious" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter Email"/>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Address </label>
                                    <textarea maxLength={250} required   className="form-control form-noradious" name="address" value={this.state.address} onChange={this.handleChange} placeholder="Enter Address"/>                                  
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
                                    <label  className="form-label"> Zip Code </label>
                                    <input maxLength={6} required  type="text" className="form-control form-noradious" name="zip" value={this.state.zip} onChange={this.handleChange} placeholder="Enter Zip Code"/>
                                  
                                </div>
                            </div>
                            {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Status </label>
                                    <select required className="form-select form-noradious" name="status" value={this.state.status} onChange={this.handleChange} >
                                        
                                      <option value="">Select Status</option>
                                      <option  value="Active">Active</option>
                                      <option  value="Inactive">Inactive</option>
                                      </select>
                                  
                                </div>
                            </div> */}
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Notes </label>
                                    <textarea maxLength={250}    className="form-control form-noradious" name="notes"  onChange={this.handleChange} value={this.state.notes} placeholder="Enter Notes"/>           
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
        agencyTypeListData : state.settingsData.agencyTypeList,
        greavesOfficeListData : state.settingsData.greavesOfficeList,
        salesRegionListData : state.settingsData.salesRegionList,
        countryListData : state.settingsData.countryList,
        cityListData : state.settingsData.cityList,
        stateListData : state.settingsData.stateList,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        agencyTypeListInfo:(data)=>dispatch({type: actionTypesUser.AGENCY_TYPE_LIST,payload:data}),
        greavesOfficeListInfo:(data)=>dispatch({type: actionTypesUser.GREAVES_OFFICE_LIST,payload:data}),
        salesRegionListInfo:(data)=>dispatch({type: actionTypesUser.SALES_REGION_LIST,payload:data}),
        countryListInfo:(data)=>dispatch({type: actionTypesUser.COUNTRY_LIST,payload:data}),
        cityListInfo:(data)=>dispatch({type: actionTypesUser.CITY_LIST,payload:data}),
        stateListInfo:(data)=>dispatch({type: actionTypesUser.STATE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(AgencyFormComponent);

