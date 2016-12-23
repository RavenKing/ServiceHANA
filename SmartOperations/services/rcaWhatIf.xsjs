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
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	//read data
	var data = JSON.parse($.request.body.asString());
	
	var predictIdArr = [];
	var factorArr = data.factorStr.split(',');
	
	//get predict id and MLR tables' name
	
	for(var i = 0; i < data.factors.length; i ++){//start big loop
	
	var connGet = $.db.getConnection();
	
	var gst = connGet.prepareStatement('SELECT MAX(PREDICT_ID) FROM "SMART_OPERATION"."SMOPS_SIM_HIST"');
	
	gst.executeQuery();
	
	var	gresult = gst.getResultSet();
	var predict_id = 0;	
	while(gresult.next())
	{
		predict_id = parseInt(gresult.getString(1));
		
	}
	
	gresult.close();
	gst.close();
	connGet.commit();
	connGet.close();
	
	predict_id = predict_id + 1;
	
	predictIdArr[i] = predict_id;
	
	//creat predict master record
	//INSERT INTO "SMART_OPERATION"."SMOPS_SIM_HIST" VALUES(:PRD_ID,'AUTO_ANALYSIS','Auto What If Analysis','EA_WHATIF','EA',CURRENT_TIMESTAMP,12,'INI','N.A.',:FACTOR_STR,'N.A.',:PREDICT_FACTOR);
	
	var connInsert = $.db.getConnection();
	
	var ist = connInsert.prepareStatement('INSERT INTO "SMART_OPERATION"."SMOPS_SIM_HIST" VALUES(?,\'AUTO_ANALYSIS\',\'Auto What If Analysis\',\'EA_WHATIF\',\'EA\',\'9999-12-31\',12,\'INI\',\'N.A.\',?,\'N.A.\',?);');
	
	ist.setInteger(1,predict_id);
	ist.setString(2,data.factorId);
	ist.setString(3,data.factorStr);
	
	ist.execute();
	
	
	
	ist.close();
	connInsert.commit();
	connInsert.close();
	
	
	//create tables
	
	var connCall = $.db.getConnection();
	
	
	
	var callStr = 'CALL "SMART_OPERATION"."PAL_MLR_INIT_ADV"(?, ?);';
	
	var cst = connCall.prepareCall(callStr);
	
	cst.setInteger(1,predict_id);
	cst.setString(2,data.factorId);
	
	cst.execute();
	
	
	cst.close();
	connCall.commit();
	connCall.close();
	
	
	//prepare to insert values
	var data_table_name = 'PAL_MLR_DATA_TBL_' + predict_id.toString();
	
	var conn = $.db.getConnection();
	var queryStr = 'INSERT INTO "SMART_OPERATION"."' + data_table_name + '" VALUES(?,?,?)';
	
	
	
	var pst = conn.prepareStatement(queryStr);
	
	pst.setBatchSize(data.origin.length);
	
	for(var ii = 0; ii < data.origin.length; ii++){
		pst.setInteger(1,parseInt(ii+1)); //sequencial ID
		pst.setDouble(2,parseFloat(data.factors[i][ii]));
		pst.setDouble(3,parseFloat(data.origin[ii])); //target factor value
		pst.addBatch();
	
	}
	
	var respArr = pst.execute()
	pst.close();
	
	conn.commit();
	conn.close();
	
	var respCode = true;
	
	for(var ii = 0; ii < data.origin.length; ii++){
		if(respArr[ii] < 0){
			respCode = false;
			$.response.status = $.net.http.OK;
		    return {
		    	"RespondCode": respCode
		    };
		}
	}
	
	//CALL PREDICT FUNCTIONS RCA_SIM_PROC(?,?,?) 1. factor_name 2. factor_str 3. predict_cnt 4. predict_id
	var connCallPred = $.db.getConnection();
	
	
	
	var callStrPred = 'CALL "SMART_OPERATION"."RCA_SIM_PROC"(?,?,?,?);';
	
	var cstPred = connCallPred.prepareCall(callStrPred);
	
	cstPred.setString(1,factorArr[i]);
	cstPred.setString(2,data.factorId);///////////////////////////////////////////////////////////////////////////////
	cstPred.setInteger(3,data.predictCnt);
	cstPred.setInteger(4,predict_id);
	
	cstPred.execute();
	
	
	cstPred.close();
	connCallPred.commit();
	connCallPred.close();
	
//delete tables
	
	var connCallDel = $.db.getConnection();
	
	
	
	var callDelStr = 'CALL "SMART_OPERATION"."PAL_MLR_CLOSE"(?);';
	
	var cstDel = connCallDel.prepareCall(callDelStr);
	
	cstDel.setInteger(1,predict_id);
	
	cstDel.execute();
	
	
	cstDel.close();
	connCallDel.commit();
	connCallDel.close();
	
	}//end big loop
	
//START -- SELECT Results
	
	var output = {
			"series":[],
			"nameArr": [],
			"axis":[]
	};
	for(var i = 0; i < data.factors.length; i++){
		
	var actResult = [];
	var preResult = [];
	var axisResult = [];
	var connSelect = $.db.getConnection();
	var spst;
	var	squeryStr = 'SELECT WEEKNUM, DATETIME, REALVALUE, PREDICTVALUE from "SMART_OPERATION"."PREDICT_HIST_DATA" where PREDICT_ID = ? ORDER BY WEEKNUM ASC';
	spst = connSelect.prepareStatement(squeryStr);
	
	spst.setInteger(1,predictIdArr[i]);
	
	spst.executeQuery();
	
	var	sresult = spst.getResultSet() ;
	while(sresult.next())
	{
		actResult.push(parseFloat(sresult.getString(3)));
		preResult.push(parseFloat(sresult.getString(4)));
		axisResult.push(sresult.getString(1));
		
	}
	sresult.close();
	spst.close();
	connSelect.commit();
	connSelect.close();
	
	output.series.push(actResult);
	output.series.push(preResult);

	output.axis.push(axisResult);
	
	output.nameArr.push(factorArr[i]+"-ACTUAL");
	output.nameArr.push(factorArr[i]+"-PREDICT");
		
	}
	
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