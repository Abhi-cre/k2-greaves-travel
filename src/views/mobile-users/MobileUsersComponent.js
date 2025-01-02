import React,{Suspense} from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../store/action/settings.action";
import MobileUserAddComponent from './MobileUserAddComponent';
import MobileUserUpdateComponent from './MobileUserUpdateComponent';
import MobileUserViewComponent from './MobileUserViewComponent';
import SettingApi from "../../api/Setting.api";
import {ArrayHelper} from "../../helpers/arrayhelper";
import PaginationComponent from "../../components/PaginationComponent";
import {ALLOWEDUSER,USER_EMAIL,ISSITESTATUS,USER_ID} from '../../helpers/constants';
import LoaderComponent from "../../components/LoaderComponent";
class MobileUsersComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,mobileUserListAll:[],mobileUserListFilter:[],mobileUserList:[],selectedMobileUser:{},perPage:20,currentPage:1,fullName:'',email:'',company:'',phone:''};
    }
    componentDidMount()
    {
     
     let mobileUserListData=this.props.mobileUserListData;
     if(mobileUserListData.length>0)
     {
        let mobileUserList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(mobileUserListData[i],'travelerID')!='') {
                mobileUserList.push(mobileUserListData[i]);
            }
        }
        
        this.setState({mobileUserListAll:mobileUserListData,mobileUserListFilter:mobileUserListData,mobileUserList:mobileUserList});
     }
     else
     {
      this.getMobileUserList()
     }
     
    }
    getMobileUserList=async()=>
    {
        this.setState({loader:true});
        let formData={
            "travelerID": ""
          }
      let response= await SettingApi.PostSettingList(formData,'/api/AppUser/List');
     
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            let mobileUserData=ArrayHelper.getValue(response,'appUsers').map((Item)=>{
                Item.fullName=Item.firstName+' '+Item.lastName;
                return Item;
            })
          let mobileUserList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(mobileUserData[i],'travelerID')!='') {
                mobileUserList.push(mobileUserData[i]);
              }
          }
          
          this.setState({loader:false,mobileUserListAll:mobileUserData,mobileUserListFilter:mobileUserData,mobileUserList:mobileUserList});
          this.props.mobileUserListInfo(mobileUserData);
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.mobileUserListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let mobileUserList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.mobileUserListFilter[i],'travelerID')!='') {
            mobileUserList.push(this.state.mobileUserListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), mobileUserList: mobileUserList });
          } else {
              
            let mobileUserList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.mobileUserListFilter[i],'travelerID')!='') {
            mobileUserList.push(this.state.mobileUserListFilter[i]);
          }
        }
       
              this.setState({ mobileUserList: mobileUserList, currentPage: 1 });
          }
        }
        else if(this.props.mobileUserListData.length>0)
        {
          this.setState({ mobileUserList: [], currentPage: 1 });
        }
        }
        updatedMobileUserList=async(str)=>
        {
            let mobileUserListAll=this.state.mobileUserListAll;
            mobileUserListAll=mobileUserListAll.map((item)=>{
                if(item.travelerID==str.travelerID)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let mobileUserList=this.state.mobileUserList;
            mobileUserList=mobileUserList.map((item)=>{
                if(item.travelerID==str.travelerID)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let mobileUserListFilter=this.state.mobileUserListFilter;
            mobileUserListFilter=mobileUserListFilter.map((item)=>{
                if(item.travelerID==str.travelerID)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({mobileUserListAll:mobileUserListAll,mobileUserListFilter:mobileUserListFilter,mobileUserList:mobileUserList,selectedMobileUser:str});
              this.props.mobileUserListInfo(mobileUserListAll);
            
        }  
        AgentDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Mobile User?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "travelerID": str,
                  "action":''
                }
                let response= await SettingApi.PostSettingList(formData,'/api/AppUser/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let mobileUserListAll=this.state.mobileUserListAll;
            mobileUserListAll=mobileUserListAll.filter((item)=>item.travelerID!=str)
            let mobileUserListFilter=this.state.mobileUserListFilter;
            mobileUserListFilter=mobileUserListFilter.filter((item)=>item.travelerID!=str)
         
              this.setState({loader:false,mobileUserListAll:mobileUserListAll,mobileUserListFilter:mobileUserListFilter});
              this.props.mobileUserListInfo(mobileUserListAll);
              this.props.history("/mobile-users"); 
                }
            }   
            
        }  
        reloadWindow()
        {
          window.location.reload(); 
        } 
        filterData()
        {
            this.setState({loader:true})
            let mobileUserListAll=this.state.mobileUserListAll;
            
                let mobileUserListFilter=  mobileUserListAll.map((item)=>{
                    item.display=true;
                    if(item.fullName.search(new RegExp(this.state.fullName.trim(), "i")) == -1 && this.state.fullName.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.email.search(new RegExp(this.state.email.trim(), "i")) == -1 && this.state.email.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.company.search(new RegExp(this.state.company.trim(), "i")) == -1 && this.state.company.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.phone.search(new RegExp(this.state.phone.trim(), "i")) == -1 && this.state.phone.trim()!='')
                    {
                        item.display=false;
                    }
                    return item;
                });
               
                let   mobileUserListFilter1=mobileUserListFilter.filter((item)=>item.display==true)
             
                this.setState({mobileUserListFilter:mobileUserListFilter1,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/mobile-users"); 
      },10)
            
        }
        clearData()
        {
            this.setState({loader:true,fullName:'',email:'',company:'',phone:'',currentPage:1,mobileUserListFilter:this.state.mobileUserListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/mobile-users"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }
    render(){
      
        return(
          
            <React.Fragment>
               
          <div className="innerPage">
          {/* <TopNevigationBarComponent/> */}
          <div className="tab-content">  
          {(this.state.token!==null)?<div className="toursDisplay">    
                <Suspense fallback={<div className="row">
  <div className="load"><img src="images/ajax-loader.gif" alt="" /> </div> 
</div>}>
<LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgentType-tab-pane" role="tabpanel" aria-labelledby="AgentType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className=""> Mobile Users</h5>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-3 align-items-center">
                            <div className="col-sm-2">
                                    <label>Name </label>
                                <input type="text" name="fullName" value={this.state.fullName} onChange={this.handleChange} className="form-control"  placeholder="Name"/>
                            </div>
                          
                            <div className="col-sm-2">
                                    <label>Email  </label>
                                <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control"  placeholder="Email"/>
                            </div>
                            <div className="col-sm-2">
                                    <label>	Department  </label>
                                <input type="text" name="departmentName" value={this.state.departmentName} onChange={this.handleChange} className="form-control"  placeholder="Department"/>
                            </div>
                            <div className="col-sm-2">
                                    <label>User Type  </label>
                                <input type="text" name="userType" value={this.state.userType} onChange={this.handleChange} className="form-control"  placeholder="User Type"/>
                            </div>
                           
                            <div className="col-sm-1 pt-4">
                              <button onClick={()=>this.filterData()} type="button" className="btn btn-sm btn-secondary rounded">Submit</button>
                            </div>
                            <div className="col-sm-1 pt-4">
                                <button onClick={()=>this.clearData()} type="button" className="btn btn-sm btn-secondary rounded">Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 text-end">
                    <br/>
                    <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="/images/reload.png"/></a>         {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<button data-bs-toggle="modal" data-bs-target="#mobileUserAdd" className="btn btn-primary rounded"> <i className="fa-sharp fa-solid fa-plus"></i> Add  Mobile User</button>:''}
                    </div>
                </div>
                    
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.mobileUserList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>                                          
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Company</th>  
                                            <th>Phone</th> 
                                            {/* <th>Agency Code</th>                                             */}
                                            {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<th colSpan="3">Action</th>:<th>Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.mobileUserList.map((item,key)=>{
                                            return( <tr key={`Agent-${key}`}>
                                                <td>{key+1}</td>
                                               
                                                <td>{ArrayHelper.getValue(item,'fullName')}</td>   
                                                <td>{ArrayHelper.getValue(item,'email')}</td> 
                                                <td>{ArrayHelper.getValue(item,'company')}</td>   
                                                <td>{ArrayHelper.getValue(item,'phone')}</td> 
                                                {/* <td>{ArrayHelper.getValue(item,'agencyCode')}</td>                                              */}
                                                
                                                {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<td>
                                                    <i data-bs-toggle="modal" data-bs-target="#mobileUserUpdate" onClick={()=>{this.setState({selectedMobileUser:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>:''} 
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#mobileUserView" onClick={()=>{this.setState({selectedMobileUser:item})}}  className="fa fa-eye btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                             
                                                {(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length>0  || ISSITESTATUS=='live')?<td>
                                                    <i onClick={()=>this.AgentDelete(ArrayHelper.getValue(item,'travelerID'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>:''}
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.mobileUserListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.mobileUserListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                </Suspense>
                </div>:''}
                </div>
                </div>                
                  <MobileUserAddComponent getMobileUserList={()=>this.getMobileUserList()}/>
               <MobileUserUpdateComponent updatedMobileUserList={(str)=>this.updatedMobileUserList(str)} selectedMobileUser={this.state.selectedMobileUser}/>
                <MobileUserViewComponent  selectedMobileUser={this.state.selectedMobileUser}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        mobileUserListData : state.settingsData.mobileUserList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        mobileUserListInfo:(data)=>dispatch({type: actionTypesUser.MOBILE_USER_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(MobileUsersComponent);