/*:
 * @plugindesc Call the function inside an Rpg Maker variable via the Script field or use reuse in other scripts.
 * @author Nobody
 *
 * @help getRealTime.js
 * Instructions:
 * call getRealTime() on Rpg Maker Control Variable
 *
 * To Year (4 digits): getRealTime("year")
 * To Month: getRealTime("month")
 * To Number day: getRealTime("day")
 * To Week day: getRealTime("week")
 * To Hours: getRealTime("hours")
 * To Minutes: getRealTime("minutes")
 * To Seconds: getRealTime("seconds")
 *
 * On dialog \v[id] return Computer Time
 */
 function getRealTime(d){
    var t = new Date(), rt;
    var week = [
       "Sunday",
       "Monday",
       "Tuesday",
       "Wednesday",
       "Thursday",
       "Friday",
       "Saturday"
    ];
    
    var spliDate = [
        t.getFullYear(),
        t.getMonth() + 1,
        t.getDate(),
        week[t.getDay()],
        t.getHours(),
        t.getMinutes(),
        t.getSeconds()
    ];
    
    (spliDate[1] < 10) ? spliDate[1]="0"+spliDate[1] : '';
    (spliDate[2] < 10) ? spliDate[2]="0"+spliDate[2] : '';
    (spliDate[4] < 10) ? spliDate[4]="0"+spliDate[4] : '';
    (spliDate[5] < 10) ? spliDate[5]="0"+spliDate[5] : '';
    (spliDate[6] < 10) ? spliDate[6]="0"+spliDate[6] : '';   
    
    switch(d){
        case "year":
            rt=spliDate[0];
            break;
        case "month":
            rt=spliDate[1];
            break;
        case "day":
            rt=spliDate[2];
            break;
        case "week":
            rt=spliDate[3];
            break;
          case "hour":
            rt=t.getHours();
            rt=spliDate[4];
            break;
        case "minutes":
            rt=spliDate[5];
            break;
        case "seconds":
            rt=spliDate[6];
            break;
        default:
            rt=spliDate[0]+"/"+spliDate[1]+"/"+spliDate[2]+", "+spliDate[3]+", "+spliDate[4]+":"+spliDate[5]+":"+spliDate[6];
    }
    return rt;
}