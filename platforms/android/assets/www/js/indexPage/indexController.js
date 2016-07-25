//index page is initialized
myApp.onPageInit('index', function (page) {

    //only show export to email option if device is configured with email
    if (cordova.plugins.email.isAvailable){
        $('.emailShare').removeClass("hidden");
    }

  
  //create a dynamic list of all lesson plans for today
  getCurrentLessons(function(items){
    if (items.length==0){
        return
    }
    else{
        $('.openingPrompt').addClass("hidden");
        var currentPlansList= myApp.virtualList('.currentLessons', {
            items: items,
            renderItem: function(index,item){
                return '<li class="accordion-item">' +
                        // '<a href="lessonForm.html?id='+ item.id+'" class="item-link item-content" data-context=\'{"standards":' + item.standards +', "objectives": ' + item.objectives +' }\'>' +
                         '<a href="#" class="item-link item-content">' + 
                          '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                              '<div class="item-title">' + item.subject.charAt(0).toUpperCase() + item.subject.slice(1) + '</div>' +
                              '<div class="item-after">'+toMonth((item.startdate.substr(5,5)).substr(0,2))+ ' ' + item.startdate.substr(0,4) + '</div>' +
                            '</div>' +
                            '<div class="item-subtitle">Grade ' + item.grade +', Quarter '+ item.quarter + '</div>' +
                            '<div class="chip bg-teal"><div class="chip-label">Standards: '+JSON.parse(item.standards).length+'</div></div>'+
                            '<div class="chip bg-amber"><div class="chip-label">Objectives: '+JSON.parse(item.objectives).length+'</div></div>'+
                            '<div class="chip bg-indigo"><div class="chip-label">Resources: '+JSON.parse(item.resources).length+'</div></div>'+
                          '</div>' +
                        '</a>' +
                        '<div class="accordion-item-content">' +
                            '<div class="content-block tablet-inset">' +
                                '<div class="content-block-inner">'+
                                    '<div class="row">'+
                                        '<div class="col-20"><div class="chip bg-teal"><div class="chip-label">Standards</div></div></div>'+
                                        '<div class="col-80"><ul class="itemList">'+getListHTML(item.standards)+'</ul></div>' +
                                    '</div>'+
                                    '<div class="row">'+
                                        '<div class="col-20"><div class="chip bg-amber"><div class="chip-label">Objectives</div></div></div>'+
                                        '<div class="col-80"><ul class="itemList">'+getListHTML(item.objectives)+'</ul></div>' +
                                    '</div>'+
                                    '<div class="row">'+
                                        '<div class="col-20"><div class="chip bg-indigo"><div class="chip-label">Resources</div></div></div>'+
                                        '<div class="col-80"><ul class="itemList">'+getListHTML(item.resources)+'</ul></div>' +
                                    '</div>'+
                                    '<div class="row">'+
                                        '<div class="col-20"><div class="chip bg-deeppurple"><div class="chip-label">Resource Details</div></div></div>'+
                                        '<div class="col-80"><ul class="itemList"><li>'+((item.sequence) ? item.sequence:"No additional resources. Tap edit to add more.")+'</li></ul></div>' +
                                    '</div>'+
                                    '<div class="row">'+
                                        '<div class="col-20"><div class="chip bg-deeppurple"><div class="chip-label">Notes</div></div></div>'+
                                        '<div class="col-80"><ul class="itemList"><li>'+((item.notes) ? item.notes:"No notes. Tap edit to add more.")+'</li></ul></div>' +
                                    '</div>'+
                                    '<br>'+
                                    '<div class="row"><a href="lessonForm.html?id='+ item.id+'" class="col-20 button button-fill color-pink item-link" data-context=\'{"standards":' + item.standards +', "objectives": ' + item.objectives +' }\'>Edit</a></div>' +
                                '</div>'+
                            '</div>'+ 
                        '</div>'+
                      '</li>';
            },
            height:115
        });
        
    }  

  })

    //format items array as html output to display in virtual list
    function getListHTML(items){
        if(JSON.parse(items).length > 0){
            var str= ""
            for (var i=0; i < JSON.parse(items).length; i++){
                str += "<li>" + (JSON.parse(items))[i] + "</li>"
            }
            return str
        }
        else{
            return "<li>None. Tap edit to add more.</li>"
        }
    }

    //****
    //Get Today's Plans - a callback
    //****

    //Returns array of current lesson plans (based on start and end date)
    //Used to populate the list of Today's Plans on the homescreen
    function getCurrentLessons(callback) {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 
        if(mm<10) {
            mm='0'+mm
        } 

        today =  yyyy+'-'+mm+'-'+dd;
        // alert("today's date: " + today)
            
        var items = new Array();
        lpdb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lessonplans WHERE startdate <= "' + today + '" AND enddate >= "' + today +'" ORDER BY date(startdate)', [], function(tx, results) {
                
                var len = results.rows.length;
                for (var i=0; i<len; i++){
                    // items.push(results.rows.item(i).subject);
                    items.push({"id": results.rows.item(i).id , "startdate": results.rows.item(i).startdate , "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives, "resources": results.rows.item(i).resources, "sequence": results.rows.item(i).sequence, "notes": results.rows.item(i).notes })
                    
                }
                
                callback(items)
            });
        });
    }

});

