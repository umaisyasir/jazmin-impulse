document.addEventListener('DOMContentLoaded', function() {
  const marqueeContainer = document.querySelector('.marquee-container');
  const marqueeWrapper = document.querySelector('.marquee-wrapper');
  const collectionLists = document.querySelectorAll('.collection-list');

  // Clone the content to avoid breaks
  collectionLists.forEach(list => {
    marqueeWrapper.appendChild(list.cloneNode(true));
  });

  let isDragging = false;
  let startX;
  let scrollLeft;

  // Handle swipe functionality
  marqueeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - marqueeContainer.offsetLeft;
    scrollLeft = marqueeContainer.scrollLeft;
  });

  marqueeContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - marqueeContainer.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed as needed
    marqueeContainer.scrollLeft = scrollLeft - walk;
  });

  marqueeContainer.addEventListener('mouseup', () => {
    isDragging = false;
  });

  marqueeContainer.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  marqueeContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - marqueeContainer.offsetLeft;
    scrollLeft = marqueeContainer.scrollLeft;
  });

  marqueeContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - marqueeContainer.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed as needed
    marqueeContainer.scrollLeft = scrollLeft - walk;
  });

  marqueeContainer.addEventListener('touchend', () => {
    isDragging = false;
  });

  marqueeContainer.addEventListener('touchcancel', () => {
    isDragging = false;
  });
});
