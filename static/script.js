let currentLang = 'en';
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 50 : 100;

function initParticles(status) {
    const particlesDiv = document.getElementById('particles');
    particlesDiv.innerHTML = '';
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full';
        particle.style.width = `${Math.random() * 4 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = status === 'normal' ? 'rgba(40, 167, 69, 0.5)' :
                                  status === 'underweight' ? 'rgba(255, 193, 7, 0.5)' :
                                  status === 'overweight' ? 'rgba(220, 53, 69, 0.5)' :
                                  status === 'obese' ? 'rgba(255, 87, 34, 0.5)' : 'rgba(0, 255, 136, 0.5)';
        particlesDiv.appendChild(particle);
    }

    anime({
        targets: '#particles div',
        translateX: () => anime.random(-window.innerWidth / 2, window.innerWidth / 2),
        translateY: () => anime.random(-window.innerHeight / 2, window.innerHeight / 2),
        scale: [0.5, 1.5],
        opacity: [0.2, 0.8],
        duration: 5000,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate'
    });
}

function animateButton() {
    anime({
        targets: '.copy-btn, .submit-btn',
        scale: [1, 1.1],
        duration: 1000,
        loop: true,
        easing: 'easeInOutQuad',
        direction: 'alternate'
    });
}

function animateCard() {
    anime({
        targets: '.card',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutQuad'
    });
}

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`).classList.add('active');
    fetch('/bmi', { method: 'POST', body: JSON.stringify({ lang }) });
}

function copyLink() {
    const shareLink = document.getElementById('share-link').value;
    const name = document.querySelector('.result-card p:nth-child(1)').textContent.split(': ')[1];
    const age = document.querySelector('.result-card p:nth-child(2)').textContent.split(': ')[1].split(' ')[0];
    const bmi = document.querySelector('.result-card p:nth-child(3)').textContent.split(': ')[1];
    const status = document.querySelector('.result-card p:nth-child(4)').textContent.split(': ')[1];
    const cardText = currentLang === 'en' ?
        `Link copied! Share your LifePulse Scan:\nLifePulse Scan\nName: ${name}\nAge: ${age} years\nBMI: ${bmi}\nStatus: ${status}` :
        `লিঙ্ক কপি করা হয়েছে! আপনার লাইফপালস স্ক্যান শেয়ার করুন:\nলাইফপালস স্ক্যান\nনাম: ${name}\nবয়স: ${age} বছর\nবিএমআই: ${bmi}\nঅবস্থা: ${status}`;
    navigator.clipboard.writeText(shareLink);
    const alertDiv = document.getElementById('copy-alert');
    alertDiv.textContent = cardText;
    alertDiv.classList.remove('hidden');
    anime({
        targets: '#copy-alert',
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
            setTimeout(() => {
                anime({
                    targets: '#copy-alert',
                    opacity: 0,
                    duration: 500,
                    easing: 'easeInOutQuad',
                    complete: () => alertDiv.classList.add('hidden')
                });
            }, 5000);
        }
    });
}

function updateMetaTags(name, age, bmi, status) {
    const title = currentLang === 'en' ? `LifePulse Scan for ${name}` : `লাইফপালস স্ক্যান: ${name}`;
    const description = currentLang === 'en' ?
        `Name: ${name}, Age: ${age} years, BMI: ${bmi}, Status: ${status}. Check yours!` :
        `নাম: ${name}, বয়স: ${age} বছর, বিএমআই: ${bmi}, অবস্থা: ${status}. আপনারটা পরীক্ষা করুন!`;
    const metaTags = [
        { selector: 'meta[property="og:title"]', value: title },
        { selector: 'meta[property="og:description"]', value: description },
        { selector: 'meta[property="og:url"]', value: window.location.href },
        { selector: 'meta[name="twitter:title"]', value: title },
        { selector: 'meta[name="twitter:description"]', value: description }
    ];
    metaTags.forEach(tag => {
        const element = document.querySelector(tag.selector);
        if (element) element.setAttribute('content', tag.value);
    });
}

document.getElementById('mode-switch').addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

window.addEventListener('load', () => {
    initParticles('initial');
    animateButton();
    animateCard();
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status) initParticles(status);
});
