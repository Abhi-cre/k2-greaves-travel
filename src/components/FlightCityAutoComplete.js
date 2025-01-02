import * as React from 'react';
import SettingApi from '../api/Setting.api';
import {ArrayHelper} from "../helpers/arrayhelper";
declare var $ :any;
interface Props {
    placeholder : string,
    value : string,
    name : string,
    className : string,
    handleUserInput: any,
    error : any,
    select : any,  
    emptyState : any,  
    showHideLoder:any
}
export default class FlightCityAutoComplete extends React.Component<Props, any>{

    constructor(props: any){
        super(props);
    }

    componentWillUnmount(){
        $(this.refs.citynamesuggestion).autocomplete( "destroy" );
    }

    componentDidMount(){
        $(this.refs.citynamesuggestion).autocomplete({
            minLength: 3,
            delay: 500,
            source: async(request: any, response: any) => {
              this.props.showHideLoder(true)
                let responsedata=  await SettingApi.PostTaveleList({Airport: request.term },"/api/bifrost/Azure/GetAirport");
                if(ArrayHelper.getValue(responsedata,'Authenticated')==true)
                {
                    response(ArrayHelper.getValue(responsedata, ['ListOfAirport'] , []));
                   this.props.showHideLoder(false)
                }
               
                
            },
            select: (event: any, ui: any) => {
                this.props.select(ui.item.value);
            },
            change: (event: any, ui: any) => {
                if (ui.item == null) {
                    this.props.emptyState();
                }
            }
        });
    }
    render() {
        return <input type="text" 
        placeholder = {this.props.placeholder}
        value = {this.props.value}
                  autoComplete = "off"
        name = {this.props.name}
        ref= "citynamesuggestion"
        className={`form-control ${this.props.className} ${this.props.error ? 'form-danger' : ''}`}
        onChange={(event: any) => this.props.handleUserInput(event)}
    />
    }
}