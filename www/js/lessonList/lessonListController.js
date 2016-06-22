myApp.onPageInit('lessonList', function (page) {
    
    function getLessons(callback) {
        
        var items = new Array();
        lpdb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lessonplans', [], function(tx, results) {
                
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

    getLessons(function(items){


        // SO THIS IS STILL SHOWING WEIRD BEHAVIOR. MY FIRST PIECE OF ADVICE IS TO ***NOT PANIC***.
        // NOW, IF AN IDEA STRIKES YOU DURIN GHT NIGHT, YOU COULD TRY ANOTHER APPROACH TO THIS TO 
        // DIAGNOSE THE WEIRD JUMPINESS PROBLEM. OR, IF THAT SEEMS FRUSTRATING, SWITCH TO A TOTALLY NEW APPROACH.
        // IM TALKIN ABOUT JUST STRAIGHT UP GETTING DATA FROM THE DATABASE, DISPLAYING IT AS A LIST,
        // THEN MANUALLY USING JAVASCRIPT TO FETCH INFO FROM EACH AND SEND IT TO THE FORM WHERE IT WILL
        // ME MANUALLY PLACED IN VIA JAVASCRIPT. NOT A PRETTY SOLUTION, BUT IF IT WORKS, IT WORKS. YOU
        // COULD COMBINE THAT APPROACH WITH THE OTHER APPROACH (SEND THE QUERY ID), AND THEN JUST WRITE
        // A SHIT TON OF JAVASCRIPT TO DEAL WITH THIS CONDITION. THAT ACTUALLY MIGHT BE EASIER - MANUALLY INPUTTING
        // VALUES INTO CLASSES THAN RELYING ON TEMPLAT7. FUCK TEMPLATE7

        
        // alert(items[0].standards)
        
        var virtualList= myApp.virtualList('.list-block', {
            items: items,
            // renderItem: function(index,item){
            //     return '<li>' +
            //             '<a href="lessonForm.html" class="item-link item-content">' +
            //               '<div class="item-inner">' +
            //                 '<div class="item-title-row">' +
            //                   '<div class="item-title">' + item.id + '</div>' +
            //                 '</div>' +
            //                 '<div class="item-subtitle">' + item.subject + '</div>' +
            //               '</div>' +
            //             '</a>' +
            //           '</li>';
            // }
        template: '<li class="item-content">' +
                    '<a href="#" class="item-link">' +
                          '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                              '<div class="item-title">{{id}}</div>' +
                            '</div>' +
                            '<div class="item-subtitle">{{standards}}</div>' +
                          '</div>' +
                    '</a>' +
                  '</li>'
        // Item height
       

        });
    })

});