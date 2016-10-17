//**** Example for basic REQUEST RESPONSE handling
var paramName; var paramValue; var headerName; var headerValue; var contentType;
//Implementation of GET call
function articledeleteall(){
	var articleid = $.request.parameters.get("article_id");
	var conn = $.db.getConnection();
	var pstmt;
	var	prestring = ' delete from "SMART_OPERATION"."KMDVM" where ARTICLE_ID = ' + articleid;
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	prestring = ' delete from "SMART_OPERATION"."KMBSC" where ARTILE_ID = ' + articleid;
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	prestring = ' delete from "SMART_OPERATION"."KMISS" where ARTICLE_ID = ' + articleid;
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	pstmt.close();
	conn.commit();
	conn.close();

	
	
	
	return pstmt;
	
}

function getArticleId(attr_nam) {

	var output = {
		"results" : []
	};

	var conn = $.db.getConnection();
	var pstmt;
	var prestring = 'SELECT ARTILE_ID FROM "SMART_OPERATION"."KMBSC" WHERE ATTR_NAM = \''
			+ attr_nam + '\' AND ATTR_TYP = \'TBL\'';
	
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



function GetRecommendation()
{
	
	var industry = $.request.parameters.get("industry");
	var archobj = $.request.parameters.get("archobj");
	
	var Article_Ids = getArticleId(archobj);
	
	if (Article_Ids.results[0]) {

		var Archobjs = getArchobj(Article_Ids.results[0].ARTICLE_ID);

		archobj = Archobjs.results[0].ARCHOBJ;

	}
	
	var conn = $.db.getConnection();
	var pstmt;
	var	prestring = 'select AVG("SAVING_EST_P") as AvgS , AVG("RETENTION")as Retention,"ARCHOBJ"  from (select * from "SMART_OPERATION"."KMDATAM" where "SAVING_EST_P">0) group by "ARCHOBJ","INDUSTRY" having "ARCHOBJ" =\'' 
		+ archobj +  '\'  and "INDUSTRY" = \''+industry+'\'';
	
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	var output = {
			"results":[]
	};
	var	result = pstmt.getResultSet() ;
	while(result.next())
	{
		output.results.push({
			"AVGS":result.getString(1),
			"Retention":result.getString(2),
			"ARCHOBJ":result.getString(3)
		});
		
	}
	pstmt.close();
	conn.commit();
	conn.close();
	return output;


}

function GetAllRecom()
{
	var output = {"results":[]};

	var archobj = $.request.parameters.get("archobj");
	var region = $.request.parameters.get("region");
	var conn = $.db.getConnection();
	var pstmt;
	var prestring = 'select AVG("SAVING_EST_P") as AvgS , AVG("RETENTION")as Retention,"ARCHOBJ" ,"REGION",Count("REGION") from (select * from "SMART_OPERATION"."KMDATAM" where  "SAVING_EST_P">0) group by "ARCHOBJ","REGION" having "ARCHOBJ" = \''+archobj+'\' and "REGION" !=\'\'';
	pstmt=conn.prepareStatement(prestring);
	pstmt.executeQuery();
	var	result = pstmt.getResultSet() ;
	while(result.next())
	{
		output.results.push({
			"AVGS":result.getString(1),
			"Retention":result.getString(2),
			"ARCHOBJ":result.getString(3),
			"Region":result.getString(4),
			"CustomerCount":result.getString(5)
		});
		
	}

	pstmt.close();
	conn.commit();
	conn.close();
	return output;

}


function handleGet() {
	var CMD = $.request.parameters.get("cmd");
	var results;
		switch (CMD)
		{
		case "DELETE":results=articledeleteall();break;
		case "RECOMMENDATAION":results=GetRecommendation();break;
		case "ALLRECOM":results=GetAllRecom();break;
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
// Call request processing  
processRequest();
