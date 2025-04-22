document.getElementById('mode-switch').addEventListener('change', () => {
    document.body.classList.toggle('dark');
});

function analyze() {
    const name = document.getElementById('name').value;
    const birthYear = parseInt(document.getElementById('birth-year').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
    const weight = parseFloat(document.getElementById('weight').value);

    if (!name || !birthYear || !height || !weight) {
        alert('Please fill all fields.');
        return;
    }

    if (birthYear < 1900 || birthYear > 2025) {
        alert('Invalid birth year.');
        return;
    }

    // Show loading
    document.getElementById('input-panel').style.display = 'none';
    document.getElementById('loading-panel').style.display = 'block';

    setTimeout(() => {
        // Calculate age and BMI
        const currentYear = 2025;
        const age = currentYear - birthYear;
        const bmi = (weight / (height * height)).toFixed(1);

        // Determine status and health tip
        let statusClass, tip, reason;
        if (bmi < 18.5) {
            statusClass = 'underweight';
            tip = 'Increase your calorie intake with nutrient-rich foods.';
            reason = 'This helps build muscle mass and improve energy levels.';
        } else if (bmi >= 18.5 && bmi < 25) {
            statusClass = '';
            tip = 'Maintain a balanced diet and regular exercise.';
            reason = 'This keeps your body in optimal health.';
        } else if (bmi >= 25 && bmi < 30) {
            statusClass = 'overweight';
            tip = 'Incorporate cardio and strength training.';
            reason = 'This helps reduce excess weight and improve heart health.';
        } else {
            statusClass = 'obese';
            tip = 'Consult a nutritionist for a personalized plan.';
            reason = 'This ensures safe and sustainable weight management.';
        }

        // Update result panel
        document.getElementById('result-name').textContent = name;
        document.getElementById('status-bubble').className = `status-bubble ${statusClass}`;
        document.getElementById('tip-text').textContent = tip;
        document.getElementById('tip-reason').textContent = reason;

        // Animate age and BMI
        animateValue('result-age', 0, age, 1000);
        animateValue('result-bmi', 0, bmi, 1000);

        // Show result
        document.getElementById('loading-panel').style.display = 'none';
        document.getElementById('result-panel').style.display = 'block';
    }, 1500);
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
    document.getElementById('input-panel').style.display = 'block';
    document.getElementById('name').value = '';
    document.getElementById('birth-year').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
}