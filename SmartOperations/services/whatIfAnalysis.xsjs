//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	var factorId = $.request.parameters.get("factorId");
	var factorStr = $.request.parameters.get("factorStr");
	
	
	if(factorStr === "")
	{
		
		return {"myResult":"Error Parameter"};
	}
	
	var connCall = $.db.getConnection();
			
	var callStr = 'CALL "SMART_OPERATION"."EA_PROC_PD"(?,?,?)';
			
	var cst = connCall.prepareCall(callStr);
	
	cst.setInteger(1,parseInt(factorId));
	cst.setString(2,factorStr)
	
	cst.execute();
	
	var predictId = cst.getInteger(3);
	
	cst.close();
	connCall.commit();
	connCall.close();
	
	//temp
	//var predictId = 281;
	//temp end
	//END -- CALL Procedure
	
	//START -- SELECT Results
	
	$.trace.info('check trace file');
	
	var connSelect = $.db.getConnection();
	var pst;
	var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
	pst = connSelect.prepareStatement(queryStr);
	
	pst.setInteger(1,predictId);
	
	pst.executeQuery();
	
	var output = {
			"results":[]
	};
	
	var	result = pst.getResultSet() ;
	while(result.next())
	{
		output.results.push({
			"ID":result.getString(1),
			"DATE_TIME": result.getString(2),
			"ACTUAL_VALUE": result.getString(3),
			"PREDICT_VALUE":result.getString(4)
			
		});
		
	}
	result.close();
	pst.close();
	connSelect.commit();
	connSelect.close();
		
	//END -- SELECT Results
	
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.CREATED;
    return output;
}
//Implementation of POST call
function handlePost() {
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	
	var connCall = $.db.getConnection();
	var data = $.request.body.asString();

	var dataParsed= JSON.parse(data);
	
	if(data === null)
	{
		
		return {"myResult":"Error Parameter"};
	}
	

			
	var callStr = 'CALL "SMART_OPERATION"."EA_PROC_PD"(?,?,?)';
			
	var cst = connCall.prepareCall(callStr);
	
	cst.setInteger(1,parseInt(dataParsed["factorId"]));
	cst.setString(2,dataParsed["factorStr"])
	
	cst.execute();
	
	var predictId = cst.getInteger(3);
	
	cst.close();
	connCall.commit();
	connCall.close();
	//temp
	//var predictId = 281;
	//temp end
	//END -- CALL Procedure
	
	//START -- SELECT Results
	
	var connSelect = $.db.getConnection();
	var pst;
	var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
	pst = connSelect.prepareStatement(queryStr);
	
	pst.setInteger(1,predictId);
	
	pst.executeQuery();
	
	var output = {
			"results":[]
	};
	
	var	result = pst.getResultSet() ;
	while(result.next())
	{
		output.results.push({
			"ID":result.getString(1),
			"DATETIME": result.getString(2),
			"ACTUAL_VALUE": result.getString(3),
			"PREDICT_VALUE":result.getString(4)
			
		});
		
	}
	result.close();
	pst.close();
	connSelect.commit();
	connSelect.close();
		
	//END -- SELECT Results
	
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.CREATED;
    return output;
}
// Check Content type headers and parameters
function validateInput() {
	var i; var j;
	// Check content-type is application/json
	contentType = $.request.contentType;
	if ( contentType === null || contentType.startsWith("application/json") === false){
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