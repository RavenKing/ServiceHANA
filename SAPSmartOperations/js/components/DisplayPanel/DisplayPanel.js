import React from "react";
import ReactDOM from "react-dom";
import { Button,Card,Icon } from "antd";
import { Link } from "react-router";
import MainPanel from "./MainPanel";
import DetailPanel from "./DetailPanel";
import CreatePanel from "../CreatePanel/CreatePanel";
import EditPanel from "../EditPanel/EditPanel";

import { setAreaDropable } from "../../interactScript";

import { AddCard }  from "../../Actions/KnowledgeAction";

import { connect } from "react-redux";
import { browserHistory } from "react-router"


@connect((store)=>{    
    return {
        articles:store.articles
    };
    
})
export default class DisplayPanel extends React.Component {   
   

   componentDidMount() {

      const props = this.props;
      const that = this;
      this.interactable = setAreaDropable({

          element: ReactDOM.findDOMNode(this),
          accept: '.data-item, .data-block,.func-item',
          ondrop: function(event) {
              let draggableElement = event.relatedTarget;
              var x = event.dragEvent.clientX + window.scrollX;
              var y = event.dragEvent.clientY + window.scrollY;
              var data_id = draggableElement.getAttribute('data-id');
              var data = {
                x:x,
                y:y
              }
              switch(draggableElement.getAttribute('data-type')){
              case "ITEM":
              { 

                  data.type = "detail";
                  data.data_id = data_id;
               
                  props.dispatch(AddCard(data));
                  break;
              }
              case "TITLE":
              {
                  data.type = "main";

                  props.dispatch(AddCard(data));
                  break;
              }
              case "FUNC":
              {
                  
                  if(data_id == "1"){
                      data.type = "create";
                      props.dispatch(AddCard(data));
                  }
                  else if(data_id == "4"){
                    browserHistory.push("/SAPSmartOperations/trend")
                  }

                  break;
              }
              default:
                  ;
              }
              
          }
      });
  }

  componentWillUnmount() {
      this.interactable.unset();
      this.interactable = null;
      
  }

  componentDidUpdate() {
    const {articles} = this.props;
    const {displayPanel} = articles;
    if(displayPanel.length==0)
    {

      ReactDOM.findDOMNode(this).classList.add('helpbgkm');

    }else{

      ReactDOM.findDOMNode(this).classList.remove('helpbgkm');
    }
  }


    render() {


      // show or close Main Panel
    	const { articles }  = this.props;

      // show or close Detail Panels 
      const { displayPanel } = articles ;
      const { results } = articles.articles;
      
      var displayArea = displayPanel.map((one)=>{
        if(one.type == "detail"){
          for(var i = 0; i < results.length;i++){
            if(results[i].ARTICLE_ID ==  one.article){
              return <DetailPanel article={results[i]} display={one} />
            }
          }
        }
        else if(one.type == "edit"){
          for(var i = 0; i < results.length;i++){
            if(results[i].ARTICLE_ID ==  one.article){
              return <EditPanel article={results[i]} display={one} />
            }
          }
        }
        else if(one.type == "create"){
          return <CreatePanel/>
        }
        else if(one.type == "main"){
          return <MainPanel results={ results } query={one.query?one.query:""}></MainPanel>
        }
      })



   return (
      <div className="display-panel helpbgkm">
     
		  { displayArea }

      </div>
      );
  }
}
