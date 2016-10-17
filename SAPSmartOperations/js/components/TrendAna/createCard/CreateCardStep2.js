import React from "react"
import {Form} from "antd"


//CreateCardStep1 = Form.create()(CreateCardStep1);
	var  CreateCardStep2 = React.createClass({
		
	  pinTrans: function(pin){
		switch(pin){
			case true:
				return "Yes";
				break;
			default:
				return "No";
		}
	  },
	  freqTrans: function(freq){
		switch(freq){
			case "1":
				return "hourly";
				break;
			case "2":
				return "daily";
				break;
			case "3":
				return "weekly";
				break;
			case "4":
				return "monthly";
				break;
			default:
				return "";
		}  
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
	  cateTrans: function(cate){
		switch(cate){
			case "S":
				return "Service";
				break;
			case "B":
				return "Business";
				break;
			case "R":
				return "Resource";
				break;
			default:
				return "";
		}
	  },
		
		render: function(){
			var FormItem = Form.Item;
			return(
			
			  <div style={{ marginTop: 25 }}>
			    <h5>Please confirm the following information:</h5>	
				<Form horizontal style={{ marginTop: 25 }}>
				
					<FormItem className="form-item"
					  label="Factor Name"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					>
					  <h6>{this.props.formData.techName}</h6>
					</FormItem>
					<FormItem className="form-item"
					  label="Description"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					>
					  <h6>{this.props.formData.busiName}</h6>
					</FormItem>
					<FormItem className="form-item"
					  label="Category"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					>
					  <h6>{this.cateTrans(this.props.formData.type[0])}</h6>
					</FormItem>
					<FormItem className="form-item"
					  label="Type"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					>
					  <h6>{this.typeTrans(this.props.formData.type[1])}</h6>
					</FormItem>
					<FormItem className="form-item"
					  label="Aggregation"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					>
					  <h6>{this.freqTrans(this.props.formData.freq)}</h6>
					</FormItem>
					<FormItem className="form-item"
					  label="Pin or not"
					  labelCol={{ span: 5 }}
					  wrapperCol={{ span: 17 }}
					>
					  <h6>{this.pinTrans(this.props.formData.pin)}</h6>
					</FormItem>
				
				</Form>	
			  </div> 
			  
			  
			
			);
		}
		
	});

	export default CreateCardStep2