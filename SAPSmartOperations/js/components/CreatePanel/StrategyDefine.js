import React from "react";
import { Button,Card,Icon,Form,Input,Checkbox,Popover,Modal } from "antd";
const ButtonGroup = Button.Group;
import { connect } from "react-redux";

import { 
          NewArticleStepOne,SetSaving,
          PostArticle,CloseCreatePanel,
          fetchArticles,ForwardStep,
          SetAvoidance,SetDeletion,
          SetSummarization,SetArchiving,
          SetRetention
        } from "../../Actions/KnowledgeAction";

//Forms
import ArchivingForm from "./ArchivingForm";
import AvoidanceForm from "./AvoidanceForm";
import SummarizationForm from "./SummarizationForm";
import DeletionForm from "./DeletionForm";

const FormItem=Form.Item;
const CheckboxGroup = Checkbox.Group;

//back 
import BackButton from "./BackButton";

@connect((store)=>{    
    return {
        articles:store.articles,
        auth:store.auth.token
    };
    
})
export default class StrategyDefine extends React.Component {
  
    constructor(props)
    {
 	      super(props);
        const { newArticle } = this.props.articles;
        var saving_est = "";
        var saving_est_p = "";
        var saving_act = "";
        var saving_act_p = "";
        var comment = "";
        var DVM = [];
        if(newArticle.SAVING_EST){

          saving_est = newArticle.SAVING_EST;

        }
        if(newArticle.SAVING_EST_P){
          saving_est_p = newArticle.SAVING_EST_P;
        }
        if(newArticle.SAVING_ACT){
          saving_act = newArticle.SAVING_ACT;          
        }
        if(newArticle.SAVING_ACT_P){
          saving_act_p = newArticle.SAVING_ACT_P;
        }
        if(newArticle.COMMENT){
          comment = newArticle.COMMENT;
        }
        if(newArticle.AVOIDANCE){
          DVM.push("Avoidance");
        }
        if(newArticle.DELETION){
          DVM.push("Deletion");
        }
        if(newArticle.ARCHIVING){
          DVM.push("Archiving");
        }
        if(newArticle.SUMMARIZATION){
          DVM.push("Summarization");
        }
 	      this.state={
            
            DVM:DVM,
 	          saving_est:saving_est,
            saving_est_p:saving_est_p,
            saving_act:saving_act,
            saving_act_p:saving_act_p,
            comment:comment
        }
    }

    onChange(checkedValues){

        this.setState({
	         DVM:checkedValues,
        })

    }
    ifChecked(method){
      const { DVM } = this.state;
      for(var i = 0; i < DVM.length;i++){
          if(DVM[i] == method){
            return true;
          }
      }
     
      return false;
      
    }
    GoToStepSix(){
        var validInput = true;
        var saving_est = this.refs.sav_est.refs.input.value;
        var saving_est_p = this.refs.sav_est_p.refs.input.value;
        var saving_act = this.refs.sav_act.refs.input.value;
        var saving_act_p = this.refs.sav_act_p.refs.input.value;        
        var comment = this.refs.com.refs.input.value;
        if(isNaN(saving_est)){
          validInput = false;
          
        }
        if(isNaN(saving_est_p)){
          validInput = false;
          
        }
        if(isNaN(saving_act)){
          validInput = false;
          
        }
        if(isNaN(saving_act_p)){
          validInput = false;          
        }
        if(validInput == true){
          var data={
            saving_est:saving_est,
            saving_est_p:saving_est_p,
            saving_act:saving_act,
            saving_act_p:saving_act_p,
            comment:comment
          };

          this.props.dispatch(SetSaving(data));
          if(!this.ifChecked("Avoidance")){
            this.props.dispatch(SetAvoidance(""));
          }
          if(!this.ifChecked("Deletion")){
            this.props.dispatch(SetDeletion(""));
          }
          if(!this.ifChecked("Summarization")){
            this.props.dispatch(SetSummarization(""));
          }
          if(!this.ifChecked("Archiving")){
            this.props.dispatch(SetArchiving(""));
            this.props.dispatch(SetRetention(12));
          }
          this.props.dispatch(ForwardStep());
         
        }
        else{
          const modal = Modal.warning({
            title: 'Warning! ',
            content: 'Please input the correct number'
          });
        }
        
      
    }

    render() {	

      const formItemLayout = {
        
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
      const { newArticle } = this.props.articles;
    	const DVMmethod = [
    	   
          {label:"Avoidance",value:"Avoidance"},
          {label:"Summarization",value:"Summarization"},
          {label:"Deletion",value:"Deletion"},
          {label:"Archiving",value:"Archiving"}
    	]

    	const { DVM }  = this.state;
    		

      var displaypart= DVM.map((item)=>{
          switch(item){
            case "Archiving":
            {
              return <ArchivingForm />
            }
            case "Avoidance":
            {
              return <AvoidanceForm />
            }
            case "Summarization":
            {
              return <SummarizationForm />
            }
            case "Deletion":
            {
              return <DeletionForm />
            }
            default:{
              return ;
            }
          }

    	});



    	return (
        <div>
          <h3>Saving Potential</h3>
              <hr />
              <br />
              <Form horizontal>
                <FormItem
                  label="Estimated Saving Potential(GB):"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 10 }}
              >
                <Input ref="sav_est" defaultValue={this.state.saving_est} />
              </FormItem>

              <FormItem
                  id="control-sav_est_p"
                  label="Estimated Saving Potential(%):"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 10 }}
              >
                <Input  ref="sav_est_p" defaultValue={this.state.saving_est_p} />
              </FormItem>

                <FormItem
                  id="control-sav_act"
                  label="Actual Saving Potential(GB):"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 10 }}
              >
                <Input   ref="sav_act" defaultValue={this.state.saving_act} />
              </FormItem>

              <FormItem
                  id="control-sav_act_p"
                  label="Actual Saving Potential(%):"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 10 }}
              >
                <Input  ref="sav_act_p" defaultValue={this.state.saving_act_p} />
              </FormItem>               

              </Form>





        	<h3> Strategy </h3>
          <hr />
        	<div className="margin-top10">
            <div className="aligncenter margin-bottom10">
              <Popover content="75% of our customers choose Archiving">
              <div>
              <CheckboxGroup defaultValue={this.state.DVM} options={DVMmethod} onChange={this.onChange.bind(this)}/>
              </div>
              </Popover>
            </div>
            {
              displaypart
            }
            <hr />
            <div className="margin-top10">
              <Form horizontal >
                <FormItem
                  id="control-comm"
                  {...formItemLayout}
                  label="Overview Comments"
                >
                <Input ref="com" type="textarea"  defaultValue={this.state.comment} placeholder="Current Strategy Of your System" />
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>

            <ButtonGroup>
             <BackButton/>
            <Button type="primary" onClick={this.GoToStepSix.bind(this)}>Next<Icon type="right"/></Button>
            </ButtonGroup>

            </FormItem>
              </Form>
            </div>
        	</div>
         
        </div>

      );
  }
}
