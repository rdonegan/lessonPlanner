myApp.onPageInit('lessonList', function (page) {

    var virtualList;
    // var lessonPlans;



    $$(document).on('click', '.noFilter', function(){

        virtualList.resetFilter();

    })

    $$(document).on('click', '.englishFilter', function(){
        //create array with indexes of id's of items with english subject
        //filter virtualList
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            // alert(lessonPlans[i].id)
            if(lessonPlans[i].subject == "english"){
                filterIndex.push(i);
            }
        }

        virtualList.filterItems(filterIndex)

    })

    $$(document).on('click', '.mathFilter', function(){
        //create array with indexes of id's of items with english subject
        //filter virtualList
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            // alert(lessonPlans[i].id)
            if(lessonPlans[i].subject == "math"){
                filterIndex.push(i);
            }
        }

        virtualList.filterItems(filterIndex)

    })

        $$(document).on('click', '.socialFilter', function(){
        //create array with indexes of id's of items with english subject
        //filter virtualList
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            // alert(lessonPlans[i].id)
            if(lessonPlans[i].subject == "socialStudies"){
                filterIndex.push(i);
            }
        }

        virtualList.filterItems(filterIndex)

    })

    $$(document).on('click', '.scienceFilter', function(){
        //create array with indexes of id's of items with english subject
        //filter virtualList
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            // alert(lessonPlans[i].id)
            if(lessonPlans[i].subject == "science"){
                filterIndex.push(i);
            }
        }

        virtualList.filterItems(filterIndex)

    })

    $$(document).on('click', '.palauanFilter', function(){
        //create array with indexes of id's of items with english subject
        //filter virtualList
        var lessonPlans=virtualList.items;
        var englishPlans=[]
        var l = lessonPlans.length;
        var filterIndex = new Array();
        
        for (var i=0; i<l; i++){
            // alert(lessonPlans[i].id)
            if(lessonPlans[i].subject == "palauan"){
                filterIndex.push(i);
            }
        }

        virtualList.filterItems(filterIndex)

    })

    $('.list-block').on("click", ".swipeout-delete", function(e){
        // alert(this.id)
        deleteFromLPDB(this.id)
    })  
    
    

    getLessons(function(items){

        
        if(items.length==0){
            $('.editLessons').html('<div class="content-block-title">No Lesson Plans Created :(</div>');
        }
        else{
            virtualList= myApp.virtualList('.editLessons', {
                items: items,
                renderItem: function(index,item){
                    return '<li class="swipeout">' +
                            '<a href="lessonForm.html?id='+ item.id+'" class="item-link item-content swipeout-content" data-context=\'{"standards":' + item.standards +', "objectives": ' + item.objectives +' }\'>' +
                              '<div class="item-inner">' +
                                '<div class="item-title-row">' +
                                  '<div class="item-title">Grade ' + item.grade + '</div>' +
                                  '<div class="item-after">'+toMonth((item.startdate.substr(5,5)).substr(0,2))+ ' ' + item.startdate.substr(0,4) + '</div>' +
                                '</div>' +
                                '<div class="item-subtitle">' + item.subject.charAt(0).toUpperCase() + item.subject.slice(1) +', Quarter '+ item.quarter + '</div>' +
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
                    // items.push(results.rows.item(i).subject);
                    var row = {"id": results.rows.item(i).id , "teachername": results.rows.item(i).teachername , "school": results.rows.item(i).school , "startdate": results.rows.item(i).startdate , "enddate": results.rows.item(i).enddate , "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "section": results.rows.item(i).section , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives , "indicators": results.rows.item(i).indicators , "resources": results.rows.item(i).resources , "notes": results.rows.item(i).notes }
                    items.push(row)
                }
                // lessonPlans=items;
                callback(items);
            });
        });
    }

});


