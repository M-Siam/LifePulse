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

    setTimeout(() => {
        // Calculate age and BMI
        const currentYear = 2025;
        const age = currentYear - birthYear;
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        // Determine status and health tip
        let statusClass, tip, reason;
        if (bmi < 18.5) {
            statusClass = 'underweight';
            tip = 'Increase calorie intake with nutrient-rich foods like nuts and avocados.';
            reason = 'This helps build muscle mass and boosts energy levels safely.';
        } else if (bmi >= 18.5 && bmi < 25) {
            statusClass = '';
            tip = 'Maintain a balanced diet with regular exercise (30 min/day).';
            reason = 'This optimizes overall health and prevents chronic issues.';
        } else if (bmi >= 25 && bmi < 30) {
            statusClass = 'overweight';
            tip = 'Incorporate cardio (e.g., running) and strength training weekly.';
            reason = 'This reduces excess weight and improves cardiovascular health.';
        } else {
            statusClass = 'obese';
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

        // Animate age and BMI
        animateValue('result-age', 0, age, 1000);
        animateValue('result-bmi', 0, bmi, 1000);

        // Show result
        document.getElementById('loading-panel').style.display = 'none';
        document.getElementById('result-panel').style.display = 'flex';
        document.getElementById('card').classList.add('result-shown');
    }, 2000);
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
}
