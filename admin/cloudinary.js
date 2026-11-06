const cloudName = "nhr2un1n";
const uploadPreset = "goldenstack_hub_projects";

const imageInput = document.getElementById("project-image");
const uploadMessage = document.getElementById("upload-message");
const imagePreview = document.getElementById("image-preview");

window.uploadedImageUrl = "";

imageInput.addEventListener("change", async function () {
    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    window.uploadedImageUrl = "";
    imagePreview.style.display = "none";
    uploadMessage.textContent = "";

    if (!file.type.startsWith("image/")) {
        uploadMessage.textContent = "Please select an image file.";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        uploadMessage.textContent = "Image size must not exceed 5MB.";
        return;
    }

    uploadMessage.textContent = "Uploading image...";
    imageInput.disabled = true;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const controller = new AbortController();
    const timeout = setTimeout(function () {
        controller.abort();
    }, 60000);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
                signal: controller.signal
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Cloudinary upload failed.");
        }

        window.uploadedImageUrl = data.secure_url;

        imagePreview.src = data.secure_url;
        imagePreview.style.display = "block";

        uploadMessage.textContent = "Image uploaded successfully!";

    } catch (error) {
        window.uploadedImageUrl = "";

        if (error.name === "AbortError") {
            uploadMessage.textContent = "Upload timed out. Check your internet connection and try again.";
        } else {
            uploadMessage.textContent = error.message || "Something went wrong during upload.";
        }

    } finally {
        clearTimeout(timeout);
        imageInput.disabled = false;
    }
});
