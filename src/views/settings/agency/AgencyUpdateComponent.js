import React from "react";
import AgencyFormComponent from './AgencyFormComponent';
class AgencyUpdateComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,'id':'',"name": "","code":'',"message":'',"messageType":''};
    }
    
    
    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="agencyUpdate" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Update Agency</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <AgencyFormComponent formType="update" updatedAgencyList={this.props.updatedAgencyList}  selectedAgency={this.props.selectedAgency}/>
      
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  AgencyUpdateComponent;

