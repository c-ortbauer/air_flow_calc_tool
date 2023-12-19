function changedInput(event) {
  convertUnits(event.currentTarget.id);
  updateInputOrder(event.currentTarget.id);
  if (inputOrder.length >= 2) {
    calculateThirdValue();
    calculatepressureDrop();
  }
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
  }

  if ("areaDiameterMM" == idEntered) {
    const areaDiameterMM = parseFloat(
      document.getElementById("areaDiameterMM").value
    );
    document.getElementById("areaM2").value =
      (areaDiameterMM / 1000 / 2) ** 2 * Math.PI;
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

function round(value, digitsAfterComma) {}

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
      document.getElementById("flowM3H").value = speedMS * areaM2 * 3600;
    } else if (iO2.includes("flow") && iO2.includes("speed")) {
      // calculate area
      const flowM3S = parseFloat(document.getElementById("flowM3S").value);
      const speedMS = parseFloat(document.getElementById("speedMS").value);
      areaM2 = flowM3S / speedMS;
      document.getElementById("areaM2").value = areaM2;
      document.getElementById("areaDiameterMM").value =
        (areaM2 / Math.PI) ** 0.5 * 2 * 1000;
    }
  }
}

function calculatepressureDrop() {
  const flowM3H = parseFloat(document.getElementById("flowM3H").value);
  const speedMS = parseFloat(document.getElementById("speedMS").value);
  const areaDiameterMM = parseFloat(
    document.getElementById("areaDiameterMM").value
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

// Array that keeps track of the order of parameter inputs
// possible values: "speedMS", "speedDynPressurePa"
var inputOrderSpeed = "init";

function updateInputOrderSpeed(inputID) {
  if (inputID.startsWith("speed")) {
    inputOrderSpeed = inputID;
  }
}
