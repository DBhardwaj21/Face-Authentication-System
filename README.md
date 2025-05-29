# 🧑‍💻 Face Authentication System

![Face Authentication Banner]

A smart system to authenticate users by matching their selfie with official ID documents like Aadhaar or Driving License.

---

## 🔍 Project Overview

The Face Authentication System is an AI-powered application that performs secure face verification by comparing a user's selfie with the face on their official identification documents. This helps in reliable identity verification for KYC, loan processing, attendance, and more.

### Features
- 🪪 Extracts face data from official documents (Aadhaar, Driving License, etc.)
- 🤳 Captures and processes live selfies for real-time authentication
- 🔐 Secure backend API powered by Flask for document processing
- 💻 Responsive and user-friendly frontend using Node.js and modern web tech
- 📦 Easily deployable with simple commands

---

## 🚀 How to Run the Project

### Step 1: Run the Backend API (Flask)

1. Open a terminal and navigate to the backend folder:

    ```bash
    cd Doc-Extraction
    ```

2. Create and activate a Python virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate      # Linux/Mac
    venv\Scripts\activate         # Windows
    ```

3. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

4. Run the Flask API server:

    ```bash
    python api.py
    ```

The backend API will start at:  
`http://127.0.0.1:5000`

---

### Step 2: Run the Frontend Application

1. Open another terminal at the project root (or frontend folder):

    ```bash
    npm install
    npm run dev
    ```

2. Open your browser and navigate to:  
`http://localhost:3000`

---

## 🛠 Technologies Used

| 🐍 | 📦 | ⚛️ | 🎨 | 🤖 |
|----|----|----|----|----|


---

## 📞 Contact

Created by **Dev Bhardwaj**  
Email: dev.bhardwaj@example.com  
GitHub: [DBhardwaj21](https://github.com/DBhardwaj21)

---

🎉 Thank you for checking out the Face Authentication System!  
Feel free to ⭐ the repo if you find it useful.

