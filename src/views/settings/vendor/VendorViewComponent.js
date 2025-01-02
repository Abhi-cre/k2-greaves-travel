import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
const VendorViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="vendorView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Vendor</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr><td>  <strong>Name :</strong> {ArrayHelper.getValue(props.selectedVendor,'vendorName')}</td> <td>  <strong>Vendor Type :</strong> {ArrayHelper.getValue(props.selectedVendor,'vendorTypeName')}</td></tr>      
      <tr><td colSpan={2}>  <strong>Address :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedVendor,'address').replaceAll('\n','<br/>') }} /></td></tr>
      <tr> <td>  <strong>State :</strong> {ArrayHelper.getValue(props.selectedVendor,'stateName')}</td><td>  <strong>City :</strong> {ArrayHelper.getValue(props.selectedVendor,'cityName')}</td></tr>
      <tr><td>  <strong>Country :</strong> {ArrayHelper.getValue(props.selectedVendor,'countryName')}</td> <td>  <strong>Zip Code :</strong> {ArrayHelper.getValue(props.selectedVendor,'zip')}</td></tr>
      <tr><td>  <strong>Primary Contact No :</strong> {ArrayHelper.getValue(props.selectedVendor,'primaryContactNo')}</td> <td>  <strong>Email Address :</strong> {ArrayHelper.getValue(props.selectedVendor,'email')}</td></tr>
      <tr><td>  <strong>Phone:</strong> {ArrayHelper.getValue(props.selectedVendor,'phone')}</td> </tr>
     
      {/* <tr><td colSpan={2}>  <strong>Notes :</strong> <div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedVendor,'notes').replaceAll('\n','<br/>') }} /></td></tr> */}
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




export default  VendorViewComponent;

