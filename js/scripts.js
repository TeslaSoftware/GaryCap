var startMonth=5;
var endMonth=9;
var waterPrice=0; //per 1000 gallons

//class specific variables
var hideNavClass = "hideNav" ;
var showNavClass = "showNav" ;

//prices for water as of 5/27/2019, price per 1000 gallons
var nycWaterPrice = (10.10 / 748) *1000;
var nassauWaterPrice = 10;
var headerHeight;

$(document).ready(function(){
    console.log("Document is ready");
    //initialize
    setStartMonth();
    setEndMonth();
    headerHeight = $("header").height();
    //refresh value of headerHeight
    setTimeout(function(){ headerHeight= $("header").height(); }, 1000);

    //add event listeners
    $("#start-month").on("change", function(){ setStartMonth()});
    $("#end-month").on("change", function(){ setEndMonth() });
    $("#form-water-calculator").submit( function(event){
        event.preventDefault();
        calculateWaterCost(event, displayCalculatorResults);
    });
    $("#hamburger-menu").on("click",function(){toggleNav()});
    $("#top-nav a").on("click", function(){toggleNav()});
    //handle modal boxes opening
    $(".more-info button").on("click", function(e){ handleMoreInfoModal(e) });
    
    //handle closing modal boxes
    $(".close-action").on("click", function(e){ handleClosingModalBoxes(e)});
    $(".close-img-action").on("click", function(e){ handleClosingModalBoxes(e)});

    //smooth scroll
    $('#top-nav a[href*="#"]').on('click',function(e){smoothScroll(e)})

    //initialize slider for credentials
    jssor_1_slider_init();

    handleSingleParallaxElement($("#parallax-image-frontyard"), 0.5);
    handleSingleParallaxElement($("#parallax-image-pump"), 0.3);
    
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

function calculateWaterCost(event, callbackFunction){
    //setup missing variables
    let zones = parseInt($("#number-sprinkler-zones").val());
    let operTime = parseInt($("#operation-time-spriklers").val());
    let freq = parseFloat($("#how-often-water").val());
    let gpm = parseInt($("#property-size").val());
    //add one to months because even from June to June it is considered one full month and from June to July its two months not one
    let monthsInASeason = endMonth - startMonth +1;
    //calculate days in a season that user is watering
    let daysInseason =daysInMonthInterval(); 
    let gallonsUsedDaily = zones * operTime * freq * gpm / 7;
    waterPrice = $("#water-supplier").val() == "nassau" ? nassauWaterPrice : nycWaterPrice;
    let gallonsUsedPerSeason = Math.round(gallonsUsedDaily * daysInseason);
    let seasonalCost =  gallonsUsedPerSeason * waterPrice /1000; //divide by 1000 since waterPrice is per 1000 gallons
   //set calculator results
    let monthlyCost = seasonalCost / monthsInASeason;
    $("#calculator-results-monthly-cost").text("$" + monthlyCost.toFixed(2));
    $("#calculator-results-seasonal-cost").text("$" + seasonalCost.toFixed(2));
    //calculate return of investment - avg price for water well is $2600
    let ROIYears = 2600 / seasonalCost;
    let ROIValue = "between " + Math.floor(ROIYears) +" to "+ Math.ceil(ROIYears) + " years.";
    $("#calculator-results-ROI").text(ROIValue);
    callbackFunction();
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
        $("#hamburger-menu").attr("aria-expanded","false");
    }
    else{
        //show nav
        nav.removeClass(hideNavClass).addClass(showNavClass);
        $("#hamburger-menu").attr("aria-expanded","true");
    }
}

/*Detect if browser used by user is IE*/
function isIE() {
    let ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
}

//beautiful smooth scroll with offset for header/navbar -> compatible with IE and old browsers
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
    var timeoutVal = 5500; //in ms, so 5000 = 5s
    var timeout = 'now' in window.performance ? performance.now() + timeoutVal : new Date().getTime() + timeoutVal;

    function scroll() {
        var now = 'now' in window.performance ? performance.now() : new Date().getTime();
        var time = Math.min(1, ((now - startTime) / duration));
        var timeFunction = easeInFunction(time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - startPosition)) + startPosition));
        //stop recursive calls when you reach your destination
        if (Math.ceil(window.pageYOffset) === destinationOffsetToScroll || now > timeout) {  return; }
        //recursive call
        requestAnimationFrame(scroll);
    }
    scroll();
}

//easeInOutQuad
function easeInFunction(t){
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

//This function handles closing modal boxes
function handleClosingModalBoxes(event){
    var targetModalBox = $(event.target).closest(".modal-box");
    targetModalBox.hide();
    targetModalBox.attr("aria-modal", "false")
    //resume playing animation
    jssor_1_slider.$Play();
    //enable scrolling of body
    $("body").css("overflow", "visible");
}

function displayCalculatorResults(){
    $("#calculator-results").show();
    $("#calculator-results").attr("aria-modal", "true");
}

function handleMoreInfoModal(e){
    var targetID = e.target.id.replace("btn","#modal");
    $(targetID).show();
    $(targetID).attr("aria-modal", "true");
    //pause animation
    jssor_1_slider.$Pause();
    //disable scrolling of body
    $("body").css("overflow", "hidden");
}

function handleSingleParallaxElement($currentElement, speed){
    var parrentTop = $currentElement.parent().offset().top;
    var parrentBottom = parrentTop + $currentElement.parent().height();

    $(window).on('scroll', function() {
        //Top and bottom in terms of Y coordinates of the document
        var viewPortTop = $(window).scrollTop();
        var viewPortBottom = viewPortTop + $(window).height();
        var scrollOffset = viewPortTop - parrentTop;
        var translateBy = Math.round(scrollOffset * speed);

        //run only if element container is within the view port
        if(viewPortTop <= parrentBottom && viewPortBottom >= parrentTop){
            window.requestAnimationFrame(function() {            
                $currentElement.css({    
                    transform: 'translateY(' + translateBy + 'px)',      
                 });
             });
        }
        
    });
}