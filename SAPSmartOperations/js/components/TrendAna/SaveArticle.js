import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Button,Card,Icon,Form,Input,Row,Col,Modal,InputNumber} from "antd";
import { setCardDragable,handleFocus } from "../../interactScript";
import { PostArticle } from "../../Actions/KnowledgeAction";
const FormItem=Form.Item;

var displayAreaChangeActions = window.displayAreaChangeActions
var pageStatusDataStore = window.pageStatusDataStore
var dataPanelDataStore = window.dataPanelDataStore

@connect((store)=>{    
    return {
        articles:store.articles,
        auth:store.auth.token

    };
    
})

export default class SaveArticle extends React.Component {

    componentDidMount() {

      setCardDragable(ReactDOM.findDOMNode(this));     
      handleFocus(ReactDOM.findDOMNode(this));   
    }
    handleSubmit(e) {
        const { values } = this.props.card;
        e.preventDefault();
        //get fields value
        const { getFieldsValue } = this.props.form;

        var formValues = getFieldsValue();
        //to valid the input
        var valid = true;
      
        //check whether input the article name or not
        if(valid && !formValues["ARTICLE_NAM"]){
          valid = false;
          const modal = Modal.warning({
              title: 'Warning! ',
              content: 'The Article Name Should not be Empty!'
          });
        }
        //article description
        if(valid && formValues["ARTICLE_DSC"] == undefined){
          formValues["ARTICLE_DSC"] = "";
        }
        //saving potential
        if(valid && formValues["SAVING_EST"] == undefined){
          formValues["SAVING_EST"] = "";
        }
        if(valid && isNaN(formValues["SAVING_EST"])){
            valid = false;
            const modal = Modal.warning({
              title: 'Warning! ',
              content: 'Input the Correct Number!'
            });
        }
        if(valid && formValues["SAVING_EST_P"] == undefined){
          formValues["SAVING_EST_P"] = "";
        }
        if(valid && isNaN(formValues["SAVING_EST_P"])){
            valid = false;
            const modal = Modal.warning({
              title: 'Warning! ',
              content: 'Input the Correct Number!'
            });
        }
        if(valid && formValues["SAVING_ACT"] == undefined){
          formValues["SAVING_ACT"] = "";
        }
        if(valid && isNaN(formValues["SAVING_ACT"])){
            valid = false;
            const modal = Modal.warning({
              title: 'Warning! ',
              content: 'Input the Correct Number!'
            });
        }
        if(valid && formValues["SAVING_ACT_P"] == undefined){
          formValues["SAVING_ACT_P"] = "";
        }
        if(valid && isNaN(formValues["SAVING_ACT_P"])){
            valid = false;
            const modal = Modal.warning({
              title: 'Warning! ',
              content: 'Input the Correct Number!'
            });
        }
        //comment
        if(valid && formValues["COMMENT"] == undefined){
          formValues["COMMENT"] = "";
        }
        //dispatch post article action
        if(valid){
            const {user} = this.props.auth;
            //add extra field to formValues
            formValues.CUSTOMER_ID = user.CUSTOMER_ID;
            formValues.USERNAME = user.USERNAME;
            formValues.TABLES = values.TABLES;
            formValues.SIZE = values.SIZE;
            formValues.TABLESDSC = values.TABLESDSC;
            formValues.ARCHIVING = values.ARCHIVING;
            formValues.AVOIDANCE = values.AVOIDANCE;
            formValues.DELETION = values.DELETION;
            formValues.SUMMARIZATION = values.SUMMARIZATION;
            formValues.ARCHOBJ = values.ARCHOBJ;
            formValues.RETENTION = values.RETENTION;

            
            //post article
            this.props.dispatch(PostArticle(formValues))
        }

    }
    CloseCard(){
      
        var currentStatus = pageStatusDataStore.getCurrentStatus();

        displayAreaChangeActions.displayAreaRemoveCardAction(currentStatus, this.props.card.id);
       
    }
    render() {	

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 }
        };
        const { getFieldProps } = this.props.form;
        const {setFieldsInitialValue} = this.props.form;
    	
    	return (
            <div style={this.props.card.style} className="saveCard aligncenter">
            <Card  title="Save as Article" extra={<Icon type="cross" onClick = {this.CloseCard.bind(this)}/>}>
            <p>Basic Information</p>
            <hr />
            <br />
            <Form horizontal className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
            {...formItemLayout}
            label="Article Name"
            >
            <Input placeholder="Article Name"
            {...getFieldProps('ARTICLE_NAM')}
            />
            </FormItem>

            <FormItem
            {...formItemLayout}
            label="Article Description"
            >
            <Input placeholder="Article Description"
            {...getFieldProps('ARTICLE_DSC')}
            />
            </FormItem>
         

            <p>Saving Potential</p>
            <hr />
            <br />
         
            <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            label="Estimated Saving Potential(GB)"
            >
            <Input placeholder="Estimated Saving Potential" 
            {...getFieldProps('SAVING_EST')}
            />
            </FormItem>

            <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            label="Estimated Saving Potential(%)"
            >
            <Input placeholder="Estimated Saving Potential" 
            {...getFieldProps('SAVING_EST_P')}
            />
            </FormItem>

            <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            label="Actual Saving Potential(GB)"
            >
            <Input placeholder="Actual Saving Potential" 
            {...getFieldProps('SAVING_ACT')}
            />
            </FormItem>

            <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            label="Actual Saving Potential(%)"
            >
            <Input placeholder="Actual Saving Potential" 
            {...getFieldProps('SAVING_ACT_P')}
            />
            </FormItem>
          
            <p>Comments</p>
            <hr />
            <br />
         
            <FormItem
            {...formItemLayout}
            label="Comment"
            >
            <Input type="textarea" placeholder="Comments" 
            {...getFieldProps('COMMENT')}
            />
            </FormItem>
            
            <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 10 }} 
            label=" "          
            >
            <Button type="primary" htmlType="submit">Save</Button>
            </FormItem>

          </Form>
        </Card>
        </div>
         
      

      );
  }
}
SaveArticle = Form.create()(SaveArticle);