'use strict';

(function (Reflux, global) {

  global.pageStatusChangeActions = Reflux.createActions(['pageStatusChangeAction', 'pageStatusAddAction', 'pageStatusRemoveAction']);

  var content = document.getElementById('content');
  var updateContentClassList = function updateContentClassList(pageStatus) {
    content.classList.forEach(function (item) {
      content.classList.remove(item);
    });

    if (pageStatus !== 'INIT') {
      content.classList.add('content-' + Math.floor(Math.random() * 3));
    }
  };

  global.pageStatusDataStore = Reflux.createStore({
    listenables: [global.pageStatusChangeActions],
    pageStatusData: {
      currentStatus: "INIT",
      pageStatusArr: ["INIT"]
    },
    onPageStatusChangeAction: function onPageStatusChangeAction(pageStatus) {
      this.pageStatusData.currentStatus = pageStatus;
      this.trigger(this.pageStatusData);

      updateContentClassList(pageStatus);
    },
    onPageStatusAddAction: function onPageStatusAddAction(pageStatus) {
      this.pageStatusData.pageStatusArr.push(pageStatus);
      this.pageStatusData.currentStatus = pageStatus;
      this.trigger(this.pageStatusData);

      updateContentClassList();
    },
    onPageStatusRemoveAction: function onPageStatusRemoveAction(removedPageStatus, newPageStatus) {
      this.pageStatusData.pageStatusArr.splice(this.pageStatusData.pageStatusArr.indexOf(removedPageStatus), 1);
      this.pageStatusData.currentStatus = newPageStatus;
      this.trigger(this.pageStatusData);

      updateContentClassList(newPageStatus);
    },
    getAllStatus: function getAllStatus() {
      return this.pageStatusData.pageStatusArr;
    },
    getCurrentStatus: function getCurrentStatus() {
      return this.pageStatusData.currentStatus;
    }
  });
})(window.Reflux, window);