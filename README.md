# LifePulse – Futuristic Age & BMI Analyzer

A Python-based web application for calculating BMI and visualizing health trends with a futuristic, animated interface.

## Features

- **BMI Calculator**: Input name, birth year, height, and weight to calculate BMI and health status.
- **3D BMI Trend Tracker**: Add weight data points and view an interactive 3D Plotly graph.
- **Animations**: Smooth Anime.js effects for buttons, panels, and particle backgrounds.
- **Responsive Design**: Mobile-friendly with Tailwind CSS and scrollable result panels.
- **Language Support**: English and Bengali with toggle.
- **Sharing**: Share results via links with rich social media previews.

## Setup

1. **Install Dependencies**:

   ```bash
   pip install flask pywebio plotly
   ```

2. **Run the App**:

   ```bash
   python app.py
   ```

   Open `http://localhost:5000` in your browser.

## File Structure

```
LifePulse/
├── app.py                  # Flask app with routes and logic
├── templates/
│   ├── index.html         # HTML template with UI
├── static/
│   ├── styles.css         # Custom CSS
│   ├── scripts.js         # JavaScript for animations
├── data/
│   ├── bmi_data.json      # Stores BMI trend data
├── README.md              # This file
```

## Upload to GitHub

1. Go to `github.com` and create a new repository (e.g., `LifePulse`).
2. Click "Upload files" in the repository.
3. Drag and drop the `LifePulse` folder or individual files.
4. Click "Commit changes" to upload.

## Dependencies

- Flask: Web framework
- PyWebIO: Interactive UI components
- Plotly: 3D graphing
- Tailwind CSS (CDN): Styling
- Anime.js (CDN): Animations

## Notes

- The app stores BMI data in `bmi_data.json` per session (clears on server restart).
- Ensure the `data` folder exists before running.
- Test sharing on social platforms to verify meta tags.

Crafted by Siam 🌌