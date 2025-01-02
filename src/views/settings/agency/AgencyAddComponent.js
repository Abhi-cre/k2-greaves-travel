import React from "react";
import AgencyFormComponent from './AgencyFormComponent';
class AgencyAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,"name": "","code":'',"message":'',"messageType":''};
    }
    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="agencyAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add Agency</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <AgencyFormComponent formType="add" getAgencyList={this.props.getAgencyList} selectedAgency={this.props.selectedAgency}/>
     
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  AgencyAddComponent;

