// Term License Revenue Calculator
// Handles complex revenue recognition for multi-year software contracts

class RevenueCalculator {
    constructor() {
        this.contractData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupGlobalCurrencyListeners();
        // Don't generate year inputs until user enters a value
    }

    setupEventListeners() {
        const yearsInput = document.getElementById('contractYears');

        yearsInput.addEventListener('input', (e) => {
            const years = parseInt(e.target.value);
            if (years && years >= 1 && years <= 10) {
                this.generateYearInputs(years);
            } else if (!e.target.value) {
                document.getElementById('yearInputs').innerHTML = '';
            }
        });

        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculate();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });
    }

    setupGlobalCurrencyListeners() {
        const currencySelect = document.getElementById('contractCurrency');
        const exchangeRateGroup = document.getElementById('exchangeRateGroup');
        const exchangeRateInput = document.getElementById('exchangeRate');
        const currencyCodeSpan = document.getElementById('currencyCode');

        currencySelect.addEventListener('change', () => {
            const currency = currencySelect.value;
            const isUSD = currency === 'USD';

            exchangeRateGroup.style.display = isUSD ? 'none' : 'block';
            currencyCodeSpan.textContent = currency;
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
                        <label for="license-${i}">Term License Value:</label>
                        <input type="text" id="license-${i}" class="integer-input" placeholder="e.g., 43,086" required>
                    </div>
                    <div class="form-group">
                        <label for="maintenance-${i}">Maintenance Value:</label>
                        <input type="text" id="maintenance-${i}" class="integer-input" placeholder="e.g., 147,580" required>
                    </div>
                </div>
            `;
            container.appendChild(yearDiv);

            // Add formatting listeners for integer inputs
            this.setupIntegerFormatting(i);
        }
    }

    setupIntegerFormatting(yearIndex) {
        const licenseInput = document.getElementById(`license-${yearIndex}`);
        const maintenanceInput = document.getElementById(`maintenance-${yearIndex}`);

        const formatInteger = (input) => {
            let value = input.value.replace(/[^\d]/g, ''); // Remove non-digits
            if (value) {
                input.value = parseInt(value).toLocaleString('en-US');
            }
        };

        licenseInput.addEventListener('blur', () => formatInteger(licenseInput));
        maintenanceInput.addEventListener('blur', () => formatInteger(maintenanceInput));
    }

    collectInputData() {
        const years = parseInt(document.getElementById('contractYears').value);
        const currency = document.getElementById('contractCurrency').value;
        const data = [];

        // Get exchange rate once for all years
        let exchangeRate = 1.0; // Default for USD
        if (currency !== 'USD') {
            exchangeRate = parseFloat(document.getElementById('exchangeRate').value);

            if (isNaN(exchangeRate) || exchangeRate <= 0) {
                alert(`Please enter a valid exchange rate (${currency} to USD)`);
                return null;
            }
        }

        for (let i = 1; i <= years; i++) {
            const licenseStr = document.getElementById(`license-${i}`).value.replace(/,/g, '');
            const maintenanceStr = document.getElementById(`maintenance-${i}`).value.replace(/,/g, '');

            const license = parseInt(licenseStr);
            const maintenance = parseInt(maintenanceStr);

            if (isNaN(license) || isNaN(maintenance)) {
                alert(`Please enter valid values for Year ${i}`);
                return null;
            }

            const licenseUSD = Math.round(license * exchangeRate);
            const maintenanceUSD = Math.round(maintenance * exchangeRate);

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

                // Add column headers for Year 2 onwards (Year 1 already has headers at top)
                if (row.year > 1) {
                    html += `
                        <tr class="year-column-header">
                            <td>Month</td>
                            <td>Ratable Service Revenue (Maint + License)</td>
                            <td>Upfront Term License Revenue</td>
                            <td>Monthly Reversal of Upfront License</td>
                            <td>Total Net Recognized Revenue</td>
                        </tr>
                    `;
                }
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
        const rounded = Math.round(value);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(rounded);
    }

    formatValue(value, currency) {
        const rounded = Math.round(value);
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(rounded);
        } catch (e) {
            // Fallback if currency formatting fails
            return `${rounded.toLocaleString('en-US')} ${currency}`;
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
            csv += `Year ${yearData.year},${yearData.currency},${Math.round(yearData.licenseOriginal).toLocaleString('en-US')},${Math.round(yearData.maintenanceOriginal).toLocaleString('en-US')},${yearData.currency === 'USD' ? 'N/A' : yearData.exchangeRate.toFixed(6)},${Math.round(yearData.license).toLocaleString('en-US')},${Math.round(yearData.maintenance).toLocaleString('en-US')}\n`;
        });

        csv += '\n\nRevenue Recognition Schedule (USD)\n';
        csv += 'Month,Ratable Service Revenue (Maint + License),Upfront Term License Revenue,Monthly Reversal of Upfront License,Total Net Recognized Revenue\n';

        let currentYear = 0;
        let yearTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };
        let grandTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };

        schedule.forEach((row) => {
            if (row.year !== currentYear) {
                if (currentYear > 0) {
                    csv += `Year ${currentYear} Subtotal,${Math.round(yearTotals.ratable).toLocaleString('en-US')},${Math.round(yearTotals.upfront).toLocaleString('en-US')},${Math.round(yearTotals.reversal).toLocaleString('en-US')},${Math.round(yearTotals.total).toLocaleString('en-US')}\n`;
                }
                yearTotals = { ratable: 0, upfront: 0, reversal: 0, total: 0 };
                currentYear = row.year;
                csv += `\nYear ${row.year}\n`;
            }

            csv += `Month ${row.month},${Math.round(row.ratableServiceRevenue).toLocaleString('en-US')},${Math.round(row.upfrontLicense).toLocaleString('en-US')},${Math.round(row.monthlyReversal).toLocaleString('en-US')},${Math.round(row.totalNetRevenue).toLocaleString('en-US')}\n`;

            yearTotals.ratable += row.ratableServiceRevenue;
            yearTotals.upfront += row.upfrontLicense;
            yearTotals.reversal += row.monthlyReversal;
            yearTotals.total += row.totalNetRevenue;

            grandTotals.ratable += row.ratableServiceRevenue;
            grandTotals.upfront += row.upfrontLicense;
            grandTotals.reversal += row.monthlyReversal;
            grandTotals.total += row.totalNetRevenue;
        });

        csv += `Year ${currentYear} Subtotal,${Math.round(yearTotals.ratable).toLocaleString('en-US')},${Math.round(yearTotals.upfront).toLocaleString('en-US')},${Math.round(yearTotals.reversal).toLocaleString('en-US')},${Math.round(yearTotals.total).toLocaleString('en-US')}\n`;
        csv += `\nTotal,${Math.round(grandTotals.ratable).toLocaleString('en-US')},${Math.round(grandTotals.upfront).toLocaleString('en-US')},${Math.round(grandTotals.reversal).toLocaleString('en-US')},${Math.round(grandTotals.total).toLocaleString('en-US')}\n`;

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
