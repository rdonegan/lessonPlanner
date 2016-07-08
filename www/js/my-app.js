// Initialize your app
var myApp = new Framework7({
    init:false,
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



// Cordova is ready
  function onDeviceReady() {
    //curriculum.db is only pre-populated if that database doesn't already exist (AKA on first run)
    formdb = window.sqlitePlugin.openDatabase({name: "curriculum.db", location: 'default', createFromLocation: 1});//, checkForUpdates);
    if (lpdb==null){
        lpdb = window.sqlitePlugin.openDatabase({name: "plans.db", location: 'default'}, function(lpdb){
            lpdb.transaction(function(tx){
                tx.executeSql('CREATE TABLE IF NOT EXISTS lessonplans (id integer primary key, teachername text, school text, startdate text, enddate text, grade integer, quarter integer, section text, subject text, standards text, objectives text, indicators text, resources text, notes text, subobjective text)', [], 
                    function(tx,result){
                        // alert("inner result: " + JSON.stringify(result))
                    })
            }, function(error){
                // alert("transaction error: " + error.message);
                myApp.alert("This is awkward - we couldn't load your lesson plans. Try restarting the app.", "Lesson Planner")
            }, function(){
                // alert("transaction ok");
                
            });


        }, function (error){
            alert('Open database ERROR: ' + JSON.stringify(error));
        }); 
    } 

    myApp.init() //now you should be able to create databases from within because the deviceisready


  };

  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);

function updateFormTable(results, tx){
    // alert(results[0].subject)
    var sql = "INSERT INTO CURRICULUM (subject, quarter, grade, standardID, standard, gradeObjID, objective, subobjective, indicator, resources) VALUES (?,?,?,?,?,?,?,?,?,?)"
    for (var i in results){
        var params = [results[i].subject, results[i].quarter, results[i].grade, results[i].standardID, results[i].standard, results[i].gradeObjID, results[i].objective, results[i].subobjective, results[i].indicator, results[i].resources]
        // alert(JSON.stringify(results[i]))
        tx.executeSql(sql, params)
        myApp.hidePreloader()
        myApp.alert("Update Complete", "My Planner")

    }
}


function compareVersions(callback){
    // alert("comparing")
    var curriculum_version= "";
    var old_curriculum_version = "";

    formdb.transaction(function(tx){
        tx.executeSql('SELECT SUBJECT FROM CURRICULUM ORDER BY ROWID ASC LIMIT 1', [], function(tx,result){
             // alert("curriculum versionn: " + result.rows.item(0).subject)
            curriculum_version = result.rows.item(0).subject
        })
        tx.executeSql('SELECT SUBJECT FROM CURRICULUM_OLD ORDER BY ROWID ASC LIMIT 1', [], function(tx, result){
            // alert("old curric version: " + result.rows.item(0).subject)
            old_curriculum_version = result.rows.item(0).subject
        })

    }, function(){
        callback(curriculum_version != old_curriculum_version)
    }, function(error){
        callback(curriculum_version != old_curriculum_version)
    })
}

//Called on update. Backs up current form database to new table and then continues update process
//The update process is continued even if there is an error in backing up the database
function createBackup(callback){
    
    //First check that the version being backed up isn't a duplicate
    compareVersions(function(newVersion){
        if(newVersion){
            //1. Drop table if exists, CURRICULUM_OLD
            //2. Create table CURRICULUM_OLD
            //3. Insert rows from CURRICULUM into CURRICULUM_OLD
            //4. Update curriculum with data from downloaded file
            formdb.transaction(function(tx){
                tx.executeSql('DROP TABLE IF EXISTS CURRICULUM_OLD', []);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CURRICULUM_OLD (subject text, quarter integer, grade integer, standardID integer, standard text, gradeObjID integer, objective text, subobjective text, indicator text, resources text)', []);
                tx.executeSql('INSERT INTO CURRICULUM_OLD SELECT * FROM CURRICULUM', [])
            }, function(){
                callback();
            }, function(err){
                callback();
            })

        }
        else{
            callback();
        }
    })

}


$$(document).on('click','.updateApp', function(e){

    

    //Freeze screen and show preloader
    myApp.showPreloader("Updating");

    
    createBackup(function(){

        //The directory to store data
        var store;
        store = cordova.file.dataDirectory;
        //URL of our asset
        var assetURL = "http://owncloud.moe/index.php/s/LUoPOp7UqLImIED/download"
        // var assetURL = "https://raw.githubusercontent.com/rdonegan/curriculum/master/sampleData.csv";
        //var assetURL= "https://dl.dropbox.com/s/f6982zuwz18t51x/updated-curric-database.csv?dl=1";
        //File name of our important data file we didn't ship with the app
        var fileName = "curriculum.csv";


        var fileTransfer = new FileTransfer();
        // alert("About to start transfer");
        fileTransfer.download(assetURL, store + fileName, 
            function(entry) {
                // alert("Success downloading file!");
                appStart(entry);
            }, 
            function(err) {
                myApp.hidePreloader()
                myApp.alert("Error updating. Check your internet connection and retry.", "My Planner")
                // alert("Error updating. Check your internet connection and retry.");
                // alert(JSON.stringify(err));
            });


        //I'm only called when the file exists or has been downloaded.
        function appStart(fileEntry) {
            // alert("fileEntry: " + fileEntry.toURL());

            
            fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function(){
                            // alert("successfully read file: ") //+ this.result)
                            Papa.parse(this.result, {
                                header: true,
                                dynamicTyping: true,
                                complete:function(results){
                                    // alert(JSON.stringify(results))
                                    formdb.transaction(function(transaction){
                                        transaction.executeSql('DELETE FROM CURRICULUM', [], 
                                            function(tx, result){
                                                // alert(result.rows.length)
                                                updateFormTable(results.data, tx)
                                            })
                                    })
                                }
                            })
                        }
                        reader.readAsBinaryString(file);

                    })
          
           
        }



    })
        

})

