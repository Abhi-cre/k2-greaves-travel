import * as actionTypes from '../action/outLook.action';
export interface outLookData {
 
    folderLists:any,
    selectedEmailLists:any
}

export const DEFAULT_OUTLOOK_DATA_STATE: outLookData = {
 
    folderLists:[],
    selectedEmailLists:[]
};

const reducer = (state=DEFAULT_OUTLOOK_DATA_STATE, action) => {
    switch (action.type) {
       
    case actionTypes.FOLDER_LIST:
                return {
                    ...state,
                    folderLists: action.payload
                }; 
    case actionTypes.SELECTED_EMAIL_LIST:
                return {
                        ...state,
                    selectedEmailLists: action.payload
            };             
            default:
                return state;
       
    };   

}
export default reducer;