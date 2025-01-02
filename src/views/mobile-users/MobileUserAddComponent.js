import React from "react";
import MobileUserFormComponent from './MobileUserFormComponent';
class MobileUserAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,"name": "","code":'',"message":'',"messageType":''};
    }
    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="mobileUserAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add Mobile User</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <MobileUserFormComponent formType="add" getMobileUserList={this.props.getMobileUserList} selectedMobileUser={this.props.selectedMobileUser}/>
     
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  MobileUserAddComponent;

