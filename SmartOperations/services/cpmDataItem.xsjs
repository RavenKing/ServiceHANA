//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	var customerId = $.request.parameters.get("customerId");
	
	
	if(customerId === "")
	{
		
		return {"myResult":"Error Parameter"};
	}

	
	var connSelect = $.db.getConnection();
	var pst;
	//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
	
	var queryStr = 'SELECT TOP 5 DISTINCT DATE_Y, DATA_M FROM "SMART_OPERATION"."CMWLH" WHERE CUSTOMER_ID = ? ORDER BY DATE_Y DESC, DATA_M DESC';
	
	pst = connSelect.prepareStatement(queryStr);
	
	pst.setString(1,customerId);
	
	pst.executeQuery();
	
	var output = {
			"results":[]
	};
	
	var	result = pst.getResultSet() ;
	while(result.next())
	{
		
		output.results.push({
			"ITEM_NAME":result.getString(1) + '-' + result.getString(2)	,
			"category": 'CPM-Overview',
			"dateYear": result.getString(1),
			"dateMonth": result.getString(2),
			"customerId": customerId
		});
		
	}
	//////////
	output.results.push({
		"ITEM_NAME":'Last 3 Months',
		"category": 'CPM-History',
		"monthCount": "3",
		"latestYear": output.results[0].dateYear,
		"latestMonth": output.results[0].dateMonth,
		"customerId": customerId
	});
	output.results.push({
		"ITEM_NAME":'Last 6 Months',
		"category": 'CPM-History',
		"monthCount": "6",
		"latestYear": output.results[0].dateYear,
		"latestMonth": output.results[0].dateMonth,
		"customerId": customerId
	});
	output.results.push({
		"ITEM_NAME":'Last 12 Months',
		"category": 'CPM-History',
		"monthCount": "12",
		"latestYear": output.results[0].dateYear,
		"latestMonth": output.results[0].dateMonth,
		"customerId": customerId
	});
	
	
	/////////////
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