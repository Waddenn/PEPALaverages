chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "calculate_average") {
      const averages = calculateAverages();
      const generalAverage = calculateGeneralAverage(averages);
      console.log("Calculated general average: ", generalAverage);
      sendResponse({averages: averages, average: generalAverage});
  }
});


function calculateAverages() {
  const averages = {};
  const rows = document.querySelectorAll('table.table tbody tr');

  let currentSubject = "";
  let currentCoefficient = 0;
  let scores = [];

  for (let row of rows) {
      if (row.classList.contains('warning') || row.classList.contains('info')) {
          if (currentSubject && scores.length) {
              averages[currentSubject] = {
                  average: calculateAverage(scores),
                  coefficient: currentCoefficient
              };
          }

          currentSubject = row.querySelector('td:first-child').innerText.trim();
          currentCoefficient = parseFloat(row.querySelector('td:nth-child(2)').innerText.trim());
          scores = [];
      }

      if (row.classList.contains('note_devoir')) {
          let score = parseFloat(row.querySelector('td:last-child').innerText.trim());
          if (!isNaN(score)) {
              scores.push(score);
          }
      }
  }

  if (currentSubject && scores.length) {
      averages[currentSubject] = {
          average: calculateAverage(scores),
          coefficient: currentCoefficient
      };
  }

  console.log("Averages by subject: ", averages);
  return averages;
}

function calculateAverage(scores) {
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  return scores.length ? totalScore / scores.length : null;
}

function calculateGeneralAverage(averages) {
  let totalWeightedAverage = 0;
  let totalCoefficient = 0;

  for (let subject in averages) {
      let { average, coefficient } = averages[subject];
      if (average && coefficient) {
          totalWeightedAverage += average * coefficient;
          totalCoefficient += coefficient;
      }
  }

  let generalAverage = totalCoefficient ? totalWeightedAverage / totalCoefficient : null;
  generalAverage = generalAverage ? parseFloat(generalAverage.toFixed(2)) : null;
  console.log("General Average: ", generalAverage);
  return generalAverage;
}