//restores CURRICULUM data from previous update if data exists
$$(document).on('click', '.rollbackData', function(e){
    myApp.confirm("Are you sure you want to rollback to the last update? This will not affect your saved lesson plans.", "Update Rollback", function(){

        //check if old_curriculum table exists
        //if it does, and has data, delete data from curriculum
        //copy rows from curriculum-old to curriculum
        //refresh page
        myApp.showPreloader("Rollback to last update");
        // alert("rollback happening")
        formdb.transaction(function(tx){
            tx.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name = "CURRICULUM_OLD"', [], function(tx, res){
                // alert("success! result: " + JSON.stringify(res))
                if(res.rows.length == 1){
                    //delete curriculum and replace with old curriculum
                    formdb.transaction(function(tx){
                        tx.executeSql('DELETE FROM CURRICULUM', [], function(tx,res){
                            // alert("success in deleting")
                        })
                        tx.executeSql('INSERT INTO CURRICULUM SELECT * FROM CURRICULUM_OLD',[], function(tx,res){
                            // alert("success in inserting")
                        })
                    }, function(err){
                        mainView.router.refreshPage()
                        myApp.hidePreloader();
                        myApp.alert("Rollback failed. Try updating and then rollback again. If this doesn't work, you may need to wait for the next update or reset the database.", "Lesson Planner")
                    }, function(){
                        mainView.router.refreshPage()
                        myApp.hidePreloader();
                        myApp.alert("Rollback succeeded! You are now using the previous update.", "Lesson Planner")
                    })
                }
                else{
                    myApp.hidePreloader();
                    myApp.alert("No backup data available. Update rollback aborted.")
                    return
                }
            }, function(err){
                // alert("no backup table exists")
                myApp.hidePreloader();
                myApp.alert("No backup data available. Update rollback aborted.")
                return
            })
        })



    })
    



})


//deletes update from file system and reverts to default db shipped with install
$$(document).on('click', '.resetData', function(e){
    myApp.confirm("Are you sure you want to reset the curriculum database? This will restore all standards, objectives, resources, indicators, and sub-objectives to their original options. Your saved lesson plans will not be affected.", "Curriculum Reset", function(){
        var store = cordova.file.dataDirectory;
        var fileName = "curriculum.csv";

        window.resolveLocalFileSystemURL(store + fileName, function(file){
            
            file.remove(function(){
                // alert("file deleted")
                window.sqlitePlugin.deleteDatabase({name: 'curriculum.db', location: 'default'}, function(){
                    formdb = window.sqlitePlugin.openDatabase({name: "curriculum.db", location: 'default', createFromLocation: 1}, function(){
                        myApp.alert("Standards, objectives, resources, and indicator data successfully reset", "Lesson Planner")
                        mainView.router.refreshPage()
                    });
                });
                 
            })
        })
    })

    

})



//FOR TESTING ONLY. DELETE BEFORE PRODUCTION
function showTable(){
    
    $(".dailyLessons").html("")
    lpdb.transaction(function(tx) {
      tx.executeSql('SELECT * FROM lessonplans', [], function (tx, results) {
       
           var len = results.rows.length, i;
           for (i = 0; i < len; i++){
              $(".dailyLessons").append("id: "+results.rows.item(i).id+" teacher: "+results.rows.item(i).teachername+" school: "+results.rows.item(i).school+" subject: "+results.rows.item(i).subject+ " standards: " + (JSON.parse(results.rows.item(i).standards))[0] + " objectives: " + results.rows.item(i).objectives + " section: "+ results.rows.item(i).section + " STARTDATE: " + results.rows.item(i).startdate); //+ "standards: " + result.rows.item(i).standards + " OBJECTIVES: " + result.rows.item(i).objectives);
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


