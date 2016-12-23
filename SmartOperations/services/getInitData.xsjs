//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	var customerId = $.request.parameters.get("customerId");
	var sysId = $.request.parameters.get("sysId");
	var sysClt = $.request.parameters.get("sysClt");
	var factorCate = $.request.parameters.get("factorCate");
	
	//var monthCount = $.request.parameters.get("monthCount");
	
	
	
	
	if(customerId === "" || sysId === "" || sysClt === "" || factorCate === "")
	{
		
		return {"myResult":"Error Parameter"};
	}
	
	/*return {
		"d":{
		"results": [{"CUSTOMER_ID": "1001",
        "FACTOR_NAME": "BALDAT",
        "FACTOR_BUSINESS_NAME": "Application Log",
        "SYSID": "KEV",
        "SYSCLT": "001",
        "FACTOR_CATEGORY": "B",
        "FACTOR_TYPE": "TBL",
        "TREND": "1",
        "PIN": "X"},{"CUSTOMER_ID": "1001",
            "FACTOR_NAME": "BALHDR",
            "FACTOR_BUSINESS_NAME": "Application Log Header",
            "SYSID": "KEV",
            "SYSCLT": "001",
            "FACTOR_CATEGORY": "B",
            "FACTOR_TYPE": "TBL",
            "TREND": "1",
            "PIN": "X"}]}
		
	}*/
	
