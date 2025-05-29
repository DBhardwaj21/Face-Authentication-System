import os
import cv2
import argparse
import numpy as np
from deepface import DeepFace

def verify_face(selfie_path, aadhaar_path, model_name="Facenet", distance_metric="cosine", threshold=None):
    """
    Compare faces between a selfie and Aadhaar card using DeepFace.
    Returns verification result and similarity score.
    """
    try:
        # Check if files exist
        if not os.path.isfile(selfie_path):
            print(f"❌ Selfie image not found: {selfie_path}")
            return False, 0
            
        if not os.path.isfile(aadhaar_path):
            print(f"❌ Aadhaar image not found: {aadhaar_path}")
            return False, 0
        
        print(f"Analyzing images using {model_name}...")
        
        # Perform verification
        result = DeepFace.verify(
            img1_path=selfie_path,
            img2_path=aadhaar_path,
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
        
        print(f"Raw distance: {distance:.4f}, Threshold: {threshold_value:.4f}")
        
        return verified, similarity
        
    except Exception as e:
        print(f"❌ Error during face verification: {str(e)}")
        return False, 0

def display_faces(selfie_path, aadhaar_path):
    """
    Display detected faces in the images (for visualization purposes)
    """
    try:
        # Extract faces using DeepFace
        faces_selfie = DeepFace.extract_faces(selfie_path, enforce_detection=False)
        faces_aadhaar = DeepFace.extract_faces(aadhaar_path, enforce_detection=False)
        
        # Load original images
        selfie_img = cv2.imread(selfie_path)
        aadhaar_img = cv2.imread(aadhaar_path)
        
        if selfie_img is None:
            print(f"❌ Could not load selfie image for visualization: {selfie_path}")
            return
            
        if aadhaar_img is None:
            print(f"❌ Could not load Aadhaar image for visualization: {aadhaar_path}")
            return
        
        # Draw rectangles around detected faces
        if len(faces_selfie) > 0:
            face = faces_selfie[0]
            facial_area = face.get('facial_area', {})
            x, y, w, h = facial_area.get('x', 0), facial_area.get('y', 0), facial_area.get('w', 0), facial_area.get('h', 0)
            cv2.rectangle(selfie_img, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(selfie_img, "Selfie Face", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            
        if len(faces_aadhaar) > 0:
            face = faces_aadhaar[0]
            facial_area = face.get('facial_area', {})
            x, y, w, h = facial_area.get('x', 0), facial_area.get('y', 0), facial_area.get('w', 0), facial_area.get('h', 0)
            cv2.rectangle(aadhaar_img, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(aadhaar_img, "Aadhaar Face", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
        # Save output images
        selfie_output = "selfie_detected.jpg"
        aadhaar_output = "aadhaar_detected.jpg"
        cv2.imwrite(selfie_output, selfie_img)
        cv2.imwrite(aadhaar_output, aadhaar_img)
        
        print(f"✅ Face detection results saved as '{selfie_output}' and '{aadhaar_output}'")
        
    except Exception as e:
        print(f"❌ Error displaying faces: {str(e)}")

def interactive_mode():
    """
    Interactive mode to test multiple pairs of images
    """
    print("\n=== INTERACTIVE MODE ===")
    print("Enter image paths to compare (or type 'exit' to quit)")
    
    while True:
        # Get selfie path
        selfie_path = input("\nEnter selfie/photo image path: ")
        if selfie_path.lower() == 'exit':
            break
            
        # Get Aadhaar path
        aadhaar_path = input("Enter Aadhaar image path: ")
        if aadhaar_path.lower() == 'exit':
            break
            
        # Get model name
        models = ['Facenet', 'VGG-Face', 'OpenFace', 'DeepFace', 'ArcFace', 'Dlib']
        print("\nAvailable models:", ", ".join(models))
        model_name = input("Enter model name (press Enter for Facenet): ")
        if not model_name:
            model_name = "Facenet"
        elif model_name.lower() == 'exit':
            break
            
        # Check if files exist
        if not os.path.isfile(selfie_path):
            print(f"❌ File not found: {selfie_path}")
            continue
            
        if not os.path.isfile(aadhaar_path):
            print(f"❌ File not found: {aadhaar_path}")
            continue
            
        # Perform verification
        verified, similarity = verify_face(selfie_path, aadhaar_path, model_name=model_name)
        
        # Display results
        print(f"\nSimilarity score: {similarity:.2f}%")
        if verified:
            print("✅ Verified")
        else:
            print("❌ Rejected: Face does not match")
            
        # Ask if user wants to visualize
        visualize = input("\nVisualize face detection? (y/n): ")
        if visualize.lower() == 'y':
            display_faces(selfie_path, aadhaar_path)

def main():
    # Hardcoded image paths
    selfie_path = "image.png"  # Replace with your actual path
    aadhaar_path = "sample_image1.jpg"  # Replace with your actual path
    model_name = "Facenet"
    
    print(f"Comparing face in {selfie_path} with face in {aadhaar_path}...")
    print(f"Using model: {model_name}")
    
    # Perform verification
    verified, similarity = verify_face(
        selfie_path, 
        aadhaar_path, 
        model_name=model_name
    )
    
    # Display similarity score
    print(f"Similarity score: {similarity:.2f}%")
    
    # Check against default threshold (75%)
    threshold = 75.0
    matches_threshold = similarity >= threshold
    
    # Display result
    if verified and matches_threshold:
        print("✅ Verified")
    else:
        print("❌ Rejected: Face does not match")
    
    # Visualize face detection results
    display_faces(selfie_path, aadhaar_path)

if __name__ == "__main__":
    main()