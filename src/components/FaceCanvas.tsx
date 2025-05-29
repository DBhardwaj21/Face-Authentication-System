import React, { useEffect, useRef } from 'react';
import { FaceData } from '../types';

interface FaceCanvasProps {
  imageUrl: string;
  faces: FaceData[];
  width?: number;
  height?: number;
}

const FaceCanvas: React.FC<FaceCanvasProps> = ({ 
  imageUrl, 
  faces, 
  width = 400, 
  height = 300 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling factors to fit the image in the canvas
      const scale = Math.min(
        canvas.width / image.width,
        canvas.height / image.height
      );

      // Calculate centered position
      const x = (canvas.width - image.width * scale) / 2;
      const y = (canvas.height - image.height * scale) / 2;

      // Draw image scaled and centered
      ctx.drawImage(
        image,
        0, 0, image.width, image.height,
        x, y, image.width * scale, image.height * scale
      );

      // Draw faces
      faces.forEach((face) => {
        const scaledX = x + face.position.x * scale;
        const scaledY = y + face.position.y * scale;
        const scaledWidth = face.position.width * scale;
        const scaledHeight = face.position.height * scale;

        // Draw rectangle around face
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Create gradient for face ID label background
        const gradient = ctx.createLinearGradient(
          scaledX, 
          scaledY + scaledHeight, 
          scaledX + scaledWidth, 
          scaledY + scaledHeight
        );
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.85)');
        gradient.addColorStop(1, 'rgba(13, 148, 136, 0.85)');

        // Draw face ID label background
        ctx.fillStyle = gradient;
        const labelHeight = 24;
        ctx.fillRect(
          scaledX, 
          scaledY + scaledHeight, 
          scaledWidth, 
          labelHeight
        );

        // Draw face ID text
        ctx.fillStyle = 'white';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `Face ${face.face_id} (${Math.round(face.confidence * 100)}%)`,
          scaledX + scaledWidth / 2,
          scaledY + scaledHeight + labelHeight / 2
        );
      });
    };
  }, [imageUrl, faces]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      className="border rounded shadow-sm bg-gray-50"
    />
  );
};

export default FaceCanvas;