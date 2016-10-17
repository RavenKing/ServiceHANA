import React from "react";
import ReactDOM from "react-dom";
import { 
          Form,Button,Card,Checkbox,
          Icon,Input,Modal,Row,Col,
          InputNumber,Popover
        } from "antd";
import { connect } from "react-redux";
import { RemoveCard,UpdateArticle,fetchArticles } from "../../Actions/KnowledgeAction";
import { setCardDragable,handleFocus } from "../../interactScript";

import ArchivingForm from "../CreatePanel/ArchivingForm";
import AvoidanceForm from "../CreatePanel/AvoidanceForm";
import SummarizationForm from "../CreatePanel/SummarizationForm";
import DeletionForm from "../CreatePanel/DeletionForm";

const FormItem=Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect((store)=>{
    return {
        articles:store.articles
    };
    
})
export default class EditPanel extends React.Component{
  constructor(props)
    {
        super(props);

        this.state={
            
            DVM:[],
            updateFields:{
              article_id:this.props.article.ARTICLE_ID,
              factor_guid:this.props.article.FACTOR_GUID,
              customer_id:this.props.article.CUSTOMER_ID,
              article_nam:this.props.article.ARTICLE_NAM,
              article_dsc:this.props.article.ARTICLE_DSC,
              archobj:this.props.article.ARCHOBJ,
              tables:this.props.article.TABLES,
              create_by:this.props.article.CREATE_BY,
              avoidance:this.props.article.AVOIDANCE,
              summarization:this.props.article.SUMMARIZATION,
              archiving:this.props.article.ARCHIVING,
              retention:this.props.article.RETENTION,
              deletion:this.props.article.DELETION,
              saving_est:this.props.article.SAVING_EST,
              saving_est_p:this.props.article.SAVING_EST_P,
              saving_act:this.props.article.SAVING_ACT,
              saving_act_p:this.props.article.SAVING_ACT_P,
              comment:this.props.article.COMMENT
            }                     
        
        }
  }

	closeEdit(){
      var data = {
        data_id:this.props.article.ARTICLE_ID,
        type:"edit"
      };
		  this.props.dispatch(RemoveCard(data));
      
	}
  componentWillMount(){
      
      //set default value for dvm methods and default text areas
      var defaultStrategyTextAreas = [];
      var defaultValues = [];

      //if 'Avoidance' field has been set
      if(this.props.article.AVOIDANCE){
        defaultValues.push("Avoidance");

      }
      //if 'Summarization' field has been set
      if(this.props.article.SUMMARIZATION){
        defaultValues.push("Summarization");
        
      }
      //if 'Deletion' field has been set
      if(this.props.article.DELETION){
        defaultValues.push("Deletion");
        
      }
      //if 'ARCHIVING' field has been set
      if(this.props.article.ARCHIVING){
        defaultValues.push("Archiving");
        
      }

      this.setState({
        DVM:defaultValues,
        x:this.props.display.x,
        y:this.props.display.y
      });

  }
	componentDidMount() {

    	setCardDragable(ReactDOM.findDOMNode(this));     
      handleFocus(ReactDOM.findDOMNode(this));   
	}
  handleChange(e){

    var control_id = e.target.id;
    var value = e.target.value;
    var { updateFields } = this.state;
    
    switch(control_id){
      case "control-article_nam":
      {
          updateFields.article_nam = value;
          break;
      }
      case "control-article_dsc":
      {
          updateFields.article_dsc = value;
          break;
      }
      case "control-archobj":
      {
          updateFields.archobj = value;
          break;
      }
      case "control-tbl":{
          var id = e.target.getAttribute('data-id');
          updateFields.tables[id].TBL_SIZE = value;
          console.log(updateFields);
          break;
      }
      case "control-tbl_dsc":
      {
          var id = e.target.getAttribute('data-id')
          updateFields.tables[id].ATTR_DSC = value;
          console.log(updateFields);
          break;
      }
      case "control-sum":
      {
          updateFields.summarization = value;
          break;
      }
      case "control-avd":
      {
          updateFields.avoidance= value;
          break;
      }
      case "control-arc":
      {
          updateFields.archiving= value;
          break;
      }
      case "control-del":
      {
          updateFields.deletion = value;
          break;
      }
      case "control-sav_est":
      {
          updateFields.saving_est = value;
          break;
      }
      case "control-sav_est_p":
      {
          updateFields.saving_est_p = value;
          break;
      }
      case "control-sav_act":
      {
          updateFields.saving_act = value;
          break;
      }
      case "control-sav_act_p":
      {
          updateFields.saving_act_p = value;
          break;
      }
      case "control-comm":
      {
          updateFields.comment = value;
          break;
      }
    }
    this.setState({
      updateFields:updateFields
    });

    
  }
  handleClick(){
   
    const { DVM } =  this.state;
    var { updateFields } = this.state;
    var validInput = true;
    for(var i = 0; i < updateFields.tables.length;i++){
      if(isNaN(updateFields.tables[i].TBL_SIZE)){
        validInput = false;
         const modal = Modal.warning({
            title: 'Warning! ',
            content: 'Please input the correct number'
          });
          
        break;
      }
    }

    if(isNaN(updateFields.saving_est)){
      validInput = false;
         const modal = Modal.warning({
            title: 'Warning! ',
            content: 'Please input the correct number'
          });
    }
    if(isNaN(updateFields.saving_est_p)){
      validInput = false;
      const modal = Modal.warning({
            title: 'Warning! ',
            content: 'Please input the correct number'
          });
    }
    if(isNaN(updateFields.saving_act)){
      validInput = false;
      const modal = Modal.warning({
            title: 'Warning! ',
            content: 'Please input the correct number'
          });
    }
    if(isNaN(updateFields.saving_act_p)){
      validInput = false;
      const modal = Modal.warning({
            title: 'Warning! ',
            content: 'Please input the correct number'
          });
    }
    //input valid
    if(validInput){

      var checked = false;
      //avoidance
      for(var i = 0;i < DVM.length;i++){
        if("Avoidance"== DVM[i]){
          checked = true;
          break;        
        }
      }
      if(checked == false){
        updateFields.avoidance=""
      }
      checked = false;
      //summarization
      for(var i = 0;i < DVM.length;i++){
        if("Summarization"== DVM[i]){
          checked = true;
          break;        
        }
      }
      if(checked == false){
        updateFields.summarization=""
      }
      checked = false;
      for(var i = 0;i < DVM.length;i++){
        if("Archiving"== DVM[i]){
          checked = true;
          break;        
        }
      }
      if(checked == false){
        updateFields.archiving=""
      }
      checked = false;
      for(var i = 0;i < DVM.length;i++){
        if("Deletion"== DVM[i]){
          checked = true;
          break;        
        }
      }
      if(checked == false){
        updateFields.deletion=""
      }
      this.setState({
        updateFields:updateFields
      });
      this.props.dispatch(UpdateArticle(this.state.updateFields));
      this.closeEdit();

    }
    
  }
  onChange(checkedValues){
    this.setState({
      DVM:checkedValues
    });
  }
  onNumberChange(value){
      console.log(value);
      var { updateFields } = this.state;
      updateFields.retention = value;
      this.setState({
        updateFields:updateFields
      });
  }

