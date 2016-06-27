var selectedStandardIds = [];

//Everytime subject or grade fields are updated, reload contents of Standards select options
function updateStandardField(subject, grade, quarter){

    selectedStandardIds = [];
    $("#standards").empty()
    // $(".standardSelect").removeClass("disabled");
    $("#objectives").empty()

    var dup = [] // To check if duplicate strands have been added

    formdb.transaction(function(tx) {
            tx.executeSql("SELECT STANDARD FROM ENGLISH WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"' AND QUARTER = '"+ quarter + "'", [], function(tx, res) {
                var len = res.rows.length, i;   //ENGLISH will need to be changed to reflect the name of the table
                  
               for (i = 0; i < len; i++){
                
                    if($.inArray(res.rows.item(i).standard, dup)==-1 && res.rows.item(i).standard != ""){
                        $("#standards").append("<option>"+res.rows.item(i).standard + "</option>")
                        dup.push(res.rows.item(i).standard)
                        alert(res.rows.item(i).standard)
                    } 
                    // alert(selectedStandardIds);          
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
            // alert(len)
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
};

// uses JSON data to populate form from record
function populateForm(data){
//data.{field} ,for everything except arrays
//JSON.parse(data.{field}[i] ,for arrays

    // alert(data.subject);
    if (data.subject){
        $(".subjIn").val(data.subject)
    }
    if (data.grade){
        $('.gradeIn').val(data.grade)
    }
    if (data.quarter){
        $('.quarterIn').val(data.quarter)
    }
    if (data.section){
        $('.sectionIn').val(data.section)
    }
    if (data.school){
        $('.schoolIn').val(data.school)
    }
    if (data.teachername){
        $('.teacherIn').val(data.teachername)
    }
    if (data.startdate){
        $('.startDateIn').val(data.startdate)
    }
    else{
        var d = new Date();
        var date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        $('.startDateIn').val(date)
    }
    if (data.enddate){
        $('.endDateIn').val(data.enddate)
    }
    else{
        $('.endDateIn').val(data.startdate)
    }
    if(data.standards){
        standards = JSON.parse(data.standards)
        var len = standards.length;
        for (var i=0; i<len; i++){
            $("#standards").append("<option selected>"+standards[i] + "</option>")
        }
    }
    if(data.objectives){
        objectives = JSON.parse(data.objectives)
        var len = objectives.length;
        for (var i=0; i<len; i++){
            $("#objectives").append("<option selected>"+objectives[i] + "</option>")
        }
    }

    if(data.indicators){
        indicators = JSON.parse(data.indicators)
        var len = indicators.length;
        for (var i=0; i<len; i++){
            $("#indicators").append("<option selected>"+indicators[i] + "</option>")
        }
    }

    if(data.resources){
        resources = JSON.parse(data.resources)
        var len = resources.length;
        for (var i=0; i<len; i++){
            $("#resources").append("<option selected>"+resources[i] + "</option>")
        }
    }
    if (data.notes){
        $('.notesIn').val(data.notes)
    }
    // alert(data.subject)

}