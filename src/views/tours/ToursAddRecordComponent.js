import React from "react";
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypesUser from "../../store/action/settings.action";
import ToursFormComponent from "./toursform/ToursFormComponent";
// import AgentTypeAddComponent from './AgentTypeAddComponent';
// import AgentTypeUpdateComponent from './AgentTypeUpdateComponent';
// import SettingApi from "../../../api/Setting.api";
// import {ArrayHelper} from "../../../helpers/arrayhelper";
// import PaginationComponent from "../../../components/PaginationComponent";
// import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../components/LoaderComponent";
class ToursAddRecordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,agentTypeListAll:[],agentTypeList:[],selectedAgentType:{},perPage:20,currentPage:1};
    }
     
    render(){
      
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
                 <ToursFormComponent history={this.props.history}/>                 
               
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
       // agentTypeListData : state.settingsData.agentTypeList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
       // agentTypeListInfo:(data)=>dispatch({type: actionTypesUser.AGENT_TYPE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ToursAddRecordComponent);