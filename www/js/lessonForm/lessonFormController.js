
myApp.onPageInit('lessonForm', function(page){

    var state = {isNew: false};

    // if (Template7.data){
    //     alert(JSON.stringify(Template7.data))
    // }
    

    if (page.query && page.query.id){
        // you're referencing a pre-made record. edit.
        state.isNew = false;
    }
    else{
        state.isNew = true;
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



