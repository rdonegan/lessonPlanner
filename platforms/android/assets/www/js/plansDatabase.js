//****
//All code that directly modifies or affects plans.db
//****

//Insert a new record in lessonplans
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
    var subobjectives = JSON.stringify(data.subobjective)
    var indicators = JSON.stringify(data.indicators)
    var resources = JSON.stringify(data.resources)
    var notes = data.notes
    var sequence = data.sequence

    lpdb.transaction(function(tx){
        var executeQuery = "INSERT INTO lessonplans (teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjective, sequence) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjectives, sequence],
            function(tx, result){
                myApp.formDeleteData('lessonForm')
                mainView.router.loadPage('index.html');
                myApp.addNotification({
                    message: 'Successfully created new lesson plan!'
                });
 
            },
            function(error){
                myApp.alert("Error occurred. Couldn't save lesson plan.", "Lesson Planner")
            })
    })
}

//Update a record in lessonplans
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
    var subobjectives = JSON.stringify(data.subobjective)
    var notes = data.notes
    var sequence = data.sequence

    lpdb.transaction(function(tx){
        var executeQuery = 'UPDATE lessonplans SET teachername = ?, school = ?, startdate = ?, enddate = ?, grade = ?, quarter = ?, section = ?, subject = ?, standards = ?, objectives = ?, indicators = ?, resources = ?, notes = ?, subobjective = ?, sequence = ? WHERE ID = "'+ id +'"'
        tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjectives, sequence],
            function(tx, result){
                myApp.formDeleteData('lessonForm')
                mainView.router.loadPage('index.html');
                myApp.addNotification({
                    message: 'Successfully updated lesson plan!'
                });
            },
            function(error){
                myApp.alert("Sorry about that, there was an error and your updates didn't save." )
            })
    })
}

//Delete a record from lessonplans
function deleteFromLPDB(id){
    lpdb.transaction(function(tx){
        var executeQuery = "DELETE FROM lessonplans where id=?";
        tx.executeSql(executeQuery, [id], function(tx, result){
            myApp.addNotification({
                message: 'Lesson plan deleted.'
            })
        })

    })
}