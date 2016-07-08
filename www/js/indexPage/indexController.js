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