//STEP 0	
	if(factorCate == 'B'){
		var ppst;
		
		var pconnSelect = $.db.getConnection();
		
		//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
		
		//var queryStr = 'SELECT SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLH" WHERE CUSTOMER_ID = ? AND DATE_Y = ? AND DATA_M = ?';
		
		//var queryStr = 'select top ? date_y, data_m, sum(cpu_total), sum(db_total), sum(step_num) from "SMART_OPERATION"."CMWLH" where customer_id = ? group by date_y, data_m order by date_y asc, data_m asc';
		
		//var queryStr = 'SELECT DATE_Y, DATE_M, SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLP" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND TASK_TYPE = ? AND REPORT_NAME = ? GROUP BY DATE_Y, DATE_M ORDER BY DATE_Y ASC, DATE_M ASC';
		var queryStr = 'SELECT * FROM "SMART_OPERATION"."SMOPS_MASTER" WHERE CUSTOMER_ID = ? AND SYSID = ? AND SYSCLT = ? AND FACTOR_CATEGORY = ? AND FACTOR_NAME IN (SELECT TOP 5 TABLE_NAME FROM "SMART_OPERATION"."CMTBL" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND DATE_Y = (SELECT MAX(DATE_Y) FROM "SMART_OPERATION"."CMTBL" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ?) AND DATE_M = (SELECT MAX(DATE_M) FROM "SMART_OPERATION"."CMTBL" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND DATE_Y = (SELECT MAX(DATE_Y) FROM "SMART_OPERATION"."CMTBL" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ?)) ORDER BY TABLE_ENTRIS_CUM DESC) ORDER BY TREND DESC';
		ppst = pconnSelect.prepareStatement(queryStr);
		
		
		ppst.setString(1,customerId);
		ppst.setString(2,sysId);
		ppst.setString(3,sysClt);
		ppst.setString(4,factorCate);
		ppst.setString(5,customerId);
		ppst.setString(6,sysId);
		ppst.setString(7,sysClt);
		ppst.setString(8,customerId);
		ppst.setString(9,sysId);
		ppst.setString(10,sysClt);
		ppst.setString(11,customerId);
		ppst.setString(12,sysId);
		ppst.setString(13,sysClt);
		ppst.setString(14,customerId);
		ppst.setString(15,sysId);
		ppst.setString(16,sysClt);
		
		ppst.executeQuery();
		
		var output = {
			"d":{
				"results":[]
			}
		};
		
		var	presult = ppst.getResultSet() ;
		while(presult.next())
		{
			
			output.d.results.push({
				"FACTOR_GUID": presult.getString(2),
				"FACTOR_TYPE": presult.getString(7),
				"FACTOR_NAME": presult.getString(2),
				"SYSID": presult.getString(4),
				"FACTOR_BUSINESS_NAME": presult.getString(3),
				"TREND": presult.getString(8),
				"STATUS": "A",
				"FACTOR_CATEGORY": presult.getString(6),
				"SYSCLT": presult.getString(5),
				"PIN": presult.getString(9),
				"CUSTOMER_ID": presult.getString(1)
			});
			
		}
		
		presult.close();
		ppst.close();
		pconnSelect.commit();
		pconnSelect.close();
	}
	
	else if(factorCate == 'S'){
		var ppst;
		
		var pconnSelect = $.db.getConnection();
		
		//var	queryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ?';
		
		//var queryStr = 'SELECT SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLH" WHERE CUSTOMER_ID = ? AND DATE_Y = ? AND DATA_M = ?';
		
		//var queryStr = 'select top ? date_y, data_m, sum(cpu_total), sum(db_total), sum(step_num) from "SMART_OPERATION"."CMWLH" where customer_id = ? group by date_y, data_m order by date_y asc, data_m asc';
		
		//var queryStr = 'SELECT DATE_Y, DATE_M, SUM( CPU_DB_TOTAL ) FROM "SMART_OPERATION"."CMWLP" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND TASK_TYPE = ? AND REPORT_NAME = ? GROUP BY DATE_Y, DATE_M ORDER BY DATE_Y ASC, DATE_M ASC';
		var queryStr = 'SELECT * FROM "SMART_OPERATION"."SMOPS_MASTER" WHERE CUSTOMER_ID = ? AND SYSID = ? AND SYSCLT = ? AND FACTOR_CATEGORY = ? AND FACTOR_NAME IN ( SELECT TOP 5 REPORT_NAME FROM "SMART_OPERATION"."CMWLP" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND DATE_Y = (SELECT MAX(DATE_Y) FROM "SMART_OPERATION"."CMWLP"  WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ?) AND DATE_M = (SELECT MAX(DATE_M) FROM "SMART_OPERATION"."CMWLP"  WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ? AND DATE_Y = (SELECT MAX(DATE_Y) FROM "SMART_OPERATION"."CMWLP" WHERE CUSTOMER_ID = ? AND SYSTEM_ID = ? AND SYSTEM_CLT = ?)) group by "REPORT_NAME","TASK_TYPE","CUSTOMER_ID","SYSTEM_ID","SYSTEM_CLT" ORDER BY SUM( "CPU_DB_TOTAL" ) DESC) ORDER BY TREND DESC';
		ppst = pconnSelect.prepareStatement(queryStr);
		
		
		ppst.setString(1,customerId);
		ppst.setString(2,sysId);
		ppst.setString(3,sysClt);
		ppst.setString(4,factorCate);
		ppst.setString(5,customerId);
		ppst.setString(6,sysId);
		ppst.setString(7,sysClt);
		ppst.setString(8,customerId);
		ppst.setString(9,sysId);
		ppst.setString(10,sysClt);
		ppst.setString(11,customerId);
		ppst.setString(12,sysId);
		ppst.setString(13,sysClt);
		ppst.setString(14,customerId);
		ppst.setString(15,sysId);
		ppst.setString(16,sysClt);
		
		ppst.executeQuery();
		
		var output = {
			"d":{
				"results":[]
			}
		};
		
		var	presult = ppst.getResultSet() ;
		while(presult.next())
		{
			
			output.d.results.push({
				"FACTOR_GUID": presult.getString(2),
				"FACTOR_TYPE": presult.getString(7),
				"FACTOR_NAME": presult.getString(2),
				"SYSID": presult.getString(4),
				"FACTOR_BUSINESS_NAME": presult.getString(3),
				"TREND": presult.getString(8),
				"STATUS": "A",
				"FACTOR_CATEGORY": presult.getString(6),
				"SYSCLT": presult.getString(5),
				"PIN": presult.getString(9),
				"CUSTOMER_ID": presult.getString(1)
			});
			
		}
		
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