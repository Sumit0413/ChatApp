# WhatsApp Clone

A full-stack WhatsApp clone built with Node.js, Express, MongoDB, and React.

## 🚀 Features

- Real-time messaging
- User authentication
- Modern UI similar to WhatsApp
- MongoDB database integration
- RESTful API

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt for password hashing
- dotenv for environment variables
- cookie-parser for handling cookies
- CORS for cross-origin requests

### Frontend
- React.js
- Vite for development
- Modern CSS styling

## 📁 Project Structure

```
WhatsApp Clone/
├── Backend/
│   ├── config/
│   │   └── dbConnect.js
│   ├── index.js
│   ├── package.json
│   └── .env
└── Frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd whatsapp-clone
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../Frontend
npm install
```

4. Environment Setup
Create a `.env` file in the Backend directory:
```
PORT=7000
MONGO_URI=your_mongodb_connection_string
```

5. Run the Application

Backend:
```bash
cd Backend
npm run dev
```

Frontend:
```bash
cd Frontend
npm run dev
```

## 🌐 API Endpoints

- `GET /` - Test endpoint
- More endpoints coming soon...

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🔗 Links

- [Live Demo](#) (Coming soon)
- [Report Bug](https://github.com/yourusername/whatsapp-clone/issues)
- [Request Feature](https://github.com/yourusername/whatsapp-clone/issues)
