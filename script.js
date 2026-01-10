const sectionMap = {
    building: "sectionBuilding",
    "pastor-of-ars": "sectionPastor",
    community: "sectionCommunity",
    guestbook: "sectionGuestbook",
    heart: "sectionHeart",
    film: "sectionFilm",
    "plan-a-visit": "sectionVisit",
    gallery: "sectionGallery",
    "rent-space": "sectionRentSpace",
    info: "sectionInformation",
    privacy: "sectionPrivacy"
};

// Function to fetch the JSON data and update the captions
async function loadTranslations(lang) {
    const response = await fetch(`${lang}.json`); // Load the appropriate language JSON
    const data = await response.json();

    // Set the page title
    document.getElementById("page-title").innerText = data.title;

    // Update the overlay text for each grid item
    const overlays = document.querySelectorAll(".overlay");
    overlays[0].innerText = data.sectionCommunity.header;
    overlays[1].innerText = data.sectionFilm.header;
	overlays[2].innerText = data.sectionVisit.header;
    overlays[3].innerText = data.sectionPastor.header;
    overlays[4].innerText = data.sectionHeart.header;
	overlays[5].innerText = data.sectionBuilding.header;
    overlays[6].innerText = data.sectionGuestbook.header;
    overlays[7].innerText = data.sectionRentSpace.header; //was Gallery
    overlays[8].innerText = data.sectionInformation.header;
}

// Function to load content for the specific page
async function loadContent(section, lang) {
    const response = await fetch(`${lang}.json`); // Load the appropriate language JSON
    const data = await response.json();

    // Set the content title and text based on the section
    document.getElementById("content-header").innerText = data[section].header;
    document.getElementById("content-title").innerText = data[section].header;
    document.getElementById("content-text").innerHTML = data[section].content;

    // Check for additional content
    for (let i = 2; i <= 6; i++) {
        const contentText = document.getElementById(`content-text${i}`);
        if (contentText) {
            contentText.innerHTML = data[section][`content${i}`]; // Update content if it exists
        }
    }

    // back button
    const backText = data.back;
    const backButton = document.getElementById("back-link");
    if (backButton) {
        document.getElementById("back-link").textContent = `← ${backText}`;
    } 
}

// Function to handle language toggle
async function setupLanguageToggle() {
    const langToggles = document.querySelectorAll(".lang-toggle");
    langToggles.forEach((toggle) => {
        toggle.addEventListener("click", async () => {
            const selectedLang = toggle.getAttribute("data-lang");
            const pageName = window.location.pathname.split("/").pop().split(".")[0] || "index"; // Get the page name or default to 'index'
            localStorage.setItem("language", selectedLang); // Store the selected language
            console.log("pagename = -", pageName, "-");
            // Load translations for the selected language without reloading the page
            if (!pageName || pageName == "index") {
                await loadTranslations(selectedLang);
            }

            // const pageName = window.location.pathname.split('/').pop().split('.')[0]; // Get the page name without extension
            if (sectionMap[pageName]) {
                await loadContent(sectionMap[pageName], selectedLang); // Load content for the specific page
            }
        });
    });
}

// Load translations when the document is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    const lang = localStorage.getItem("language") || "nl"; // Default to Dutch
    const pageName = window.location.pathname.split("/").pop().split(".")[0] || "index"; // Get the page name or default to 'index'

    // Check if the pageName is empty, which indicates the default page
    if (!pageName || pageName === "index") {
        await loadTranslations(lang); // Load translations for the main page
    }

    if (sectionMap[pageName]) {
        console.log("section = -", sectionMap[pageName], "-");
        await loadContent(sectionMap[pageName], lang); // Load content for the specific page
    }

    setupLanguageToggle(); // Set up the language toggle functionality
});



