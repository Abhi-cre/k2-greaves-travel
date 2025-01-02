import React from "react";
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actionTypesUser from "../../../store/action/settings.action";
import {USER_ID,USER_EMAIL,USER_NAME} from '../../../helpers/constants';
import AgencyAddComponent from '../../settings/agency/AgencyAddComponent';
import AgentAddComponent from '../../settings/agent/AgentAddComponent';
import CloneItineraryComponent from "./CloneItineraryComponent";
import ToursFieldFormComponent from './ToursFieldFormComponent';
import TourItineraryFieldFormComponent from './TourItineraryFieldFormComponent';
import ItnerayServiceUpdateComponent from './ItnerayServiceUpdateComponent';
import CostingViewComponent from '../views/CostingViewComponent';
import QuotationViewComponent from '../views/QuotationViewComponent';
import VendorMailLogViewComponent from '../views/VendorMailLogViewComponent';
import ClientMailLogViewComponent  from '../views/ClientMailLogViewComponent';
import LoaderComponent from "../../../components/LoaderComponent";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {formatDate} from "../../../vendor/datefns";
import SettingApi from "../../../api/Setting.api";
import {orderBy} from "../../../lodash";
declare var $;
class ToursAddRecordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,selectedTab:'Tours',toursData:[],selectedItenaryId:'',TourItineraryData:[],TourItineraryServiceData:[],AllTourItineraryData:[],serviceList:[],quoteTypeList:[],cityList:[],stateList:[],countryList:[],vendorTypeList:[],vendorList:[],agencyList:[],agentList:[],quotationList:[],PassengerData:[],PassengerList:[],MessagesData:[],MessagesList:[],NotesData:[],NotesList:[],FlightData:[],FlightList:[],PaymentData:[],PaymentList:[],hearedAboutList:[],appSettingList:[],VendorPaymentData:[],VendorPaymentList:[],perPersonCost:[],serviceGSTPercentage:0,'message':'','messageType':'','formDisply':true,'isImportItinerary':false,selectedItineraryList:[],selectedTourId:'',isItenaryServiceUpdate:'','displayType':'byCost'};
    }
    componentWillMount()
    {
        this.reloadWindow()
        if(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')
        {
            this.addItinerary(0);
            //this.addPassenger(); 
           
        }
        //this.addMessage();
       // this.addNotes();
        setTimeout(()=>{
            this.addTours();
          
        },1000)
       
       
       
    } 

    addTours()
    {
        let toursData=this.state.toursData;
        
      
        toursData.push({
            "exitingTr":false,
            "traveler_id":(ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].id')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].id'):0,
        "traveler_name":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].name'),
        "traveler_email":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].email'),
        "traveler_home_phone":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].homePhone'),
        "traveler_office_phone":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].officePhone'),
        "traveler_cell":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].personalNo'),
        "traveler_socialLink":ArrayHelper.getValue(this.props.toursSelectedData,'tourContact[0].socialLink'),
        "id":(ArrayHelper.getValue(this.props.toursSelectedData,'id')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'id'):0,
         "tourRecordId": ArrayHelper.getValue(this.props.toursSelectedData,'tourRecordId'),
         "tourName": ArrayHelper.getValue(this.props.toursSelectedData,'tourName'),
        "tourTypeName":ArrayHelper.getValue(this.props.toursSelectedData,'id'),
         "leadType":ArrayHelper.getValue(this.props.toursSelectedData,'leadType'),
         "leadValue":ArrayHelper.getValue(this.props.toursSelectedData,'leadValue'),
         "agencyId": (ArrayHelper.getValue(this.props.toursSelectedData,'agencyId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'agencyId'):0,
         "agentId": (ArrayHelper.getValue(this.props.toursSelectedData,'agentId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'agentId'):0,
       "gtusConsultantId":(ArrayHelper.getValue(this.props.toursSelectedData,'gtusConsultantId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'gtusConsultantId'):0,
        "gtinConsultantId": (ArrayHelper.getValue(this.props.toursSelectedData,'gtinConsultantId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'gtinConsultantId'):0,
        "tourStartDate":(ArrayHelper.getValue(this.props.toursSelectedData,'tourStartDate')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'tourStartDate'):'',
        "tourEndDate": (ArrayHelper.getValue(this.props.toursSelectedData,'tourEndDate')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'tourEndDate'):'',
        "tourTypeId": (ArrayHelper.getValue(this.props.toursSelectedData,'tourTypeId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'tourTypeId'):0,
        "statusFromGreavesId": (ArrayHelper.getValue(this.props.toursSelectedData,'statusFromGreavesId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'statusFromGreavesId'):3,
       "statusFromClientId": (ArrayHelper.getValue(this.props.toursSelectedData,'statusFromClientId')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'statusFromClientId'):0,
       "noOfPax": (ArrayHelper.getValue(this.props.toursSelectedData,'noOfPax')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'noOfPax'):'1',
       "paymentLastDate": ArrayHelper.getValue(this.props.toursSelectedData,'paymentLastDate'),
       "confirmationDate": ArrayHelper.getValue(this.props.toursSelectedData,'confirmationDate'),
       "currency": ArrayHelper.getValue(this.props.toursSelectedData,'currency'),
      "fileUSDROE":(ArrayHelper.getValue(this.props.toursSelectedData,'fileUSDROE')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'fileUSDROE'):0,
      "tourRouting": ArrayHelper.getValue(this.props.toursSelectedData,'tourRouting'),
      "salesRegionId": ArrayHelper.getValue(this.props.toursSelectedData,'salesRegionId'),
      "wetuLink": ArrayHelper.getValue(this.props.toursSelectedData,'wetuLink'),
      "hearedAbout": ArrayHelper.getValue(this.props.toursSelectedData,'hearedAbout')})
        this.setState({toursData:toursData})

    }
    getQuatationList()
    {
   
      if(ArrayHelper.getValue(this.state.TourItineraryData,'[0].tourItineraryService').length>0)
      {
        let quotationList=[]
        ArrayHelper.getValue(this.state.TourItineraryData,'[0].tourItineraryService').map((item)=>{
            let quotationListfilter =quotationList.filter((_item)=>_item.quoteType==item.quoteType);
            if(quotationListfilter.length==0 && item.quoteTypeName!='')
            {
                quotationList.push({'quoteType':item.quoteType,'quoteTypeName':item.quoteTypeName})
            }
           
        })
       
        this.setState({quotationList:quotationList})
      }
      else
      {
        this.setState({quotationList:[]})
      }
    }
    getItinerary=async()=>
    {   this.setState({loader:true});
        let data={
            "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
            "tourRecordId": ArrayHelper.getValue(this.props.toursSelectedData,'id')
        }
        
        let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/ListByTourId');
       
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          if(ArrayHelper.getValue(response,'tourItinerary').length>0)
          {
           
            let tourItinerary= ArrayHelper.getValue(response,'tourItinerary');
            tourItinerary=tourItinerary.map((item)=>{
                if(item.tourItineraryService.length>0)
                {
                item.tourItineraryService= item.tourItineraryService.map((_item)=>{                    
                   let vendorList= this.state.vendorList;
                   vendorList=vendorList.filter((__item)=>__item.vendorTypeId==_item.vendorTypeId);
                   let serviceList= this.state.serviceList;
                   serviceList=serviceList.filter((__item)=>__item.vendorId==_item.vendorId);
                    _item = Object.assign({},_item,{vendorList:vendorList,'serviceList':serviceList,'commissionType':(_item.markupPercentage>0)?'byPercentage':'byAmount','commissionTypeUS':(_item.serviceUSDMarkupPercentage>0)?'byPercentage':'byAmount'})
                    return _item;
                })
            }
               return item;
            })
            this.setState({loader:false,AllTourItineraryData:tourItinerary});
            let TourItineraryData=tourItinerary.filter((item)=>item.isPrimary==true);
           if(this.state.selectedItenaryId!='')
           {
            this.setState({TourItineraryData:tourItinerary.filter((_item:any)=>_item.id==this.state.selectedItenaryId)});  
           }
            else if(TourItineraryData.length>1)
            { 
              
                this.setState({TourItineraryData:[TourItineraryData[0]]});  
            }
            else if(TourItineraryData.length==1)
            {
               
                this.setState({TourItineraryData:TourItineraryData});  
            }
            else if(tourItinerary.length>1)
            {
               
                this.setState({TourItineraryData:[tourItinerary[0]]});  
            }
            else if(ArrayHelper.getValue(response,'tourItinerary').length==1)
            {
               
                this.setState({TourItineraryData:tourItinerary});  
            }
          }
          else
          {
            this.addItinerary(ArrayHelper.getValue(this.props.toursSelectedData,'id'))
            this.setState({loader:false});
          }
          setTimeout(()=>{
            this.getQuatationList();
        },10)
        }
        else
        {
            this.setState({loader:false});  
        }

    }
    
    dataTypeList=async()=>
    {
        

        let appSettingListData=this.props.appSettingListData;
        if(appSettingListData.length>0)
        {
            this.setState({appSettingList:appSettingListData});
            setTimeout(()=>{
               
                this.addItinerarySerice('');
            },1000)
        }

        let agencyListData=this.props.agencyListData;
            if(agencyListData.length>0)
           {
               this.setState({agencyList:agencyListData});
           }

           let agentListData=this.props.agentListData;
           if(agentListData.length>0)
          {
              this.setState({agentList:agentListData});
          }
        let serviceListData=this.props.serviceListData;
        if(serviceListData.length>0)
        {
           
           this.setState({serviceList:serviceListData});
        }
       
        let quoteTypeListData=this.props.quoteTypeListData;
     if(quoteTypeListData.length>0)
     {
        this.setState({quoteTypeList:quoteTypeListData});
     }
    
     
        let cityListData=this.props.cityListData;
        if(cityListData.length>0)
        {
           
           this.setState({cityList:cityListData});
        }
        let stateListData=this.props.stateListData;
        if(stateListData.length>0)
        {
            this.setState({stateList:stateListData})
        }
        let countryListData=this.props.countryListData;
        if(countryListData.length>0)
        {
            this.setState({countryList:countryListData})
        }

        let vendorTypeListData=this.props.vendorTypeListData;
        if(vendorTypeListData.length>0)
        {
           
           this.setState({vendorTypeList:vendorTypeListData});
        }
    let vendorListData=this.props.vendorListData;
     if(vendorListData.length>0)
     {
        this.setState({vendorList:vendorListData});
     }
    
     if(ArrayHelper.getValue(this.props.toursSelectedData,'id')!='')
        {
           this.getItinerary();
           this.getFlightList(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
           this.getPaymentList(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
           this.getVendorPaymentList(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
           this.getPassengerList(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
           this.getMessageList(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
           this.getNotesList(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
        }
    }
    addPassenger(e:any)
    {
        let PassengerData=this.state.PassengerData;;
        //PassengerData.push({'id':0,"tourId":0,'fName':'','mName':'','lName':'','contactNo':'','dob':'','email':'','passportNo':'','passengerType':''});
        if(ArrayHelper.getValue(e,'fName')!='')
        {
            PassengerData.push(e);
            this.setState({PassengerData:PassengerData})
        }
       
        if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
        {
            this.setState({loader:true})
         setTimeout(()=>{
           this.postPassenger(ArrayHelper.getValue(this.state.toursData,'[0].id'))
         },10)
        }
    }
    deletePassenger=async(_key,e3)=>
    {
        if(e3!=0 && e3!='')
        {
        if(window.confirm('Do you want to delete selected Passenger?'))
        {
        

        
            let PassengerList=this.state.PassengerList; 
            PassengerList=PassengerList.filter((item,key)=>key!=_key) 
        this.setState({PassengerList:PassengerList})
            this.setState({loader:true})
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourPassengerId": e3,
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourPassenger/Delete');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
              
               this.setState({loader:false})
              
            }  
        
        
       }
    }
    else
        {
            let PassengerData=this.state.PassengerData; 
        PassengerData=PassengerData.filter((item,key)=>key!=_key) 
        this.setState({PassengerData:PassengerData})
        }  
    }
    /*  Flight Setion start */
    addFlight=async(e:any)=>
    {
        let FlightData=this.state.FlightData;;
       
        if(ArrayHelper.getValue(e,'airLineId')!='')
        {
            FlightData.push(e);
            this.setState({FlightData:FlightData})
        }
       
        if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
        {
            this.setState({loader:true})
         setTimeout(()=>{ 
           this.postFlight(ArrayHelper.getValue(this.state.toursData,'[0].id'))
         },10)
        }
    }
    deleteFlight=async(_key,e3)=>
    {
        if(e3!=0 || e3!='')
        {
        if(window.confirm('Do you want to delete selected Flight?'))
        {
        

        if(e3!=0 && e3!='')
        {
            let FlightList=this.state.FlightList; 
            FlightList=FlightList.filter((item,key)=>key!=_key) 
        this.setState({FlightList:FlightList})
            this.setState({loader:true})
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourFlightId": e3,
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourFlights/Delete');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
                this.setState({loader:false})
            }  
        }
        
    }
    }
    else
        {
            let FlightData=this.state.FlightData; 
            FlightData=FlightData.filter((item,key)=>key!=_key) 
        this.setState({FlightData:FlightData})
        }
    }
    postFlight= async(tourdId) => {  
        let FlightData=this.state.FlightData;
       
        if(FlightData.length>0)
        {
            FlightData.map(async(item,key)=>
        {
           
           item.id=parseInt(item.id)
           item.tourId=parseInt(tourdId)
           item.airLineId=parseInt(item.airLineId)
           item.departureDate=  (item.departureDate!='' && item.departureDate!='1900-01-01'  && item.departureDate!=undefined)?formatDate(item.departureDate,'yyyy-MM-dd'):'1900-01-01T00:00:00';
           item.arrivalDate=  (item.arrivalDate!='' && item.arrivalDate!='1900-01-01'  && item.arrivalDate!=undefined)?formatDate(item.arrivalDate,'yyyy-MM-dd'):'1900-01-01T00:00:00';
           
           if(item.airLineId!='')
           {
               let postdata={
                   "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                   "tourFlight": item
               }
               let response={}
            if(item.id==0)
            {
               this.setState({loader:true})
                response= await SettingApi.PostSettingList(postdata,'/api/TourFlights/Add');
            }
            else
            {
                response= await SettingApi.PostSettingList(postdata,'/api/TourFlights/Update');
            }  
               if(ArrayHelper.getValue(response,'isSuccess')==true)
               {
                  
                   if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
                   {
                    if((key+1)==FlightData.length)
                    {
                      this.getFlightList(ArrayHelper.getValue(this.state.toursData,'[0].id'))
                      this.setState({loader:false,FlightData:[]})
                    }
                      
                    }
               }
               else
               {
                if((key+1)==FlightData.length)
                    {
                     this.setState({loader:false,FlightData:[]})
                    }
                alert(ArrayHelper.getValue(response,'message'))
                
               }
            }
           
           
   
        })
       }
       }
       getFlightList=async(id)=>
       {
           this.setState({loader:true});
           let data ={
               "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
               "tourRecordId": id
             }
           let response= await SettingApi.PostSettingList(data,'/api/TourFlights/FlightListByTourId');
           if(ArrayHelper.getValue(response,'isSuccess')== true)
           {
             this.setState({loader:false,FlightList:ArrayHelper.getValue(response,'tourFlights')});
             if(ArrayHelper.getValue(response,'tourFlights').length==0)
             {
              // this.addPassenger()
             }
            
           }
           else
           {
               this.setState({loader:false});  
           }
       }   
    /*Flight section End */
     /*  Payment Setion start */
     addPayment=async(e:any)=>
     {
         let PaymentData=this.state.PaymentData;;
        
         if(ArrayHelper.getValue(e,'amount')!='')
         {
            PaymentData.push(e);
             this.setState({PaymentData:PaymentData})
         }
        
         if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
         {
             this.setState({loader:true})
          setTimeout(()=>{
            this.postPayment(ArrayHelper.getValue(this.state.toursData,'[0].id'))
          },10)
         }
     }
     deletePayment=async(_key,e3)=>
     {
        if(e3!=0 && e3!='')
         {
         if(window.confirm('Do you want to delete selected Payment?'))
         {
         
 
         
             let PaymentList=this.state.PaymentList; 
             PaymentList=PaymentList.filter((item,key)=>key!=_key) 
         this.setState({PaymentList:PaymentList})
             this.setState({loader:true})
             let data={
                 "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                 "tourPaymentId": e3,
             }
            
             let response= await SettingApi.PostSettingList(data,'/api/TourPayment/Delete');
             if(ArrayHelper.getValue(response,'isSuccess')==true)
             {
                 this.setState({loader:false})
             }  
        
     }
    }
    else
    {
        let PaymentData=this.state.PaymentData; 
        PaymentData=PaymentData.filter((item,key)=>key!=_key) 
    this.setState({PaymentData:PaymentData})
    }
     }
     postPayment= async(tourdId) => {  
         let PaymentData=this.state.PaymentData;
        
         if(PaymentData.length>0)
         {
            PaymentData.map(async(item,key)=>
         {
           
            item.id=parseInt(item.id)
            item.tourId=parseInt(tourdId)
            item.amount=parseFloat(Number(item.amount).toFixed(2))
            item.paymentDate=  (item.paymentDate!='' && item.paymentDate!='1900-01-01' && item.paymentDate!=undefined)?formatDate(item.paymentDate,'yyyy-MM-dd'):'1900-01-01T00:00:00';
            item.dueDate=  (item.dueDate!='' && item.dueDate!='1900-01-01' && item.dueDate!=undefined)?formatDate(item.dueDate,'yyyy-MM-dd'):'1900-01-01T00:00:00';
            if(item.amount!='')
            {
                let postdata={
                    "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                    "tourPayment": item
                }
                let response={}
             if(item.id==0)
             {
                this.setState({loader:true})
                 response= await SettingApi.PostSettingList(postdata,'/api/TourPayment/Add');
             }
             else
             {
                 response= await SettingApi.PostSettingList(postdata,'/api/TourPayment/Update');
             }  
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
                   
                    if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
                    {
                     if((key+1)==PaymentData.length)
                     {
                       this.getPaymentList(ArrayHelper.getValue(this.state.toursData,'[0].id'))
                       this.setState({loader:false,PaymentData:[]})
                     }
                       
                     }
                }
                else
                {
                 if((key+1)==PaymentData.length)
                     {
                      this.setState({loader:false,PaymentData:[]})
                     }
                 alert(ArrayHelper.getValue(response,'message'))
                 
                }
             }
            
            
    
         })
        }
        }
        getPaymentList=async(id)=>
        {
            this.setState({loader:true});
            let data ={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourRecordId": id
              }
            let response= await SettingApi.PostSettingList(data,'/api/TourPayment/PaymentByTourId');
            if(ArrayHelper.getValue(response,'isSuccess')== true)
            {
              this.setState({loader:false,PaymentList:ArrayHelper.getValue(response,'tourPayments')});
              if(ArrayHelper.getValue(response,'tourPayments').length==0)
              {
               // this.addPassenger()
              }
             
            }
            else
            {
                this.setState({loader:false});  
            }
        }   
     /*Payment section End */
     /*  Payment Setion start */
     addVendorPayment=async(e:any)=>
     {
         let VendorPaymentData=this.state.VendorPaymentData;;
        
         if(ArrayHelper.getValue(e,'amount')!='')
         {
            VendorPaymentData.push(e);
             this.setState({VendorPaymentData:VendorPaymentData})
         }
        
         if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
         {
             this.setState({loader:true})
          setTimeout(()=>{
            this.postVendorPayment(ArrayHelper.getValue(this.state.toursData,'[0].id'))
          },10)
         }
     }
     deleteVendorPayment=async(_key,e3)=>
     {
        if(e3!=0 && e3!='')
         {
         if(window.confirm('Do you want to delete selected Vendor Payment?'))
         {
         
 
         
             let VendorPaymentList=this.state.VendorPaymentList; 
             VendorPaymentList=VendorPaymentList.filter((item,key)=>key!=_key) 
         this.setState({VendorPaymentList:VendorPaymentList})
             this.setState({loader:true})
             let data={
                 "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                 "vendorPaymentId": e3,
             }
            
             let response= await SettingApi.PostSettingList(data,'/api/VendorPayment/Delete');
             if(ArrayHelper.getValue(response,'isSuccess')==true)
             {
                 this.setState({loader:false})
             }  
        
     }
    }
    else
    {
        let VendorPaymentData=this.state.VendorPaymentData; 
        VendorPaymentData=VendorPaymentData.filter((item,key)=>key!=_key) 
    this.setState({VendorPaymentData:VendorPaymentData})
    }
     }
     postVendorPayment= async(tourdId) => {  
         let VendorPaymentData=this.state.VendorPaymentData;
        
         if(VendorPaymentData.length>0)
         {
            VendorPaymentData.map(async(item,key)=>
         {
           
            item.id=parseInt(item.id)
            item.tourId=parseInt(tourdId)
            item.vendorId=parseInt(item.vendorId)
            item.amount=parseFloat(Number(item.amount).toFixed(2))
            item.transactionDate=  (item.transactionDate!='' && item.transactionDate!='1900-01-01' && item.transactionDate!=undefined)?formatDate(item.transactionDate,'yyyy-MM-dd'):'1900-01-01T00:00:00';
            item.transactionDueDate=  (item.transactionDueDate!='' && item.transactionDueDate!='1900-01-01' && item.transactionDueDate!=undefined)?formatDate(item.transactionDueDate,'yyyy-MM-dd'):'1900-01-01T00:00:00';
            if(item.amount!='')
            {
                let postdata={
                    "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                    "vendorPayment": item
                }
                let response={}
             if(item.id==0)
             {
                this.setState({loader:true})
                 response= await SettingApi.PostSettingList(postdata,'/api/VendorPayment/Add');
             }
             else
             {
                 response= await SettingApi.PostSettingList(postdata,'/api/VendorPayment/Update');
             }  
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
                   
                    if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
                    {
                     if((key+1)==VendorPaymentData.length)
                     {
                       this.getVendorPaymentList(ArrayHelper.getValue(this.state.toursData,'[0].id'))
                       this.setState({loader:false,VendorPaymentData:[]})
                     }
                       
                     }
                }
                else
                {
                 if((key+1)==VendorPaymentData.length)
                     {
                      this.setState({loader:false,VendorPaymentData:[]})
                     }
                 alert(ArrayHelper.getValue(response,'message'))
                 
                }
             }
            
            
    
         })
        }
        }
        getVendorPaymentList=async(id)=>
        {
            this.setState({loader:true});
            let data ={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourRecordId": id
              }
            let response= await SettingApi.PostSettingList(data,'/api/VendorPayment/PaymentByTourId');
            if(ArrayHelper.getValue(response,'isSuccess')== true)
            {
              this.setState({loader:false,VendorPaymentList:ArrayHelper.getValue(response,'vendorPayments')});
              if(ArrayHelper.getValue(response,'vendorPayments').length==0)
              {
               // this.addPassenger()
              }
             
            }
            else
            {
                this.setState({loader:false});  
            }
        }   
     /*Payment section End */
    addMessage(e:any)
    {
        let MessagesData=this.state.MessagesData;;
        MessagesData.push(e);
       // MessagesData.push({'id':0,"tourRecordId":0,'comments':'','notesFrom':''});
        this.setState({MessagesData:MessagesData})
        if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
        {
            this.setState({loader:true})
         setTimeout(async()=>{
            let bodyContent='Hi Team,<br/><br/>';
            bodyContent=bodyContent+'Tour Record id '+ArrayHelper.getValue(this.state.toursData,'[0].tourRecordId')+' has a new Message added by '+localStorage.getItem(USER_NAME)+'<br/>';
            bodyContent=bodyContent+e.comments;
            bodyContent=bodyContent+'<br/><br/>Thanks,<br/>';
            bodyContent=bodyContent+localStorage.getItem(USER_NAME);
            let mailData={
                "from": "system@web-fares.com",
                "to": 'tours@greavestours.com',
                "cc": "",
                "subject": 'TR- '+ArrayHelper.getValue(this.state.toursData,'[0].tourRecordId')+' new Message added',
                 "bodyContent": bodyContent,
                "ReplyToEmail": localStorage.getItem(USER_EMAIL),
                "ReplyToName": localStorage.getItem(USER_NAME),
                "IsBodyHtml": true
            }
           let sendMail= await SettingApi.PostTaveleList(mailData,'/api/bifrost/Azure/SendMail');
          
           this.postMessage(ArrayHelper.getValue(this.state.toursData,'[0].id'))
         },10)
        }
    }
    deleteMessage=async(_key)=>
    {
        if(window.confirm('Do you want to delete selected Messages?'))
        {
        let MessagesData=this.state.MessagesData; 
        MessagesData=MessagesData.filter((item,key)=>key!=_key) 
        this.setState({MessagesData:MessagesData})

    }
    }
    addNotes(e:any)
    {
        let NotesData=this.state.NotesData;;
        //NotesData.push({'id':0,"tourRecordId":0,'notes':'','notesFrom':''});
        NotesData.push(e);
        this.setState({NotesData:NotesData})
        if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
        {
            this.setState({loader:true})
         setTimeout(async()=>{
            let bodyContent='Hi Team,<br/><br/>';
            bodyContent=bodyContent+'Tour Record id '+ArrayHelper.getValue(this.state.toursData,'[0].tourRecordId')+' has a new Notes added by '+localStorage.getItem(USER_NAME)+'<br/>';
            bodyContent=bodyContent+e.notes;
            bodyContent=bodyContent+'<br/><br/>Thanks,<br/>';
            bodyContent=bodyContent+localStorage.getItem(USER_NAME);
            let mailData={
                "from": "system@web-fares.com",
                "to": 'tours@greavestours.com',
                "cc": "",
                "subject": 'TR- '+ArrayHelper.getValue(this.state.toursData,'[0].tourRecordId')+' new Notes added',
                 "bodyContent": bodyContent,
                "ReplyToEmail": localStorage.getItem(USER_EMAIL),
                "ReplyToName": localStorage.getItem(USER_NAME),
                "IsBodyHtml": true
            }
           let sendMail= await SettingApi.PostTaveleList(mailData,'/api/bifrost/Azure/SendMail');
           this.postNotes(ArrayHelper.getValue(this.state.toursData,'[0].id'))
         },10)
        }
    }
    deleteNotes=async(_key)=>
    {
        if(window.confirm('Do you want to delete selected Notes?'))
        {
        let NotesData=this.state.NotesData; 
        NotesData=NotesData.filter((item,key)=>key!=_key) 
        this.setState({NotesData:NotesData})

    }
    }
    addItinerary(str)
    {
        //let TourItineraryData=this.state.TourItineraryData;
        let TourItineraryData=[];
        TourItineraryData.push({'id':0,'tourRecordId':parseInt(str),'name':'','subtitle':'','description':'','comments':'','notesFrom':'',
        'isPrimary':(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?true:false,'tourItineraryService':[],'itineraryMarkupType':'byPercentage','itineraryMarkupAmount':0,'itineraryUSMarkupAmount':0,'itineraryCreditCardFees':0,'itineraryAgentAmount':0
       });
        this.setState({TourItineraryData:TourItineraryData})
        $(".dropdown-menu").removeClass('show');
        this.addItinerarySerice('');
    }
    deleteItinerary=async(_key,e3)=>
    {
        if(window.confirm('Do you want to delete selected Tours Itinerary?'))
        {
        let TourItineraryData=this.state.TourItineraryData; 
        TourItineraryData=TourItineraryData.filter((item,key)=>key!=_key) 
        this.setState({TourItineraryData:TourItineraryData})

        if(e3!=0 && e3!='')
        {
            this.setState({loader:true})
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourItineraryId": e3,
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/DeleteItinerary');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
                this.setState({selectedItenaryId:''})
                this.selectTab('Tours','');
                this.getItinerary();
            
              
            }  
        }
    }
    }
    addItinerarySerice(str)
    {
        let serviceGSTPercentage=ArrayHelper.getValue(this.state.appSettingList.filter((_item)=>_item.settingName=='GST'),'[0].settingValue');
        this.setState({serviceGSTPercentage:serviceGSTPercentage});
      if(str=='')
      {
       
        let TourItineraryServiceData=[]
        TourItineraryServiceData=  TourItineraryServiceData.concat([{'vendorList':[],'serviceList':[],'id':0,'tourRecordId':0,'itineraryId':0,'serviceId':0,'vendorId':0,'cityId':0,'stateId':0,'countryId':0,'vendorTypeId':0,'serviceDescription':'','serviceFeesId':0,'rate':0.00,'rateType':'',
        'description':'','unit':1,'cost':0.00,'markupPercentage':0.00,'markupAmount':0.00,'isShowOnItinerary':0.00,'serviceGTICommission':0.00,'serviceGrossINR':0.00,
        'serviceGSTPercentage':serviceGSTPercentage,'serviceSellINR':0.00,'serviceNetUSD':0.00,'serviceUSDMarkupPercentage':0.00,'serviceUSDCommission':0.00,'serviceUSDClientDollar':0.00,'creditCardFees':0.00,'quoteType':0,'commissionType':'byPercentage','commissionTypeUS':'byPercentage',"serviceUSDMarkUpAmount":0,'startDate':'','endDate':'',
        'origin':'','destination':'','flightNo':'','pnr':'','noofGuest':ArrayHelper.getValue(this.state.toursData,'[0].noOfPax'),'mealPlan':'','taxAmount':0.00,'noofAdult':0,'noofChild':0,'agentCommissionType':'byPercentage','agentCommissionByPercentage':0,'agentCommissionValue':0,'isChecked':true}]);
     
        this.setState({TourItineraryServiceData:TourItineraryServiceData})
      }
      else if(str=='old')
      { 
        let TourItineraryServiceData=this.state.TourItineraryServiceData;
        if(this.state.isItenaryServiceUpdate!='yes')
        {
        TourItineraryServiceData[0].cityId=0; 
        TourItineraryServiceData[0].countryId=0;   
        TourItineraryServiceData[0].stateId=0;  
        TourItineraryServiceData[0].startDate='';
        TourItineraryServiceData[0].endDate='';  
        TourItineraryServiceData[0].vendorTypeId='';   
        TourItineraryServiceData[0].serviceDescription='';
        TourItineraryServiceData[0].serviceFeesId=0;
        TourItineraryServiceData[0].rate=0.00;
        TourItineraryServiceData[0].rateType='';
        TourItineraryServiceData[0].description='';
        TourItineraryServiceData[0].unit=1;
        TourItineraryServiceData[0].cost=0.00;
        TourItineraryServiceData[0].markupAmount=0.00;
        TourItineraryServiceData[0].isShowOnItinerary=0.00;
        TourItineraryServiceData[0].serviceGTICommission=0.00;
        TourItineraryServiceData[0].serviceGrossINR=0.00;
        TourItineraryServiceData[0].serviceGSTPercentage=serviceGSTPercentage;
        TourItineraryServiceData[0].serviceSellINR=0.00;
        TourItineraryServiceData[0].serviceNetUSD=0.00;
        TourItineraryServiceData[0].serviceUSDCommission=0.00;
        TourItineraryServiceData[0].serviceUSDClientDollar=0.00;
        TourItineraryServiceData[0].quoteType=0;
        TourItineraryServiceData[0].commissionType='byPercentage';
        TourItineraryServiceData[0].commissionTypeUS='byPercentage';
        TourItineraryServiceData[0].serviceUSDMarkUpAmount=0;
        TourItineraryServiceData[0].origin='';
        TourItineraryServiceData[0].destination='';
        TourItineraryServiceData[0].flightNo='';
        TourItineraryServiceData[0].pnr='';
        TourItineraryServiceData[0].mealPlan='';
        TourItineraryServiceData[0].taxAmount=0.00;
        TourItineraryServiceData[0].agentCommissionValue=0;
        this.setState({TourItineraryServiceData:TourItineraryServiceData})
        }
        else
        {
            this.addItinerarySerice('')
        }

      }
    }
    // addItinerarySerice(e1,e2,e3)
    // {
    //     const state = this.state.TourItineraryData;
    //     let tourItineraryService = state[e1].tourItineraryService;
    //     tourItineraryService=  tourItineraryService.concat([{'vendorList':[],'serviceList':[],'id':0,'tourRecordId':parseInt(e2),'itineraryId':parseInt(e3),'serviceId':0,'vendorId':0,'vendorTypeId':0,'serviceDescription':'','rate':0.00,
    //     'description':'','unit':0,'cost':0.00,'markupPercentage':0.00,'markupAmount':0.00,'isShowOnItinerary':0.00,'serviceGTICommission':0.00,'serviceGrossINR':0.00,
    //     'serviceGSTPercentage':0.00,'serviceSellINR':0.00,'serviceNetUSD':0.00,'serviceUSDMarkupPercentage':0.00,'serviceUSDCommission':0.00,'serviceUSDClientDollar':0.00,'quoteType':0,'commissionType':'byPercentage','commissionTypeUS':'byPercentage',"serviceUSDMarkUpAmount":0,'startDate':'','endDate':''}]);
    //     state[e1].tourItineraryService=tourItineraryService;
    //     this.setState({TourItineraryData:state})
    // }
    postItinerarySerice=async(e1,e2,e3)=>
    { 
      
        const state = this.state.TourItineraryData;
         let tourItineraryService = state[e1].tourItineraryService;
         this.setState({isItenaryServiceUpdate:'no'})
         if(this.state.TourItineraryServiceData[0].id!=0 && this.state.TourItineraryServiceData[0].id!='' && this.state.isImportItinerary==false)
         {
            tourItineraryService=tourItineraryService.filter((item)=>item.id!=this.state.TourItineraryServiceData[0].id)
            this.setState({loader:true,isItenaryServiceUpdate:'yes'})
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "itineraryServiceIds": [this.state.TourItineraryServiceData[0].id],
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/DeleteTourItineraryService');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
              
              this.setState({loader:false})
            
              
            }
         }
         else if(this.state.isImportItinerary==true)
         {
           
            tourItineraryService=tourItineraryService.filter((item)=>item.id!=this.state.TourItineraryServiceData[0].id)
         }
             let TourItineraryServiceData=this.state.TourItineraryServiceData; 
             if(this.state.isImportItinerary==false)
             {
                TourItineraryServiceData[0].id=0;
             }
             
           TourItineraryServiceData[0].vendorTypeName=ArrayHelper.getValue(this.state.vendorTypeList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].vendorTypeId),'[0].name');
           TourItineraryServiceData[0].vendorName=ArrayHelper.getValue(this.state.vendorList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].vendorId),'[0].vendorName');
           TourItineraryServiceData[0].serviceName=ArrayHelper.getValue(this.state.serviceList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].serviceId),'[0].name');
           TourItineraryServiceData[0].quoteTypeName=ArrayHelper.getValue(this.state.quoteTypeList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].quoteType),'[0].name');
            tourItineraryService=  tourItineraryService.concat(TourItineraryServiceData);

        // if(this.state.TourItineraryServiceData[0].id!=0 && this.state.TourItineraryServiceData[0].id!='')
        // {
        //     tourItineraryService=  tourItineraryService.map((item)=>{
              
        //         if(item.id==this.state.TourItineraryServiceData[0].id)
        //         { 
        //             item=this.state.TourItineraryServiceData[0];
        //             item.vendorTypeName=ArrayHelper.getValue(this.state.vendorTypeList.filter((_it:any)=>_it.id==item.vendorTypeId),'[0].name');
        //             item.vendorName=ArrayHelper.getValue(this.state.vendorList.filter((_it:any)=>_it.id==item.vendorId),'[0].vendorName');
        //             item.serviceName=ArrayHelper.getValue(this.state.serviceList.filter((_it:any)=>_it.id==item.serviceId),'[0].name');
        //             item.quoteTypeName=ArrayHelper.getValue(this.state.quoteTypeList.filter((_it:any)=>_it.id==item.quoteType),'[0].name');
        //             return item;
        //         }
        //        return item;
        //     })
        // }
        // else
        // {
        //    let TourItineraryServiceData=this.state.TourItineraryServiceData; 
        //    TourItineraryServiceData[0].vendorTypeName=ArrayHelper.getValue(this.state.vendorTypeList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].vendorTypeId),'[0].name');
        //    TourItineraryServiceData[0].vendorName=ArrayHelper.getValue(this.state.vendorList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].vendorId),'[0].vendorName');
        //    TourItineraryServiceData[0].serviceName=ArrayHelper.getValue(this.state.serviceList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].serviceId),'[0].name');
        //    TourItineraryServiceData[0].quoteTypeName=ArrayHelper.getValue(this.state.quoteTypeList.filter((_it:any)=>_it.id==TourItineraryServiceData[0].quoteType),'[0].name');
        //     tourItineraryService=  tourItineraryService.concat(TourItineraryServiceData);
          
        // }
        state[e1].tourItineraryService=tourItineraryService;
        
        this.setState({TourItineraryData:state})
        if(ArrayHelper.getValue(this.props.toursSelectedData,'id')!='' && this.state.isImportItinerary==false)
        {
          setTimeout(()=>{
            this.postIntenary(ArrayHelper.getValue(this.props.toursSelectedData,'id'));
          },10)  

        }
        else 
        {
            setTimeout(()=>{
                this.addItinerarySerice('old');
              },10) 
        }
        
        
    }
    deleteItinerarySerice=async(e1,e2,e3)=>
    {
       
        if(e3==0 || this.state.isImportItinerary==true)
        {
            const state = this.state.TourItineraryData;
            let tourItineraryService = state[e1].tourItineraryService;
            tourItineraryService = tourItineraryService.filter((_: number, key: number) => key != e2);
            state[e1].tourItineraryService=tourItineraryService;
            this.setState({TourItineraryData:state})
        }
        else if(window.confirm('Do you want to delete selected Tours Itinerary Service?'))
        {
        const state = this.state.TourItineraryData;
        let tourItineraryService = state[e1].tourItineraryService;
        tourItineraryService = tourItineraryService.filter((_: number, key: number) => key != e2);
        state[e1].tourItineraryService=tourItineraryService;
        this.setState({TourItineraryData:state})

        if(e3!=0 && e3!='')
        {
            this.setState({loader:true})
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "itineraryServiceIds": [e3],
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/DeleteTourItineraryService');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
                this.getItinerary();
              this.setState({loader:false})
            
              
            }  
        }
    }
    }
    selectTab(e)
    {
       if(e=='Itinerary' && (ArrayHelper.getValue(this.state.toursData,'[0].fileUSDROE')=='' || ArrayHelper.getValue(this.state.toursData,'[0].fileUSDROE')=='0'
       || ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate')==''  || ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate')==''  || ArrayHelper.getValue(this.state.toursData,'[0].tourName')==''))
       {
           alert('Please Enter tour detail.')
       }
       else
       {
        $(".dropdown-menu").removeClass('show')
       this.setState({selectedTab:e}) 
       }
       if(e=='Costing' || e=='Quotation')
       {
        setTimeout(()=>{
            this.getPerPesionCost()
          },5)
       }
    }
    getPerPesionCost=async()=>
    {
        let data={
            "tourRecordId": ArrayHelper.getValue(this.state.toursData,'[0].id'),
            "itineraryId": ArrayHelper.getValue(this.state.TourItineraryData,'[0].id')
        }
        this.setState({loader:true})
        let response= await SettingApi.PostSettingList(data,'/api/TourSalesCosting/GetPerPersonCost');
        if(ArrayHelper.getValue(response,'isSuccess')==true)
        {
            this.setState({loader:false,perPersonCost:ArrayHelper.getValue(response,'perPersonCost')});           
        }
    }
    selectItenary(e,e2)
    {
        $(".dropdown-menu").removeClass('show')
        this.setState({TourItineraryData:[e],selectedItenaryId:e.id}); 
        this.addItinerarySerice(''); 
        
            setTimeout(()=>{
                this.getQuatationList();
            },10)
           
       
        this.selectTab(e2)
        
    }
    postIntenary= async(tourdId) => {       
    let TourItineraryData= this.state.TourItineraryData;
    TourItineraryData.map(async(item)=>{
        item.tourRecordId= await parseInt(tourdId);
        item.itineraryMarkupAmount= await parseInt(item.itineraryMarkupAmount);
        item.itineraryUSMarkupAmount= await parseInt(item.itineraryUSMarkupAmount);
        item.itineraryCreditCardFees= await parseFloat(item.itineraryCreditCardFees);
        item.itineraryAgentAmount= await parseFloat(item.itineraryAgentAmount);
        //item.isPrimary=await(item.isPrimary=='Yes')?true:false
        if(item.isPrimary=="")
        {
            item.isPrimary=false;
        }
        item.tourItineraryService=await item.tourItineraryService.map((_item)=>{
            _item.tourRecordId= parseInt(tourdId);
            _item.itineraryId= parseInt(item.id);
            _item.vendorTypeId= parseInt(_item.vendorTypeId);
             _item.vendorId= parseInt(_item.vendorId);  
             _item.quoteType= parseInt(_item.quoteType); 
             _item.countryId= parseInt(_item.countryId); 
             _item.stateId= parseInt(_item.stateId);
             _item.cityId= parseInt(_item.cityId);
             _item.serviceFeesId=(_item.serviceFeesId!='')?parseInt(_item.serviceFeesId):0;                
            //_item.markupPercentage= parseInt(_item.markupPercentage);
            if(this.state.isImportItinerary==true)
            {
                _item.id=0;   
            }
            if(_item.id==0)
            {
            if(_item.commissionType=='byPercentage')
            {
                _item.markupPercentage= parseFloat(_item.markupPercentage);
                _item.markupAmount= 0;
            }
            else
            {
                _item.markupPercentage= 0;
                _item.markupAmount= parseFloat(_item.markupAmount);
            }  
            _item.serviceUSDMarkupPercentage= (_item.commissionTypeUS=='byPercentage')?parseFloat(_item.serviceUSDMarkupPercentage):0; 
            }         
            _item.agentCommissionByPercentage= (_item.agentCommissionByPercentage!='')?parseFloat(_item.agentCommissionByPercentage):0.00;
            _item.agentCommissionValue= (_item.agentCommissionValue!='')?parseFloat(_item.agentCommissionValue):0.00;
            _item.cost= parseFloat(_item.cost);
            _item.unit= parseFloat(_item.unit);
            _item.rate= parseFloat(_item.rate);
            _item.taxAmount= parseFloat(_item.taxAmount);
            _item.noofGuest= parseFloat(_item.noofGuest);
            _item.noofAdult= parseFloat(_item.noofAdult);
            _item.noofChild= parseFloat(_item.noofChild);
            _item.serviceGTICommission= parseFloat(_item.serviceGTICommission);
            _item.serviceGrossINR= parseFloat(_item.serviceGrossINR);
            _item.serviceGSTPercentage= parseFloat(_item.serviceGSTPercentage);
            _item.serviceSellINR= parseFloat(_item.serviceSellINR);
            _item.serviceNetUSD= parseFloat(_item.serviceNetUSD);
          
            _item.serviceUSDCommission= parseFloat(_item.serviceUSDCommission);
            _item.serviceUSDClientDollar= parseFloat(_item.serviceUSDClientDollar);
            _item.creditCardFees= parseFloat(_item.creditCardFees);
            _item.quoteType= parseInt(_item.quoteType);
            //_item.serviceId= parseInt(_item.serviceId);
            //_item.serviceId= parseInt(_item.serviceId);
            _item.isShowOnItinerary=(_item.isShowOnItinerary=='Yes')?true:false;
            _item.startDate = (ArrayHelper.getValue(_item,'startDate')!='0001-01-01T00:00:00' && ArrayHelper.getValue(_item,'startDate')!='0001-01-01' && ArrayHelper.getValue(_item,'startDate')!='')?`${formatDate(ArrayHelper.getValue(_item,'startDate'),'yyyy-MM-dd')}T${formatDate(ArrayHelper.getValue(_item,'startDate'),'HH:mm:00')}`:'1900-01-01T00:00:00';
           _item.endDate=(ArrayHelper.getValue(_item,'endDate')!='0001-01-01T00:00:00' && ArrayHelper.getValue(_item,'endDate')!='0001-01-01' &&  ArrayHelper.getValue(_item,'endDate')!='')?`${formatDate(ArrayHelper.getValue(_item,'endDate'),'yyyy-MM-dd')}T${formatDate(ArrayHelper.getValue(_item,'endDate'),'HH:mm:00')}`:'1900-01-01T00:00:00';
            delete _item.vendorList;
            delete _item.serviceList;
            return _item;
        })
        let data={
            "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
            "tourItinerary": item
        }       
        if(item.id!=0 && item.id!='' && item.name!='')
        {
           
            this.setState({loader:true})
            let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/UpdateTourItinerary');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
                this.getItinerary();
                this.setState({loader:false,TourItineraryData:ArrayHelper.getValue(response,'tourItinerary')});
                $(".close").click();
                setTimeout(()=>{
                    this.addItinerarySerice('old')
                  },10)
            }
        }
        else if(item.id==0  && item.name!='')
        {
            this.setState({loader:true})
            let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/AddTourItinerary');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
               
             
                if(ArrayHelper.getValue(this.props.toursSelectedData,'id')!='')
                {
                   this.getItinerary()
                   let TourItineraryData=[ArrayHelper.getValue(response,'tourItinerary')[ArrayHelper.getValue(response,'tourItinerary').length-1]]
                
                   this.setState({loader:false,AllTourItineraryData:ArrayHelper.getValue(response,'tourItinerary'),TourItineraryData:TourItineraryData});
                  setTimeout(()=>{
                    this.addItinerarySerice('')
                  },1)
                }
                else
                {
                    this.setState({loader:false})  
                }
            }
        }


    })

    }
    postPassenger= async(tourdId) => {  
     let PassengerData=this.state.PassengerData;
     if(PassengerData.length>0)
     {
     PassengerData.map(async(item,key)=>
     {
        item.id=parseInt(item.id)
        item.tourId=parseInt(tourdId)
        item.dob=  (item.dob!='' && item.dob!='1900-01-01' && item.dob!=undefined)?formatDate(item.dob,'yyyy-MM-dd'):'1900-01-01T00:00:00';
        if(item.fName!='')
        {
            let postdata={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourPassenger": item
            }
            let response={}
         if(item.id==0)
         {
            this.setState({loader:true})
             response= await SettingApi.PostSettingList(postdata,'/api/TourPassenger/Add');
         }
         else
         {
             response= await SettingApi.PostSettingList(postdata,'/api/TourPassenger/Update');
         }  
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
                this.setState({loader:false,PassengerData:[]})
                if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
                {
                    if((key+1)==PassengerData.length)
                    {
                        this.setState({loader:false,PassengerData:[]})
                    this.getPassengerList(ArrayHelper.getValue(this.state.toursData,'[0].id'))
                    }
                 }
            }
            else
            {
                if((key+1)==PassengerData.length)
                    {
                       this.setState({loader:false,PassengerData:[]})
                    }
                alert(ArrayHelper.getValue(response,'message'))
            }
         }
        
        

     })
    }
    }
    postMessage= async(tourdId) => {  
        let MessagesData=this.state.MessagesData;
        MessagesData.map(async(item)=>
        {
           item.id=parseInt(item.id)
           item.tourRecordId=parseInt(tourdId)
          // item.notesFrom=localStorage.getItem(USER_NAME);
           if(item.comments!='')
           {
               let postdata={
                   "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                   "tourComment": item
               }
               this.setState({loader:true})
               let response= await SettingApi.PostSettingList(postdata,'/api/TourComments/Add');
               if(ArrayHelper.getValue(response,'isSuccess')==true)
               {
                   this.setState({loader:false})
               }
           }
   
        })
       }

       postNotes= async(tourdId) => {  
        let NotesData=this.state.NotesData;
        NotesData.map(async(item)=>
        {
           item.id=parseInt(item.id)
           item.tourRecordId=parseInt(tourdId)
           //item.notesFrom=localStorage.getItem(USER_NAME);
           if(item.notes!='')
           {
               let postdata={
                   "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                   "tourCostingNotes": item
               }
               this.setState({loader:true})
               let response= await SettingApi.PostSettingList(postdata,'/api/TourCostingNotes/Add');
               if(ArrayHelper.getValue(response,'isSuccess')==true)
               {
                   this.setState({loader:false})
               }
           }
   
        })
       }
    getAgentList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/Agent/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            let agentList=ArrayHelper.getValue(response,'agents').map((Item)=>{
                Item.fullName=Item.title+' '+Item.fname+' '+Item.mname+' '+Item.lname;
                return Item;
            })

          this.setState({loader:false,agentList:agentList});
          this.props.agentListInfo(ArrayHelper.getValue(response,'agents'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    getAgencyList=async()=>
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
    getToursList=async()=>
    {
        this.setState({loader:true});
        let response= await SettingApi.GetSettingList('/api/TourRecord/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          this.setState({loader:false});
          this.props.toursListInfo(ArrayHelper.getValue(response,'tourRecords'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    getPassengerList=async(id)=>
    {
        this.setState({loader:true});
        let data ={
            "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
            "tourRecordId": id
          }
        let response= await SettingApi.PostSettingList(data,'/api/TourPassenger/PassengerByTourId');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          this.setState({loader:false,PassengerList:ArrayHelper.getValue(response,'tourPassengers')});
          if(ArrayHelper.getValue(response,'tourPassengers').length==0)
          {
           // this.addPassenger()
          }
         
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    getMessageList=async(id)=>
    {
        this.setState({loader:true});
        let data ={
            "tourRecordId": parseInt(id)
          }
        let response= await SettingApi.PostSettingList(data,'/api/TourComments/CommentByTourId');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          this.setState({loader:false,MessagesList:ArrayHelper.getValue(response,'tourComments')});
         
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    getNotesList=async(id)=>
    {
        this.setState({loader:true});
        let data ={
            "tourRecordId": parseInt(id)
          }
        let response= await SettingApi.PostSettingList(data,'/api/TourCostingNotes/CostingNotesById');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          this.setState({loader:false,NotesList:ArrayHelper.getValue(response,'tourCostingNotes')});
         
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    itnerayServiceUpdate(item)
    {
       let TourItineraryServiceData=this.state.TourItineraryServiceData;   
    TourItineraryServiceData[0].id=item.id;
   TourItineraryServiceData[0].tourRecordId=item.tourRecordId;
   TourItineraryServiceData[0].itineraryId=item.itineraryId;    
   TourItineraryServiceData[0].serviceDescription=item.serviceDescription;
   TourItineraryServiceData[0].rate=item.rate;
   TourItineraryServiceData[0].rateType=item.rateType;
   TourItineraryServiceData[0].description=item.description;
   TourItineraryServiceData[0].unit=item.unit;
   TourItineraryServiceData[0].cost=item.cost;
   TourItineraryServiceData[0].markupPercentage=item.markupPercentage;
   TourItineraryServiceData[0].markupAmount=item.markupAmount;
   TourItineraryServiceData[0].isShowOnItinerary=item.isShowOnItinerary;
   TourItineraryServiceData[0].serviceGTICommission=item.serviceGTICommission;
   TourItineraryServiceData[0].serviceGrossINR=item.serviceGrossINR;
   TourItineraryServiceData[0].serviceGSTPercentage=item.serviceGSTPercentage;
   TourItineraryServiceData[0].serviceSellINR=item.serviceSellINR;
   TourItineraryServiceData[0].serviceNetUSD=item.serviceNetUSD;
   TourItineraryServiceData[0].serviceUSDMarkupPercentage=item.serviceUSDMarkupPercentage;
   TourItineraryServiceData[0].serviceUSDCommission=item.serviceUSDCommission;
   TourItineraryServiceData[0].serviceUSDClientDollar=item.serviceUSDClientDollar;
   TourItineraryServiceData[0].creditCardFees=item.creditCardFees;
   TourItineraryServiceData[0].quoteType=item.quoteType;
   TourItineraryServiceData[0].commissionType=(item.markupPercentage==0)?'byAmount':'byPercentage';
   TourItineraryServiceData[0].commissionTypeUS=(item.serviceUSDMarkupPercentage==0)?'byAmount':'byPercentage';
   TourItineraryServiceData[0].serviceUSDMarkUpAmount=item.serviceUSDCommission;
   TourItineraryServiceData[0].startDate=item.startDate;
   TourItineraryServiceData[0].endDate=item.endDate;
   TourItineraryServiceData[0].creditCardFees=item.creditCardFees;
   TourItineraryServiceData[0].origin=item.origin;
   TourItineraryServiceData[0].destination=item.destination;
   TourItineraryServiceData[0].flightNo=item.flightNo;
   TourItineraryServiceData[0].pnr=item.pnr;
   TourItineraryServiceData[0].noofGuest=item.noofGuest;
   TourItineraryServiceData[0].mealPlan=item.mealPlan;
   TourItineraryServiceData[0].taxAmount=item.taxAmount;
   TourItineraryServiceData[0].quoteType=item.quoteType;
    let vendorList=this.state.vendorList;
   vendorList=vendorList.filter((_item)=>item.vendorTypeId==_item.vendorTypeId && _item.cityId==item.cityId)
  //  vendorList=vendorList.concat([{"id":0,"vendorName":"Select Vendor Type"}])
   TourItineraryServiceData[0].vendorList=vendorList;
    let serviceList=this.state.serviceList;
                  
    serviceList=serviceList.filter((_item)=>_item.vendorId==item.vendorId)
  // serviceList=serviceList.concat([{"id":0,"name":"Select Service"}])
   TourItineraryServiceData[0].serviceList=serviceList;
   TourItineraryServiceData[0].cityId=item.cityId;
   TourItineraryServiceData[0].countryId=item.countryId;
   TourItineraryServiceData[0].stateId=item.stateId;
   TourItineraryServiceData[0].serviceId=item.serviceId;
   TourItineraryServiceData[0].vendorId=item.vendorId;
   TourItineraryServiceData[0].vendorTypeId=item.vendorTypeId;
   
   this.setState({TourItineraryServiceData:TourItineraryServiceData})
    }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
        if(ArrayHelper.getValue(this.state.toursData,'[0].leadType')=='Agency' && ArrayHelper.getValue(this.state.toursData,'[0].agencyId')=='')
        {
            alert('Please select the Agency')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].leadType')=='Agency' && ArrayHelper.getValue(this.state.toursData,'[0].agentId')=='')
        {
            alert('Please select the Agent')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].leadType')=='Direct' && ArrayHelper.getValue(this.state.toursData,'[0].leadValue')=='')
        {
            alert('Please enter the Lead Description')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].tourName')=='')
        {
            alert('Please Enter tour name')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate')=='')
        {
            alert('Please Enter tour start date')
            error='yes'
        }
        else if(error=='' && ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate')=='')
        {
            alert('Please Enter tour end date')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].tourTypeId')=='')
        {
            alert('Please select the Tour Type')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].statusFromGreavesId')=='')
        {
            alert('Please select the Greaves Status')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].statusFromClientId')=='')
        {
            alert('Please select the Client Status')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].gtinConsultantId')=='')
        {
            alert('Please select the Operation Staff')
            error='yes'
        }
        else if(ArrayHelper.getValue(this.state.toursData,'[0].gtusConsultantId')=='')
        {
            alert('Please select the Sales Staff')
            error='yes'
        }
        else if(this.state.isImportItinerary==true && ArrayHelper.getValue(this.state.TourItineraryData,'[0].tourItineraryService',[]).length>0) 
        {            
          
           let tourStartDate= new Date(ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate'));
           let tourEndDate = new Date(ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate'));
           let tourStartDateTime=tourStartDate.getTime();
           let tourEndDateTime=tourEndDate.getTime();
           let checkDate='';
           ArrayHelper.getValue(this.state.TourItineraryData,'[0].tourItineraryService',[]).map((_item)=>{
            let startDate=new Date(_item.startDate);
            let endDate=new Date(_item.endDate);
            let startDateTime=startDate.getTime();
            let endDateTime=endDate.getTime();
           
            if(tourStartDateTime>startDateTime || startDateTime>tourEndDateTime)
            {
                checkDate='yes';
                error='yes';
            }
            if(tourStartDateTime>endDateTime || endDateTime>tourEndDateTime)
            {
                checkDate='yes';
                error='yes';
            }
           })
           if(checkDate!='')
           {           
            alert("please select tour itineray service date as per tour date")
           }
        }
     
       
        if(error=="")
        {
            this.setState({loader:true})
          
        let tourRecord={
           
            "id": ArrayHelper.getValue(this.state.toursData,'[0].id'),
                "tourRecordId":ArrayHelper.getValue(this.state.toursData,'[0].tourRecordId'),
                "tourName":ArrayHelper.getValue(this.state.toursData,'[0].tourName'),
                //"tourTypeName":ArrayHelper.getValue(this.state.toursData,'[0].tourTypeName'),
                "leadType":ArrayHelper.getValue(this.state.toursData,'[0].leadType'),
                "leadValue":ArrayHelper.getValue(this.state.toursData,'[0].leadValue'),
                "agentId":(ArrayHelper.getValue(this.state.toursData,'[0].leadType')=='Agency')?parseInt(ArrayHelper.getValue(this.state.toursData,'[0].agentId')):0,
                "agencyId":(ArrayHelper.getValue(this.state.toursData,'[0].leadType')=='Agency')?parseInt(ArrayHelper.getValue(this.state.toursData,'[0].agencyId')):0,
                "gtusConsultantId":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].gtusConsultantId')),
                "gtinConsultantId":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].gtinConsultantId')),
                "tourStartDate":(ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate')!='')?formatDate(ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate'),'yyyy-MM-dd'):'0000-00-00',
                "tourEndDate":(ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate')!='')?formatDate(ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate'),'yyyy-MM-dd'):'0000-00-00',
                "tourTypeId":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].tourTypeId')),
                "statusFromGreavesId":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].statusFromGreavesId')),
                "statusFromClientId":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].statusFromClientId')),
                "noOfPax":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].noOfPax')),
                "paymentLastDate":(ArrayHelper.getValue(this.state.toursData,'[0].paymentLastDate'))?formatDate(ArrayHelper.getValue(this.state.toursData,'[0].paymentLastDate'),'yyyy-MM-dd'):'1900-01-01T00:00:00',
                "confirmationDate":(ArrayHelper.getValue(this.state.toursData,'[0].confirmationDate'))?formatDate(ArrayHelper.getValue(this.state.toursData,'[0].confirmationDate'),'yyyy-MM-dd'):'1900-01-01T00:00:00',
                "fileUSDROE":parseInt(ArrayHelper.getValue(this.state.toursData,'[0].fileUSDROE')),
                "currency":ArrayHelper.getValue(this.state.toursData,'[0].currency'),
                "tourRouting":ArrayHelper.getValue(this.state.toursData,'[0].tourRouting'),
                "salesRegionId":(ArrayHelper.getValue(this.state.toursData,'[0].salesRegionId')!='')?parseInt(ArrayHelper.getValue(this.state.toursData,'[0].salesRegionId')):0,
                "wetuLink":ArrayHelper.getValue(this.state.toursData,'[0].wetuLink'),
                "hearedAbout": ArrayHelper.getValue(this.state.toursData,'[0].hearedAbout'),
                "tourQuestionnaire":[],
                "tourContact":[{ "id": parseInt(ArrayHelper.getValue(this.state.toursData,'[0].traveler_id')),
                "tourId": parseInt(ArrayHelper.getValue(this.state.toursData,'[0].id')),
                "name": ArrayHelper.getValue(this.state.toursData,'[0].traveler_name'),
                "email": ArrayHelper.getValue(this.state.toursData,'[0].traveler_email'),
                "homePhone": ArrayHelper.getValue(this.state.toursData,'[0].traveler_home_phone'),
                "officePhone":  ArrayHelper.getValue(this.state.toursData,'[0].traveler_office_phone'),
                "personalNo": ArrayHelper.getValue(this.state.toursData,'[0].traveler_cell'),
                "socialLink": ArrayHelper.getValue(this.state.toursData,'[0].traveler_socialLink')}]
        }
      
       let hearedAboutList= this.state.hearedAboutList.filter((_it)=>_it.name==ArrayHelper.getValue(this.state.toursData,'[0].hearedAbout'))
       if(hearedAboutList.length==0)
       {
       let formDatahearedAbout={
            "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
            "hearedAbout": {
              "id": 0,
              "name": ArrayHelper.getValue(this.state.toursData,'[0].hearedAbout')
            }
          }
          let responsehearedAbout= await SettingApi.PostSettingList(formDatahearedAbout,'/api/HearedAbout/Add');
       }  
        if(ArrayHelper.getValue(this.state.toursData,'[0].id')!='' && ArrayHelper.getValue(this.state.toursData,'[0].id')!=0)
        {
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourRecord": tourRecord,
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourRecord/Update');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
               let toursId= (ArrayHelper.getValue(this.props.toursSelectedData,'id')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'id'):0;
             
               this.postIntenary(toursId)
               this.postPassenger(toursId)
               this.postFlight(toursId)
               this.postPayment(toursId)
               this.postVendorPayment(toursId)
               this.postMessage(toursId)
               this.postNotes(toursId)
               this.setState({loader:false,'name':'','message':"Tours  has been Updated",'messageType':'success'})
               this.getToursList();
              setTimeout(()=>{
               // this.getPassengerList(toursId);
               // this.getMessageList(toursId);
                //this.addMessage();
               // this.getNotesList(toursId);
                //this.addNotes();
               // this.props.history("/tours"); 
              // this.selectTab('Tours')
               this.getItinerary(); 
               if(this.state.isImportItinerary==true)
               {
                this.setState({isImportItinerary:false})
                this.selectTab('Tours');
                
               }
               window.scrollTo(0, 0)         
              },1000)
              
            }
            else
            {
                this.setState({loader:false,'name':'','message':ArrayHelper.getValue(response,'message'),'messageType':'error','formDisply':true})  
            } 
        }
        else
        {
            let data={
                "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                "tourRecord": tourRecord,
            }
           
            let response= await SettingApi.PostSettingList(data,'/api/TourRecord/Add');
            if(ArrayHelper.getValue(response,'isSuccess')==true)
            {
              this.setState({loader:false,'name':'','message':"Tours  has been added",'messageType':'success','formDisply':false})
              this.postIntenary(ArrayHelper.getValue(response,'tourRecordResponse[0].id'));
              this.postPassenger(ArrayHelper.getValue(response,'tourRecordResponse[0].id'));
              this.postPayment(ArrayHelper.getValue(response,'tourRecordResponse[0].id'));
              this.postFlight(ArrayHelper.getValue(response,'tourRecordResponse[0].id'));
              this.postVendorPayment(ArrayHelper.getValue(response,'tourRecordResponse[0].id'));
              this.postMessage(ArrayHelper.getValue(response,'tourRecordResponse[0].id')); 
              this.postNotes(ArrayHelper.getValue(response,'tourRecordResponse[0].id'));
              this.getToursList();            
              setTimeout(()=>{
                this.setState({isImportItinerary:false})
                this.props.history("/tours");            
              },1000)
            }
            else
            {
                this.setState({loader:false,'name':'','message':ArrayHelper.getValue(response,'message'),'messageType':'error','formDisply':true})  
           
            } 
         }
        }
    }  
    getToursData(e)
    {
       this.setState({travelerData:e}) 
    }
    resetForm()
    {
     
     this.setState({TourItineraryData:[],toursData:[]})
     setTimeout(()=>{
        this.addTours();
        this.addItinerary(0)
     },10)
    }
    showHideLoder(e)
    {
      
        this.setState({loader:e})
    } 
    reloadWindow=async()=>
    {
        this.setState({loader:false}); 
        let responseHearedAbount= await SettingApi.GetSettingList('/api/HearedAbout/List');
        if(ArrayHelper.getValue(responseHearedAbount,'isSuccess')== true)
        {
          
          
          this.setState({loader:false,hearedAboutList:ArrayHelper.getValue(responseHearedAbount,'hearedAbout')});
        }
        else
        {
            this.setState({loader:false});  
        }

        this.setState({loader:false}); 
        let responseAppSetting= await SettingApi.GetSettingList('/api/AppSetting/List');
        if(ArrayHelper.getValue(responseAppSetting,'isSuccess')== true)
        {
          
          
          this.setState({loader:false,appSettingList:ArrayHelper.getValue(responseAppSetting,'appSettings')});
          this.props.appSettingListInfo(ArrayHelper.getValue(responseAppSetting,'appSettings'));
          setTimeout(()=>{
               
            this.addItinerarySerice('');
        },1000)
        }
        else
        {
            this.setState({loader:false});  
        }
   
             this.getAgencyList();
        
          
           this.getAgentList()
          
      
            let responService= await SettingApi.GetSettingList('/api/Service/List');
            if(ArrayHelper.getValue(responService,'isSuccess')== true)
            {
              
              
              this.setState({loader:false,serviceList:ArrayHelper.getValue(responService,'services')});
              this.props.serviceListInfo(ArrayHelper.getValue(responService,'services'));
            }
            else
            {
                this.setState({loader:false});  
            }
      
       
        this.setState({loader:true});
        let responseQuote= await SettingApi.GetSettingList('/api/QuoteType/List');
          if(ArrayHelper.getValue(responseQuote,'isSuccess')== true)
          {
            this.setState({loader:false,quoteTypeList:ArrayHelper.getValue(responseQuote,'quoteTypes')});
            this.props.quoteTypeListInfo(ArrayHelper.getValue(responseQuote,'quoteTypes'));
          }
          else
          {
              this.setState({loader:false});  
          }
     
           this.setState({loader:true});
           let responseCity= await SettingApi.GetSettingList('/api/City/List');
             if(ArrayHelper.getValue(responseCity,'isSuccess')== true)
             {
                let cityList=ArrayHelper.getValue(responseCity,'cities');
              
               this.setState({loader:false,cityList:cityList});
               this.props.cityListInfo(ArrayHelper.getValue(responseCity,'cities'));
             }
             else
             {
                 this.setState({loader:false});  
             }
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
               this.setState({loader:true});
             let responseCountry= await SettingApi.GetSettingList('/api/City/CountryList');
               if(ArrayHelper.getValue(responseCountry,'isSuccess')== true)
               { let countryList=ArrayHelper.getValue(responseCountry,'countries');
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
                 this.setState({loader:false,countryList:countryList})
                 this.props.countryListInfo(countryList);
               }
               else
               {
                 this.setState({loader:false})
               }
           this.setState({loader:true});
           let responseVendorType= await SettingApi.GetSettingList('/api/VendorType/List');
             if(ArrayHelper.getValue(responseVendorType,'isSuccess')== true)
             {
                let vendorTypeList = ArrayHelper.getValue(responseVendorType,'vendorTypes')
             
               this.setState({loader:false,vendorTypeList:vendorTypeList});
               this.props.vendorTypeListInfo(ArrayHelper.getValue(responseVendorType,'vendorTypes'));
             }
             else
             {
                 this.setState({loader:false});  
             }
       
        this.setState({loader:true});
        let responseVendor= await SettingApi.GetSettingList('/api/Vendor/List');
          if(ArrayHelper.getValue(responseVendor,'isSuccess')== true)
          {
            this.setState({loader:false,vendorList:ArrayHelper.getValue(responseVendor,'vendors')});
            this.props.vendorListInfo(ArrayHelper.getValue(responseVendor,'vendors'));
          }
          else
          {
              this.setState({loader:false});  
          }
        setTimeout(()=>{
            this.dataTypeList();
        },10)
    } 
    setChangeTour=async(e)=>
    {
        this.setState({loader:true,selectedItineraryList:[],selectedTourId:e});
        this.addItinerary(0,'Itinerary')
        if(e!='')
        {
        let data={
            "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
            "tourRecordId": parseInt(e)
        }
        
        let response= await SettingApi.PostSettingList(data,'/api/TourItinerary/ListByTourId');
       
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          if(ArrayHelper.getValue(response,'tourItinerary').length>0)
          {
            this.setState({loader:false,selectedItineraryList:ArrayHelper.getValue(response,'tourItinerary')});
          }
          else
          {
            this.setState({loader:false});
          }
        }
        else
        {
          this.setState({loader:false});
        }
    }
    else
    {
      this.setState({loader:false});
    }
    }
    importItenery(e)
    {
       
            if(e!='')
            {
                let selectedItineraryList=this.state.selectedItineraryList;
                let selectedItinerary=selectedItineraryList.filter((item)=>item.id==e)[0];
                selectedItinerary.id=0;
                this.selectItenary(selectedItinerary,'Itinerary')
            }
            else
            {
                this.addItinerary(0,'Itinerary')
            }
            
       
    }
    render(){
      
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
                 {(this.state.message!='')?<p  className={`p-4 updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
                 <form method="post" onSubmit={this.submit}>
                 <div className={`p-4 pt-0 ms-2 toursBlock   ${(this.state.formDisply!=true)?'hide':''}`}>
                
                <div className={`w-100 quot-sheet ${(this.state.formDisply!=true)?'hide':''}`}>
                    <div className="row navbar navbar-expand-lg p-0 ">
                        <div className="col-md-8 navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a onClick={()=>this.selectTab('Tours')} className={`nav-link ${(this.state.selectedTab=='Tours')?'active':''}`} aria-current="page">Tours</a>
                                </li>
                                {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?<li className="nav-item">
                                    <a onClick={()=>this.selectTab('Itinerary')}  className={`nav-link ${(this.state.selectedTab=='Itinerary')?'active':''}`}>Itinerary</a>
                                </li>:
                                <li className="nav-item dropdown">
                                <a onClick={()=>{this.selectTab('Itinerary');this.addItinerarySerice('')}} className={`nav-link costing ${(this.state.selectedTab=='Itinerary')?'active':''}`}>
                                Itinerary 
                                </a>
                               {(this.state.AllTourItineraryData.length>0)?<ul id="Itinerary" className="dropdown-menu">
                                    {this.state.AllTourItineraryData.map((item,key)=>{
                                        return( <li key={`Itinerary-${key}`}>
                                            <a className="dropdown-item" onClick={()=>{this.selectItenary(item,'Itinerary');this.setState({isImportItinerary:false})}}> {item.name}</a>
                                        </li>)
                                    })}
                                    <li>
                                            <a className="dropdown-item" onClick={()=>{this.addItinerary(0,'Itinerary');setTimeout(()=>{
                                                
                                            this.selectTab('Itinerary');
                                           $(".dropdown-menu").removeClass('show')
                                            },10) }}>Add Itinerary</a>
                                    </li>
                                </ul>:''}
                            </li>}
                            {(this.state.AllTourItineraryData.length>0)?<li className="nav-item dropdown">
                                    <a  onClick={()=>this.selectTab('Costing')} className={`nav-link dropdown-toggle costing ${(this.state.selectedTab=='Costing')?'active':''}`}>
                                    Costing
                                    </a>
                                    <ul id="Costing" className="dropdown-menu">
                                        {this.state.AllTourItineraryData.map((item,key)=>{
                                            return( <li key={`costing-${key}`}>
                                                <a className="dropdown-item" onClick={()=>this.selectItenary(item,'Costing')}> {item.name}</a>
                                            </li>)
                                        })}
                                    </ul>
                                </li>:''} 
                                {(this.state.AllTourItineraryData.length>0)?<li className="nav-item dropdown">
                                    <a  onClick={()=>this.selectTab('Quotation')} className={`nav-link dropdown-toggle costing ${(this.state.selectedTab=='Quotation')?'active':''}`}>
                                    Quotation
                                    </a>
                                    <ul id="Quotation" className="dropdown-menu">
                                    {this.state.AllTourItineraryData.map((item,key)=>{
                                            return( <li key={`Quotation-${key}`}>
                                                <a className="dropdown-item" onClick={()=>this.selectItenary(item,'Quotation')}> {item.name}</a>
                                            </li>)
                                        })}
                                    </ul>
                                </li>:''}
                                {/* {(this.state.AllTourItineraryData.length>0)?<li className="nav-item">
                                    <a  onClick={()=>this.selectTab('clientMailLog')} className={`nav-link  costing ${(this.state.selectedTab=='clientMailLog')?'active':''}`}>
                                   Client Mail Log 
                                    </a>
                                    
                                </li>:''}
                                {(this.state.AllTourItineraryData.length>0)?<li className="nav-item">
                                    <a  onClick={()=>this.selectTab('vendorMailLog')} className={`nav-link  costing ${(this.state.selectedTab=='vendorMailLog')?'active':''}`}>
                                    Vendor Mail Log 
                                    </a>
                                    
                                </li>:''} */}
                                {/* {((this.state.AllTourItineraryData.length>0)!=null)?<li className="nav-item">
                                    <a  onClick={()=>this.selectTab('vendorMailCompose')} className={`nav-link  costing ${(this.state.selectedTab=='vendorMailCompose')?'active':''}`}>
                                    Vendor Mail Compose
                                    </a>
                                    
                                </li>:''}     */}
                            </ul>
                        </div>
                        <div className="col-md-4 d-sm-inline-flex align-items-center justify-content-end">
                        <div className="w-auto pt-2 me-2">  <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="../images/reload.png"/></a> </div>   {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?<div className="w-auto pt-2 me-2">    <button onClick={()=>this.resetForm()} className="btn btn-outlined rounded" type="button">Cancel</button>  </div>:''} {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?<div className="w-auto pt-2  me-2">   <button className="btn btn-primary rounded">  {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?'Save':'Update'}</button>   </div>:''}   <div className="w-auto pt-2 ">    <NavLink to="/tours">   <button type="button" className="btn btn-outlined  rounded"><i className="fa-sharp fa-solid fa-arrow-right"></i>    Tours List</button></NavLink>   </div> </div>        </div>
                </div>
                {(this.state.toursData.length>0)?<ToursFieldFormComponent
                // getToursData={(e)=>this.getToursData(e)}
                  selectedTab={this.state.selectedTab}
                 // travelerData={this.state.travelerData}
                 agencyList={this.state.agencyList}
                 agentList={this.state.agentList}
                  toursData={this.state.toursData}
                  PassengerData={this.state.PassengerData}
                  addPassenger={(e:any) => this.addPassenger(e)}
                  deletePassenger={(e,e2) => this.deletePassenger(e,e2)}
                  PassengerList={this.state.PassengerList}
                  MessagesData={this.state.MessagesData}
                  addMessage={(e:any) => this.addMessage(e)}
                  deleteMessage={(e) => this.deleteMessage(e)}
                  MessagesList={this.state.MessagesList}
                  NotesData={this.state.NotesData}
                  addNotes={(e:any) => this.addNotes(e)}
                  deleteNotes={(e) => this.deleteNotes(e)}
                  NotesList={this.state. NotesList}
                  FlightData={this.state.FlightData}
                  addFlight={(e:any) => this.addFlight(e)}
                  deleteFlight={(e,e2) => this.deleteFlight(e,e2)}
                  FlightList={this.state.FlightList}
                  PaymentData={this.state.PaymentData}
                  addPayment={(e:any) => this.addPayment(e)}
                  deletePayment={(e,e2) => this.deletePayment(e,e2)}
                  PaymentList={this.state.PaymentList}
                  hearedAboutList={this.state.hearedAboutList}
                  appSettingList={this.state.appSettingList}
                  VendorPaymentData={this.state.VendorPaymentData}
                  addVendorPayment={(e:any) => this.addVendorPayment(e)}
                  deleteVendorPayment={(e,e2) => this.deleteVendorPayment(e,e2)}
                  VendorPaymentList={this.state.VendorPaymentList}
                  vendorList={this.state.vendorList}
                  showHideLoder={(e)=>this.showHideLoder(e)}
                  />:''}  
              
                <TourItineraryFieldFormComponent 
                TourItineraryData={this.state.TourItineraryData}
                TourItineraryServiceData={this.state.TourItineraryServiceData}
                addItinerary={(e) => this.addItinerary(e)}
                deleteItinerary={(e,e2) => this.deleteItinerary(e,e2)}
                addItinerarySerice={(e1,e2,e3) => this.postItinerarySerice(e1,e2,e3)}
                deleteItinerarySerice={(e1,e2,e3) => this.deleteItinerarySerice(e1,e2,e3)}
                resetItinerarySerice={()=>this.addItinerarySerice('')}
                serviceList={this.state.serviceList}
                quoteTypeList={this.state.quoteTypeList}
                cityList={this.state.cityList}
                stateList={this.state.stateList}
                countryList={this.state.countryList}
                vendorTypeList={this.state.vendorTypeList}
                vendorList={this.state.vendorList}
                toursId={(ArrayHelper.getValue(this.props.toursSelectedData,'id')!='')?ArrayHelper.getValue(this.props.toursSelectedData,'id'):0}
                 selectedTab={this.state.selectedTab}
                 MessagesData={this.state.MessagesData}
                 MessagesList={this.state.MessagesList}
                 NotesData={this.state.NotesData}
                 NotesList={this.state. NotesList}
                 currency={ArrayHelper.getValue(this.state.toursData,'[0].currency')}
                 fileUSDROE={ArrayHelper.getValue(this.state.toursData,'[0].fileUSDROE')}
                 tourStartDate={ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate')}
                 tourEndDate={ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate')}
                 showHideLoder={(e)=>this.showHideLoder(e)}
                 serviceGSTPercentage={this.state.serviceGSTPercentage}
                 loader={this.state.loader}
                 noofGuest={ArrayHelper.getValue(this.state.toursData,'[0].noOfPax')}
                 isImportItinerary={this.state.isImportItinerary}
                 setIsImportItinerary={(e)=>{this.setState({isImportItinerary:e,selectedItineraryList:[],selectedTourId:''});this.addItinerary(0,'Itinerary')}}
                 toursList={this.props.toursListData}
                 selectedTourId={this.state.selectedTourId}
                 selectedItineraryList={this.state.selectedItineraryList}
                 setChangeTour={(e)=>this.setChangeTour(e)}
                 importItenery={(e)=>this.importItenery(e)}
                 />
                {(this.state.AllTourItineraryData.length>0)?<CostingViewComponent perPersonCost={this.state.perPersonCost} serviceList={this.state.serviceList} itnerayServiceUpdate={(e)=>this.itnerayServiceUpdate(e)}  selectedTab={this.state.selectedTab}  TourItinerarySelected={this.state.TourItineraryData[0]} displayType='Edit'   currency={ArrayHelper.getValue(this.state.toursData,'[0].currency')}/>:''}
                {(this.state.AllTourItineraryData.length>0)?<QuotationViewComponent perPersonCost={this.state.perPersonCost} quotationList={this.state.quotationList}  selectedTab={this.state.selectedTab}  TourItinerarySelected={this.state.TourItineraryData[0]}   currency={ArrayHelper.getValue(this.state.toursData,'[0].currency')}/>:''}
                
                {(this.state.AllTourItineraryData.length>0)?<ClientMailLogViewComponent vendorList={this.state.vendorList} selectedTab={this.state.selectedTab}  toursData={this.state.toursData[0]} />:''}
                {(this.state.AllTourItineraryData.length>0)?<VendorMailLogViewComponent vendorList={this.state.vendorList} selectedTab={this.state.selectedTab}  toursData={this.state.toursData[0]} />:''}
                <div className="text-end p-4">
                <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="../images/reload.png"/></a>  {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?<button className="btn btn-outlined rounded my-3 me-2" type="button">Cancel</button>:''}       {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?<button className="btn rounded btn-primary my-3" type="submit">  {(ArrayHelper.getValue(this.props.toursSelectedData,'id')=='')?'Save':'Update'}</button>:''}      <NavLink to="/tours">   <button type="button" className="btn btn-outlined rounded"><i className="fa-sharp fa-solid fa-arrow-right"></i>    Tours List</button></NavLink>
                 </div>
            </div>
            </form>  
            <AgencyAddComponent getAgencyList={()=>this.getAgencyList()}/>
            <CloneItineraryComponent getItinerary={()=>this.getItinerary()} tourRecordId={ArrayHelper.getValue(this.props.toursSelectedData,'id')} itineraryId={ArrayHelper.getValue(this.state.TourItineraryData,'[0].id')}/>
            <AgentAddComponent getAgentList={()=>this.getAgentList()}/> 
            <ItnerayServiceUpdateComponent
             TourItineraryServiceData={this.state.TourItineraryServiceData}
             postItinerarySerice={() => this.postItinerarySerice(0,'','')}
             serviceList={this.state.serviceList}
                quoteTypeList={this.state.quoteTypeList}
                cityList={this.state.cityList}
                vendorTypeList={this.state.vendorTypeList}
                vendorList={this.state.vendorList}
                fileUSDROE={ArrayHelper.getValue(this.state.toursData,'[0].fileUSDROE')}
                currency={ArrayHelper.getValue(this.state.toursData,'[0].currency')}
                tourStartDate={ArrayHelper.getValue(this.state.toursData,'[0].tourStartDate')}
                tourEndDate={ArrayHelper.getValue(this.state.toursData,'[0].tourEndDate')}
                serviceGSTPercentage={this.state.serviceGSTPercentage}
            />             
            </React.Fragment>
        )
    }
}  

const mapStateToProps = state => {
    return {  
        toursListData : state.settingsData.toursList,   
        serviceListData : state.settingsData.serviceList,
        quoteTypeListData : state.settingsData.quoteTypeList,      
        vendorListData : state.settingsData.vendorList,
        agencyListData : state.settingsData.agencyList,
        agentListData : state.settingsData.agentList,
        vendorTypeListData : state.settingsData.vendorTypeList,
        cityListData : state.settingsData.cityList,
        stateListData : state.settingsData.stateList,
        countryListData : state.settingsData.countryList,
        appSettingListData : state.settingsData.appSettingList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toursListInfo:(data)=>dispatch({type: actionTypesUser.TOURS_LIST,payload:data}),
        serviceListInfo:(data)=>dispatch({type: actionTypesUser.SERVICE_LIST,payload:data}),
        quoteTypeListInfo:(data)=>dispatch({type: actionTypesUser.QUOTE_TYPE_LIST,payload:data}),
        vendorListInfo:(data)=>dispatch({type: actionTypesUser.VENDOR_LIST,payload:data}),
        agencyListInfo:(data)=>dispatch({type: actionTypesUser.AGENCY_LIST,payload:data}),
        agentListInfo:(data)=>dispatch({type: actionTypesUser.AGENT_LIST,payload:data}),
        vendorTypeListInfo:(data)=>dispatch({type: actionTypesUser.VENDOR_TYPE_LIST,payload:data}),
        cityListInfo:(data)=>dispatch({type: actionTypesUser.CITY_LIST,payload:data}),
        stateListInfo:(data)=>dispatch({type: actionTypesUser.STATE_LIST,payload:data}),
        countryListInfo:(data)=>dispatch({type: actionTypesUser.COUNTRY_LIST,payload:data}),
        appSettingListInfo:(data)=>dispatch({type: actionTypesUser.APP_SETTING_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ToursAddRecordComponent);