import React from "react"	
import Highcharts from "highcharts";


	var PieChart = React.createClass({
		displayName: "PieChart",

		componentDidMount: function componentDidMount() {
			var that = this;
			this.chart = new Highcharts['Chart'](this.getDOMNode(), {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				title: {
					text: ''
				},
				credits: {
				    enabled: false
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							color: '#000000',
							connectorColor: '#000000',
							format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						}
					}
				},
				series: [{
					type: "pie",
					name: "Category Share",
					data: that.props.seriesArr
				}],
				className: 'pie-chart'
			});
		},

		componentWillUnmount: function componentWillUnmount() {
			this.chart.destroy();
		},

		render: function render() {
			return React.createElement("div", { className: "pie" });
		}
	});

export default PieChart;