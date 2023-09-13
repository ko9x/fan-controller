import { API } from "./API.js";

const container = document.getElementById("container");
const lightOn = document.getElementById("lightOn");
const lightOff = document.getElementById("lightOff");

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

let lightStatus = await checkLightState();

handleLayout();

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

function handleLayout() {
    console.log('lightStatus', lightStatus); //@DEBUG
    if(!isSmall) {
        container.classList.add('largeContainer');
    }
    if(isSmall) {
        container.classList.add('smallContainer');
    }
}

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
