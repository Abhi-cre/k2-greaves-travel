import React from "react";
import UserFormComponent from './UserFormComponent';
class UserUpdateComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,'id':'',"name": "","code":'',"message":'',"messageType":''};
    }
    
    
    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="UserUpdate" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Update User</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <UserFormComponent formType="update" updatedUserList={this.props.updatedUserList}  selectedUser={this.props.selectedUser}/>
      
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  UserUpdateComponent;

