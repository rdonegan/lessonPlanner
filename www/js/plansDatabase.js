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

    lpdb.transaction(function(tx){
        // alert("standards: " + standards + " subject: " + subject)
        // alert("lpdb right now: " + JSON.stringify(lpdb))
        var executeQuery = "INSERT INTO lessonplans (teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjective) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        // var executeQuery = "INSERT INTO lessonplans (subject) VALUES (?)"
        tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjectives],
            // tx.executeSql("INSERT INTO lessonplans (subject, section, standards) VALUES (?, ?, ?)", [subject, section, standards],
            function(tx, result){
                // alert("lpdb after transaction: " + JSON.stringify(lpdb))
                // alert("result after transaction: " + JSON.stringify(result))
                myApp.formDeleteData('lessonForm')
                mainView.router.loadPage('index.html');
                myApp.addNotification({
                    message: 'Successfully created new lesson plan!'
                });
                // alert('saved actually')
                
            },
            function(error){
                // alert("Error occurred. Couldn't save lesson plan.")
                myApp.alert("Error occurred. Couldn't save lesson plan.", "Lesson Planner")
            })
    })
}