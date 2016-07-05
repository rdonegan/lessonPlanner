//Everytime subject or grade fields are updated, reload contents of Standards select options
function updateStandardField(subject, grade, quarter){

    $("#standards").empty()
    $("#objectives").empty()
    $("#subObjectives").empty()
    $("#resources").empty()
    $("#indicators").empty()

    var dup = [] // To check if duplicate strands have been added

    formdb.transaction(function(tx) {
            tx.executeSql("SELECT STANDARD FROM CURRICULUM WHERE GRADE = '" + grade + "' AND SUBJECT= '" + subject.toLowerCase() +"' AND QUARTER = '"+ quarter + "'", [], function(tx, res) {
                var len = res.rows.length, i;   //ENGLISH will need to be changed to reflect the name of the table
                  
               for (i = 0; i < len; i++){
                
                    if($.inArray(res.rows.item(i).standard, dup)==-1 && res.rows.item(i).standard != ""){
                        // $("#standards").append("<option>"+res.rows.item(i).standard + "</option>")
                        myApp.smartSelectAddOption('#standards', '<option value="'+res.rows.item(i).standard+'">'+res.rows.item(i).standard+'</option>');
                        dup.push(res.rows.item(i).standard)
                        
                        // alert(JSON.stringify(res.rows.item(i).standardID))
                    } 
                          
               }
               toggleVisibility()
            })
        })
          
};

// Update objective field
function updateObjectiveField(subject, grade, standards){

    $("#objectives").empty()
    $("#subObjectives").empty()
    $("#indicators").empty()

    var dup = ["", " "]
    formdb.transaction(function(tx) {

        tx.executeSql("SELECT OBJECTIVE FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"' AND STANDARDID IN (" + standards +")", [], function(tx, res) {
            var len = res.rows.length, i;
            // alert(len)
           for (i = 0; i < len; i++){
            
                if($.inArray(res.rows.item(i).objective, dup)==-1){
                    // $("#objectives").append("<option>"+res.rows.item(i).objective + "</option>")
                    myApp.smartSelectAddOption('#objectives', '<option value="'+res.rows.item(i).objective+'">'+res.rows.item(i).objective+'</option>');
                    dup.push(res.rows.item(i).objective)
                }           
           }
           toggleVisibility()
           
        })
    })

   
};


function updateSubObjectivesField(subject, grade, ids){
    $("#subObjectives").empty()
    var dup = ["", " "]
    formdb.transaction(function(tx){
        tx.executeSql("SELECT SUBOBJECTIVE FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT = '" + subject.toLowerCase() + "' AND STANDARDID IN (" + ids[0] + ") AND GRADEOBJID IN (" + ids[1] + ")", [], function(tx,res){
            var len=res.rows.length, i;
            // alert("got subobj length here: " + len)
            for (i = 0; i < len; i++){
                if($.inArray(res.rows.item(i).subobjective, dup)==-1){
                    // $("#subObjectives").append("<option>"+res.rows.item(i).subobjective + "</option>")
                    myApp.smartSelectAddOption('#subObjectives', '<option value="'+res.rows.item(i).subobjective+'">'+res.rows.item(i).subobjective+'</option>');
                    dup.push(res.rows.item(i).subobjective)
                }           
           }
           toggleVisibility()
        })
    })
}


function updateIndicatorsField(subject, grade, ids){
    $("#indicators").empty()
    var dup = ["", " "]
    formdb.transaction(function(tx){
        tx.executeSql("SELECT INDICATOR FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT = '" + subject.toLowerCase() + "' AND STANDARDID IN (" + ids[0] + ") and GRADEOBJID IN (" + ids[1] + ")", [], function(tx,res){
            var len=res.rows.length, i;
            // alert("got indicators length here: " + len)
            for (i = 0; i < len; i++){
                if($.inArray(res.rows.item(i).indicator, dup)==-1){
                    // $("#indicators").append("<option>"+res.rows.item(i).indicator + "</option>")
                    myApp.smartSelectAddOption('#indicators', '<option value="'+res.rows.item(i).indicator+'">'+res.rows.item(i).indicator+'</option>');
                    dup.push(res.rows.item(i).indicator)
                }           
           }
           toggleVisibility()
        })
    })

}


