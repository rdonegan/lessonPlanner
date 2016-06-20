myApp.onPageInit('lessonForm', function(page){
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