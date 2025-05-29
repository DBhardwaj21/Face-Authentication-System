import os
import cv2
import numpy as np
from deepface import DeepFace
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import logging
from flask_cors import CORS

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
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16MB

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verify_face(selfie_path, document_path, model_name="Facenet", distance_metric="cosine"):
    """
    Compare faces between a selfie and document image using DeepFace.
    Returns verification result and similarity score.
    """
    try:
        # Check if files exist
        if not os.path.isfile(selfie_path):
            logger.error(f"Selfie image not found: {selfie_path}")
            return False, 0, "Selfie image not found"
            
        if not os.path.isfile(document_path):
            logger.error(f"Document image not found: {document_path}")
            return False, 0, "Document image not found"
        
        logger.info(f"Analyzing images using {model_name}...")
        
        # Perform verification
        result = DeepFace.verify(
            img1_path=selfie_path,
            img2_path=document_path,
            model_name=model_name,
            distance_metric=distance_metric,
            enforce_detection=False  # Set to False to avoid errors if face detection fails
        )
        
        # Extract results
        verified = result["verified"]
        distance = result["distance"]
        threshold_value = result.get("threshold", 0.4)
        
        # Calculate similarity percentage (inverse of distance)
        if distance_metric == "cosine":
            # Cosine similarity: 0 is perfect match
            similarity = (1 - distance) * 100
        else:
            # For other metrics, we use a relative scale
            similarity = max(0, (1 - (distance / (threshold_value * 2))) * 100)
        
        logger.info(f"Raw distance: {distance:.4f}, Threshold: {threshold_value:.4f}")
        
        return verified, similarity, None
        
    except Exception as e:
        error_msg = f"Error during face verification: {str(e)}"
        logger.error(error_msg)
        return False, 0, error_msg

def extract_faces_info(image_path):
    """
    Extract face detection information from an image
    Returns a dictionary with face detection data
    """
    try:
        # Extract faces using DeepFace
        faces = DeepFace.extract_faces(image_path, enforce_detection=False)
        
        if not faces:
            return {"faces_detected": 0, "message": "No faces detected"}
            
        # Return face detection information
        faces_info = []
        for i, face in enumerate(faces):
            facial_area = face.get('facial_area', {})
            face_info = {
                "face_id": i + 1,
                "confidence": face.get('confidence', 0),
                "position": {
                    "x": facial_area.get('x', 0),
                    "y": facial_area.get('y', 0),
                    "width": facial_area.get('w', 0),
                    "height": facial_area.get('h', 0)
                }
            }
            faces_info.append(face_info)
        
        return {
            "faces_detected": len(faces),
            "faces": faces_info
        }
        
    except Exception as e:
        logger.error(f"Error extracting faces: {str(e)}")
        return {"faces_detected": 0, "message": f"Error: {str(e)}"}

@app.route('/')
def index():
    """API root endpoint"""
    return jsonify({
        "service": "Face Authentication API",
        "status": "active",
        "endpoints": {
            "/verify": "POST - Verify face match between selfie and document",
            "/detect": "POST - Detect faces in an image"
        }
    })

@app.route('/verify', methods=['POST'])    
def verify_faces():
    """
    API endpoint to verify face match between selfie and document
    Expects form data with:
    - selfie: image file
    - document: image file
    - model_name: (optional) name of the face recognition model
    """
    # Check if the request has the file parts
    if 'selfie' not in request.files or 'document' not in request.files:
        return jsonify({'error': 'Both selfie and document images are required'}), 400
        
    selfie_file = request.files['selfie']
    document_file = request.files['document']
    
    # Check if files are empty
    if selfie_file.filename == '' or document_file.filename == '':
        return jsonify({'error': 'No selected files'}), 400
        
    # Check if files are allowed
    if not (selfie_file and allowed_file(selfie_file.filename) and 
            document_file and allowed_file(document_file.filename)):
        return jsonify({'error': 'Only .png, .jpg, .jpeg files are allowed'}), 400
    
    # Get optional model name parameter
    model_name = request.form.get('model_name', 'Facenet')
    
    try:
        # Save the files to the upload folder
        selfie_filename = secure_filename(selfie_file.filename)
        document_filename = secure_filename(document_file.filename)
        
        # Make filenames unique by prepending timestamp
        import time
        timestamp = str(int(time.time()))
        selfie_filename = f"{timestamp}_{selfie_filename}"
        document_filename = f"{timestamp}_{document_filename}"
        
        selfie_path = os.path.join(app.config['UPLOAD_FOLDER'], selfie_filename)
        document_path = os.path.join(app.config['UPLOAD_FOLDER'], document_filename)
        
        selfie_file.save(selfie_path)
        document_file.save(document_path)
        
        # Perform face verification
        verified, similarity, error = verify_face(
            selfie_path, 
            document_path, 
            model_name=model_name
        )
        
        # Get face detection info
        selfie_faces = extract_faces_info(selfie_path)
        document_faces = extract_faces_info(document_path)
        
        # Create response
        response = {
            'verified': verified,
            'similarity': round(similarity, 2),
            'selfie_analysis': selfie_faces,
            'document_analysis': document_faces,
            'threshold': 75.0,  # Default threshold
            'match': similarity >= 75.0,
            'model_used': model_name
        }
        
        if error:
            response['error'] = error
            
        # Clean up files after processing
        try:
            os.remove(selfie_path)
            os.remove(document_path)
        except Exception as e:
            logger.warning(f"Failed to remove temporary files: {str(e)}")
            
        return jsonify(response)
        
    except Exception as e:
        # Return error message
        logger.error(f"Error in verification process: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/detect', methods=['POST'])
def detect_faces():
    """
    API endpoint to detect faces in an image
    Expects form data with:
    - image: image file
    """
    # Check if the request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'Image file is required'}), 400
        
    image_file = request.files['image']
    
    # Check if file is empty
    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    # Check if file is allowed
    if not (image_file and allowed_file(image_file.filename)):
        return jsonify({'error': 'Only .png, .jpg, .jpeg files are allowed'}), 400
    
    try:
        # Save the file to the upload folder
        image_filename = secure_filename(image_file.filename)
        
        # Make filename unique by prepending timestamp
        import time
        timestamp = str(int(time.time()))
        image_filename = f"{timestamp}_{image_filename}"
        
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image_file.save(image_path)
        # Get face detection info
        faces_info = extract_faces_info(image_path)
        
        # Clean up file after processing
        try:
            os.remove(image_path)
        except Exception as e:
            logger.warning(f"Failed to remove temporary file: {str(e)}")
            
        return jsonify(faces_info)
        
    except Exception as e:
        # Return error message
        logger.error(f"Error in face detection process: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def list_models():
    """List available face recognition models"""
    available_models = ['Facenet', 'VGG-Face', 'OpenFace', 'DeepFace', 'ArcFace', 'Dlib']
    return jsonify({
        'available_models': available_models,
        'default_model': 'Facenet'
    })

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)