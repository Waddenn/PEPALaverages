function getColorBasedOnAverage(average) {
    let percentage = average / 20;
    let hue = Math.round(200 * percentage);
    let color = `hsl(${hue}, 80%, 50%)`;
    return color;
}

document.addEventListener('DOMContentLoaded', function() {
    let calculateButton = document.getElementById('calculate');
    let showStatsCheckbox = document.getElementById('show-stats-checkbox');
    let result = document.getElementById('result');

    if (calculateButton) {
        calculateButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "calculate_average"}, function(response) {
                    if (chrome.runtime.lastError) {
                        result.innerText = 'Wrong page!';
                        result.style.color = 'red';
                        result.style.fontSize = '14px'; 
                    } else {
                        if(response.error) {
                            result.innerText = response.error;
                            result.style.color = 'red';
                            result.style.fontSize = '14px'; 
                        } else {
                            result.innerText = response.average;
                            result.style.fontSize = '30px'; 
                            if(showStatsCheckbox.checked) {
                                document.body.classList.add('show-stats'); 

                                let stats = document.getElementById('stats');
                                stats.innerHTML = '';
                                let numOfBars = 0;  

                                for (let subject in response.averages) {
                                    numOfBars++; 
                                    let bar = document.createElement('div');
                                    bar.className = 'bar';
                                    let barWidth = (response.averages[subject].average * 15);
                                    bar.style.width = barWidth + 'px';  
                                    bar.style.backgroundColor = getColorBasedOnAverage(response.averages[subject].average);  
                                    let label = document.createElement('div');
                                    label.className = 'label';
                                    label.innerText = `${subject}: ${response.averages[subject].average}`;

                                    if(barWidth < 130) { 
                                        label.style.left = (barWidth + 10) + 'px'; 
                                        label.style.color = '#FFFFFF'; 
                                    }

                                    bar.appendChild(label);
                                    stats.appendChild(bar);
                                }

                                document.body.style.height = `${60 + numOfBars * 30 + 10}px`;
                            }
                        }
                    }
                });
            });
        });
    }
});
