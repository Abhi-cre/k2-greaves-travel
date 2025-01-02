import React from "react";
import {ArrayHelper} from "../../helpers/arrayhelper";
const AgentViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="mobileUserView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Mobile User</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr><td>  <strong>Name :</strong> {ArrayHelper.getValue(props.selectedMobileUser,'firstName')} {ArrayHelper.getValue(props.selectedMobileUser,'lastName')} </td></tr>
      <tr><td>  <strong>Email :</strong> {ArrayHelper.getValue(props.selectedMobileUser,'email')}</td> </tr>
      {/* <tr><td>  <strong>Agency Code :</strong> {ArrayHelper.getValue(props.selectedMobileUser,'agencyCode')}</td> </tr> */}
      <tr><td>  <strong>Company :</strong> {ArrayHelper.getValue(props.selectedMobileUser,'company')}</td> </tr>
      <tr><td>  <strong>Phone :</strong> {ArrayHelper.getValue(props.selectedMobileUser,'phone')}</td> </tr>      
      <tr><td>  <strong>WETU Id :</strong> <a href={ArrayHelper.getValue(props.selectedMobileUser,'wetuUrl')} target="_blank">{ArrayHelper.getValue(props.selectedMobileUser,'wetu')}</a></td> </tr>
      
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

