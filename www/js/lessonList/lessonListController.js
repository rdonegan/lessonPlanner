myApp.onPageInit('lessonList', function (page) {

    var virtualList;
   
   //**** Filter virtual list

    $$(document).on('click', '.noFilter', function(){
        virtualList.resetFilter();
    })

    $$(document).on('click', '.englishFilter', function(){
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            if(lessonPlans[i].subject == "english"){
                filterIndex.push(i);
            }
        }
        virtualList.filterItems(filterIndex)
    })

    $$(document).on('click', '.mathFilter', function(){
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            if(lessonPlans[i].subject == "math"){
                filterIndex.push(i);
            }
        }
        virtualList.filterItems(filterIndex)

    })

        $$(document).on('click', '.socialFilter', function(){

        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            if(lessonPlans[i].subject == "socialStudies"){
                filterIndex.push(i);
            }
        }
        virtualList.filterItems(filterIndex)
    })

    $$(document).on('click', '.scienceFilter', function(){

        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            if(lessonPlans[i].subject == "science"){
                filterIndex.push(i);
            }
        }
        virtualList.filterItems(filterIndex)
    })

    $$(document).on('click', '.palauanFilter', function(){

        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            if(lessonPlans[i].subject == "palauan"){
                filterIndex.push(i);
            }
        }
        virtualList.filterItems(filterIndex)
    })

    //**** Delete lesson plan from database
    $('.list-block').on("click", ".swipeout-delete", function(e){
        deleteFromLPDB(this.id)
    })  
    
    
    //Create virtual list of all lesson plans
    getLessons(function(items){
        if(items.length==0){
            $('.editLessons').html('<h2 class="openingPrompt">No Lesson Plans Created :(</h2>');
        }
        else{
            virtualList= myApp.virtualList('.editLessons', {
                items: items,
                renderItem: function(index,item){
                    return '<li class="swipeout">' +
                            '<a href="lessonForm.html?id='+ item.id+'" class="item-link item-content swipeout-content" data-context=\'{"standards":' + item.standards +', "objectives": ' + item.objectives +' }\'>' +
                              '<div class="item-inner">' +
                                '<div class="item-title-row">' +
                                  '<div class="item-title">' + item.subject.charAt(0).toUpperCase() + item.subject.slice(1) + '</div>' +
                                  '<div class="item-after">'+toMonth((item.startdate.substr(5,5)).substr(0,2))+ ' ' + toDay((item.startdate.substr(5,5)).substr(3,4)) + ' - ' + toMonth((item.enddate.substr(5,5)).substr(0,2)) + ' ' + toDay((item.enddate.substr(5,5)).substr(3,4)) + ', ' + item.startdate.substr(0,4) +  '</div>' +
                                '</div>' +
                                '<div class="item-subtitle">Grade ' + item.grade +', Quarter '+ item.quarter + '</div>' +
                              '</div>' +
                            '</a>' +
                            '<div class="swipeout-actions-right">'+
                                '<a id="'+ item.id +'" href="#" class="swipeout-delete">Delete'+
                                '</a>'+
                            '</div>'+
                          '</li>';
                },
                height:70
            });
        }  
    })

    function getLessons(callback) {
        
        var items = new Array();
        lpdb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lessonplans ORDER BY date(startdate) DESC', [], function(tx, results) {
                var len = results.rows.length;
                for (var i=0; i<len; i++){
                    items.push({"id": results.rows.item(i).id ,"startdate": results.rows.item(i).startdate ,"enddate": results.rows.item(i).enddate, "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives , "indicators": results.rows.item(i).indicators , "resources": results.rows.item(i).resources , "notes": results.rows.item(i).notes })
                }
                callback(items);
            });
        });
    }


    //**** Formatting lesson list
    function toMonth(month){
        if (month=="01") {
            return "Jan"
        }
        else if (month=="02") {
            return "Feb"
        }
        else if (month=="03") {
            return "March"
        }
        else if (month=="04") {
            return "April"
        }
        else if (month=="05") {
            return "May"
        }
        else if (month=="06") {
            return "June"
        }
        else if (month=="07") {
            return "July"
        }
        else if (month=="08") {
            return "August"
        }
        else if (month=="09") {
            return "Sept"
        }
        else if (month=="10") {
            return "Oct"
        }
        else if (month=="11") {
            return "Nov"
        }
        else if (month=="12") {
            return "Dec"
        }
    }

    //remove leading 0, if exists, and return
    function toDay(date){
        if(date.substr(0,1) == "0"){
            return (date.substr(1))
        }
        else{
            return date
        }
    }

});