import React from "react";
import {connect} from 'react-redux';
import * as actionTypes from '../../store/action/ticket.action';

import {ArrayHelper} from '../../helpers/arrayhelper';
class TopNevigationBarFilterComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {serachKeyword:'',serachBy:'',moveTo:'',copyTo:'',folderList:[]};
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;
        this.setState({ ...this.state, [name]: value });
        if(name=='serachKeyword' && value!='')
        {
          setTimeout(()=>{
            this.setState({serachBy:''})
          },10)
        }
        
    
      if(name=='serachBy' && value!='' && value!='SearchFlaggedMail' && this.state.serachKeyword=='')
      {
          alert('Please enter the value of searching keyword.');
          this.setState({serachBy:''})
      }
      else if((name=='serachBy' && value!='' && this.state.serachKeyword!='') ||(name=='serachBy'  && value=='SearchFlaggedMail'))
      {
     
        setTimeout(()=>{
          this.props.searchingEmail(this.state.serachKeyword,this.state.serachBy)
        })
      }
      else if(name=='moveTo' && value!='')
      {
     
        setTimeout(()=>{
          this.props.moveMailToFolder(this.state.moveTo,'')
        })
      }
      else if(name=='copyTo' && value!='')
      {
     
        setTimeout(()=>{
          this.props.copyMailToFolder(this.state.copyTo,'')
        })
      }
      }
      componentWillReceiveProps(nextProps) {
       
        if(nextProps.serachBy=='folders')
        {
         this.setState({serachKeyword:'',serachBy:'',moveTo:'',copyTo:''})  
        }
       
        let folderList=this.props.folderList.filter((item)=>item.displayName!=this.props.displayName);
        this.setState({folderList:folderList})
       }
    render(){
        return(
            <React.Fragment>
            <nav className="navbarnavFilter navbar-expand-lg p-0 bg-white">
                <button className="navbar-toggler moreFilters" type="button" data-bs-toggle="collapse" data-bs-target="#navFilter"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    More Filter
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <div className="collapse navbar-collapse" id="navFilter">
                    <div className="navFilterRight">
                        <div className="flex-fill nofill">
                            <div className="emailRel mb-2">
                            <input type="text" onChange={this.handleChange} value={this.state.serachKeyword} name="serachKeyword" className="form-control" id="iconLeft4" placeholder="Search keyword"/>
                               
                            </div>
                            
                        </div>
                        <div className="flex-fill fixed-fill">
                            <select onChange={this.handleChange} value={this.state.serachBy} name="serachBy" className="form-select select-dark" aria-label="Default select example">
                                <option  value="">Search By</option>
                                <option value="SearchMailFromMailAddress">From Mail Address</option>
                                <option value="SearchMailByContent">Mail By Content</option>
                                <option value="SearchMailBySubject">Mail By Subject</option>
                                <option value="SearchMailHasAttachment">Mail Has Attachment</option>
                                <option value="SearchFlaggedMail">Flagged Mail</option>
                            </select>
                        </div>
                        <div className="flex-fill fixed-fill">
                            <select onChange={this.handleChange} value={this.state.moveTo} name="moveTo" className="form-select topselectBox" aria-label="Default select example">
                                <option  value="">Move to</option>
                                {this.state.folderList.map((item,key)=>{
                                    return(<option key={`folder-${key}`} value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'displayName')}</option>)
                                })}
                              
                            </select>
                        </div>
                        <div className="flex-fill fixed-fill">
                            <select onChange={this.handleChange} value={this.state.copyTo} name="copyTo"  className="form-select topselectBox" aria-label="Default select example">
                                <option  value="">Copy to</option>
                                {this.state.folderList.map((item,key)=>{
                                    return(<option key={`foldercopy-${key}`} value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'displayName')}</option>)
                                })}
                            </select>
                        </div>
                        <div className="flex-fill">
                            <a onClick={()=>{this.props.searchingEmail('','SearchMailHasAttachment');this.setState({serachBy:'SearchMailHasAttachment'})}}>
                                <span className="button-outline">
                                    <i className="fa-solid fa-paperclip"></i>
                                </span>
                            </a>
                        </div>
                        <div className="flex-fill">
                            <a onClick={()=>{this.props.MarkReadEmail()}} title="Mark as Read">
                                <span className="button-outline">
                                    <i className="fa-solid fa-envelope-open"></i>
                                </span>
                            </a>
                        </div>
                        <div className="flex-fill">
                            <a onClick={()=>{this.props.MarkUnReadEmail()}} title="Mark as Unread">
                                <span className="button-outline">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                            </a>
                        </div>
                        <div className="flex-fill">
                            <a onClick={()=>{this.props.MailImportance()}}>
                                <span className="button-outline">
                                    <i className="fa-solid fa-exclamation text-danger"></i>
                                </span>
                            </a>
                        </div>
                        <div className="flex-fill">
                            <a href="#">
                                <span className="button-outline">
                                    <i className="fa-solid fa-trash"></i>
                                </span>
                            </a>
                        </div>
                        <div className="flex-fill">
                            <span className="button-outline nextprev">
                               {(this.props.page>1)?<a onClick={()=>this.props.nextPrev((parseInt(this.props.page) - 1))} href="#" className="d-inline-block">
                               <i className="fa-solid fa-angle-left"></i>
                                </a>:<a  className="d-inline-block cusourseFalse">
                                    <i className="fa-solid fa-angle-left disableColor"></i>
                                </a>} 
                                {(this.props.displayNext==true)?<a  onClick={()=>this.props.nextPrev((parseInt(this.props.page) + 1))} className="d-inline-block">
                                    <i className="fa-solid fa-angle-right"></i>
                                </a>:<a   className="d-inline-block cusourseFalse">
                                    <i className="fa-solid fa-angle-right disableColor"></i>
                                </a>}
                            </span>
                        </div>
                        <div className="flex-fill nofill">
                            Last Record (Days)
                        </div>
                        <div className="flex-fill fixed-fill">
                            <select className="form-select  select-dark" aria-label="Default select example">
                                <option  value="1">6</option>
                                <option value="1">6</option>
                                <option value="2">10</option>
                            </select>
                        </div>
                        
                        <div className="flex-fill fixed-fill">
                            <select className="form-select form-filter  select-dark" aria-label="Default select example">
                                <option  value="1">Sort By</option>
                                <option value="1">6</option>
                                <option value="2">10</option>
                            </select>
                        </div>
                        


                    </div>
                </div>
            </nav>
            </React.Fragment>
        )
    }
}  


const mapStateToProps = state => {
    return {
        //selectedTicketData : state.ticketList.selectedTicket,
    }
  };
  
  const mapDispatchToProps = dispatch => {
    return { 
  //selectedTicketProps : (dataval) => dispatch({type:actionTypes.SELECTED_TICKET,payload:dataval})
    }
  };
  
  export default  connect(mapStateToProps, mapDispatchToProps)(TopNevigationBarFilterComponent);