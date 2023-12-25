// const video = document.getElementById("video");
// const imageUpload = document.getElementById("imageUpload");

// imageUpload.addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const imageUrl = URL.createObjectURL(file);
//     const img = await faceapi.bufferToImage(file);
//     video.src = imageUrl;
//     startDetection(img);
//   }
// });

// async function startDetection(img) {
//   const canvas = faceapi.createCanvasFromMedia(img);
//   document.body.append(canvas);
//   const displaySize = { width: img.width, height: img.height };
//   faceapi.matchDimensions(canvas, displaySize);

//   const detections = await faceapi
//     .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
//     .withFaceLandmarks()
//     .withFaceExpressions();

//   const resizedDetections = faceapi.resizeResults(detections, displaySize);
//   canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//   faceapi.draw.drawDetections(canvas, resizedDetections);
//   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//   faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
// }

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("models"),
]).then(uploadImage);

function uploadImage() {
  const con = document.querySelector(".container");
  const input = document.querySelector("#myImg");
  const imgFile = document.querySelector("#myFile");
  let can;
  let img;
  imgFile.addEventListener("change", async () => {
    if (can) {
      can.remove();
    }
    if (img) {
      img.remove();
    }
    img = await faceapi.bufferToImage(myFile.files[0]);
    input.src = img.src;
    const results = await faceapi
      .detectAllFaces(input)
      .withFaceLandmarks()
      .withFaceDescriptors();
    console.log(results);
    const faceMatcher = new faceapi.FaceMatcher(results);
    results.forEach((fd) => {
      const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
      console.log(bestMatch);
    });
    can = faceapi.createCanvasFromMedia(input);
    con.append(can);
    faceapi.matchDimensions(can, { width: input.width, height: input.height });
    const detectionsForSize = faceapi.resizeResults(results, {
      width: input.width,
      height: input.height,
    });
    const box = results[0].detection.box;
    const facebox = new faceapi.draw.DrawBox(box);
    faceapi.draw.drawDetections(can, detectionsForSize);
  });
}
