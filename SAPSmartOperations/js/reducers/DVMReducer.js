export default function reducer(state={
    DVM:{},
    refresh:true
    },action){
    
    switch(action.type)
    {
        

        case "FETCHDVM":
        {
                    
            return {...state,DVM:action.payload,refresh:false}
        }
        case "UPDATESUCCESS":
        {
            const {DVM} = state;
            var newdata = DVM.results.map((dvm)=>{
                if(dvm.FACTOR_GUID == action.payload.FACTOR_GUID)
                {
                    console.log("payload added");
                        dvm = action.payload;
                    return action.payload;
                }
                else
                {
                    return dvm
                }


            })

            console.log("new data ",newdata )
            return  {...state,refresh:true,DVM:{results:newdata}}

        }
        case "SHOW_EDIT_PANEL":
        {
            var { updateArticle } = state;

            updateArticle = {};
            updateArticle.article_id = action.payload;
            return {...state,showEdit:true,updateArticle:updateArticle}
        }
        
    }
        
    
        return state;
        
}



