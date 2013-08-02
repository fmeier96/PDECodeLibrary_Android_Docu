$(document).ready(function() 
{
	
	var isNotNeedet = false;
	var tempElemnet;
	
	var imgOffset = 0
	
	
	$(".contents a").each(function(i, ele){
		
		var linkname = $(this).text();
		
		if (linkname == "More..."){
			
			linkname = "read more";
		
		} else 
		{
			linkname = "read more about " + linkname;
		}
			$(this).attr('title',linkname);
	})
	
	
	
	$(".contents img").each(function(i, ele)
	{
		var src = $(this).attr("src");
		
		var imageMap = 0;
		if ($(this).attr("usemap"))
		{
			imageMap = $(this).attr("usemap");
		}
		
		
		if ( src == "ftv2node.png"){
			imgOffset += $(this).width();
			$(this).remove();
			isNotNeedet = true;
				
		}
		
		if ( src == "ftv2blank.png" || src == "ftv2vertline.png"  ){
				imgOffset += $(this).width();
				$(this).remove();
				isNotNeedet = true;
		}

		if (src == "ftv2cl.png" )
		{
			$(this).attr('alt', 'class');
			$(this).attr('title', 'class');
			
			if(isNotNeedet == true){
				
				$(this).css("margin-left", imgOffset );
				imgOffset = 0;
			}
		}
		
		
		if(imageMap.length > 0)
		{
			imageMap += ". Select an area for more information on that area.";
			$(this).attr('alt', imageMap);
			$(this).attr('title', imageMap);
		
		}
		
		
		
		
		
		
		if (src == "ftv2mo.png" )
		{
			$(this).attr('alt', 'method');
			$(this).attr('title', 'method');
			
			if(isNotNeedet == true){
				
				$(this).css("margin-left", imgOffset );
				imgOffset = 0;
			}
		}

		
		if (src == "ftv2folderclosed.png")
		{
			$(this).attr('alt', 'open folder');
			$(this).attr('title', 'open folder');
		}
		
		if (src == "ftv2folderopen.png")
		{
			$(this).attr('alt', 'close folder');
			$(this).attr('title', 'close folder');

		}
		
		if (src == "ftv2mnode.png" || src == "ftv2mlastnode.png")
		{
			$(this).attr('alt', 'open node');
			$(this).attr('title', 'open node');
			$(this).css("margin-left", imgOffset );
			imgOffset = 0;
			
		}
		
		if (src == "ftv2pnode.png")
		{
			$(this).attr('alt', 'close node');
			$(this).attr('title', 'close node');
			$(this).css("margin-left", imgOffset );
			imgOffset = 0;
		}
		
		if (src == "ftv2doc.png")
		{
			var docName = $(this).next("a").text();
			
			
			if (docName == "")
			{
				docName = $(this).parent().next("a").text();
				$(this).parent().css("margin-left", imgOffset );
			} 
			else 
			{
				$(this).css("margin-left", imgOffset );
			}
			
			$(this).attr('alt',"view source of " + docName + ".html");
			$(this).attr('title',"view source of " + docName + ".html");
			
			
			imgOffset = 0;
			
		}
			
	})

});