	render(){

      const DVM_Methods = [
         
          {label:"Avoidance",value:"Avoidance"},
          {label:"Summarization",value:"Summarization"},
          {label:"Deletion",value:"Deletion"},
          {label:"Archiving",value:"Archiving"}
      ]

      const { DVM } = this.state;   
      var that = this; 
      var pos = {
        top: this.state.y+'px',
        left:this.state.x+'px'
      };
    
      //set checked text areas
      var checkedStrategyTextAreas = DVM.map((one)=>{
      switch(one){
        case "Avoidance":{
          return (
            <Form horizontal >   
        
              <FormItem
                id="control-avd"
                label="Avoidance:"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 10}}                
              >
              <Input type="textarea" id="control-avd" defaultValue={that.props.article.AVOIDANCE} placeholder="Current Strategy Of your System" onChange={that.handleChange.bind(that)} />
              </FormItem>

            </Form>
          )
        }
        case "Summarization":{
          return (
            <Form horizontal >   
        
              <FormItem
                id="control-sum"
                label="Summarization:"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 10}}                
              >
              <Input type="textarea" id="control-sum" defaultValue={that.props.article.SUMMARIZATION} placeholder="Current Strategy Of your System" onChange={that.handleChange.bind(that)} />
              </FormItem>

            </Form>
          )
        }
        case "Deletion":{
          return (
            <Form horizontal >   
        
              <FormItem
                id="control-del"
                label="Deletion:"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 10}}                
              >
              <Input type="textarea" id="control-del" defaultValue={that.props.article.DELETION} placeholder="Current Strategy Of your System" onChange={that.handleChange.bind(that)} />
              </FormItem>

