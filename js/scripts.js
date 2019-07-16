var startMonth=5;
var endMonth=9;
var waterPrice=0; //per 1000 gallons

//class specific variables
var hideNavClass = "hideNav" ;
var showNavClass = "showNav" ;

//prices for water as of 5/27/2019, price per 1000 gallons
var nycWaterPrice = (10.10 / 748) *1000;
var nassauWaterPrice = 10;

$(document).ready(function(){
    //initialize
    setStartMonth();
    setEndMonth();

    //add event listeners
    $("#start-month").on("change", function(){ setStartMonth()});
    $("#end-month").on("change", function(){ setEndMonth() });
    $("#form-water-calculator").submit( function(event){
        event.preventDefault();
        console.log("Form Submitted! Time stamp: "+ event.timeStamp);
        calculateWaterCost()
    });
    $("#hamburger-menu").on("click",function(){toggleNav()});
    $("#top-nav a").on("click", function(){toggleNav()});

    //smooth scroll
    $('a[href*="#"]').on('click',function(e){smoothScroll(e)})

});

function setStartMonth(){
    startMonth = parseInt($("#start-month").val());
    if(startMonth > endMonth){
        endMonth = startMonth;
        $("#end-month").val(startMonth);        
    }
}

function setEndMonth(){
    endMonth = parseInt($("#end-month").val());
        if(endMonth < startMonth){
        startMonth = endMonth;
        $("#start-month").val(endMonth);        
    }
}

function calculateWaterCost(evet){
    //setup missing variables
    let zones = parseInt($("#number-sprinkler-zones").val());
    let operTime = parseInt($("#operation-time-spriklers").val());
    let freq = parseFloat($("#how-often-water").val());
    let gpm = parseInt($("#property-size").val());
    let result = 0;
    //calculate days in a season that user is watering
    let daysInseason =daysInMonthInterval(); 
    let gallonsUsedDaily = zones * operTime * freq * gpm / 7;
    waterPrice = $("#water-supplier").val() == "nassau" ? nassauWaterPrice : nycWaterPrice;
    let gallonsUsedPerSeason = Math.round(gallonsUsedDaily * daysInseason);
    let seasonalCost =  gallonsUsedPerSeason * waterPrice /1000; //divide by 1000 since waterPrice is per 1000 gallons
    console.log("water price " + $('input[water-supplier]:checked').val());
    console.log("zones: " + zones + ", operTime: "+ operTime + ", freq: " +freq + ", gpm: " + gpm + ", daysInSeason: " + daysInseason);
    console.log("gallonsUsedDaily is " + gallonsUsedDaily +", waterPrice: " + waterPrice + ", gallonsUsedPerSeason: " + gallonsUsedPerSeason + ", seasonalCost: " + seasonalCost);
}

function daysInMonthInterval(){
    let result =0;
    for(let i = startMonth; i<= endMonth; i++ ){
        result += new Date(2019,i,0).getDate();
    }
    return result;
}

function toggleNav(){
    var nav = $("#top-nav");
    if (nav.hasClass("showNav")){
        //hide nav
        nav.removeClass(showNavClass).addClass(hideNavClass);
        console.log("hiding nav bar");
    }
    else{
        //show nav
        nav.removeClass(hideNavClass).addClass(showNavClass);
        console.log("showing navbar");
    }
}

/*Detect if browser used by user is IE*/
function isIE() {
    let ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
}

//smooth scroll listener adjusted for target
function scrollToTargetAdjusted(event){
    event.preventDefault();
    var element = document.getElementById(event.target.hash.replace("#",""));
    var headerOffset = $("header").outerHeight();
    var startPosition = window.pageYOffset;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset;
    var duration = distance * 10;

    window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
}


//beautiful smooth scroll with offset for header/navbar
function smoothScroll(event){
    var startPosition = window.pageYOffset
    var destination = document.getElementById(event.target.hash.replace("#",""));
    var targetPosition = destination.getBoundingClientRect().top;
    var headerOffset = document.querySelector("header").offsetHeight;
    //duration is equivalent to distance traveled which is absolute value of target position (it could be negative!)
    var duration = Math.abs(targetPosition);
    var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var destinationOffset = destination.offsetTop-headerOffset;
    var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    function scroll() {
        var now = 'now' in window.performance ? performance.now() : new Date().getTime();
        var time = Math.min(1, ((now - startTime) / duration));
        var timeFunction = easeInFunction(time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - startPosition)) + startPosition));
        //stop recursive calls when you reach your destination
        if (window.pageYOffset === destinationOffsetToScroll) {  return; }
        //recursive call
        requestAnimationFrame(scroll);
    }

    scroll();
}

//easeInOutQuad
function easeInFunction(t){
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}