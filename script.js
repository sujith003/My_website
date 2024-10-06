// Toggle Dark Mode
const toggleButton = document.getElementById('darkModeToggle');
toggleButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    // Change button text based on dark mode status
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        toggleButton.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
});
// Select the navigation bar
const nav = document.querySelector('nav');
let lastScrollTop = 0; // Variable to store the last scroll position

window.addEventListener('scroll', function() {
    // Get the current scroll position
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Compare the current scroll position with the last scroll position
    if (currentScroll > lastScrollTop) {
        // Scrolling down
        nav.style.top = '-60px'; // Hide the nav (adjust height as necessary)
    } else {
        // Scrolling up
        nav.style.top = '0'; // Show the nav
    }
    lastScrollTop = currentScroll; // Update the last scroll position
});


// Function to open the popup
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}

// Function to close the popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Close the popup when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('popup')) {
        closePopup('popup1');
        closePopup('popup2');
    }
}


    window.onload = function() {
        document.querySelector('.loading-container').style.display = 'none'; // Hide loader on load
    };

