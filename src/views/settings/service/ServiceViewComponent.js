import React from "react";
import {DISPLAYDATEFORMATE} from "../../../helpers/constants";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {formatDate} from "../../../vendor/datefns";
import {USER_ID,MEALPLANLIST} from '../../../helpers/constants';
const ServiceViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="agencyView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Service</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="row CreateTrip"  >
                           
                            <div className="col-md-4">
                                  <div className="mb-3">
                                      <label  className="form-label">Vendor Type</label>
                                      <select disabled className="form-select form-noradious" name="vendorTypeId" value={ArrayHelper.getValue(props.selectedService,'vendorTypeId')}>
                                        
                                      <option value="">Select Vendor Type</option>
                                      {props.vendorTypeList.map((item,key)=>{
                                        return(<option  key={`vendorTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label  className="form-label">Vendor </label>
                                      <select disabled className="form-select form-noradious" name="vendorId" value={ArrayHelper.getValue(props.selectedService,'vendorId')}  >
                                        
                                      <option value="">Select Vendor</option>
                                      {props.vendorList.map((item,key)=>{
                                        return(<option  key={`greavesOfficeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'vendorName')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-4">
                                <div className="mb-3">
                                    <label  className="form-label"> Name </label>
                                    <input disabled  type="text" className="form-control form-noradious" name="name" value={ArrayHelper.getValue(props.selectedService,'name')}/>
                                  
                                </div>
                            </div>
                              {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">  Notes </label>
                                    <textarea disabled maxLength={250}   type="text" className="form-control form-noradious" name="notes" value={ArrayHelper.getValue(props.selectedService,'notes')}/>
                                </div>
                            </div>:''}
                           
                            
                            {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Start Date </label>
                                    <br/>
                                          <input disabled id="" required type="text"  className="serviceStartDate form-control" name="startDate" value={(ArrayHelper.getValue(props.selectedService,'serviceFeeDetails[0].startDate')!='' && ArrayHelper.getValue(props.selectedService,'serviceFeeDetails[0].startDate')!='0001-01-01T00:00:00')?formatDate(ArrayHelper.getValue(props.selectedService,'serviceFeeDetails[0].startDate'),'yyyy-MM-dd'):''}/>
                                   
                                  
                                </div>
                            </div>:''}
                            {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> End Date </label>
                                    <br/>

                                           <input disabled id="" required type="text"  className="form-control serviceEndDate" name="endDate" value={(ArrayHelper.getValue(props.selectedService,'serviceFeeDetails[0].endDate')!='' && ArrayHelper.getValue(props.selectedService,'serviceFeeDetails[0].endDate')!='0001-01-01T00:00:00')?formatDate(ArrayHelper.getValue(props.selectedService,'serviceFeeDetails[0].endDate'),'yyyy-MM-dd'):''}/>
                                  
                                   
                                </div>
                            </div>:''}
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Service Fee Details </label>
                                 <hr/>
                                </div>
                            </div>
                            {(ArrayHelper.getValue(props.selectedService,'serviceFeeDetails').length>0)?<div  className="col-md-12">
                            {ArrayHelper.getValue(props.selectedService,'serviceFeeDetails').map((item: any, key: number) => {
                                if(item.isContractedRate==true)
                                {
                                    item.isContractedRate=1;
                                }
                                else if(item.isContractedRate==false)
                                {
                                    item.isContractedRate=0;
                                }
                                return( <div key={`ans-${key}`} className="row">
                                
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=4 && ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<div className="col-md-2">
                                    <div className="mb-3">
                                        <label  className="form-label">{(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==2)?'Vehicle Name':'Fee Name'} </label>
                                        <input disabled maxLength={50} required  type="text"   className="form-control form-noradious" name="description" value={item.description}  placeholder="Enter Fee Name"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Rate </label>
                                        <input disabled maxLength={10} required  type="text"   className="form-control form-noradious" name="rate" value={item.rate}  placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekday Rate Single </label>
                                        <input disabled maxLength={10} required  type="text"   className="form-control form-noradious" name="rate" value={item.weekdayRateSingle}  placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekday Rate Double </label>
                                        <input disabled maxLength={10} required  type="text"   className="form-control form-noradious" name="rate" value={item.weekdayRateDouble}  placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekend Rate Single </label>
                                        <input disabled maxLength={10} required  type="text"   className="form-control form-noradious" name="rate" value={item.weekendRateSingle}  placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">Weekend Rate Double </label>
                                        <input disabled maxLength={10} required  type="text"   className="form-control form-noradious" name="rate" value={item.weekendRateDouble}  placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-2">
                                <div className="mb-3">
                                    <label  className="form-label"> Start Date </label>
                                    <br/>
                               
                                          <input disabled  required type="date" placeholder="Enter Start Date" className="serviceStartDate form-control" name="startDate"   value={(item.startDate!='' && item.startDate!='0001-01-01T00:00:00')?formatDate(item.startDate,'yyyy-MM-dd'):''}/>
                                   
                                  
                                </div>
                            </div>:''}
                            {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-2">
                                <div className="mb-3">
                                    <label  className="form-label"> End Date </label>
                                    <br/>

                                           <input disabled type="date"  placeholder="Enter End Date" className="form-control serviceEndDate" name="endDate"   value={(item.endDate!='' && item.endDate!='0001-01-01T00:00:00')?formatDate(item.endDate,'yyyy-MM-dd'):''}/>
                                  
                                   
                                </div>
                            </div>:''}
                               
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Break Fast (<span>&#8377;</span>) </label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="breakFast" value={item.breakFast}  placeholder="Enter Break Fast amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Lunch (<span>&#8377;</span>) </label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="lunch" value={item.lunch}  placeholder="Enter Lunch amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Dinner (<span>&#8377;</span>) </label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="dinner" value={item.dinner}  placeholder="Enter Dinner amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Jungle Safari (<span>&#8377;</span>) </label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="jungleSafari" value={item.jungleSafari} />
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Meal Plan </label>
                                        <select disabled required className="form-select form-select-sm"  name="mealPlan" value={item.mealPlan} >
                                                  <option value="">Select Meal Plan</option>
                                                  {MEALPLANLIST.map((item,key)=>{
                                                    return(<option key={`mealplan-${key}`} value={item}>{item}</option>) 
                                                  })}
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">Is MD Lunch </label>
                                        <select disabled className="form-select form-select-sm"  name="isMandatoryLunch" value={item.isMandatoryLunch} >
                                                  <option value="0">No</option> 
                                                  <option value="1">Yes</option>                                                
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1 && item.isMandatoryLunch==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">  MD Lunch (<span>&#8377;</span>)</label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="mandatoryLunch" value={item.mandatoryLunch} />
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">Is MD Dinner </label>
                                        <select disabled className="form-select form-select-sm"  name="isMandatoryDinner" value={item.isMandatoryDinner} >
                                                  <option value="0">No</option> 
                                                  <option value="1">Yes</option>                                                
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1 && item.isMandatoryDinner)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> MD Dinner (<span>&#8377;</span>)</label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="mandatoryDinner" value={item.mandatoryDinner} />
                                       
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Ext.  Adult(<span>&#8377;</span>) </label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="extraAdult12Above" value={item.extraAdult12Above} />
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Ext.  Child(<span>&#8377;</span>) </label>
                                        <input disabled maxLength={10} required  type="text" className="form-control form-noradious" name="extraAdultUpto12" value={item.extraAdultUpto12} />
                                      
                                    </div>
                                </div>:''}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Contracted Rate </label>
                                        <select disabled required className="form-select form-select-sm"  name="isContractedRate" value={item.isContractedRate}>
                                                  <option value="0">No</option> 
                                                  <option value="1">Yes</option>                                                
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {/* {(this.state.vendorTypeId!=4)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Currency </label>
                                        <input maxLength={3} required  type="text" className="form-control form-noradious" name="currency" value={item.currency} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'currency')} placeholder="Enter Currency"/>
                                      
                                    </div>
                                </div>:''} */}
                                {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<div className="col-md-6">
                                    <div className="mb-3">
                                        <label  className="form-label"> Notes </label>
                                        <textarea disabled maxLength={250}   type="text" className="form-control form-noradious" name="notes" value={item.notes} />
                                        
                                      
                                    </div>
                                </div>:''}
                              
                                
                                
                                <div className="col-md-12"><hr/></div>
                                </div>)
                                })}
                                </div>:''}
                                                 
                       
                           
                        </div>
      {/* <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr><td>  <strong>Name :</strong> {ArrayHelper.getValue(props.selectedService,'name')}</td> <td>  <strong>Vendor  Type :</strong> {ArrayHelper.getValue(props.selectedService,'vendorType')}</td></tr>
      <tr><td colSpan={2}>  <strong>Vendor :</strong> {ArrayHelper.getValue(props.selectedService,'vendorName')}</td></tr>
      
      {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<tr><td colSpan={2}>  <strong>Notes :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedService,'notes').replaceAll('\n','<br/>') }} /></td></tr>:''}
      
      {(ArrayHelper.getValue(props.selectedService,'serviceFeeDetails',[]).length>0)?<tr><td colSpan={2}>  <strong>Service Fee Details :</strong>  <hr/>
      {ArrayHelper.getValue(props.selectedService,'serviceFeeDetails').map((item: any, key: number) => {
                                return(<div key={`ans-${key}`}>
{(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=4 && ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=1)?<p><strong>{(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==2)?'Vehicle Name':'Fee Name'} :</strong> {ArrayHelper.getValue(item,'description')}</p>:''}
                                  <p><strong>Rate :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'rate')}</p>
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=4)?<p><strong>Markup Percentage :</strong> {ArrayHelper.getValue(item,'markupPercentage')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')!=4)?<p><strong>Markup Amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'markupAmount')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Break Fast Amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'breakFast')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Lunch Amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'lunch')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Dinner Amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'dinner')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Jungle Safari Amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'jungleSafari')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Meal Plan :</strong> {ArrayHelper.getValue(item,'mealPlan')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Mandatory Lunch :</strong>{ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'mandatoryLunch')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Mandatory Dinner :</strong>{ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'mandatoryDinner')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Extra  Adult(12+) amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'extraAdult12Above')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Extra  Child(up to 12) amount :</strong> {ArrayHelper.getValue(item,'currency')} {ArrayHelper.getValue(item,'extraAdultUpto12')}</p>:''}
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Is Contracted Rate :</strong> {(ArrayHelper.getValue(item,'isContractedRate')==true)?'Yes':'No'}</p>:''}
                                 
                                  {(ArrayHelper.getValue(props.selectedService,'vendorTypeId')==1)?<p><strong>Notes :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(item,'notes').replaceAll('\n','<br/>') }} /></p>:''}

      </div>)
      })}
      </td>
       </tr>:''}
     
      </tbody>
      </table>
      </div> 
      </div>  */}
        
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    
}  




export default  ServiceViewComponent;

