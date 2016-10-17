function deleteArticle(){
	var article_id = $.request.parameters.get(article_id);
	$.response.setBody(article_id);
	
}

deleteArticle();