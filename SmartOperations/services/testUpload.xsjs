//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	$.response.status = $.net.http.OK;
	 return {"myResult":" GET success"};
}
//Implementation of POST call
function handlePost() {
	/*var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}*/
	// Extract body insert data to DB and return results in JSON/other format
	//try  
	//{  
	          var conn = $.db.getConnection();  
	          
	          var pstmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."TEST_UPLOAD" VALUES(?,?,?)' );  
	          if($.request.entities.length>0){  
	                    var file_body = $.request.entities[0].body.asString();  
	                    var textLine = [];
	                    var textHeader = [];
	                    var allTextLines = file_body.split('\n');  
	                    var lines;  
	                    var entries;  
	                    var col;  
	                    pstmt.setBatchSize(allTextLines.length-2);  
	                   
	                    textHeader = allTextLines[0].split(',');
	                    for (lines=1; lines<allTextLines.length-1; lines++)  
	                    {  
	                              entries = allTextLines[lines].split(',');  
	                              
	                              //pstmt.setInteger(1,parseInt(entries[0]));  
                                 // pstmt.setString(2,entries[1]);
                                  //pstmt.setDate(3,entries[2]); 
                                  //pstmt.addBatch(); 
                                  textLine.push(entries);
	                    }  
	                    //pstmt.executeBatch();  
	          }  
	          else  
	          {  
	        	  $.response.status = $.net.http.OK;
	        	  return {"myResult":"No data"};
	          }  
	          pstmt.close();  
	          conn.commit();  
	          conn.close();  
	          $.response.status = $.net.http.OK;
	     	  return {
	     		  "myResult": "[200]: Upload Success",
	     		  "fileHeader": textHeader,
	     		  "fileData": textLine
	     		  };
	//}  
	/*catch(err)  
	{  
	          if (pstmt !== null)  
	          {  
	                    pstmt.close();  
	          }  
	          if (conn !== null)  
	          {  
	                    conn.close();  
	          }  
	          $.response.status = $.net.http.OK;
	     	  return {"myResult":"Error"};  
	}  */
	
}
// Check Content type headers and parameters
function validateInput() {
	var i; var j;
	// Check content-type is application/json
	contentType = $.request.contentType;
	if ( contentType === null){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 $.response.setBody("Wrong content type request use application/json");
		return false;
	}
	// Extract parameters and process them 
	for (i = 0; i < $.request.parameters.length; ++i) {
	    paramName = $.request.parameters[i].name;
	    paramValue = $.request.parameters[i].value;
//      Add logic	    
	}
	// Extract headers and process them 
	for (j = 0; j < $.request.headers.length; ++j) {
	    headerName = $.request.headers[j].name;
	    headerValue = $.request.headers[j].value;
//      Add logic	    
	 }
	return true;
}
// Request process 
function processRequest(){
	if (validateInput()){
		try {
		    switch ( $.request.method ) {
		        //Handle your GET calls here
		        case $.net.http.GET:
		            $.response.setBody(JSON.stringify(handleGet()));
		            break;
		            //Handle your POST calls here
		        case $.net.http.POST:
		            $.response.setBody(JSON.stringify(handlePost()));
		            break; 
		        //Handle your other methods: PUT, DELETE
		        default:
		            $.response.status = $.net.http.METHOD_NOT_ALLOWED;
		            $.response.setBody("Wrong request method");		        
		            break;
		    }
		    $.response.contentType = "application/json";	    
		} catch (e) {
		    $.response.setBody("Failed to execute action: " + e.toString());
		}
	}
}
// Call request processing  
processRequest();