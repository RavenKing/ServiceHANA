import React from "react";
import ReactDOM from "react-dom";
import { Button,Card,Icon} from "antd";
import { connect } from "react-redux";
import TableCharts from "./TableCharts";
import DvmPanel from "./DvmPanel";
import { AddCard }  from "../../Actions/KnowledgeAction";
import { setNodeDragable } from "../../interactScript";

@connect((store)=>{
    return {
        articles:store.articles
    };
    
})
export default class ArticleMenuTile extends React.Component { 

    AddOneCard(){

      this.props.dispatch(AddCard( this.props.article_id ));

    }

    componentDidMount() {
      setNodeDragable(ReactDOM.findDOMNode(this));
    }

  
     

    render() {  

      
      return (

        <div className="menu-tile" data-type="MENU" data-id={this.props.article_id} onClick={this.AddOneCard.bind(this)}>

          <Card key={this.props.article_id} title={ this.props.archobj }  style={{ width: 200 }}>
            <p>{this.props.article_nam }</p>
            <p>{this.props.article_dsc }</p>
            <p>{"Total Size:" + this.props.total_size} </p>
        </Card>
          
        </div>
      );
  }
}
