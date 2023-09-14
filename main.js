import { API } from "./API.js";

const container = document.getElementById("container");
const lightOn = document.getElementById("lightOn");
const lightOff = document.getElementById("lightOff");
const fanHigh = document.getElementById("fanHigh");
const fanMedium = document.getElementById("fanMedium");
const fanLow = document.getElementById("fanLow");
const fanOff = document.getElementById("fanOff");

// Constants for height and width
const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
const height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

// Create a variable to differentiate between large and small screens
const isSmall = width < 750;

// ********* Initializtion Section *************************************
handleLayout();

function handleLayout() {
    if(!isSmall) {
        container.classList.add('largeContainer');
    }
    if(isSmall) {
        container.classList.add('smallContainer');
    }
}

let lightStatus = await checkLightState();

async function checkLightState() {
  let response = await fetch(`${API}/toggle/7`);

  let data = await response.json();

  console.log('data', data); //@DEBUG

  if(data === 1) {
    lightOn.classList.add('isActive');
    lightOff.classList.remove('isActive');
    return "on";
  }
  if(data === 0) {
    lightOff.classList.add('isActive');
    lightOn.classList.remove('isActive');
    return "off";
  }
}

let fanStatus = await checkFanState();

async function checkFanState() {
    let pin15Status = await checkFanPin15();
    let pin13Status = await checkFanPin13();
    let pin11Status = await checkFanPin11();

    console.log('pin15', pin15Status ); //@DEBUG
    console.log('pin13', pin13Status ); //@DEBUG
    console.log('pin11', pin11Status ); //@DEBUG

    if(pin15Status === "on" && (pin13Status === "off" && pin11Status === "off")) {
        fanHigh.classList.add('isActive');
        fanMedium.classList.remove('isActive');
        fanLow.classList.remove('isActive');
        fanOff.classList.remove('isActive');
    }
    if((pin13Status === "on" && pin11Status === "on") && (pin15Status === "off")) {
        fanHigh.classList.remove('isActive');
        fanMedium.classList.add('isActive');
        fanLow.classList.remove('isActive');
        fanOff.classList.remove('isActive');
    }
    if(pin11Status === "on" && (pin13Status === "off" && pin15Status === "off")) {
        fanHigh.classList.remove('isActive');
        fanMedium.classList.remove('isActive');
        fanLow.classList.add('isActive');
        fanOff.classList.remove('isActive');
    }
    if(pin15Status === "off" && pin13Status === "off" && pin11Status === "off") {
        fanHigh.classList.remove('isActive');
        fanMedium.classList.remove('isActive');
        fanLow.classList.remove('isActive');
        fanOff.classList.add('isActive');
    }
}

// ****** Light Control Section ***************************************

lightOn.addEventListener("click", () => {
  turnLightOn();
  console.log("Light On Clicked!");
});

lightOff.addEventListener("click", () => {
    turnLightOff();
  console.log("Light Off Clicked!");
});

async function turnLightOn(config) {
  let response = await fetch(`${API}/activate/7`);

  let data = await response.json();

  console.log('data', data); //@DEBUG

  if(data !== null) {
    checkLightState();
  }

}

async function turnLightOff(config) {
  let response = await fetch(`${API}/deactivate/7`);

  let data = await response.json();

  console.log('data', data); //@DEBUG

  if(data !== null) {
    checkLightState();
  }
}

// ****** Fan Control Section ***************************************

fanOff.addEventListener("click", () => {
    turnFanOff();
    console.log("Fan Off Clicked!");
  });

fanLow.addEventListener("click", () => {
    setFanLow();
    console.log("Fan Low Clicked!");
  });

fanMedium.addEventListener("click", () => {
    setFanMedium();
    console.log("Fan Medium Clicked!");
  });

fanHigh.addEventListener("click", () => {
    setFanHigh();
    console.log("Fan High Clicked!");
  });

async function turnFanOff() {
    let pin15IsOff = await deactivatePin15();
    let pin13IsOff = await deactivatePin13();
    let pin11IsOff = await deactivatePin11();

    if(pin15IsOff === "off" && pin13IsOff === "off" && pin11IsOff === "off") {
        checkFanState();
    } else {
        console.log('something went wrong', ); //@DEBUG
    }
}

async function setFanLow() {
    let pin15IsOff = await deactivatePin15();
    let pin13IsOff = await deactivatePin13();

    if((pin15IsOff === 'off') && (pin13IsOff === 'off')) {
        await activatePin11();
    } else {
        console.log('something went wrong', ); //@DEBUG
    }
    let pin11IsOn = await checkFanPin11();

    if((pin15IsOff == "off" && pin13IsOff === "off") && pin11IsOn === "on") {
        await checkFanState();
    }
}

async function setFanMedium() {
    let pin15IsOff = await deactivatePin15();

    if(pin15IsOff === 'off') {
        await activatePin11();
        await activatePin13();
    } else {
        console.log('something went wrong', ); //@DEBUG
    }
    let pin11IsOn = await checkFanPin11();
    let pin13IsOn = await checkFanPin13();

    if(pin15IsOff == "off" && (pin13IsOn === "on" && pin11IsOn === "on")) {
        await checkFanState();
    }
}

async function setFanHigh() {
    let pin13IsOff = await deactivatePin13();
    let pin11IsOff = await deactivatePin11();

    if(pin13IsOff === "off" && pin11IsOff === "off") {
        await activatePin15();
    } else {
        console.log('something went wrong', ); //@DEBUG
    }
    let pin15IsOn = await checkFanPin15();

    if(pin15IsOn == "on" && (pin13IsOff === "off" && pin11IsOff === "off")) {
        await checkFanState();
    }
}

async function checkFanPin15() {
    let response = await fetch(`${API}/toggle/15`);

    let data = await response.json();

    console.log('data', data); //@DEBUG

    if(data === 0) {
        return "off";
    }
    if(data === 1) {
        return "on";
    }
}

async function checkFanPin13() {
    let response = await fetch(`${API}/toggle/13`);

    let data = await response.json();

    console.log('data', data); //@DEBUG

    if(data === 0) {
        return "off";
    }
    if(data === 1) {
        return "on";
    }
}

async function checkFanPin11() {
    let response = await fetch(`${API}/toggle/11`);

    let data = await response.json();

    console.log('data', data); //@DEBUG

    if(data === 0) {
        return "off";
    }
    if(data === 1) {
        return "on";
    }
}

async function activatePin15() {
    let response = await fetch(`${API}/activate/15`);

    let data = await response.json();

    if(data === 1) {
        return "on";
    }
}
async function activatePin13() {
    let response = await fetch(`${API}/activate/13`);

    let data = await response.json();

    if(data === 1) {
        return "on";
    }
}
async function activatePin11() {
    let response = await fetch(`${API}/activate/11`);

    let data = await response.json();

    if(data === 1) {
        return "on";
    }
}
async function deactivatePin15() {
    let response = await fetch(`${API}/deactivate/15`);

    let data = await response.json();

    if(data === 0) {
        return "off";
    }
}
async function deactivatePin13() {
    let response = await fetch(`${API}/deactivate/13`);

    let data = await response.json();

    if(data === 0) {
        return "off";
    }
}
async function deactivatePin11() {
    let response = await fetch(`${API}/deactivate/11`);

    let data = await response.json();

    if(data === 0) {
        return "off";
    }
}
