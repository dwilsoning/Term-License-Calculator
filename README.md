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
2. **Enter Annual Values**: For each year, provide:
   - **Term License Value**: The license amount for that year
   - **Maintenance Value**: The maintenance amount for that year

Example values:
- Year 1: License = $43,086.04, Maintenance = $147,579.90
- Year 2: License = $44,378.62, Maintenance = $152,006.90
- Year 3: License = $45,710.18, Maintenance = $156,567.10

3. **Calculate**: Click "Calculate Revenue Schedule" to generate the table
4. **Export**: Click "Export to CSV" to download the results

## Revenue Recognition Logic

### 1. Ratable Service Revenue (Maint + License)
- Formula: `(Annual License + Annual Maintenance) / 12`
- Recognized: Every month evenly throughout the year

### 2. Upfront Term License Revenue
- Formula: `Annual License Value`
- Recognized: Only in Month 1, 13, 25, etc. (first month of each year)

### 3. Monthly Reversal of Upfront License
- Formula: `-(Annual License Value / 12)`
- Recognized: Every month as a negative amount (reversal)
- Purpose: Prevents double-counting the license revenue

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

For Year 1 with License = $43,086.04 and Maintenance = $147,579.90:

**Month 1:**
- Ratable Service: ($43,086.04 + $147,579.90) / 12 = $15,888.83
- Upfront License: $43,086.04
- Monthly Reversal: -$3,590.50
- **Total Net Revenue: $55,384.37**

**Months 2-12:**
- Ratable Service: $15,888.83
- Upfront License: $0.00
- Monthly Reversal: -$3,590.50
- **Total Net Revenue: $12,298.33**

## Features

- ✅ Dynamic form generation based on contract years
- ✅ Real-time calculation and validation
- ✅ Professional table formatting with subtotals
- ✅ CSV export functionality
- ✅ Responsive design (works on tablets and mobile)
- ✅ Print-friendly formatting
- ✅ Clean, modern interface

## Technical Details

- **Pure JavaScript**: No dependencies or frameworks required
- **Client-side only**: All calculations happen in your browser
- **No data transmission**: Your contract data stays on your computer
- **Cross-platform**: Works on Windows, Mac, and Linux

## Troubleshooting

**Issue**: Calculator button doesn't work
- **Solution**: Ensure all year values are filled in with valid numbers

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

Current Version: 1.0.0
Created: 2025-11-12
