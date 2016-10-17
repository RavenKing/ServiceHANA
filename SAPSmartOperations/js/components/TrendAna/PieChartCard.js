import React from "react"
import {Card,Icon } from "antd"
var global = window;

import PieChart from "./PieChart"
import InfDetailBlock from "./InfDetailBlock"
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








var PieChartCard = React.createClass({
		displayName: "PieChartCard",

		mixins: [componentMixin],
		componentDidMount: function componentDidMount() {
			this.interactable = global.setCardDragable(this.getDOMNode(), this.props.card.id);
			global.handleFocus(this.getDOMNode());
		},
		componentWillUpdate: function componentWillUpdate() {
			global.resetPosition(this.getDOMNode());
		},
		render: function render() {
			return React.createElement(
				Card,
				{ className: "pie-card",
					title: "Why This Performance Issue Happened(By Probability)?",
					style: this.props.card.style,
					extra: React.createElement(Icon, { type: "cross", onClick: this.removeCard().bind(this) }),
					bodyStyle: {
						padding: 0
					} },
				React.createElement(PieChart, { seriesArr: this.props.card.seriesArr }),
				" ",
				React.createElement(InfDetailBlock, { objs: this.props.card.objList
				}),
				" "
			);
		}
	});
export default PieChartCard