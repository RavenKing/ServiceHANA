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
	
	var articleId = $.request.parameters.get("articleId");
	var customerId = $.request.parameters.get("customerId");


	
	var output = {
		"results":[]
	};
	
	
	if(customerId === "X"){
		
		//START -- SELECT Results
		//select from KMBSC
		var outputTbl = {
				"TABLES":[]	
			};
		
		var connSelectBsc = $.db.getConnection();
		var pstBsc;
		var	queryStrBsc = 'SELECT ATTR_NAM, ATTR_DSC, TBL_SIZE FROM "SMART_OPERATION"."KMBSC" WHERE ARTILE_ID = ? AND ATTR_TYP = ?';
		pstBsc = connSelectBsc.prepareStatement(queryStrBsc);
		
		pstBsc.setInteger(1,parseInt(articleId));
		pstBsc.setString(2,'TBL');
		
		pstBsc.executeQuery();
		
		var	resultBsc = pstBsc.getResultSet() ;
		while(resultBsc.next())
		{
			outputTbl.TABLES.push({
				"ATTR_NAM":resultBsc.getString(1),
				"ATTR_DSC": resultBsc.getString(2),
				"TBL_SIZE": resultBsc.getString(3)
			});	
		}
		resultBsc.close();
		pstBsc.close();
		connSelectBsc.commit();
		connSelectBsc.close();
		
	
		//select from KMHDR and KMDVM
	
		
		
		var connSelectHdr = $.db.getConnection();
		var pstHdr;
		var	queryStrHdr = 'SELECT ARTICLE_ID, FACTOR_GUID, ARCHOBJ, CUSTOMER_ID, ARTICLE_NAM, ARTICLE_DSC, CREATE_ON, CREATE_BY, TOTAL_SIZE, ARCHIVING, DELETION, SUMMARIZATION, AVOIDANCE, RETENTION, SAVING_EST, SAVING_EST_P,SAVING_ACT,SAVING_ACT_P,COMMENT,FACTOR_TYP FROM "SMART_OPERATION"."KMTOTAL" WHERE ARTICLE_ID = ? ORDER BY CREATE_ON DESC';
		pstHdr = connSelectHdr.prepareStatement(queryStrHdr);
		
		pstHdr.setInteger(1,parseInt(articleId));
		
		pstHdr.executeQuery();
		
		var	resultHdr = pstHdr.getResultSet() ;
		while(resultHdr.next())
		{
			output.results.push({
				"ARTICLE_ID":resultHdr.getString(1),
				"FACTOR_GUID": resultHdr.getString(2),
				"ARCHOBJ": resultHdr.getString(3),
				"CUSTOMER_ID":resultHdr.getString(4),
				"ARTICLE_NAM":resultHdr.getString(5),
				"ARTICLE_DSC":resultHdr.getString(6),
				"CREATE_ON":resultHdr.getString(7),
				"CREATE_BY":resultHdr.getString(8),
				"TOTAL_SIZE":resultHdr.getString(9),
				"ARCHIVING":resultHdr.getString(10),
				"DELETION":resultHdr.getString(11),
				"SUMMARIZATION":resultHdr.getString(12),
				"AVOIDANCE":resultHdr.getString(13),
				"RETENTION":resultHdr.getString(14),
				"SAVING_EST":resultHdr.getString(15),
				"SAVING_EST_P":resultHdr.getString(16),
				"SAVING_ACT":resultHdr.getString(17),
				"SAVING_ACT_P":resultHdr.getString(18),
				"COMMENT":resultHdr.getString(19),
				"FACTOR_TYPE":resultHdr.getString(20),
				"TABLES":outputTbl.TABLES
			});	
		}
		resultHdr.close();
		pstHdr.close();
		connSelectHdr.commit();
		connSelectHdr.close();

	}
	else{
//select from KMHDR and KMDVM
	
		
		
		var connSelectHdr = $.db.getConnection();
		var pstHdr;
		var	queryStrHdr = 'SELECT ARTICLE_ID, FACTOR_GUID, ARCHOBJ, CUSTOMER_ID, ARTICLE_NAM, ARTICLE_DSC, CREATE_ON, CREATE_BY, TOTAL_SIZE, ARCHIVING, DELETION, SUMMARIZATION, AVOIDANCE, RETENTION, SAVING_EST, SAVING_EST_P,SAVING_ACT,SAVING_ACT_P,COMMENT,FACTOR_TYP FROM "SMART_OPERATION"."KMTOTAL" WHERE CUSTOMER_ID = ? ORDER BY CREATE_ON DESC ';
		pstHdr = connSelectHdr.prepareStatement(queryStrHdr);
		
		pstHdr.setString(1,customerId);
		
		pstHdr.executeQuery();
		
		var	resultHdr = pstHdr.getResultSet() ;
		while(resultHdr.next())
		{
			var outputTbl = {
					"TABLES":[]	
				};
			
			var connSelectBsc = $.db.getConnection();
			var pstBsc;
			var	queryStrBsc = 'SELECT ATTR_NAM, ATTR_DSC, TBL_SIZE FROM "SMART_OPERATION"."KMBSC" WHERE ARTILE_ID = ? AND ATTR_TYP = ?';
			pstBsc = connSelectBsc.prepareStatement(queryStrBsc);
			
			pstBsc.setInteger(1,parseInt(resultHdr.getString(1)));
			pstBsc.setString(2,'TBL');
			
			pstBsc.executeQuery();
			
			var	resultBsc = pstBsc.getResultSet() ;
			while(resultBsc.next())
			{
				outputTbl.TABLES.push({
					"ATTR_NAM":resultBsc.getString(1),
					"ATTR_DSC": resultBsc.getString(2),
					"TBL_SIZE": resultBsc.getString(3)
				});	
			}
			resultBsc.close();
			pstBsc.close();
			connSelectBsc.commit();
			connSelectBsc.close();
			
			
			output.results.push({
				"ARTICLE_ID":resultHdr.getString(1),
				"FACTOR_GUID": resultHdr.getString(2),
				"ARCHOBJ": resultHdr.getString(3),
				"CUSTOMER_ID":resultHdr.getString(4),
				"ARTICLE_NAM":resultHdr.getString(5),
				"ARTICLE_DSC":resultHdr.getString(6),
				"CREATE_ON":resultHdr.getString(7),
				"CREATE_BY":resultHdr.getString(8),
				"TOTAL_SIZE":resultHdr.getString(9),
				"ARCHIVING":resultHdr.getString(10),
				"DELETION":resultHdr.getString(11),
				"SUMMARIZATION":resultHdr.getString(12),
				"AVOIDANCE":resultHdr.getString(13),
				"RETENTION":resultHdr.getString(14),
				"SAVING_EST":resultHdr.getString(15),
				"SAVING_EST_P":resultHdr.getString(16),
				"SAVING_ACT":resultHdr.getString(17),
				"SAVING_ACT_P":resultHdr.getString(18),
				"COMMENT":resultHdr.getString(19),
				"FACTOR_TYPE":resultHdr.getString(20),
				"TABLES":outputTbl.TABLES
			});	
					
		}
		
		resultHdr.close();
		pstHdr.close();
		connSelectHdr.commit();
		connSelectHdr.close();
		
		
		
		// start select from cap
		
		var connSelectCAP = $.db.getConnection();
		var querystring = 'select "ARTICLE_ID", "CUSTOMER_ID", "FACTOR_CAT","FACTOR_TYP","ARTICLE_NAM","ARTICLE_DSC","CREATE_ON","CREATE_BY","UPDATE_ON","UPDATE_BY","COMMENT","CAPACITY_DATE" from "SMART_OPERATION"."KMCAPVIEW" where "CUSTOMER_ID" = ?';
	
			var cpaconn;
			
			cpaconn = connSelectCAP.prepareStatement(querystring);
			cpaconn.setString(1,customerId);
			cpaconn.executeQuery();
			
			var	resultCap = cpaconn.getResultSet() ;
			while(resultCap.next())
			{
				output.results.push({
					"ARTICLE_ID": resultCap.getString(1),
					"CUSTOMER_ID": resultCap.getString(2),
					"FACTOR_CAT":resultCap.getString(3),
					"FACTOR_TYPE":resultCap.getString(4),
					"ARTICLE_NAM":resultCap.getString(5),
					"ARTICLE_DSC":resultCap.getString(6),
					"CREATE_ON":resultCap.getString(7),
					"CREATE_BY":resultCap.getString(8),
					"UPDATE_ON":resultCap.getString(9),
					"UPDATE_BY":resultCap.getString(10),
					"COMMENT":resultCap.getString(11),
					"CAPACITY_DATE":resultCap.getString(12),
				});	
			}
			resultCap.close();
			
		
	}
	
	
	//------------------------
	
	
		
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
;		 return {"myResult":"Missing BODY"};
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
	if ( contentType === null ){
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




