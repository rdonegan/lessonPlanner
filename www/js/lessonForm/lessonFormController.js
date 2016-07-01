
myApp.onPageInit('lessonForm', function(page){

    var state = {isNew: false};
    var lessonData; //for storing data while editing
    var schools = ('Aimeliik Airai Angaur GB Harris Ibobang PJF Koror Melekeok Meyuns Ngaraard Ngarchelong Ngardmau Ngeremlengui Peleliu Pulo Anna Sonsorol').split(' ');



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

    function getRecord(id, callback){
        var record;
        lpdb.transaction(function(tx){
            tx.executeSql('SELECT * FROM lessonplans WHERE ID= "' + id + '"', [], function(tx, results){
                // alert('happened')
                if (results){
                    // alert(JSON.stringify(results.rows.item(0)))
                    // alert(JSON.parse(results.rows.item(0).standards)[0])
                    record = results.rows.item(0)
                    // alert(JSON.parse(record.standards)[0])
                }
                callback(record)

            })
        })
     
    };
    

    if (page.query && page.query.id){
        state.isNew = false;
        $(".formTitle").html("Edit Lesson")
        $(".navbar").addClass("theme-pink")
        lessonData = getRecord(page.query.id, function(record){
            // alert(JSON.parse(record.standards)[0])
            //probs have to set everything up in here too
            populateForm(record)
            return record;
        })

    }
    else{
        state.isNew = true;
        // $('.startDateIn').val('2020-04-04')
        updateStandardField(getSelectedSubject(), getSelectedGrade(), getSelectedQuarter());
        upDateStartAndEndDates()
      
    }
    

    // //Update standards on field changes
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
        // alert('objective changed')
        getStandardsAndObjectivesIDs(getSelectedStandards(), getSelectedObjectives(), function(ids){
            updateIndicatorsField(getSelectedSubject(), getSelectedGrade(), ids)
            updateSubObjectivesField(getSelectedSubject(), getSelectedGrade(), ids)
        })
    })


//return array where items in array[0] are standards, and array[1] are objectives
function getStandardsAndObjectivesIDs(standards, objectives, callback){
    // alert("in stands and objectives")
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
            // alert(JSON.stringify(res.rows.item(0).standardID))
            // alert('length of all results=: ' + len)
            for (i = 0; i < len; i++){
                    IDs[0].push(res.rows.item(i).standardID)
                    IDs[1].push(res.rows.item(i).gradeObjID)

               }
               // alert(IDs.toString())
               callback(IDs)
            
        })
    })
}

    //identifies checked standards and returns array of coresponding id in database
function getSelectedStandardsIDs(standards, callback){

    var standardIDs= [];
    // alert("1")
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
                // alert("ssdf: " + standardIDs)
               // return standardIDs
               callback(standardIDs)
               
            })
    })
}



    // save data when SUBMIT clicked
    // WILL NEED TO ADD VALIDATION
    $$('.get-storage-data').on('click', function(){
        var storedData = myApp.formGetData('lessonForm')
        // alert(JSON.stringify(storedData));
        if(state.isNew && storedData) {
            // alert(JSON.stringify(storedData));
            
            insertLPDB(storedData);   
        }
        else if (!state.isNew && storedData){
            updateLPDB(page.query.id, storedData)
        }
        else {
            alert('There is no stored data for this form yet. Try to change any field')
        }
          myApp.formDeleteData('lessonForm')
    })

});



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



