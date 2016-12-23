//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	var customerId = $.request.parameters.get("customerId");
	var dateYear = $.request.parameters.get("dateYear");
	var dateMonth = $.request.parameters.get("dateMonth");
	var taskType = $.request.parameters.get("taskType");
	
	if(customerId === "" || dateYear === "" || dateMonth === "" || taskType == "")
	{
		
		return {"myResult":"Error Parameter"};
	}
	
//STEP 0	
	
	var ppst;
	
	var pconnSelect = $.db.getConnection();
	
	//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
	
	var queryStr = 'SELECT SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLP" WHERE CUSTOMER_ID = ? AND DATE_Y = ? AND DATE_M = ? AND TASK_TYPE = ?';
	
	ppst = pconnSelect.prepareStatement(queryStr);
	
	ppst.setString(1,customerId);
	ppst.setInteger(2,parseInt(dateYear));
	ppst.setInteger(3,parseInt(dateMonth));
	ppst.setString(4,taskType);
	
	ppst.executeQuery();
	
	var cpuDbSum = 0.0;
	
	var	presult = ppst.getResultSet() ;
	while(presult.next())
	{
		
		cpuDbSum = parseFloat(parseFloat(presult.getString(1)).toFixed(2));
		
	}
	
	presult.close();
	ppst.close();
	pconnSelect.commit();
	pconnSelect.close();
	
	
//STEP 1
	var pst;
	
	var connSelect = $.db.getConnection();
	
	//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
	
	var queryStr = 'select top 20 "REPORT_NAME",sum("CPU_TOTAL"),sum("DB_TOTAL"),sum("CPU_DB_TOTAL") from "SMART_OPERATION"."CMWLP" where "CUSTOMER_ID" = ? and "DATE_Y" = ? and "DATE_M" = ? and "TASK_TYPE" = ? group by "REPORT_NAME","TASK_TYPE","CUSTOMER_ID","DATE_Y","DATE_M" order by sum("CPU_DB_TOTAL") desc';
	
	pst = connSelect.prepareStatement(queryStr);
	
	pst.setString(1,customerId);
	pst.setInteger(2,parseInt(dateYear));
	pst.setInteger(3,parseInt(dateMonth));
	pst.setString(4,taskType);
	
	pst.executeQuery();
	
	var output = {
			"results":[]
	};
	var cumulated = 0.0;
	var	result = pst.getResultSet() ;
	while(result.next())
	{
		
		output.results.push({
			"REPORT_NAME": result.getString(1),
			"CPU_TOTAL":parseFloat(parseFloat(result.getString(2)).toFixed(2)),
			"DB_TOTAL": parseFloat(parseFloat(result.getString(3)).toFixed(2)),
			"CPU_DB_TOTAL": parseFloat(parseFloat(result.getString(4)).toFixed(2)),
			"CONTRIBUTION": 0.0,
			"CUMULATED": 0.0
		});
		
	}
	
	for (var i = 0; i < output.results.length; i ++){
		
		output.results[i].CONTRIBUTION = 100.0 * parseFloat(( output.results[i].CPU_DB_TOTAL / cpuDbSum ).toFixed(2));
		cumulated = cumulated + output.results[i].CONTRIBUTION;
		output.results[i].CUMULATED = cumulated;
		
	}
	
	result.close();
	pst.close();
	connSelect.commit();
	connSelect.close();
	

	
	
	
	/*return {
		"result length": output.results.length,
		"result[0]": output.results[0],
		"result[0][0]": output.results[0][0],
		"result[0].CPU_TOTAL": output.results[0].CPU_TOTAL
	}*/
		
	//END -- SELECT Results
	
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.CREATED;
    /*return {
    	"sum": cpuDbSum,
    	"output": output
    }*/
    
    
    return output;
}
//Implementation of POST call
function handlePost() {
	
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