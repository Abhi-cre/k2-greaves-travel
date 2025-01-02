import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import UserAddComponent from './UserAddComponent';
import UserUpdateComponent from './UserUpdateComponent';
import UserViewComponent from './UserViewComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID,USER_TYPE_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import * as XLSX from 'xlsx';
import { Signature } from "@progress/kendo-react-inputs";
class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,userListAll:[],userListFilter:[],userList:[],selectedUser:{},perPage:8,currentPage:1,'fullName':'','email':'','userType':'','departmentName':'',departmentName:[]};
    }
    componentDidMount()
    {
     
     let userListData=this.props.userListData;
     if(userListData.length>0)
     {
        let userList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(userListData[i],'id')!='') {
                userList.push(userListData[i]);
            }
        }
        
        this.setState({userListAll:userListData,userListFilter:userListData,userList:userList});
     }
     else
     {
      this.getUserList()
     }
     
    }
    getUserList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/User/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            let userListData=ArrayHelper.getValue(response,'userDetails').map((Item)=>{
                Item.fullName=Item.firstName+' '+Item.lastName;
                return Item;
            })
          let userList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(userListData[i],'id')!='') {
                userList.push(userListData[i]);
              }
          }
          
          this.setState({loader:false,userListAll:userListData,userListFilter:userListData,userList:userList});
          this.props.userListInfo(userListData);
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.userListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let userList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.userListFilter[i],'id')!='') {
            userList.push(this.state.userListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), userList: userList });
          } else {
              
            let userList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.userListFilter[i],'id')!='') {
            userList.push(this.state.userListFilter[i]);
          }
        }
       
              this.setState({ userList: userList, currentPage: 1 });
          }
        }
        else if(this.props.userListData.length>0)
        {
          this.setState({ userList: [], currentPage: 1 });
        }
        }
        updatedUserList=async(str)=>
        {
            let userListAll=this.state.userListAll;
            userListAll=userListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let userList=this.state.userList;
            userList=userList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let userListFilter=this.state.userListFilter;
            userListFilter=userListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({userListAll:userListAll,userListFilter:userListFilter,userList:userList,selectedUser:str});
              this.props.userListInfo(userListAll);
            
        }  
        UserDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected User?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "userIdToDelete": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/User/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let userListAll=this.state.userListAll;
            userListAll=userListAll.filter((item)=>item.id!=str)  
            let userListFilter=this.state.userListFilter;
            userListFilter=userListFilter.filter((item)=>item.id!=str)          
              this.setState({loader:false,userListAll:userListAll,userListFilter:userListFilter});
              this.props.userListInfo(userListAll);
              this.props.history("/settings/user"); 
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
            let userListAll=this.state.userListAll;
            
                let userListFilter=  userListAll.map((item)=>{
                    item.display=true;
                    if(item.fullName.search(new RegExp(this.state.fullName.trim(), "i")) == -1 && this.state.fullName.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.email.search(new RegExp(this.state.email.trim(), "i")) == -1 && this.state.email.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.departmentName.search(new RegExp(this.state.departmentName.trim(), "i")) == -1 && this.state.departmentName.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.userType.search(new RegExp(this.state.userType.trim(), "i")) == -1 && this.state.userType.trim()!='')
                    {
                        item.display=false;
                    }
                    return item;
                });
               
                let   userListFilter1=userListFilter.filter((item)=>item.display==true)
             
                this.setState({userListFilter:userListFilter1,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/user"); 
      },10)
            
        }
        clearData()
        {
            this.setState({loader:true,fullName:'',email:'',departmentName:'',userType:'',currentPage:1,userListFilter:this.state.userListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/user"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }  
            
            downloadExcel = () => {
                const { userListFilter, userListAll } = this.state;
                const dataToExport = userListFilter.length > 0 ? userListFilter : userListAll;
            
                if (dataToExport.length === 0) {
                    alert("No data available to export!");
                    return;
                }
            
                const columns = [];
                const formattedData = dataToExport.map((user, index) => {
                    const formattedRow = {
                        SrNo: index + 1,
                        Name: `${user.firstName} ${user.lastName}`,
                        Email: user.email,
                        DepartmentName: user.departmentName,
                        UserType: user.userType,
                        AccountId: user.accountId,
                        Extention: user.extention,
                        Signature: user.vsignature
                    };
            
                    Object.keys(formattedRow).forEach((key) => {
                        if (
                            !columns.includes(key) && 
                            formattedRow[key] !== undefined && 
                            formattedRow[key] !== null && 
                            formattedRow[key] !== ''
                        ) {
                            columns.push(key);
                        }
                    });
            
                    return formattedRow;
                });
            
                const finalData = formattedData.filter((row) => {
                    return columns.some((column) => row[column] !== undefined && row[column] !== null && row[column] !== '');
                });
            
                if (finalData.length === 0) {
                    alert("No valid data available to export!");
                    return;
                }
            
                const columnWidths = columns.map((column) => {
                    let maxLength = column.length;
                    finalData.forEach((row) => {
                        const cellValue = row[column] ? row[column].toString() : '';
                        maxLength = Math.max(maxLength, cellValue.length);
                    });
       
                    return { wpx: Math.max(maxLength * 10, 60) }; 
                });
            
                const ws = XLSX.utils.json_to_sheet(finalData, { header: columns });
            
                ws['!cols'] = columnWidths;
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "User Data");
                XLSX.writeFile(wb, "User_List.xlsx");
            };
            
            
            // componentDidUpdate(prevProps, prevState) {
            //     if (prevState.departmentName !== this.state.departmentName) {
            //         console.log("Department data updated:", this.state.departmentName);
            //     }
            // }
            
            
            
            
            

    render(){
      
        return(
          
            <React.Fragment>
                  <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="UserType-tab-pane" role="tabpanel" aria-labelledby="UserType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">User</h5>
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
                                {/* <select required className="form-select form-noradious" name="departmentName" value={this.state.departmentName} onChange={this.handleChange} onChange={this.handleChange} >
                                        
                                        <option value="">Select Department</option>
                                        {this.state.departmentName.map((item,key)=>{
                                          return(<option  key={`departmentName-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                        </select> */}
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
                <br />
                <div className="d-flex align-items-center justify-content-end">
                  <a onClick={() => this.reloadWindow()}><img style={{ 'height': '40px' }} src="/images/reload.png" /></a>
                  <button data-bs-toggle="modal" data-bs-target="#UserAdd" className="btn btn-outlined me-1">
                    <i className="fa-sharp fa-solid fa-plus"></i> Add
                  </button>
                  <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-1">
                    <i className="fa-sharp fa-solid fa-download"></i> Download Excel
                  </button>
                </div>
              </div>

                </div>
                        
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.userList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>                                          
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Department</th>  
                                            <th>User Type</th> 
                                            <th>AccountIddd</th>                                            
                                            <th colSpan="3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.userList.map((item,key)=>{
                                            return( <tr key={`User-${key}`}>
                                                {/* <td>{key+1}</td> */}

                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>
                                               
                                                <td>{ArrayHelper.getValue(item,'fulllName')} {ArrayHelper.getValue(item,'firstName')} {ArrayHelper.getValue(item,'lastName')}</td>   
                                                <td>{ArrayHelper.getValue(item,'email')}</td> 
                                                <td>{ArrayHelper.getValue(item,'departmentName')}</td>   
                                                <td>{ArrayHelper.getValue(item,'userType')}</td> 
                                                <td>{ArrayHelper.getValue(item,'accountId')}</td>                                             
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#UserView" onClick={()=>{this.setState({selectedUser:item})}}  className="fa fa-eye btn"  data-bs-placement="top" title="Edit"></i>
                                                </td> 
                                                <td>
                                                   <i data-bs-toggle="modal" data-bs-target="#UserUpdate" onClick={()=>{this.setState({selectedUser:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                              
                                                {(localStorage.getItem(USER_TYPE_ID)!='1')?<td>
                                                    <i onClick={()=>this.UserDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>:''}
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.userListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.userListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <UserAddComponent getUserList={()=>this.getUserList()}/>
                <UserUpdateComponent updatedUserList={(str)=>this.updatedUserList(str)} selectedUser={this.state.selectedUser}/>
                <UserViewComponent  selectedUser={this.state.selectedUser}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        userListData : state.settingsData.userList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        userListInfo:(data)=>dispatch({type: actionTypesUser.USER_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(UserComponent);