//Everytime subject or grade fields are updated, reload contents of Standards select options
function updateStandardField(subject, grade){

    $("#standards").empty()
    $(".standardSelect").removeClass("disabled");
    $("#objectives").empty()

    var dup = [] // To check if duplicate strands have been added

    formdb.transaction(function(tx) {
            tx.executeSql("SELECT STANDARD FROM ENGLISH WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"'", [], function(tx, res) {
                var len = res.rows.length, i;   //ENGLISH will need to be changed to reflect the name of the table
                  
               for (i = 0; i < len; i++){
                
                    if($.inArray(res.rows.item(i).standard, dup)==-1){
                        $("#standards").append("<option>"+res.rows.item(i).standard + "</option>")
                        dup.push(res.rows.item(i).standard)
                    }           
               }
               
            })
        })
          
};


// Update objective field
function updateObjectiveField(subject, grade, standards){

    $("#objectives").empty()


    //convert standards to usable form
    var allStds
    if(standards.length>1){
      allStds = "'"+standards.join("', '") +"'"
    
    }
    else{
        allStds = "'"+standards.join()+"'"
    }

     var dup = []
    formdb.transaction(function(tx) {
        tx.executeSql("SELECT OBJECTIVE FROM ENGLISH WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"' AND STANDARD IN (" + allStds +")", [], function(tx, res) {
            var len = res.rows.length, i;
            
           for (i = 0; i < len; i++){
            
                if($.inArray(res.rows.item(i).objective, dup)==-1){
                    $("#objectives").append("<option>"+res.rows.item(i).objective + "</option>")
                    dup.push(res.rows.item(i).objective)
                }           
           }
           
        })
    })

   toggleObjectiveVisibility();
};


function toggleObjectiveVisibility(){
    if(getSelectedStandards().length==0){
        $(".objectiveSelect").addClass("disabled");
    }
    else{
            $(".objectiveSelect").removeClass("disabled");
    }
}