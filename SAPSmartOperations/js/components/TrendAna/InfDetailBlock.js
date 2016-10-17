	import React from "react"
	import {Tooltip} from "antd"
	var InfDetailBlock = React.createClass({
		displayName: "InfDetailBlock",

		render: function render() {
			var objList = this.props.objs;
			var map = {
				B: 'Business Volume',
				S: 'Service Response',
				R: 'Resource'
			};
			var objs = {};
			var objArr = [];
			for (var i = 0; i < objList.length; i++) {
				var li = React.createElement(
					"li",
					{ key: i },
					React.createElement(
						Tooltip,
						{ placement: "right", title: 'Influence rate: ' + parseFloat(objList[i].INFLUENCE_RATE).toFixed(2) },
						React.createElement(
							"span",
							null,
							objList[i].FACTOR_NAME
						)
					)
				);
				if (objs[map[objList[i].FACTOR_CATEGORY]]) {
					objs[map[objList[i].FACTOR_CATEGORY]].push(li);
				} else {
					objs[map[objList[i].FACTOR_CATEGORY]] = [li];
				}
			}
			// convert into array
			for (var obj in objs) {
				objArr.push({
					category: obj,
					list: objs[obj]
				});
			}
			return React.createElement(
				"div",
				{ className: "inf-detail" },
				objArr.map(function (item) {
					return React.createElement(
						"div",
						null,
						React.createElement(
							"h3",
							null,
							item.category
						),
						React.createElement(
							"ul",
							null,
							item.list
						)
					);
				})
			);
		}
	});

export default InfDetailBlock