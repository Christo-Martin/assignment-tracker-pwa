# Assignment Tracker (PWA)

A simple Progressive Web App (PWA) to track assignments with subjects, priorities, and due dates.  
Designed as a learning project focused on understanding frontend fundamentals and incremental feature development.

## Features

- Add, complete, and delete assignments
- Persistent storage using `localStorage`
- Subject-based categorization
- Priority levels (High / Medium / Low)
- Visual subject indicators using color-coded cards
- Responsive design (works on desktop and mobile)
- Installable as a PWA

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- PWA (Service Worker + Manifest)

## Project Structure

```
index.html     # Main HTML file
style.css      # Styling
app.js         # Application logic
sw.js          # Service worker
manifest.json  # PWA manifest
SPEC.md        # Original project specification
icon-192.png   # PWA icon
icon-512.png   # PWA icon
```

## Running the Project

### Option 1: Local

Open `index.html` in a browser  
(or use Live Server for better PWA behavior).

### Option 2: GitHub Pages

The app can be hosted using GitHub Pages.

## Development Notes

- This project intentionally avoids frameworks to focus on core concepts.
- Mobile browsers and PWAs aggressively cache files; clearing site data may be required during development.

## License

See `LICENSE` file.
