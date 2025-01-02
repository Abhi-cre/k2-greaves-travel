import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
const SalesGuideViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="salesGuideView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Sales Guide</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr> <td><strong>Name :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'name')}</td> <td>  <strong>Sales Category :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'salesCategoryName')}</td> </tr>
      <tr> <td>  <strong>Rating :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'rating')}</td> <td>  <strong>Position:</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'position')}</td> </tr>
      <tr> <td>  <strong>Web Reference :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'webReference')}</td> <td>  <strong>City :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'cityName')}</td> </tr>
      <tr> <td>  <strong>State :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'stateName')}</td> <td>  <strong>Region :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'region')}</td> </tr>
      <tr> <td colSpan={2}>  <strong>Country :</strong> {ArrayHelper.getValue(props.selectedSalesGuide,'countryName')}</td> </tr>
      
      </tbody>
      </table>
      </div> 
      </div> 
        
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    
}  




export default  SalesGuideViewComponent;

