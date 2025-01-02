import React from "react";
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypesUser from "../../store/action/settings.action";
import ToursFormComponent from "./toursform/ToursFormComponent";
// import AgentTypeAddComponent from './AgentTypeAddComponent';
// import AgentTypeUpdateComponent from './AgentTypeUpdateComponent';
// import SettingApi from "../../../api/Setting.api";
 import {ArrayHelper} from "../../helpers/arrayhelper";
// import PaginationComponent from "../../../components/PaginationComponent";
// import {USER_ID} from '../../../helpers/constants';
class ToursUpdateRecordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,toursSelectedData:{}};
    }
    componentWillMount()
    {
        let toursSelectedData=this.props.toursSelectedData;
     if(ArrayHelper.getValue(toursSelectedData,'id')=='')
     {
        setTimeout(()=>{
            this.props.history("/tours");            
          },1000)
     }
     this.setState({toursSelectedData:toursSelectedData})
    }
   
     
    render(){
      
        return(
          
            <React.Fragment>
                 
                 <ToursFormComponent history={this.props.history} toursSelectedData={this.state.toursSelectedData}/>                 
               
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        toursSelectedData : state.settingsData.toursSelected,
    }
};

const mapDispatchToProps = dispatch => {
    return {
       // agentTypeListInfo:(data)=>dispatch({type: actionTypesUser.AGENT_TYPE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ToursUpdateRecordComponent);