import React from "react";
import AgentFormComponent from './AgentFormComponent';
class AgentUpdateComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,'id':'',"name": "","code":'',"message":'',"messageType":''};
    }
    
    
    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="agentUpdate" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Update Agent</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <AgentFormComponent formType="update" updatedAgentList={this.props.updatedAgentList}  selectedAgent={this.props.selectedAgent}/>
      
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  AgentUpdateComponent;

