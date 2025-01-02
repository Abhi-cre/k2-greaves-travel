import * as actionTypes from '../action/settings.action';
export interface settingsData {
 
    actionTypeList:any,
    agencyTypeList:any,
    agentTypeList:any,
    clientStatusList:any,
    contactChannelList:any,
    departmentList:any,
    greavesOfficeList:any,
    greavesStatusList:any,
    salesCategoryList:any,
    salesRegionList:any,
    tourTypeList:any,
    userTypeList:any,
    vendorTypeList:any,
    airLineList:any,
    quoteTypeList:any,
    agencyList:any,
    salesGuideList:any,
    questionnaireList:any,
    vendorList:any,
    serviceList:any,
    agentList:any,
    toursList:any,
    toursSelected:any,
    mobileUserList:any,
    userList:any,
    cityList:any,
    stateList:any,
    countryList:any,
    hearedAboutList:any,
    appSettingList:any
}

export const DEFAULT_SETTINGS_DATA_STATE: settingsData = {
 
    actionTypeList:[],
    agencyTypeList:[],
    agentTypeList:[],
    clientStatusList:[],
    contactChannelList:[],
    departmentList:[],
    greavesOfficeList:[],
    greavesStatusList:[],
    salesCategoryList:[],
    salesRegionList:[],
    tourTypeList:[],
    userTypeList:[],
    vendorTypeList:[],
    airLineList:[],
    quoteTypeList:[],
    agencyList:[],
    salesGuideList:[],
    questionnaireList:[],
    vendorList:[],
    serviceList:[],
    agentList:[],
    toursList:[],
    toursSelected:{},
    mobileUserList:[],
    userList:[],
    cityList:[],
    stateList:[],
    countryList:[],
    hearedAboutList:[],
    appSettingList:[]
};

const reducer = (state=DEFAULT_SETTINGS_DATA_STATE, action) => {
    switch (action.type) {
       
    case actionTypes.ACTION_TYPE_LIST:
                return {
                    ...state,
                    actionTypeList: action.payload
                }; 
    case actionTypes.AGENCY_TYPE_LIST:
            return {
                        ...state,
                        agencyTypeList: action.payload
            };
    case actionTypes.AGENT_TYPE_LIST:
            return {
                     ...state,
                     agentTypeList: action.payload
                };
    case actionTypes.CLIENT_STATUS_LIST:
            return {
                       ...state,
                       clientStatusList: action.payload
                }; 
   case actionTypes.CONTACT_CHANNEL_LIST:
         return {
                    ...state,
                    contactChannelList: action.payload
                }; 
    case actionTypes.DEPARTMENT_LIST:
        return {
                 ...state,
                 departmentList: action.payload
                }; 
    case actionTypes.GREAVES_OFFICE_LIST:
            return {
                    ...state,
                    greavesOfficeList: action.payload
            };  
    case actionTypes.GREAVES_STATUS_LIST:
            return {
                    ...state,
                greavesStatusList: action.payload
         };  
    case actionTypes.SALES_CATEGORY_LIST:
            return {
                    ...state,
                    salesCategoryList: action.payload
         };  
    case actionTypes.SALES_REGION_LIST:
            return {
                    ...state,
                    salesRegionList: action.payload
         }; 
  case actionTypes.TOUR_TYPE_LIST:
        return {
                 ...state,
                tourTypeList: action.payload
             };
   case actionTypes.USER_TYPE_LIST:
                return {
                         ...state,
                        userTypeList: action.payload
                     }; 
   case actionTypes.VENDOR_TYPE_LIST:
          return {
                   ...state,
                  vendorTypeList: action.payload
                }; 
  case actionTypes.AIR_LINE_LIST:
        return {
                ...state,
                airLineList: action.payload
           };  

case actionTypes.QUOTE_TYPE_LIST:
        return {
                ...state,
                quoteTypeList: action.payload
           }; 
case actionTypes.AGENCY_LIST:
        console.log(action.payload,"action.payloadaction.payloadaction.payload");
        
        return {
                        ...state,
                        agencyList: action.payload
        };  
 case actionTypes.SALES_GUIDE_LIST:
        return {
                 ...state,
                 salesGuideList: action.payload
          };  
 case actionTypes.QUESTIONAIRE_LIST:
        return {
                 ...state,
                 questionnaireList: action.payload
          }; 
case actionTypes.VENDOR_LIST:
        return {
            ...state,
           vendorList: action.payload
        };
case actionTypes.SERVICE_LIST:
        return {
                    ...state,
                    serviceList: action.payload
        }; 
case actionTypes.AGENT_LIST:
        return {
         ...state,
           agentList: action.payload
         }; 
         
 case actionTypes.TOURS_LIST:
        return {
                 ...state,
                 toursList: action.payload
        };
 case actionTypes.TOURS_SELECTED:
        return {
                 ...state,
                 toursSelected: action.payload
        }; 
case actionTypes.MOBILE_USER_LIST:
        return {
                 ...state,
                 mobileUserList: action.payload
                }; 
case actionTypes.USER_LIST:
        return {
                 ...state,
                 userList: action.payload
                }; 
case actionTypes.CITY_LIST:
         return {
                ...state,
                cityList: action.payload
                }; 
case actionTypes.STATE_LIST:
        return {
                  ...state,
                  stateList: action.payload
                }; 
case actionTypes.COUNTRY_LIST:
         return {
                    ...state,
                countryList: action.payload
           };                               
case actionTypes.HEARED_ABOUT_LIST:
         return {
                ...state,
                hearedAboutList: action.payload
                };
case actionTypes.APP_SETTING_LIST:
         return {
                ...state,
                appSettingList: action.payload
                };                                
            default:
                return state;
       
    };   

}
export default reducer;