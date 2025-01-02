import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import FlightCityAutoComplete from "../../../components/FlightCityAutoComplete";
import SettingApi from "../../../api/Setting.api";
import {DISPLAYDATEFORMATE} from "../../../helpers/constants";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {addsDays, subsDays,formatDate} from "../../../vendor/datefns";
declare var $;
class FlightFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {airLineList:[],FlightData:[],'selectedKey':'default','id':0,"tourId":0,'airLineId':0,'flightNumber':'','departureLocation':'','departureDate':'','arrivalLocation':'','arrivalDate':'','pnr':'','actionType':'add'};
    }
    componentDidMount()
    {
        this.getAirLineList()
       
        //  this.showDate();
     
    }
    componentWillReceiveProps()
    {
   
      setTimeout(()=>{
       this.showDate();
      },1000)
    }
    showDate()
    {
       
        $("#flightDepartureDate").datepicker()
        .on("change", (e: any) => {
            $("#flightArrivalDate").datepicker("option", "minDate", addsDays(e.target.value,0));
           this.setState({departureDate:e.target.value})
        });
        $("#flightArrivalDate").datepicker()
        .on("change", (e: any) => {
            $("#flightDepartureDate").datepicker("option", "maxDate", subsDays(e.target.value,0));
           this.setState({arrivalDate:e.target.value})
        }); 
    }
    getAirLineList=async()=>
    {
        let airLineListData=this.props.airLineListData;
        if(airLineListData.length>0)
        {
            this.setState({airLineList:airLineListData});
        }
        else
        {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/AirLine/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
          
          this.setState({loader:false,airLineList:ArrayHelper.getValue(response,'airLines')});
          this.props.airLineListInfo(ArrayHelper.getValue(response,'airLines'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    }
    handlePassengerInput(key: string, value: any) {
        if((key=='departureDate'))
                    {
                     
                     this.setState({departureDate:value})
                   
        
                    }
                    if((key=='arrivalDate'))
                    {
                        this.setState({arrivalDate:value})
        
                    }
                    if((key=='confirmationDate'))
                    {
                        this.setState({confirmationDate:value})
        
                    }              
        }
        handleChange = (e) => {
          
            const name = e.target.name;
            let  value = e.target.value; 
            
            this.setState({ ...this.state, [name]: value });
            } 
            addFlightData()
            {
                let error='';  
                if(error=="" && this.state.airLineId=='')
                {
                     alert('Please provide air line.')
                    error='yes';
                 }
                 
                 else if(error=="" && this.state.departureLocation!='' && this.state.departureLocation.length<3)
                {
                     alert('Please provide atleast 3 character of departure location.')
                    error='yes';
                 }
                 else if(error=="" && this.state.arrivalLocation!='' && this.state.arrivalLocation.length<3)
                {
                     alert('Please provide atleast 3 character of arrival location.')
                    error='yes';
                 }
                 else if(error=="" && this.state.pnr!='' && this.state.pnr.length<4)
                {
                     alert('Please provide atleast 4 character of pnr.')
                    error='yes';
                 }
             
                if(error=='')
                {
                if(this.state.actionType=='add')
                {
                    this.props.addFlight({'id':0,"tourId":0,'airLineId':this.state.airLineId,'departureLocation':this.state.departureLocation,'departureDate':this.state.departureDate,'arrivalLocation':this.state.arrivalLocation,'arrivalDate':this.state.arrivalDate,'pnr':this.state.pnr,'flightNumber':this.state.flightNumber}) 
                }
                else
                {
                    if(this.state.selectedKey!='default' && this.state.id==0)
                    {
                      this.props.deleteFlight(this.state.selectedKey,0)
                    }
                    setTimeout(()=>{
                    this.props.addFlight({'id':this.state.id,"tourId":this.state.tourId,'airLineId':this.state.airLineId,'departureLocation':this.state.departureLocation,'departureDate':this.state.departureDate,'arrivalLocation':this.state.arrivalLocation,'arrivalDate':this.state.arrivalDate,'pnr':this.state.pnr,'flightNumber':this.state.flightNumber}) 
                },10)
                }    
               
               setTimeout(()=>{
               
               this.setState({selectedKey:'default','id':'',"tourId":0,'airLineId':0,'departureLocation':'','departureDate':'','arrivalLocation':'','arrivalDate':'','pnr':'','flightNumber':'','actionType':'add'});
               //this.props.addFlight({});
              $("#tourStartDate").datepicker({minDate:addsDays(this.props.tourStartDate,0),maxDate:subsDays(this.props.tourEndDate,0)});
              $("#flightArrivalDate").datepicker({minDate:addsDays(this.props.tourStartDate,0),maxDate:subsDays(this.props.tourEndDate,0)});
               },20)
                }
               
            }  
            EditFlight(item:any,selectedKey:any)  
            {
                this.setState({selectedKey:selectedKey,'id':item.id,"tourId":item.tourId,'airLineId':item.airLineId,'departureLocation':item.departureLocation,'departureDate':(ArrayHelper.getValue(item,'departureDate')!='' && ArrayHelper.getValue(item,'departureDate')!='1900-01-01T00:00:00')?ArrayHelper.getValue(item,'departureDate'):'',
                'arrivalLocation':item.arrivalLocation,'arrivalDate':(ArrayHelper.getValue(item,'arrivalDate')!='' && ArrayHelper.getValue(item,'arrivalDate')!='1900-01-01T00:00:00')?ArrayHelper.getValue(item,'arrivalDate'):''
                ,'pnr':item.pnr,'flightNumber':item.flightNumber
                ,'actionType':'edit'})   
               
            
            } 
            resetValue()
            {
                this.setState({selectedKey:'default','id':'',"tourId":0,'airLineId':0,'departureLocation':'','departureDate':'','arrivalLocation':'','arrivalDate':'','pnr':'','flightNumber':'','actionType':'add'});
            } 
            handleItineraryFlightInput(e1,e2)
            {
              this.setState({ ...this.state, [e1]: e2 });
            }           
    render(){
      
        return(
          
            <React.Fragment>
                <div className="p-3 border mt-2 mb-2 boxAddPassanger">
                <span className="me-2 heading">Add Flight</span>
                <div className="d-flex mb-4">
                            <div className="flex-fill p-1">
                                <label  className="form-label">Air Line</label>
                               
                            <select   value={this.state.airLineId}  name="airLineId"  onChange={this.handleChange} className="form-select form-select-sm">
                                             <option value="">Select Air</option>
                                             {this.state.airLineList.map((item,key)=>{
                                                return(  <option key={`airLineList-${key}`} value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                             })}
                                         </select>                
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Flight Number</label>
                                <input maxLength={10}  type="text" className="form-control form-control-sm" name="flightNumber" 
                                 value={this.state.flightNumber}
                                          onChange={this.handleChange}
                                            placeholder="Enter Flight Number"/>
                            </div>
                            
                            <div className="flex-fill p-1">
                                <label  className="form-label">Departure Location</label>                               
                                             <FlightCityAutoComplete 
                              placeholder={"Enter Departure Location"}
                              value={this.state.departureLocation}
                              name={`departureLocation`} 
                              className="from"
                              select={(event: any) => this.handleItineraryFlightInput('departureLocation', event)}
                              handleUserInput={(event: any) =>this.handleItineraryFlightInput('departureLocation', event.currentTarget.value)}
                              showHideLoder={(e)=>this.props.showHideLoder(e)}
                              emptyState={() => {
                                // this.setState({ 'to': '' }, () => { this.setCityVal('to','') })
                              }}
                            />
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Departure Date</label>
                                <br/>
                                <input onClick={()=>this.showDate()}  id="flightDepartureDate" readOnly type="text" placeholder="Enter Departure Date" className="form-control form-control-sm " name="departureDate" value={formatDate(this.state.departureDate)}/>
                               
                              
                            </div>
                            <div className="flex-fill p-1 ">
                                <label  className="form-label">Arrival Location</label>
                                            <FlightCityAutoComplete 
                              placeholder={"Enter Arrival Location"}
                              value={this.state.arrivalLocation}
                              name={`arrivalLocation`} 
                              className="from"
                              select={(event: any) => this.handleItineraryFlightInput('arrivalLocation', event)}
                              handleUserInput={(event: any) =>this.handleItineraryFlightInput('arrivalLocation', event.currentTarget.value)}
                              showHideLoder={(e)=>this.props.showHideLoder(e)}
                              emptyState={() => {
                                // this.setState({ 'to': '' }, () => { this.setCityVal('to','') })
                              }}
                            />
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Arrival Date</label>
                                <br/>
                                <input onClick={()=>this.showDate()}  id="flightArrivalDate" readOnly type="text" placeholder="Enter Arrival Date" className="form-control form-control-sm " name="arrivalDate" value={formatDate(this.state.arrivalDate)}/>
                             
                               
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">PNR</label>
                                <input maxLength={10}  type="text" className="form-control form-control-sm" name="pnr" 
                                            value={this.state.pnr}
                                            onChange={this.handleChange}
                                            placeholder="Enter PNR"/>
                            </div>
                          
                            
                          
                            <div className="flex-fill p-1">
                                    <button  onClick={()=>this.addFlightData()} type="button" className="btn btn-sm btn-primary rounded mt-4">{(this.state.actionType=='add')?<i className="fa-solid fa-plus"></i>:''}{(this.state.actionType=='edit')?'Update':'Add'} </button>  {(this.state.actionType=='edit')?<button  onClick={()=>this.resetValue()} type="button" className="btn btn-sm btn-outlined rounded mt-4">Reset</button>:''}
                                </div>
                        </div>
                        {(this.props.FlightList.length>0 || this.props.FlightData.length>0)?<div className="table-responsive">
                            <table className="table table-striped rounded border mb-0">
                                <tbody>
                                    <tr>
                                        <th>Air Line</th>
                                        <th>Flight Number</th>
                                        <th>Departure Location</th>
                                        <th>Departure Date</th>
                                      
                                        <th>Arrival Location</th>
                                        <th>Arrival Date</th>
                                        <th>PNR</th> 
                                     
                                        <th className="maxWwidth100">Action</th>
                                    </tr>
                                    {this.props.FlightList.map((item,key)=>{
                                    return(<tr key={`FlightList-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                         <td>{ArrayHelper.getValue(item,'airLineName')}</td>
                                        <td>{ArrayHelper.getValue(item,'flightNumber')}</td>
                                        <td>{ArrayHelper.getValue(item,'departureLocation')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'departureDate')!='' && ArrayHelper.getValue(item,'departureDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'departureDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>{ArrayHelper.getValue(item,'arrivalLocation')}</td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'arrivalDate')!='' && ArrayHelper.getValue(item,'arrivalDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'arrivalDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>{ArrayHelper.getValue(item,'pnr')}</td>
                                           
                                        <td> <i onClick={()=>this.EditFlight(item,key)} className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deleteFlight(key,item.id)} title="Remove"></i></td>
                                    </tr>)
                                    })}
                                    {this.props.FlightData.map((item,key)=>{
                                    return(<tr key={`FlightData-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                        <td>{ArrayHelper.getValue(this.state.airLineList.filter((_item)=>item.airLineId==_item.id),'[0].name')}</td>
                                        <td>{ArrayHelper.getValue(item,'flightNumber')}</td>
                                        <td>{ArrayHelper.getValue(item,'departureLocation')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'departureDate')!='')?formatDate(ArrayHelper.getValue(item,'departureDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>{ArrayHelper.getValue(item,'arrivalLocation')}</td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'arrivalDate')!='')?formatDate(ArrayHelper.getValue(item,'arrivalDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>{ArrayHelper.getValue(item,'pnr')}</td>                                  
                                      
                                        <td> <i  onClick={()=>this.EditFlight(item,key)} className="fa fa-edit btn text-primary" title="Edit"></i>  <i onClick={()=>this.props.deleteFlight(key,item.id)} className="fa fa-trash btn text-danger"></i></td>
                                    </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>:''}
                            </div>
            </React.Fragment>
        )
    }
}  

const mapStateToProps = state => {
    return {
        airLineListData : state.settingsData.airLineList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        airLineListInfo:(data)=>dispatch({type: actionTypesUser.AIR_LINE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(FlightFieldFormComponent);