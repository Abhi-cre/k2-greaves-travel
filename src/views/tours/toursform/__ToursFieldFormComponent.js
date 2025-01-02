import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import LoaderComponent from "../../../components/LoaderComponent";
import PassengerFieldFormComponent from './PassengerFieldFormComponent';
import MessagesFieldFormComponent from './MessagesFieldFormComponent';
import NotesFieldFormComponent from './NotesFieldFormComponent';
//import PaymentFieldFormComponent from './PaymentFieldFormComponent';
import {formatDate} from "../../../vendor/datefns";
import DatePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery'; 
class ToursFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,toursData:[],agentFilterList:[],
            tourTypeList:[],greavesStatusList:[],clientStatusList:[],questionnaireList:[],salesRegionList:[],userList:[]};
    }
    
        componentWillMount()
        {
           
            this.dataTypeList()
        
        }
    
        dataTypeList=async()=>
        {
           
            this.setState({agentFilterList:this.props.agentList})

         

         let tourTypeListData=this.props.tourTypeListData;
         if(tourTypeListData.length>0)
        {
            this.setState({tourTypeList:tourTypeListData});
        }
        else
        {
         this.setState({loader:true});
         let response= await SettingApi.GetSettingList('/api/TourType/List');
         if(ArrayHelper.getValue(response,'isSuccess')== true)
         {
           
           this.setState({loader:false,tourTypeList:ArrayHelper.getValue(response,'tourTypes')});
           this.props.tourTypeListInfo(ArrayHelper.getValue(response,'tourTypes'));
         }
         else
         {
             this.setState({loader:false});  
         }
        }
        let greavesStatusListData=this.props.greavesStatusListData;
        if(greavesStatusListData.length>0)
       {
           this.setState({greavesStatusList:greavesStatusListData});
       }
       else
       {
        this.setState({loader:true});
        let response= await SettingApi.GetSettingList('/api/GreavesStatus/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          
          this.setState({loader:false,greavesStatusList:ArrayHelper.getValue(response,'greavesStatuses')});
          this.props.greavesStatusListInfo(ArrayHelper.getValue(response,'greavesStatuses'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
        let clientStatusListData=this.props.clientStatusListData;
        if(clientStatusListData.length>0)
       {
           this.setState({clientStatusList:clientStatusListData});
       }
       else
       {
        this.setState({loader:true});
        let response= await SettingApi.GetSettingList('/api/ClientStatus/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          
          this.setState({loader:false,clientStatusList:ArrayHelper.getValue(response,'clientStatuses')});
          this.props.clientStatusListInfo(ArrayHelper.getValue(response,'clientStatuses'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    let salesRegionListData=this.props.salesRegionListData;
     if(salesRegionListData.length>0)
     {
        this.setState({salesRegionList:salesRegionListData});
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
          else
          {
              this.setState({loader:false});  
          }
     }
     let userListData=this.props.userListData;
     if(userListData.length>0)
     {
        this.setState({userList:userListData});
     }
     else
     {
        this.setState({loader:true});
        let response= await SettingApi.GetSettingList('/api/User/List');
          if(ArrayHelper.getValue(response,'isSuccess')== true)
          {
            this.setState({loader:false,userList:ArrayHelper.getValue(response,'userDetails')});
            this.props.userListInfo(ArrayHelper.getValue(response,'userDetails'));
          }
          else
          {
              this.setState({loader:false});  
          }
     } 
    
        }
       
             handleQuestionaireInput(e1,e2,e3)
             {
               console.log('e2',e1,e2,e3)
               let tourQuestionnaire=ArrayHelper.getValue(this.props.toursData,'[0].tourQuestionnaire');
               tourQuestionnaire=  tourQuestionnaire.map((item)=>{
                  if(item.id==e1 && (e2=='Input' || e2=='Single'))
                  {
                    item.tuorsAnswer=e3
                  }
                  else if(item.id==e1 && e2=='Multiple')
                  {
                      let tuorsAnswer=ArrayHelper.getValue(item,'tuorsAnswer'); 
                      if(tuorsAnswer!='' && tuorsAnswer!=undefined)
                      {
                       
                      let tuorsAnswerarray=tuorsAnswer.split('|');
                      
                      if(tuorsAnswerarray.filter((_item)=>_item==e3).length>0)
                      {
                        tuorsAnswerarray=tuorsAnswerarray.filter((_item)=>_item!=e3);
                      }
                      else
                      {
                        tuorsAnswerarray.push(e3)
                      }
                      
                      tuorsAnswer=tuorsAnswerarray.join("|");
                      }
                      else
                      {
                        tuorsAnswer=e3;
                      }
                     
                    item= Object.assign({},item,{tuorsAnswer:tuorsAnswer})
                    console.log('item',item)
                  }

                  return item;
            })
        
            this.handleToursInput(0, 'tourQuestionnaire', tourQuestionnaire)
             }
             
    handleToursInput(index: number, key: string, value: any) {
       
        this.setState({
            toursData:  this.props.toursData.map((item: any, k: number) => {                
                if (index == k) {
                  
                    if((key=='tourStartDate') &&   ArrayHelper.getValue(value,'_d')!='')
                    {
                        let valuedata= formatDate(ArrayHelper.getValue(value,'_d'),'MM/dd/yyyy');
                     
                        item[key] = valuedata;
        
                    }      
                    else if((key=='tourEndDate') &&   ArrayHelper.getValue(value,'_d')!='')
                    {
                        let tourStartDate=item['tourStartDate'];
                        let valuedata= formatDate(ArrayHelper.getValue(value,'_d'),'MM/dd/yyyy');
                        item[key] = valuedata;
                        if(tourStartDate!='')
                        {
                         let tourStartDatetime= new Date(tourStartDate)
                         let tourEndDatetime= new Date(valuedata)
                         if(tourStartDatetime.getTime()>tourEndDatetime.getTime())
                         {
                            item[key] = '';
                            alert('Please select Tour End date is less than Tour start date')
                           
                         }
                        }
                        
                    
                        
                         
                    }
                    else if(key=='agencyId')
                    {
                        item[key] = value;
                        let agentFilterList=this.props.agentList.filter((__item)=>__item.agencyId==value) 
                        setTimeout(()=>{
                            this.setState({agentFilterList:agentFilterList})
                        },10)
                    }
                    else
                    {
                        item[key] = value;
                    }
                   
                   
                }
                
               
                return item;
            })
        });
        }
         
            
            

              
    render(){
        let inputProps={
            required: true,
            readOnly: true,
        }
        return(
          
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <div className={`borderless-box ${(this.props.selectedTab!='Tours')?'hide':''}`}>
                    <div className="accordion border-0 pt-3 " id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                                    aria-controls="collapseOne">
                                    TOUR CONTACTS / INFORMATION
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body pb-0">
                                    <div className="row">
                                        
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Traveler Name</label>
                                            <input required
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_name')}
                                            onChange={(event: any) => this.handleToursInput(0, 'traveler_name', event.currentTarget.value)}
                                            name="traveler_name"   type="text" className="form-control form-control-sm"  placeholder="Enter Traveler Name"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">PAX Number</label>
                                            <input required  type="number"  
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].noOfPax')}
                                             onChange={(event: any) => this.handleToursInput(0, 'noOfPax', event.currentTarget.value)}
                                           className="form-control form-control-sm"  placeholder="Enter PAX Number"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                                        aria-controls="collapseTwo">
                                        PRIMARY TOUR CONTACT / INFORMATION
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0">
                                        <div className="row">
                                           
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
                                                <input required  type="text"   value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_email')}
                                             onChange={(event: any) => this.handleToursInput(0, 'traveler_email', event.currentTarget.value)}
                                               name="traveler_email"  className="form-control form-control-sm"  placeholder="Enter Email"/>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Home Phone</label>
                                                <input required type="text"  value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_home_phone')}
                                             onChange={(event: any) => this.handleToursInput(0, 'traveler_home_phone', event.currentTarget.value)}  name="traveler_home_phone"  className="form-control form-control-sm"  placeholder="Enter Home Phone"/>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Office Phone</label>
                                                <input required type="text" value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_office_phone')}
                                             onChange={(event: any) => this.handleToursInput(0, 'traveler_office_phone', event.currentTarget.value)}
                                               name="traveler_office_phone" className="form-control form-control-sm"  placeholder="Enter Office Phone"/>
                                            </div>
                                            
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Personal No</label>
                                                <input type="text" value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_cell')}
                                             onChange={(event: any) => this.handleToursInput(0, 'traveler_cell', event.currentTarget.value)}
                                             
                                                 name="traveler_cell"  className="form-control form-control-sm"  placeholder="Enter Personal No"/>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Social Link</label>
                                                <input type="text" value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_socialLink')}
                                             onChange={(event: any) => this.handleToursInput(0, 'traveler_socialLink', event.currentTarget.value)}
                                               name="traveler_socialLink"   className="form-control form-control-sm"  placeholder="Enter Social Link"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                                        aria-controls="collapseThree">
                                        AGENCY / AGENT INFORMATION
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0 row">
                                    <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Lead Type</label>
                                            <select required className="form-select form-select-sm" value={ArrayHelper.getValue(this.props.toursData,'[0].leadType')}
                                             onChange={(event: any) => this.handleToursInput(0, 'leadType', event.currentTarget.value)}
                                              name="leadType"  aria-label=".form-select-sm example">
                                                <option value="">Select Lead Type</option>
                                                <option value="Agency">Agency</option>
                                                <option value="Direct">Direct</option>
                                                <option value="Email">Email</option>
                                                <option value="Chat">Chat</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(ArrayHelper.getValue(this.props.toursData,'[0].leadType')!='Agency')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Lead Description</label>
                                            
                                            <input  type="text" className="form-control form-control-sm" name="leadValue" 
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].leadValue')}
                                             onChange={(event: any) => this.handleToursInput(0, 'leadValue', event.currentTarget.value)}
                                               placeholder="Enter Description"/>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(ArrayHelper.getValue(this.props.toursData,'[0].leadType')=='Agency')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Agency Name</label>
                                            
                                            <select   className="form-select form-select-sm" name="agencyId" 
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].agencyId')}
                                             onChange={(event: any) => this.handleToursInput(0, 'agencyId', event.currentTarget.value)}
                                             >
                                        
                                        <option value="">Select Agnecy</option>
                                        {this.props.agencyList.map((item,key)=>{
                                          return(<option key={`agencyId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                        </select>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(ArrayHelper.getValue(this.props.toursData,'[0].leadType')=='Agency')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Agent name</label>
                                          <select  className="form-select form-select-sm" name="agentId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].agentId')}
                                            onChange={(event: any) => this.handleToursInput(0, 'agentId', event.currentTarget.value)}
                                             >
                                        
                                        <option value="">Select Agent</option>
                                        {(this.state.agentFilterList.length>0)?this.state.agentFilterList.map((item,key)=>{
                                          return(<option key={`agentFilterList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'title')} {ArrayHelper.getValue(item,'fname')} {ArrayHelper.getValue(item,'mname')} {ArrayHelper.getValue(item,'lname')}</option>)
                                        }):''}
                                        </select>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(ArrayHelper.getValue(this.props.toursData,'[0].leadType')=='Agency')?'show':'hide'}`}>
                                        <label htmlFor="exampleFormControlInput1" className="form-label"></label><br/>
                                            <a data-bs-toggle="modal" data-bs-target="#agencyAdd" className="btn addInternary btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add New Agency</a> <a data-bs-toggle="modal" data-bs-target="#agentAdd" className="btn addInternaryService  btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add New Agent</a>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(ArrayHelper.getValue(this.props.toursData,'[0].leadType')=='Agency' && ArrayHelper.getValue(this.props.toursData,'[0].agentId')!='')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Email Address </label>
                                            <br/>
                                          {ArrayHelper.getValue(this.props.agentList.filter((item)=>item.id==ArrayHelper.getValue(this.props.toursData,'[0].agentId')),'[0].email')}

                                        </div>
                                        <div className={`col-md-3 mb-3 ${(ArrayHelper.getValue(this.props.toursData,'[0].leadType')=='Agency' && ArrayHelper.getValue(this.props.toursData,'[0].agentId')!='')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Contact No </label>
                                            <br/>
                                          {ArrayHelper.getValue(this.props.agentList.filter((item)=>item.id==ArrayHelper.getValue(this.props.toursData,'[0].agentId')),'[0].contactNo')}

                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Sales Region</label>
                                            <select required className="form-select form-select-sm" value={ArrayHelper.getValue(this.props.toursData,'[0].salesRegionId')}
                                             onChange={(event: any) => this.handleToursInput(0, 'salesRegionId', event.currentTarget.value)}
                                              name="salesRegionId"  aria-label=".form-select-sm example">
                                                <option value="">Select Sales Region</option>
                                                {this.state.salesRegionList.map((item,key)=>{
                                          return(<option key={`agencyId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className={`col-md-3 mb-3`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Wetu Link</label>
                                            
                                            <input  type="text" className="form-control form-control-sm" name="wetuLink" 
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].wetuLink')}
                                             onChange={(event: any) => this.handleToursInput(0, 'wetuLink', event.currentTarget.value)}
                                               placeholder="Enter Wetu Link"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFour">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false"
                                        aria-controls="collapseFour">
                                        TOUR SUMMARY
                                    </button>
                                </h2>
                                <div id="collapseFour" className="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0 row">
                                       
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Tour Id</label>
                                            <input required type="text" className="form-control form-control-sm" name="tourRecordId" 
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].tourRecordId')}
                                             onChange={(event: any) => this.handleToursInput(0, 'tourRecordId', event.currentTarget.value)}
                                               placeholder="Enter Tour Id"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Tour Name</label>
                                            <input required type="text" className="form-control form-control-sm" name="tourName" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].tourName')}
                                            onChange={(event: any) => this.handleToursInput(0, 'tourName', event.currentTarget.value)}
                                            placeholder="Enter Tour Name"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label">Tour Start Date:</label>
                                           
                                            <DatePicker timeFormat={false} inputProps={inputProps}   name="tourStartDate" 
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].tourStartDate')}
                                             onChange={(date:Date) => this.handleToursInput(0, 'tourStartDate', date)}
                                            placeholder="Enter Tour Start Date"   className="form-control formdate form-noradious"    />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Tour End Date</label>
                                           
                                            <DatePicker timeFormat={false} inputProps={inputProps}    name="tourEndDate" value={ArrayHelper.getValue(this.props.toursData,'[0].tourEndDate')}
                                             onChange={(date:Date) => this.handleToursInput(0, 'tourEndDate', date)} placeholder="Enter Tour End Date"   className="form-control formdate form-noradious"    />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label">Tour Type</label>
                                            <select className="form-select form-select-sm" name="tourTypeId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].tourTypeId')}
                                            onChange={(event: any) => this.handleToursInput(0, 'tourTypeId', event.currentTarget.value)}
                                            aria-label=".form-select-sm example">
                                                <option value="">Select Tour Type</option>
                                                {this.state.tourTypeList.map((item,key)=>{
                                          return(<option key={`tourTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> Greaves Status </label>
                                            <select className="form-select form-select-sm" name="statusFromGreavesId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].statusFromGreavesId')}
                                            onChange={(event: any) => this.handleToursInput(0, 'statusFromGreavesId', event.currentTarget.value)}
                                            aria-label=".form-select-sm example">
                                                <option value="">Select Greaves Status</option>
                                                {this.state.greavesStatusList.map((item,key)=>{
                                          return(<option key={`greavesStatusList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> Client Status </label>
                                            <select className="form-select form-select-sm" name="statusFromClientId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].statusFromClientId')}
                                            onChange={(event: any) => this.handleToursInput(0, 'statusFromClientId', event.currentTarget.value)}
                                            aria-label=".form-select-sm example">
                                                <option value="">Select Client Status</option>
                                                {this.state.clientStatusList.map((item,key)=>{
                                          return(<option key={`clientStatusList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> GT IN Staff </label>
                                            <select className="form-select form-select-sm" name="gtinConsultantId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].gtinConsultantId')}
                                            onChange={(event: any) => this.handleToursInput(0, 'gtinConsultantId', event.currentTarget.value)}
                                            aria-label=".form-select-sm example">
                                                <option value="">Select GT IN Staff</option>
                                                {this.state.userList.filter((item)=>item.departmentId=='2').map((item,key)=>{
                                          return(<option key={`userList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'firstName')} {ArrayHelper.getValue(item,'lastName')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> GT US Staff </label>
                                            <select className="form-select form-select-sm" name="gtusConsultantId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].gtusConsultantId')}
                                            onChange={(event: any) => this.handleToursInput(0, 'gtusConsultantId', event.currentTarget.value)}
                                            aria-label=".form-select-sm example">
                                                <option value="">Select GT US Staff</option>
                                                {this.state.userList.filter((item)=>item.departmentId=='1').map((item,key)=>{
                                          return(<option key={`userList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'firstName')} {ArrayHelper.getValue(item,'lastName')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">TR Currency</label>
                                            <select required className="form-select form-select-sm" name="currencyId" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].currency')}
                                            onChange={(event: any) => this.handleToursInput(0, 'currency', event.currentTarget.value)}
                                            aria-label=".form-select-sm example">
                                                <option value="">Select Currency</option>
                                                <option value="USD">USD</option>
                                                <option value="INR">INR</option>
                                                <option value="INR">Pounds</option>
                                                
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">ROE</label>
                                            <input required type="number" className="form-control form-control-sm" name="fileUSDROE" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].fileUSDROE')}
                                            onChange={(event: any) => this.handleToursInput(0, 'fileUSDROE', event.currentTarget.value)}
                                            placeholder="Enter ROE"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <PassengerFieldFormComponent              
                  PassengerData={this.props.PassengerData}
                  addPassenger={() => this.props.addPassenger()}
                  deletePassenger={(e,e2) => this.props.deletePassenger(e,e2)}
                  />
                     <MessagesFieldFormComponent              
                  MessagesData={this.props.MessagesData}
                  addMessage={() => this.props.addMessage()}
                  deleteMessage={(e) => this.props.deleteMessage(e)}
                  MessagesList={this.props.MessagesList}
                  /> 
                  <NotesFieldFormComponent              
                  NotesData={this.props.NotesData}
                  addNotes={() => this.props.addNotes()}
                  deleteNotes={(e) => this.props.deleteNotes(e)}
                  NotesList={this.props. NotesList}
                  />
                   {/* <PaymentFieldFormComponent              
                  PaymentData={this.props.PaymentData}
                  addPayment={() => this.props.addPayment()}
                  deletePayment={(e) => this.props.deletePayment(e)}
                  />      */}
                           
                           
                            {/* <div className="accordion-item">
                                <h2 className="accordion-header" id="headingSix">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false"
                                        aria-controls="collapseSix">

                                        <div className="row w-100">
                                            <div className="col-md-6">
                                                <span className="me-2">International Flights</span>
                                                <select className="form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>Select</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 text-end">
                                                Format: DDMMYR BA 111 ORD-LHR 1600-0500+1
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapseSix" className="accordion-collapse collapse show" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0">
                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="stops" className="form-label">International Departure ( To London )</label>
                                                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>Select</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="stops" className="form-label">India Arrival</label>
                                                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>Select</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="stops" className="form-label">India Departure</label>
                                                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>Select</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="stops" className="form-label">Greaves Status</label>
                                                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>Select</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <div className="form-check pt-4">
                                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                        Remove from Inbox
                                                    </label>
                                                    <br/>
                                                    <label>Created on 00/00/00</label>
                                                </div>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="stops" className="form-label">Client Status</label>
                                                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>Select</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <button className="btn-Plus mt-4">
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="accordion-item">
                                <h2 className="accordion-header" id="headingSix">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false"
                                        aria-controls="collapseSix">
                                        Tour Costing
                                    </button>
                                </h2>
                                <div id="collapseSix" className="accordion-collapse collapse show" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0">
                                        <div className="row">
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">Sale Total</label>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Initial Tour Sale</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Amenities</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Supplements</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Refunds</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Tour Total</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">Add Sale Notes</label>
                                            </div>
                                            <div className="col-md-10 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Initial Tour Sale</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row">
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">Due to Vendors</label>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Initial Tour Sale</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Amenities Cost</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Supplements Cost</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Refunds</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Type Here</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">Add Sale Notes</label>
                                            </div>
                                            <div className="col-md-10 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Type Here</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row">
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">Agent comm</label>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Initial Commission</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Commission Adj</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Date Comm Due to Agt</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Commission Total</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">Add Sale Notes</label>
                                            </div>
                                            <div className="col-md-10 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Type Here</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row">
                                            <div className="col-md-2 mb-3 pt-4">
                                                <label htmlFor="stops" className="form-label text-primary">DEPOSIT Received</label>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Deposit Received</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Date Due Deposit</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="stops" className="form-label">Date Final Payment Due</label>
                                                <input type="text" className="form-control form-control-sm"  placeholder="Name"/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div> */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingquestionair">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#questionairModule" aria-expanded="false"
                                        aria-controls="questionairModule">
                                        Questionnaire 
                                    </button>
                                </h2>
                                <div id="questionairModule" className="accordion-collapse collapse show" aria-labelledby="headingquestionair" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0">
                                        {ArrayHelper.getValue(this.props.toursData,'[0].tourQuestionnaire',[]).map((item,key)=>{
                                            return( <div key={`questionnaire-${key}`} className="row borderbottom">
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="stops" className="form-label">{ArrayHelper.getValue(item,'questions[0]')}</label>
                                            </div>
                                            {(ArrayHelper.getValue(item,'questionType')=='Multiple' || ArrayHelper.getValue(item,'questionType')=='Single')?ArrayHelper.getValue(item,'answers').map((_item,_key)=>{
                                                return( <div className="col-md-2 mb-3" key={`answers-${key}-${_key}`}>{(ArrayHelper.getValue(item,'questionType')=='Multiple')?<span>
                                                    {(ArrayHelper.getValue(item,'tuorsAnswer').search(new RegExp(_item, "i")) != -1)?<input className="questionairecheck" checked name={`answers-${key}[]`} value={_item} onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)} type="checkbox"/>:
                                                   <input className="questionairecheck" name={`answers-${key}[]`} value={_item} onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)} type="checkbox"/>} </span>:
                                                <span>{(ArrayHelper.getValue(item,'tuorsAnswer')==_item)?<input className="questionairecheck" checked name={`answers-${key}`} value={_item} type="radio" onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)}  />:
                                                <input className="questionairecheck" name={`answers-${key}`} value={_item} type="radio" onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)}  />}</span>} <span className="questionaireAns">{_item}</span></div>)
                                            }):''}
                                            {(ArrayHelper.getValue(item,'questionType')=='Input')?<div  className="col-md-12 mb-3" key={`answers-${key}`}><textarea onChange={(e) => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),e.target.value)} row={3} className="form-control form-control-sm" name={`answers-${key}`} value={ArrayHelper.getValue(item,'tuorsAnswer')} /></div>:''}
                                           
                                            </div>)
                                        })}
                                        
                                      

                                    </div>
                                </div>
                            </div>
                            
                    </div>

                </div>
                
            </React.Fragment>
        )
    }
}  





const mapStateToProps = state => {
    return {
        agencyListData : state.settingsData.agencyList,
        agentListData : state.settingsData.agentList,
        greavesOfficeListData : state.settingsData.greavesOfficeList,
        tourTypeListData : state.settingsData.tourTypeList,
        greavesStatusListData : state.settingsData.greavesStatusList,
        clientStatusListData : state.settingsData.clientStatusList,
        questionnaireListData : state.settingsData.questionnaireList,
        salesRegionListData : state.settingsData.salesRegionList,
        userListData : state.settingsData.userList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        agencyListInfo:(data)=>dispatch({type: actionTypesUser.AGENCY_LIST,payload:data}),
        agentListInfo:(data)=>dispatch({type: actionTypesUser.AGENT_LIST,payload:data}),
        greavesOfficeListInfo:(data)=>dispatch({type: actionTypesUser.GREAVES_OFFICE_LIST,payload:data}),
        tourTypeListInfo:(data)=>dispatch({type: actionTypesUser.TOUR_TYPE_LIST,payload:data}),
        greavesStatusListInfo:(data)=>dispatch({type: actionTypesUser.GREAVES_STATUS_LIST,payload:data}),
        clientStatusListInfo:(data)=>dispatch({type: actionTypesUser.CLIENT_STATUS_LIST,payload:data}),
        questionnaireListInfo:(data)=>dispatch({type: actionTypesUser.QUESTIONAIRE_LIST,payload:data}),
        salesRegionListInfo:(data)=>dispatch({type: actionTypesUser.SALES_REGION_LIST,payload:data}),
        userListInfo:(data)=>dispatch({type: actionTypesUser.USER_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ToursFieldFormComponent);