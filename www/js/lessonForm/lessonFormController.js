
myApp.onPageInit('lessonForm', function(page){

    var state = {isNew: false};
    var lessonData; //for storing data while editing

    // if (Template7.data){
    //     alert(JSON.stringify(Template7.data))
    // }

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

        // USE THIS TO GRAB THE INFORMATION FOR THAT RECORD AND POPULATE THE FORM AS NEEDED****
        // you're referencing a pre-made record. edit.
        state.isNew = false;
        lessonData = getRecord(page.query.id, function(record){
            alert(JSON.parse(record.standards)[0])
            //probs have to set everything up in here too
            return record;


        })




        // alert("query id: " + page.query.id)
    }
    else{
        state.isNew = true;
        updateStandardField(getSelectedSubject(), getSelectedGrade())
        // var searchTemplate = $$('#sample').html();
        // var compiledSearchTemplate = Template7.compile(searchTemplate);
        // $('#example').html(compiledSearchTemplate);
    }

    // alert(page.query)
    

    // //Update standards when grade or subject changes
    $(".subjIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade())
    })

    $(".gradeIn").on('change', function(){
        updateStandardField(getSelectedSubject(), getSelectedGrade())
    })

    //Update objectives if standard changes
    $("#standards").on('change', function(){
        updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedStandards())
    })

    // save data when SUBMIT clicked
    // WILL NEED TO ADD VALIDATION
    $$('.get-storage-data').on('click', function(){
        var storedData = myApp.formGetData('lessonForm')
        // alert(JSON.stringify(storedData));
        if(storedData) {
            // alert(JSON.stringify(storedData));
            insertLPDB(storedData);   
          }
          else {
            alert('There is no stored data for this form yet. Try to change any field')
          }
    })

});



function getSelectedSubject(){
    return $(".subjIn").val();
};

function getSelectedGrade(){
    return $(".gradeIn").val();
};

function getSelectedStandards(){
    //return all selected standards, as array
    selectedStandards=[]

    $("#standards option:selected").each(function()
    {
       
        selectedStandards.push($(this).val())
    })
        
        return selectedStandards;      
};



