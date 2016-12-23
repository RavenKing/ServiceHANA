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
	
	var factorName = $.request.parameters.get("factorName");
	var factorCate = $.request.parameters.get("factorCate");
	var customerId = $.request.parameters.get("customerId");
	var sysId = $.request.parameters.get("sysId");
	var sysClt = $.request.parameters.get("sysClt");


	if(factorName === "" || factorCate === "" || customerId === "" || sysId === "" || sysClt === "")
	{
		
		return {"myResult":"Error Parameter"};
	}
	
	
	

	var connCall = $.db.getConnection();	
	//var callStr = 'CALL "SMART_OPERATION"."EA_PROC"(?,?)';
	//var callStr = 'CALL RCA_PROC('SLG1','S','1001','KEV','001',?)';
	var callStr = 'CALL "SMART_OPERATION"."RCA_PROC"(?,?,?,?,?,?)';
	var cst = connCall.prepareCall(callStr);
	
	//cstCall.setInteger(1,parseInt(dataParsed["factorId"]));
	cst.setString(1,factorName);
	cst.setString(2,factorCate);
	cst.setString(3,customerId);
	cst.setString(4,sysId);
	cst.setString(5,sysClt);
	
	cst.execute();
	
	var predictId = cst.getInteger(6);
	
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
	var	queryStr = 'SELECT FACTOR_SOURCE, SOURCE_CATE, SOURCE_TYPE, INFLUENCE_RATE from "SMART_OPERATION"."SMOPS_SIG" where PREDICT_ID = ? order by INFLUENCE_RATE desc';
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
			"FACTOR_NAME":result.getString(1),
			"INFLUENCE_RATE":result.getString(4)
			
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




