import React from "react";

//high charts
import DataPanel from "./datapanel"
import FunctionPanel from "./functionPanel"
import DisplayPanel from "./displaypanel"
import { Link } from "react-router"

var pageStatusDataStore=window.pageStatusDataStore;

var rc = window.rc;

  var getState = function getState() {
    return {
      currentStatus: pageStatusDataStore.getCurrentStatus()
    };
  };

export default class Test extends React.Component {
    
    render() {



        return (
            <div id="wrapper">
            <DataPanel> </DataPanel>
            <DisplayPanel></DisplayPanel>
            <FunctionPanel></FunctionPanel>

            <Link to="/km"> to Km </Link>
            </div>

  
      );
  }
}
