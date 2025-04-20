const flash = document.getElementById('flash');
const recordingIndicator = document.getElementById('recordingIndicator');

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const recordedVideo = document.getElementById('recordedVideo');

const startCameraBtn = document.getElementById('startCamera');
const capturePhotoBtn = document.getElementById('capturePhoto');
const downloadPhotoLink = document.getElementById('downloadPhoto');

const startRecordBtn = document.getElementById('startRecord');
const stopRecordBtn = document.getElementById('stopRecord');
const downloadVideoLink = document.getElementById('downloadVideo');

let stream;
let mediaRecorder;
let recordedChunks = [];

startCameraBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
  } catch (error) {
    alert('Camera access denied or not available.');
    console.error(error);
  }
});

// Capture Photo
capturePhotoBtn.addEventListener('click', () => {
    // Show flash
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 150);
  
    // Capture photo
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const imageData = canvas.toDataURL('image/png');
    downloadPhotoLink.href = imageData;
  });
  

// Start Recording
startRecordBtn.addEventListener('click', () => {
    if (!stream) return alert("Start the camera first!");
  
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
  
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };
  
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      recordedVideo.src = videoURL;
      recordedVideo.style.display = 'block';
      downloadVideoLink.href = videoURL;
  
      // Hide recording indicator
      recordingIndicator.style.display = 'none';
    };
  
    mediaRecorder.start();
    startRecordBtn.disabled = true;
    stopRecordBtn.disabled = false;
  
    // Show recording indicator
    recordingIndicator.style.display = 'block';
  });
  
  stopRecordBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
  });
  