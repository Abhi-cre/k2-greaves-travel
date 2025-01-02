import React from "react";
import PassengerViewComponent from './PassengerViewComponent';
import {DISPLAYDATEFORMATE} from '../../../helpers/constants';
import {ArrayHelper} from '../../../helpers/arrayhelper';
import {formatDate} from "../../../vendor/datefns";
import MessagesFieldFormComponent from '../toursform/MessagesFieldFormComponent';
import NotesFieldFormComponent from '../toursform/NotesFieldFormComponent';
import FlightViewComponent from './FlightViewComponent';
import PaymentViewComponent from './PaymentViewComponent';
import VendorPaymentViewComponent from './VendorPaymentViewComponent';
const ToursViewComponent = (props) => {
   
    return (<React.Fragment> 
       
        <div className={`borderless-box ${(props.selectedTab!='Tours')?'hide':''}`}>
        <div className="maininfo">
                    <div className="d-flex mb-2 borderBottom">
                        <div className="flex-fill p-1">
                            <label  className="form-label">Lead Traveler Name</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'tourContact[0].name')}</p>
                          
                        </div>
                        <div className="flex-fill p-1 maxWwidth90">
                            <label  className="form-label">PAX Number</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'noOfPax')}</p>
                          
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Email</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'tourContact[0].email')}</p>
                          
                        </div>
                       
                        <div className="flex-fill p-1">
                            <label  className="form-label">Contact Number</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'tourContact[0].personalNo')}</p>
                        </div>
                       
                        <div className="flex-fill p-1">
                            <label  className="form-label">How did you hear about Greaves</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'hearedAbout')}</p>
                           
                           
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">TR Currency</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'currency')}</p>
                         
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">ROE</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'fileUSDROE')}</p>
                          
                        </div>
                    </div>

                    <div className="d-flex  mb-2 borderBottom">
                        <div className="flex-fill p-1">
                            <label  className="form-label">Lead Type</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'leadType')}</p>
                          
                        </div>
                        <div className={`flex-fill p-1 ${(ArrayHelper.getValue(props.toursSelectedData,'leadType')!='Agency')?'show':'hide'}`}>
                            <label  className="form-label">Lead Description</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'leadValue')}</p>
                        </div>
                        <div className={`flex-fill p-1 ${(ArrayHelper.getValue(props.toursSelectedData,'leadType')=='Agency')?'show':'hide'}`}>
                            <label  className="form-label">Agency Name</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'agencyName')}</p>
                           
                        </div>
                        <div className={`flex-fill p-1 ${(ArrayHelper.getValue(props.toursSelectedData,'leadType')=='Agency')?'show':'hide'}`}>
                            <label  className="form-label">Agent name</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'agentName')}</p>
                           
                        </div>
                       
                        <div className={`flex-fill p-1 ${(ArrayHelper.getValue(props.toursSelectedData,'leadType')=='Agency' && ArrayHelper.getValue(props.toursSelectedData,'agentId')!='')?'show':'hide'}`}>
                            <label  className="form-label">Email Address</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'email')}</p>
                          
                        </div>
                        <div className={`flex-fill p-1 ${(ArrayHelper.getValue(props.toursSelectedData,'leadType')=='Agency' && ArrayHelper.getValue(props.toursSelectedData,'agentId')!='')?'show':'hide'}`}>
                        <label  className="form-label">Contact No </label>
                        <p>{ArrayHelper.getValue(props.toursSelectedData,'phone')}</p>
                        </div>
                        
                        <div className="flex-fill p-1">
                            <label  className="form-label">Sales Region</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'salesRegion')}</p>
                                           
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Wetu Link</label>
                            {(ArrayHelper.getValue(props.toursSelectedData,'wetuLink')!='')?<p><a target="_blank" href={ArrayHelper.getValue(props.toursSelectedData,'wetuLink')}>{ArrayHelper.getValue(props.toursSelectedData,'wetuLink').substring(0, 30)}....</a></p>:''}
                         
                        </div>
                        
                        </div>
                        
                        <div className={`d-flex  mb-2 ${(props.NotesList.length>0 || props.MessagesList.length>0)?"borderBottom":''}`}>
                       
                       <div className="flex-fill p-1">
                            <label  className="form-label">Tour Id</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'tourRecordId')}</p>
                        </div>
                       
                        <div className="flex-fill p-1 width220">
                            <label  className="form-label">Tour Name</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'tourName')}</p>
                           
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Tour Start Date:</label>
                            <p>{formatDate(ArrayHelper.getValue(props.toursSelectedData,'tourStartDate'),DISPLAYDATEFORMATE)}</p>
                           
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Tour End Date</label>
                            <p>{formatDate(ArrayHelper.getValue(props.toursSelectedData,'tourEndDate'),DISPLAYDATEFORMATE)}</p>
                          
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Tour Type</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'tourTypeName')}</p>
                                         
                        </div>
                        <div className="flex-fill p-1 dreavesStatus">
                            <label  className="form-label"> Greaves Status</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'greavesStatusName')}</p>
                                           
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Client Status</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'clientStatusName')}</p>
                                           
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Operation Staff</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'gtinConsultantName')}</p>
                                          
                        </div>
                        <div className="flex-fill p-1">
                            <label  className="form-label">Sales Staff</label>
                            <p>{ArrayHelper.getValue(props.toursSelectedData,'gtusConsultantName')}</p>
                                           
                        </div>
                        
                    </div>
                    {(props.NotesList.length>0 || props.MessagesList.length>0)?<div className="row p-1">
                       
                    {(props.NotesList.length>0)?<NotesFieldFormComponent  
                    NotesData={[]}           
                  NotesList={props.NotesList}
                  showField='no'
                  />:''}
                   {(props.MessagesList.length>0)?<MessagesFieldFormComponent  
                     MessagesData={[]}                    
                  MessagesList={props.MessagesList}
                  showField='no'
                  />:''} 
                    
                    </div>:''}

                </div>
                {(props.PassengerData.length>0)?<PassengerViewComponent PassengerData={props.PassengerData}/>:''}
                            {(props.FlightData.length>0)?<FlightViewComponent FlightData={props.FlightData}/>:''}
                            {(props.PaymentData.length>0)?<PaymentViewComponent PaymentData={props.PaymentData}/>:''}    
                {(props.VendorPaymentData.length>0)?<VendorPaymentViewComponent VendorPaymentData={props.VendorPaymentData}/>:''}    

                </div>    
      </React.Fragment>)
}

export default ToursViewComponent;


