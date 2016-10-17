
import React from "react"
import {Icon,Button,Popover} from "antd";

var interact = window.interact;
var global = window;
var functionPanelDataStore = window.functionPanelDataStore;
var pageStatusChangeActions = window.pageStatusChangeActions;
var dataPanelItemChangeActions = window.dataPanelItemChangeActions;

var displayAreaChangeActions = window.displayAreaChangeActions;
var functionPanelItemChangeActions = window.functionPanelItemChangeActions
/*(function (React, rc, antd, interact, global) {
  if (!rc) {
    rc = window.rc = {};
  }

  var Icon = antd.Icon;
  var Button = antd.Button;
  var Popover = antd.Popover;
*/

  var getState = function getState() {
    var that = this;
    return {
      funs: functionPanelDataStore.getData(that.props.currentStatus)
    };
  };

  var SwitchButton = React.createClass({
    displayName: 'SwitchButton',

    handleChange: function handleChange(event) {
      pageStatusChangeActions.pageStatusChangeAction(event.target.parentNode.getAttribute('data-status'));
    },
    handleDelete: function handleDelete(event) {
      pageStatusChangeActions.pageStatusRemoveAction(event.target.parentNode.getAttribute('data-status'), 'INIT');
      dataPanelItemChangeActions.dataPanelRemovePageAction(event.target.parentNode.getAttribute('data-status'));
      displayAreaChangeActions.displayAreaRemovePageAction(event.target.parentNode.getAttribute('data-status'));
      functionPanelItemChangeActions.functionPanelRemovePageAction(event.target.parentNode.getAttribute('data-status'));
    },
    render: function render() {
      var statuses = pageStatusDataStore.getAllStatus();
      var currentStatus = pageStatusDataStore.getCurrentStatus();
      var options = [];
      for (var i = 0; i < statuses.length; i++) {
        if (statuses[i] == 'INIT') {
          if (statuses[i] == currentStatus) {
            options.push(React.createElement(
              'li',
              { disabled: true },
              React.createElement(
                'span',
                null,
                statuses[i]
              )
            ));
          } else {
            options.push(React.createElement(
              'li',
              { 'data-status': statuses[i] },
              React.createElement(
                'span',
                { onClick: this.handleChange },
                statuses[i]
              )
            ));
          }
        } else {
          if (statuses[i] == currentStatus) {
            options.push(React.createElement(
              'li',
              { disabled: true },
              React.createElement(
                'span',
                null,
                statuses[i]
              ),
              React.createElement(Icon, { type: 'cross', disabled: true })
            ));
          } else {
            options.push(React.createElement(
              'li',
              { 'data-status': statuses[i] },
              React.createElement(
                'span',
                { onClick: this.handleChange },
                statuses[i]
              ),
              React.createElement(Icon, { type: 'cross', onClick: this.handleDelete })
            ));
          }
        }
      }
      var list = React.createElement(
        'ul',
        null,
        options
      );
      return React.createElement(
        'div',
        null,
        React.createElement(
          Popover,
          { content: list,
            placement: 'left',
            overlayClassName: 'switch-button-overlay'
            //  getPopupContainer={() => document.getElementsByClassName('function-panel')[0]}
          },
          React.createElement(
            'span',
            { className: 'function-button switch-button' },
            React.createElement(Icon, { type: 'left' }),
            ' Switch View'
          )
        )
      );
    }
  });

  var FunctionButton = React.createClass({
    displayName: 'FunctionButton',

    componentDidMount: function componentDidMount() {
      this.interactDrag = global.setNodeDragable(this.getDOMNode());
    },
    componentWillUnmount: function componentWillUnmount() {
      this.interactDrag.unset();
      this.interactDrag = null;
    },
    render: function render() {
      var type = 'ghost';

      if (this.props.fun.type == 'NOTE' || this.props.fun.type == "SAVE_KM") {
        return React.createElement(
          Button,
          { className: 'function-button-nav draggable', size: 'large',
            type: type, 'data-info': this.props.fun.info, 'data-type': this.props.fun.type, icon: 'hdd' },
            
          this.props.fun.name
        );
      } 
      //else if(this.props.fun.type == '')
      else {
        return React.createElement(
          Button,
          { className: 'function-button draggable', size: 'large',
            type: type, 'data-info': this.props.fun.info, 'data-type': this.props.fun.type, icon: 'search'  },
            
          this.props.fun.name
        );
      }
    }
  });

  var ConfigButtonItem = React.createClass({
    displayName: 'ConfigButtonItem',

    componentDidMount: function componentDidMount() {
      this.interactDrag = global.setNodeDragable(this.getDOMNode());
    },
    componentWillUnmount: function componentWillUnmount() {
      this.interactDrag.unset();
      this.interactDrag = null;
    },
    render: function render() {
      var type = 'dashed';
      return React.createElement(
        Button,
        { className: 'config-button draggable', size: 'small',
          type: type, 'data-info': this.props.item.info },
        this.props.item.name
      );
    }
  });

  var ConfigButtonItemCreate = React.createClass({
    displayName: 'ConfigButtonItemCreate',

    componentDidMount: function componentDidMount() {
      this.interactDrag = global.setNodeDragable(this.getDOMNode());
    },
    componentWillUnmount: function componentWillUnmount() {
      this.interactDrag.unset();
      this.interactDrag = null;
    },
    render: function render() {
      var type = 'dashed';
      return React.createElement(
        Button,
        { className: 'config-create-button draggable', size: 'small',
          type: type, 'data-info': this.props.item.info, 'data-type': this.props.item.info },
        this.props.item.name
      );
    }
  });

  var ConfigButtonItemUpload = React.createClass({
    displayName: 'ConfigButtonItemUpload',

    componentDidMount: function componentDidMount() {
      this.interactDrag = global.setNodeDragable(this.getDOMNode());
    },
    componentWillUnmount: function componentWillUnmount() {
      this.interactDrag.unset();
      this.interactDrag = null;
    },
    render: function render() {
      var type = 'dashed';
      return React.createElement(
        Button,
        { className: 'config-upload-button draggable', size: 'small',
          type: type, 'data-info': this.props.item.info, 'data-type': this.props.item.info },
        this.props.item.name
      );
    }
  });


  var ConfigButton = React.createClass({
    displayName: 'ConfigButton',


    render: function render() {

      var options = [];
      var items2 = [{
        name: "UPLOAD FILE",
        info: "UPLOAD"
      }];

      var items1 = [{
        name: "EDIT OBJECT",
        info: "EDIT"
      }, {
        name: "DELETE OBJECT",
        info: "DELETE"
      }, {
        name: "ADD FAVORATE",
        info: "MARK"
      }];

      var items = [{
        name: "CREATE OBJECT",
        info: "CREATE"
      }];
      items.forEach(function (item) {
        options.push(React.createElement(
          'li',
          null,
          React.createElement(
            'span',
            null,
            React.createElement(ConfigButtonItemCreate, { item: item })
          )
        ));
      });
      items1.forEach(function (item) {
        options.push(React.createElement(
          'li',
          null,
          React.createElement(
            'span',
            null,
            React.createElement(ConfigButtonItem, { item: item })
          )
        ));
      });
      items2.forEach(function (item) {
        options.push(React.createElement(
          'li',
          null,
          React.createElement(
            'span',
            null,
            React.createElement(ConfigButtonItemUpload, { item: item })
          )
        ));
      });
      var list = React.createElement(
        'ul',
        null,
        options
      );
      return React.createElement(
        'div',
        null,
        React.createElement(
          Popover,
          { content: list,
            placement: 'left',
            overlayClassName: 'switch-button-overlay'
            //  getPopupContainer={() => document.getElementsByClassName('function-panel')[0]}
          },
          React.createElement(
            'span',
            { className: 'function-button switch-button' },
            React.createElement(Icon, { type: 'left' }),
            ' Actions'
          )
        )
      );
    }

  });

  var FunctionList = React.createClass({
    displayName: 'FunctionList',

    render: function render() {

      if(pageStatusDataStore.getCurrentStatus() == "INIT"){
        var buttons = [];
        this.props.funs.forEach(function (fun) {
          buttons.push(React.createElement(FunctionButton, { fun: fun }));
        });
        buttons.push(React.createElement(ConfigButton, null));
        buttons.push(React.createElement(SwitchButton, null));


      }
      else{
        var buttons = [];
        this.props.funs.forEach(function (fun) {
          buttons.push(React.createElement(FunctionButton, { fun: fun }));
        });
        buttons.push(React.createElement(SwitchButton, null));


      }

      return React.createElement(
        'div',
        { className: 'function-list' },
        buttons
      );
    }
  });

  var FunctionPanel = React.createClass({
    displayName: 'FunctionPanel',

    getInitialState: function getInitialState() {
      return {
        funs: functionPanelDataStore.getData("INIT")
      };
    },

    onChange: function onChange(data) {
      this.setState({
        funs: data
      });
    },

    onStatusChange: function onStatusChange(data) {
      this.setState({
        funs: functionPanelDataStore.getData(data.currentStatus)
      });
    },

    componentDidMount: function componentDidMount() {
      this.unsubscribe = functionPanelDataStore.listen(this.onChange);
      this.unsubscribeStatus = pageStatusDataStore.listen(this.onStatusChange);
    },

    componentWillUnmount: function componentWillUnmount() {
      this.unsubscribe();
      this.unsubscribeStatus();
    },

    // componentWillUpdate: function() {
    //   this.setState(getState());
    // },

    render: function render() {
      
      return React.createElement(
        'div',
        { className: 'function-panel' },
        React.createElement(FunctionList, { funs: this.state.funs })
      );
    }
  });/*
})(window.React, window.rc, window.antd, window.interact, window);*/

export default FunctionPanel