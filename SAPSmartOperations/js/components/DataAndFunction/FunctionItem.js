import React from "react";
import ReactDOM from "react-dom";
import { Button, Icon } from "antd";
import { setNodeDragable } from "../../interactScript";


export default class FunctionItem extends React.Component {
    
  

  componentDidMount() {
    this.interactable = setNodeDragable(ReactDOM.findDOMNode(this));
  }

  componentWillUnmount() {
      this.interactable.unset();
      this.interactable = null;
  }
    render() {

       switch(this.props.id){
        case "1":
          return (
            <Button className="func-item ant-btn ant-btn-ghost ant-btn-lg function-button draggable" data-type="FUNC" type="dashed" data-id={this.props.id}>
              {this.props.text}
            </Button>
          );
          break;
        case "4":
          return (
            <Button className="func-item ant-btn ant-btn-ghost ant-btn-lg function-button draggable" data-type="FUNC" type="ghost" data-id={this.props.id} icon="line-chart">
              
              {this.props.text}
            </Button>
          );
          break;

        case "2":
        case "3":
          return (
            <Button className="func-item1 ant-btn ant-btn-ghost ant-btn-lg function-button draggable" data-type="FUNC" type="dashed" data-id={this.props.id}>
              {this.props.text}
            </Button>
          );
          break;

        default:;
       }    
        
  }
}
