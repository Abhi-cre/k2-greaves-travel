import React from "react";
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypesUser from "../../store/action/settings.action";
import SettingApi from "../../api/Setting.api";
import {ArrayHelper} from "../../helpers/arrayhelper";
import PaginationComponent from "../../components/PaginationComponent";
import {USER_ID} from '../../helpers/constants';
import {addsDays, subsDays,formatDate} from "../../vendor/datefns";
import {ALLOWEDUSER,USER_EMAIL,ISSITESTATUS} from '../../helpers/constants';
import LoaderComponent from "../../components/LoaderComponent";

declare var $;
class ToursListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,toursListAll:[],toursListFilter:[],toursList:[],selectedTours:{},perPage:20,currentPage:1,'keyword':'','startDate':'','endDate':''};
    }
    componentDidMount()
    {
        $("#startDate").datepicker()
        .on("change", (e: any) => {
         $("#endDate").datepicker("option", "minDate", addsDays(e.target.value,1));
         
          this.setState({startDate:e.target.value})
        }); 

        $("#endDate").datepicker()
        .on("change", (e: any) => {
            $("#startDate").datepicker("option", "maxDate", subsDays(e.target.value,1));
            this.setState({endDate:e.target.value})
        });
     let toursListData=this.props.toursListData;
     if(toursListData.length>0)
     {
        let toursList=[];
        for (let i = 0; i < this.state.perPage; i++) {
          
            if (ArrayHelper.getValue(toursListData[i],'id')!='') {                
              toursList.push(toursListData[i]);
            }
        }
      
        this.setState({toursListAll:toursListData,toursListFilter:toursListData,toursList:toursList});
     }
     else
     {
      this.gettoursList()
     }
    
   
     
    }
    gettoursList=async()=>
    {
      
      
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/TourRecord/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
         
          let toursList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'tourRecords')[i],'id')!='') {
                toursList.push(ArrayHelper.getValue(response,'tourRecords')[i]);
              }
          }
          this.setState({loader:false,toursListAll:ArrayHelper.getValue(response,'tourRecords'),toursListFilter:ArrayHelper.getValue(response,'tourRecords'),toursList:toursList});
          this.props.toursListInfo(ArrayHelper.getValue(response,'tourRecords'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
      console.log(this.state.toursListFilter.length)
        if(this.state.toursListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let toursList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.toursListFilter[i],'id')!='') {
            toursList.push(this.state.toursListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), toursList: toursList });
          } else {
              
            let toursList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.toursListFilter[i],'id')!='') {
            toursList.push(this.state.toursListFilter[i]);
          }
        }
       
              this.setState({ toursList: toursList, currentPage: 1 });
          }
        }
        else if(this.props.toursListData.length>0)
        {
          this.setState({ toursList: [], currentPage: 1 });
        }
        }
        
        ToursDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Tours?'))
            {
                this.setState({loader:true})
                
                  
                
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "tourRecordId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/TourRecord/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let toursListAll=this.state.toursListAll;
            toursListAll=toursListAll.filter((item)=>item.id!=str)
            
            let toursList=this.state.toursList.filter((item)=>item.id!=str)
            
              this.setState({loader:false,toursListAll:toursListAll,toursListFilter:toursListAll,toursList:toursList});
              setTimeout(()=>{
                this.props.toursListInfo(toursListAll);
                this.props.history("/tours");
              },10)
                }
            }   
            
        } 
    ToursSelected(e1,e2)
    {
        this.props.toursSelectedInfo(e1); 
       
        if(e2=='edit') 
        {
            this.props.history("/tours/update-record"); 
        }
        else if(e2=='view') 
        {
            this.props.history("/tours/view-record"); 
        }
    } 
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;        
        this.setState({ ...this.state, [name]: value });
        }
    filterTours=async()=>
    {
        this.setState({loader:true})
     let toursListAll=this.state.toursListAll;
     if(this.state.keyword.trim()!='' || this.state.startDate!=''|| this.state.endDate!='')
     {
       let startTime=0;
       let endTime=0;
      if(this.state.startDate!='')
      {
         startTime= (new Date(this.state.startDate)).getTime();

      } 
      if(this.state.endDate!='')
      {
         endTime= new Date(this.state.endDate);

      } 
     let toursListFilter=  toursListAll.filter((item)=>{

        if(item.tourName.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='')
        {
          return item;
        }
        else if(item.tourRecordId.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='')
        {
          return item;
        }
        if(this.state.startDate!='' || this.state.endDate!='')
        { 
            if(this.state.startDate!='' &&this.state.endDate!='')
            { 
                let startTimeData=  (new Date(formatDate(ArrayHelper.getValue(item,'tourStartDate'),'yyyy-MM-dd'))).getTime();
                let endTimeData=  (new Date(formatDate(ArrayHelper.getValue(item,'tourEndDate'),'yyyy-MM-dd'))).getTime();
                if(startTimeData>=startTime && endTime>=endTimeData)
                {
                    return item;
                }  

            }
            if(this.state.startDate!='' && this.state.endDate=='')
            { 
                let startTimeData=  (new Date(formatDate(ArrayHelper.getValue(item,'tourStartDate'),'yyyy-MM-dd'))).getTime();
              
                if(startTimeData>=startTime)
                {
                    return item;
                }         
            }
            if(this.state.endDate!='' && this.state.startDate=="")
            { 
              
                let endTimeData=  (new Date(formatDate(ArrayHelper.getValue(item,'tourEndDate'),'yyyy-MM-dd'))).getTime();
                if(endTime>=endTimeData)
                {
                    return item;
                }         
            }



        }
       
       
      })
      this.setState({toursListFilter:toursListFilter,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/tours"); 
      },10)
     }
     else
     {
      this.clearTours()
     }
    } 
    clearTours()
    {
        this.setState({loader:true})
       this.setState({keyword:'',startDate:'',endDate:'',currentPage:1,toursListFilter:this.state.toursListAll}) 
       setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/tours"); 
      },10)
    }
    reloadWindow()
    {
      window.location.reload(); 
    }  
        
    render(){
      
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
                 <div className="p-4 ms-2">
               
                <div className="row mb-3">
                    <div className="col-md-8">
                        <div className="row g-3 align-items-center">
                            <div className="col-sm-3">
                                    <label>Search </label>
                                <input type="text" name="keyword" value={this.state.keyword} onChange={this.handleChange} className="form-control"  placeholder=""/>
                            </div>
                            <div className="col-sm-2">
                                    <label >Start Date</label>
                                    <input readOnly id="startDate" required type="text" placeholder="Start Date" className="form-control" name="startDate" value={this.state.startDate}/>
                                {/* <input type="date" name="startDate" value={this.state.startDate} onChange={this.handleChange} className="form-control"  placeholder="Start Date"/> */}
                            </div>
                            <div className="col-sm-2">
                                <label >End Date</label>
                                <input readOnly id="endDate" required type="text" placeholder="End Date" className="form-control" name="endDate" value={this.state.endDate}/>
                                {/* <input type="date" name="endDate" value={this.state.endDate} onChange={this.handleChange} className="form-control"  placeholder="End Date"/> */}
                            </div>
                            <div className="col-sm-1 pt-4">
                              <button onClick={()=>this.filterTours()} type="button" className="btn btn-sm btn-secondary rounded">Submit</button>
                            </div>
                            <div className="col-sm-1 pt-4">
                                <button onClick={()=>this.clearTours()} type="button" className="btn btn-sm btn-secondary rounded">Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-end">
                        <br/>
                        <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="images/reload.png"/></a>   {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0 || ISSITESTATUS=='live')?<NavLink to="/tours/add-record"> <button className="btn btn-primary rounded">
                                <i className="fa-sharp fa-solid fa-plus"></i> Add  Tour Record</button></NavLink>:''} 
                    </div>
                </div>
                <div className="borderless-box">
                    <div className="table-responsive">
                    {(this.state.toursList.length>0)?<table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                    <th>S No.</th>
                                    <th>Tour ID</th>
                                    <th>Tour Name</th>
                                    <th>Trip Start Date</th>
                                    <th>Trip End Date</th>
                                    <th>Operation Staff</th>
                                    <th>Sales Staff</th>
                                    <th>Greaves Staus</th>
                                    <th>Client Status</th>
                                    <th>Created By</th>
                                    <th>Created Date</th>
                                    {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<th colSpan="3">Action</th>:<th colSpan="1">Action</th>}
                                </tr>
                                {this.state.toursList.map((item,key)=>{
                                    let greavesStatusClass='text-bg-warning';
                                    if(ArrayHelper.getValue(item,'greavesStatusName')=='Confirmed')
                                    {
                                        greavesStatusClass='text-bg-success';
                                    }
                                    else if(ArrayHelper.getValue(item,'greavesStatusName')=='Travelled')
                                    {
                                        greavesStatusClass='text-bg-primary';
                                    }
                                    let clientStatusClass='text-bg-warning';
                                    if(ArrayHelper.getValue(item,'clientStatusName')=='Confirmed')
                                    {
                                        clientStatusClass='text-bg-success';
                                    }
                                    else if(ArrayHelper.getValue(item,'clientStatusName')=='Travelled')
                                    {
                                        clientStatusClass='text-bg-primary';
                                    }
                                            return( <tr key={`toursList-${key}`}>
                                    <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>
                                    <td>{ArrayHelper.getValue(item,'tourRecordId')}</td>
                                    <td>{ArrayHelper.getValue(item,'tourName')}</td>
                                    <td>{(ArrayHelper.getValue(item,'tourStartDate'))?formatDate(ArrayHelper.getValue(item,'tourStartDate'),'dd MMM yyyy'):''}</td>
                                    <td>{(ArrayHelper.getValue(item,'tourEndDate'))?formatDate(ArrayHelper.getValue(item,'tourEndDate'),'dd MMM yyyy'):''}</td>
                                    <td>{ArrayHelper.getValue(item,'gtinConsultantName')}</td>
                                    <td>{ArrayHelper.getValue(item,'gtusConsultantName')}</td>
                                    <td>
                                        <span className={`badge ${greavesStatusClass}`}>{ArrayHelper.getValue(item,'greavesStatusName')}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${clientStatusClass}`}>{ArrayHelper.getValue(item,'clientStatusName')}</span>
                                    </td>
                                    <td>{ArrayHelper.getValue(item,'createdByName')}</td>
                                    <td>{(ArrayHelper.getValue(item,'createdOn'))?formatDate(ArrayHelper.getValue(item,'createdOn'),'dd MMM yyyy'):''}</td>
                                    {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<td>
                                        {/* <i onClick={()=>this.ToursSelected(item,'edit')} className="fa fa-edit btn text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"></i> */}
                                        <button onClick={() =>this.ToursSelected(item,'edit')}>
                                        <svg fill="#000000" width="18" height="18px" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><path d="M21.561 5.318l-2.879-2.879c-.293-.293-.677-.439-1.061-.439-.385 0-.768.146-1.061.439l-3.56 3.561h-9c-.552 0-1 .447-1 1v13c0 .553.448 1 1 1h13c.552 0 1-.447 1-1v-9l3.561-3.561c.293-.293.439-.677.439-1.061s-.146-.767-.439-1.06zm-10.061 9.354l-2.172-2.172 6.293-6.293 2.172 2.172-6.293 6.293zm-2.561-1.339l1.756 1.728-1.695-.061-.061-1.667zm7.061 5.667h-11v-11h6l-3.18 3.18c-.293.293-.478.812-.629 1.289-.16.5-.191 1.056-.191 1.47v3.061h3.061c.414 0 1.108-.1 1.571-.29.464-.19.896-.347 1.188-.64l3.18-3.07v6zm2.5-11.328l-2.172-2.172 1.293-1.293 2.171 2.172-1.292 1.293z"/></svg>
                                        </button>
                                    </td>:''}
                                    <td>
                                        <i onClick={()=>this.ToursSelected(item,'view')} className="fa fa-eye btn" data-bs-toggle="tooltip" data-bs-placement="top" title="View"></i>
                                        {/* <button className="" onClick={() => this.ToursSelected(item, 'view')}>
                                        <svg fill="#000000" width="18" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/></svg>
                                            </button> */}
                                    </td>
                                    {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<td>
                                        <i onClick={()=>this.ToursDelete(ArrayHelper.getValue(item,'id'))}  className="fa fa-trash btn text-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                        {/* <button onClick={() =>this.ToursDelete(ArrayHelper.getValue(item,'id'))}>
                                        <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/></svg>
                                        </button> */}
                                    </td>:''}
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table>:
                                <p>No Record Found</p>}
                        {(this.state.toursListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.toursListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                    </div>
                </div>

            </div>
               
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
       toursListData : state.settingsData.toursList,
      
    }
};

const mapDispatchToProps = dispatch => {
    return {
       toursListInfo:(data)=>dispatch({type: actionTypesUser.TOURS_LIST,payload:data}),
       toursSelectedInfo:(data)=>dispatch({type: actionTypesUser.TOURS_SELECTED,payload:data}),
       
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ToursListComponent);