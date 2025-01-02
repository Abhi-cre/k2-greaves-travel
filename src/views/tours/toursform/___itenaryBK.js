import React from "react";
import TourItineraryServiceFieldComponent from './TourItineraryServiceFieldComponent';
import $ from 'jquery'; 
class TourItineraryFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,TourItineraryData:[]};
    }
    handleItineraryInput(index: number, key: string, value: any) {
       
this.setState({
    TourItineraryData:  this.props.TourItineraryData.map((item: any, k: number) => {                
        if (index == k) {
            item[key] = value;
            if(key=='isPrimary' && value=='Yes')
            {
                $('.isPrimaryId').attr('checked', false);
                $('#isPrimaryId_'+index).attr('checked', true);
            }
        }
        else
        {
           if(value=='Yes' && key=='isPrimary')
           {
            item['isPrimary'] = false;
           } 
        }

        return item;
    })
});
}
    render(){
      
        return(
          
            <React.Fragment>
                <div className={`borderless-box ${(this.props.selectedTab!='Itinerary')?'hide':''}`}>
                    {this.props.TourItineraryData.map((item,key)=>{                
                    return(<div key={`internary-${key}`} className="accordion border-0 pt-3 " id={`accordionExample-${key}`}>
                        <div className="accordion-item">
                            
                            <h2 className="accordion-header" id={`headinginternary-${key}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseinternary-${key}`} aria-expanded="true" aria-controls={`collapseinternary-${key}`}>
                                Itinerary {key+1}:
                                </button>
                               
                            </h2>
                            <div id={`collapseinternary-${key}`} className="accordion-collapse collapse show" aria-labelledby={`headinginternary-${key}`} data-bs-parent={`#accordionExample-${key}`}>
                                <div className="accordion-body pb-4">
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                                            <input  className="form-control form-control-sm" type="text"
                        id={`nameld_${key}`}
                        name={`itinerary[${key}].name`} 
                        value={item.name}
                        onChange={(event: any) => this.handleItineraryInput(key, 'name', event.currentTarget.value)}
                        placeholder="Name"/>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Sub Title</label>
                                            <input  className="form-control form-control-sm" type="text"
                        id={`subtitleld_${key}`}
                        name={`itinerary[${key}].subtitle`} 
                        value={item.subtitle}
                        onChange={(event: any) => this.handleItineraryInput(key, 'subtitle', event.currentTarget.value)}
                        placeholder="Sub Title"/>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Primary</label>
                                            <br/>
                                            {(item.isPrimary==true)?<input checked  className="isPrimaryId" type="radio"
                        id={`isPrimaryId_${key}`}
                        name={`itinerary[${key}].isPrimary`} 
                        value={item.isPrimary}
                        onChange={(event: any) => this.handleItineraryInput(key, 'isPrimary', 'Yes')}/>:<input  className="isPrimaryId" type="radio"
                        id={`isPrimaryId_${key}`}
                        name={`itinerary[${key}].isPrimary`} 
                        value={item.isPrimary}
                        onChange={(event: any) => this.handleItineraryInput(key, 'isPrimary', 'Yes')}/>}
                        
                        Yes {(item.isPrimary==false)?<input   type="radio"
                       checked
                        name={`itinerary[${key}].isPrimary`} 
                        value={item.isPrimary}
                        onChange={(event: any) => this.handleItineraryInput(key, 'isPrimary', 'No')}/>:<input   type="radio"
                       
                        name={`itinerary[${key}].isPrimary`} 
                        value={item.isPrimary}
                        onChange={(event: any) => this.handleItineraryInput(key, 'isPrimary', 'No')}/>} No
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Description</label>
                                            <textarea  className="form-control form-control-sm" 
                        id={`descriptionld_${key}`}
                        name={`itinerary[${key}].description`} 
                        value={item.description}
                        onChange={(event: any) => this.handleItineraryInput(key, 'description', event.currentTarget.value)}
                        rows="3"
                        placeholder="Description"/>
                                       </div>
                                       <div className="col-md-12 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Comments</label>
                                            <textarea  className="form-control form-control-sm" 
                        id={`commentsld_${key}`}
                        name={`itinerary[${key}].comments`} 
                        value={item.comments}
                        onChange={(event: any) => this.handleItineraryInput(key, 'comments', event.currentTarget.value)}
                        rows="3"
                        placeholder="Comments"/>
                                       </div>
                                       <div className="col-md-12 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Notes From</label>
                                            <textarea  className="form-control form-control-sm" 
                        id={`notesFromld_${key}`}
                        name={`itinerary[${key}].notesFrom`} 
                        value={item.notesFrom}
                        onChange={(event: any) => this.handleItineraryInput(key, 'notesFrom', event.currentTarget.value)}
                        rows="3"
                        placeholder="Notes From"/>
                                       </div>
                                      
                                    </div>
                                </div>
                           
                          
                       
                        {(item.tourItineraryService.length>0)?<TourItineraryServiceFieldComponent  serviceList={this.props.serviceList}
                     quoteTypeList={this.props.quoteTypeList}
                     vendorTypeList={this.props.vendorTypeList}
                     vendorList={this.props.vendorList}
                     tourItineraryService={item.tourItineraryService} ItenararyKey={key} addItinerarySerice={() => this.props.addItinerarySerice(key,this.props.toursId,item.id)} deleteItinerarySerice={(e,e2) => this.props.deleteItinerarySerice(key,e,e2)}/>:''}
                        </div>  
                        </div>
                        {(key>0)?<div className="col-auto mt-4 txt-right text-danger cursourPointer" onClick={() => this.props.deleteItinerary(key,item.id)}><button type="button" className="btn removeInternary rounded"><i className="fa-solid fa-trash"></i> Itinerary Remove</button></div>:''} 
                    </div>)
                     })}
                   <div className="col-auto txt-right mt-4">
                                            <button onClick={()=>this.props.addItinerary(this.props.toursId)} type="button" className="btn addInternary rounded"><i className="fa-solid fa-plus"></i> Add Itinerary</button>
                                        </div>
                </div>
            </React.Fragment>
        )
    }
}  



export default  TourItineraryFieldFormComponent;