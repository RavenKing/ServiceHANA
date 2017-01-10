//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	
}
//Implementation of POST call
function handlePost() {
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	var data = JSON.parse($.request.body.asString());
	
	/*var connCall = $.db.getConnection();
	
	
	
	var callStr = 'CALL "SMART_OPERATION"."PAL_MLR_INIT_ADV"(100086, \'factor_1,factor_2\');';
	
	var cst = connCall.prepareCall(callStr);
	

	
	cst.execute();
	
	
	cst.close();
	connCall.commit();
	connCall.close();*/
	

	//var dataParsed= JSON.parse(data);
	
	var connSelect = $.db.getConnection();
	
	/*var	queryStr = 'INSERT INTO "SMART_OPERATION"."PAL_MLR_DATA_TBL_100086" VALUES(?,?'
		
	for(var i = 0; i < data.factors.length; i ++){
		queryStr = queryStr + ',?';
	}
		
	queryStr = queryStr + ')';
	
	var pst = connSelect.prepareStatement(queryStr);
	
	pst.setBatchSize(data.origin.length);
	
	for(var i = 0; i < data.origin.length; i++){
		pst.setInteger(1,parseInt(i+1)); //sequencial ID
		pst.setDouble(2,parseFloat(data.origin[i])); //target factor value
		
		for(var j = 0; j < data.factors.length; j ++){
			
			pst.setDouble(j+3,parseFloat(data.factors[j][i])); //source factor value
		}
		
				
		pst.addBatch();
	
	}*/
	
	var string = 'INSERT INTO \"SMART_OPERATION\".\"TEST_TEST_TEST\" VALUES(2,123.3,123.4,123.5)';
	var pst = connSelect.prepareStatement(string);
	pst.execute();
	//var respArr = pst.execute();
	
	pst.close();
	connSelect.commit();
	connSelect.close();
	
	/*var respCode = true;
	
	for(var i = 0; i < data.origin.length; i++){
		if(respArr[i] < 0){
			respCode = false;
			$.response.status = $.net.http.OK;
		    return {
		    	"RespondCode": respCode
		    };
		}
	}*/
	
	
	
	
	
	
	
	return {
		
		//"data.factors.length": data.factors.length,
		//"data.factorValueArr.length": data.factorValueArr.length,
		//"data.factorValueArr[1][2]": data.factorValueArr[1][2]
		
		"output": pst
		
		
		
		
	};
	//1. factorId
	//2. factorStr
	//3. categoryStr
	//4. adjustStr
	//5. predictCnt
	var callStr = 'CALL "SMART_OPERATION"."RCA_SIM"(?,?,?,?,?,?)';
			
	var cst = connCall.prepareCall(callStr);
	
	cst.setString(1,dataParsed["factorId"]);
	cst.setString(2,dataParsed["factorCate"]);
	cst.setString(3,dataParsed["factorStr"]);
	cst.setString(4,dataParsed["factorCateStr"]);
	cst.setString(5,dataParsed["factorAdj"]);
	cst.setInteger(6,parseInt(dataParsed["predictCnt"]));
	
	
	cst.execute();
	
	var predictId = cst.getInteger(4);
	
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