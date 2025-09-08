# 🚀 URL Shortener Application

A modern, full-stack web application for shortening URLs with advanced features including custom shortcodes, expiration control, click tracking, and comprehensive analytics. Built with a responsive Material-UI interface and robust Express.js backend.

## ✨ Features

- 🔗 **URL Shortening**: Convert long URLs into short, manageable links
- 🎯 **Custom Shortcodes**: Create personalized shortcodes (alphanumeric, up to 6 characters)
- ⏰ **Expiration Control**: Set custom validity periods for shortened URLs
- 📊 **Click Tracking**: Monitor click statistics with timestamps, referrers, and geolocation data
- 📦 **Batch Processing**: Shorten up to 5 URLs simultaneously
- 📈 **Statistics Dashboard**: View detailed analytics for each shortened URL
- 📱 **Responsive UI**: Modern, mobile-friendly interface built with Material-UI
- 🔄 **Real-time Updates**: Live statistics refresh and click tracking

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment (v18+)
- **Express.js** - Web framework for API development
- **Axios** - HTTP client for geolocation services
- **CORS** - Cross-origin resource sharing middleware

### Frontend
- **React** - UI library for building user interfaces (v18)
- **Material-UI (MUI)** - React component library for modern design
- **React Router** - Client-side routing for navigation
- **Axios** - HTTP client for API communication

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) - Package manager for JavaScript
- **Git** - Version control system

## 🚀 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd url-shortener-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd url-shortener-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## ▶️ Running the Application

1. Ensure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. Use the URL Shortener page to create short links
4. Visit the Statistics page to view analytics for your shortened URLs

## 📖 Usage Guide

### Creating Short URLs

1. Navigate to the main URL Shortener page
2. Enter the original URL in the "Original URL" field
3. Set the validity period in minutes (default: 30)
4. Optionally, provide a custom shortcode (alphanumeric, 1-6 characters)
5. Click "Shorten URLs" to generate the short link
6. Copy the generated short link for use

**Screenshot Description**: The main interface shows a clean form with input fields for URL, validity, and optional shortcode, featuring Material-UI components with gradient backgrounds and smooth animations.

### Viewing Statistics

1. Click on the "Statistics" tab in the navigation
2. View a list of all your shortened URLs with their details
3. Click on the accordion to see detailed click information
4. Use the "Refresh Statistics" button to update data in real-time

**Screenshot Description**: The statistics dashboard displays cards for each shortened URL, showing click counts, creation dates, and expandable sections with detailed click logs including timestamps, referrers, and locations.

### Batch URL Shortening

- Add multiple URL forms using the "+" button (up to 5 URLs)
- Fill in details for each URL individually
- Submit all at once to create multiple short links simultaneously
- Each URL can have different validity periods and custom shortcodes

**Screenshot Description**: Multiple form cards stacked vertically, each with its own input fields and remove/add buttons, demonstrating the batch processing capability.

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### POST /shorturls
Create a new shortened URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "validity": 30,
  "shortcode": "custom"
}
```

**Parameters:**
- `url` (required): The original URL to shorten
- `validity` (optional): Expiration time in minutes (default: 30)
- `shortcode` (optional): Custom shortcode (alphanumeric, 1-6 characters)

**Response:**
```json
{
  "shortLink": "http://localhost:8000/abc123",
  "expiry": "2023-12-01T12:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid URL, invalid validity, or invalid shortcode format
- `409`: Shortcode already in use
- `500`: Internal server error

#### GET /shorturls/:shortcode
Retrieve statistics for a shortened URL.

**Response:**
```json
{
  "totalClicks": 5,
  "originalUrl": "https://example.com",
  "creationTimestamp": "2023-12-01T10:00:00.000Z",
  "expiryTimestamp": "2023-12-01T10:30:00.000Z",
  "clicks": [
    {
      "timestamp": "2023-12-01T10:05:00.000Z",
      "referrer": "https://google.com",
      "location": "New York, US"
    }
  ]
}
```

**Error Responses:**
- `404`: Shortcode not found
- `410`: URL has expired
- `500`: Internal server error

#### GET /:shortcode
Redirect to the original URL and track the click.

**Behavior:**
- Redirects to the original URL (302 status)
- Records click data including timestamp, referrer, and geolocation
- Returns 404 if shortcode doesn't exist
- Returns 410 if URL has expired

## 📁 Project Structure

```
url-shortener-app/
├── backend/
│   ├── package.json          # Backend dependencies and scripts
│   ├── server.js             # Main Express server file
│   └── test-api.js           # API test suite
├── frontend/
│   ├── package.json          # Frontend dependencies and scripts
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── App.js            # Main React component with routing
│   │   ├── index.js          # React application entry point
│   │   ├── components/
│   │   │   ├── UrlShortener.js   # URL shortening form component
│   │   │   └── Statistics.js     # Statistics dashboard component
│   │   └── index.css         # Global styles
│   └── README.md             # Frontend-specific documentation
└── README.md                 # This file
```

## 🧪 Testing

The application includes automated API tests to verify functionality.

### Running Tests

1. Ensure the backend server is running on port 8000
2. Navigate to the backend directory:
   ```bash
   cd url-shortener-app/backend
   ```
3. Run the test script:
   ```bash
   node test-api.js
   ```

The test suite covers:
- Creating shortened URLs with valid data
- Handling invalid URLs and parameters
- Custom shortcode functionality
- Shortcode collision detection
- Statistics retrieval
- Click tracking verification

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/url-shortener-app.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies for both backend and frontend
5. Make your changes
6. Run tests to ensure everything works
7. Commit your changes: `git commit -am 'Add some feature'`
8. Push to the branch: `git push origin feature/your-feature-name`
9. Submit a pull request

### Code Style
- Use ESLint configuration for consistent code formatting
- Follow React best practices for component structure
- Write descriptive commit messages
- Add tests for new features

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed steps to reproduce the issue
- Include browser/OS information when reporting frontend issues
- Attach screenshots for UI-related problems

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Author:** Mohammad Asad Misbah  
**Email:** mohammadasadmisbah@example.com  
**GitHub:** [mohammadasadmisbah](https://github.com/mohammadasadmisbah)  
**LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

For questions, suggestions, or support, please open an issue on GitHub or contact the author directly.

---

⭐ If you find this project helpful, please give it a star on GitHub!