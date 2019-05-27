var startMonth=5;
var endMonth=9;
var waterPrice=0; //per 1000 gallons

//prices for water as of 5/27/2019, price per 1000 gallons
var nycWaterPrice = (10.10 / 748) *1000;
var nassauWaterPrice = 10;

$(document).ready(function(){
    setStartMonth();
    setEndMonth();
    $("#start-month").on("change", function(){ setStartMonth()});
    $("#end-month").on("change", function(){ setEndMonth() });
    $("#form-water-calculator").submit( function(event){
        event.preventDefault();
        console.log("Form Submitted! Time stamp: "+ event.timeStamp);
        calculateWaterCost()
    });
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
    waterPrice = $("input[name=water-supplier]:checked").val() == "nassau" ? nassauWaterPrice : nycWaterPrice;
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
