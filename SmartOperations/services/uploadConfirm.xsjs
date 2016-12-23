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
	
	var conn = $.db.getConnection();
	var data = $.request.body.asString();
	var dataParsed= JSON.parse(data);
	
	var tableName = dataParsed.tableName;
	var entryNum = dataParsed.tableData.length;
	var tableData = dataParsed.tableData;
	

	//judge for different TABLE
	switch(tableName){
	
		case 'CMTBL':
			var userInfo = dataParsed.userInfo;
			
			
			var loopIndex = 0;
			var j = 0;
			var respCode = true;
			var insertStmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."CMTBL" VALUES(?,?,?,?,?,?,?,0,?)' ); 
			var upsertStmt = conn.prepareStatement( 'upsert "SMART_OPERATION"."SMOPS_MASTER" values(?,?,?,?,?,\'B\',\'TBL\',1,\'X\') where customer_id = ? and sysid = ? and sysclt = ? and factor_name = ? and factor_category = \'B\' and factor_type = \'TBL\'' );
			
			insertStmt.setBatchSize(100);
			upsertStmt.setBatchSize(100);
			
			
			
				for(var i = 0; i < entryNum; i ++){
					
					
					
					var tableName = tableData[i].column_0;
					var taanaYear = parseInt(tableData[i].column_1);
					var taanaMonth = parseInt(tableData[i].column_2);
					var tableEntries = parseInt(tableData[i].column_3);
					var tableEntriesTotal = parseInt(tableData[i].column_4);
					
					
					insertStmt.setString(1,userInfo.customerId);  //customer id -input
					insertStmt.setString(2,userInfo.sysId); //sys id -input
					insertStmt.setString(3,userInfo.sysClt); //sys client -input
					insertStmt.setInteger(4,taanaYear);	//year -input
					insertStmt.setInteger(5,taanaMonth);	//month -input
					insertStmt.setString(6,tableName);	//task type -input
					insertStmt.setInteger(7,tableEntries); //report name -input
					insertStmt.setInteger(8,tableEntriesTotal); //db total -input
					
					
					upsertStmt.setString(1,userInfo.customerId);
					upsertStmt.setString(2,tableName);
					upsertStmt.setString(3,tableName);
					upsertStmt.setString(4,userInfo.sysId);
					upsertStmt.setString(5,userInfo.sysClt);
					upsertStmt.setString(6,userInfo.customerId);
					upsertStmt.setString(7,userInfo.sysId);
					upsertStmt.setString(8,userInfo.sysClt);
					upsertStmt.setString(9,tableName);
					
	
					
					insertStmt.addBatch(); 
					upsertStmt.addBatch();
				}
			
			
			var respArr = insertStmt.executeBatch();
			var respArrU = upsertStmt.executeBatch();
			insertStmt.close();
			upsertStmt.close();
			
			for(var i = 0; i < entryNum; i++){
				if(respArr[i] < 0){
					respCode = false;
					$.response.status = $.net.http.OK;
				    return {
				    	"RespondCode": respCode
				    };
				}
			}
			
			
			respCode = true;
		
		break;
	
		case 'KMHDR':
			var insertStmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."KMHDR" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)' ); 
			insertStmt.setBatchSize(entryNum);
			
			for(var i = 0; i < entryNum; i ++){
				
				insertStmt.setInteger(1,parseInt(tableData[i].column_0));  
				insertStmt.setInteger(2,parseInt(tableData[i].column_1)); 
				insertStmt.setString(3,tableData[i].column_2);
				insertStmt.setString(4,tableData[i].column_3);
				insertStmt.setString(5,tableData[i].column_4);
				insertStmt.setInteger(6,parseInt((tableData[i].column_5 == "") ? "0" : tableData[i].column_5));
				insertStmt.setString(7,tableData[i].column_6);
				insertStmt.setString(8,tableData[i].column_7);
				insertStmt.setDate(9,tableData[i].column_8); 
				insertStmt.setString(10,tableData[i].column_9);
				insertStmt.setDate(11,tableData[i].column_10);
				insertStmt.setString(12,tableData[i].column_11);
				insertStmt.setString(13,tableData[i].column_12);
				
				insertStmt.addBatch(); 
			}
			
			var respArr = insertStmt.executeBatch();
			insertStmt.close();
			var respCode = true;
			for(var i = 0; i < entryNum; i++){
				
				if(respArr[i] < 0){
					respCode = false;
					break;
				}
				
			}
			
			break;
	
		case 'KMBSC':
			var insertStmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."KMBSC" VALUES(?,?,?,?,?,?)' ); 
			insertStmt.setBatchSize(entryNum);
			
			for(var i = 0; i < entryNum; i ++){
				
				insertStmt.setInteger(1,parseInt(tableData[i].column_0));  
				insertStmt.setInteger(2,parseInt(tableData[i].column_1)); 
				insertStmt.setString(3,tableData[i].column_2);
				insertStmt.setString(4,tableData[i].column_3);
				insertStmt.setString(5,tableData[i].column_4);
				insertStmt.setDouble(6,parseFloat(tableData[i].column_5));
				
				insertStmt.addBatch(); 
			}
			
			var respArr = insertStmt.executeBatch();
			insertStmt.close();
			var respCode = true;
			for(var i = 0; i < entryNum; i++){
				
				if(respArr[i] < 0){
					respCode = false;
					break;
				}
				
			}
			
			break;
	
		case 'KMDVM':
			var insertStmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."KMDVM" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)' ); 
			insertStmt.setBatchSize(entryNum);
			
			for(var i = 0; i < entryNum; i ++){
				
				insertStmt.setInteger(1,parseInt(tableData[i].column_0));  
				insertStmt.setDouble(2,parseFloat((tableData[i].column_1 == "") ? "0" : tableData[i].column_1)); 
				insertStmt.setString(3,tableData[i].column_2);
				insertStmt.setString(4,tableData[i].column_3);
				insertStmt.setString(5,tableData[i].column_4);
				insertStmt.setString(6,tableData[i].column_5);
				insertStmt.setInteger(7,parseInt((tableData[i].column_6 == "") ? "0" : tableData[i].column_6));
				insertStmt.setDouble(8,parseFloat((tableData[i].column_7 == "") ? "0" : tableData[i].column_7));
				insertStmt.setDouble(9,parseFloat((tableData[i].column_8 == "") ? "0" : tableData[i].column_8)); 
				insertStmt.setDouble(10,parseFloat((tableData[i].column_9 == "") ? "0" : tableData[i].column_9));
				insertStmt.setDouble(11,parseFloat((tableData[i].column_10 == "") ? "0" : tableData[i].column_10));
				insertStmt.setString(12,tableData[i].column_11);
				insertStmt.setString(13,tableData[i].column_12);
				
				insertStmt.addBatch(); 
			}
			
			var respArr = insertStmt.executeBatch();
			insertStmt.close();
			var respCode = true;
			for(var i = 0; i < entryNum; i++){
				
				if(respArr[i] < 0){
					respCode = false;
					break;
				}
				
			}
			
			break;
	
			
		case 'CMWLH':
			
			var userInfo = dataParsed.userInfo;
			
			var insertStmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."CMWLH" VALUES(?,?,?,?,?,?,?,?,?,?,?,?)' ); 
			insertStmt.setBatchSize(entryNum);
			
			for(var i = 0; i < entryNum; i ++){
				
				var stepNum = parseInt((tableData[i].column_1 == "") ? "0" : tableData[i].column_1);
				var cpuAvg = parseFloat((tableData[i].column_4 == "") ? "0" : tableData[i].column_4);
				var dbAvg = parseFloat((tableData[i].column_5 == "") ? "0" : tableData[i].column_5);
				
				var cpuTotal = parseFloat((stepNum * cpuAvg / 3600000).toFixed(1));
				var dbTotal = parseFloat((stepNum * dbAvg / 3600000).toFixed(1));
				var respTotal = parseFloat((cpuTotal + dbTotal).toFixed(1));
				
				insertStmt.setString(1,userInfo.customerId);  //customer id -input
				insertStmt.setString(2,userInfo.sysId); //sys id -input
				insertStmt.setString(3,userInfo.sysClt); //sys client -input
				insertStmt.setInteger(4,parseInt(userInfo.dateYear));	//year -input
				insertStmt.setInteger(5,parseInt(userInfo.dateMonth));	//month -input
				insertStmt.setString(6,tableData[i].column_0);	//task type -input
				insertStmt.setInteger(7,stepNum); //step num -input
				insertStmt.setDouble(8,cpuAvg); //cpu avg -input
				insertStmt.setDouble(9,dbAvg); //db avg -input
				insertStmt.setDouble(10,cpuTotal); //cpu total - cal
				insertStmt.setDouble(11,dbTotal); //db total -cal
				insertStmt.setDouble(12,respTotal); //cpu + db

				
				insertStmt.addBatch(); 
			}
			
			var respArr = insertStmt.executeBatch();
			insertStmt.close();
			var respCode = true;
			for(var i = 0; i < entryNum; i++){
				
				if(respArr[i] < 0){
					respCode = false;
					break;
				}
				
			}
			
			break;
			
			
		case 'CMWLP':
			
			var userInfo = dataParsed.userInfo;
			var taskType = dataParsed.taskType;
			
			switch(taskType){
			
			case "DIALOG":
				var factorType = "DIA";
				break;
				
			case "BACKGROUND":
				var factorType = "BTC";
				break;
				
			case "RFC":
				var factorType = "RFC";
				break;
				
			default:
				var factorType = "OTH";
				break;
			
			}
			
			var loopIndex = 0;
			var j = 0;
			var respCode = true;
			
			
			var insertStmt = conn.prepareStatement( 'INSERT INTO "SMART_OPERATION"."CMWLP" VALUES(?,?,?,?,?,?,?,?,?,?)' ); 
			var upsertStmt = conn.prepareStatement( 'upsert "SMART_OPERATION"."SMOPS_MASTER" values(?,?,?,?,?,\'S\',?,1,\'X\') where customer_id = ? and sysid = ? and sysclt = ? and factor_name = ? and factor_category = \'S\' and factor_type = ?' );
			
			insertStmt.setBatchSize(100);
			upsertStmt.setBatchSize(100);
			
			if(taskType == "BACKGROUND"){
			
				for(var i = 0; i < entryNum; i ++){
					
					var cpuTotal_s = parseFloat((tableData[i].column_7 == "") ? "0" : tableData[i].column_7);
					var dbTotal_s = parseFloat((tableData[i].column_9 == "") ? "0" : tableData[i].column_9);
					
					var cpuTotal = parseFloat((cpuTotal_s / 3600).toFixed(1));
					var dbTotal = parseFloat((dbTotal_s / 3600).toFixed(1));
					
					var respTotal = cpuTotal + dbTotal;
					
					insertStmt.setString(1,userInfo.customerId);  //customer id -input
					insertStmt.setString(2,userInfo.sysId); //sys id -input
					insertStmt.setString(3,userInfo.sysClt); //sys client -input
					insertStmt.setInteger(4,parseInt(userInfo.dateYear));	//year -input
					insertStmt.setInteger(5,parseInt(userInfo.dateMonth));	//month -input
					insertStmt.setString(6,taskType);	//task type -input
					insertStmt.setString(7,tableData[i].column_0); //report name -input
					insertStmt.setDouble(8,cpuTotal); //cpu total -input
					insertStmt.setDouble(9,dbTotal); //db total -input
					insertStmt.setDouble(10,respTotal); //cpu + db  -cal
					
					upsertStmt.setString(1,userInfo.customerId);
					upsertStmt.setString(2,tableData[i].column_0);
					upsertStmt.setString(3,tableData[i].column_0);
					upsertStmt.setString(4,userInfo.sysId);
					upsertStmt.setString(5,userInfo.sysClt);
					upsertStmt.setString(6,factorType);
					upsertStmt.setString(7,userInfo.customerId);
					upsertStmt.setString(8,userInfo.sysId);
					upsertStmt.setString(9,userInfo.sysClt);
					upsertStmt.setString(10,tableData[i].column_0);
					upsertStmt.setString(11,factorType);
					
	
					
					insertStmt.addBatch(); 
					upsertStmt.addBatch();
				}
			}
			else if(taskType == "DIALOG" || taskType == "RFC"){
				
				for(var i = 0; i < entryNum; i ++){
					
					var cpuTotal_s = parseFloat((tableData[i].column_6 == "") ? "0" : tableData[i].column_6);
					var dbTotal_s = parseFloat((tableData[i].column_8 == "") ? "0" : tableData[i].column_8);
					
					var cpuTotal = parseFloat((cpuTotal_s / 3600).toFixed(1));
					var dbTotal = parseFloat((dbTotal_s / 3600).toFixed(1));
					
					var respTotal = cpuTotal + dbTotal;
					
					insertStmt.setString(1,userInfo.customerId);  //customer id -input
					insertStmt.setString(2,userInfo.sysId); //sys id -input
					insertStmt.setString(3,userInfo.sysClt); //sys client -input
					insertStmt.setInteger(4,parseInt(userInfo.dateYear));	//year -input
					insertStmt.setInteger(5,parseInt(userInfo.dateMonth));	//month -input
					insertStmt.setString(6,taskType);	//task type -input
					insertStmt.setString(7,tableData[i].column_0); //report name -input
					insertStmt.setDouble(8,cpuTotal); //cpu total -input
					insertStmt.setDouble(9,dbTotal); //db total -input
					insertStmt.setDouble(10,respTotal); //cpu + db  -cal
					
					upsertStmt.setString(1,userInfo.customerId);
					upsertStmt.setString(2,tableData[i].column_0);
					upsertStmt.setString(3,tableData[i].column_0);
					upsertStmt.setString(4,userInfo.sysId);
					upsertStmt.setString(5,userInfo.sysClt);
					upsertStmt.setString(6,factorType);
					upsertStmt.setString(7,userInfo.customerId);
					upsertStmt.setString(8,userInfo.sysId);
					upsertStmt.setString(9,userInfo.sysClt);
					upsertStmt.setString(10,tableData[i].column_0);
					upsertStmt.setString(11,factorType);
	
					
					insertStmt.addBatch(); 
					upsertStmt.addBatch();
				}
			}
			
			
			var respArr = insertStmt.executeBatch();
			var respArrU = upsertStmt.executeBatch();
			insertStmt.close();
			upsertStmt.close();
			
			for(var i = 0; i < entryNum; i++){
				if(respArr[i] < 0){
					respCode = false;
					$.response.status = $.net.http.OK;
				    return {
				    	"RespondCode": respCode
				    };
				}
			}
			
			
			respCode = true;
			
			
			break;
	}	
	
	  
    conn.commit();  
    conn.close();  
    
    
    
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.OK;
    return {
    	"RespondCode": respCode
    };
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