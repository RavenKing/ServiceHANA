//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;

// functions

function getArticleId() {

	var output = {
		"results" : []
	};

	var attr_nam = $.request.parameters.get("attr_nam");
	var conn = $.db.getConnection();
	var pstmt;
	var prestring = 'SELECT ARTILE_ID FROM "SMART_OPERATION"."KMBSC" WHERE ATTR_NAM = \''
			+ attr_nam + '\' AND ATTR_TYP = \'TBL\'';
	var string = prestring;
	pstmt = conn.prepareStatement(prestring);
	pstmt.executeQuery();
	var results = pstmt.getResultSet();
	// the attr_nam is a table
	if (results.next()) {

		output.results.push({
			"ARTICLE_ID" : results.getString(1)

		});

	}

	pstmt.close();
	conn.commit();
	conn.close();

	return output;

}
function getArchobj(article_id) {

	var output = {
		"results" : []
	};

	var conn = $.db.getConnection();
	// var article_id = $.request.parameters.get("article_id");
	var prestring = 'SELECT ARCHOBJ FROM "SMART_OPERATION"."KMDVM" WHERE ARTICLE_ID  = '
			+ article_id;
	var pstmt = conn.prepareStatement(prestring);

	pstmt.executeQuery();
	var archobj = pstmt.getResultSet();
	while (archobj.next()) {
		// $.response.setBody(archobj.getString(1));
		output.results.push({
			"ARCHOBJ" : archobj.getString(1)
		});
	}

	pstmt.close();
	conn.commit();
	conn.close();

	return output;

}

// end of function

// Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format
	var Article_Ids = getArticleId();
	var archobj;
	if (Article_Ids.results[0]) {

		var Archobjs = getArchobj(Article_Ids.results[0].ARTICLE_ID);

		archobj = Archobjs.results[0].ARCHOBJ;

	} else {

		archobj = $.request.parameters.get("attr_nam");
	}

	var conn = $.db.getConnection();
	var output = {
		"results" : []
	};
	var prestring = 'SELECT TOP 5 ARCHOBJ,TABLENAME,TABLESIZE FROM "SMART_OPERATION"."KMOBJ_TBL1" WHERE ARCHOBJ = \''
			+ archobj + '\'';
	var pstmt = conn.prepareStatement(prestring);

	pstmt.executeQuery();

	var results = pstmt.getResultSet();

	while (results.next()) {

		output.results.push({
			"ARCHOBJ" : results.getString(1),
			"TABLENAME" : results.getString(2),
			"TABLESIZE":results.getString(3)
			
		});
	}

	pstmt.close();
	conn.commit();
	conn.close();

	$.response.status = $.net.http.OK;
	return output;
}

function findMaxArticleId() {
	var conn = $.db.getConnection();
	var prestring = 'SELECT MAX(ARTILE_ID) FROM "SMART_OPERATION"."KMBSC"';
	var pstmt = conn.prepareStatement(prestring);

	pstmt.executeQuery();
	var results = pstmt.getResultSet();
	if (results.next()) {
		
		return results.getString(1);

	} else {
		return -1;
	}
}

function getParameters(fieldName) {
	var fieldValues = $.request.parameters.get(fieldName);
	
	var results = [];
	var i = 0;
	var idx = 0;
	while (i < fieldValues.length) {
		var value = '';
		var j = i;
		while (j < fieldValues.length && fieldValues[j] != ',') {
			value = value + fieldValues[j];
			j++;
		}
		
		results.push(value);
		
		

		i = j + 1;
	}
	return results;
}


