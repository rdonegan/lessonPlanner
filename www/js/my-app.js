// Initialize your app
var myApp = new Framework7({
    material: true,
    swipePanel: 'left',
    template7Pages: true,
    precompileTemplates: true
});


// Export selectors engine
var $$ = Dom7;

//Initialize Form database
var formdb;

//Initialize database for all saved lesson plans
var lpdb;



var logOb; //file object


function getLessonsByDate(callback) {
        
        var startDate= $('.startDateInput').val() //get from input
        var endDate= $('.endDateInput').val() //get from input

        var items = new Array();
        lpdb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lessonplans WHERE startdate >= "' + startDate + '" AND enddate <= "' + endDate +'"', [], function(tx, results) {
                // alert(results.rows.length)
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


function jsonToCSV(objArray){
    var header = Object.keys(objArray[0])
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    // var str = '';
    var str = header + '\r\n';

    // alert(JSON.stringify(array))

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != ''){ line += ','}

            if (jQuery.type(array[i][index])=="string" && array[i][index].charAt(0) == "["){
                // alert(array[i][index].charAt(0))
                var newStr = array[i][index].replace(/,/g, "")
                line += newStr
            }
            else{
                line += array[i][index];
            }

           
            
        }

        str += line + '\r\n';
    }

    // alert(str)
    return str;
}



function writeFile(fileEntry, dataObj){
    
    getLessonsByDate(function(items){
        var csvItems = jsonToCSV(items)
        fileEntry.createWriter(function(fileWriter){
            // alert("still in here")
            fileWriter.write(csvItems)
        })
    })

    
}


function createFile(dirEntry, fileName){
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry){
        // alert("here")
        writeFile(fileEntry, null)
    })
}

$('.shareLink').click(function(){
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        // alert('jere')
        // alert("got main dir: " + JSON.stringify(dir));
        createFile(dir, "log.csv") 
    });
});



// Cordova is ready
  function onDeviceReady() {
    formdb = window.sqlitePlugin.openDatabase({name: "curriculum.db", location: 'default', createFromLocation: 1}, checkForUpdates);
    lpdb = window.sqlitePlugin.openDatabase({name: "plans.db", location: 'default', androidDatabaseImplementation: 2, androidLockWorkaround: 1}, successcb, errorcb);  
    

    

    // function init() {
    
    //     store = cordova.file.dataDirectory;
    //     alert("store: "+store)
    //     //Check for the file. 
    //     window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);

    // }

    // function downloadAsset() {
    //     var fileTransfer = new FileTransfer();
    //     alert("About to start transfer");
    //     fileTransfer.download(assetURL, store + fileName, 
    //         function(entry) {
    //             alert("Success!");
    //             appStart(entry);
    //         }, 
    //         function(err) {
    //             alert("Error");
    //             alert(JSON.stringify(err));
    //         });
    // }

    // //I'm only called when the file exists or has been downloaded.
    // function appStart(fileEntry) {
    //     alert("fileEntry: " + fileEntry.toURL());
      
    //     fileEntry.file(function (file) {
    //         var reader = new FileReader();

    //         reader.onloadend = function(){
    //             alert("successfully read file: ") //+ this.result)

    //             Papa.parse(this.result, {
    //                 header: true,
    //                 dynamicTyping: true,
    //                 complete:function(results){
    //                     alert(JSON.stringify(results))
    //                     // updateFormTable(results)
    //                 }
    //             })

    //         }
    //         reader.readAsBinaryString(file);

    //     })
    // }
    

    // init()

  };

  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);

function updateFormTable(results){
    formdb.transaction(function(transaction){
        transaction.executeSql('DELETE * FROM curriculum', [],
            function(tx,result){
                alert('table deleted!')
            })
    })
}

