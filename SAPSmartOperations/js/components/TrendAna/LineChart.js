import React from "react"
import HighCharts from "highcharts"



	var LineChart = React.createClass({
		displayName: "LineChart",


		getInitialState: function getInitialState() {
			return {
				axisMin: this.props.axisMin,
				axisMax: this.props.axisMax,
				axisLimit: this.props.axisMax,
				showLabel: this.props.showLabel
			};
		},
		componentDidMount: function componentDidMount() {

			var axisMin = this.state.axisMin;
			var axisMax = this.state.axisMax;

			var axisArr = this.props.chartAxisArr.slice(axisMin, axisMax);
			var valueArr = this.props.chartValueArr;
			var nameArr = this.props.lineNameArr;
			var len = nameArr.length;

			/*this.setState({
   axisMin: this.props.axisMin,
   axisMax: this.props.axisMax
   });*/

			switch (this.props.factorCate) {
				case "B":
					var axisTitle = "Entries of Table";
					break;

				case "S":
					var axisTitle = "Response Time [ms]";
					break;

				case "R":
					var axisTitle = "Utility [%]";
					break;
				default:
					;
			}

			var seriesArr = [];

			seriesArr.push({

				name: nameArr,
				data: valueArr.slice(axisMin, axisMax)
			});

			this.chart = new HighCharts['Chart'](this.getDOMNode(), {
				chart: {
					type: "line"
				},
				title: {
					text: ''
				},
				credits: {
				    enabled: false
				},
				xAxis: {
					id: 'xAxis',
					categories: axisArr,
					tickInterval: Math.round((axisMax - axisMin) / 10),
					labels: {
						enabled: this.state.showLabel
					}
				},
				yAxis: {
					title: {
						text: axisTitle
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				series: seriesArr
			});
		},

		componentWillUnmount: function componentWillUnmount() {
			this.chart.destroy();
		},

		componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
			if (this.state.axisLimit < nextProps.axisMax) {
				this.setState({
					axisMin: nextProps.axisMin,
					axisMax: this.state.axisLimit,
					showLabel: nextProps.showLabel
				});
			} else {
				this.setState({
					axisMin: nextProps.axisMin,
					axisMax: nextProps.axisMax,
					showLabel: nextProps.showLabel
				});
			}
		},

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			if (this.state !== nextState) {
				return true;
			}
		},

		componentWillUpdate: function componentWillUpdate(nextProps, nextState) {

			var axisMin = nextState.axisMin;
			var axisMax = nextState.axisMax;

			var nameArr = nextProps.lineNameArr;
			var chartSeriesLen = this.chart.series.length;
			var axisArr = nextProps.chartAxisArr.slice(axisMin, axisMax);
			var dataLen = nameArr.length;
			var flag = chartSeriesLen - dataLen;

			/*this.setState({
   	axisMin: this.props.axisMin,
   	axisMax: this.props.axisMax
   });*/

			if (flag < 0) {
				var valueArr = nextProps.chartValueArr;

				var seriesObj = {
					name: nameArr,
					data: valueArr.slice(axisMin, axisMax)
				};
				this.chart.xAxis[0].update({
					tickInterval: Math.round((axisMax - axisMin) / 10),
					labels: {
						enabled: nextState.showLabel
					}
				});
				this.chart.get('xAxis').setCategories(axisArr, false);
				//this.chart.addSeries(seriesObj, false);
				this.chart.series[0].setData(seriesObj.data);
				//this.chart.redraw();
			} else if (flag > 0) {

				//this.chart.series.splice(1, chartSeriesLen - 1);
				for (var i = chartSeriesLen - 1; i > 0; i--) {
					this.chart.series[i].remove();
				}
				this.chart.redraw();
			} else {

				var valueArr = nextProps.chartValueArr;
				this.chart.xAxis[0].update({
					tickInterval: Math.round((axisMax - axisMin) / 10)
				});
				this.chart.get('xAxis').setCategories(axisArr, false);
				for (var i = 0; i < dataLen; i++) {
					var seriesObj = {
						//id: 'series-' + i,
						//name: nameArr[i],
						data: valueArr.slice(axisMin, axisMax)
					};

					this.chart.series[i].setData(seriesObj.data);
				}
				/*for (var i = chartSeriesLen - 1; i >= 0; i--) {
            this.chart.series[i].remove();
          }
    for (var i = 0; i < dataLen; i++) {
            var seriesObj = {
              name: nameArr[i],
              data: valueArr[i].slice(axisMin,axisMax)
            };
    this.chart.addSeries(seriesObj, false);
    }*/

				//this.chart.redraw();
			}
		},

		render: function render() {

			if (this.props.showLabel) {

				return React.createElement(
					"div",
					{ className: "line" },
					" "
				);
			} else {

				return React.createElement(
					"div",
					{ className: "line-item" },
					" "
				);
			}
		}
	});


export default LineChart;