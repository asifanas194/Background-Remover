let canvas, ctx;

window.onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
};

async function removeBackground() {
  const loader = document.getElementById("loader");
  const downloadBtn = document.getElementById("downloadBtn");
  const fileInput = document.getElementById("fileInput").files[0];

  if (!fileInput) {
    alert("Please select an image first.");
    return;
  }

  loader.style.display = "block";

  const reader = new FileReader();
  reader.readAsDataURL(fileInput);

  reader.onload = async function () {
    const imageData = reader.result;

    // Base64 encoded data ko API ke liye prepare karte hain
    const base64Data = imageData.split(",")[1]; // Base64 string extraction

    try {
      console.log("Sending request to remove.bg...");
      const response = await fetch(
        "https://api.remove.bg/v1.0/removebg",
        {
          method: "POST",
          headers: {
            "X-Api-Key": "X5bwc5v5xBWBtZ88p1BQ3ZNV", // Replace with your Remove.bg API Key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_file_b64: base64Data, // Send base64 encoded image
          }),
        }
      );

      console.log("Response status: ", response.status);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const blob = await response.blob();
      console.log("Processing image...");
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        loader.style.display = "none";
        downloadBtn.style.display = "block";

        console.log("Image drawn on canvas.");
      };
    } catch (error) {
      loader.style.display = "none";
      alert("Error during background removal. Please check console.");
      console.error("Error: ", error);
    }
  };
}

document.getElementById("downloadBtn").onclick = function () {
  const link = document.createElement("a");
  link.download = "background_removed.png";
  link.href = canvas.toDataURL();
  link.click();
};
