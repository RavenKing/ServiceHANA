import React from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
import { Link } from "react-router";
import { connect} from "react-redux"; 
import { AddCard }  from "../../Actions/KnowledgeAction";
import { setNodeDragable } from "../../interactScript";

@connect((store)=>{    
    return {
        articles:store.articles
    };
    
})
export default class DataItem extends React.Component {
    
  AddOneCard(){

      this.props.dispatch(AddCard( this.props.uniquekey ));

  }

  componentDidMount() {
    this.interactable = setNodeDragable(ReactDOM.findDOMNode(this));
  }

  componentWillUnmount() {
      this.interactable.unset();
      this.interactable = null;
  }
    render() {
   
        return (
            

            <Button className="data-item" data-type="ITEM" type="dashed" data-id={this.props.uniquekey}>
              {this.props.title}
            </Button>
      );
  }
}
