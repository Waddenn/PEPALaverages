function getColorBasedOnAverage(average) {
    let percentage = average / 20;
    let hue = Math.round(200 * percentage);
    let color = `hsl(${hue}, 80%, 50%)`;
    return color;
}

document.addEventListener('DOMContentLoaded', function() {
    let calculateButton = document.getElementById('calculate');
    let showStatsCheckbox = document.getElementById('show-stats-checkbox');

    if(calculateButton) {
        calculateButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "calculate_average"}, function(response) {
                    document.getElementById('result').innerText = response.average;

                    if(showStatsCheckbox.checked) {
                        document.body.classList.add('show-stats'); 
                    
                        let stats = document.getElementById('stats');
                        stats.innerHTML = '';
                        let numOfBars = 0;  
                    
                        for (let subject in response.averages) {
                            numOfBars++; 
                            let bar = document.createElement('div');
                            bar.className = 'bar';
                            bar.style.width = (response.averages[subject].average * 15) + 'px';  
                            bar.style.backgroundColor = getColorBasedOnAverage(response.averages[subject].average);  
                            let label = document.createElement('div');
                            label.className = 'label';
                            label.innerText = `${subject}: ${response.averages[subject].average}`;
                    
                            bar.appendChild(label);
                            stats.appendChild(bar);
                        }
                    
                        document.body.style.height = `${60 + numOfBars * 30 + 10}px`;
                    }
                    
                });
            });
        });
    }
});
