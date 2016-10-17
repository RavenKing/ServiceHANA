import React from "react";
import { Card,message,Icon } from "antd";
import Tile from "./Tile";
var global = window;
var pageStatusDataStore = window.pageStatusDataStore;
var displayAreaChangeActions = window.displayAreaChangeActions
	var componentMixin = {
		removeCard: function removeCard() {
			var that = this;
			return function () {
				// if (that.interactable) {
				//   that.interactable.unset();
				//   that.interactable = null;
				// }
				// if (that.interactDrag) {
				//   that.interactDrag.unset();
				//   that.interactDrag = null;
				// }
				// if (that.interactDrop) {
				//   that.interactDrop.unset();
				//   that.interactDrop = null;
				// }
				var currentStatus = pageStatusDataStore.getCurrentStatus();

				if (currentStatus === "INIT" || this.props.card.type !== "ITEM" || currentStatus.indexOf(this.props.card.FACTOR_NAME[0]) < 0) {

					displayAreaChangeActions.displayAreaRemoveCardAction(currentStatus, that.props.card.id);
				} else {

					message.warning('Can\'t remove object card which is being analyzed.');
				}
			};
		}
	};


var DataCard = React.createClass({
		displayName: "DataCard",

		mixins: [componentMixin],
		componentDidMount: function componentDidMount() {
			this.interactDrag = global.setCardDragable(this.getDOMNode(), this.props.card.id);
			global.handleFocus(this.getDOMNode());
		},
		componentWillUpdate: function componentWillUpdate() {
			global.resetPosition(this.getDOMNode());
		},
		render: function render() {

			return React.createElement(
				Card,
				{ className: "data-card",
					title: this.props.card.title,
					style: this.props.card.style,
					extra: React.createElement(Icon, { type: "cross", onClick: this.removeCard().bind(this) }) },


				/*this.props.card.objList.map(function(item) {	
      return (<rc.Tile content={this.props.card.objList} />);
          })*/	
				React.createElement(Tile, { content: this.props.card }),
				" "
			);
		}
	});


export default DataCard;