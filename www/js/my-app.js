// Initialize your app
var myApp = new Framework7({
    material: true,
    swipePanel: 'left',
    template7Pages: true,
    template7Data: {
        'url:lessonForm.html': {
            teachername: 'John Doe',
            school: "Koror Elementary School",
        }
    }
});

// Export selectors engine
var $$ = Dom7;

//Initialize Form database
var formdb;

//Initialize database for all saved lesson plans
var lpdb;


// var compiledSearchTemplate = Template7.compile(searchTemplate);
    

// Cordova is ready
  function onDeviceReady() {
    formdb = window.sqlitePlugin.openDatabase({name: "test.db", location: 'default', createFromLocation: 1});
    lpdb = window.sqlitePlugin.openDatabase({name: "plans.db", location: 'default', androidDatabaseImplementation: 2, androidLockWorkaround: 1}, successcb, errorcb);  
  
    var searchTemplate = $('script#ryand').html();
     // alert(searchTemplate)
    var compiledTemplate = Template7.compile(searchTemplate)
    $('.Ry').html(compiledTemplate)
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


