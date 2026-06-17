# 🚀 ShivForge AI — AI Website Builder

<div align="center">

### Transform Ideas into Websites with AI

Describe any website in plain English → AI generates it instantly → Edit, Preview & Deploy in one click.

**Live Demo:** https://shivforge-ai.netlify.app

</div>

---

## ✨ Features

* 🤖 **AI Website Generation** using OpenRouter (DeepSeek / Llama)
* 💬 **AI Chat Editor** to modify websites using natural language
* 👁️ **Live Preview** powered by Monaco Editor
* 🚀 **One-Click Deployment** with shareable live links
* 🔐 **Google Authentication** using Firebase
* 💳 **Razorpay Integration** for premium plans
* 📱 **Responsive Design** across all devices

---

## 🛠️ Tech Stack

### Frontend

* React.js 19
* Vite 8
* Redux Toolkit + Redux Persist
* React Router DOM
* Tailwind CSS 4
* Motion (Framer Motion)
* Firebase Authentication
* Monaco Editor
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Razorpay SDK
* Cookie Parser

### Services

* OpenRouter AI
* Firebase Authentication
* MongoDB Atlas
* Razorpay
* Netlify
* Render

---

## 📁 Project Structure

```bash
AI-website-builder/
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env
└── backend/
    ├── controllers/
    ├── routes/
    ├── middlewares/
    ├── models/
    ├── config/
    └── index.js
```

---

## ⚙️ Local Setup

### Prerequisites

* Node.js 18+
* MongoDB Atlas
* Firebase Project
* OpenRouter API Key
* Razorpay Account

### 1. Clone Repository

```bash
git clone https://github.com/Shivampatil87/shivforge-ai.git
cd shivforge-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=8000
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

Run Frontend

```bash
npm run dev
```

### 4. Open Application

```text
http://localhost:5173
```

---

## 🌐 Deployment

### Frontend (Netlify)

Build Settings:

```text
Base Directory: frontend
Build Command: npm run build
Publish Directory: dist
```

Create:

```text
frontend/public/_redirects
```

Content:

```text
/* /index.html 200
```

### Backend (Render)

Settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: node index.js
```


## 👨‍💻 Author

**Shivam Patil**

* GitHub: https://github.com/Shivampatil87
* LinkedIn: https://www.linkedin.com/in/shivam-mahalle-dev
* Portfolio: https://shivforge-ai.netlify.app

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ by Shivam Patil

</div>
