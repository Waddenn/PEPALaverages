function initializePopup() {
    const calculateButton = document.getElementById('calculate');
    const showStatsCheckbox = document.getElementById('show-stats-checkbox');
    const result = document.getElementById('result');

    if (calculateButton) {
        calculateButton.addEventListener('click', handleCalculateButtonClick);
    }

    function handleCalculateButtonClick() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {message: "calculate_average"}, (response) => {
                handleResponse(response, showStatsCheckbox, result);
            });
        });
    }

    function handleResponse(response, checkbox, resultElement) {
        if (chrome.runtime.lastError) {
            displayError(resultElement);
        } else if (response.error) {
            displayError(resultElement, response.error);
        } else {
            displayResults(response, checkbox, resultElement);
        }
    }

    function displayError(element, message = 'Wrong page!') {
        element.innerText = message;
        element.style.color = 'red';
        element.style.fontSize = '14px';
    }

    function displayResults(response, checkbox, element) {
        element.innerText = response.average;
        element.style.fontSize = '30px';
        if (checkbox.checked) {
            document.body.classList.add('show-stats'); 
            displayStats(response);
        }
    }
    

    function displayStats(response) {
        const stats = document.getElementById('stats');
        stats.innerHTML = '';
        let numOfBars = Object.keys(response.averages).length;

        for (let subject in response.averages) {
            const bar = createBar(response.averages[subject].average, subject);
            stats.appendChild(bar);
        }

        document.body.style.height = `${60 + numOfBars * 30 + 10}px`;
    }

    function createBar(average, subject) {
        const bar = document.createElement('div');
        bar.className = 'bar';

        const barWidth = average * 15;
        bar.style.width = `${barWidth}px`;
        bar.style.backgroundColor = getColorBasedOnAverage(average);

        const label = document.createElement('div');
        label.className = 'label';
        label.innerText = `${subject}: ${average}`;

        if (barWidth < 130) {
            label.style.left = `${barWidth + 10}px`;
            label.style.color = '#FFFFFF';
        }

        bar.appendChild(label);
        return bar;
    }
}

document.addEventListener('DOMContentLoaded', initializePopup);

function getColorBasedOnAverage(average) {
    const hue = Math.round((average / 20) * 200);
    return `hsl(${hue}, 80%, 50%)`;
}
