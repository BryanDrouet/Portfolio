const api = "AIzaSyCTaOFSLm6u9WbS_N7eswvN9DL7NjLVYuA";

let currentPage = 'pageIdentity';
const burger = document.getElementById('burgerMenu');
const navLinks = document.querySelector('.nav-links');

let mobileOverlay = document.getElementById('mobileOverlay');
if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.id = 'mobileOverlay';
    document.body.appendChild(mobileOverlay);
}
mobileOverlay.addEventListener('click', function(e) {
    if (e.target === mobileOverlay) {
        closeMobileMenu();
    }
});

function openMobileMenu() {
    navLinks.classList.add('active');
    mobileOverlay.classList.add('active');
    burger.classList.add('open');
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    mobileOverlay.classList.remove('active');
    burger.classList.remove('open');
}

burger.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) closeMobileMenu();
    else openMobileMenu();
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => setTimeout(closeMobileMenu, 50));
});

navLinks.addEventListener('click', (e) => e.stopPropagation());

function showPage(pageId) {
    const scrollPos = window.pageYOffset;
    history.replaceState({ page: currentPage, scroll: scrollPos }, '', '?page=' + currentPage);

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
            link.classList.add('active');
        }
    });
    currentPage = pageId;

    const footer = document.getElementById('footer');
    const activePage = document.getElementById(pageId);
    if (footer && activePage) {
        activePage.appendChild(footer);
    }

    history.pushState(null, '', '?page=' + pageId);
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'pageIdentity';

    showPage(page);

    if (history.state && history.state.scroll !== undefined) {
        window.scrollTo(0, history.state.scroll);
    }
});

window.addEventListener('popstate', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'pageIdentity';

    showPage(page);

    if (event.state && event.state.scroll !== undefined) {
        window.scrollTo(0, event.state.scroll);
    }
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.bg-shapes');
    const speed = scrolled * 0.5;
    parallax.style.setProperty('--parallax-offset', `${speed}px`);
});

let lastSentTime = 0;

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const markdownContent = this.message.value;

    const now = Date.now();
    if (now - lastSentTime < 60000) { 
        alert("Veuillez patienter une minute entre chaque message.");
        return;
    }

    const date = new Date();

    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${dayName} ${dayNumber} ${monthName} ${year} à ${hours}h${minutes}`;

    const htmlContent = marked.parse(markdownContent);

    const formData = {
        prenom: this.name.value,
        nom: this.subname.value,
        email: this.email.value,
        sujet: this.subject.value,
        message: markdownContent, 
        messageHtml: htmlContent,
        time: formattedDate
    };

    emailjs.send('service_osb091k', 'template_q6xtnde', formData)
        .then(() => {
            showSuccessMessage();
            this.reset();
            lastSentTime = Date.now();
        }, (error) => {
            alert("Erreur lors de l'envoi, merci de réessayer plus tard.");
            console.error(error);
        });
});

function showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.classList.add('success-msg');
    successMsg.innerHTML = 'Message envoyé avec succès !<br>Nous vous répondrons bientôt.';
    document.body.appendChild(successMsg);

    setTimeout(() => successMsg.classList.add('show'), 10);
    setTimeout(() => {
        successMsg.classList.remove('show');
        successMsg.classList.add('hide');
        setTimeout(() => successMsg.remove(), 300);
    }, 3500);
}

function updateLogoText() {
    const logoText = document.querySelector('.textLogo');
    logoText.textContent = "Portfolio Bryan Drouet";
    if (window.innerWidth <= 416) {
        logoText.textContent = "Mon Portfolio";
    } else if (window.innerWidth <= 768) {
        logoText.textContent = "Portfolio Bryan Drouet";
    } else if (window.innerWidth <= 820) {
        logoText.textContent = "Mon Portfolio";
    } else {
        logoText.textContent = "Portfolio Bryan Drouet";
    } 
}

window.addEventListener('resize', updateLogoText);
window.addEventListener('DOMContentLoaded', updateLogoText);

function plan() {
    const lieu = document.getElementById('plan').value;
    const errorDiv = document.getElementById('map-error1');
    errorDiv.innerHTML = "&nbsp;";

    if (!lieu.trim()) {
        errorDiv.innerHTML = "<strong>Adresse requise.</strong>";
        return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: lieu }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const url = `https://www.google.com/maps/embed/v1/place?key=${api}&q=${encodeURIComponent(lieu)}&zoom=13`;
            document.getElementById('map-iframe').src = url;
        } else {
            errorDiv.innerHTML = `<strong>Erreur Recherche :</strong> <span>Lieu introuvable ou requête invalide (<span class="error-status">${status}</span>)</span>`;
        }
    });
}

function itineraire() {
    const depart = document.getElementById('depart').value;
    const arrivee = document.getElementById('arrivee').value;
    const errorDiv = document.getElementById('map-error2');
    errorDiv.innerHTML = "&nbsp;";

    if (!depart.trim() || !arrivee.trim()) {
        errorDiv.innerHTML = "<strong>Veuillez saisir les deux adresses.</strong>";
        return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: depart }, (resultsDep, statusDep) => {
        if (statusDep !== 'OK' || !resultsDep[0]) {
            errorDiv.innerHTML = `<strong>Erreur Itinéraire :</strong> <span>Adresse de départ invalide (<span class="error-status">${statusDep}</span>)</span>`;
            return;
        }
        geocoder.geocode({ address: arrivee }, (resultsArr, statusArr) => {
            if (statusArr !== 'OK' || !resultsArr[0]) {
                errorDiv.innerHTML = `<strong>Erreur Itinéraire :</strong> <span>Adresse d'arrivée invalide (<span class="error-status">${statusArr}</span>)</span>`;
                return;
            }
            const url = `https://www.google.com/maps/embed/v1/directions?origin=${encodeURIComponent(depart)}&destination=${encodeURIComponent(arrivee)}&key=${api}`;
            document.getElementById('map-iframe').src = url;
        });
    });
}

function streetView() {
    const geocoder = new google.maps.Geocoder();
    const lieu = document.getElementById('plan').value;
    const errorDiv = document.getElementById('map-error1');
    errorDiv.innerHTML = "&nbsp;";

    if (!lieu.trim()) {
        errorDiv.innerHTML = "<strong>Veuillez d'abord rechercher une adresse.</strong>";
        return;
    }

    geocoder.geocode({ address: lieu }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            const url = `https://www.google.com/maps/embed/v1/streetview?key=${api}&location=${lat},${lng}&heading=210&pitch=10&fov=90`;
            document.getElementById('map-iframe').src = url;
        } else {
            errorDiv.innerHTML = `<strong>Erreur Street View :</strong> <span>Lieu introuvable ou requête invalide (<span class="error-status">${status}</span>)</span>`;
        }
    });
}
