const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertButton = document.getElementById('convert-button');
const resultDiv = document.getElementById('result');
const swapButton = document.getElementById('swap-button');
const themeToggleButton = document.getElementById('theme-toggle');
const lightIcon = document.querySelector('.theme-icon-light');
const darkIcon = document.querySelector('.theme-icon-dark');
const timeRangeButtons = document.querySelectorAll('.time-range-btn');

let historyChart;
let currentDays = 7; // Default to 7 days


const API_URL_LIST = 'https://economia.awesomeapi.com.br/json/available/uniq';

// Fetch available currencies and populate dropdowns
async function populateCurrencies() {
    try {
        const response = await fetch(API_URL_LIST);
        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de moedas.');
        }
        const currencies = await response.json();

        // Filter out non-string keys which might be returned by the API
        const validCurrencies = Object.keys(currencies).filter(key => typeof currencies[key] === 'string');

        validCurrencies.forEach(code => {
            const name = currencies[code];
            const option1 = document.createElement('option');
            option1.value = code;
            option1.textContent = `${code} - ${name}`;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = code;
            option2.textContent = `${code} - ${name}`;
            toCurrencySelect.appendChild(option2);
        });

        // Set default values
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'BRL';
        convertCurrency(); // Initial conversion

    } catch (error) {
        resultDiv.textContent = `Erro: ${error.message}`;
        console.error(error);
    }
}

// Fetch exchange rate and calculate result, then update chart
async function convertCurrency() {
    await updateConversionOnly();
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
        fetchHistory(fromCurrency, toCurrency);
    }
}

// Update only the conversion result without fetching chart history
async function updateConversionOnly() {
    const amount = amountInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const lastUpdateDiv = document.getElementById('last-update');

    if (!amount || amount <= 0) {
        resultDiv.textContent = 'Por favor, insira um valor válido.';
        lastUpdateDiv.textContent = '';
        return;
    }

    if (fromCurrency === toCurrency) {
        resultDiv.textContent = `1 ${fromCurrency} = 1 ${toCurrency}. O valor é o mesmo.`;
        if (historyChart) historyChart.destroy(); // Clear chart
        lastUpdateDiv.textContent = '';
        return;
    }

    resultDiv.textContent = 'Convertendo...';
    lastUpdateDiv.textContent = '';


    try {
        const conversion = `${fromCurrency}-${toCurrency}`;
        const API_URL_RATE = `https://economia.awesomeapi.com.br/json/last/${conversion}`;

        const response = await fetch(API_URL_RATE);
        if (!response.ok) {
            throw new Error('A conversão selecionada não é suportada pela API.');
        }
        const data = await response.json();

        const rateKey = `${fromCurrency}${toCurrency}`;
        const rateInfo = data[rateKey];

        if (!rateInfo) {
            throw new Error('Não foi possível obter a taxa de câmbio. Verifique as moedas selecionadas.');
        }

        const exchangeRate = parseFloat(rateInfo.bid);
        const convertedAmount = (amount * exchangeRate).toFixed(2);

        const fromName = rateInfo.name.split('/')[0];
        const toName = rateInfo.name.split('/')[1];

        resultDiv.innerHTML = `
            <strong>${amount} ${fromName} (${fromCurrency})</strong> é igual a 
            <strong>${convertedAmount} ${toName} (${toCurrency})</strong>
            <br>
            <small>Taxa: 1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}</small>
        `;

        // Format and display last update time
        const updateDate = new Date(rateInfo.create_date);
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(updateDate);
        lastUpdateDiv.textContent = `Última atualização: ${formattedDate}`;


    } catch (error) {
        resultDiv.textContent = `Erro na conversão: ${error.message}`;
        if (historyChart) historyChart.destroy(); // Clear chart on error
        console.error(error);
    }
}

