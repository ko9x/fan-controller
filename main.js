import { API } from "./API.js";

const lightOn = document.getElementById("lightOn");
const lightOff = document.getElementById("lightOff");

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

  if (data?.success) {
    console.log('data', data); //@DEBUG
  } else {
    console.log('no data', ); //@DEBUG
  }
}

async function turnLightOff(config) {
  let response = await fetch(`${API}/deactivate/7`);

  let data = await response.json();

  if (data?.success) {
    console.log('data', data); //@DEBUG
  } else {
    console.log('no data', ); //@DEBUG
  }
}
