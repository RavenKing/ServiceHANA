export default function reducer(state={
    articles:[],
    fetching:false,
    fetched:false,
    refresh:false,
    newArticle:{currentstep:0},
    displayPanel:[],
    error:null
    },action){
    
    switch(action.type)
    {
        

        case "FETCH_ARTICLE_FULFILLED":
        {
                    
            return {...state,fetching:false,fetched:true,articles:action.payload,refresh:false}
        }        
        case "ADD_ARTICLE_VIEW":
        {
            const  { displayPanel } = state;
            var payload = action.payload;
            if(payload.type == "detail"){
                displayPanel.push({
                type:payload.type,
                article:payload.data_id,
                x:payload.x,
                y:payload.y,
                visible:true});
            }
            else if(payload.type == "edit"){
                displayPanel.push({
                    type:payload.type,
                    article:payload.data_id,
                    x:payload.x,
                    y:payload.y,
                    visible:true
                });
            }
            else if(payload.type == "main"){
                displayPanel.push({
                    type:payload.type,
                    query:payload.query,
                    x:payload.x,
                    y:payload.y,
                    visible:true
                });
            }
            else{
                displayPanel.push({
                type:payload.type,
                x:payload.x,
                y:payload.y,
                visible:true});
            }
            
            return{...state,displayPanel:displayPanel}
        }
        case "REMOVE_ARTICLE_VIEW":
        {
            const { displayPanel } = state;
            var payload = action.payload;
            var newdata = displayPanel.filter((displayone)=>{ 
                       
                return  displayone.article != payload.data_id || displayone.type != payload.type
                      
            })
            
            if(payload.type == "create"){
                return {...state,displayPanel:newdata,newArticle:{currentstep:0}}
            }
            else{
                return {...state,displayPanel:newdata,refresh:true}
            }
            
        }
        case "NEW_ARTICLE_STEP_ONE":{

           return {...state,newArticle:action.payload}

        }
        case "ADD_ONE_STEP":{
            const { newArticle } = state;
            newArticle.currentstep = newArticle.currentstep + 1 ; 
            return {...state,newArticle:newArticle}
        }

        case "BACT_ONE_STEP":
         {
                const { newArticle } = state;
                newArticle.currentstep = newArticle.currentstep - 1 ; 
                return {...state,newArticle:newArticle}

         }
         case "GET_BEST_PRACTICE":
         {
            const { articles  } = state;            
            const { results } = articles;
            var data =  action.payload;
            var newdata = results.filter((article)=>{ 
                if(article.ARTICLE_ID == data.articleid){
                    if(article.bestpractice){
                        article.bestpractice.AVGS = data.AVGS;
                        article.bestpractice.Retention = data.Retention;
                       
                    }
                    else{
                        article.bestpractice={
                            AVGS:data.AVGS,
                            Retention:data.Retention                        
                        }
                    }
                }
                return  article;
                      
            });
            var newArticles = {};
            newArticles.results = newdata;
            return {...state,articles:newArticles}; 
        }
        case "GET_BEST_PRACTICE_STEP2":
        {

            console.log(action.payload)
            const { articles  } = state;
            const { results } = articles;
            var newdata = results.filter((article)=>{ 
                if(article.ARTICLE_ID == action.payload.articleid){
                    if(article.bestpractice){
                        
                        article.bestpractice.detail = action.payload.result
                    }
                    else{
                        
                        article.bestpractice={detail:action.payload.result}

                    }
                }
                       
                return  article;
                      
            });
            var newArticles = {};
            newArticles.results = newdata;
            return {...state,articles:newArticles};
        }
        case "GET_REGION_DATA":
        {
            const { articles  } = state;
            const { results } = articles;
            var data = action.payload;
            console.log(data);
            var newdata = results.filter((article)=>{ 
                if(article.ARTICLE_ID == data.articleid){
                    if(article.bestpractice){
                        article.bestpractice.region_data = data;
                    }
                    else{
                         article.bestpractice = {
                            region_data:data
                            
                        };
                    }
                }
                return  article;
            });
            var newArticles = {};
            newArticles.results = newdata;
            return {...state,articles:newArticles};

                        
        }
        case "GET_PRACTICES":
        {
            var {newArticle} = state;

            newArticle.D_AVGS = action.payload.D_AVGS;
            newArticle.D_Retention = action.payload.D_Retention;
            newArticle.D_BEST_PRACTICE = action.payload.D_BEST_PRACTICE;
            newArticle.D_ARCHIVING = action.payload.D_ARCHIVING;
            newArticle.D_AVOIDANCE = action.payload.D_AVOIDANCE;
            newArticle.D_SUMMARIZATION = action.payload.D_SUMMARIZATION;
            newArticle.D_DELETION = action.payload.D_DELETION;

            return {...state,newArticle:newArticle}
        }
        case "GET_TOP5_TABLES":
        {
            const { newArticle } = state;
            const datas = action.payload;
            var archobj = datas[0].ARCHOBJ;
            var tables = datas.map((data)=>{

                return data.TABLENAME;
            });
            console.log(tables);
            newArticle.ARCHOBJ = archobj;
            newArticle.TABLES=tables;
            
            return {...state,newArticle:newArticle}
        } 
        case "SET_BASIC_INFO": 
        {
            const { newArticle } = state;
            newArticle.TABLES = action.payload.tables;
            newArticle.SIZE = action.payload.size;
            newArticle.TABLESDSC = action.payload.dsc;

            return {...state,newArticle:newArticle}
        } 
        case "SET_ARTICLE_NAM_DSC":
        {
            const { newArticle } = state;
            
            newArticle.CUSTOMER_ID = action.payload.customer_id;
            newArticle.ARTICLE_NAM = action.payload.article_nam;
            newArticle.ARTICLE_DSC = action.payload.article_dsc;
           
            return {...state,newArticle:newArticle}
        }
        case "SET_SUM":
        {
            const { newArticle } = state;

            newArticle.SUMMARIZATION = action.payload;
            return {...state,newArticle:newArticle}
        }
        case "SET_ARCH":
        {
            const { newArticle } = state;


            newArticle.ARCHIVING = action.payload;
            return {...state,newArticle:newArticle}
        }
        case "SET_RETENTION":{
            const { newArticle } = state;

            newArticle.RETENTION = action.payload;
            return {...state,newArticle:newArticle}
        }       
        case "SET_AVOID":
        {
            const { newArticle } = state;

            newArticle.AVOIDANCE = action.payload;
            return {...state,newArticle:newArticle}
        }
        case "SET_DEL":
        {
            const { newArticle } = state;

            newArticle.DELETION = action.payload;
            return {...state,newArticle:newArticle}
        }
        case "SET_SAVING":
        {
            const { newArticle } = state;
            newArticle.SAVING_EST = action.payload.saving_est;
            newArticle.SAVING_EST_P = action.payload.saving_est_p;
            newArticle.SAVING_ACT = action.payload.saving_act;
            newArticle.SAVING_ACT_P = action.payload.saving_act_p;
            newArticle.COMMENT= action.payload.comment;
            return {...state,newArticle:newArticle}
        }

        case "POST_ARTICLE":
        {
            return {...state,refresh:true}
        } 
        case "UPDATE_ARTICLE":{ 

            return {...state,refresh:true}
        }
           
        
        case "GET_CREATE_RANK":
        {
            const {newArticle} = state 
        var createarticle = newArticle;
        createarticle.bestpractice=action.payload;
        return {...state,newArticle:createarticle};

        }
                    


    }
        
    
        return state;
        
}



