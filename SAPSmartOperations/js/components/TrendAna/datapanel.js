import React from "react";
import {Button,Badge,Tooltip,Popover} from "antd";

var interact=window.interact
var dataPanelItemChangeAction = window.dataPanelItemChangeAction
var dataPanelDataStore=window.dataPanelDataStore
var pageStatusDataStore = window.pageStatusDataStore
var global = window

/*(function (React, rc, antd, interact, dataPanelItemChangeAction, dataPanelDataStore, pageStatusDataStore, global) {
*/
/*  if (!rc) {
    rc = window.rc = {};
  }
*/
/*  var Button = antd.Button;
  var Badge = antd.Badge;

*/
  var ReactPropTypes = React.PropTypes;

  var getState = function getState() {
    var that = this;
    return {
      dataPanelData: dataPanelDataStore.getData(that.props.currentStatus)
   };
  };

  var DataItem = React.createClass({
    displayName: "DataItem",

    propTypes: {
      item: ReactPropTypes.object.isRequired
    },

    componentDidMount: function componentDidMount() {
      this.interactable = global.setNodeDragable(this.getDOMNode());
    },
    componentWillUnmount: function componentWillUnmount() {
      this.interactable.unset();
      this.interactable = null;
    },

    render: function render() {
      var currentStatus = pageStatusDataStore.getCurrentStatus();

      var item = this.props.item;
      if(currentStatus == "INIT"){

        return React.createElement(
          Tooltip,
          { className: "ant-tooltip-open", placement: "rightBottom", title: this.props.item.FACTOR_NAME},

          React.createElement(
            Button,
            { className: "data-item", type: "dashed",
              "data-type": "ITEM",
              "data-info": currentStatus + "-ITEM",
              "data-factor_guid": this.props.item.FACTOR_GUID,
              "data-factor_name": this.props.item.FACTOR_NAME,
              "data-trend": this.props.item.TREND,
              "data-category": this.props.item.FACTOR_CATEGORY },
            React.createElement(
              Badge,
              { dot: parseFloat(item.TREND) > 5.0 },
              item.FACTOR_BUSINESS_NAME
            )
          )
        );
      }
      else if(this.props.item.FACTOR_CATEGORY == "RET"){
        return React.createElement(
          Popover,
          { content:"residence time of best practice",
            placement:"bottom"},
          React.createElement(
            Button,
            { className: "data-item", type: "dashed",
                "data-type": "ITEM",
                "data-info": currentStatus + "-ITEM",
                "data-factor_guid": this.props.item.FACTOR_GUID,
                "data-factor_name": this.props.item.FACTOR_NAME,
                "data-trend": this.props.item.TREND,
                "data-category": this.props.item.FACTOR_CATEGORY },
              React.createElement(
                  Badge,
                  { dot: parseFloat(item.TREND) > 5.0 },
                  item.FACTOR_NAME
              )
            )
          
       );

      }
      else{
         return React.createElement(
            Button,
            { className: "data-item", type: "dashed",
              "data-type": "ITEM",
              "data-info": currentStatus + "-ITEM",
              "data-factor_guid": this.props.item.FACTOR_GUID,
              "data-factor_name": this.props.item.FACTOR_NAME,
              "data-trend": this.props.item.TREND,
              "data-category": this.props.item.FACTOR_CATEGORY },
            React.createElement(
              Badge,
              { dot: parseFloat(item.TREND) > 5.0 },
              item.FACTOR_NAME
            )
          );
        
      }
    }
  });
//<Tooltip placement="topLeft" title="???? ????" arrowPointAtCenter>
  var DataBlock = React.createClass({
    displayName: "DataBlock",


    propTypes: {
      dataPanelData: ReactPropTypes.object.isRequired
    },

    componentDidMount: function componentDidMount() {
      this.interactable = global.setNodeDragable(this.getDOMNode());
    },
    componentWillUnmount: function componentWillUnmount() {
      this.interactable.unset();
      this.interactable = null;
    },

    render: function render() {
      var block = this.props.block;
      var items = [];
      var currentStatus = pageStatusDataStore.getCurrentStatus();
      for (var ind in block.objList) {
        items.push(React.createElement(DataItem, { key: block.objList[ind].FACTOR_GUID, item: block.objList[ind] }));
      }

      return React.createElement(
        "div",
        { className: "data-block", 
          "data-type": "TITLE", 
          "data-info": currentStatus + "-BLOCK",
          "data-category": block.title 
        },
        React.createElement(
          "span",
          { className: "data-title" },
          block.title
        ),
        items
      );
    }

  });

  var DataPanel = React.createClass({
    displayName: "DataPanel",


    getInitialState: function getInitialState() {
      return {
        dataPanelData: dataPanelDataStore.getData("INIT")
      };
    },

    onChange: function onChange(data) {
      this.setState({
        dataPanelData: data
      });
    },

    onStatusChange: function onStatusChange(data) {
      this.setState({
        dataPanelData: dataPanelDataStore.getData(data.currentStatus)
      });
    },

    componentDidMount: function componentDidMount() {
      this.unsubscribe = dataPanelDataStore.listen(this.onChange);
      this.unsubscribeStatus = pageStatusDataStore.listen(this.onStatusChange);
    },

    componentWillUnmount: function componentWillUnmount() {
      this.unsubscribe();
      this.unsubscribeStatus();
    },

    // componentWillUpdate: function() {
    //   this.setState({
    //     dataPanelData: dataPanelDataStore.getData(this.props.currentStatus)
    //   });
    // },

    render: function render() {
      var dataPanelData = this.state.dataPanelData;
      var blocks = [];
      for (var ind in dataPanelData) {
        blocks.push(React.createElement(DataBlock, { key: ind + "DataBlock", block: dataPanelData[ind] }));
      }

      return React.createElement(
        "div",
        { className: "data-panel" },
        blocks
      );
    }

  });/*
})(window.React, window.rc, window.antd, window.interact, window.dataPanelItemChangeAction, window.dataPanelDataStore, window.pageStatusDataStore, window);*/



export default DataPanel;  
