// myApp.onPageInit('index', function(page){
//     alert("initialized index")
// })

myApp.onPageBeforeAnimation('index', function(page){
    //toggle the styles applied if coming from the edit page
  $('.navbar').removeClass("theme-pink");
})