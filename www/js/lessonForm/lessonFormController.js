myApp.onPageInit('lessonForm', function(page){
    // //Update standards when grade or subject changes
    $(".subjIn").on('change', function(){
        //CLEAR STANDARDS FIRST
        // $("#standards").empty(),
        //update standards
        updateStandardField(getSelectedSubject(), getSelectedGrade())
        // $(".standardSelect").removeClass("disabled");
        // //clear objectives and deactivate
        // $("#objectives").empty()

    })

    $(".gradeIn").on('change', function(){
        //CLEAR STANDARDS FIRST
        // $("#standards").empty(),
        //update standards
        updateStandardField(getSelectedSubject(), getSelectedGrade())
        // $(".standardSelect").removeClass("disabled");
        //clear objectives and deactivate
        // $("#objectives").empty()

    })

    //Update objectives if standard changes
    $("#standards").on('change', function(){
        //CLEAR objectives FIRST
        $("#objectives").empty()
        //update standards
        updateObjectiveField(getSelectedSubject(), getSelectedGrade(), getSelectedStandards())
        if(getSelectedStandards().length==0){
            $(".objectiveSelect").addClass("disabled");
        }
        else{
            $(".objectiveSelect").removeClass("disabled");
        }

    })

    // save data when SUBMIT clicked
    $$('.get-storage-data').on('click', function(){
        var storedData = myApp.formGetData('lessonForm')
        
        // alert(JSON.stringify(storedData));

        if(storedData) {
            // alert(JSON.stringify(storedData));
            // openLPdb();
            insertLPDB(storedData);

            

          }
          else {
            alert('There is no stored data for this form yet. Try to change any field')
          }
    })


});