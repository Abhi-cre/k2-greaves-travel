import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {DISPLAYDATEFORMATE} from "../../../helpers/constants";
import {formatDate} from "../../../vendor/datefns";
const AgentViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="agentView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Agent</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr><td>  <strong>Name :</strong>{ArrayHelper.getValue(props.selectedAgent,'title')} {ArrayHelper.getValue(props.selectedAgent,'fname')} {ArrayHelper.getValue(props.selectedAgent,'mname')} {ArrayHelper.getValue(props.selectedAgent,'lname')}</td> <td>  <strong>Agency:</strong> {ArrayHelper.getValue(props.selectedAgent,'agencyName')}</td></tr>
      <tr><td>  <strong>Agent Type :</strong> {ArrayHelper.getValue(props.selectedAgent,'agentTypeName')}</td> <td>  <strong>Contact Channel:</strong> {ArrayHelper.getValue(props.selectedAgent,'agentContactChannelName')}</td></tr>
      <tr><td>  <strong>Courtesy Title:</strong> {ArrayHelper.getValue(props.selectedAgent,'courtesyTitle')}</td> <td>  <strong>DOB:</strong>{(ArrayHelper.getValue(props.selectedAgent,'dob')!='' && ArrayHelper.getValue(props.selectedAgent,'dob')!='1753-01-01T00:00:00')?formatDate(ArrayHelper.getValue(props.selectedAgent,'dob'),DISPLAYDATEFORMATE):''}</td></tr>
      <tr><td colSpan={2}>  <strong>Address :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedAgent,'address').replaceAll('\n','<br/>') }} /></td></tr>
      <tr><td>  <strong>City :</strong> {ArrayHelper.getValue(props.selectedAgent,'cityName')}</td> <td>  <strong>State :</strong> {ArrayHelper.getValue(props.selectedAgent,'stateName')}</td></tr>
      <tr><td>  <strong>Country :</strong> {ArrayHelper.getValue(props.selectedAgent,'countryName')}</td> <td>  <strong>Zip Code  :</strong> {ArrayHelper.getValue(props.selectedAgent,'zip')}</td></tr>
      <tr><td>  <strong>Contact No :</strong> {ArrayHelper.getValue(props.selectedAgent,'contactNo')}</td> <td>  <strong>Email :</strong> {ArrayHelper.getValue(props.selectedAgent,'email')}</td></tr>
      <tr><td colSpan={2}>  <strong>Specialties :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedAgent,'specialties').replaceAll('\n','<br/>') }} /></td></tr>
      </tbody>
      </table>
      </div> 
      </div> 
        
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    
}  




export default  AgentViewComponent;

