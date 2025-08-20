# Habitus Health ROI Calculator v2.0

A dual-mode DSE (Display Screen Equipment) ROI calculator for Habitus Health, designed for both telesales and commercial managers.

## 🚀 Features

### Dual Modes
- **Quick Mode**: 5-6 essential inputs for fast ROI estimates (SME/Telesales focused)
- **Advanced Mode**: All inputs visible for detailed business cases (Corporate focused)

### Key Features
- ✅ Real-time calculations with live updates
- ✅ Sector-based defaults with industry-specific data
- ✅ Editable inputs with "Industry Default" vs "Custom Input" indicators
- ✅ Professional PDF export with client branding
- ✅ Responsive design for all devices
- ✅ WCAG AA compliant accessibility
- ✅ Tooltips with explanations and sources
- ✅ ROI capping (500% in Quick mode only)
- ✅ Multiple currency support (EUR, GBP, USD)

### Input Fields
- Number of DSE users
- Sector selection (Technology, Healthcare, Education, Manufacturing, Financial Services, Retail, Public Sector)
- Employee and admin salaries
- Administrative time metrics
- Health impact parameters (discomfort rate, absence days, presenteeism)
- Assessor cost options
- Currency selection

### Outputs
- Annual Habitus cost
- Total annual savings
- ROI percentage
- Payback period
- Detailed savings breakdown (Advanced mode)
- Before/After comparison tables
- Professional PDF reports

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: @react-pdf/renderer
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habitus-roi-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Application header
│   ├── ModeToggle.jsx  # Quick/Advanced mode switcher
│   ├── QuickMode.jsx   # Quick mode input form
│   ├── AdvancedMode.jsx # Advanced mode input form
│   ├── InputField.jsx  # Reusable input component
│   ├── Results.jsx     # Results display
│   └── PDFExport.jsx   # PDF generation modal
├── config/             # Configuration files
│   └── calculatorConfig.js # Sector defaults, pricing, tooltips
├── utils/              # Utility functions
│   └── calculations.js # ROI calculation engine
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🔧 Configuration

### Sector Defaults
Edit `src/config/calculatorConfig.js` to modify:
- Sector-specific salary ranges
- Health statistics by industry
- Pricing tiers
- Tooltips and sources
- Currency options

### Calculation Constants
Working assumptions are defined in the config:
- 48 weeks/year
- 220 working days/year
- 1,680 working hours/year
- 8 mins/user/year for Habitus admin time

## 📊 Calculation Logic

The ROI calculator uses the following formulas:

### Admin Savings
```
admin_hours_saved = (users × assessments × manual_mins - users × assessments × 8) / 60
admin_saving = admin_hours_saved × hourly_admin_cost
```

### Health Savings
```
absence_saving = affected_users × absence_days × day_cost × 0.25
presenteeism_saving = affected_users × presenteeism_hours × 48 × 0.25 × hourly_employee_cost
```

### ROI Calculation
```
total_saving = admin_saving + absence_saving + presenteeism_saving
net_benefit = total_saving - license_cost - assessor_costs
roi_pct = (net_benefit / license_cost) × 100
payback_months = license_cost / (total_saving / 12)
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for color schemes
- Update `src/index.css` for custom component styles
- Brand colors are defined in the Tailwind config

### PDF Export
- Customize PDF layout in `src/components/PDFExport.jsx`
- Modify styles, sections, and branding
- Add company logo and contact information

## 🚀 Usage

### Quick Mode
1. Select number of DSE users
2. Choose your sector
3. Adjust salary inputs if needed
4. View instant ROI results
5. Use for fast demos and estimates

### Advanced Mode
1. Fill in all detailed inputs
2. Toggle assessor cost options
3. View comprehensive breakdown
4. Export professional PDF report
5. Use for business cases and proposals

## 📱 Responsive Design

The calculator is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Clear focus indicators

## 🔒 Security

- No data is stored or transmitted
- All calculations happen client-side
- No external API calls
- PDF generation is local

## 📈 Future Enhancements

- [ ] Export to branded slides
- [ ] Additional currency support
- [ ] Sector-specific interface copy
- [ ] API version for partners
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For support or questions, contact the Habitus Health development team.

---

**Built with ❤️ for Habitus Health**