var sendEmail = false;

//****
//Sharing lesson plans
//****


$$(document).on('click', '.emailShare', function(e){
    sendEmail = true;

    //check that start and endate are both filled in, otherwise, show error
    if($('.startDateInput').val()=="" || $('.endDateInput').val()=="" ){
        myApp.alert("No lesson plans shared. Please fill in values for both to and from dates.")
        return;
    }
    else{
        myApp.showPreloader("Exporting your files");
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        // alert("got main dir: " + JSON.stringify(dir));
        createFile(dir, "log.csv") 
    });

    } 
})

//Share popup is triggered when nav item is tapped
$$(document).on('click', '.shareLink', function(e){
    //check that start and endate are both filled in, otherwise, show error
    if($('.startDateInput').val()=="" || $('.endDateInput').val()=="" ){
        myApp.alert("No lesson plans shared. Please fill in values for both to and from dates.")
        return;
    }
    else{
        myApp.showPreloader("Exporting your files");
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        // alert("got main dir: " + JSON.stringify(dir));
        createFile(dir, "log.csv") 
    });

    }   
});


function createFile(dirEntry, fileName){
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry){
        writeFile(fileEntry, null)
    })
}


//Calls the filewriter to write downloaded csv to file
//Uses getLessonsByData and jsonToCSV callback methods
function writeFile(fileEntry, dataObj){
    //first, get all applicable lessons
    getLessonsByDate(function(items){
        var csvItems = jsonToCSV(items)
        fileEntry.createWriter(function(fileWriter){
            fileWriter.write(csvItems)
            if(sendEmail){
                cordova.plugins.email.open({
                    subject: 'Lessons plans: ' + $('.startDateInput').val() + " - " + $('.endDateInput').val(),
                    body:    'Please find my lesson plans attached.',
                    attachments: fileEntry.nativeURL
                });
            }
            myApp.hidePreloader();
            myApp.alert("Records saved as log.csv in your app documents.", "My Planner")
        })
    })  
}

//Helper method that converts JSON results from db query to csv
//For arrays of strings (e.g. standards, objectives, etc.) it removes commas
function jsonToCSV(objArray){
    var header = Object.keys(objArray[0])
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = header + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != ''){ line += ','}

            //format arrays so they fit in one cell
            if (jQuery.type(array[i][index])=="string" && array[i][index].charAt(0) == "["){
                var newStr = array[i][index].replace(/,/g, "")
                line += newStr
            }
            //remove newlines from notes and sequence to fit in one cell
            else if(index=="notes" || index =="sequence"){
                var newStr = "[" + array[i][index] + "]"
                newStr = newStr.replace(/,/g, "")
                newStr = newStr.replace(/\r?\n|\r/g, " ")
                line += newStr
            }
            else{
                line += array[i][index];
            }    
        }

        str += line + '\r\n';
    }
    return str;
}

//Helper method that reads input in the start and end date fields
//and returns all lesson plans that fall within that interval
function getLessonsByDate(callback) {
        
    var startDate= $('.startDateInput').val() //get from input
    var endDate= $('.endDateInput').val() //get from input

    var items = new Array();
    lpdb.transaction(function(tx) {
        tx.executeSql('SELECT * FROM lessonplans WHERE startdate >= "' + startDate + '" AND enddate <= "' + endDate +'"', [], function(tx, results) {
            // alert(results.rows.length)
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                items.push({"id": results.rows.item(i).id , "teachername": results.rows.item(i).teachername , "school": results.rows.item(i).school , "startdate": results.rows.item(i).startdate , "enddate": results.rows.item(i).enddate , "grade": results.rows.item(i).grade , "quarter": results.rows.item(i).quarter , "section": results.rows.item(i).section , "subject": results.rows.item(i).subject , "standards": results.rows.item(i).standards , "objectives": results.rows.item(i).objectives , "indicators": results.rows.item(i).indicators , "resources": results.rows.item(i).resources , "notes": results.rows.item(i).notes, "sequence": results.rows.item(i).sequence })
            }
            if (items.length==0){
                myApp.hidePreloader();
                myApp.alert("Error exporting. No lesson plans saved.", "My Planner")
            }
            callback(items)
        }, errorHandler);
    });
    function errorHandler(){
        myApp.hidePreloader();
        myApp.alert("Error exporting. No lesson plans saved.", "My Planner")
    }
}

