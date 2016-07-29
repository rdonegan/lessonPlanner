myApp.onPageInit('lessonForm', function(page){
    var state = {isNew: false}; //if creating, isNew=true; if editing, isNew= false
    var lessonData; //for storing data while editing
    var schools = ('Aimeliik Airai Angaur GB Harris Ibobang PJF Koror Melekeok Meyuns Ngaraard Ngarchelong Ngardmau Ngeremlengui Peleliu Pulo Anna Sonsorol').split(' ');

    //If editing, pre-fills sections of the form. If creating new record, no pre-fill
    if (page.query && page.query.id){
        state.isNew = false;
        $(".formTitle").html("Edit Lesson")
        $(".navbar").addClass("theme-pink")
        lessonData = getRecord(page.query.id, function(record){
            populateForm(record)
            return record;
        })
    }
    else{
        state.isNew = true;
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter());
        updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
        upDateStartAndEndDates()
    }

    //School autocomplete dropdown
    var autocompleteDropdownSimple = myApp.autocomplete({
    input: '#autocomplete-dropdown',
    openIn: 'dropdown',
    source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < schools.length; i++) {
                if (schools[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(schools[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    //queries the database to get the data for the record being edited
    function getRecord(id, callback){
        var record;
        lpdb.transaction(function(tx){
            tx.executeSql('SELECT * FROM lessonplans WHERE ID= "' + id + '"', [], function(tx, results){
                if (results){
                    record = results.rows.item(0)
                }
                callback(record)
            })
        })
    };
    
    //****
    //Listeners to update fields on change
    //****
    $(".subjIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
        updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
    })

    $(".quarterIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
        updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
    })

    $(".gradeIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
        updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
    })

    //Update resources if standard changes
    $("#standards").on('change', function(){
        getSelectedStandardsIDs(getSelectedStandards(), getSelectedSubject(), getSelectedGrade(), getSelectedQuarter(), function(standardIDs){
            updateResourcesField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter() ,standardIDs)
            // updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
        })
    })

    //update subobjectives and indicators of objectives change (not dependent on specific standard)
    $("#objectives").on('change', function(){
        getStandardsAndObjectivesIDs(getSelectedStandards(), getSelectedObjectives(), function(ids){
            updateIndicatorsField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter(), ids)
            updateSubObjectivesField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter(), ids)
        })
    })

    //Used when objectives changes to update subobjectives and indicators
    //return array where items in array[0] are standards, and array[1] are objectives
    function getStandardsAndObjectivesIDs(standards, objectives, callback){
        if (standards.length > 0 && objectives.length > 0){
            var IDs= [[],[]];
            var allStds
            if(standards.length>1){
              allStds = "'"+standards.join("', '") +"'"
            
            }
            else{
                allStds = "'"+standards.join()+"'"
            }

            var allObjectives
            if(objectives.length>1){
              allObjectives = "'"+objectives.join("', '") +"'"
            
            }
            else{
                allObjectives = "'"+objectives.join()+"'"
            }
            formdb.transaction(function(tx){
                tx.executeSql("SELECT STANDARDID, GRADEOBJID FROM CURRICULUM WHERE OBJECTIVE IN (" + allObjectives + ")", [], function(tx,res){
                    var len = res.rows.length, i;
                    for (i = 0; i < len; i++){
                            IDs[0].push(res.rows.item(i).standardID)
                            IDs[1].push(res.rows.item(i).gradeObjID)
                       }
                       callback(IDs)
                })
            })
        }
        else{
            callback("none")
        }
        
    }

    //Used to update objectives when standards change
    //identifies checked standards and returns array of coresponding id's in database
    function getSelectedStandardsIDs(standards, subject, grade, quarter, callback){
         //if there aren't any standards, return an empty array
         if(standards.length > 0){
            var standardIDs= [];
            var allStds
            if(standards.length>1){
              allStds = "'"+standards.join("', '") +"'"
            
            }
            else{
                allStds = "'"+standards.join()+"'"
            }
            formdb.transaction(function(tx) {
                    tx.executeSql("SELECT STANDARDID FROM CURRICULUM WHERE SUBJECT = '"+ subject.toLowerCase() +"' AND GRADE = '" + grade + "' AND QUARTER = '" + quarter + "' AND STANDARD IN (" + allStds +")", [], function(tx, res) {
                       var len = res.rows.length, i;   //ENGLISH will need to be changed to reflect the name of the table
                         
                       for (i = 0; i < len; i++){
                            standardIDs.push(res.rows.item(i).standardID)  
                       }
                       callback(standardIDs)
                    })
            })

         }
         else{
            callback("none");
         }
            

        
        
        
    }

    //Save data when 'save' clicked
    $$('.get-storage-data').on('click', function(){
        $(".navbar").removeClass("theme-pink")
        var storedData = myApp.formGetData('lessonForm')
        if(state.isNew && storedData) {
            insertLPDB(storedData);   
        }
        else if (!state.isNew && storedData){
            updateLPDB(page.query.id, storedData)
        }
        else if (state.isNew) {
            myApp.alert("Did you mean to save? Try to add or change something before saving.", 'Lesson Planner')
        }
        else{
            mainView.router.back()
        }  
    })


    //****
    //Helper methods to get values from the form
    //***
    function getSelectedSubject(){
        return $(".subjIn").val();
    };

    function getSelectedGrade(){
        return $(".gradeIn").val();
    };

    function getSelectedQuarter(){
        return $(".quarterIn").val();
    }

    function getSelectedStandards(){
        //return all selected standards, as array
        selectedStandards=[]

        $("#standards option:selected").each(function()
        {
            selectedStandards.push($(this).val())
        })
            return selectedStandards;      
    };

    function getSelectedObjectives(){
        selectedObjectives=[]

        $("#objectives option:selected").each(function(){
            selectedObjectives.push($(this).val())
        })   
        return selectedObjectives;
    }

    //****    VIEW FUNCTIONS  **** //

    //****
    //Update the dynamic smart select fields each time a relevant change occurs
    //****
    function updateStandardField(subject, grade, quarter){
        $("#standards").empty()
        // $("#objectives").empty()
        // $("#subObjectives").empty()
        $("#resources").empty()
        // $("#indicators").empty() 
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

    function updateObjectiveField(subject, grade, quarter){
        $("#objectives").empty()
        $("#subObjectives").empty()
        $("#indicators").empty()
        var dup = ["", " "]
        formdb.transaction(function(tx) {

            tx.executeSql("SELECT OBJECTIVE FROM CURRICULUM WHERE GRADE = '" + grade + "' AND QUARTER = '"+ quarter +"' AND SUBJECT= '" + subject.toLowerCase() +"'", [], function(tx, res) {
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

    function updateSubObjectivesField(subject, grade, quarter, ids){
        $("#subObjectives").empty()
        if (ids != "none"){
            var dup = ["", " "]
            formdb.transaction(function(tx){
                tx.executeSql("SELECT SUBOBJECTIVE FROM CURRICULUM WHERE GRADE = " + grade + " AND QUARTER = '"+quarter+"' AND SUBJECT = '" + subject.toLowerCase() + "' AND STANDARDID IN (" + ids[0] + ") AND GRADEOBJID IN (" + ids[1] + ")", [], function(tx,res){
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
        else{
            toggleVisibility();
        }
        
    }

    function updateIndicatorsField(subject, grade, quarter, ids){
        $("#indicators").empty()
        if (ids != "none"){
            var dup = ["", " "]
            formdb.transaction(function(tx){
                tx.executeSql("SELECT INDICATOR FROM CURRICULUM WHERE GRADE = " + grade + " AND QUARTER = '"+ quarter +"' AND SUBJECT = '" + subject.toLowerCase() + "' AND STANDARDID IN (" + ids[0] + ") and GRADEOBJID IN (" + ids[1] + ")", [], function(tx,res){
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
        else{
            toggleVisibility()
        }
        
    }

    function updateResourcesField(subject, grade, quarter, standards){
        $("#resources").empty()
        if (standards != "none"){
            var dup = ["", " "]
            formdb.transaction(function(tx) {
                tx.executeSql("SELECT RESOURCES FROM CURRICULUM WHERE GRADE = " + grade + " AND QUARTER = "+ quarter +" AND SUBJECT= '" + subject.toLowerCase() +"' AND STANDARDID IN (" + standards +")", [], function(tx, res) {
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
        else{
            toggleVisibility()
        }
        
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
            'section' : data.section,
            'sequence' : data.sequence,
            'notes' : data.notes
        }

        myApp.formFromJSON('#lessonForm', formData);

       
        if (data.startdate){
            $('.startDateIn').val(data.startdate)
        }
        else{
            upDateStartAndEndDates()
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
            addObjectives(data.subject, data.grade, getSelectedQuarter())
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
    }

    //used when updating from a prior record
    function addObjectives(subject, grade, quarter){
        //convert standards to usable form
        
        var dup = ["", " "]
        formdb.transaction(function(tx) {

            tx.executeSql("SELECT OBJECTIVE FROM CURRICULUM WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() + "' AND QUARTER= '" + quarter+ "'", [], function(tx, res) {
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

    //**** Hacky way for scrolling page so keyboard doesn't cover text areas
    $(".sequenceIn").focus(function(e) {
        //Places cursor at end of text, if any. This is a bug fix
        var tempStr = $(".sequenceIn").val()
        $(".sequenceIn").val('')
        $(".sequenceIn").val(tempStr)
        //scroll to top of text area
        var deviceHeight = window.screen.height;
        var divHTML = "<div style='height:" + deviceHeight + "px;'></div>"
        $(".extraSpace").append(divHTML)
        $(".page-content").scrollTo(document.getElementById("sequenceGO"), {offset: -60});  

    });

    $(".notesIn").focus(function(e) {
        //Places cursor at end of text, if any. This is a bug fix
        var tempStr = $(".notesIn").val()
        $(".notesIn").val('')
        $(".notesIn").val(tempStr)
        //scroll to top of text area
        var deviceHeight = window.screen.height;
        var divHTML = "<div class='emptyDiv' style='height:" + deviceHeight + "px;'></div>"
        var element = document.getElementById("notesGO")
        
        $(".extraSpace").append(divHTML)
        $(".page-content").scrollTo(document.getElementById("notesGO"), {offset: -60});

    });

    //remove empty div when focusout on text areas
    $(".notesIn").focusout(function(){
        $(".extraSpace").empty()
    })
    $(".sequenceIn").focusout(function(){
        $(".extraSpace").empty()
    })

});


