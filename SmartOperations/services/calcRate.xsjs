//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call

// getCondig
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	//START -- CALL Procedure
	
	/*var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}*/
	
	//var data = $.request.body.asString();
	//var dataParsed= JSON.parse(data);
	
	var factorId = $.request.parameters.get("factorId");


	/*if(data === null)
	{
		
		return {"myResult":"Error Parameter"};
	}*/
	
	var connCheck = $.db.getConnection();
	var checkStr = 'SELECT FACTOR_SOURCE FROM "SMART_OPERATION"."PREDICT_FACTOR_CONFIG" WHERE FACTOR_TARGET = ?';
	var kst = connCheck.prepareStatement(checkStr);
	kst.setInteger(1,parseInt(factorId));
	kst.executeQuery();
	
	var checkResult = kst.getResultSet();
	checkResult.next();
	if(checkResult.getString(1) === "0"){
		return {"errMsg": "No template defined for this factor."}
	}
	

	var connCall = $.db.getConnection();	
	var callStr = 'CALL "SMART_OPERATION"."EA_PROC"(?,?)';
			
	var cst = connCall.prepareCall(callStr);
	
	//cstCall.setInteger(1,parseInt(dataParsed["factorId"]));
	cst.setInteger(1,parseInt(factorId));
	
	cst.execute();
	
	var predictId = cst.getInteger(2);
	
	cst.close();
	connCall.commit();
	connCall.close();
	
	//END -- CALL Procedure
	
	//START -- SELECT Results
	//temp
	//var predictId = 250;
	//temp end
	
	var connSelect = $.db.getConnection();
	var pst;
	var	queryStr = 'SELECT FACTOR_SOURCE, SOURCE_CATE, SOURCE_TYPE, SOURCE_NAME, INFLUENCE_RATE from "SMART_OPERATION"."PREDICT_SIGNIFICANCE" where PREDICT_ID = ? order by INFLUENCE_RATE desc';
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
			"FACTOR_GUID":result.getString(1),
			"FACTOR_CATEGORY": result.getString(2),
			"FACTOR_TYPE": result.getString(3),
			"FACTOR_NAME":result.getString(4),
			"INFLUENCE_RATE":result.getString(5)
			
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
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.CREATED;
    return {"myResult":"POST success"};
	
	
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
processRequest();




