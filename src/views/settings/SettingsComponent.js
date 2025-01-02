import React,{Suspense,lazy } from "react";
import {
    Route,
    Routes
  } from "react-router-dom";
  import {ALLOWEDUSER,USER_EMAIL} from '../../helpers/constants';
  const TopNevigationBarComponent = lazy(() => import('./TopNevigationBarComponent'));
  const ActionTypeComponent = lazy(() => import('./action-type/ActionTypeComponent'));
  const AgencyTypeComponent = lazy(() => import('./agency-type/AgencyTypeComponent'));
  const AgentTypeComponent = lazy(() => import('./agent-type/AgentTypeComponent'));
  const AirLineComponent = lazy(() => import('./air-line/AirLineComponent'));
  const ClientStatusComponent = lazy(() => import('./client-status/ClientStatusComponent'));
  const ContactChannelComponent = lazy(() => import('./contact-channel/ContactChannelComponent'));
  const StateComponent = lazy(()=> import('./state/StateComponent'));
  const CityComponent = lazy(() => import('./city/CityComponent'));
  const DepartmentComponent = lazy(() => import('./department/DepartmentComponent'));
  const GreavesOfficeComponent = lazy(() => import('./greaves-office/GreavesOfficeComponent'));
  const GreavesStatusComponent = lazy(() => import('./greaves-status/GreavesStatusComponent'));
  const SalesCategoryComponent = lazy(() => import('./sales-category/SalesCategoryComponent'));
  const SalesRegionComponent = lazy(() => import('./sales-region/SalesRegionComponent'));
  const TourTypeComponent = lazy(() => import('./tour-type/TourTypeComponent'));
  const UserTypeComponent = lazy(() => import('./user-type/UserTypeComponent'));
  const VendorTypeComponent = lazy(() => import('./vendor-type/VendorTypeComponent'));
  const QuoteTypeComponent = lazy(() => import('./quote-type/QuoteTypeComponent'));
  const AgencyComponent = lazy(() => import('./agency/AgencyComponent'));
  const AgentComponent = lazy(() => import('./agent/AgentComponent'));
  const SalesGuideComponent = lazy(() => import('./sales-guide/SalesGuideComponent'));
  const QuestionnaireComponent= lazy(() => import('./questionnaire/QuestionnaireComponent'));
  const ServiceComponent= lazy(() => import('./service/ServiceComponent'));
  const VendorComponent= lazy(() => import('./vendor/VendorComponent'));
  const UserComponent = lazy(() => import('./user/UserComponent'));
  const HearedAboutComponent = lazy(() => import('./heared-about/HearedAboutComponent'));
  const AppSettingComponent = lazy(() => import('./app-setting/AppSettingComponent'));
class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount()
  {
    if(ALLOWEDUSER.filter((item:any)=>item==localStorage.getItem(USER_EMAIL)).length==0)
    {
        console.log('sssssssssss')
      setTimeout(()=>{
        this.props.history("/tours");
      },10)
    }
  }
    
    render(){
     
        return(
            <React.Fragment>
          <div className="innerPage">
          <TopNevigationBarComponent/>
          <div className="tab-content">  
    {(this.state.token!==null)?<div  className="settingDisplay">    
                <Suspense fallback={<div className="row">
  <div className="load"><img src="images/ajax-loader.gif" alt="" /> </div> 
</div>}>
                <Routes>                
                <Route   path="/"  element={<ActionTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/agency-type"  element={<AgencyTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/agent-type"  element={<AgentTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/air-line"  element={<AirLineComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/client-status"  element={<ClientStatusComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/contact-channel"  element={<ContactChannelComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/state"  element={<StateComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/city"  element={<CityComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/department"  element={<DepartmentComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/greaves-office"  element={<GreavesOfficeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/greaves-status"  element={<GreavesStatusComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/sales-category"  element={<SalesCategoryComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/sales-region"  element={<SalesRegionComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/tour-type"  element={<TourTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/user-type"  element={<UserTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/vendor-type"  element={<VendorTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/quote-type"  element={<QuoteTypeComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/agency"  element={<AgencyComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/agent"  element={<AgentComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/sales-guide"  element={<SalesGuideComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/questionnaire"  element={<QuestionnaireComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/service"  element={<ServiceComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/vendor"  element={<VendorComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/user"  element={<UserComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/heared-about"  element={<HearedAboutComponent params={this.props.params} history={this.props.history}/>}/>
                <Route   path="/app-setting"  element={<AppSettingComponent params={this.props.params} history={this.props.history}/>}/>
                </Routes>
                </Suspense>
                </div>:''}
              
                </div>
          

        </div>
                
            </React.Fragment>
        )
    }
}  


export default  SettingsComponent;