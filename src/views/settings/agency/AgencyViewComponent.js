import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
const AgencyViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="agencyView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Agency</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr><td>  <strong>Name :</strong> {ArrayHelper.getValue(props.selectedAgency,'name')}</td> <td>  <strong>Agency Type :</strong> {ArrayHelper.getValue(props.selectedAgency,'agnecyTypeName')}</td></tr>
      <tr><td>  <strong>Greaves Office :</strong> {ArrayHelper.getValue(props.selectedAgency,'name')}</td> <td>  <strong>Sales Region :</strong> {ArrayHelper.getValue(props.selectedAgency,'agnecyTypeName')}</td></tr>
      <tr><td>  <strong>Contact No :</strong> {ArrayHelper.getValue(props.selectedAgency,'contactNo')}</td> <td>  <strong>Email :</strong> {ArrayHelper.getValue(props.selectedAgency,'email')}</td></tr>
      <tr><td colSpan={2}>  <strong>Address :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedAgency,'address').replaceAll('\n','<br/>') }} /></td></tr>
      <tr><td>  <strong>City :</strong> {ArrayHelper.getValue(props.selectedAgency,'cityName')}</td> <td>  <strong>State :</strong> {ArrayHelper.getValue(props.selectedAgency,'stateName')}</td></tr>
      <tr><td>  <strong>Country :</strong> {ArrayHelper.getValue(props.selectedAgency,'countryName')}</td> <td> <strong>Zip Code :</strong> {ArrayHelper.getValue(props.selectedAgency,'zip')}</td> </tr>      
      <tr><td colSpan={2}>  <strong>Notes :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedAgency,'notes').replaceAll('\n','<br/>') }} /></td></tr>
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




export default  AgencyViewComponent;