//****
//Update CURRICULUM db
//****

//initiate update process and backup
$$(document).on('click','.updateApp', function(e){
    myApp.showPreloader("Updating");
    //Create a backup if hasn't been done already with update version
    createBackup(function(){

        //The directory to store data
        var store;
        store = cordova.file.dataDirectory;
        //URL of our asset
        var assetURL= 'http://downloads.moe/test/lessonPlanning/updated-curric-database.csv'
        
        //File name of our important data file we didn't ship with the app
        var fileName = "curriculum.csv";
        var fileTransfer = new FileTransfer();
        fileTransfer.download(assetURL, store + fileName, 
            function(entry) {
                // Successfully downloaded file
                appStart(entry);
            }, 
            function(err) {
                myApp.hidePreloader()
                myApp.alert("Error updating. Check your internet connection and retry.", "My Planner")
            });

        //Only called when the file exists or has been downloaded.
        function appStart(fileEntry) {           
            fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function(){
                            Papa.parse(this.result, {
                                header: true,
                                dynamicTyping: true,
                                complete:function(results){
                                    formdb.transaction(function(transaction){
                                        transaction.executeSql('DELETE FROM CURRICULUM', [], 
                                            function(tx, result){
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

//Called on update. Backs up current form database to new table and then continues update process
//The update process is continued even if there is an error in backing up the database
function createBackup(callback){
    //First, check that the version being backed up isn't a duplicate
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

//Helper method that compares the version of Curriculum vs curriculum_old
//version is stored as a string in the first row and cell in each database
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

function updateFormTable(results, tx){
    var sql = "INSERT INTO CURRICULUM (subject, quarter, grade, standardID, standard, gradeObjID, objective, subobjective, indicator, resources) VALUES (?,?,?,?,?,?,?,?,?,?)"
    for (var i in results){
        var params = [results[i].subject, results[i].quarter, results[i].grade, results[i].standardID, results[i].standard, results[i].gradeObjID, results[i].objective, results[i].subobjective, results[i].indicator, results[i].resources]
        tx.executeSql(sql, params)
        myApp.hidePreloader()
        myApp.alert("Update Complete", "My Planner")

    }
}


//****
//Rollback database to previously stored update if available
//****

$$(document).on('click', '.rollbackData', function(e){
    myApp.confirm("Are you sure you want to rollback to the last update? This will not affect your saved lesson plans.", "Update Rollback", function(){

        //check if old_curriculum table exists - if it does, and has data, delete data from curriculum
        //copy rows from curriculum-old to curriculum, then refresh page
        myApp.showPreloader("Rollback to last update");
        formdb.transaction(function(tx){
            tx.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name = "CURRICULUM_OLD"', [], function(tx, res){
                // alert("success! result: " + JSON.stringify(res))
                if(res.rows.length == 1){
                    //delete curriculum and replace with old curriculum
                    formdb.transaction(function(tx){
                        tx.executeSql('DELETE FROM CURRICULUM', [], function(tx,res){
                        })
                        tx.executeSql('INSERT INTO CURRICULUM SELECT * FROM CURRICULUM_OLD',[], function(tx,res){
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
                myApp.hidePreloader();
                myApp.alert("No backup data available. Update rollback aborted.")
                return
            })
        })
    })
})

//****
//Reset database to install state from preloaded db
//****

//deletes update from file system and reverts to default db shipped with install
$$(document).on('click', '.resetData', function(e){
    myApp.confirm("Are you sure you want to reset the curriculum database? This will restore all standards, objectives, resources, indicators, and sub-objectives to their original options. Your saved lesson plans will not be affected.", "Curriculum Reset", function(){
        var store = cordova.file.dataDirectory;
        var fileName = "curriculum.csv";

        window.resolveLocalFileSystemURL(store + fileName, function(file){
            
            file.remove(function(){
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