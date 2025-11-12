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
                        <label for="license-${i}">Term License Value ($):</label>
                        <input type="number" id="license-${i}" step="0.01" min="0" placeholder="43086.04" required>
                    </div>
                    <div class="form-group">
                        <label for="maintenance-${i}">Maintenance Value ($):</label>
                        <input type="number" id="maintenance-${i}" step="0.01" min="0" placeholder="147579.90" required>
                    </div>
                </div>
            `;
            container.appendChild(yearDiv);
        }
    }

    collectInputData() {
        const years = parseInt(document.getElementById('contractYears').value);
        const data = [];

        for (let i = 1; i <= years; i++) {
            const license = parseFloat(document.getElementById(`license-${i}`).value);
            const maintenance = parseFloat(document.getElementById(`maintenance-${i}`).value);

            if (isNaN(license) || isNaN(maintenance)) {
                alert(`Please enter valid values for Year ${i}`);
                return null;
            }

            data.push({
                year: i,
                license: license,
                maintenance: maintenance
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

        let html = '<table class="revenue-table">';

        // Table header
        html += `
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Ratable Service Revenue<br>(Maint + License)</th>
                    <th>Upfront Term License<br>Revenue</th>
                    <th>Monthly Reversal of<br>Upfront License</th>
                    <th>Total Net Recognized<br>Revenue</th>
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

    setupExport(schedule) {
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.onclick = () => this.exportToCSV(schedule);
    }

    exportToCSV(schedule) {
        let csv = 'Month,Ratable Service Revenue (Maint + License),Upfront Term License Revenue,Monthly Reversal of Upfront License,Total Net Recognized Revenue\n';

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
