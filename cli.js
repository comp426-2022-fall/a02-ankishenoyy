#!/usr/bin/env node

import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";


const args = minimist(process.argv.slice(2))
let timezone = moment.tz.guess()


if (args.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
    console.log("    -h            Show this help message and exit.")
    console.log("    -n, -s        Latitude: N positive; S negative.")
    console.log("    -e, -w        Longitude: E positive; W negative.")
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.")
    console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.")
    console.log("    -j            Echo pretty JSON from open-meteo API and exit.")
    process.exit(0);
}

if (args.z) {
    timezone = args.z
}

let latitude = 1
if (args.n) {
    latitude = args.n
} else if (args.s) {
    latitude = -args.s
} else {
    console.log("Latitude must be in range")
}

let longitude = 1
if (args.e) {
    longitude = args.e
} else if (args.w) {
    longitude = -args.w
} else {
    console.log("Longitude must be in range")
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&timezone=' + timezone);
const data = await response.json()
let day = 1
if (args.d) {
    day = args.d
}

if(args.d == 0){
    day = 0
}

if (args.j) {
    console.log(data)
}
else {
    let result = ""
    if (data.daily.precipitation_hours[day] > 0) {
        console.log("You might need your galoshes")
    } else {
        console.log("You will not need your galoshes")
    }
    if (day == 0) {
        console.log("today.")
    } else if (day > 1) {
        console.log("in " + day + " days.")
    } else {
        console.log("tomorrow.")
    }
}

    
