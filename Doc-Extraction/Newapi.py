import os
import cv2
import uuid
import time
import logging
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from deepface import DeepFace

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verify_face(selfie_path, document_path, model_name="Facenet", distance_metric="cosine"):
    try:
        if not os.path.isfile(selfie_path):
            return False, 0, "Selfie image not found"
        if not os.path.isfile(document_path):
            return False, 0, "Document image not found"

        result = DeepFace.verify(
            img1_path=selfie_path,
            img2_path=document_path,
            model_name=model_name,
            distance_metric=distance_metric,
            enforce_detection=False
        )

        verified = result["verified"]
        distance = result["distance"]
        threshold_value = result.get("threshold", 0.4)

        similarity = (1 - distance) * 100 if distance_metric == "cosine" \
            else max(0, (1 - (distance / (threshold_value * 2))) * 100)

        return verified, similarity, None

    except Exception as e:
        return False, 0, f"Error during face verification: {str(e)}"

def extract_faces_info(image_path):
    try:
        faces = DeepFace.extract_faces(image_path, enforce_detection=False)

        if not faces:
            return {"faces_detected": 0, "message": "No faces detected"}

        faces_info = []
        for i, face in enumerate(faces):
            area = face.get('facial_area', {})
            faces_info.append({
                "face_id": i + 1,
                "confidence": face.get('confidence', 0),
                "position": {
                    "x": area.get('x', 0),
                    "y": area.get('y', 0),
                    "width": area.get('w', 0),
                    "height": area.get('h', 0)
                }
            })

        return {
            "faces_detected": len(faces),
            "faces": faces_info
        }

    except Exception as e:
        logger.error(f"Error extracting faces: {str(e)}")
        return {"faces_detected": 0, "message": f"Error: {str(e)}"}

@app.route('/')
def index():
    return jsonify({
        "service": "Face Authentication API",
        "status": "active",
        "endpoints": {
            "/verify": "POST - Verify face match between selfie and document",
            "/detect": "POST - Detect faces in an image",
            "/models": "GET - List available models"
        }
    })

@app.route('/verify', methods=['POST'])
def verify_faces():
    if 'selfie' not in request.files or 'document' not in request.files:
        return jsonify({'error': 'Both selfie and document images are required'}), 400

    selfie_file = request.files['selfie']
    document_file = request.files['document']

    if selfie_file.filename == '' or document_file.filename == '':
        return jsonify({'error': 'No selected files'}), 400

    if not (allowed_file(selfie_file.filename) and allowed_file(document_file.filename)):
        return jsonify({'error': 'Only .png, .jpg, .jpeg files are allowed'}), 400

    try:
        # Auto-generate UUIDs
        user_id = str(uuid.uuid4())
        lead_id = str(uuid.uuid4())
        client_id = str(uuid.uuid4())
        timestamp = str(int(time.time()))

        # Create directory: uploads/<user_id>/<timestamp>
        user_dir = os.path.join(app.config['UPLOAD_FOLDER'], user_id, timestamp)
        os.makedirs(user_dir, exist_ok=True)

        # Save files
        selfie_filename = secure_filename("selfie_" + selfie_file.filename)
        document_filename = secure_filename("document_" + document_file.filename)
        selfie_path = os.path.join(user_dir, selfie_filename)
        document_path = os.path.join(user_dir, document_filename)
        selfie_file.save(selfie_path)
        document_file.save(document_path)

        # Face verification
        model_name = request.form.get('model_name', 'Facenet')
        verified, similarity, error = verify_face(selfie_path, document_path, model_name=model_name)

        # Face detection
        selfie_faces = extract_faces_info(selfie_path)
        document_faces = extract_faces_info(document_path)

        response = {
            'verified': verified,
            'similarity': round(similarity, 2),
            'match': similarity >= 75.0,
            'threshold': 75.0,
            'model_used': model_name,
            'generated_ids': {
                'user_id': user_id,
                'lead_id': lead_id,
                'client_id': client_id
            },
            'timestamp': timestamp,
            'selfie_analysis': selfie_faces,
            'document_analysis': document_faces,
            'image_paths': {
                'selfie': selfie_path,
                'document': document_path
            }
        }

        if error:
            response['error'] = error

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error in verification process: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/detect', methods=['POST'])
def detect_faces():
    if 'image' not in request.files:
        return jsonify({'error': 'Image file is required'}), 400

    image_file = request.files['image']

    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(image_file.filename):
        return jsonify({'error': 'Only .png, .jpg, .jpeg files are allowed'}), 400

    try:
        timestamp = str(int(time.time()))
        image_filename = secure_filename(f"{timestamp}_{image_file.filename}")
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image_file.save(image_path)

        faces_info = extract_faces_info(image_path)

        # Optional: delete the file after processing
        try:
            os.remove(image_path)
        except Exception as e:
            logger.warning(f"Failed to remove temporary file: {str(e)}")

        return jsonify(faces_info)

    except Exception as e:
        logger.error(f"Error in face detection process: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def list_models():
    return jsonify({
        'available_models': ['Facenet', 'VGG-Face', 'OpenFace', 'DeepFace', 'ArcFace', 'Dlib'],
        'default_model': 'Facenet'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
