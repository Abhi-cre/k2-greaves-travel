import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import LoaderComponent from "../../../components/LoaderComponent";
import {formatDate} from "../../../vendor/datefns";
import DatePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery'; 
class ToursFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,travelerData:{},agencyList:[],agentList:[],agentFilterList:[],
            tourTypeList:[],greavesStatusList:[],clientStatusList:[],questionnaireList:[],
            "traveler_id":0,"traveler_name":"","traveler_email":"","traveler_home_phone":"","traveler_office_phone":"","traveler_cell":"","traveler_socialLink":"",
            "id": 0,
        "tourRecordId": "",
        "tourName": "",
        "tourTypeName": "",
        "leadType": "",
        "agentId": 0,
        "gtusConsultantId": 0,
        "gtinConsultantId": 0,
        "tourStartDate": "",
        "tourEndDate": "",
        "tourTypeId": 0,
        "statusFromGreavesId": 0,
        "statusFromClientId": 0,
        "noOfPax": '',
        "paymentLastDate": "",
        "confirmationDate": "",
        "fileUSDROE": 0,
        "tourRouting": "",
        "wayttuLink": "",
        "tourContact": [],
        "tourQuestionnaire": []};
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;    
        if(name=='agencyId' && value!='')
        {
            let agentFilterList= this.state.agentList.filter((item)=>item.agencyId==value)
            setTimeout(()=>{
                this.setState({agentFilterList: agentFilterList });
            })
           
        }    
        this.setState({ ...this.state, [name]: value });
        setTimeout(()=>{
            
            this.getToursData();
        },10)
        }
        getToursData()
        {
            let questionnaireList=[];
            this.state.questionnaireList.map((item)=>{
                questionnaireList.push({
                    "id":(ArrayHelper.getValue(item,'questionId')!='')?parseInt(ArrayHelper.getValue(item,'questionId')):0,
                    "tourRecordId": parseInt(this.state.id),
                    "questionnaireId":parseInt(ArrayHelper.getValue(item,'id')),
                    "description":ArrayHelper.getValue(item,'tuorsAnswer')
                  });
            })
            let ToursData={
                "id":this.state.id,
                "tourRecordId":this.state.tourRecordId,
                "tourName":this.state.tourName,
                "tourTypeName":this.state.tourTypeName,
                "leadType":this.state.leadType,
                "agentId":(this.state.leadType=='Agency')?parseInt(this.state.agentId):0,
                "gtusConsultantId":parseInt(this.state.gtusConsultantId),
                "gtinConsultantId":parseInt(this.state.gtinConsultantId),
                "tourStartDate":(this.state.tourStartDate)?formatDate(this.state.tourStartDate,'yyyy-MM-dd'):'0000-00-00',
                "tourEndDate":(this.state.tourEndDate)?formatDate(this.state.tourEndDate,'yyyy-MM-dd'):'0000-00-00',
                "tourTypeId":parseInt(this.state.tourTypeId),
                "statusFromGreavesId":parseInt(this.state.statusFromGreavesId),
                "statusFromClientId":parseInt(this.state.statusFromClientId),
                "noOfPax":parseInt(this.state.noOfPax),
                "paymentLastDate":(this.state.paymentLastDate)?formatDate(this.state.paymentLastDate,'yyyy-MM-dd'):'1900-01-01T00:00:00',
                "confirmationDate":(this.state.confirmationDate)?formatDate(this.state.confirmationDate,'yyyy-MM-dd'):'1900-01-01T00:00:00',
                "fileUSDROE":this.state.fileUSDROE,
                "tourRouting":this.state.tourRouting,
                "wayttuLink":this.state.wayttuLink,
                "tourContact":[{ "id": parseInt(this.state.traveler_id),
                "tourId": parseInt(this.state.id),
                "name": this.state.traveler_name,
                "email": this.state.traveler_email,
                "homePhone": this.state.traveler_home_phone,
                "officePhone": this.state.traveler_office_phone,
                "personalNo": this.state.traveler_cell,
                "socialLink": this.state.traveler_socialLink}],
                "tourQuestionnaire":questionnaireList
            }
         
           this.props.getToursData(ToursData);
        }
        componentWillMount()
        {
           
            this.dataTypeList()
        
        }
    
        dataTypeList=async()=>
        {
            let questionnaireListData=this.props.questionnaireListData;
            if(questionnaireListData.length>0)
           {
               this.setState({questionnaireList:questionnaireListData});
           }
           else
           {
            this.setState({loader:true});
            let response= await SettingApi.GetSettingList('/api/Questionnaire/List');
            if(ArrayHelper.getValue(response,'isSuccess')== true)
            {
              
              this.setState({loader:false,questionnaireList:ArrayHelper.getValue(response,'questionnaires')});
              this.props.questionnaireListInfo(ArrayHelper.getValue(response,'questionnaires'));
            }
            else
            {
                this.setState({loader:false});  
            }
        }
            let agencyListData=this.props.agencyListData;
            if(agencyListData.length>0)
           {
               this.setState({agencyList:agencyListData});
           }
           else
           {
            this.setState({loader:true});
            let response= await SettingApi.GetSettingList('/api/Agency/List');
            if(ArrayHelper.getValue(response,'isSuccess')== true)
            {
              
              this.setState({loader:false,agencyList:ArrayHelper.getValue(response,'agencies')});
              this.props.agencyListInfo(ArrayHelper.getValue(response,'agencies'));
            }
            else
            {
                this.setState({loader:false});  
            }
           }

           let agentListData=this.props.agentListData;
           if(agentListData.length>0)
          {
              this.setState({agentList:agentListData,agentFilterList:agentListData});
          }
          else
          {
           this.setState({loader:true});
           let response= await SettingApi.GetSettingList('/api/Agent/List');
           if(ArrayHelper.getValue(response,'isSuccess')== true)
            
           {
            console.log(response,"responseresponse");

             
             this.setState({loader:false,agentList:ArrayHelper.getValue(response,'agents'),agentFilterList:ArrayHelper.getValue(response,'agents')});
             this.props.agentListInfo(ArrayHelper.getValue(response,'agents'));
           }
           else
           {
               this.setState({loader:false});  
           }
          }

         

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
       
    
        }
        handleTravelersInput(key: string, value: any) {
            console.log(key,ArrayHelper.getValue(value,'_d'),value)
            let valuedata='';
            if((key=='tourStartDate') &&   ArrayHelper.getValue(value,'_d')!='')
            {
                valuedata= formatDate(ArrayHelper.getValue(value,'_d'),'MM/dd/yyyy');
             
             this.setState({tourStartDate:valuedata});

            }       
            else if((key=='tourEndDate') &&   ArrayHelper.getValue(value,'_d')!='')
            {
                valuedata= formatDate(ArrayHelper.getValue(value,'_d'),'MM/dd/yyyy');
             this.setState({tourEndDate:valuedata});
            } 
            setTimeout(()=>{
             
                this.getToursData();
            },100)
             }
             handleQuestionaireInput(e1,e2,e3)
             {
               
               let questionnaireList=this.state.questionnaireList;
               questionnaireList.map((item)=>{
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
                      ;
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
                  }

                  return item;
            })
           
              this.setState({questionnaireList:questionnaireList})
              setTimeout(()=>{
             
                this.getToursData();
            },100)
             }
             componentDidMount()
    {
        if(ArrayHelper.getValue(this.props.toursSelectedData,'id')!='')
        {
        setTimeout(() => {
             let questionnaireList=this.state.questionnaireList;
             questionnaireList= questionnaireList.map((item)=>{
                  let questionId=item.id;
                  let toursSelectedData=ArrayHelper.getValue(this.props.toursSelectedData,'tourQuestionnaire').filter((_item)=>_item.questionnaireId==questionId)
                  
                  if(toursSelectedData.length>0)
                  {
                  
                    item= Object.assign({},item,{tuorsAnswer:ArrayHelper.getValue(toursSelectedData,'[0].description')})

                  }
                  else
                  {
                    
                    item= Object.assign({},item,{tuorsAnswer:''})
                  }
                  return item;
             })
           
            this.setState({ 
                "id": ArrayHelper.getValue(this.props.toursSelectedData,'id'), 
                "tourRecordId": ArrayHelper.getValue(this.props.toursSelectedData,'tourRecordId'), 
                "tourName": ArrayHelper.getValue(this.props.toursSelectedData,'tourName'), 
                "tourTypeName": ArrayHelper.getValue(this.props.toursSelectedData,'tourTypeName'), 
                "leadType": ArrayHelper.getValue(this.props.toursSelectedData,'leadType'), 
                "agentId": ArrayHelper.getValue(this.props.toursSelectedData,'agentId'), 
                "gtusConsultantId":ArrayHelper.getValue(this.props.toursSelectedData,'gtusConsultantId'), 
                "gtinConsultantId":ArrayHelper.getValue(this.props.toursSelectedData,'gtinConsultantId'), 
                "tourStartDate":(ArrayHelper.getValue(this.props.toursSelectedData,'tourStartDate'))?formatDate(ArrayHelper.getValue(this.props.toursSelectedData,'tourStartDate'),'MM/dd/yyyy'):'0000-00-00',
                "tourEndDate":(ArrayHelper.getValue(this.props.toursSelectedData,'tourEndDate'))?formatDate(ArrayHelper.getValue(this.props.toursSelectedData,'tourEndDate'),'MM/dd/yyyy'):'0000-00-00',
                "tourTypeId":ArrayHelper.getValue(this.props.toursSelectedData,'tourTypeId'), 
                "statusFromGreavesId":ArrayHelper.getValue(this.props.toursSelectedData,'statusFromGreavesId'), 
                "statusFromClientId":ArrayHelper.getValue(this.props.toursSelectedData,'statusFromClientId'), 
                "noOfPax":ArrayHelper.getValue(this.props.toursSelectedData,'noOfPax'), 
                "paymentLastDate":(ArrayHelper.getValue(this.props.toursSelectedData,'paymentLastDate'))?formatDate(ArrayHelper.getValue(this.props.toursSelectedData,'paymentLastDate'),'yyyy-MM-dd'):'1900-01-01T00:00:00',
                "confirmationDate":(ArrayHelper.getValue(this.props.toursSelectedData,'confirmationDate'))?formatDate(ArrayHelper.getValue(this.props.toursSelectedData,'confirmationDate'),'yyyy-MM-dd'):'1900-01-01T00:00:00',
                "fileUSDROE":ArrayHelper.getValue(this.props.toursSelectedData,'fileUSDROE'), 
                "tourRouting":ArrayHelper.getValue(this.props.toursSelectedData,'tourRouting'), 
                "wayttuLink":ArrayHelper.getValue(this.props.toursSelectedData,'wayttuLink'), 
                "traveler_id":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].id'),
                "traveler_name":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].name'),
                "traveler_email":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].email'),
                "traveler_home_phone":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].homePhone'),
                "traveler_office_phone":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].officePhone'),
                "traveler_cell":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].personalNo'),
                "traveler_socialLink":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].socialLink'),
                 "tourQuestionnaire":questionnaireList,
                 "questionnaireList":questionnaireList
            });
           setTimeout(()=>{
            console.log('this.props.toursSelectedData',this.props.toursSelectedData,questionnaireList)
           },10)
            },100);
        }
        else
        {
            let questionnaireList=this.state.questionnaireList;
             questionnaireList= questionnaireList.map((item)=>{
                item= Object.assign({},item,{tuorsAnswer:''})
                  return item;
             })
             this.setState({questionnaireList:questionnaireList})
             setTimeout(()=>{
                $('.questionairecheck').prop('checked', false);
             },2000)
        }
       
    }
    render(){
        let inputProps={
            required: false,
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
                                            <input required onChange={this.handleChange}  name="traveler_name" value={this.state.traveler_name}  type="text" className="form-control form-control-sm"  placeholder="Enter Traveler Name"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">PAX Number</label>
                                            <input required  type="number"  onChange={this.handleChange}  name="noOfPax" value={this.state.noOfPax} className="form-control form-control-sm"  placeholder="Enter PAX Number"/>
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
                                                <input required  type="text" onChange={this.handleChange}  name="traveler_email" value={this.state.traveler_email} className="form-control form-control-sm"  placeholder="Enter Email"/>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Home Phone</label>
                                                <input required type="text" onChange={this.handleChange}  name="traveler_home_phone" value={this.state.traveler_home_phone} className="form-control form-control-sm"  placeholder="Enter Home Phone"/>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Office Phone</label>
                                                <input required type="text" onChange={this.handleChange}  name="traveler_office_phone" value={this.state.traveler_office_phone} className="form-control form-control-sm"  placeholder="Enter Office Phone"/>
                                            </div>
                                            
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Personal No</label>
                                                <input type="text" onChange={this.handleChange}  name="traveler_cell" value={this.state.traveler_cell} className="form-control form-control-sm"  placeholder="Enter Personal No"/>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Social Link</label>
                                                <input type="text" onChange={this.handleChange}  name="traveler_socialLink" value={this.state.traveler_socialLink}  className="form-control form-control-sm"  placeholder="Enter Social Link"/>
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
                                            <select required className="form-select form-select-sm" onChange={this.handleChange} name="leadType" value={this.state.leadType} aria-label=".form-select-sm example">
                                                <option selected>Select Lead Type</option>
                                                <option value="Agency">Agency</option>
                                                <option value="Direct">Direct</option>
                                                <option value="Email">Email</option>
                                                <option value="Chat">Chat</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(this.state.leadType=='Agency')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Agency Name</label>
                                            
                                            <select   className="form-select form-select-sm" name="agencyId" value={this.state.agencyId} onChange={this.handleChange} >
                                        
                                        <option value="">Select Agnecy</option>
                                        {this.state.agencyList.map((item,key)=>{
                                          return(<option key={`agencyId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                        </select>
                                        </div>
                                        <div className={`col-md-3 mb-3 ${(this.state.leadType=='Agency')?'show':'hide'}`}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Agent name</label>
                                            <select  className="form-select form-select-sm" name="agentId" value={this.state.agentId} onChange={this.handleChange} >
                                        
                                        <option value="">Select Agent</option>
                                        {this.state.agentFilterList.map((item,key)=>{
                                          return(<option key={`agentFilterList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'title')} {ArrayHelper.getValue(item,'fname')} {ArrayHelper.getValue(item,'mname')} {ArrayHelper.getValue(item,'lname')}</option>)
                                        })}
                                        </select>
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
                                        {/* <div className="col-md-3 mb-3">
                                            <label htmlFor="Flight" className="form-label">GT Consultant</label>
                                            <select  className="form-select form-select-sm" name="gtusConsultantId" value={this.state.gtusConsultantId} onChange={this.handleChange} aria-label=".form-select-sm example">
                                                <option value="">Select GT Consultant</option>
                                                
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="class" className="form-label">GT DEL Consultant</label>
                                            <select className="form-select form-select-sm" name="gtinConsultantId" value={this.state.gtinConsultantId} onChange={this.handleChange} aria-label=".form-select-sm example">
                                                <option value="">Select</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div> */}
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Tour Id</label>
                                            <input required type="text" className="form-control form-control-sm" name="tourRecordId" value={this.state.tourRecordId} onChange={this.handleChange}  placeholder="Enter Tour Id"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Tour Name</label>
                                            <input required type="text" className="form-control form-control-sm" name="tourName" value={this.state.tourName} onChange={this.handleChange}  placeholder="Enter Tour Name"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label">Tour Start Date:</label>
                                           
                                            <DatePicker timeFormat={false} inputProps={inputProps}   name="tourStartDate" value={this.state.tourStartDate} onChange={(date:Date) => this.handleTravelersInput('tourStartDate', date)} placeholder="Enter Tour Start Date"   className="form-control formdate form-noradious"    />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Tour End Date</label>
                                           
                                            <DatePicker timeFormat={false} inputProps={inputProps}   name="tourEndDate" value={this.state.tourEndDate} onChange={(date:Date) => this.handleTravelersInput('tourEndDate', date)} placeholder="Enter Tour End Date"   className="form-control formdate form-noradious"    />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label">Tour Type</label>
                                            <select className="form-select form-select-sm" name="tourTypeId" value={this.state.tourTypeId} onChange={this.handleChange} aria-label=".form-select-sm example">
                                                <option value="">Select Tour Type</option>
                                                {this.state.tourTypeList.map((item,key)=>{
                                          return(<option key={`tourTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> Greaves Status </label>
                                            <select className="form-select form-select-sm" name="statusFromGreavesId" value={this.state.statusFromGreavesId} onChange={this.handleChange} aria-label=".form-select-sm example">
                                                <option value="">Select Greaves Status</option>
                                                {this.state.greavesStatusList.map((item,key)=>{
                                          return(<option key={`greavesStatusList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> Client Status </label>
                                            <select className="form-select form-select-sm" name="statusFromClientId" value={this.state.statusFromClientId} onChange={this.handleChange} aria-label=".form-select-sm example">
                                                <option value="">Select Client Status</option>
                                                {this.state.clientStatusList.map((item,key)=>{
                                          return(<option key={`clientStatusList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingquestionair">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#questionairModule" aria-expanded="false"
                                        aria-controls="questionairModule">
                                        Questionnaire 
                                    </button>
                                </h2>
                                <div id="questionairModule" className="accordion-collapse collapse show" aria-labelledby="headingquestionair" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-0">
                                        {this.state.questionnaireList.map((item,key)=>{
                                            return( <div key={`questionnaire-${key}`} className="row">
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="stops" className="form-label">{ArrayHelper.getValue(item,'questions[0]')}</label>
                                            </div>
                                            {(ArrayHelper.getValue(item,'questionType')=='Multiple' || ArrayHelper.getValue(item,'questionType')=='Single')?ArrayHelper.getValue(item,'answers').map((_item,_key)=>{
                                                return( <div className="col-md-2 mb-3" key={`answers-${key}-${_key}`}>{(ArrayHelper.getValue(item,'questionType')=='Multiple')?<span>
                                                    {(ArrayHelper.getValue(item,'tuorsAnswer').search(new RegExp(_item, "i")) != -1)?<input className="questionairecheck" checked name={`answers-${key}[]`} value={_item} onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)} type="checkbox"/>:
                                                   <input className="questionairecheck" name={`answers-${key}[]`} value={_item} onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)} type="checkbox"/>} </span>:
                                                <span>{(ArrayHelper.getValue(item,'tuorsAnswer')==_item)?<input className="questionairecheck" checked name={`answers-${key}`} value={_item} type="radio" onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)}  />:
                                                <input className="questionairecheck" name={`answers-${key}`} value={_item} type="radio" onClick={() => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),_item)}  />}</span>} {_item}</div>)
                                            }):''}
                                            {(ArrayHelper.getValue(item,'questionType')=='Input')?<div onChange={(e) => this.handleQuestionaireInput(ArrayHelper.getValue(item,'id'), ArrayHelper.getValue(item,'questionType'),e.target.value)} className="col-md-12 mb-3" key={`answers-${key}`}><input className="form-control form-control-sm" name={`answers-${key}`} value={ArrayHelper.getValue(item,'tuorsAnswer')} type="text"/></div>:''}
                                           
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
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ToursFieldFormComponent);