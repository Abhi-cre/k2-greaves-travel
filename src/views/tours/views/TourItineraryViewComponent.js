import React from "react";
import TourItineraryServiceViewComponent from './TourItineraryServiceViewComponent';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import MessagesFieldFormComponent from '../toursform/MessagesFieldFormComponent';
import NotesFieldFormComponent from '../toursform/NotesFieldFormComponent';
class TourItineraryViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,TourItineraryData:[]};
    }
    
    render(){
      console.log('this.props.TourItinerarySelected',this.props.TourItinerarySelected)
        return(
          
            <React.Fragment>
                <div className={`border-box ${(this.props.selectedTab!='Itinerary')?'hide':''}`}>
                <div className="maininfo">
                <div className="d-flex mb-2">
                              <div className="flex-fill p-1">
                            <label  className="form-label">Name</label>
                            <p>  {ArrayHelper.getValue(this.props.TourItinerarySelected,'name')}</p>
                          
                               </div>
                             
                               <div className="flex-fill p-1">
                            <label  className="form-label">Primary</label>
                            <p>  {(ArrayHelper.getValue(this.props.TourItinerarySelected,'isPrimary')==true)?'Yes':'No'}</p>
                           
                               </div>
                             
                              </div>
                              <div className="d-flex mb-2">
                            
                               <div className="flex-fill p-1">
                            <label  className="form-label">Special Notes</label>
                            
                            <div className="list-group-item-text mb-0 fs"  dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(this.props.TourItinerarySelected,'comments').replaceAll('\n', '<br/>') }} />
                               </div>
                             
                               </div>
                               <div className="row p-1">
                    {(this.props.NotesList.length>0)?<NotesFieldFormComponent              
                  NotesData={[]}           
                  NotesList={this.props.NotesList}       
                  showField='no'
                  />:''}
                   {(this.props.MessagesList.length>0)?<MessagesFieldFormComponent              
                   MessagesData={[]}                    
                   MessagesList={this.props.MessagesList}        
                  showField='no'
                  />:''} 
                    
                    </div> 
                    <TourItineraryServiceViewComponent
                     serviceList={this.props.serviceList}
                     tourItineraryService={ ArrayHelper.getValue(this.props.TourItinerarySelected,'tourItineraryService')} currency={this.props.currency} ItenararyKey={0}/>           
                </div>    
                        
                        
                   
                   
                </div>
            </React.Fragment>
        )
    }
}  



export default  TourItineraryViewComponent;