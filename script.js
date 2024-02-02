function changedInput(event) {
  convertUnits(event.currentTarget.id);

  // Keep track of input oder flow, area, speed
  updateInputOrder(event.currentTarget.id);

  // Keep track of input oder for area rectangle
  updateInputOrderAreaRectangle(event.currentTarget.id);

  // Get selected values from the areaType radio buttons
  const areaTpye = document.querySelector(
    'input[name="areaType"]:checked'
  ).value;

  if ("rectangle" == areaTpye) {
    calculateThirdValueAreaRect();
  }

  calculateThirdValue();
  getPressureDrop();
  getHydraulicDiameter();
}

// convert entered values to all other units
function convertUnits(idEntered) {
  if ("flowM3H" == idEntered) {
    const flowM3H = parseFloat(document.getElementById("flowM3H").value);
    document.getElementById("flowM3S").value = flowM3H / 3600;
  }

  if ("flowM3S" == idEntered) {
    const flowM3S = parseFloat(document.getElementById("flowM3S").value);
    document.getElementById("flowM3H").value = flowM3S * 3600;
  }

  if ("areaM2" == idEntered) {
    const areaM2 = parseFloat(document.getElementById("areaM2").value);
    document.getElementById("areaDiameterMM").value =
      (areaM2 / Math.PI) ** 0.5 * 2 * 1000;
    updateInputOrderAreaRectangle("areaM2");
  }

  if ("areaDiameterMM" == idEntered) {
    const areaDiameterMM = parseFloat(
      document.getElementById("areaDiameterMM").value
    );
    document.getElementById("areaM2").value =
      (areaDiameterMM / 1000 / 2) ** 2 * Math.PI;
    updateInputOrderAreaRectangle("areaM2");
  }

  if ("speedMS" == idEntered) {
    const speedMS = parseFloat(document.getElementById("speedMS").value);
    const densityKgM3 = parseFloat(
      document.getElementById("densityKgM3").value
    );
    document.getElementById("speedDynPressurePa").value =
      (densityKgM3 / 2) * speedMS ** 2;
  }

  if ("speedDynPressurePa" == idEntered) {
    const speedDynPressurePa = parseFloat(
      document.getElementById("speedDynPressurePa").value
    );
    const densityKgM3 = parseFloat(
      document.getElementById("densityKgM3").value
    );
    document.getElementById("speedMS").value = Math.sqrt(
      (2 * speedDynPressurePa) / densityKgM3
    );
  }

  if ("densityKgM3" == idEntered) {
    const densityKgM3 = parseFloat(
      document.getElementById("densityKgM3").value
    );
    if ("speedMS" == inputOrderSpeed) {
      const speedMS = parseFloat(document.getElementById("speedMS").value);
      const densityKgM3 = parseFloat(
        document.getElementById("densityKgM3").value
      );
      document.getElementById("speedDynPressurePa").value =
        (densityKgM3 / 2) * speedMS ** 2;
    } else if ("speedDynPressurePa" == inputOrderSpeed) {
      const speedDynPressurePa = parseFloat(
        document.getElementById("speedDynPressurePa").value
      );
      const densityKgM3 = parseFloat(
        document.getElementById("densityKgM3").value
      );
      document.getElementById("speedMS").value = Math.sqrt(
        (2 * speedDynPressurePa) / densityKgM3
      );
    }
  }
}

function updateAreaType() {
  // Hide all divs
  document
    .querySelectorAll(".areaType")
    .forEach((div) => (div.style.display = "none"));

  // Get selected values from the radio buttons
  const areaTpye = document.querySelector(
    'input[name="areaType"]:checked'
  ).value;

  // Show the selected div
  document.getElementById(areaTpye).style.display = "block";
}
// call function at page load
updateAreaType();

function calculateThirdValue() {
  if (inputOrder.length >= 2) {
    iO2 = inputOrder.slice(0, 2);
    if (iO2.includes("area") && iO2.includes("flow")) {
      // calculate speed
      const areaM2 = parseFloat(document.getElementById("areaM2").value);
      const flowM3S = parseFloat(document.getElementById("flowM3S").value);
      const speedMS = flowM3S / areaM2;
      document.getElementById("speedMS").value = speedMS;
      const densityKgM3 = parseFloat(
        document.getElementById("densityKgM3").value
      );
      document.getElementById("speedDynPressurePa").value =
        (densityKgM3 / 2) * speedMS ** 2;
    } else if (iO2.includes("area") && iO2.includes("speed")) {
      // calculate flow
      const areaM2 = parseFloat(document.getElementById("areaM2").value);
      const speedMS = parseFloat(document.getElementById("speedMS").value);
      flowM3S = speedMS * areaM2;
      document.getElementById("flowM3S").value = flowM3S;
      convertUnits("flowM3S");
    } else if (iO2.includes("flow") && iO2.includes("speed")) {
      // calculate area
      const flowM3S = parseFloat(document.getElementById("flowM3S").value);
      const speedMS = parseFloat(document.getElementById("speedMS").value);
      areaM2 = flowM3S / speedMS;
      document.getElementById("areaM2").value = areaM2;
      convertUnits("areaM2");
      updateInputOrderAreaRectangle("areaM2");
      calculateThirdValueAreaRect("areaM2");
    }
  }
}

