import React from "react";
import { connect } from "react-redux";
import { History,Router,browserHistory } from "react-router";

import { Form, Input, Button, Checkbox,Col,Tabs,Select } from 'antd';
import md5 from "md5-js"

import { setAuthToken,CusRegister,UserRegister,regCheck} from "../../Actions/authAction"

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect((store)=>{
    

    return {
      	auth:store.auth
    };
    
})
export default class Login extends React.Component {
  
    constructor(props){
      
        super(props);
        this.state={
          tab_key:"1"
          
        } 
    }   

  componentWillMount(){
      
        
    }// native funtion , update store 
    callback(key) {
      this.setState({
        tab_key:key
      });
    }
    setAuth(){
      
         this.props.dispatch(setAuthToken(this.state));
/*        setTimeout(function(){
          const {auth} = this.props;
          const { token } = auth;
          console.log(token);
          if(token.authorized == true)
          {

              this.props.history.push("/")
          }

        }.bind(this),1000);*/

    }
 
    UserChange(e){

        this.setState({
          username: e.target.value.toUpperCase()
        })
    }
    CustomerIdChange(e){
      this.setState({
        customer_id:e.target.value
      })
    }
    PasswordChange(e){

        this.setState({
            password: md5(e.target.value)
        })
    }
    IndustryChange(value){
      console.log(value); 
      this.setState({
        industry:value
      });
    }
    RegionChange(value){
      console.log(value);
      this.setState({
        region:value
      })
    }
    saveCusInfo(){
      //customer information
        var cus_id = this.refs.cus_id.refs.input.value;
        var cus_name = this.refs.cus_name.refs.input.value;
        var sid = this.refs.sid.refs.input.value;
        var client = this.refs.client.refs.input.value;
        var industry = this.state.industry;
        var region = this.state.region;
        var country = this.refs.country.refs.input.value;
        var city = this.refs.city.refs.input.value;
      var valid = true;
      var token;
      
      
          //but customer id is empty
          if(cus_id == ""){
            valid = false;
            token={
              authorized:false,
              error:"cus_id",
              user:null,
              hint:"input the customer id"
            }
            this.props.dispatch(regCheck(token));
          }
        
        //customer id is filled
        if(valid){
          var regCusInfo = {};
          regCusInfo.customer_id = cus_id;
          regCusInfo.customer_name = cus_name;
          regCusInfo.sid = sid;
          regCusInfo.client = client;
          regCusInfo.industry = industry;
          regCusInfo.region = region;
          regCusInfo.country = country;
          regCusInfo.city = city;
          this.props.dispatch(CusRegister(regCusInfo));   

        }

    }
    saveUsrInfo(){
      var username = this.refs.username.refs.input.value.toUpperCase();
      var usr_cus_id = this.refs.usr_cus_id.refs.input.value;
      var pwd1 = this.refs.pwd1.refs.input.value;
      var pwd2 = this.refs.pwd2.refs.input.value;

      var token;
      var valid = true;
       
          if(username == ""){
            valid = false;
            token={
              authorized:false,
              error:"username",
              user:null,
              hint:"input the user name"
            }
          } 
          if(valid){
            if(usr_cus_id == ""){
              valid = false;
              token={
                authorized:false,
                error:"usr_cus_id",
                user:null,
                hint:"input the customer id"
              }
            }
          }
          if(valid){
            if(pwd1 == ""){
              valid = false;
              token={
                authorized:false,
                error:"pwd1",
                user:null,
                hint:"input the password"
              }
          
            }
          }
        if(valid){
          if(pwd2 == ""){
            valid = false;
            token={
              authorized:false,
              error:"pwd2",
              user:null,
              hint:"input the confirmed password"
            }
          
          }
        }
        if(valid){
          if(pwd1 != pwd2){
            valid = false;
            token={
              authorized:false,
              error:"pwd2",
              user:null,
              hint:"input the confirmed password"
            }
          }
        }
        if(valid){
          var regUsrInfo = {};
          regUsrInfo.customer_id = usr_cus_id;
          regUsrInfo.username = username;
          regUsrInfo.pwd1 = md5(pwd1);
          regUsrInfo.pwd2 = md5(pwd2);
          
          this.props.dispatch(UserRegister(regUsrInfo));

          setTimeout(function(){
            if(!this.props.auth.token.error){
              setTimeout(function(){
                this.setState({
                  tab_key:"1"
                });
              }.bind(this),1000)
            }
          }.bind(this),2000) 
          
        }
        else{
          this.props.dispatch(regCheck(token));
        }
        


    }
    
