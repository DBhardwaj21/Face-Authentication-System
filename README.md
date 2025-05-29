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

<p align="center">
  <img src="https://twemoji.maxcdn.com/v/latest/72x72/1f40d.png" alt="Python" width="50" height="50" />
  <img src="https://twemoji.maxcdn.com/v/latest/72x72/1f4e6.png" alt="Node.js" width="50" height="50" />
  <img src="https://twemoji.maxcdn.com/v/latest/72x72/269b.png" alt="React" width="50" height="50" />
  <img src="https://twemoji.maxcdn.com/v/latest/72x72/1f3a8.png" alt="CSS" width="50" height="50" />
  <img src="https://twemoji.maxcdn.com/v/latest/72x72/1f916.png" alt="AI" width="50" height="50" />
  <img src="https://raw.githubusercontent.com/serengil/deepface/master/docs/img/deepface_logo.png" alt="Deepface" width="50" height="50" />
  <img src="https://opencv.org/wp-content/uploads/2020/07/cropped-OpenCV_logo_no_text.png" alt="OpenCV" width="50" height="50" />
  <img src="https://flask.palletsprojects.com/en/2.3.x/_images/flask-logo.png" alt="Flask" width="50" height="50" />
  <img src="https://miro.medium.com/v2/resize:fit:1600/format:webp/1*eOFMYd7pL-6rNwzfr9N5yA.png" alt="FaceNet" width="50" height="50" />

</p>


---

## 📞 Contact

Created by **Dev Bhardwaj**  
Email: dev.bhardwaj@gmail.com  
GitHub: [DBhardwaj21](https://github.com/DBhardwaj21)

---

🎉 Thank you for checking out the Face Authentication System!  
Feel free to ⭐ the repo if you find it useful.