            </Form>
          )
        }
        case "Archiving":{
          return (

            <Form horizontal > 
              <FormItem
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 10}} 
                label="Retention Time"
              >
               
                  <div>
                    <InputNumber id="control-ret" min={12} max={999} defaultValue={that.props.article.RETENTION}  onChange={that.onNumberChange.bind(that)}/> <p className="ant-form-text" >Month</p>
                  </div>
               
              </FormItem>  
        
              <FormItem
                id="control-arc"
                label="Archiving:"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 10}}                
              >
              <Input type="textarea" id="control-arc" defaultValue={that.props.article.ARCHIVING} placeholder="Current Strategy Of your System" onChange={that.handleChange.bind(that)} />
              </FormItem>

            </Form>
          )
        }

      }
    }); 

		return (
			<div className="edit-panel" style={pos}>
				<Card title={"Edit Article"} extra={<Icon type="cross"  onClick={this.closeEdit.bind(this)}/>}>
      			<p>Basic Information</p>
      			<hr />
      			<br />
      			<Form horizontal>
    					<FormItem
      						id="control-article_nam"
      						label="Article Name:"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input id="control-article_nam" defaultValue={this.props.article.ARTICLE_NAM} onChange={this.handleChange.bind(this)} />
    					</FormItem>

    					<FormItem
      						id="control-article_dsc"
      						label="Article Description:"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10}}
    					>
      					<Input id="control-article_dsc" defaultValue={this.props.article.ARTICLE_DSC} onChange={this.handleChange.bind(this)} />
    					</FormItem>

    					<FormItem
      						id="control-archobj"
      						label="Archiving Object:"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input id="control-archobj" defaultValue={this.props.article.ARCHOBJ} onChange={this.handleChange.bind(this)}/>
    					</FormItem>    					
    				</Form>

            <p>Tables</p>
            <hr />
            <br />
            <Form horizontal className="ant-advanced-search-form">
              <Row gutter={16}>
                <Col sm={12}>
                {
                  this.props.article.TABLES.map((table,idx)=>{
      
                    return (
       
                      <FormItem
                        id="control-tbl"
                        label={table.ATTR_NAM}
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 12 }}
                      >
                        <Col span="15">
                          <Input id="control-tbl" data-id={idx} defaultValue={table.TBL_SIZE} onChange={that.handleChange.bind(that)} />
                        </Col>
                        <Col span="3">
                          <p className="ant-form-split">GB</p>
                        </Col>
                      </FormItem>
                      )
                    })
                  }
                  </Col>
                  <Col sm={12}>
                  {
                    this.props.article.TABLES.map((table,idx)=>{
                      return (
                        <FormItem
                          id="control-tbl_dsc"
                          label="Description:"
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }}
                        >
                          <Input id="control-tbl_dsc" data-id={idx} defaultValue={table.ATTR_DSC} onChange={that.handleChange.bind(that)} />

                        </FormItem>
                      )
                    })
                  }
                  </Col>
              </Row>
            </Form>

           

    				<p>Dvm Methods</p>
      			<hr />
      			<br/>
    				<div className="aligncenter margin-bottom10">
      					<CheckboxGroup options={DVM_Methods} defaultValue={this.state.DVM} onChange={this.onChange.bind(this)}/>
      			</div>

            
            { checkedStrategyTextAreas }
            
    					

    				<p>Saving Potential</p>
      				<hr />
      				<br />
      				<Form horizontal>
      					<FormItem
      						id="control-sav_est"
      						label="Estimated Saving Potential(GB):"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input id="control-sav_est" defaultValue={this.props.article.SAVING_EST} onChange={this.handleChange.bind(this)}/>
    					</FormItem>

    					<FormItem
      						id="control-sav_est_p"
      						label="Estimated Saving Potential(%):"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input id="control-sav_est_p" defaultValue={this.props.article.SAVING_EST_P} onChange={this.handleChange.bind(this)}/>
    					</FormItem>

      					<FormItem
      						id="control-sav_act"
      						label="Actual Saving Potential(GB):"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input id="control-sav_act" defaultValue={this.props.article.SAVING_ACT} onChange={this.handleChange.bind(this)}/>
    					</FormItem>

    					<FormItem
      						id="control-sav_act_p"
      						label="Actual Saving Potential(%):"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input id="control-sav_act_p" defaultValue={this.props.article.SAVING_ACT_P} onChange={this.handleChange.bind(this)}/>
    					</FormItem>
      					

      				</Form>
      				<p>Comments</p>
      				<hr />
      				<br />
      				<Form horizontal>
      					<FormItem
      						id="control-comm"
      						label="Comment:"
      						labelCol={{ span: 7 }}
      						wrapperCol={{ span: 10 }}
    					>
      					<Input type="textarea" id="control-comm" rows="3" defaultValue={this.props.article.COMMENT} onChange={this.handleChange.bind(this)}/>
    					</FormItem>
      				</Form>
      				<div  className="aligncenter" >
      					<Button type="primary" onClick={this.handleClick.bind(this)}>Done</Button>
      				</div>

   				</Card>
			</div>


			)
	}
}