    render() {


      const {auth} =this.props;
      const {token } = auth;
      if(auth.status=="passed")
      {
          browserHistory.push('/SAPSmartOperations/')
      }
      
      return (
      
      
          <div className="login">
            <p id="km-title">Smart Operation</p>

            <Tabs defaultActiveKey="1"  activeKey={this.state.tab_key} className="login-tab" onChange={this.callback.bind(this)}>
              <TabPane  tab="login" key="1">           

            {token.error=="password"?"error":""}

            <Form horizontal id="login-form">
              <FormItem               
    
                wrapperCol={{ span: 16 }}
                validateStatus={token.error=="customer_id"?"error":""}
                help={token.error=="customer_id"?token.hint:""}
              
              >
                
                <Input placeholder="Customer ID" onChange={this.CustomerIdChange.bind(this)}/>             
                               
              </FormItem>

              <FormItem
                wrapperCol={{ span: 16 }}
                validateStatus={token.error=="username"?"error":""}
                help={token.error=="username"?token.hint:""}
              >
                <Input placeholder="UserName" onChange={this.UserChange.bind(this)}/>
              </FormItem>
              
              <FormItem                
    
                wrapperCol={{ span: 16 }}
                validateStatus={token.error=="password"?"error":""}
                help={token.error=="password"?token.hint:""}
              >
                
                <Input type="password" placeholder="Password" onChange= { this.PasswordChange.bind(this)}  onPressEnter={this.setAuth.bind(this)}/>             
                               
              </FormItem>
        
              <FormItem
                
                wrapperCol={{ span:16 }}
              >

              <Button type="primary" id="login-btn" icon="poweroff" onClick={this.setAuth.bind(this)}>Login</Button>
              
             
              </FormItem>
              
              <FormItem
                
                wrapperCol={{ span:16 }}
              >
              <Col span="12">
                <Checkbox className="login-label2" disabled >remember me</Checkbox>
              </Col>
              <Col span="12">
                <p className="login-label3">Can not login?</p>
              </Col>
              
              </FormItem>             

            </Form>
              </TabPane >

              <TabPane  tab="register" key="2">
                <h3>Customer Information</h3>
                <hr />
                <br />
                <Form horizontal className="reg-form">
                  
                  <FormItem
                    label="Customer ID:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    validateStatus={token.error=="cus_id"?"error":""}
                    help={token.error=="cus_id"?token.hint:""}

                    
                  >
                  <Input  ref="cus_id"/>
                  </FormItem>

                   <FormItem
                    label="Customer Name:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  <Input ref="cus_name"/>
                  </FormItem>

                  <FormItem
                    label="System ID:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  <Input  ref="sid"/>
                  </FormItem>

                  <FormItem
                    label="Client:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  <Input  ref="client"/>
                  </FormItem>

                  <FormItem
                    label="Industry:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  <Select showSearch
                    placeholder="please select industry"                   
                    onChange={this.IndustryChange.bind(this)}                    
                    
                  >
                    <Option value="AUTO">AUTO</Option>
                    <Option value="RETAIL">RETAIL</Option>
                    <Option value="POWER">POWER</Option>
                    <Option value="MANUFACTORY">MANUFACTORY</Option>
                    <Option value="HIGH-TECH">HIGH-TECH</Option>
                    <Option value="UTILITY">UTILITY</Option>
                    <Option value="BANK">BANK</Option>
                  </Select>
                  </FormItem>

                  <FormItem
                    label="Region:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  <Select showSearch
                    placeholder="please select region"                   
                    onChange={this.RegionChange.bind(this)}                    
                    
                  >
                    <Option value="APJ">APJ</Option>
                    <Option value="EMEA">EMEA</Option>
                    <Option value="Americas">Americas</Option>
                    
                  </Select>
                  </FormItem>

                   <FormItem
                    label="Country:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  <Input ref="country"/>
                  </FormItem>


                   <FormItem
                    label="City:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    
                  >
                  
                  <Input  ref="city"/>                        
                  </FormItem>
                  </Form>

                  <Button type="primary" className="reg-btn" onClick={this.saveCusInfo.bind(this)}>Register</Button>
                   
                  <h3>User Information</h3>
                  <hr />
                  <br />
                  <Form horizontal className="reg-form">
                   <FormItem
                    label="User Name:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    validateStatus={token.error=="username"?"error":""}
                    help={token.error=="username"?token.hint:""}
                    
                  >
                  <Input  ref="username"/>
                  </FormItem>

                   <FormItem
                    label="Customer ID:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    validateStatus={token.error=="usr_cus_id"?"error":""}
                    help={token.error=="usr_cus_id"?token.hint:""}
                   
                    
                  >
                  <Input  ref="usr_cus_id"/>
                  </FormItem>

                   <FormItem
                    label="Password:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    validateStatus={token.error=="pwd1"?"error":""}
                    help={token.error=="pwd1"?token.hint:""}
                    
                  >
                  <Input type="password" ref="pwd1"/>
                  </FormItem>

                  <FormItem
                    label="Confirm Password:"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 12 }}
                    validateStatus={token.error=="pwd2"?"error":""}
                    help={token.error=="pwd2"?token.hint:""}
                    
                  >
                  <Input type="password" ref="pwd2" />
                  </FormItem>

                  <Button type="primary" className="reg-btn" onClick={this.saveUsrInfo.bind(this)}>Register</Button>

                 
                 
                  </Form>
                  </TabPane>
              </Tabs>

            
            
          </div>        	
      );
    }
}
