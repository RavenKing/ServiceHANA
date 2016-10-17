	import React from "react";
	import {Form,Select,Radio,Steps,Button,Icon,message,Cascader,Input,Switch} from "antd"



	var CreateCardStep0 = React.createClass({
		onSetSkip: function() {
			
		},
		
		checkTechName: function(rule, value, callback) {

			if(!!value && !this.props.editObj){
				var type = this.props.form.getFieldValue('type');
				var item = this.props.content.objList;
				var itemLen = item.length;
				for(var i = 0; i < itemLen; i++){
					
					if(value === item[i].FACTOR_NAME){
						if(type[0] === item[i].FACTOR_CATEGORY && type[1] === item[i].FACTOR_TYPE){
							callback([new Error('Factor Name Existed')]);
						}
					}
				}
				callback();
			}
			else{
				callback();
			}
		},
		
		render: function(){
			var FormItem = Form.Item;
		    var Option = Select.Option;
		    var RadioButton = Radio.Button;
		    var RadioGroup = Radio.Group;
		    var Step = Steps.Step;
		    var ButtonGroup = Button.Group;
			
			var { getFieldProps } = this.props.form;

			
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

			
			return(
			
			  <div style={{ marginTop: 20 }}>
				<Form horizontal>
				
					<FormItem
					  label="Category / Type"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					  style={{ marginTop: 25 }}
					  required
					  validateStatus={(!!this.props.form.getFieldError('type')) ? 'error' : 'success'}
					  help={this.props.form.isFieldValidating('type') ? 'Validating...' : (this.props.form.getFieldError('type') || []).join(', ')}
					>
					  <Cascader  {...getFieldProps('type', { 
						initialValue: this.props.formData.type,
						validate:[{
							rules: [
								{required: true, type: 'array', message: 'Category & Type Cannot Be Empty'}
								],
							trigger: ['onBlur', 'onChange']

						}]
						})} options={areaData} />
					</FormItem>
				
					<FormItem
					  label="Technical Name"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					  required
					  validateStatus={(!!this.props.form.getFieldError('techName')) ? 'error' : 'success'}
					  help={this.props.form.isFieldValidating('techName') ? 'Validating...' : (this.props.form.getFieldError('techName') || []).join(', ')}
					>
					  <Input id="tech-input" {...getFieldProps('techName', { 
						initialValue: this.props.formData.techName,
						validate:[{
							rules: [
								{required: true, message: 'Factor Name Cannot Be Empty'}
								],
							trigger: 'onBlur'

						},{
							rules: [
								{max: 50, message: 'Factor Name Must Be Less Than 50 Chars'},
								{validator: this.checkTechName}
								],
							trigger: 'onChange'
						}]
						})} placeholder="Input Technical Name of Factor ..." />
					</FormItem>
					
					<FormItem
					  label="Business Name"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					  required
					  validateStatus={(!!this.props.form.getFieldError('busiName')) ? 'error' : 'success'}
					  help={this.props.form.isFieldValidating('busiName') ? 'Validating...' : (this.props.form.getFieldError('busiName') || []).join(', ')}
					>
					  <Input id="busi-input" {...getFieldProps('busiName', { 
						initialValue: this.props.formData.busiName, 
						validate:[{
							rules: [
								{required: true, message: 'Business Name Cannot Be Empty'}
								],
							trigger: ['onBlur']

						},{
							rules: [
								{max: 50, message: 'Business Name Must Be Less Than 50 Chars'}
								],
								trigger: 'onChange'
						}]						
					  })} placeholder="Input Business Description ..." />
					</FormItem>

					<FormItem
					  label="Update Frequency"
					  labelCol={{ span: 5 }}

					>
					  <RadioGroup {...getFieldProps('freq', { initialValue: this.props.formData.freq })}>
						<RadioButton value="1">hourly</RadioButton>
						<RadioButton value="2">daily</RadioButton>
						<RadioButton value="3">weekly</RadioButton>
						<RadioButton value="4">monthly</RadioButton>
					  </RadioGroup>
					</FormItem>
					
					<FormItem
					  label="Pin to Data Area"
					  labelCol={{ span: 5 }}

					>
					  <Switch {...getFieldProps('pin', {valuePropName: 'checked', initialValue: this.props.formData.pin})} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/>
					</FormItem>

				</Form> 
				
			  </div> 
			
			);
		}
		
	});


	CreateCardStep0 = Form.create()(CreateCardStep0);
	export default CreateCardStep0;