// Particle Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    update(status) {
        this.x += this.speedX * (status === 'obese' ? 3 : status === 'overweight' ? 2 : status === 'underweight' ? 1.5 : 1);
        this.y += this.speedY * (status === 'obese' ? 3 : status === 'overweight' ? 2 : status === 'underweight' ? 1.5 : 1);
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = document.body.classList.contains('dark') ? `rgba(0, 255, 136, ${this.opacity})` : `rgba(0, 123, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles(status) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update(status);
        particle.draw();
    });
    requestAnimationFrame(() => animateParticles(status));
}

initParticles();
animateParticles('initial');

// Event Listeners
document.getElementById('mode-switch').addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

document.getElementById('height-unit').addEventListener('change', (e) => {
    const unit = e.target.value;
    document.getElementById('height-cm').style.display = unit === 'cm' ? 'block' : 'none';
    document.getElementById('height-ft').style.display = unit === 'ft-in' ? 'block' : 'none';
    document.getElementById('height-in').style.display = unit === 'ft-in' ? 'block' : 'none';
});

document.getElementById('weight-unit').addEventListener('change', (e) => {
    const unit = e.target.value;
    document.getElementById('weight-kg').style.display = unit === 'kg' ? 'block' : 'none';
    document.getElementById('weight-lbs').style.display = unit === 'lbs' ? 'block' : 'none';
});

document.querySelectorAll('.input-panel input').forEach(input => {
    input.addEventListener('input', () => {
        document.body.classList.add('input-active');
    });
});

function analyze() {
    const name = document.getElementById('name').value;
    const birthYear = parseInt(document.getElementById('birth-year').value);
    const heightUnit = document.getElementById('height-unit').value;
    const weightUnit = document.getElementById('weight-unit').value;

    let heightCm, weightKg;

    if (heightUnit === 'cm') {
        heightCm = parseFloat(document.getElementById('height-cm').value);
    } else {
        const feet = parseFloat(document.getElementById('height-ft').value) || 0;
        const inches = parseFloat(document.getElementById('height-in').value) || 0;
        heightCm = (feet * 30.48) + (inches * 2.54);
    }

    if (weightUnit === 'kg') {
        weightKg = parseFloat(document.getElementById('weight-kg').value);
    } else {
        weightKg = parseFloat(document.getElementById('weight-lbs').value) * 0.453592;
    }

    if (!name || !birthYear || !heightCm || !weightKg) {
        alert('Please fill all fields.');
        return;
    }

    if (birthYear < 1900 || birthYear > 2025) {
        alert('Invalid birth year.');
        return;
    }

    if (heightCm < 50 || heightCm > 300 || weightKg < 10 || weightKg > 500) {
        alert('Invalid height or weight.');
        return;
    }

    // Show loading
    document.getElementById('input-panel').style.display = 'none';
    document.getElementById('loading-panel').style.display = 'block';
    document.getElementById('card').classList.remove('result-shown');
    document.body.classList.remove('input-active', 'normal', 'underweight', 'overweight', 'obese');
    document.body.classList.add('loading');

    setTimeout(() => {
        // Calculate age and BMI
        const currentYear = 2025;
        const age = currentYear - birthYear;
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        // Determine status and health tip
        let statusClass, tip, reason, statusText;
        if (bmi < 18.5) {
            statusClass = 'underweight';
            statusText = 'Underweight';
            tip = 'Increase calorie intake with nutrient-rich foods like nuts and avocados.';
            reason = 'This helps build muscle mass and boosts energy levels safely.';
        } else if (bmi >= 18.5 && bmi < 25) {
            statusClass = 'normal';
            statusText = 'Normal';
            tip = 'Maintain a balanced diet with regular exercise (30 min/day).';
            reason = 'This optimizes overall health and prevents chronic issues.';
        } else if (bmi >= 25 && bmi < 30) {
            statusClass = 'overweight';
            statusText = 'Overweight';
            tip = 'Incorporate cardio (e.g., running) and strength training weekly.';
            reason = 'This reduces excess weight and improves cardiovascular health.';
        } else {
            statusClass = 'obese';
            statusText = 'Obese';
            tip = 'Consult a nutritionist for a tailored weight management plan.';
            reason = 'This ensures safe, sustainable progress with professional guidance.';
        }

        // Update result panel
        document.getElementById('result-name').textContent = name;
        const resultCard = document.querySelector('.result-card');
        resultCard.className = `result-card ${statusClass}`;
        document.getElementById('status-bubble').className = `status-bubble ${statusClass}`;
        document.getElementById('tip-text').textContent = tip;
        document.getElementById('tip-reason').textContent = reason;

        // Generate share link
        const shareLink = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}&age=${age}&bmi=${bmi}&status=${statusClass}`;
        document.getElementById('share-link').value = shareLink;

        // Update share icons
        const shareText = `My LifePulse Scan: ${name}, Age ${age}, BMI ${bmi} (${statusText}). Check yours!`;
        document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareLink)}`;
        document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;

        // Animate age and BMI
        animateValue('result-age', 0, age, 1000);
        animateValue('result-bmi', 0, bmi, 1000);

        // Show result
        document.getElementById('loading-panel').style.display = 'none';
        document.getElementById('result-panel').style.display = 'flex';
        document.getElementById('card').classList.add('result-shown');
        document.body.classList.remove('loading');
        document.body.classList.add(statusClass);
        animateParticles(statusClass);
    }, 2000);
}

function copyLink() {
    const shareLink = document.getElementById('share-link');
    shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function animateValue(id, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = start + progress * (end - start);
        document.getElementById(id).textContent = value.toFixed(id === 'result-bmi' ? 1 : 0);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

function reset() {
    document.getElementById('result-panel').style.display = 'none';
    document.getElementById('input-panel').style.display = 'flex';
    document.getElementById('card').classList.remove('result-shown');
    document.body.classList.remove('input-active', 'normal', 'underweight', 'overweight', 'obese');
    document.getElementById('name').value = '';
    document.getElementById('birth-year').value = '';
    document.getElementById('height-cm').value = '';
    document.getElementById('height-ft').value = '';
    document.getElementById('height-in').value = '';
    document.getElementById('weight-kg').value = '';
    document.getElementById('weight-lbs').value = '';
    document.getElementById('height-unit').value = 'cm';
    document.getElementById('weight-unit').value = 'kg';
    document.getElementById('height-cm').style.display = 'block';
    document.getElementById('height-ft').style.display = 'none';
    document.getElementById('height-in').style.display = 'none';
    document.getElementById('weight-kg').style.display = 'block';
    document.getElementById('weight-lbs').style.display = 'none';
    animateParticles('initial');
}

// Handle shared link
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('name') && params.has('age') && params.has('bmi') && params.has('status')) {
        const name = params.get('name');
        const age = parseInt(params.get('age'));
        const bmi = parseFloat(params.get('bmi'));
        const statusClass = params.get('status');

        document.getElementById('input-panel').style.display = 'none';
        document.getElementById('result-panel').style.display = 'flex';
        document.getElementById('card').classList.add('result-shown');
        document.body.classList.add(statusClass);
        animateParticles(statusClass);

        document.getElementById('result-name').textContent = name;
        document.getElementById('result-age').textContent = age;
        document.getElementById('result-bmi').textContent = bmi.toFixed(1);
        document.querySelector('.result-card').className = `result-card ${statusClass}`;
        document.getElementById('status-bubble').className = `status-bubble ${statusClass}`;

        let tip, reason;
        if (statusClass === 'underweight') {
            tip = 'Increase calorie intake with nutrient-rich foods like nuts and avocados.';
            reason = 'This helps build muscle mass and boosts energy levels safely.';
        } else if (statusClass === 'normal') {
            tip = 'Maintain a balanced diet with regular exercise (30 min/day).';
            reason = 'This optimizes overall health and prevents chronic issues.';
        } else if (statusClass === 'overweight') {
            tip = 'Incorporate cardio (e.g., running) and strength training weekly.';
            reason = 'This reduces excess weight and improves cardiovascular health.';
        } else {
            tip = 'Consult a nutritionist for a tailored weight management plan.';
            reason = 'This ensures safe, sustainable progress with professional guidance.';
        }

        document.getElementById('tip-text').textContent = tip;
        document.getElementById('tip-reason').textContent = reason;

        const shareLink = window.location.href;
        document.getElementById('share-link').value = shareLink;
        const shareText = `My LifePulse Scan: ${name}, Age ${age}, BMI ${bmi} (${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}). Check yours!`;
        document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareLink)}`;
        document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
    }
};
