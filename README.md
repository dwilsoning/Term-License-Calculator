# Term License Revenue Recognition Calculator

A professional desktop application for calculating month-by-month revenue recognition schedules for multi-year software and maintenance contracts.

## Overview

This calculator implements complex revenue recognition logic for term license agreements, handling:
- **Ratable Service Revenue**: Combined maintenance and license values recognized monthly
- **Upfront Term License Revenue**: Full license value recognized at the start of each year
- **Monthly Reversals**: Prevents double-counting of license revenue
- **Net Revenue Calculation**: Accurate monthly revenue totals

## How to Use

### Opening the Application

1. Navigate to your Desktop
2. Open the `Term-License-Calculator` folder
3. Double-click `index.html` to open in your web browser

### Entering Contract Data

1. **Set Contract Duration**: Enter the total number of years (1-10)

2. **For Each Year, Provide:**
   - **Currency**: Select the currency used for contract values (USD, EUR, GBP, etc.)
   - **Exchange Rate** (if not USD): Enter the exchange rate to convert to USD
     - Format: 1 [Selected Currency] = ? USD
     - Example: For EUR at rate 1.10, enter 1.10 (meaning 1 EUR = 1.10 USD)
   - **Term License Value**: The license amount in the selected currency
   - **Maintenance Value**: The maintenance amount in the selected currency

**Example with Multiple Currencies:**
- Year 1 (USD): License = $43,086.04, Maintenance = $147,579.90
- Year 2 (EUR): License = €40,000.00, Maintenance = €138,000.00, Rate = 1.10
- Year 3 (GBP): License = £35,000.00, Maintenance = £120,000.00, Rate = 1.27

3. **Review Conversions**: The app will display USD equivalents as you enter values

4. **Calculate**: Click "Calculate Revenue Schedule" to generate the table

5. **Review Currency Summary**: Check the conversion summary table at the top of results

6. **Export**: Click "Export to CSV" to download the complete results with currency information

## Revenue Recognition Logic

### 1. Ratable Service Revenue (Maint + License)
- Formula: `(Annual License + Annual Maintenance) / 12`
- Recognized: Every month evenly throughout each year

### 2. Upfront Term License Revenue
- Formula: `Sum of ALL Term License Values for entire contract`
- Recognized: **Only in Month 1 of the entire contract** (not each year)
- Example: For a 3-year contract, all 3 years' license values are booked upfront in Month 1

### 3. Monthly Reversal of Upfront License
- Formula: `-(Total License Value / Total Contract Months)`
- Recognized: Every month throughout the **entire contract duration**
- Purpose: Amortizes the upfront license booking evenly over the full contract term
- Example: For a 3-year contract with total license value of $133,174.84, reversal is -$3,699.30 per month for all 36 months

### 4. Total Net Recognized Revenue
- Formula: `Ratable Service + Upfront License + Monthly Reversal`
- This represents the true monthly revenue recognition

## Understanding the Output Table

The generated table includes:

- **Monthly rows**: One row per month of the contract
- **Year headers**: Clearly marked sections for each year
- **Year subtotals**: Sum of all columns for each year
- **Grand total**: Overall totals across all years

### Example Calculation

For a 3-year contract with:
- Year 1: License = $43,086.04, Maintenance = $147,579.90
- Year 2: License = $44,378.62, Maintenance = $152,006.90
- Year 3: License = $45,710.18, Maintenance = $156,567.10
- **Total License Value = $133,174.84**
- **Monthly Reversal = -$3,699.30 (across all 36 months)**

**Month 1 (Year 1):**
- Ratable Service: ($43,086.04 + $147,579.90) / 12 = $15,888.83
- Upfront License: $133,174.84 (entire contract)
- Monthly Reversal: -$3,699.30
- **Total Net Revenue: $145,364.37**

**Months 2-12 (Year 1):**
- Ratable Service: $15,888.83
- Upfront License: $0.00
- Monthly Reversal: -$3,699.30
- **Total Net Revenue: $12,189.53**

