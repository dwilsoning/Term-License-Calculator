// Term License Revenue Calculator
// Handles complex revenue recognition for multi-year software contracts

class RevenueCalculator {
    constructor() {
        this.contractData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateYearInputs(3); // Default 3 years
    }

    setupEventListeners() {
        document.getElementById('contractYears').addEventListener('change', (e) => {
            this.generateYearInputs(parseInt(e.target.value));
        });

        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculate();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });
    }

    generateYearInputs(years) {
        const container = document.getElementById('yearInputs');
        container.innerHTML = '';

        for (let i = 1; i <= years; i++) {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'year-input-group';
            yearDiv.innerHTML = `
                <h3>Year ${i}</h3>
                <div class="input-row">
                    <div class="form-group">
                        <label for="currency-${i}">Currency:</label>
                        <select id="currency-${i}" class="currency-select">
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="MXN">MXN - Mexican Peso</option>
                            <option value="BRL">BRL - Brazilian Real</option>
                            <option value="ZAR">ZAR - South African Rand</option>
                            <option value="SGD">SGD - Singapore Dollar</option>
                            <option value="NZD">NZD - New Zealand Dollar</option>
                            <option value="SEK">SEK - Swedish Krona</option>
                            <option value="NOK">NOK - Norwegian Krone</option>
                            <option value="DKK">DKK - Danish Krone</option>
                        </select>
                    </div>
                    <div class="form-group" id="exchange-rate-group-${i}" style="display: none;">
                        <label for="exchange-rate-${i}">Exchange Rate to USD:</label>
                        <input type="number" id="exchange-rate-${i}" step="0.000001" min="0" placeholder="1.0">
                        <small>1 <span id="currency-code-${i}">XXX</span> = ? USD</small>
                    </div>
                </div>
                <div class="input-row">
                    <div class="form-group">
                        <label for="license-${i}">Term License Value:</label>
                        <input type="number" id="license-${i}" step="0.01" min="0" placeholder="43086.04" required>
                    </div>
                    <div class="form-group">
                        <label for="maintenance-${i}">Maintenance Value:</label>
                        <input type="number" id="maintenance-${i}" step="0.01" min="0" placeholder="147579.90" required>
                    </div>
                </div>
                <div class="converted-values" id="converted-${i}" style="display: none;">
                    <p><strong>USD Equivalent:</strong> License: <span id="license-usd-${i}">$0.00</span> | Maintenance: <span id="maintenance-usd-${i}">$0.00</span></p>
                </div>
            `;
            container.appendChild(yearDiv);

            // Add event listeners for currency changes
            this.setupCurrencyListeners(i);
        }
    }

    setupCurrencyListeners(yearIndex) {
        const currencySelect = document.getElementById(`currency-${yearIndex}`);
        const exchangeRateGroup = document.getElementById(`exchange-rate-group-${yearIndex}`);
        const exchangeRateInput = document.getElementById(`exchange-rate-${yearIndex}`);
        const currencyCodeSpan = document.getElementById(`currency-code-${yearIndex}`);
        const licenseInput = document.getElementById(`license-${yearIndex}`);
        const maintenanceInput = document.getElementById(`maintenance-${yearIndex}`);
        const convertedDiv = document.getElementById(`converted-${yearIndex}`);
        const licenseUsdSpan = document.getElementById(`license-usd-${yearIndex}`);
        const maintenanceUsdSpan = document.getElementById(`maintenance-usd-${yearIndex}`);

        const updateConversion = () => {
            const currency = currencySelect.value;
            const isUSD = currency === 'USD';

            exchangeRateGroup.style.display = isUSD ? 'none' : 'block';
            currencyCodeSpan.textContent = currency;

            if (!isUSD) {
                const rate = parseFloat(exchangeRateInput.value) || 0;
                const license = parseFloat(licenseInput.value) || 0;
                const maintenance = parseFloat(maintenanceInput.value) || 0;

                if (rate > 0 && (license > 0 || maintenance > 0)) {
                    convertedDiv.style.display = 'block';
                    licenseUsdSpan.textContent = this.formatCurrency(license * rate);
                    maintenanceUsdSpan.textContent = this.formatCurrency(maintenance * rate);
                } else {
                    convertedDiv.style.display = 'none';
                }
            } else {
                convertedDiv.style.display = 'none';
            }
        };

        currencySelect.addEventListener('change', updateConversion);
        exchangeRateInput.addEventListener('input', updateConversion);
        licenseInput.addEventListener('input', updateConversion);
        maintenanceInput.addEventListener('input', updateConversion);
    }

    collectInputData() {
        const years = parseInt(document.getElementById('contractYears').value);
        const data = [];

        for (let i = 1; i <= years; i++) {
            const currency = document.getElementById(`currency-${i}`).value;
            const license = parseFloat(document.getElementById(`license-${i}`).value);
            const maintenance = parseFloat(document.getElementById(`maintenance-${i}`).value);

            if (isNaN(license) || isNaN(maintenance)) {
                alert(`Please enter valid values for Year ${i}`);
                return null;
            }

            let exchangeRate = 1.0; // Default for USD
            let licenseUSD = license;
            let maintenanceUSD = maintenance;

            if (currency !== 'USD') {
                exchangeRate = parseFloat(document.getElementById(`exchange-rate-${i}`).value);

                if (isNaN(exchangeRate) || exchangeRate <= 0) {
                    alert(`Please enter a valid exchange rate for Year ${i} (${currency} to USD)`);
                    return null;
                }

                licenseUSD = license * exchangeRate;
                maintenanceUSD = maintenance * exchangeRate;
            }

            data.push({
                year: i,
                currency: currency,
                exchangeRate: exchangeRate,
                licenseOriginal: license,
                maintenanceOriginal: maintenance,
                license: licenseUSD,
                maintenance: maintenanceUSD
            });
        }

        return data;
    }

    calculate() {
        const data = this.collectInputData();
        if (!data) return;

        this.contractData = data;
        const schedule = this.generateRevenueSchedule(data);
        this.displayResults(schedule);
    }

    generateRevenueSchedule(contractData) {
        const schedule = [];
        let monthCounter = 1;

        // Calculate total contract months and total license value upfront
        const totalMonths = contractData.length * 12;
        const totalLicenseValue = contractData.reduce((sum, year) => sum + year.license, 0);

        // Calculate monthly reversal across entire contract duration
        const monthlyReversal = -(totalLicenseValue / totalMonths);

        contractData.forEach(yearData => {
            const { year, license, maintenance } = yearData;

            // Calculate monthly ratable service revenue (Maintenance + License) / 12
            const monthlyRatableRevenue = (license + maintenance) / 12;

            for (let month = 1; month <= 12; month++) {
                const isFirstMonthOfContract = monthCounter === 1;

                // Upfront license revenue only in first month of entire contract
                const upfrontLicense = isFirstMonthOfContract ? totalLicenseValue : 0;

                // Calculate total net recognized revenue
                const totalNetRevenue = monthlyRatableRevenue + upfrontLicense + monthlyReversal;

                schedule.push({
                    month: monthCounter,
                    year: year,
                    monthInYear: month,
                    ratableServiceRevenue: monthlyRatableRevenue,
                    upfrontLicense: upfrontLicense,
                    monthlyReversal: monthlyReversal,
                    totalNetRevenue: totalNetRevenue
                });

                monthCounter++;
            }
        });

        return schedule;
    }

    displayResults(schedule) {
        const resultsSection = document.getElementById('resultsSection');
        const tableContainer = document.getElementById('tableContainer');

        // Add currency summary section
        let html = '<div class="currency-summary">';
        html += '<h3>Currency Conversion Summary</h3>';
        html += '<table class="summary-table"><thead><tr><th>Year</th><th>Currency</th><th>License (Original)</th><th>Maintenance (Original)</th><th>Exchange Rate</th><th>License (USD)</th><th>Maintenance (USD)</th></tr></thead><tbody>';

        this.contractData.forEach(yearData => {
            const currencySymbol = yearData.currency === 'USD' ? '$' : '';
            html += `
                <tr>
                    <td>Year ${yearData.year}</td>
                    <td><strong>${yearData.currency}</strong></td>
                    <td>${this.formatValue(yearData.licenseOriginal, yearData.currency)}</td>
                    <td>${this.formatValue(yearData.maintenanceOriginal, yearData.currency)}</td>
                    <td>${yearData.currency === 'USD' ? 'N/A' : yearData.exchangeRate.toFixed(6)}</td>
                    <td>${this.formatCurrency(yearData.license)}</td>
                    <td>${this.formatCurrency(yearData.maintenance)}</td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';

        html += '<table class="revenue-table">';

        // Table header
        html += `
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Ratable Service Revenue<br>(Maint + License)<br><span class="currency-label">USD</span></th>
                    <th>Upfront Term License<br>Revenue<br><span class="currency-label">USD</span></th>
                    <th>Monthly Reversal of<br>Upfront License<br><span class="currency-label">USD</span></th>
                    <th>Total Net Recognized<br>Revenue<br><span class="currency-label">USD</span></th>
                </tr>
            </thead>
            <tbody>
        `;

        // Track totals for each year and overall
        let currentYear = 0;
        let yearTotals = {
            ratable: 0,
            upfront: 0,
            reversal: 0,
            total: 0
        };

        let grandTotals = {
            ratable: 0,
            upfront: 0,
            reversal: 0,
            total: 0
        };

        schedule.forEach((row, index) => {
            // Add year header
            if (row.year !== currentYear) {
                // Add subtotal for previous year
                if (currentYear > 0) {
                    html += `
                        <tr class="subtotal-row">
                            <td><strong>Year ${currentYear} Subtotal</strong></td>
                            <td>${this.formatCurrency(yearTotals.ratable)}</td>
                            <td>${this.formatCurrency(yearTotals.upfront)}</td>
                            <td>${this.formatCurrency(yearTotals.reversal)}</td>
                            <td>${this.formatCurrency(yearTotals.total)}</td>
                        </tr>
                    `;
                }

                // Reset year totals
                yearTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };
                currentYear = row.year;

                html += `
                    <tr class="year-header">
                        <td colspan="5"><strong>Year ${row.year}</strong></td>
                    </tr>
                `;
            }

            // Add data row
            html += `
                <tr>
                    <td>Month ${row.month}</td>
                    <td>${this.formatCurrency(row.ratableServiceRevenue)}</td>
                    <td>${this.formatCurrency(row.upfrontLicense)}</td>
                    <td class="negative">${this.formatCurrency(row.monthlyReversal)}</td>
                    <td class="total-cell">${this.formatCurrency(row.totalNetRevenue)}</td>
                </tr>
            `;

            // Accumulate totals
            yearTotals.ratable += row.ratableServiceRevenue;
            yearTotals.upfront += row.upfrontLicense;
            yearTotals.reversal += row.monthlyReversal;
            yearTotals.total += row.totalNetRevenue;

            grandTotals.ratable += row.ratableServiceRevenue;
            grandTotals.upfront += row.upfrontLicense;
            grandTotals.reversal += row.monthlyReversal;
            grandTotals.total += row.totalNetRevenue;
        });

        // Add final year subtotal
        html += `
            <tr class="subtotal-row">
                <td><strong>Year ${currentYear} Subtotal</strong></td>
                <td>${this.formatCurrency(yearTotals.ratable)}</td>
                <td>${this.formatCurrency(yearTotals.upfront)}</td>
                <td>${this.formatCurrency(yearTotals.reversal)}</td>
                <td>${this.formatCurrency(yearTotals.total)}</td>
            </tr>
        `;

        // Add grand total
        html += `
            <tr class="grand-total-row">
                <td><strong>Total</strong></td>
                <td>${this.formatCurrency(grandTotals.ratable)}</td>
                <td>${this.formatCurrency(grandTotals.upfront)}</td>
                <td>${this.formatCurrency(grandTotals.reversal)}</td>
                <td>${this.formatCurrency(grandTotals.total)}</td>
            </tr>
        `;

        html += '</tbody></table>';

        tableContainer.innerHTML = html;
        resultsSection.style.display = 'block';

        // Setup export functionality
        this.setupExport(schedule);

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatValue(value, currency) {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        } catch (e) {
            // Fallback if currency formatting fails
            return `${value.toFixed(2)} ${currency}`;
        }
    }

    setupExport(schedule) {
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.onclick = () => this.exportToCSV(schedule);
    }

    exportToCSV(schedule) {
        // Add currency summary header
        let csv = 'Term License Revenue Recognition Schedule - All values in USD\n\n';
        csv += 'Currency Conversion Summary\n';
        csv += 'Year,Currency,License (Original),Maintenance (Original),Exchange Rate,License (USD),Maintenance (USD)\n';

        this.contractData.forEach(yearData => {
            csv += `Year ${yearData.year},${yearData.currency},${yearData.licenseOriginal.toFixed(2)},${yearData.maintenanceOriginal.toFixed(2)},${yearData.currency === 'USD' ? 'N/A' : yearData.exchangeRate.toFixed(6)},${yearData.license.toFixed(2)},${yearData.maintenance.toFixed(2)}\n`;
        });

        csv += '\n\nRevenue Recognition Schedule (USD)\n';
        csv += 'Month,Ratable Service Revenue (Maint + License),Upfront Term License Revenue,Monthly Reversal of Upfront License,Total Net Recognized Revenue\n';

        let currentYear = 0;
        let yearTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };
        let grandTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };

        schedule.forEach((row) => {
            if (row.year !== currentYear) {
                if (currentYear > 0) {
                    csv += `Year ${currentYear} Subtotal,${yearTotals.ratable.toFixed(2)},${yearTotals.upfront.toFixed(2)},${yearTotals.reversal.toFixed(2)},${yearTotals.total.toFixed(2)}\n`;
                }
                yearTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };
                currentYear = row.year;
                csv += `\nYear ${row.year}\n`;
            }

            csv += `Month ${row.month},${row.ratableServiceRevenue.toFixed(2)},${row.upfrontLicense.toFixed(2)},${row.monthlyReversal.toFixed(2)},${row.totalNetRevenue.toFixed(2)}\n`;

            yearTotals.ratable += row.ratableServiceRevenue;
            yearTotals.upfront += row.upfrontLicense;
            yearTotals.reversal += row.monthlyReversal;
            yearTotals.total += row.totalNetRevenue;

            grandTotals.ratable += row.ratableServiceRevenue;
            grandTotals.upfront += row.upfrontLicense;
            grandTotals.reversal += row.monthlyReversal;
            grandTotals.total += row.totalNetRevenue;
        });

        csv += `Year ${currentYear} Subtotal,${yearTotals.ratable.toFixed(2)},${yearTotals.upfront.toFixed(2)},${yearTotals.reversal.toFixed(2)},${yearTotals.total.toFixed(2)}\n`;
        csv += `\nTotal,${grandTotals.ratable.toFixed(2)},${grandTotals.upfront.toFixed(2)},${grandTotals.reversal.toFixed(2)},${grandTotals.total.toFixed(2)}\n`;

        // Create download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-recognition-schedule-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    clearForm() {
        const years = parseInt(document.getElementById('contractYears').value);
        for (let i = 1; i <= years; i++) {
            document.getElementById(`license-${i}`).value = '';
            document.getElementById(`maintenance-${i}`).value = '';
        }
        document.getElementById('resultsSection').style.display = 'none';
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RevenueCalculator();
});