// Fetch historical data for the chart
async function fetchHistory(from, to) {
    const chartContainer = document.querySelector('.chart-container');
    // Adiciona classe de animação
    chartContainer.classList.add('animating');
    setTimeout(() => {
        chartContainer.innerHTML = '<canvas id="history-chart"></canvas>';
    }, 200);
    try {
        const conversion = `${from}-${to}`;
        // Fetch data for the selected time range
        const API_URL_HISTORY = `https://economia.awesomeapi.com.br/json/daily/${conversion}/${currentDays}`;

        const response = await fetch(API_URL_HISTORY);
        if (!response.ok) {
            throw new Error('Não foi possível carregar o histórico de cotações.');
        }
        const historyData = await response.json();

        if (historyData.status === 404 || historyData.length === 0) {
            throw new Error('Histórico não disponível para esta combinação de moedas.');
        }

        setTimeout(() => {
            renderChart(historyData, from, to);
            chartContainer.classList.remove('animating');
        }, 250);

    } catch (error) {
        setTimeout(() => {
            chartContainer.innerHTML = `<p style=\"color: var(--text-secondary); text-align: center;\">${error.message}</p>`;
            chartContainer.classList.remove('animating');
        }, 250);
        if (historyChart) {
            historyChart.destroy();
            historyChart = null;
        }
        console.error('Chart Error:', error.message);
    }
}

// Render the historical data chart
function renderChart(data, from, to) {
    const chartContainer = document.querySelector('.chart-container');
    // Clear previous error messages or canvas
    chartContainer.innerHTML = '<canvas id="history-chart"></canvas>';
    const ctx = document.getElementById('history-chart').getContext('2d');

    const labels = data.map(item => {
        const date = new Date(item.timestamp * 1000);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }).reverse();

    const chartData = data.map(item => parseFloat(item.bid)).reverse();

    if (historyChart) {
        historyChart.destroy();
    }

    const computedStyle = getComputedStyle(document.documentElement);
    const primaryAccent = computedStyle.getPropertyValue('--primary-accent').trim();
    const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
    const textSecondary = computedStyle.getPropertyValue('--text-secondary').trim();
    const borderColor = computedStyle.getPropertyValue('--border-color').trim();

    historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Cotação ${from} para ${to}`,
                data: chartData,
                borderColor: primaryAccent,
                backgroundColor: `color-mix(in srgb, ${primaryAccent} 20%, transparent)`,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: textSecondary
                    },
                    grid: {
                        color: borderColor
                    }
                },
                y: {
                    ticks: {
                        color: textSecondary
                    },
                    grid: {
                        color: borderColor
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textPrimary
                    }
                }
            }
        }
    });
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency(); // Re-convert after swapping
}


// --- THEME TOGGLE LOGIC ---
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    }
    localStorage.setItem('theme', theme);

    // Update chart colors if it exists
    if (historyChart) {
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryAccent = computedStyle.getPropertyValue('--primary-accent').trim();
        const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
        const textSecondary = computedStyle.getPropertyValue('--text-secondary').trim();
        const borderColor = computedStyle.getPropertyValue('--border-color').trim();

        historyChart.data.datasets[0].borderColor = primaryAccent;
        historyChart.data.datasets[0].backgroundColor = `color-mix(in srgb, ${primaryAccent} 20%, transparent)`;
        historyChart.options.scales.x.ticks.color = textSecondary;
        historyChart.options.scales.x.grid.color = borderColor;
        historyChart.options.scales.y.ticks.color = textSecondary;
        historyChart.options.scales.y.grid.color = borderColor;
        historyChart.options.plugins.legend.labels.color = textPrimary;

        historyChart.update();
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Check for saved theme on load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Optional: Check user's system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}
// --- END THEME TOGGLE LOGIC ---


// --- CHART TIME RANGE LOGIC ---
function handleTimeRangeChange(event) {
    const selectedButton = event.target;
    currentDays = selectedButton.dataset.days;

    // Update active button style
    timeRangeButtons.forEach(button => {
        button.classList.remove('active');
    });
    selectedButton.classList.add('active');

    // Refetch history with the new time range
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    if (fromCurrency && toCurrency) {
        fetchHistory(fromCurrency, toCurrency);
    }
}
// --- END CHART TIME RANGE LOGIC ---


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    populateCurrencies();
});
convertButton.addEventListener('click', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);
themeToggleButton.addEventListener('click', toggleTheme);
amountInput.addEventListener('input', (e) => {
    if (e.target.value.length >= 20) {
        e.target.value = e.target.value.slice(0, 20);
        return;
    }
    updateConversionOnly();
});
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);
timeRangeButtons.forEach(button => {
    button.addEventListener('click', handleTimeRangeChange);
});