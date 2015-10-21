function saveURL(){
    console.log("In save URL");
    var alltabs=[];
    var self= this;
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
                          function(tabs){
                              
                              
                               chrome.storage.local.get("urls", function(vb){
                                
                                for(x in vb.urls){
                                    console.log("Id of self"+ self.id + "value of X" + x);
                                    if(self.id==(x+ "_s"))
                                    {   
                                        vb.urls[x].push(tabs[0].url);
                                        console.log(vb);
                                        chrome.storage.local.set(vb);
                                    }
                                }                            
                               });
                          });
    goBack();
}
function openURL(){
	console.log("In open URL");
	var self= this;
	chrome.storage.local.get("urls", function(url_list){
		//       for(x in url_list.urls){ 
		//           if(self.id==x)
		//            {
		url_list.urls[self.id].forEach(function(obj){
			var newURL = obj;
			chrome.tabs.create({ url: newURL, "active" :false }, function(){return;});
		});
		//	       break;
		//            }
		//   }
	});
}
function saveList(){
	var listName= document.getElementById("listName").value;
	if(listName.length ==0)
	{
		return;
	}
	chrome.storage.local.get("urls", function(url_list){
		url_list.urls[listName]=[];
		chrome.storage.local.set(url_list);
		createTable();
	});
}
function editList()
{
    var self= this;
    var body= document.getElementById("body");
    var bodyData="";
    chrome.storage.local.get("urls", function(vb){
        for(list in vb.urls){
            
            if(self.id==(list+ "_e"))
            {   
                console.log("List iS:" + list);
		name = list.toUpperCase();
                bodyData= '<<div id="'+ list+'_h" class="lead"> ' + name +"</div>";
                var it=0;
		if(vb.urls[list].length==0)
	   		bodyData= bodyData+ "<div> This list is empty</div>";
                vb.urls[list].forEach(function(obj){
                        console.log(obj.length);
                        var c = obj;
			c = c.substring(0, 30)
                        var dots= "...";
                        c= c+ dots;
                        console.log(c);

                        bodyData=  bodyData+'<div class="row" id="'+it+'"> <div id="'+it+ '_div" class= "col-xs-10">'+c+' </div> <a href="#" id="deleteB_'+it+ '"class="col-xs-2"> <span  class="glyphicon glyphicon-remove-circle"> </span> </a> </div>'  


                        console.log("Iteration: \n"+bodyData);
                    it++;
                });
		it=0;
                bodyData= bodyData+ "<br> <button id='go' class=\"btn btn-block\"> Collapse Group </button>";
		bodyData= "<div id='details'>" + bodyData;
		bodyData= bodyData + "</div>";
                console.log("Outside Loop" + bodyData);
                body.innerHTML="";
                body.innerHTML= bodyData;
                console.log(body.innerHTML);
		//Add eventListener for deleting Url from List
		vb.urls[list].forEach(function(obj){
			var delB = document.getElementById("deleteB_"+it);
			delB.addEventListener("click", removeElement, false);
			it++;
		});
		//Add onClick Listener To for Going Back
		var go = document.getElementById("go");
		go.addEventListener("click", goBack, false);

            }
        }
       
                                    
       });
}
function removeElement(){
	console.log("In removeElement");
	var self=this;
   	chrome.storage.local.get("urls", function(vb){
		for(var group in vb.urls) {
			var listName= document.getElementById(group+"_h");
			if(listName !=null) { 
				var indexNo = JSON.stringify(self.id.split("_"));
				indexNo= JSON.parse(indexNo);
				var ind= parseInt(indexNo[1]);
				vb.urls[group].splice(indexNo, 1);
				chrome.storage.local.set(vb);
				document.getElementById(ind).innerHTML= "";
			}
		}
	});
}
function createTable(){
    
    var tab=document.getElementById("tab");
    var tableData="";
    var siteList="";
    chrome.storage.local.get("urls", function(vb){
        if(JSON.stringify(vb)=="{}")
        {
            chrome.storage.local.set({'urls':{"default": []}});
            vb={'urls':{"defaults": []}};
        }
        for(var x in vb.urls) {
            tableData=tableData+  '<div class="row container"><button class="btn btn-default col-xs-9" id="'+x+'">'+x+'</button>' +
				'<a href="#" class="col-xs-1" id="'+x+'_s"><span style="color:green"class="glyphicon glyphicon-plus"></span> </a>' +
				'<a href="#" class="col-xs-1" id="'+x+'_e"><span style="color:red" class="glyphicon glyphicon-edit"></span> </a></div>';
        }
        tab.innerHTML= tableData;
        
        for(var x in vb.urls) {
            var openE= document.getElementById(x);
            openE.addEventListener("click",openURL,false);
            var editE= document.getElementById(x+"_e");
            editE.addEventListener("click",editList,false);
            var saveE = document.getElementById(x+"_s");
            saveE.addEventListener("click", saveURL,false);
        }
    });
}
function goBack(){
	document.getElementById("details").innerHTML="";
}
var openB = document.getElementById("createList");
openB.addEventListener("click", saveList,false);


window.onload = createTable;
