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
        
        alert(items[0].standards)
        //I think I figure this out if I need to go back to it. In order to pass the "query" which is the ID
        //of the row being referenced, put it in the href at the end (see framework7 for formatting). then, use
        //operation page.details.query or whatever it is to retrieve this later

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
        template: '<li>' +
                    '<a href="lessonForm.html?id={{id}}" class="item-link item-content" data-context= \'{"school": "{{school}}" }\'";>' +
                      '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                          '<div class="item-title">{{id}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{subject}}</div>' +
                      '</div>' +
                    '</a>' +
                  '</li>'
        // Item height
       

        });
    })

});