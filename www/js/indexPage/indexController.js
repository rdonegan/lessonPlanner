myApp.onPageInit('index', function (page) {
  // alert("index initialized")
  getCurrentLessons(function(items){

    if (items.length==0){
        $('.currentLessons').html('<div class="content-block-title">No lesson plans created for today</div>');
    }
    else{
       
        for(var i in items){
        // alert(items[i].standards)
            var currentPlansList= myApp.virtualList('.currentLessons', {
                items: items,
                renderItem: function(index,item){
                    return '<li>' +
                            '<a href="lessonForm.html?id='+ item.id+'" class="item-link item-content" data-context=\'{"standards":' + item.standards +', "objectives": ' + item.objectives +' }\'>' +
                              '<div class="item-inner">' +
                                '<div class="item-title-row">' +
                                  '<div class="item-title">' + item.subject.charAt(0).toUpperCase() + item.subject.slice(1) + '</div>' +
                                  '<div class="item-after">'+toMonth((item.startdate.substr(5,5)).substr(0,2))+ ' ' + item.startdate.substr(0,4) + '</div>' +
                                '</div>' +
                                '<div class="item-subtitle">Grade ' + item.grade +', Quarter '+ item.quarter + '</div>' +
                                '<div class="chip bg-teal"><div class="chip-label">Standards: '+JSON.parse(item.standards).length+'</div></div>'+
                                '<div class="chip bg-amber"><div class="chip-label">Objectives: '+JSON.parse(item.objectives).length+'</div></div>'+
                                '<div class="chip bg-indigo"><div class="chip-label">Performance Indicators: '+JSON.parse(item.indicators).length+'</div></div>'+
                              '</div>' +
                            '</a>' +
                          '</li>';
                },
                height:115
            });
        }

    }  

  })
});


//Returns array of current lesson plans (based on start and end date)
function getCurrentLessons(callback) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 

    today =  yyyy+'-'+mm+'-'+dd;
    // alert("today's date: " + today)
        
    var items = new Array();
    lpdb.transaction(function(tx) {
        tx.executeSql('SELECT * FROM lessonplans WHERE startdate <= "' + today + '" AND enddate >= "' + today +'" ORDER BY date(startdate)', [], function(tx, results) {
            
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                // items.push(results.rows.item(i).subject);
                var row = {"id": results.rows.item(i).id , "teachername": results.rows.item(i).teachername , "school": results.rows.item(i).school , "startdate": results.rows.item(i).startdate , "enddate": results.rows.item(i).enddate , "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "section": results.rows.item(i).section , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives , "indicators": results.rows.item(i).indicators , "resources": results.rows.item(i).resources , "notes": results.rows.item(i).notes }
                items.push(row)
            }
            
            callback(items)
        });
    });
}