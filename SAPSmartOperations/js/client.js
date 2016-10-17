import React from "react";
import ReactDOM from "react-dom";
import {Router,Route,IndexRoute,browserHistory} from "react-router";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./components/Login/login"

import requireAuth from "./requireAuth";
import  ReactHighCharts  from "react-highcharts";


import First from "./components/TrendAna/First";

import PredictPanel from "./components/DisplayPanel/PredictPanel";

window.react=React;
window.Highcharts =  ReactHighCharts;





const app = document.getElementById('app');
ReactDOM.render(
    <Provider store = {store}>
    <Router history={browserHistory}>
     <Route path="/SAPSmartOperations/login" component ={Login}> </Route>  
     <Route path="/SAPSmartOperations/" component ={requireAuth(First)}> 
        <Route path="/SAPSmartOperations/trend" component={First}>   </Route>  
      </Route>
    <Route path="/SAPSmartOperations/km" component={requireAuth(Layout)}>   </Route> 
  </Router>
    </Provider>,
app);