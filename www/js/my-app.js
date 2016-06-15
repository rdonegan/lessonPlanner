// Initialize your app
var myApp = new Framework7({
    material: true,
    swipePanel: 'left'
});

// Export selectors engine
var $$ = Dom7;

//Initialize Form database
var formdb;

//Initialize database for all saved lesson plans
var lpdb;



// Cordova is ready
  function onDeviceReady() {
    formdb = window.sqlitePlugin.openDatabase({name: "test.db", location: 'default', createFromLocation: 1});
   
  };



  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);



//Everytime subject or grade fields are updated, reload contents of Standards select options
function updateStandardField(subject, grade){

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
          
};


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


}

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
        // var v = $(this)
        // console.log(v.val())
        selectedStandards.push($(this).val())
    })
        
        return selectedStandards;

        
}
    


// Read CSV and return object array
function readCSV(subject){
    $.ajax({
    url: "data/" + subject + ".csv",
    async: false,
    success: function (csvd) {
        var curricSpecs = $.csv.toObjects(csvd);
        // console.log(curricSpecs);
        // console.log(items[0].eval)
        console.log(curricSpecs)
        return curricSpecs;
        //var jsonobject = JSON.stringify(items);
        //alert(jsonobject);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete 
        // console.log(items);
    }
})
}



// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();

    });
});

myApp.onPageInit('lessonForm', function(page){
    // //Update standards when grade or subject changes
    $(".subjIn").on('change', function(){
        //CLEAR STANDARDS FIRST
        $("#standards").empty(),
        //update standards
        updateStandardField(getSelectedSubject(), getSelectedGrade()),
        $(".standardSelect").removeClass("disabled");
        //clear objectives and deactivate
        $("#objectives").empty()

    })

    $(".gradeIn").on('change', function(){
        //CLEAR STANDARDS FIRST
        $("#standards").empty(),
        //update standards
        updateStandardField(getSelectedSubject(), getSelectedGrade()),
        $(".standardSelect").removeClass("disabled");
        //clear objectives and deactivate
        $("#objectives").empty()

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
        if(storedData) {
            alert(JSON.stringify(storedData));
          }
          else {
            alert('There is no stored data for this form yet. Try to change any field')
          }
    })


});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;



}