function getHydraulicDiameter() {
  const areaTpye = document.querySelector(
    'input[name="areaType"]:checked'
  ).value;

  if ("circle" == areaTpye) {
    document.getElementById("hydraulicDiameterMM").value = parseFloat(
      document.getElementById("areaDiameterMM").value
    );
  } else {
    const heightMM = parseFloat(
      document.getElementById("areaRectHeightMM").value
    );
    const widthMM = parseFloat(
      document.getElementById("areaRectWidthMM").value
    );
    document.getElementById("hydraulicDiameterMM").value =
      (2 * heightMM * widthMM) / (heightMM + widthMM);
  }
}

function getPressureDrop() {
  const flowM3H = parseFloat(document.getElementById("flowM3H").value);
  const speedMS = parseFloat(document.getElementById("speedMS").value);
  getHydraulicDiameter();
  const areaDiameterMM = parseFloat(
    document.getElementById("hydraulicDiameterMM").value
  );
  const densityKgM3 = parseFloat(document.getElementById("densityKgM3").value);
  const lamda = 0.0072 + 0.018 * (flowM3H / areaDiameterMM) ** -0.35;
  const pressureDropPaM =
    ((lamda * densityKgM3) / ((2 * areaDiameterMM) / 1000)) * speedMS ** 2;
  document.getElementById("pressureDropPaM").value = pressureDropPaM.toFixed(0);
}

// Array that keeps track of the order of parameter inputs
// possible values: "area", "flow", "speed"
inputOrder = new Array(0);

function updateInputOrder(inputID) {
  if (inputID.startsWith("area")) {
    updateInputOrderArray("area");
  } else if (inputID.startsWith("flow")) {
    updateInputOrderArray("flow");
  } else if (inputID.startsWith("speed")) {
    updateInputOrderArray("speed");
  } else {
  }

  function updateInputOrderArray(inputType) {
    const index = inputOrder.indexOf(inputType);
    if (index > -1) {
      // Remove the element from its current position
      inputOrder.splice(index, 1);
      // Add it to the front of the array
      inputOrder.unshift(inputType);
    } else {
      // Add to front of the array
      inputOrder.unshift(inputType);
    }
  }
}

// var that track of the order of parameter inputs
// possible values: "speedMS", "speedDynPressurePa"
var inputOrderSpeed = "init";

function updateInputOrderSpeed(inputID) {
  if (inputID.startsWith("speed")) {
    inputOrderSpeed = inputID;
  }
}

// Array that keeps track of the order of parameter inputs
// possible values: "height", "width", "area"
inputOrderAreaRectangle = new Array(0);

function updateInputOrderAreaRectangle(inputID) {
  if (inputID == "areaRectHeightMM") {
    updateinputOrderAreaRectangeArray("height");
  } else if (inputID == "areaRectWidthMM") {
    updateinputOrderAreaRectangeArray("width");
  } else if (inputID == "areaM2") {
    updateinputOrderAreaRectangeArray("area");
  } else {
  }

  function updateinputOrderAreaRectangeArray(inputType) {
    const index = inputOrderAreaRectangle.indexOf(inputType);
    if (index > -1) {
      // Remove the element from its current position
      inputOrderAreaRectangle.splice(index, 1);
      // Add it to the front of the array
      inputOrderAreaRectangle.unshift(inputType);
    } else {
      // Add to front of the array
      inputOrderAreaRectangle.unshift(inputType);
    }
  }
}

function calculateThirdValueAreaRect() {
  if (inputOrderAreaRectangle.length >= 2) {
    iO2 = inputOrderAreaRectangle.slice(0, 2);
    if (iO2.includes("height") && iO2.includes("width")) {
      // calculate area
      const heightMM = parseFloat(
        document.getElementById("areaRectHeightMM").value
      );
      const widthMM = parseFloat(
        document.getElementById("areaRectWidthMM").value
      );
      document.getElementById("areaM2").value = (heightMM * widthMM) / 1e6;
      convertUnits("areaM2");
    } else if (iO2.includes("area") && iO2.includes("height")) {
      // calculate width
      const areaM2 = parseFloat(document.getElementById("areaM2").value);
      const heightMM = parseFloat(
        document.getElementById("areaRectHeightMM").value
      );
      document.getElementById("areaRectWidthMM").value =
        (areaM2 / heightMM) * 1e6;
    } else if (iO2.includes("area") && iO2.includes("width")) {
      // calculate height
      const areaM2 = parseFloat(document.getElementById("areaM2").value);
      const widthMM = parseFloat(
        document.getElementById("areaRectWidthMM").value
      );
      document.getElementById("areaRectHeightMM").value =
        (areaM2 / widthMM) * 1e6;
    }
    getHydraulicDiameter();
  }
}
