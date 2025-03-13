let currentVideoIndex = 0;
  let productDetails = [];

  // Initialize product details and video elements
  function initializeProductDetails() {
    const slides = document.querySelectorAll(".swiper-slide");
    slides.forEach((slide, index) => {
      const productHandle = slide.getAttribute("data-product-handle");
      const productInfo = slide.querySelector(".product-info");

      const videoSrc = slide.querySelector("video") ? slide.querySelector("video").src : null;

      if (productHandle) {
        const productTitle = slide.querySelector(".product-info h3");
        const productPrice = slide.querySelector(".product-info .product-price");
        const productId = slide.querySelector("form input[name='id']").value;

        if (productTitle && productPrice) {
          productDetails.push({
            title: productTitle.textContent,
            price: productPrice.textContent,
            id: productId,
            videoSrc: videoSrc,
            hasProduct: true
          });
        }

        // Show product info if product handle exists
        if (productInfo) {
          productInfo.style.display = "block";
        }
      } else {
        // If no product handle exists, mark it as no product and hide product info
        productDetails.push({
          hasProduct: false,
          videoSrc: videoSrc || "{{ section.settings.default_video_url }}" // Assign a fallback video if no product handle
        });

        if (productInfo) {
          productInfo.style.display = "none"; // Hides the product details
        }
      }
    });
  }

  function repeatVideo(videoElement) {
    videoElement.currentTime = 0;
    videoElement.play();
  }

  function openPopup(videoElement) {
    const popup = document.getElementById("reelPopup");
    const popupVideo = document.getElementById("popupVideo");
    const popupLogo = document.getElementById("popupLogo");
    const popupProductTitle = document.getElementById("popupProductTitle");
    const popupProductPrice = document.getElementById("popupProductPrice");
    const popupAddToCartForm = document.getElementById("popupAddToCartForm");
    const popupProductId = document.getElementById("popupProductId");

    const reelWrapper = videoElement.closest(".swiper-slide");
    currentVideoIndex = Array.from(reelWrapper.closest('.swiper-wrapper').children).indexOf(reelWrapper);
    const product = productDetails[currentVideoIndex];

    // Check if video source is valid; fallback if undefined
    popupVideo.src = product.videoSrc || "{{ section.settings.default_video_url }}"; 
    popupLogo.src = "{{ section.settings.logo_url }}";

    if (product.hasProduct) {
      // Show product details
      popupProductTitle.textContent = product.title;
      popupProductPrice.textContent = product.price;
      popupProductId.value = product.id;
      popupAddToCartForm.style.display = "block";
      popupProductDetails.style.display = "block";
    } else {
      // Show "Product not available" when there's no product
      popupProductTitle.textContent = "Product not available";
      popupProductPrice.textContent = "";
      popupProductId.value = "";
      popupAddToCartForm.style.display = "none";  // Hide the add to cart form
      popupProductDetails.style.display = "none";
    }

    popup.classList.add("active");
  }

  function closePopup() {
    const popup = document.getElementById("reelPopup");
    const popupVideo = document.getElementById("popupVideo");
    popup.classList.remove("active");
    popupVideo.pause();
    popupVideo.src = "";
  }

  function toggleMute() {
    const popupVideo = document.getElementById("popupVideo");
    const muteToggle = document.querySelector(".popup-mute");
    if (popupVideo.muted) {
      popupVideo.muted = false;
      muteToggle.classList.replace("fa-volume-mute", "fa-volume-up");
    } else {
      popupVideo.muted = true;
      muteToggle.classList.replace("fa-volume-up", "fa-volume-mute");
    }
  }

  function toggleFullscreen() {
    const popupVideo = document.getElementById("popupVideo");
    if (popupVideo.requestFullscreen) {
      popupVideo.requestFullscreen();
    } else if (popupVideo.webkitRequestFullscreen) {
      popupVideo.webkitRequestFullscreen();
    } else if (popupVideo.msRequestFullscreen) {
      popupVideo.msRequestFullscreen();
    }
  }

  function shareVideo() {
    const popupVideo = document.getElementById("popupVideo");
    const videoUrl = popupVideo.src;
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this video!",
          url: videoUrl,
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch(console.error);
    } else {
      alert("Sharing not supported on this browser.");
    }
  }

  function togglePosition() {
    const popupContent = document.querySelector(".popup-content");
    const popup = document.getElementById("reelPopup");
    popupContent.classList.toggle("video-bottom-right");
    popup.classList.toggle("bottom_rightwidth");
  }

  function nextVideo() {
    if (currentVideoIndex < productDetails.length - 1) {
      currentVideoIndex++;
      updatePopupContent();
    }
  }

  function prevVideo() {
    if (currentVideoIndex > 0) {
      currentVideoIndex--;
      updatePopupContent();
    }
  }

  function updatePopupContent() {
    const popupVideo = document.getElementById("popupVideo");
    const popupProductTitle = document.getElementById("popupProductTitle");
    const popupProductPrice = document.getElementById("popupProductPrice");
    const popupProductId = document.getElementById("popupProductId");
    const popupAddToCartForm = document.getElementById("popupAddToCartForm");

    const product = productDetails[currentVideoIndex];

    // Check if video source is valid; fallback if undefined
    popupVideo.src = product.videoSrc || "{{ section.settings.default_video_url }}"; 
    if (product.hasProduct) {
      // Show product details
      popupProductTitle.textContent = product.title;
      popupProductPrice.textContent = product.price;
      popupProductId.value = product.id;
      popupAddToCartForm.style.display = "block";  // Show the add to cart form
      popupProductDetails.style.display = "block";
    } else {
      // Show "Product not available" when there's no product
      popupProductTitle.textContent = "Product not available";
      popupProductPrice.textContent = "";
      popupProductId.value = "";
      popupAddToCartForm.style.display = "none";  // Hide the add to cart form
      popupProductDetails.style.display = "none";
    }
    popupVideo.play();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initializeProductDetails();

    const swiper = new Swiper(".swiper-container", {
      slidesPerView: 2,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        1024: {
          slidesPerView: {{ section.settings.laptop-pc_slides }},
        },
        768: {
          slidesPerView: {{ section.settings.tablet_slides }},
        },
        480: {
          slidesPerView: {{ section.settings.mobile_slides }},
        }
      },
      loop: false,
    });
  });

// Check if in theme editor (Shopify Design Mode)
if (window.Shopify && Shopify.designMode) {
    // Listen for section changes and reinitialize the JavaScript with the new settings
    document.addEventListener('shopify:section:load', function(event) {
        var sectionSettings = {{ section.settings | json }};
        initCustomReels(sectionSettings);
    });

    document.addEventListener('shopify:section:unload', function(event) {
        // Cleanup if necessary
    });
}
