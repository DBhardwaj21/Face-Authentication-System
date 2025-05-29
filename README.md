# 🧑‍💻 Face Authentication System


A smart system to authenticate users by matching their selfie with official ID documents like Aadhaar or Driving License.

---

## 🔍 Project Overview

The Face Authentication System is an AI-powered application that performs secure face verification by comparing a user's selfie with the face on their official identification documents. This helps in reliable identity verification for KYC, loan processing, attendance, and more.

### Features
- 🔒 Secure Face Authentication: Matches user's selfie with official ID (Aadhaar, Driving License) for reliable identity verification.
- ⚡ Real-time KYC Verification: Enables instant Know Your Customer (KYC) process by verifying identity quickly and accurately.
- 🤳 Live Selfie Capture: Supports capturing live selfies directly via the frontend for seamless authentication.
- 🪪 Multi-Document Support: Works with multiple official documents like Aadhaar card, Driving License, and more.
- 📡 Flask API Backend: Robust and scalable backend API to process face extraction and matching using Python.
- 🖥️ Modern Frontend: Responsive and user-friendly interface built with Node.js and modern frameworks.
- 🧠 AI-Powered Face Matching: Utilizes advanced AI models (Deepface, FaceNet) for high-accuracy facial recognition.
- 🔄 Easy Integration: Simple to deploy and integrate with existing systems or apps for user verification.
- 📁 Secure Handling of Sensitive Data: Keeps personal information secure by handling data carefully and avoiding unnecessary storage.

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

<p align="left">
  <!-- Python -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="50" height="50" />
  <!-- Node.js -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="50" height="50" />
  <!-- React -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="50" height="50" />
  <!-- CSS3 -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="50" height="50" />
  <!-- AI (using TensorFlow icon as AI symbol) -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="AI" width="50" height="50" />
  <!-- Deepface (using face recognition icon) -->
  <img src="https://raw.githubusercontent.com/ageitgey/face_recognition/master/examples/face_recognition.jpg" alt="Deepface" width="50" height="50" />
  <!-- OpenCV -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/49/OpenCV_logo.svg" alt="OpenCV" width="50" height="50" />
  <!-- Flask -->
  <img src="https://flask.palletsprojects.com/en/2.3.x/_images/flask-logo.png" alt="Flask" width="50" height="50" />
  <!-- FaceNet (using a face recognition icon since no official logo) -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Face_recognition_icon.svg" alt="FaceNet" width="50" height="50" />
</p>



---

## 📞 Contact

Created by **Dev Bhardwaj**  
Email: dev.bhardwaj@gmail.com  
GitHub: [DBhardwaj21](https://github.com/DBhardwaj21)

---

🎉 Thank you for checking out the Face Authentication System!  
Feel free to ⭐ the repo if you find it useful.

