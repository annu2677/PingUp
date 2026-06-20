# 🚀 PingUp

PingUp is a modern social media web application that allows users to connect, share posts, interact with content, and engage with a growing community.

## ✨ Features

### 👤 User Authentication

* User Registration
* User Login
* Session Management
* Duplicate Email Detection

### 📝 Posts

* Create Posts
* View Posts Feed
* Dynamic Feed Rendering
* Persistent Data Storage using MongoDB

### ❤️ Likes

* Like Posts
* Unlike Posts
* Real-time Like Count Updates
* Like State Persistence after Refresh
* Duplicate Like Prevention

### 🎨 Modern UI

* Responsive Design
* Smooth Animations using Framer Motion
* Modern Social Media Inspired Interface
* Mobile-Friendly Layout

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Spring Boot
* Java
* Maven
* Spring Data MongoDB

### Database

* MongoDB Atlas / MongoDB

---

## 📂 Project Structure

```text
PingUp/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── src/
├── public/
├── package.json
├── vite.config.js
└── ...
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/annu2677/PingUp.git
cd PingUp
```

---

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

### Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Install dependencies and run:

```bash
./mvnw spring-boot:run
```

For Windows:

```bash
mvnw.cmd spring-boot:run
```

Backend will run on:

```text
http://localhost:8080
```

---

## 🔐 Environment Variables

Create a `.env` file and configure the required variables.

Example:

```env
VITE_API_URL=http://localhost:8080
```

Backend configuration should be added to:

```text
application.properties
```

---

## 📸 Screenshots

Add screenshots of:

* Login Page
* Registration Page
* Home Feed
* Post Creation
* Like Feature

---

## 🎯 Future Improvements

* Comments System
* User Profiles
* Follow / Unfollow Feature
* JWT Authentication
* Image Uploads (Cloudinary)
* Notifications
* Search Functionality
* Deployment (Vercel + Render)

---

## 👩‍💻 Author

**Annoaja Priyadarshini**

Built with ❤️ using React, Spring Boot, and MongoDB.
