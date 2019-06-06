$(document).on('click','.mobile-menu-bars', function(){
  $(".mobile-menu-times").show(500, function () {
    console.log("1");
  });
  $(".name").hide(500, function () {
    console.log("2");
  });
  $("nav").show(500, function () {
    console.log("5");
  });
    $(".mobile-menu-bars").hide(500, function () {
      console.log("1");
    });
   
    
 });
$(document).on('click','.mobile-menu-times', function(){
  $(".mobile-menu-bars").show(500, function () {
    console.log("3");
  });
  $(".name").show(500, function () {
    console.log("4");
  });
  $("nav").hide(500, function () {
    console.log("5");
  });
  $(".mobile-menu-times").hide(500, function () {
    console.log("1");
  });
  

});

$(document).on('click','.arrow', function(){
  $("sidebar ul").show(500, function () {
    console.log("3");
  });
  $(".arrow").hide(400, function () {
    console.log("3");
  });
  $(".arrow-up").show(500, function () {
    console.log("3");
  });
});

$(document).on('click','.arrow-up', function(){
  $("sidebar ul").hide(500, function () {
    console.log("3");
  });
  $(".arrow").show(400, function () {
    console.log("3");
  });
  $(".arrow-up").hide(500, function () {
    console.log("3");
  });

});