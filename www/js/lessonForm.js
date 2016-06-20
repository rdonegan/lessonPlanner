
//Everytime subject or grade fields are updated, reload contents of Standards select options
function updateStandardField(subject, grade){

    $("#standards").empty(),

    var dup = [] // To check if duplicate strands have been added

    formdb.transaction(function(tx) {
            tx.executeSql("SELECT STANDARD FROM ENGLISH WHERE GRADE = " + grade + " AND SUBJECT= '" + subject.toLowerCase() +"'", [], function(tx, res) {
                var len = res.rows.length, i;   //ENGLISH will need to be changed to reflect the name of the table
                  
               for (i = 0; i < len; i++){
                
                    if($.inArray(res.rows.item(i).standard, dup)==-1){
                        $("#standards").append("<option>"+res.rows.item(i).standard + "</option>")
                        dup.push(res.rows.item(i).standard)
                    }           
               }
               
            })
        })

    $(".standardSelect").removeClass("disabled");
        //clear objectives and deactivate
    $("#objectives").empty()
          
};


//Reload contents of objectives
function updateObjectiveField(subject, grade, standards){

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
                
               for (i = 0; i < len; i++){
                
                    if($.inArray(res.rows.item(i).objective, dup)==-1){
                        $("#objectives").append("<option>"+res.rows.item(i).objective + "</option>")
                        dup.push(res.rows.item(i).objective)
                    }           
               }
               
            })
        })

};



myApp.onPageInit('lessonForm', function(page){
    // //Update standards when grade or subject changes
    $(".subjIn").on('change', function(){
        //CLEAR STANDARDS FIRST
        // $("#standards").empty(),
        //update standards
        updateStandardField(getSelectedSubject(), getSelectedGrade()),
        // $(".standardSelect").removeClass("disabled");
        //clear objectives and deactivate
        // $("#objectives").empty()

    })

    $(".gradeIn").on('change', function(){
        //CLEAR STANDARDS FIRST
        // $("#standards").empty(),
        //update standards
        updateStandardField(getSelectedSubject(), getSelectedGrade()),
        // $(".standardSelect").removeClass("disabled");
        // //clear objectives and deactivate
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


});





