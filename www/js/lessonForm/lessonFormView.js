//****
//Update the dynamic smart select fields each time a relevant change occurs
//****
function updateStandardField(subject, grade, quarter){
    $("#standards").empty()
    $("#objectives").empty()
    $("#subObjectives").empty()
    $("#resources").empty()
    $("#indicators").empty() 
    var dup = ["", " "] // To check if duplicate strands have been added

    formdb.transaction(function(tx) {
            tx.executeSql("SELECT STANDARD FROM CURRICULUM WHERE GRADE = '" + grade + "' AND SUBJECT= '" + subject.toLowerCase() +"' AND QUARTER = '"+ quarter + "'", [], function(tx, res) {
                var len = res.rows.length, i;   
                  
               for (i = 0; i < len; i++){
                    if($.inArray(res.rows.item(i).standard, dup)==-1 && res.rows.item(i).standard != ""){
                        myApp.smartSelectAddOption('#standards', '<option value="'+res.rows.item(i).standard+'">'+res.rows.item(i).standard+'</option>');
                        dup.push(res.rows.item(i).standard)
                    }          
               }
               toggleVisibility()
            })
        })       
};


function updateObjectiveField(subject, grade, standards){
    $("#objectives").empty()
    $("#subObjectives").empty()
    $("#indicators").empty()
    var dup = ["", " "]
    formdb.transaction(function(tx) {

        tx.executeSql("SELECT OBJECTIVE FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"' AND STANDARDID IN (" + standards +")", [], function(tx, res) {
            var len = res.rows.length, i;
           for (i = 0; i < len; i++){
                if($.inArray(res.rows.item(i).objective, dup)==-1){
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
            for (i = 0; i < len; i++){
                if($.inArray(res.rows.item(i).subobjective, dup)==-1){
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
            for (i = 0; i < len; i++){
                if($.inArray(res.rows.item(i).indicator, dup)==-1){
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
                    myApp.smartSelectAddOption('#resources', '<option value="'+res.rows.item(i).resources+'">'+res.rows.item(i).resources+'</option>');
                    dup.push(res.rows.item(i).objective)
                }           
           }
           toggleVisibility()
           
        })
    })

}

//Iterate through all conditional fields and toggle disabled depending on if its populated
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


//****
//For pre-populating the form with data
//
function upDateStartAndEndDates(){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $('.startDateIn').val(today);
    $('.endDateIn').val(today);
}
// uses JSON data to pre-populate form from record
function populateForm(data){
//data.{field} ,for everything except arrays
//JSON.parse(data.{field}[i] ,for arrays

    var formData = {
        'school':data.school,
        'teachername': data.teachername,
        'subject' : data.subject,
        'grade' : data.grade,
        'quarter' : data.quarter,
        'section' : data.section
    }

    myApp.formFromJSON('#lessonForm', formData);

    // if (data.subject){
    //     $(".subjIn").val(data.subject)
    // }
    // if (data.grade){
    //     $('.gradeIn').val(data.grade)
    // }
    // if (data.quarter){
    //     $('.quarterIn').val(data.quarter)
    // }
    // if (data.section){
    //     $('.sectionIn').val(data.section)
    // }
    // if (data.school){
    //     $('.schoolIn').val(data.school)
    // }
    // if (data.teachername){
    //     $('.teacherIn').val(data.teachername)
    // }
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
            myApp.smartSelectAddOption('#standards', '<option value="'+standards[i]+'" selected>'+standards[i]+'</option>');
        }
    }
    if(data.objectives){
        addObjectives(data.subject, data.grade, JSON.parse(data.standards))
        objectives = JSON.parse(data.objectives)
        var len = objectives.length;
        for (var i=0; i<len; i++){
            myApp.smartSelectAddOption('#objectives', '<option value="'+objectives[i]+'" selected>'+objectives[i]+'</option>');
        }
    }

    if(data.indicators){
        indicators = JSON.parse(data.indicators)
        var len = indicators.length;
        for (var i=0; i<len; i++){
            myApp.smartSelectAddOption('#indicators', '<option value="'+indicators[i]+'" selected>'+indicators[i]+'</option>');
        }
    }

    if(data.resources){
        resources = JSON.parse(data.resources)
        var len = resources.length;
        for (var i=0; i<len; i++){
            myApp.smartSelectAddOption('#resources', '<option value="'+resources[i]+'" selected>'+resources[i]+'</option>');
        }
    }

    if(data.subobjective){
        subobjectives = JSON.parse(data.subobjective)
        var len = subobjectives.length;
        for (var i=0; i<len; i++){
            myApp.smartSelectAddOption('#subObjectives', '<option value="'+subobjectives[i]+'" selected>'+subobjectives[i]+'</option>');
        }
    }

    if (data.notes){
        $('.notesIn').val(data.notes)
        // $('.notesIn').trigger('change')

    }
        if(true){
            $('textarea').trigger('change')
        }

    if(data.sequence){
        $('.sequenceIn').val(data.sequence)
        $('textarea').trigger('change')
    }
}

//used when updating from a prior record
function addObjectives(subject, grade, standards){

    //convert standards to usable form
    var allStds
    if(standards.length>1){
      allStds = "'"+standards.join("', '") +"'"
    
    }
    else{
        allStds = "'"+standards.join()+"'"
    }
    var dup = ["", " "]
    formdb.transaction(function(tx) {

        tx.executeSql("SELECT OBJECTIVE FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() + "'AND STANDARD IN (" + allStds +")", [], function(tx, res) {
            var len = res.rows.length, i;
               for (i = 0; i < len; i++){
            
                if($.inArray(res.rows.item(i).objective, dup)==-1){
                    myApp.smartSelectAddOption('#objectives', '<option value="'+res.rows.item(i).objective+'">'+res.rows.item(i).objective+'</option>');
                    dup.push(res.rows.item(i).objective)
                }           
           }
           toggleVisibility()
           
        })
    })
}