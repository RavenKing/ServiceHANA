'use strict';

(function (Reflux, $, global) {

  global.functionPanelItemChangeActions = Reflux.createActions(['functionPanelAddPageAction', 'functionPanelRemovePageAction']);

  global.functionPanelDataStore = Reflux.createStore({
    listenables: [global.functionPanelItemChangeActions],
    functionPanelData: [{
      pageStatus: "INIT",
      content: [{
        name: 'Analysis',
        info: 'ANALYSIS',
        type: 'ANALYSIS'
      }, {
        name: 'Knowledge',
        info: 'NOTE',
        type: 'NOTE'
      }]
    }],
    onFunctionPanelAddPageAction: function onFunctionPanelAddPageAction(pageStatus) {

      var anaType = pageStatus.substr(9,3);

      if(anaType == "RCA"){
        this.functionPanelData.push({
          pageStatus: pageStatus,
          content: [{
            name: "Root Cause",
            info: "RCA",
            type: "RCA"
          }, {
            name: "Simulate",
            info: "WHAT_IF",
            type: "WHAT_IF"
          }]
        });

      }
      else if(anaType == "DVM"){
        this.functionPanelData.push({
          pageStatus: pageStatus,
          content: [{
            name: "Data Strategy",
            info: "DVM_ANA",
            type: "DVM_ANA"
          }, {
            name:"Template",
            info:"ART_TEMP",
            type:"ART_TEMP"
          },
          {
            name: "Simulate",
            info: "DVM_SIM",
            type: "DVM_SIM"
          },{
            name:"Save Article",
            info:"SAVE",
            type:"SAVE"
          }/*,{
            name: "Knowledge",
            info: "NOTE",
            type: "NOTE"
          }*/]
        });


      }

      
    },
    onFunctionPanelRemovePageAction: function onFunctionPanelRemovePageAction(pageStatus) {
      var that = this;
      $.each(this.functionPanelData, function (idx, item) {
        if (item.pageStatus === pageStatus) {
          that.functionPanelData.splice(idx, 1);
          return false;
        }
      });
    },
    getData: function getData(pageStatus) {
      if (pageStatus) {
        var tmpData = [];
        $.each(this.functionPanelData, function (idx, item) {
          if (pageStatus === item.pageStatus) {
            tmpData = item.content;
            return false;
          }
        });

        return tmpData;
      } else {
        return this.functionPanelData;
      }
    },
    isStatusExisted: function isStatusExisted(pageStatus) {
      var flag = 0;
      $.each(this.functionPanelData, function (idx, item) {
        if (item.pageStatus === pageStatus) {
          flag = 1;
          return false;
        }
      });
      return !!flag;
    }

  });
})(window.Reflux, window.jQuery, window);