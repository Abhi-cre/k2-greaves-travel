import * as actionTypes from '../action/ticket.action';
export interface firbaseList {
 
    selectedTicket:any
}

export const DEFAULT_TICKET_LIST_STATE: firbaseList = {
 
    selectedTicket:{}
};

const reducer = (state=DEFAULT_TICKET_LIST_STATE, action) => {
    switch (action.type) {
       
    case actionTypes.SELECTED_TICKET:
                return {
                    ...state,
                    selectedTicket: action.payload
                };  
            default:
                return state;
       
    };   

}
export default reducer;