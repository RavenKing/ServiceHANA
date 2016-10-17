import EventEmitter from "events";
import dispatcher from "../dispatcher";

class  TodoStore extends EventEmitter{
constructor() {
    super();
    this.todos=[
      { title:"shitty",id:1,name:'nice'},
      { title:"shitty2",id:2,name:'good'}
    ];
    
    
}  
    
    createStore(text)
    {
        const id = this.todos.length + 1;
        this.todos.push({
            id,
            title:text,
            complete:false
            
            
        })
        
        this.emit("change");
        
        
    }
    
    getAll(){
        
        return  this.todos;
        
    }
    
    handleActions(text){
        
       switch(text.type)
           {
               case "CREATE_TODO":
                   {
                       
                       this.createStore(text.content);
                       
                   }
                   
                   
           }
    }
    
    
}


const todoStores = new TodoStore;
dispatcher.register(todoStores.handleActions.bind(todoStores));
window.dispatcher = dispatcher;
window.todoStore =todoStores;

export default todoStores;