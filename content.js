chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "calculate_average") {
        try {
            const averages = calculateAverages();
            const generalAverage = calculateGeneralAverage(averages);
            sendResponse({averages, average: generalAverage});
        } catch (error) {
            sendResponse({error: "Wrong page!"});
        }
    }
});

function calculateAverages() {
    const averages = {};
    const rows = document.querySelectorAll('table.table tbody tr');
    let currentSubject = "", currentCoefficient = 0, scores = [];

    rows.forEach((row) => {
        if (row.classList.contains('warning') || row.classList.contains('info')) {
            if (currentSubject && scores.length) {
                averages[currentSubject] = { average: calculateAverage(scores), coefficient: currentCoefficient };
            }
            currentSubject = row.querySelector('td:first-child').innerText.trim();
            currentCoefficient = parseFloat(row.querySelector('td:nth-child(2)').innerText.trim());
            scores = [];
        }
        if (row.classList.contains('note_devoir')) {
            const score = parseFloat(row.querySelector('td:last-child').innerText.trim());
            if (!isNaN(score)) scores.push(score);
        }
    });
    if (currentSubject && scores.length) {
        averages[currentSubject] = { average: calculateAverage(scores), coefficient: currentCoefficient };
    }
    return averages;
}

function calculateAverage(scores, precision = 2) {
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const average = scores.length ? totalScore / scores.length : null;
    return average ? parseFloat(average.toFixed(precision)) : null;
}

function calculateGeneralAverage(averages) {
    let totalWeightedAverage = 0, totalCoefficient = 0;
    for (let subject in averages) {
        const { average, coefficient } = averages[subject];
        if (average && coefficient) {
            totalWeightedAverage += average * coefficient;
            totalCoefficient += coefficient;
        }
    }
    const generalAverage = totalCoefficient ? totalWeightedAverage / totalCoefficient : null;
    return generalAverage ? parseFloat(generalAverage.toFixed(2)) : null;
}