**Months 13-24 (Year 2):**
- Ratable Service: ($44,378.62 + $152,006.90) / 12 = $16,365.46
- Upfront License: $0.00
- Monthly Reversal: -$3,699.30
- **Total Net Revenue: $12,666.16**

**Months 25-36 (Year 3):**
- Ratable Service: ($45,710.18 + $156,567.10) / 12 = $16,856.44
- Upfront License: $0.00
- Monthly Reversal: -$3,699.30
- **Total Net Revenue: $13,157.14**

## Features

- ✅ **Multi-Currency Support**: Enter contract values in 17+ currencies
- ✅ **Automatic USD Conversion**: All calculations displayed in USD
- ✅ **Real-Time Exchange Rate Conversion**: See USD equivalents as you type
- ✅ **Currency Summary Table**: Clear breakdown of all conversions
- ✅ **Dynamic Form Generation**: Adjusts based on contract years
- ✅ **Professional Table Formatting**: Year subtotals and grand totals
- ✅ **CSV Export**: Includes currency conversion details
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Print-Friendly Formatting**: Clean output for documentation
- ✅ **Clean, Modern Interface**: Professional appearance

### Supported Currencies

USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, MXN, BRL, ZAR, SGD, NZD, SEK, NOK, DKK

## Technical Details

- **Pure JavaScript**: No dependencies or frameworks required
- **Client-side only**: All calculations happen in your browser
- **No data transmission**: Your contract data stays on your computer
- **Cross-platform**: Works on Windows, Mac, and Linux

## Multi-Currency Usage Guide

### How Exchange Rates Work

The exchange rate field expects the conversion rate FROM your selected currency TO USD.

**Format**: 1 [Your Currency] = X USD

**Examples:**
- **EUR to USD** at rate 1.10: Enter `1.10` (1 EUR = 1.10 USD)
- **GBP to USD** at rate 1.27: Enter `1.27` (1 GBP = 1.27 USD)
- **JPY to USD** at rate 0.0067: Enter `0.0067` (1 JPY = 0.0067 USD)

### Finding Current Exchange Rates

You can find current exchange rates from:
- Your bank or financial institution
- Currency conversion websites (XE.com, Google Finance, etc.)
- Your company's finance department for official rates

### Best Practices

1. **Use Consistent Rates**: If using historical rates, ensure they match the contract date
2. **Document Your Rates**: Keep a record of exchange rates used for audit purposes
3. **Check Conversions**: Review the USD Equivalent display before calculating
4. **Export for Records**: Always export to CSV to maintain a permanent record

## Troubleshooting

**Issue**: Calculator button doesn't work
- **Solution**: Ensure all year values are filled in with valid numbers
- **Solution**: Check that exchange rates are entered for non-USD currencies

**Issue**: Exchange rate field not showing
- **Solution**: Make sure you've selected a currency other than USD

**Issue**: USD conversion looks wrong
- **Solution**: Verify your exchange rate is correct (1 XXX = ? USD format)
- **Solution**: Check that you haven't accidentally inverted the rate

**Issue**: Export doesn't download
- **Solution**: Check your browser's download settings and pop-up blocker

**Issue**: Table doesn't display properly
- **Solution**: Try using a modern browser (Chrome, Firefox, Edge, Safari)

## File Structure

```
Term-License-Calculator/
├── index.html          # Main application page
├── calculator.js       # Revenue calculation logic
├── styles.css          # Visual styling
└── README.md          # This file
```

## Support

For questions or issues with the calculation logic, please refer to the revenue recognition methodology outlined in this document.

## Version

Current Version: 2.0.0
Created: 2025-11-12
Updated: 2025-11-12
- v1.0.0: Initial release
- v1.1.0: Fixed reversal calculation to amortize over entire contract duration
- v2.0.0: Added multi-currency support with automatic USD conversion
