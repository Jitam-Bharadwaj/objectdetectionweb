import React from 'react';
import { ObjectDetection } from './components/ObjectDetection';
import { Camera } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <Camera className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Real-Time Object Detection</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Detection</h2>
              <p className="text-gray-600">
                This demo uses TensorFlow.js and the COCO-SSD model to detect objects in real-time
                through your webcam. The model can recognize 80 different types of objects.
              </p>
            </div>
            
            <div className="flex justify-center">
              <ObjectDetection />
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Instructions:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Allow camera access when prompted</li>
                <li>Position objects in front of your camera</li>
                <li>The model will detect and label objects in real-time</li>
                <li>Use the camera toggle button to turn the camera on/off</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;