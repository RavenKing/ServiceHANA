import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Button,Card,Icon,Form,Input,Row,Col,InputNumber,Modal} from "antd";
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

export default class ArticleTemplate extends React.Component {

    componentWillMount(){
     
      var currentStatus = pageStatusDataStore.getCurrentStatus();
      var objList = dataPanelDataStore.getBlockObjList(currentStatus,"Arch Obj");
      var tablesList = dataPanelDataStore.getBlockObjList(currentStatus,"Tables");
      var strategyList = dataPanelDataStore.getBlockObjList(currentStatus,"Strategy");
      var retentionList = dataPanelDataStore.getBlockObjList(currentStatus,"Residence Time");
      this.setState({
        objList:objList,
        tablesList:tablesList,
        strategyList:strategyList,
        retentionList:retentionList
      });

    }
    componentDidMount() {

      setCardDragable(ReactDOM.findDOMNode(this));     
      handleFocus(ReactDOM.findDOMNode(this));   
    }
    handleSubmit(e) {
        console.log(this.props);
        e.preventDefault();
        //get fields value
        const { getFieldsValue } = this.props.form;

        console.log('收到表单值：', getFieldsValue());
        var formValues = getFieldsValue();
        //to valid the input
        var valid = true;
        var tables = [];
        var size=[];
        var dsc=[];
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
         //table size and table description
        if(valid){
            this.state.tablesList.map((table,idx)=>{
              if(valid){
                var fieldName = "TBL_SIZE"+idx;
                var fieldName1 = "TBL_DSC"+idx;
                if(formValues[fieldName1] == undefined){
                    formValues[fieldName1] = "";
                }
                if(formValues[fieldName] == undefined){
                    formValues[fieldName] = "";
                }
                if(isNaN(formValues["TBL_SIZE"+idx])){
                    valid = false;
                    const modal = Modal.warning({
                        title: 'Warning! ',
                        content: 'Input the correct number!'
                    });
                    
                }
                tables.push(table.FACTOR_NAME);
                size.push(formValues[fieldName]);
                dsc.push(formValues[fieldName1]);
              }
                
            });
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
            title:'Warning!',
            content:'Input the Correct Number!'
          })
        }
        if(valid && formValues["SAVING_ACT"] == undefined){
          formValues["SAVING_ACT"] = "";
        }
        if(valid && isNaN(formValues["SAVING_ACT"])){
          valid = false;
          const modal = Modal.warning({
            title:'Warning!',
            content:'Input the Correct Number!'
          });
        }
        if(valid && formValues["SAVING_ACT_P"] == undefined){
          formValues["SAVING_ACT_P"] = "";
        }
        if(valid && isNaN(formValues["SAVING_ACT_P"])){
          valid = false;
          const modal = Modal.warning({
            title:'Warning!',
            content:'Input the Correct Number!'
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
            formValues.TABLES = tables;
            formValues.SIZE = size;
            formValues.TABLESDSC = dsc;
            
            //post article
            this.props.dispatch(PostArticle(formValues));
            this.CloseCard();
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
            {
              this.state.objList.map((obj)=>{
                return (
                  <FormItem
                  {...formItemLayout}
                  label="Archiving Object"
                  >
                  <Input placeholder="Archiving Object" disabled="true"
                  {...getFieldProps('ARCHOBJ', {initialValue:obj.FACTOR_NAME})}
                  />
                  </FormItem>
                )
              })
            }
            
          

          <p>Tables</p>
          <hr />
          <br />
         
            <Row gutter={16}>
              <Col sm={10}>
              {
                this.state.tablesList.map((table,idx)=>{
                  return(
                    <FormItem
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    label={table.FACTOR_NAME}
                    >
                    <Col span="15">
                      <Input placeholder="table size"
                      {...getFieldProps('TBL_SIZE'+idx)}
                      />
                    </Col>
                    <Col span="3">
                      <p className="ant-form-split">GB</p>
                    </Col>
                    </FormItem>
                  )
                })
              }
            </Col>
            <Col sm={14}>
            {
              this.state.tablesList.map((table,idx)=>{
                  return(
                    <FormItem
                      labelCol={{ span: 6 }}
                      wrapperCol= {{ span: 14 }}
                      label="Description"
                    >
                      <Input placeholder="table description"
                      {...getFieldProps('TBL_DSC'+idx)}
                      />
                    </FormItem>
                  )
                })
            }
            </Col>
            </Row>
          
          <br />
          <p>Strategy</p>
          <hr />
          <br />
         
          {
            this.state.retentionList.map((ret)=>{
              return (
                <FormItem
                {...formItemLayout}
                label="Retention Time"
                >
                <div>
                  <InputNumber min={12} max={999} 
                  {...getFieldProps('RETENTION', {initialValue:ret.FACTOR_NAME})}
                  /> 
                  <p className="ant-form-text" >Month</p>
                </div>
                </FormItem>
              )
            })
          }
            {
              this.state.strategyList.map(function(strategy){
                return (
                  <FormItem
                    {...formItemLayout}
                    label={strategy.FACTOR_NAME}
                  >
                    <Input type="textarea" placeholder="Current Strategy Of your System"
                    {...getFieldProps(strategy.FACTOR_NAME.toUpperCase(), {initialValue:strategy.FACTOR_INFO})} />
                  </FormItem>
                )
              })
            }
         

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
ArticleTemplate = Form.create()(ArticleTemplate);