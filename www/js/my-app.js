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

// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
  //curriculum.db is only pre-populated if that database doesn't already exist (AKA on first run)
  formdb = window.sqlitePlugin.openDatabase({name: "curriculum.db", location: 'default', createFromLocation: 1});//, checkForUpdates);
  //initialize lesson plan database 
  lpdb = window.sqlitePlugin.openDatabase({name: "plans.db", location: 'default'}, function(lpdb){
      lpdb.transaction(function(tx){
          tx.executeSql('CREATE TABLE IF NOT EXISTS lessonplans (id integer primary key, teachername text, school text, startdate text, enddate text, grade integer, quarter integer, section text, subject text, standards text, objectives text, indicators text, resources text, notes text, subobjective text, sequence text)', [])
      }, function(error){
          myApp.alert("This is awkward - we couldn't load your lesson plans. Try restarting the app.", "Lesson Planner")
      }, function(){
          // testInsert() 
      });
  }, function (error){
      alert('Open database ERROR: ' + JSON.stringify(error));
  }); 
  
  myApp.init() //now you should be able to create databases from within because the deviceisready
  initWelcomeScreen()
};

  function initWelcomeScreen(){
    var options = {
      'bgcolor': '#1976D2',
      'fontcolor': '#fff',
      "open": false
    }

    var welcomescreen_slides = [
      {
        id: 'slide0',
        picture: '<div class="tutorialicon"><img src="img/welcomescreen.svg"></div>',
        text: '<strong>Alii!</strong><br><br>The Lesson Planner will help guide the planning, creation, and sharing of your lesson plans. Swipe left to learn more about how Lesson Planner can be used as a resource in the classroom.'
      },
      {
        id: 'slide1',
        picture: '<div class="tutorialicon"><img class="tutorialimage" src="img/home.png"></div>',
        text: "<strong>Home</strong><br><br>The homescreen can get you to all important parts of the app: create a plan, edit a plan, share, or update the app. You can also view today's lesson plans. By swiping right from any screen, you'll get access to the help bar."
      },
      {
        id: 'slide2',
        picture: '<div class="tutorialicon"><img class="tutorialimage" src="img/create.png"></div>',
        text: "<strong>Create</strong><br><br>Create your plans all at once, or start and make changes later. It's all up to you! Start by entering general details about yourself and your class. From there, Lesson Planner automatically walks you through the standards, objectives, and resources available for your lesson."
      },
      {
        id: 'slide3',
        picture: '<div class="tutorialicon"><img class="tutorialimage" src="img/edit.png"></div>',
        text: "<strong>Edit</strong><br><br>Not enough time to finish a plan? Need to make any last-minute changes? You can update your lesson plans by searching for them in the edit list. Here, all your lesson plans are sorted by subject and date. Tap one to edit or update."
      },
      {
        id: 'slide4',
        picture: '<div class="tutorialicon"><img class="tutorialimage" src="img/share.png"></div>',
        text: "<strong>Share</strong><br><br>You can even use Lesson Planner to quickly share any lessons you've saved! From the share menu, select the interval of plans you'd like to share by date, and then export to your device or send by email."
      },
      {
        id: 'slide5',
        picture: '<div class="tutorialicon"><img class="tutorialimage" src="img/update.png"></div>',
        text: "<strong>Update</strong><br><br>What do you have to do to make sure this all runs smoothly? Nothing (almost)! Ok, before each quarter, it's a good idea to connect to the internet and tap Update on the homescreen. Other than a little patience (Lesson Planner is still a work in progress), that's all you need! "
      },
      {
        id: 'slide6',
        picture: '<div class="tutorialicon"><img src="img/smile.svg"></div>',
        text: "<strong>That's it!</strong><br><br>Over time, Lesson Planner can simplify your lesson planning, leaving you more time to focus on other areas of class preparation. Thanks for reading and good luck!<br><br> <a class='tutorial-close-btn' href='#''>Show Me the Home Screen</a>"
      }
    ];

    var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);

    $$(document).on('click', '.helpText', function () {
        welcomescreen.open();
    });

    $$(document).on('click', '.tutorial-close-btn', function () {
      welcomescreen.close();
    });
  }   

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
    
});
