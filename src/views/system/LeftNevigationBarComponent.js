import React from "react";
import LoaderComponent from '../../components/LoaderComponent';
import OutLookApi from '../../api/Outlook.api';
import {ArrayHelper} from '../../helpers/arrayhelper';
class LeftNevigationBarComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {selectedFolder:'Inbox',loader:false,selectedEmailListsData:[],displayNewFormder:false,folderName:''};
    }
    
    selecteFolder(item)
    {
        this.setState({selectedFolder:item.displayName});
        this.props.selecteFolder(item);
    }

    getChildFolder1(strId)
    {
     let allFolderList=this.props.folderList;
          allFolderList= allFolderList.filter((item)=>item.parentFolderId==strId)
          if(allFolderList.length>0)
          {
          return(<ul className="btn-toggle-nav list-unstyled">
          {allFolderList.map((item,key)=>{
              return(<li key={`folder-${key}`} className="list-group-item d-flex justify-content-between align-items-start">
              <a  onClick={()=>this.selecteFolder(item)} className={(this.state.selectedFolder==ArrayHelper.getValue(item,'displayName'))?'selected':''}>
                  <div className="ms-2 me-auto">
                      <div>
                          {(ArrayHelper.getValue(item,'folderClass')!='')?<i className={ArrayHelper.getValue(item,'folderClass')}></i>:''}
                          <span className="texthide">{ArrayHelper.getValue(item,'displayName')}</span>
                      </div>
                  </div>
                  {(ArrayHelper.getValue(item,'unreadItemCount')>0)?<span className="badge bg-notification rounded-pill">{ArrayHelper.getValue(item,'unreadItemCount')}</span>:''}
              </a>
              {(ArrayHelper.getValue(item,'childFolderCount')>0)?this.getChildFolder1(ArrayHelper.getValue(item,'id')):''}
          </li>)
          })}
        
         
      </ul>)
          }
    }
    getChildFolder2(strId)
    {
     let allFolderList=this.props.allFolderList;
          allFolderList= allFolderList.filter((item)=>item.id==strId)
          if(allFolderList.length>0)
          {
          return(<ul className="btn-toggle-nav list-unstyled">
          {allFolderList.map((item,key)=>{
              return(<li key={`folder-${key}`} className="list-group-item d-flex justify-content-between align-items-start">
              <a  onClick={()=>this.selecteFolder(item)} className={(this.state.selectedFolder==ArrayHelper.getValue(item,'displayName'))?'selected':''}>
                  <div className="ms-2 me-auto">
                      <div>
                          {(ArrayHelper.getValue(item,'folderClass')!='')?<i className={ArrayHelper.getValue(item,'folderClass')}></i>:''}
                          <span className="texthide">{ArrayHelper.getValue(item,'displayName')}</span>
                      </div>
                  </div>
                  {(ArrayHelper.getValue(item,'unreadItemCount')>0)?<span className="badge bg-notification rounded-pill">{ArrayHelper.getValue(item,'unreadItemCount')}</span>:''}
              </a>
              {(ArrayHelper.getValue(item,'childFolderCount')>0)?this.getChildFolder3(ArrayHelper.getValue(item,'id')):''}
          </li>)
          })}
        
         
      </ul>)
          }
    }
    getChildFolder3(strId)
    {
     let allFolderList=this.props.allFolderList;
          allFolderList= allFolderList.filter((item)=>item.id==strId)
          if(allFolderList.length>0)
          {
          return(<ul className="btn-toggle-nav list-unstyled">
          {allFolderList.map((item,key)=>{
              return(<li key={`folder-${key}`} className="list-group-item d-flex justify-content-between align-items-start">
              <a  onClick={()=>this.selecteFolder(item)} className={(this.state.selectedFolder==ArrayHelper.getValue(item,'displayName'))?'selected':''}>
                  <div className="ms-2 me-auto">
                      <div>
                          {(ArrayHelper.getValue(item,'folderClass')!='')?<i className={ArrayHelper.getValue(item,'folderClass')}></i>:''}
                          <span className="texthide">{ArrayHelper.getValue(item,'displayName')}</span>
                      </div>
                  </div>
                  {(ArrayHelper.getValue(item,'unreadItemCount')>0)?<span className="badge bg-notification rounded-pill">{ArrayHelper.getValue(item,'unreadItemCount')}</span>:''}
              </a>
             
          </li>)
          })}
        
         
      </ul>)
          }
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;
        
      this.setState({ ...this.state, [name]: value });
      }
      
    submit = async(event: any) => {
        event.preventDefault();
        
      this.setState({ errors:{},loader:true });
      let responsefolder = await OutLookApi.CreateFolder(this.state.folderName);
      if(ArrayHelper.getValue(responsefolder,'IsSuccess')==true)
      {
       this.setState({folderName:'',loader:false,displayNewFormder:false})
       this.props.getFolderList();
      }
    }
    componentWillReceiveProps(nextProps) {
     if(nextProps.displayName=='')
     {
      this.setState({selectedFolder:''})  
     }
    }
    render(){
        let filterFolder=[];
      
           if(this.props.folderList.length>0)
           {
             filterFolder= this.props.folderList.filter((item)=>item.parentFolderId=="AQMkAGY5OGQ2YzVhLTBlNDMtNDE0MC04NTM3LWFjYWRiYWU1NzM2MAAuAAADEbuoBCLHZUKF805QFgUJ9gEAKmPw4QC3cE6U10G80KfPyQAAAgEIAAAA");
           }
        return(
            <React.Fragment>
              <LoaderComponent loader={this.state.loader}/>    
         <div className={`page-sidebar bg-grey-color ${(this.props.showLeftNav==true)?'show':''}`} id="sidebar">
            <ul className="list-unstyled ps-0">
                {/* <li className="mb-1">
                    <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
                        data-bs-toggle="collapse" data-bs-target="#Favourites-collapse" aria-expanded="true">
                        <strong>Favourites</strong>
                    </button>
                    <div className="menuLeft collapse" id="Favourites-collapse">
                        <ul className="btn-toggle-nav list-unstyled">
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a href="#">
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="mailing icon-draft"></i>
                                            <span className="texthide">Draft</span>
                                        </div>
                                    </div>
                                    <span className="badge bg-notification rounded-pill">3</span>
                                </a>
                            </li>

                        </ul>
                    </div>
                </li> */}
                <li className="mb-1">
                    <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
                        data-bs-toggle="collapse" data-bs-target="#Folders-collapse" aria-expanded="true">
                        <strong>Folders</strong>
                    </button>
                    <div className="menuLeft collapse show" id="Folders-collapse">
                        <ul className="btn-toggle-nav list-unstyled">
                            {filterFolder.map((item,key)=>{
                             
                                return(<li key={`folder-${key}`} className="list-group-item d-flex justify-content-between align-items-start">
                                <a  onClick={()=>this.selecteFolder(item)} className={(this.state.selectedFolder==ArrayHelper.getValue(item,'displayName'))?'selected':''}>
                                    <div className="ms-2 me-auto">
                                        <div>
                                            {(ArrayHelper.getValue(item,'folderClass')!='')?<i className={ArrayHelper.getValue(item,'folderClass')}></i>:''}  <span className="texthide">{ArrayHelper.getValue(item,'displayName')}</span>
                                        </div>
                                    </div>
                                    {(ArrayHelper.getValue(item,'unreadItemCount')>0)?<span className="badge bg-notification rounded-pill">{ArrayHelper.getValue(item,'unreadItemCount')}</span>:''}
                                </a>
                                {(ArrayHelper.getValue(item,'childFolderCount')>0)?this.getChildFolder1(ArrayHelper.getValue(item,'id')) :''}
                            </li>)
                            })}
                          
                         
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a onClick={()=>{this.setState({displayNewFormder:!this.state.displayNewFormder})}}>
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="labal labal-add-new"></i>
                                            <span className="texthide">Add New</span>
                                        </div>
                                    </div>
                                </a>
                                
                            </li>
                        </ul>
                        {(this.state.displayNewFormder==true)?<div className="newfolder">
                                <form method="post" onSubmit={this.submit}>
                                    <input onChange={this.handleChange} value={this.state.folderName} required className="form-control" type="text" name="folderName"/>
                                </form>
                        </div>:''}
                    </div>
                </li>
                {/* <li className="mb-1">
                    <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
                        data-bs-toggle="collapse" data-bs-target="#Category-collapse" aria-expanded="true">
                        <strong>Category</strong>
                    </button>
                    <div className="menuLeft collapse show" id="Category-collapse">
                        <ul className="btn-toggle-nav list-unstyled">
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a href="#">
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="labal labal-blue"></i>
                                            <span className="texthide">Work</span>
                                        </div>
                                    </div>
                                    <span className="badge bg-notification rounded-pill">14</span>
                                </a>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a href="#">
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="labal labal-magenta"></i>
                                            <span className="texthide">Documents</span>
                                        </div>
                                    </div>
                                    <span className="badge bg-notification rounded-pill">1</span>
                                </a>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a href="#">
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="labal labal-green"></i>
                                            <span className="texthide">Clients</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a href="#">
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="labal labal-yellow"></i>
                                            <span className="texthide">Invoices</span>
                                        </div>
                                    </div>
                                    <span className="badge bg-notification rounded-pill">9</span>
                                </a>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <a href="#">
                                    <div className="ms-2 me-auto">
                                        <div>
                                            <i className="labal labal-add-new"></i>
                                            <span className="texthide">Add New</span>
                                        </div>
                                    </div>
                                </a>
                            </li>

                        </ul>
                    </div>
                </li> */}
            </ul>
        </div>
            </React.Fragment>
        )
    }
}  


  
  export default  LeftNevigationBarComponent;