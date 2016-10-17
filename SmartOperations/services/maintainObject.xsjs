//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function getCurrentTotal(){
	
	var conn = $.db.getConnection();
	var pstmt;
	var number1;
	var prestring="";
	var res={};
	var list = 	[];
	prestring = 'select max(FACTOR_GUID) from "SMART_OPERATION"."PREDICT_FACTOR_MASTER"';
	pstmt=conn.prepareStatement(prestring);
	
var	result =  pstmt.executeQuery();
	while(result.next())
		{
		number1 = result.getString(1);
		number1 = parseInt(number1,0);
		number1=number1+1;
		 res.total = number1;
		 
		list.push(res);
		
		}
	result.close();
	pstmt.close();
	conn.commit();
	conn.close();
	return res;
}

//get report id 

function getReportId(Report_Name)
{
	
	if(!Report_Name)
	{ Report_Name= $.request.parameters.get("REPORT_NAME");
	}
	
	var conn = $.db.getConnection();
	var pstmt;
	var	prestring = 'select FACTOR_GUID from "SMART_OPERATION"."PREDICT_FACTOR_MASTER" where FACTOR_NAME=\''+Report_Name+'\'';
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	var output = {};
	
	var	result = pstmt.getResultSet() ;
	while(result.next())
	{
		output.factor_id = result.getString(1);
		
	}
	result.close();
	pstmt.close();
	conn.commit();
	conn.close();
	return output.factor_id;
	
	
}
// end report id 


//getConfig
function getConfig(){
	var sys_id= $.request.parameters.get("SYSID");
	var sys_clt= $.request.parameters.get("SYSCLT");
	//get config table 
	
	
	var conn = $.db.getConnection();
	var pstmt;
	var	prestring = 'select FACTOR_GUID, FACTOR_TYPE, FACTOR_NAME,FACTOR_BUSINESS_NAME from "SMART_OPERATION"."PREDICT_FACTOR_MASTER" where SYSID = \'' + sys_id + '\' and SYSCLT = \'' + sys_clt + '\' order by FACTOR_GUID desc';
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	var output = {
			"results":[]
	};
	
	var	result = pstmt.getResultSet() ;
	while(result.next())
	{
		output.results.push({
			"obj_id":result.getString(1),
			"obj_type": result.getString(2),
			"obj_name": result.getString(3),
			"obj_bname":result.getString(4)
			
			
		});
		
	}
	result.close();
	pstmt.close();
	conn.commit();
	conn.close();

	
	
	//end of get config tbale 
	
	
	return output;
	
	
}
// getCondig
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
//	populateUserDetails();
	
	var CMD = $.request.parameters.get("cmd");
var results;
	switch (CMD)
	{
	case "CONFIG" : results = getConfig();break;
	case "REPOID" : results = getReportId();break;
	default: results = "invaild";
	}
	
	
	$.response.status = $.net.http.OK;
	 return results ;


}
//Implementation of POST call
function handlePost() {
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	
	var conn = $.db.getConnection();
	var data = $.request.body.asString();
	var data1= JSON.parse(data);
	var factor_id;

	if(data === null)
		{
		
		return {"myResult":"Error Parameter"};
		}
	
	var pstmt;
	var prestring="";
	
	if(data1["factorId"]=="0"){
		var currentTotal = getCurrentTotal();
		factor_id = currentTotal.total;
	}
	else{
		factor_id = data1["factorId"];
	}
	

	
	prestring = 'UPSERT "SMART_OPERATION"."PREDICT_FACTOR_MASTER" VALUES('+factor_id+',\''+data1["factorType"]+'\',\''+data1['factorTechName']+'\',\'' + data1['sysID']+'\',\''+data1['factorBusiName']+'\',null,\''+data1["factorStat"]+'\',\''+data1["factorCategory"]+'\',\''+data1["sysClient"]+'\',\''+data1["checkPin"]+'\') where FACTOR_GUID = '+factor_id;
	pstmt=conn.prepareStatement(prestring);
	
	//execute procedure

		var result = pstmt.execute();
		pstmt.close();
		conn.commit();
		conn.close();
		
		
			
		var connConf = $.db.getConnection();
			
		var queryStr = 'CALL "SMART_OPERATION"."CONFIG_FACTOR_RELATION"(' + factor_id + ',\'' + data1["factorString"] + '\')';
			
		var cst = connConf.prepareCall(queryStr);
		cst.execute();
		cst.close();
		connConf.commit();
		connConf.close();
			
		
		
	
	
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.CREATED;
    return {"myResult":prestring};
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




