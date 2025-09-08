# URL Shortener - Campus Evaluation Project

A React-based URL shortener application built for campus hiring evaluation with Material UI and comprehensive logging middleware.

## 🚀 Features

- **URL Shortening**: Convert long URLs to short, manageable links
- **Custom Shortcodes**: Optional custom shortcode support with validation
- **Expiry Management**: Configurable URL validity (default 30 minutes)
- **Statistics Dashboard**: Comprehensive analytics with click tracking
- **Authentication System**: Integration with evaluation service APIs
- **Logging Middleware**: Comprehensive logging for all user actions
- **Responsive Design**: Material UI components for modern interface

## 🛠️ Tech Stack

- **Frontend**: React 18 with Next.js
- **UI Framework**: Material UI (MUI) v5
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Storage**: localStorage for client-side persistence
- **Logging**: Custom middleware with evaluation service integration

## 📁 Project Structure

\`\`\`
/src
  /components
    UrlShortener.js      # Main URL shortening interface
    UrlStats.js          # Statistics and analytics dashboard
    AuthForm.js          # Registration and authentication
    RedirectHandler.js   # Short URL redirection logic
  /middleware
    logger.js            # Logging middleware implementation
  /services
    authService.js       # Authentication API integration
  /utils
    urlUtils.js          # URL validation and utility functions
  App.js                 # Main application component
\`\`\`

## 🔧 Setup Instructions

### 1. Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd url-shortener-app

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

### 2. Test Server Registration

Before using the application, you need to register with the evaluation service:

#### Registration API
\`\`\`bash
POST http://20.244.56.144/evaluation-service/register
Content-Type: application/json

{
  "email": "your-email@example.com",
  "name": "Your Name",
  "mobileNo": "1234567890",
  "githubUsername": "yourusername",
  "rollNo": "your-roll-number",
  "accessCode": "provided-access-code"
}
\`\`\`

**Response**: Returns `clientID` and `clientSecret`

#### Authentication API
\`\`\`bash
POST http://20.244.56.144/evaluation-service/auth
Content-Type: application/json

{
  "email": "your-email@example.com",
  "name": "Your Name",
  "rollNo": "your-roll-number",
  "accessCode": "provided-access-code",
  "clientID": "received-client-id",
  "clientSecret": "received-client-secret"
}
\`\`\`

**Response**: Returns `access_token` (automatically stored in localStorage)

### 3. Using the Application

1. **Registration & Authentication**: Complete the setup process using the evaluation service APIs
2. **Shorten URLs**: Enter long URLs with optional custom shortcodes and validity periods
3. **View Statistics**: Monitor all shortened URLs with click analytics
4. **Redirect**: Access shortened URLs at `http://localhost:3000/<shortcode>`

## 🔍 Key Features Explained

### URL Shortening
- Validates URL format before processing
- Generates unique 6-character shortcodes or accepts custom ones
- Configurable expiry time (1 minute to 1 week)
- Collision detection for shortcode uniqueness

### Statistics Dashboard
- Real-time analytics for all shortened URLs
- Click tracking with timestamps and user agent information
- Status indicators (Active/Expired)
- Expandable rows for detailed click information

### Logging Middleware
The application includes comprehensive logging for all major actions:

\`\`\`javascript
// Usage examples
Log("frontend", "info", "component", "URL shortened successfully");
Log("frontend", "error", "api", "Invalid URL entered by user");
Log("frontend", "warn", "component", "Shortcode collision detected");
\`\`\`

**Log Levels**: debug, info, warn, error, fatal
**Packages**: api, component, handler, etc.

### Error Handling
- Client-side validation for all inputs
- Graceful handling of expired URLs
- User-friendly error messages
- Comprehensive logging for debugging

## 🔒 Security Features

- Input validation and sanitization
- Shortcode uniqueness verification
- URL format validation
- Secure token storage in localStorage

## 📊 Data Storage

The application uses localStorage for client-side data persistence:
- `access_token`: Authentication token
- `shortened_urls`: Array of shortened URL objects with metadata

## 🚦 API Integration

### Logging API
\`\`\`bash
POST http://20.244.56.144/evaluation-service/logs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "stack": "frontend",
  "level": "info",
  "package": "component",
  "message": "User action description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## 🧪 Testing

The application includes comprehensive error handling and validation:
- URL format validation
- Shortcode uniqueness checking
- Expiry time validation
- Authentication state management

## 📝 Development Notes

- All major user actions are logged using the middleware
- Material UI components ensure consistent design
- Responsive layout works on desktop and mobile
- Client-side routing handles all navigation
- localStorage provides session persistence

## 🤝 Contributing

This project is built for campus evaluation. Follow the exact requirements and maintain the logging middleware integration for all user actions.

## 📄 License

This project is created for educational and evaluation purposes.
\`\`\`

I've created a comprehensive React-based URL Shortener application that meets all your campus hiring evaluation requirements. The app includes Material UI components, comprehensive logging middleware, authentication integration, and all the core features specified.

Key highlights of the implementation:
- **Complete folder structure** with proper separation of concerns
- **Material UI integration** for modern, responsive design
- **Comprehensive logging middleware** that tracks all user actions
- **Authentication system** integrated with the evaluation service APIs
- **URL shortening with validation** including custom shortcodes and expiry management
- **Statistics dashboard** with detailed click tracking and analytics
- **Error handling** with user-friendly messages and proper logging

The application is ready to run on `http://localhost:3000` and includes all the required functionality for the campus evaluation project.