function updateResourcesField(subject, grade, standards){
    $("#resources").empty()

    var dup = ["", " "]
    formdb.transaction(function(tx) {

        tx.executeSql("SELECT RESOURCES FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"' AND STANDARDID IN (" + standards +")", [], function(tx, res) {
            var len = res.rows.length, i;
           for (i = 0; i < len; i++){
            
                if($.inArray(res.rows.item(i).resources, dup)==-1){
                    // $("#resources").append("<option>"+res.rows.item(i).resources + "</option>")
                    myApp.smartSelectAddOption('#resources', '<option value="'+res.rows.item(i).resources+'">'+res.rows.item(i).resources+'</option>');
                    dup.push(res.rows.item(i).objective)
                }           
           }
           toggleVisibility()
           
        })
    })

}

//Iterate through all conditional fields and toggle disabled
//depending on if its populated
function toggleVisibility(){
    if($(".standardSelect").has('option').length ==0){
        $(".standardSelect").addClass("disabled");
    }
    else{
        $(".standardSelect").removeClass("disabled");
    }
    if($(".objectiveSelect").has('option').length ==0){
        $(".objectiveSelect").addClass("disabled");
    }
    else{
        $(".objectiveSelect").removeClass("disabled");
    }
    if($(".subObjectiveSelect").has('option').length ==0){
        $(".subObjectiveSelect").addClass("disabled");
    }
    else{
        $(".subObjectiveSelect").removeClass("disabled");
    }
    if($(".resourcesSelect").has('option').length ==0){
        $(".resourcesSelect").addClass("disabled");
    }
    else{
        $(".resourcesSelect").removeClass("disabled");
    }
    if($(".indicatorsSelect").has('option').length ==0){
        $(".indicatorsSelect").addClass("disabled");
    }
    else{
        $(".indicatorsSelect").removeClass("disabled");
    }
};



function upDateStartAndEndDates(){
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

    $('.startDateIn').val(today);
    $('.endDateIn').val(today);

}
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
        var now = new Date();

        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

        $('.startDateIn').val(today);
    }
    if (data.enddate){
        $('.endDateIn').val(data.enddate)
    }
    else{
        var now = new Date();

        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        $('.endDateIn').val(today)
    }
    if(data.standards){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
        standards = JSON.parse(data.standards)
        var len = standards.length;
        for (var i=0; i<len; i++){
            // $("#standards").prepend("<option selected>"+standards[i] + "</option>")
            myApp.smartSelectAddOption('#standards', '<option value="'+standards[i]+'" selected>'+standards[i]+'</option>');
        }
    }
    if(data.objectives){
        
        objectives = JSON.parse(data.objectives)
        var len = objectives.length;
        for (var i=0; i<len; i++){
            // $("#objectives").prepend("<option selected>"+objectives[i] + "</option>")
            myApp.smartSelectAddOption('#objectives', '<option value="'+objectives[i]+'" selected>'+objectives[i]+'</option>');
        }
    }

    if(data.indicators){
        indicators = JSON.parse(data.indicators)
        var len = indicators.length;
        for (var i=0; i<len; i++){
            // $("#indicators").prepend("<option selected>"+indicators[i] + "</option>")
            myApp.smartSelectAddOption('#indicators', '<option value="'+indicators[i]+'" selected>'+indicators[i]+'</option>');
        }
    }

    if(data.resources){
        resources = JSON.parse(data.resources)
        var len = resources.length;
        for (var i=0; i<len; i++){
            // $("#resources").prepend("<option selected>"+resources[i] + "</option>")
            myApp.smartSelectAddOption('#resources', '<option value="'+resources[i]+'" selected>'+resources[i]+'</option>');
        }
    }

    if(data.subobjective){
        subobjectives = JSON.parse(data.subobjective)
        var len = subobjectives.length;
        for (var i=0; i<len; i++){
            // $("#subObjectives").prepend("<option selected>"+subobjectives[i] + "</option>")
            myApp.smartSelectAddOption('#subObjectives', '<option value="'+subobjectives[i]+'" selected>'+subobjectives[i]+'</option>');
        }
    }

    if (data.notes){
        $('.notesIn').val(data.notes)
    }
    // alert(data.subject)

}