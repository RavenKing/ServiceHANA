'use strict';

(function ($, global) {

  var dragMoveListener = function dragMoveListener(event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  };

  global.resetPosition = function (ele) {
    ele.style.webkitTransform = ele.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
    ele.setAttribute('data-x', 0);
    ele.setAttribute('data-y', 0);
  };

  global.dragMoveListener = dragMoveListener;

  global.setCardDragable = function (ele, cardId) {
    var interactable = interact(ele);
    interactable.draggable({
      snap: {
        targets: [interact.createSnapGrid({ x: 20, y: 20 })],
        range: Infinity,
        relativePoints: [{ x: 0, y: 0 }]
      },
      restrict: {
        restriction: "#content",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      onmove: dragMoveListener,
      onend: function onend(event) {
        var x = event.dx,
            y = event.dy;
        global.displayAreaChangeActions.displayAreaUpdateCardPosAction(cardId, { topOffset: y, leftOffset: x });
      }
    });
    return interactable;
  };

  global.setNodeDragable = function (ele) {
    var interactable = interact(ele);
    interactable.draggable({
      onmove: global.dragMoveListener,
      onend: function onend(event) {
        event.target.style.webkitTransform = event.target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
        event.target.setAttribute('data-x', 0);
        event.target.setAttribute('data-y', 0);
      }
    });
    return interactable;
  };

  global.setAreaDropable = function (option) {
    var interactable = interact(option.element);
    interactable.dropzone({
      accept: option.accept, // seems no effect
      overlap: 0.1,
      ondropactivate: option.ondropactivate || function (event) {},
      ondragenter: option.ondragenter || function (event) {
        event.target.classList.add('drop-target');
      },
      ondragleave: option.ondragleave || function (event) {
        event.target.classList.remove('drop-target');
      },
      ondrop: option.ondrop || function (event) {
        event.target.classList.remove('drop-target');
      },
      ondropdeactivate: option.ondropdeactivate || function (event) {
        event.target.classList.remove('drop-target');
      }
    });
    return interactable;
  };

  global.handleFocus = function (ele) {
    $(ele).click(function () {
      $(ele).css("zIndex", 101);
      $(ele).siblings().css("zIndex", 100);
    });
  };

  global.setGlobalFree = function () {
    try {
      $('#loadingOverlay').fadeOut(200);
      document.getElementById('wrapper').classList.remove('blur-content');
    } catch (e) {}
  };

  global.setGlobalBusy = function () {
    try {
      $('#loadingOverlay').fadeIn(200);
      document.getElementById('wrapper').classList.remove('blur-content');
      document.getElementById('wrapper').classList.add('blur-content');
    } catch (e) {}
  };

  $(document).ajaxStart(function () {
    setGlobalBusy();
  });
  $(document).ajaxStop(function () {
    setGlobalFree();
  });
})(window.jQuery, window);