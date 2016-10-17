import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Button, Table, Icon,Moda,InputNumber,Card} from "antd";
const ButtonGroup = Button.Group;
import { connect } from "react-redux";
import {GetAlltheDVM,updateDVM} from "../../Actions/dvmpracticeAction";

import { ForwardStep,GetTop5Tables,SetArticleNamAndDsc } from "../../Actions/KnowledgeAction";


const FormItem = Form.Item;


let Demo = React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    console.log(this);
    console.log('收到表单值：', this.props.form.getFieldsValue());
    this.props.dispatch(updateDVM(this.props.form.getFieldsValue()));

  },

  render() {
          const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };
    const { getFieldProps } = this.props.form;
    const {setFieldsInitialValue} = this.props.form;
    const {data } = this.props;

    console.log(this.props)
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
                  {...formItemLayout}
          label="Factor Guid"
        >
          <Input placeholder="Factor Id"
            {...getFieldProps('FACTOR_GUID',{initialValue:data.FACTOR_GUID})}
          
           ></Input>
        </FormItem>
          <FormItem
                  {...formItemLayout}
          label="Archiving object"
        >
          <Input placeholder="Archiving object"
            {...getFieldProps('ARCHOBJ', {initialValue:data.ARCHOBJ})}
          />
        </FormItem>
         <FormItem
                  {...formItemLayout}
          label="Business Content"
        >
          <Input placeholder="Archiving object"
            {...getFieldProps('BUSINESSCONTENT', {initialValue:data.BUSINESSCONTENT})}
          />
        </FormItem>
                <FormItem
                  {...formItemLayout}
          label="SAP Best Avoidance"
        >
          <Input placeholder="avoidance" type="textarea"
            {...getFieldProps('AVOIDANCE', {initialValue:data.AVOIDANCE})}
          />


        </FormItem>
                         <FormItem
                  {...formItemLayout}
          label="SAP Application Name"
        >
          <Input  placeholder="APPLICATIONNAME"
            {...getFieldProps('APPLICATIONNAME', {initialValue:data.APPLICATIONNAME})}
          />
        </FormItem>            
         <FormItem
                  {...formItemLayout}
          label="SAP Best SUMMARIZATION"
        >
          <Input placeholder="SUMMARIZATION" type="textarea"
            {...getFieldProps('SUMMARIZATION', {initialValue:data.SUMMARIZATION})}
          />
        </FormItem>

         <FormItem 
                  {...formItemLayout}
          label="SAP Best Deletion"
        >
          <Input placeholder="DELETION" type="textarea"
            {...getFieldProps('DELETION', {initialValue:data.DELETION})}
          />
        </FormItem>

         <FormItem
                  {...formItemLayout}
          label="SAP Best ARCHIVING"
        >
          <Input placeholder="ARCHIVING" type="textarea"
            {...getFieldProps('ARCHIVING', {initialValue:data.ARCHIVING})}
          />
        </FormItem>
         <FormItem
                  {...formItemLayout}
          label="SAP Best Retention"
        >
          <InputNumber  placeholder="Retention"
            {...getFieldProps('BEST_PRACTICE', {initialValue:data.BEST_PRACTICE})}
          />
        </FormItem>
                 <FormItem
                  {...formItemLayout}
          label="SAP Best RANK"
        >
          <InputNumber  placeholder="RANK"
            {...getFieldProps('RANK', {initialValue:data.RANK})}
          />
        </FormItem>

         <FormItem
                  {...formItemLayout}>
        <Button type="primary" htmlType="submit">save</Button>

        </FormItem>
      </Form>
    );
  },
});

Demo = Form.create()(Demo);



@connect((store)=>{    
    return {
        articles:store.articles,
        auth:store.auth.token,
        DVMPRACTICE:store.dvm
    };
    

})



export default class Maintain extends React.Component {

    constructor(props) {
        super(props)


        this.state={
          newone: {
              FACTOR_GUID:null,
              ARCHOBJ:null,
              AVOIDANCE:null,
              SUMMARIZATION:null,
              DELETION:null,
              ARCHIVING:null
          }
        }
    }

    
    componentWillMount(){

        this.props.dispatch(GetAlltheDVM());

    }

    onClick(data){

    this.setState({

        targetone :  data


    })
    }
    handleChange(){

    }
    render() {


        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };




//table 

const {DVM} =this.props.DVMPRACTICE;
var data;
if(DVM)
{
data =DVM.results;
console.log("do this")
 
 }
else{

data = [];

}


var that = this ;
const rowselection = {  

  onSelect(record, selected, selectedRows) {
    that.onClick(record)
  }
}


  var columns = [{
        title: 'FACTOR_GUID',
        width:"130px",
        dataIndex: 'FACTOR_GUID',
        render: function(text) {
          return <a href="javascript:;">{text}</a>;
        }}, 
        {
          title: 'ARCHIVING Object',
          width:'140px',
          dataIndex: 'ARCHOBJ'
        }, 
        {
          title: 'Avoidance',
          width:'300px',
          dataIndex: 'AVOIDANCE'
        }  ,      
             {
          title: 'SUMMARIZATION',
          width:'300px',
          dataIndex: 'SUMMARIZATION'
        } ,      
             {
          title: 'Deletion',
          width:'300px',
          dataIndex: 'DELETION'
        }       ,      
             {
          title: 'ARCHIVING',
          width:'300px',
          dataIndex: 'ARCHIVING'
        } ,      
         {
          title: 'Retention',
          width:'300px',
          dataIndex: 'BEST_PRACTICE'
        } ,      
         {
          title: 'Business Content',
          width:'300px',
          dataIndex: 'BUSINESSCONTENT'
        }        
       ];

      

var displaydemo 

if(this.state.targetone)
 { 
  displaydemo= <Demo data = {this.state.targetone} dispatch={this.props.dispatch}/>
  }
  else
  {
    displaydemo = <h1>hehe</h1>
  }


        return (
          <div>
            


  <Card>


              <Table columns={columns} dataSource={data}  rowSelection={rowselection} />
             { displaydemo}
</Card>
          </div>

      );
    }
}
