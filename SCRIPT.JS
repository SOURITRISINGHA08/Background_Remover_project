const uploadArea = document.getElementById("upload-area");
const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");
const removeBgBtn = document.getElementById("removebackgroundBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

let uploadedFile = null;
let downloadURL = null;

// ⛔ Prevent browser from opening file when dropped anywhere on the page
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

// Prevent default behavior and highlight upload area
uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.style.backgroundColor = "#fdf1d6";
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.backgroundColor = "antiquewhite";
});

// Handle drop inside the upload area
uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  handleFile(file);
  uploadArea.style.backgroundColor = "antiquewhite";
});

// Click-to-upload
uploadArea.addEventListener("click", () => {
  imageInput.click();
});

// File input change
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (file && file.type.startsWith("image/")) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      resultDiv.innerHTML = `
        <img id="preview" src="${e.target.result}" alt="Uploaded Image" style="max-width:100%; height:auto;">
      `;
      downloadBtn.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please upload a valid image.");
  }
}

// Remove background using API
removeBgBtn.addEventListener("click", async () => {
  if (!uploadedFile) {
    alert("Please upload an image first.");
    return;
  }

  resultDiv.innerHTML = `<p>Processing... Please wait.</p>`;
  downloadBtn.style.display = "none";

  const formData = new FormData();
  formData.append("image_file", uploadedFile);
  formData.append("size", "auto");

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "6DWCC64YdQSMv6ZL1N95hSUz" // 🔴 Replace with your own key
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Background removal failed.");
    }

    const blob = await response.blob();
    downloadURL = URL.createObjectURL(blob);

    resultDiv.innerHTML = `
      <img src="${downloadURL}" alt="Background Removed" style="max-width:100%; height:auto;">
    `;
    downloadBtn.style.display = "inline-block";
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p>Failed to remove background. Try again.</p>`;
  }
});

// Download background-removed image
downloadBtn.addEventListener("click", () => {
  if (downloadURL) {
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = "background_removed.png";
    a.click();
  }
});

// Reset UI
resetBtn.addEventListener("click", () => {
  imageInput.value = "";
  uploadedFile = null;
  resultDiv.innerHTML = `<p>No Images Processed yet</p>`;
  downloadBtn.style.display = "none";
  uploadArea.style.backgroundColor = "antiquewhite";
});