function setTables() {
	//get max article_id in KMBSC table
	var article_id = Number(findMaxArticleId());
	
	//set new article_id
	if (article_id > 0) {
		
		article_id = article_id + 1;
	}
	else{
		article_id = 1;
	}
		
	
	var conn = $.db.getConnection();
	var preString;
	var pstmt;
	
	var TABLES = getParameters('tables');	
	var SIZE = getParameters('size');	
	var DESCRIPTION = getParameters('dsc');
	
	var idx = 0;		
	//insert new entry to KMBSC
	while (idx < TABLES.length && idx < DESCRIPTION.length && idx < SIZE.length) {
		var attr_id = idx + 1;
		
		preString = 'INSERT INTO "SMART_OPERATION"."KMBSC" VALUES('
				+ article_id + ',' + attr_id + ',' + '\'TBL\'' + ',\''
				+ TABLES[idx] + '\',\'' + DESCRIPTION[idx] + '\',' + SIZE[idx]
				+ ')';
		
		pstmt = conn.prepareStatement(preString);				
		pstmt.execute();
		idx++;
	}
		
	//insert new entry to KMHDR
	var archobj = $.request.parameters.get("archobj");
	var factor_guid;
	//get factor_guid
	preString = 'SELECT FACTOR_GUID FROM "SMART_OPERATION"."PREDICT_FACTOR_MASTER" WHERE FACTOR_NAME = \''+archobj+'\'';
	pstmt = conn.prepareStatement(preString);
	pstmt.executeQuery();
		
	var results = pstmt.getResultSet();
	if(results.next()){
		factor_guid = results.getString(1);
	}
		
	var customer_id = $.request.parameters.get("customer_id");
	var factor_cat = "B";
	var factor_typ = "DVM";
	var predict_id = null;
	var article_nam = $.request.parameters.get("article_nam");
	var article_dsc = $.request.parameters.get("article_dsc");
	var create_on = $.request.parameters.get("create_on");
	var create_by = $.request.parameters.get("create_by");
	var update_on = "";
	var update_by = "";
	var product = $.request.parameters.get("product");
		
	preString = 'INSERT INTO "SMART_OPERATION"."KMHDR" VALUES('
		+ article_id + ','+ factor_guid + ',\'' + customer_id + '\',\'' 
		+ factor_cat + '\',\'' + factor_typ + '\',' + predict_id + ',\'' 
		+ article_nam + '\',\'' + article_dsc + '\',\'' + create_on + '\',\''
		+ create_by + '\',\'' + update_on + '\',\'' + update_by + '\',\''
		+ product + '\')';
		
		
	pstmt = conn.prepareStatement(preString);
	pstmt.execute();
		
	//insert new entry to KMDVM
	//calculate the total size of tables	
	var total_size = 0;
	for(var i = 0; i < SIZE.length; i++){
		total_size = total_size + Number(SIZE[i]);
	}
	var archiving = $.request.parameters.get("archiving");
	var deletion = $.request.parameters.get("deletion");
	var summarization = $.request.parameters.get("summarization");
	var avoidance = $.request.parameters.get("avoidance");
	var retention = $.request.parameters.get("retention");
	var saving_est = $.request.parameters.get("saving_est");
	var saving_est_p = $.request.parameters.get("saving_est_p");
	var saving_act = $.request.parameters.get("saving_act");
	var saving_act_p = $.request.parameters.get("saving_act_p");
	var comment = $.request.parameters.get("comment");
		
		
	preString = 'INSERT INTO "SMART_OPERATION"."KMDVM" VALUES('
		+ article_id + ','+ total_size + ',\'' + archiving + '\',\'' 
		+ deletion + '\',\'' + summarization + '\',\'' + avoidance + '\',' 
		+ retention + ',' + saving_est + ',' + saving_est_p + ','
		+ saving_act + ',' + saving_act_p + ',\'' + comment + '\',\''
		+ archobj +'\')';
		
	//$.response.setBody(JSON.stringify(preString));
		
	pstmt = conn.prepareStatement(preString);
	pstmt.execute();
		
		
		
	pstmt.close();
	conn.commit();
	conn.close();
	$.response.status = $.net.http.OK;
	

}

// Implementation of POST call
function handlePost() {

	setTables();

}
// Check Content type headers and parameters
function validateInput() {
	var i;
	var j;
	// Check content-type is application/json
	contentType = $.request.contentType;
	if (contentType === null) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody("Wrong content type request use application/json");
		return false;
	}
	// Extract parameters and process them
	//$.response.setBody(JSON.stringify($.request.parameters));
	
	
	for (i = 0; i < $.request.parameters.length; ++i) {
		paramName = $.request.parameters[i].name;
		paramValue = $.request.parameters[i].value;
		//$.response.setBody(paramName);
		// Add logic
	}
	// Extract headers and process them
	for (j = 0; j < $.request.headers.length; ++j) {
		headerName = $.request.headers[j].name;
		headerValue = $.request.headers[j].value;
		// Add logic
	}
	return true;
}
// Request process
function processRequest() {
	if (validateInput()) {
		try {
			switch ($.request.method) {
			// Handle your GET calls here
			case $.net.http.GET:
				$.response.setBody(JSON.stringify(handleGet()));
				break;
			// Handle your POST calls here
			case $.net.http.POST:
				handlePost();
				break;
			// Handle your other methods: PUT, DELETE
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
