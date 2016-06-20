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



// $$(document).on('pageInit', function(e){
//     var page = e.detail.page //.name to get name of page
//     if (page.name == "lessonForm"){
//         alert('lessonform page id:' + page.query.id)
//         // myApp.onPageInit("lessonForm", function(page))
//     }
// })

    

// Cordova is ready
  function onDeviceReady() {
    formdb = window.sqlitePlugin.openDatabase({name: "test.db", location: 'default', createFromLocation: 1});
    lpdb = window.sqlitePlugin.openDatabase({name: "plans.db", location: 'default', androidDatabaseImplementation: 2, androidLockWorkaround: 1}, successcb, errorcb);

   
  };


  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);


function successcb(){
    
    lpdb.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS lessonplans (id integer primary key, teachername text, school text, startdate text, enddate text, grade integer, quarter integer, section text, subject text, standards text, objectives text, indicators text, resources text, notes text)', [],
        function(tx, result) {
            // alert("Table created successfully");
            showTable();
        }, 
        function(error) {
              alert("Error occurred while creating the table.");
        });
    });
}

function errorcb(){
    alert('trouble opening lesson plan db');
}



function insertLPDB(data){

    // it's inserting, but only if it's in the form of a string and not null
    //for some reason, it only inserts works if you change the grade
   
    var teachername = data.teachername
    var school = data.school 
    var startdate = data.startdate 
    var enddate = data.enddate 
    var grade = data.grade
    var quarter = data.quarter
    var section = data.section
    var subject = data.subject
    var standards = data.standards.toString()
    var objectives = data.objectives.toString()
    var indicators = data.indicators.toString()
    var resources = data.resources.toString()
    var notes = data.notes


    lpdb.transaction(function(tx){
        // alert("standards: " + standards + " subject: " + subject)
        var executeQuery = "INSERT INTO lessonplans (teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        // var executeQuery = "INSERT INTO lessonplans (subject) VALUES (?)"
        tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes],
            // tx.executeSql("INSERT INTO lessonplans (subject, section, standards) VALUES (?, ?, ?)", [subject, section, standards],
            function(tx, result){
                myApp.formDeleteData('lessonForm')
                
            },
            function(error){
                alert('error occurred')
            })
    })
}

//gets all lesson plan data and returns as array of objects
function getAllLessons(){
    var lessons;

    lessons = lpdb.transaction(function(tx){
        tx.executeSql("SELECT * FROM lessonplans", [], function(tx, results) {

            var len = results.rows.length, i;
            for(i=0; i < len; i++){
                var row = {"id": results.rows.item(i).id , "teachername": results.rows.item(i).teachername , "school": results.rows.item(i).school , "startdate": results.rows.item(i).startdate , "enddate": results.rows.item(i).enddate , "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "section": results.rows.item(i).section , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives , "indicators": results.rows.item(i).indicators , "resources": results.rows.item(i).resources , "notes": results.rows.item(i).notes }
                lessons.push(row)

                return lessons;


            }

            alert(lessons[0].subject)


            // cb(lessons);
        }, null)
    })

    alert("outer lessons: " + lessons[0].subject)
}



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


function showTable(){
    
    $(".dailyLessons").html("")
    lpdb.transaction(function(tx) {
      tx.executeSql('SELECT * FROM lessonplans', [], function (tx, results) {
       
           var len = results.rows.length, i;
           for (i = 0; i < len; i++){
              $(".dailyLessons").append("id: "+results.rows.item(i).id+" teacher: "+results.rows.item(i).teachername+" school: "+results.rows.item(i).school+" subject: "+results.rows.item(i).subject+ " standards: " + results.rows.item(i).standards + " objectives: " + results.rows.item(i).objectives + " section: "+ results.rows.item(i).section); //+ "standards: " + result.rows.item(i).standards + " OBJECTIVES: " + result.rows.item(i).objectives);
            // $(".dailyLessons").append(results.rows.item(i).subject)
           }

        }, null);
      });
}


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

myApp.onPageInit('plansList', function (page) {
    
    function getLessons(callback) {
        
        var items = new Array();
        lpdb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lessonplans', [], function(tx, results) {
                
                var len = results.rows.length;
                for (var i=0; i<len; i++){
                    // items.push(results.rows.item(i).subject);
                    var row = {"id": results.rows.item(i).id , "teachername": results.rows.item(i).teachername , "school": results.rows.item(i).school , "startdate": results.rows.item(i).startdate , "enddate": results.rows.item(i).enddate , "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "section": results.rows.item(i).section , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives , "indicators": results.rows.item(i).indicators , "resources": results.rows.item(i).resources , "notes": results.rows.item(i).notes }
                    items.push(row)
                }
                
                callback(items)
            });
        });
    }

    getLessons(function(items){
        //create virtual list

        //I think I figure this out if I need to go back to it. In order to pass the "query" which is the ID
        //of the row being referenced, put it in the href at the end (see framework7 for formatting). then, use
        //operation page.details.query or whatever it is to retrieve this later

        var virtualList= myApp.virtualList('.list-block', {
        items: items,
        template: '<li>' +
                    '<a href="lessonForm.html?id={{id}}" class="item-link item-content" data-context="{{id}}">' +
                      '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                          '<div class="item-title">{{id}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{subject}}</div>' +
                      '</div>' +
                    '</a>' +
                  '</li>'
        // Item height
       

        });
    })

});

myApp.onPageInit('planDetails', function(page){

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

