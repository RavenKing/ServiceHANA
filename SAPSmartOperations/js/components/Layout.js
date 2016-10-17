import React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

//Knowledge Action

import { fetchArticles,AddCard} from "../Actions/KnowledgeAction";

//Antd
import 'antd/dist/antd.css';
import { Button, DatePicker } from "antd";


//high charts
import  ReactHighCharts  from "react-highcharts";


//Three Panels

import DataPanel from "./DataAndFunction/DataPanel";
import FunctionPanel from "./DataAndFunction/FunctionPanel";
import DisplayPanel from "./DisplayPanel/DisplayPanel"

@connect((store)=>{    
    return {
        articles:store.articles,
        auth:store.auth
    };
    
})
export default class Layout extends React.Component {
  constructor(props)
  {
    super(props);

    const {auth} = this.props;
    const {user} = auth.token ; 
    
    this.props.dispatch(fetchArticles(user))

    const {location} = this.props;
    const {query} = location;
    console.log(query);
    if(query.object)
    {
      setTimeout(function(){
        var data = {
          query:query,
          type:"main"
        };
        this.props.dispatch(AddCard(data));
      }.bind(this),500)


    }

  }

  shouldComponentUpdate(nextProps,nextState)
  {   
    const {articles} =nextProps;
    console.log("update"+articles.refresh)
    if(articles.refresh == true || articles.fetched == true )
    {
      return true;
    }
  }

  componentWillUpdate(nextProps,nextState){
    const {auth} = this.props;
 const {user} = auth.token ; 
    const {articles} = nextProps;
    if(articles.refresh ==true)
    {
      setTimeout(function(){

this.props.dispatch(fetchArticles(user))
      }.bind(this),1000)
      }

  }


  componentWillMount()
  {
const {auth} = this.props;

const {user} = auth.token ; 
this.props.dispatch(fetchArticles(user))

  }


      render() {
        
    return (
         <div id="wrapper">

          <DataPanel articles={this.props.articles}> </DataPanel>
          <DisplayPanel articles = {this.props.articles}> </DisplayPanel>
      
          <FunctionPanel> 
          </FunctionPanel>

        </div>
        
        
        
        
        
    );
  }
}