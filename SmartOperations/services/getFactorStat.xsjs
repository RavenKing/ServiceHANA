//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	var customerId = $.request.parameters.get("customerId");
	var sysId = $.request.parameters.get("sysId");
	var sysClt = $.request.parameters.get("sysClt");
	var factorName = $.request.parameters.get("factorName");
	var factorCate = $.request.parameters.get("factorCate");
	var factorType = $.request.parameters.get("factorType");
	//var monthCount = $.request.parameters.get("monthCount");
	
	
	
	
	if(customerId === "" || sysId === "" || sysClt === "")
	{
		
		return {"myResult":"Error Parameter"};
	}
	
	switch(factorType){
		case "DIA":
			var taskType = "DIALOG";
			break;
		case "BTC":
			var taskType = "BACKGROUND";
			break;
		case "RFC":
			var taskType = "RFC";
			break;
		case "TBL":
			var taskType = "TBL";
			break;
		default:
			var taskType = "";
			break;
	}
	
//STEP 0	
	if(factorCate == 'S'){
		var ppst;
		
		var pconnSelect = $.db.getConnection();
		
		//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
		
		//var queryStr = 'SELECT SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLH" WHERE CUSTOMER_ID = ? AND DATE_Y = ? AND DATA_M = ?';
		
		//var queryStr = 'select top ? date_y, data_m, sum(cpu_total), sum(db_total), sum(step_num) from "SMART_OPERATION"."CMWLH" where customer_id = ? group by date_y, data_m order by date_y asc, data_m asc';
		
		var queryStr = 'SELECT DATE_Y, DATE_M, SUM(STEP), SUM( RESP_AVG ), SUM( RESP_TOTAL ) FROM "SMART_OPERATION"."CMWLP" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND TASK_TYPE = ? AND REPORT_NAME = ? GROUP BY DATE_Y, DATE_M ORDER BY DATE_Y ASC, DATE_M ASC';
		
		ppst = pconnSelect.prepareStatement(queryStr);
		
		
		ppst.setString(1,customerId);
		ppst.setString(2,sysId);
		ppst.setString(3,sysClt);
		ppst.setString(4,taskType);
		ppst.setString(5,factorName);
		
		ppst.executeQuery();
		
		var output = {
				"results":[]
		};
		
		var	presult = ppst.getResultSet() ;
		while(presult.next())
		{
			
			output.results.push({
				"YEAR_MONTH": presult.getString(1) + '-' + presult.getString(2),
				"STEP": parseInt(presult.getString(3)),
				"AVG_TIME":parseFloat(parseFloat(presult.getString(4)).toFixed(2)),
				"TOTAL_TIME":parseFloat(parseFloat(presult.getString(5)).toFixed(2))
			});
			
		}
		
		presult.close();
		ppst.close();
		pconnSelect.commit();
		pconnSelect.close();
	}
	
	else if(factorCate == 'B'){
		var ppst;
		
		var pconnSelect = $.db.getConnection();
		
		//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
		
		//var queryStr = 'SELECT SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLH" WHERE CUSTOMER_ID = ? AND DATE_Y = ? AND DATA_M = ?';
		
		//var queryStr = 'select top ? date_y, data_m, sum(cpu_total), sum(db_total), sum(step_num) from "SMART_OPERATION"."CMWLH" where customer_id = ? group by date_y, data_m order by date_y asc, data_m asc';
		var getTotalStmt = pconnSelect.prepareStatement('SELECT TOP 1 TABLE_ENTRIS_CUM FROM "SMART_OPERATION"."CMTBL" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND TABLE_NAME = ? ORDER BY DATE_Y DESC, DATE_M DESC');
		getTotalStmt.setString(1,customerId);
		getTotalStmt.setString(2,sysId);
		getTotalStmt.setString(3,sysClt);
		getTotalStmt.setString(4,factorName);
		getTotalStmt.executeQuery();
		var totalEntries = [];
		
		
		var qy = 'SELECT TOP 1 "TABLE_ENTRIS_CUM" FROM "SMART_OPERATION"."CMTBL" WHERE "CUSTOMER_ID" = '+customerId+' AND "SYSTEM_ID" = \''+sysId+'\' AND "SYSTEM_CLT" = \''+sysClt+'\' AND "TABLE_NAME" = \''+factorName+'\' ORDER BY "DATE_Y" DESC, "DATE_M" DESC';
		
		var newone = pconnSelect.prepareStatement(qy);
		newone.executeQuery();
		var totalEntriesResult = newone.getResultSet();
		
		
		while(totalEntriesResult.next()){
			totalEntries.push({
				"results": totalEntriesResult.getString(1)
			})
		}
		var initTotalEntries = parseInt(totalEntries[0].results);
		
		totalEntriesResult.close();
		getTotalStmt.close();
		
		var queryStr = 'SELECT "DATE_Y", "DATE_M", "TABLE_ENTRIS" FROM "SMART_OPERATION"."CMTBL" WHERE "CUSTOMER_ID" = '+customerId+' AND "SYSTEM_ID" = \''+sysId+'\' AND "SYSTEM_CLT" = \''+sysClt+'\' AND "TABLE_NAME" = \''+factorName+'\' ORDER BY "DATE_Y" DESC, "DATE_M" DESC';
		ppst = pconnSelect.prepareStatement(queryStr);
		
		
	/*	ppst.setString(1,customerId);
		ppst.setString(2,sysId);
		ppst.setString(3,sysClt);
		ppst.setString(4,factorName);
	*/	
		ppst.executeQuery();
		
		var output = {
				"results":[]
		};
		
		var	presult = ppst.getResultSet() ;
		
		while(presult.next())
		{//////////////////////////////////////////////////////////////////////////////////////////////////
			////////////////////////////////////////////////////////
			//////////////////////////////////
			
			output.results.push({
				"YEAR_MONTH": presult.getString(1) + '-' + presult.getString(2),
				"MONTHLY_ENTRIES": parseInt(presult.getString(3)),
				"TABLE_ENTRIES":initTotalEntries
			});
			initTotalEntries = initTotalEntries - parseInt(presult.getString(3));
		}
		
		output.results.reverse();
		
		presult.close();
		ppst.close();
		pconnSelect.commit();
		pconnSelect.close();
	}
	

	

	
	
	
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