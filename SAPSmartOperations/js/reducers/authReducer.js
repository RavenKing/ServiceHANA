export default function auth (
  state = {
    customer_id:[],
    token: {
      authorized:false,
      user:null,
      hint:null
    },
    status:null 
  }, action
) {
  switch (action.type) {
    case "AUTH_VALIDATING":{return Object.assign({},state,{status:"validating"})}
    case "AUTH_SET_TOKEN":{
      if(action.payload.authorized==true)
            return Object.assign({},state,{token:action.payload,status:"passed"})
      else
        return Object.assign({},state,{token:action.payload,status:"Not Passed"})
    }
    
    case "AUTH_DELETE_TOKEN":{
      
      return Object.assign({}, state, {
        token: {
          authorized:false,
          user:null
        }
      })
    }
    case "REG_CHECK":{
      return {...state,token:action.payload}
    }
   
    default:{

      return state
    }
  }
}