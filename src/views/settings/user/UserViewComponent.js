import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
const UserViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="UserView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View User</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr><td>  <strong>Name :</strong>{ArrayHelper.getValue(props.selectedUser,'title')} {ArrayHelper.getValue(props.selectedUser,'firstName')} {ArrayHelper.getValue(props.selectedUser,'lastName')}</td> <td>  <strong>Email:</strong> {ArrayHelper.getValue(props.selectedUser,'email')}</td></tr>
      <tr><td>  <strong>Department :</strong> {ArrayHelper.getValue(props.selectedUser,'departmentName')}</td> <td>  <strong>User Type:</strong> {ArrayHelper.getValue(props.selectedUser,'userType')}</td></tr>
      <tr><td>  <strong>AccountId:</strong> {ArrayHelper.getValue(props.selectedUser,'accountId')}</td> <td>  <strong>Extention:</strong> {ArrayHelper.getValue(props.selectedUser,'extention')}</td></tr>
      
      <tr><td>  <strong>Signature :</strong> {ArrayHelper.getValue(props.selectedUser,'vsignature')}</td> <td></td></tr>
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




export default  UserViewComponent;

