import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Camera, CameraOff } from 'lucide-react';

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export function ObjectDetection() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const loadModel = async () => {
    try {
      // Initialize TensorFlow.js backend
      await tf.ready();
      await tf.setBackend('webgl');
      
      const loadedModel = await cocossd.load();
      setModel(loadedModel);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const drawDetections = (detections: Detection[]) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw detections
    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      // Draw rectangle
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw label
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${detection.class} ${Math.round(detection.score * 100)}%`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };

  const detect = async () => {
    if (!model || !webcamRef.current?.video || !isCameraOn) return;

    const video = webcamRef.current.video;

    // Check if video is ready and has valid dimensions
    if (!video.readyState || video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(detect);
      return;
    }

    try {
      const predictions = await model.detect(video);
      drawDetections(predictions as Detection[]);
      
      // Continue detection loop
      requestAnimationFrame(detect);
    } catch (error) {
      console.error('Error during detection:', error);
      // Continue detection loop even if there's an error
      requestAnimationFrame(detect);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (!isLoading && isCameraOn) {
      const detectInterval = requestAnimationFrame(detect);
      return () => cancelAnimationFrame(detectInterval);
    }
  }, [isLoading, model, isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="relative">
      <div className="relative inline-block">
        {isCameraOn ? (
          <Webcam
            ref={webcamRef}
            className="rounded-lg shadow-lg"
            mirrored
            style={{
              visibility: isLoading ? 'hidden' : 'visible',
            }}
          />
        ) : (
          <div className="w-[640px] h-[480px] bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-white text-xl">Camera is turned off</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-10"
          style={{
            visibility: isLoading || !isCameraOn ? 'hidden' : 'visible',
          }}
        />
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={toggleCamera}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          {isCameraOn ? (
            <CameraOff className="w-6 h-6 text-gray-800" />
          ) : (
            <Camera className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Loading object detection model...</p>
          </div>
        </div>
      )}
    </div>
  );
}