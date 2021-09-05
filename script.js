// Selectors
const imageContainer = document.querySelector(".image-container"),
  loader = document.querySelector(".loader");

// Global variables
let errorCounter = 0;
let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages;
let photosArray = [];

// API related variables
let initialCount = 20;
const apiKey = "yGS6PC5SN5izg-jNC1-j3fp1IOlTYPEulZaA613EoE8";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}&query=cats`;

function updateURLWithNewCount(newCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}&query=cats`;
}

// Check if all photos are loaded
function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Setting attributes on the DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Inserting photos into the DOM
function displayPhotos() {
  totalImages = photosArray.length;

  photosArray.forEach((photo) => {
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    img.addEventListener("load", imageLoaded);

    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Fetch photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();

    if (isInitialLoad) {
      updateURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    errorCounter < 0
      ? (getPhotos(), errorCounter++)
      : (console.log(error),
        (loader.hidden = true),
        (imageContainer.innerText = `Something is not working right, ${error}`));
  }
}

// Check if scrolling near bottom of the page and load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    imagesLoaded = 0;
    getPhotos();
  }
});

// On load
getPhotos();
