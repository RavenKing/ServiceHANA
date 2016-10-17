import React from "react"
import {Form,Select,Radio,Steps,Button,Icon,message,Cascader,Input,Switch,Table} from "antd"

var  CreateCardStep1 = React.createClass({
		
		getInitialState: function() {
			return {
			  skip: this.props.formData.skip,
			  objList: this.props.formData.objList
			};
		},
		
		onSetSkip: function(checked){
			this.setState({
				skip: checked
			});
		},
		
		typeTrans: function(type){
			switch(type){
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
		  
		  checkValidity: function() {
			  
			  if(this.state.skip){

				  return true;
			  }
			  else{

				  if(this.state.objList.length != 0){

					  return true;
				  }
				  else{

					  return false;
				  }
			  }
		  },
		
		render: function(){
			var FormItem = Form.Item;
		    var Option = Select.Option;
		    var RadioButton = Radio.Button;
		    var RadioGroup = Radio.Group;
		    var Step = Steps.Step;
		    var ButtonGroup = Button.Group;
			
			var areaData = [{
			  value: 'B',
			  label: 'Business',
			  children: [{
				value: 'TBL',
				label: 'Table',
			  },{
			    value: 'DVM',
				label: 'DVM Object',
			  }],
			},{
			  value: 'S',
			  label: 'Service',
			  children: [{
				value: 'BTC',
				label: 'Background Job',
			  },{
				value: 'DIA',
				label: 'Dialog Transaction',
			  },{
				value: 'RFC',
				label: 'RFC Call',
			  }],
			},{
			  value: 'R',
			  label: 'Resource',
			  children: [{
				value: 'SYS',
				label: 'System Load',
			  }],
			}];
			
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
			}];
			
			var item = this.props.content.objList;
			var data = [];

			var itemLen = item.length;
			
			for (var i = 0; i < itemLen; i++) {
			  
			  var type = this.typeTrans(item[i].FACTOR_TYPE) ;
			  
			  data.push({
				key:item[i].FACTOR_GUID,
				factor_name: item[i].FACTOR_NAME,
				factor_business_name: item[i].FACTOR_BUSINESS_NAME,
				factor_type: type
			  });
			}
			
			var pagination = {
				total: data.length,//------
				pageSize: 5,
				showSizeChanger: true,
				pageSizeOptions: ['5', '10', '20', '30'],
				onShowSizeChange(current, pageSize) {
					//console.log('Current: ', current, '; PageSize: ', pageSize);
				},
				onChange(current) {
					//console.log('Current: ', current);
				}
			};
			if(this.state.skip){
				
				var rowSelection = {
				  selectedRowKeys: this.state.objList,
				  onChange(selectedRowKeys, selectedRows) {
					//console.log('selectedRowKeys: ${selectedRowKeys}', 'selectedRows: ', selectedRows);
				  },
				  onSelect(record, selected, selectedRows) {
					//console.log(record, selected, selectedRows);
				  },
				  onSelectAll(selected, selectedRows, changeRows) {
					//console.log(selected, selectedRows, changeRows);
				  },
				  getCheckboxProps: record => ({
					disabled: record.key != ''
				  }),
				};
			}
			else{
				var that = this;
				var rowSelection = {
				  selectedRowKeys: this.state.objList,
				  onChange(selectedRowKeys, selectedRows) {
					//console.log('onChange');
					//console.log('selectedRowKeys: ', selectedRowKeys, 'selectedRows: ', selectedRows);

					that.setState({
						objList: selectedRowKeys
					});

				  },
				  onSelect(record, selected, selectedRows) {
					//console.log('onSelect');
					//console.log(record, selected, selectedRows);
				  },
				  onSelectAll(selected, selectedRows, changeRows) {
					//console.log('onSelectAll');
					//console.log(selected, selectedRows, changeRows);
				  },
				  getCheckboxProps: record => ({
					disabled: record.key === ''
				  }),
				};
			}
			
			
			return(
			
			  <div style={{ marginTop: 20 }}>
			    <Form>
					<FormItem
					  label="Skip Factor Selection"
					  labelCol={{ span: 6 }}
					  validateStatus={(!!this.checkValidity()) ? 'success' : 'warning'}
					  help={(!!this.checkValidity()) ? 'Factor selection Skiped. Pre-difine template will be used.' : 'Please select at least one factor, or switch to SKIP.'}
					>
						<Switch defaultChecked={this.state.skip} onChange={this.onSetSkip} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
					</FormItem>
					<Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} scroll={{ y: 280 }} onChange={this.onChange}/>
				</Form>				
			  </div> 
			
			);
		}
		
	});

	export default CreateCardStep1;