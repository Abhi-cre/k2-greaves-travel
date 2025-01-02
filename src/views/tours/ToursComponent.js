import React,{Suspense,lazy } from "react";
import {
    Route,
    Routes
  } from "react-router-dom";
  const ToursListComponent = lazy(() => import('./ToursListComponent'));
  const ToursAddRecordComponent= lazy(() => import('./ToursAddRecordComponent'));
  const ToursUpdateRecordComponent= lazy(() => import('./ToursUpdateRecordComponent'));
  const ToursViewRecordComponent =  lazy(() => import('./ToursViewRecordComponent'));
class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
     
        return(
            <React.Fragment> 
                <div className=" tab-content innerPage">
    {(this.state.token!==null)?<div className="toursDisplay">    
                <Suspense fallback={<div className="row">
  <div className="load"><img src="images/ajax-loader.gif" alt="" /> </div> 
</div>}>
                <Routes>                
                <Route   path="/"  element={<ToursListComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/add-record"  element={<ToursAddRecordComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/update-record"  element={<ToursUpdateRecordComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/view-record"  element={<ToursViewRecordComponent params={this.props.params} history={this.props.history}/>}/>
                </Routes>
                </Suspense>
                </div>:''}
                </div>
            </React.Fragment>
        )
    }
}  


export default  SettingsComponent;