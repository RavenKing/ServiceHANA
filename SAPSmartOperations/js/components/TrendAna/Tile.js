import React from "react";
import {Table,LocaleProvider,Input } from "antd";
var displayAreaChangeActions = window.displayAreaChangeActions;
var global  = window;

var  Tile = React.createClass({
		displayName: "Tile",


		//-----
		//mixins: [componentMixin],
		componentWillMount:function componentWillMount() {
			var that = this;
			var item = this.props.content.objList;
			var data = [];

			var itemLen = item.length;

			for (var i = 0; i < itemLen; i++) {

				var type = this.typeTrans(item[i].FACTOR_TYPE);
				var pin = this.pinTrans(item[i].PIN);
				if(item[i].TREND == null){
					item[i].TREND = "no data";
				}
				else{
					item[i].TREND = item[i].TREND + "%";
				}
				data.push({
					key: item[i].FACTOR_GUID,
					factor_name: item[i].FACTOR_NAME,
					factor_business_name: item[i].FACTOR_BUSINESS_NAME,
					factor_type: type,
					factor_trend: item[i].TREND,
					factor_pin: pin
				});
			}
			this.setState({
				all_data:data
			});
		},
		componentDidMount: function componentDidMount() {
			//this.interactDrag = global.setNodeDragable(this.getDOMNode());
			global.handleFocus(this.getDOMNode());
		},
		componentWillUpdate: function componentWillUpdate() {
			global.resetPosition(this.getDOMNode());
		},
		onChange: function onChange(pagination, filters, sorter) {},
		pinTrans: function pinTrans(pin) {
			switch (pin) {
				case "X":
					return "X";
					break;
				default:
					return "";
			}
		},
		typeTrans: function typeTrans(type) {
			switch (type) {
				case "TBL":
					return "Table";
					break;
				case "DVM":
					return "Arch Obj";
					break;
				case "SYS":
					return "System Load";
					break;
				case "DIA":
					return "Dialog Job";
					break;
				case "BTC":
					return "Batch Job";
					break;
				case "RFC":
					return "RFC Call";
					break;
				default:
					return "";
			}
		},
		cateTrans: function cateTrans(cate) {
			switch (cate) {
				case "Table":
					return "B";
					break;
				case "Arch Obj":
					return "B";
					break;
				case "System Load":
					return "R";
					break;
				case "Dialog Job":
					return "S";
					break;
				case "Batch Job":
					return "S";
					break;
				case "RFC Call":
					return "S";
					break;
				default:
					return "";
			}
		},
		onRowClick: function onRowClick(record, index) {

			var data = {};
			data.style = {
				top: this.props.content.style.top + this.getDOMNode().clientHeight + 30,
				left: 240
			};

			//data.style.left = 300;
			//data.style.top = 100;

			data.type = "ITEM";
			data.guidArr = new Array(record.key.toString());
			data.FACTOR_NAME = new Array(record.factor_name);
			data.category = new Array(this.cateTrans(record.factor_type));

			displayAreaChangeActions.displayAreaAddCardAction(pageStatusDataStore.getCurrentStatus(), data);
		},
		filterSearch:function(e){
			var filterString = e.target.value;
			var items = this.state.all_data;

			var data = items.filter((item)=>{

        		if(item.factor_name.indexOf(filterString) > -1 || item.factor_business_name.indexOf(filterString) > -1){
        			return item;
        		}

      		});


      		this.setState({
      			data:data
      		});
		},
		//-----
		render: function render() {
			var data;
			if(!this.state.data){
				data = this.state.all_data;
			}
			else{
				data = this.state.data;
			}
			var pagination = {
				total: data.length,
				pageSize: 5,
				showSizeChanger: true,
				pageSizeOptions: ['5', '10', '20', '30'],
				onShowSizeChange: function onShowSizeChange(current, pageSize) {
					//console.log('Current: ', current, '; PageSize: ', pageSize);
				},
				onChange: function onChange(current) {
					//console.log('Current: ', current);
				}
			};

			var columns = [{
				title: 'Tech Object',
				dataIndex: 'factor_name',
				width: 200
				//sorter: (a, b) => a.factor_name - b.factor_name,
			}, {
				title: 'Factor Business Name',
				dataIndex: 'factor_business_name',
				width: 220
			}, {
				title: 'Type',
				dataIndex: 'factor_type',
				width: 80
			}, {
				title: 'Growth',
				dataIndex: 'factor_trend',
				width: 60
			}, {
				title: 'Sticked',
				dataIndex: "factor_pin",
				width: 60
			}];

			return(
				/*<Card className="tile" data-type="ITEM" data-factor_guid={this.props.content.FACTOR_GUID} data-factor_name={this.props.content.FACTOR_NAME} bodyStyle={{ paddingLeft: 10, paddingRight: 10 }}>
      {this.props.content.FACTOR_NAME}<br/>
    {this.props.content.FACTOR_BUSINESS_NAME}<br/>
      {this.props.content.TREND+"%"}<br/>
      {this.props.content.FACTOR_GUID}
    </Card>*/
				//var currentStatus = pageStatusDataStore.getCurrentStatus();
				//var item = this.props.item;
				React.createElement(Input,{ 
          				className:"margin-bottom10",
          				placeholder:"Search help",
          				size:"small",
          				onChange:this.filterSearch.bind(this)
          				},
						React.createElement(
							LocaleProvider,
							null,
							React.createElement(Table, { columns: columns, dataSource: data, pagination: pagination, scroll: { y: 300 }, onChange: this.onChange, onRowClick: this.onRowClick.bind(this) })
						)
				)
			)
		}
		
	});


export default Tile;