function checkForUpdates()
{

    //The directory to store data
    var store;
    //URL of our asset
    var assetURL = "https://raw.githubusercontent.com/rdonegan/curriculum/master/sampleData.csv";
    //File name of our important data file we didn't ship with the app
    var fileName = "curriculum.csv";
    
    store = cordova.file.dataDirectory;
    alert("store: "+store)
    //Check for the file. 
    window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);

    function downloadAsset() {
        var fileTransfer = new FileTransfer();
        alert("About to start transfer");
        fileTransfer.download(assetURL, store + fileName, 
            function(entry) {
                alert("Success!");
                appStart(entry);
            }, 
            function(err) {
                alert("Error");
                alert(JSON.stringify(err));
            });
    }

    //I'm only called when the file exists or has been downloaded.
    function appStart(fileEntry) {
        alert("fileEntry: " + fileEntry.toURL());
      
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function(){
                alert("successfully read file: ") //+ this.result)

                Papa.parse(this.result, {
                    header: true,
                    dynamicTyping: true,
                    complete:function(results){
                        alert(JSON.stringify(results))
                        formdb.transaction(function(transaction){
                            transaction.executeSql('DELETE FROM CURRICULUM', [], 
                                function(tx, result){
                                    alert(result.rows.length)
                                    // alert('deleted everything')
                                })
                        })
                    }
                })

            }
            reader.readAsBinaryString(file);

        })
    }
    
    // formdb.transaction(function(transaction){
    //     transaction.executeSql('SELECT * FROM CURRICULUM', [], 
    //         function(tx, result){
    //             alert(JSON.stringify(result.rows.item(174)))
    //         })
    // })
}

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
    var standards = JSON.stringify(data.standards)
    var objectives = JSON.stringify(data.objectives)
    var indicators = JSON.stringify(data.indicators)
    var resources = JSON.stringify(data.resources)
    // var standards = data.standards.toString()
    // var objectives = data.objectives.toString()
    // var indicators = data.indicators.toString()
    // var resources = data.resources.toString()
    var notes = data.notes


    lpdb.transaction(function(tx){
        // alert("standards: " + standards + " subject: " + subject)
        var executeQuery = "INSERT INTO lessonplans (teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        // var executeQuery = "INSERT INTO lessonplans (subject) VALUES (?)"
        tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes],
            // tx.executeSql("INSERT INTO lessonplans (subject, section, standards) VALUES (?, ?, ?)", [subject, section, standards],
            function(tx, result){
                myApp.formDeleteData('lessonForm')
                // alert('saved actually')
                
            },
            function(error){
                alert('error occurred')
            })
    })
}

function updateLPDB(id, data){
    var teachername = data.teachername
    var school = data.school 
    var startdate = data.startdate 
    var enddate = data.enddate 
    var grade = data.grade
    var quarter = data.quarter
    var section = data.section
    var subject = data.subject
    var standards = JSON.stringify(data.standards)
    var objectives = JSON.stringify(data.objectives)
    var indicators = JSON.stringify(data.indicators)
    var resources = JSON.stringify(data.resources)
    var notes = data.notes

    lpdb.transaction(function(tx){
        // alert("standards: " + standards + " subject: " + subject)
        var executeQuery = 'UPDATE lessonplans SET teachername = ?, school = ?, startdate = ?, enddate = ?, grade = ?, quarter = ?, section = ?, subject = ?, standards = ?, objectives = ?, indicators = ?, resources = ?, notes = ? WHERE ID = "'+ id +'"'
        // var executeQuery = "INSERT INTO lessonplans (subject) VALUES (?)"
        tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes],
            // tx.executeSql("INSERT INTO lessonplans (subject, section, standards) VALUES (?, ?, ?)", [subject, section, standards],
            function(tx, result){
                myApp.formDeleteData('lessonForm')
                
                alert('saved actually')
                
            },
            function(error){
                alert("Our mistake - there was an error and your updates didn't save" )
            })
    })


}

function deleteFromLPDB(id){
    lpdb.transaction(function(tx){
        var executeQuery = "DELETE FROM lessonplans where id=?";
        tx.executeSql(executeQuery, [id])

    })
    
}



function showTable(){
    
    $(".dailyLessons").html("")
    lpdb.transaction(function(tx) {
      tx.executeSql('SELECT * FROM lessonplans', [], function (tx, results) {
       
           var len = results.rows.length, i;
           for (i = 0; i < len; i++){
              $(".dailyLessons").append("id: "+results.rows.item(i).id+" teacher: "+results.rows.item(i).teachername+" school: "+results.rows.item(i).school+" subject: "+results.rows.item(i).subject+ " standards: " + (JSON.parse(results.rows.item(i).standards))[0] + " objectives: " + results.rows.item(i).objectives + " section: "+ results.rows.item(i).section + " notes: " + results.rows.item(i).notes); //+ "standards: " + result.rows.item(i).standards + " OBJECTIVES: " + result.rows.item(i).objectives);
            // $(".dailyLessons").append(results.rows.item(i).subject)
           }

        }, null);
      });
}

    

// Read CSV and return object array
function readCSV(){
    alert("here")
    $.ajax({
    url: "https://www.dropbox.com/s/tzebmr8asnrgaih/updated-curric-database.csv?dl=0",
    async: true,
    success: function (csvd) {
        var curricSpecs = $.csv.toObjects(csvd);
        alert(curricspecs)
        // console.log(curricSpecs);
        // console.log(items[0].eval)
        // console.log(curricSpecs)
        // return curricSpecs;
        //var jsonobject = JSON.stringify(items);
        //alert(jsonobject);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete 
        // console.log(items);
        alert("in success")
    }
})
}


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
    
});


