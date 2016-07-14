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
 
    // //move cursor to end of text in textarea
    // $("textarea").focus(function(){
        

    // })
    $(".subjIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
    })

    $(".quarterIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
    })

    $(".gradeIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter())
    })

    //Update objectives if standard changes
    $("#standards").on('change', function(){
        getSelectedStandardsIDs(getSelectedStandards(), function(standardIDs){
            updateResourcesField(getSelectedSubject(), getSelectedGrade(), standardIDs)
            updateObjectiveField(getSelectedSubject(), getSelectedGrade(), standardIDs)
        })
    })

    //update subobjectives and indicators
    $("#objectives").on('change', function(){
        getStandardsAndObjectivesIDs(getSelectedStandards(), getSelectedObjectives(), function(ids){
            updateIndicatorsField(getSelectedSubject(), getSelectedGrade(), ids)
            updateSubObjectivesField(getSelectedSubject(), getSelectedGrade(), ids)
        })
    })

    //Used when objectives changes to update subobjectives and indicators
    //return array where items in array[0] are standards, and array[1] are objectives
    function getStandardsAndObjectivesIDs(standards, objectives, callback){
        var IDs= [[],[]];
        var allStds
        if(standards.length>1){
          allStds = "'"+standards.join("', '") +"'"
        
        }
        else{
            allStds = "'"+standards.join()+"'"
        }

        var allObjectives
        if(standards.length>1){
          allObjectives = "'"+objectives.join("', '") +"'"
        
        }
        else{
            allObjectives = "'"+objectives.join()+"'"
        }
        formdb.transaction(function(tx){
            tx.executeSql("SELECT STANDARDID, GRADEOBJID FROM CURRICULUM WHERE STANDARD IN (" + allStds + ") AND OBJECTIVE IN (" + allObjectives + ")", [], function(tx,res){
                var len = res.rows.length, i;
                for (i = 0; i < len; i++){
                        IDs[0].push(res.rows.item(i).standardID)
                        IDs[1].push(res.rows.item(i).gradeObjID)
                   }
                   callback(IDs)
            })
        })
    }

    //Used to update objectives when standards change
    //identifies checked standards and returns array of coresponding id's in database
    function getSelectedStandardsIDs(standards, callback){

        var standardIDs= [];
        var allStds
        if(standards.length>1){
          allStds = "'"+standards.join("', '") +"'"
        
        }
        else{
            allStds = "'"+standards.join()+"'"
        }

        formdb.transaction(function(tx) {
                tx.executeSql("SELECT STANDARDID FROM CURRICULUM WHERE STANDARD IN (" + allStds +")", [], function(tx, res) {
                   var len = res.rows.length, i;   //ENGLISH will need to be changed to reflect the name of the table
                     
                   for (i = 0; i < len; i++){
                        standardIDs.push(res.rows.item(i).standardID)  
                   }
                   callback(standardIDs)
                })
        })
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
            //go back
            mainView.router.back()
        }
          
    })

});


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

