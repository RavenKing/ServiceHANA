import React from "react"
import {message,Alert } from "antd"
	let CreateCardStep3 = React.createClass({
		
		render: function(){
			
			if(this.props.editObj){
				var successInfo = "Object # " + this.props.formData.techName + " # Has Been Successfully Updated !";
			}
			else{
				var successInfo = "New Object # " + this.props.formData.techName + " # Has Been Successfully Created !";
			}
			
			return(
			
			  <div style={{ marginTop: 25 }}>
			    
				<Alert message="Success"
					description={successInfo}
					type="success"
					showIcon
				/>
			  </div> 
			
			);
		}
		
	});
	export default CreateCardStep3;