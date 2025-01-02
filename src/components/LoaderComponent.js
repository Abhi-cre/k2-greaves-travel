import React from "react";
class LoaderComponent extends React.Component {
    constructor(props) {
      super(props);
    
  }
  render(){
    return (<div id="load" className={(this.props.loader==true)?'show':'hide'} ></div>)

    }

 

}

export default LoaderComponent;
