const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN'
const AUTH_DELETE_TOKEN = 'AUTH_DELETE_TOKEN'
import axios from "axios"
import { Modal } from 'antd';

export function setAuthToken (parameter) {



// /SmartOperations/services/authorization.xsodata/users?$filter=USERNAME eq 'admin'
return dispatch=>{

dispatch({type:"AUTH_VALIDATING"});
  console.log(parameter);
    if(!parameter.customer_id){
      console.log("did it?")
      var data = {
          authorized:false,
          error:"customer_id",
          hint:"input customer id",
          user:null
      };
      dispatch({type:"AUTH_SET_TOKEN",payload:data});
    }
    else{
   axios.get("/SmartOperations/services/authorization.xsodata/AUTH1?$filter=USERNAME eq '"+parameter.username+"' and CUSTOMER_ID eq "+parameter.customer_id+"",{
      headers:{
        'X-My-Custom-Header':'Header-Value',
        'content-type':'application/json'
      },
      auth:{
        username:'zengheng',
        password:'Sap12345'
      }
      
    }).then(function(response,err){
      var data = response.data.d.results;

      if(data.length!=0)
      {

      		if(data[0].USERNAME == parameter.username &&data[0].CUSTOMER_ID == parameter.customer_id && data[0].PASSWORD == parameter.password)
      		{
      			data = {

      				authorized:true,
      				user:data[0],
      				hint:"logged"
      			}

      		}
      		else 
      		{
			       data = {

      				authorized:false,
      				error:"password",
      				hint:"incorrect password",
      				user:null
      			}
      		}
      }
      else{

        data = {
          authorized:false,
          user:null,
          error:"username",
          hint:"incorrect username",
        }

      }


      dispatch({type:"AUTH_SET_TOKEN",payload:data});
     
    }).catch(function(err){
      console.log(err);
    })

  }
  }
}

export function invalidateAuthToken () {
  window.localStorage.removeItem('authToken')
  return {
    type: AUTH_DELETE_TOKEN
    
  }
}
//check the registering data
export function regCheck(data){
  return dispatch=>{
    dispatch({type:"REG_CHECK",payload:data})
  }
}
export function CusRegister(data){
  return dispatch=>{
    var customer_id = data.customer_id;
    var customer_name = data.customer_name;    
    var sid = data.sid;
    var client = data.client;
    var industry = data.industry;
    var region = data.region;
    var country = data.country;
    var city = data.city;

    var config = {
      headers:{
        'X-My-Custom-Header': 'Header-Value',
        'content-type':'application/json'
        },
      auth: {
        username: 'zengheng',
        password: 'Sap12345'
      }
    };
    axios.post("/SmartOperations/services/authorization.xsodata/CUST",{

        CUSTOMER_ID:customer_id,
        CUSTOMER_NAME:customer_name,
        INDUSTRY:industry,
        COUNTRY:country,
        CITY:city,
        SYSTEMID:sid,
        CLIENT:client,
        REGION:region
    },
    config).then(function(response){
        var token = {
              error:"",
              hint:""
        };
        dispatch({type:"REG_CHECK",payload:token});
        const modal = Modal.success({
            title: 'Successfully register! ',
            content: 'You have regitered done',
        });

    }).catch(function(response){
      var message = response.data.error.message.value;
      if(message == "Service exception: [301] unique constraint violated"){
        var token = {
            authorized:false,
            user:null,
            error:"cus_id",
            hint:"customer id already exists"
        }
        dispatch({type:"REG_CHECK",payload:token});
      }
    })


  }
}
export function UserRegister(data){
  return dispatch=>{

    var username = data.username;    
    var customer_id = data.customer_id; 
    var role = "BSC";
    var pwd = data.pwd1;
    var token={};
    //request configuration
    var config = {
      headers:{
        'X-My-Custom-Header': 'Header-Value',
        'content-type':'application/json'
        },
      auth: {
        username: 'zengheng',
        password: 'Sap12345'
      }
    };

    axios.get("/SmartOperations/services/authorization.xsodata/CUST?$filter=CUSTOMER_ID eq "+customer_id,
      config).then(function(response){
        if(response.data.d.results.length > 0){
          //check user name whether exists
    axios.get("/SmartOperations/services/authorization.xsodata/users?$filter=USERNAME eq '"+username+"'",
      config
      ).then(function(response){
        if(response.data.d.results.length > 0){
          token = {
            authorized:false,
            user:null,
            error:"username",
            hint:"username already exists"
          }
          dispatch({type:"REG_CHECK",payload:token});
         
        }
        else{
          axios.get("/SmartOperations/services/authorization.xsodata/users?$orderby=USER_ID desc&top=1",
          config).then(function(response){
              
              var user_id = response.data.d.results[0].USER_ID;
              user_id = Number(user_id + 1);
              user_id = user_id.toString();

              axios.post("/SmartOperations/services/authorization.xsodata/users",{

                  USER_ID:user_id,
                  CUSTOMER_ID:customer_id,
                  PASSWORD:pwd,
                  USERNAME:username,
                  ROLE:role
              },
              config).then(function(response){             
                  token = {
                      error:"",
                      hint:""
                  };
                  dispatch({type:"REG_CHECK",payload:token});
                  const modal = Modal.success({
                        title: 'Successfully register! ',
                        content: 'You have regitered done',
                  });

              }).catch(function(response){
                    console.log(response);
              })
                
              
    
          }).catch(function(response){
            console.log(response);
          })




        }
       
      }).catch(function(response){
        console.log(response);
      })

        }
        //customer id does not exist
        else{
          token = {
            authorized:false,
            user:null,
            error:"usr_cus_id",
            hint:"customer id does not exists"
          }
          dispatch({type:"REG_CHECK",payload:token});
        }
      }).catch(function(response){
        console.log(response);
      })

    





    
}
}