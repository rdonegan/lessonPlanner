myApp.onPageInit('lessonList', function (page) {


    // TRY something COMPLETELY DIFFERENT WHERE YOU DYNAMICALLY CREATE A LIST USING YOUR OWN JAVASCRIPT ON THE HOME
    // PAGE AND THEN LINK TO THE LESSONFORM PAGE. 

    // THERE ARE ALSO OTHER DEFAULT WAYS OF DISPLAYING SMART SELECT (POPUP, ETC). MAYBE TRY ACCESSING THEM THIS WAY AND SEE IF THE EFFECT CHANGES

    // $(".list-block").on("click", ".planItem", function(){
    //     // alert("hello")
    //     mainView.router.load({
    //         url: 'lessonForm.html'
           
    //     });


    // });
      
    
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


       // FORGET TEMPLATE7, FILL THAT DATA IN ON YOUR OWN

        
        // alert(items[0].standards)
        
        var virtualList= myApp.virtualList('.list-block', {
            items: items,
            renderItem: function(index,item){
                return '<li>' +
                        '<a href="lessonForm.html?id='+ item.id+'" class="item-link item-content" data-context=\'{"standards":' + item.standards +', "objectives": ' + item.objectives +' }\'>' +
                          '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                              '<div class="item-title">' + item.id + '</div>' +
                            '</div>' +
                            '<div class="item-subtitle">' + item.subject + '</div>' +
                          '</div>' +
                        '</a>' +
                      '</li>';
            }
        // template: '<li class="item-content">' +
        //             '<a href="#" class="item-link planItem">' +
        //                   '<div class="item-inner">' +
        //                     '<div class="item-title-row">' +
        //                       '<div class="item-title">{{id}}</div>' +
        //                     '</div>' +
        //                     '<div class="item-subtitle">{{standards}}</div>' +
        //                   '</div>' +
        //             '</a>' +
        //           '</li>'
        // Item height
       

        });
    })

});