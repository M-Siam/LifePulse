// Particle Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 50 : 100;
let frameCount = 0;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.6 + 0.4;
    }

    update(status) {
        const multiplier = status === 'obese' ? 4 : status === 'overweight' ? 3 : status === 'underweight' ? 2 : 1;
        this.x += this.speedX * multiplier;
        this.y += this.speedY * multiplier;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw(status) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        let color;
        if (document.body.classList.contains('dark')) {
            color = status === 'normal' ? 'rgba(40, 167, 69, ' : status === 'underweight' ? 'rgba(255, 193, 7, ' :
                    status === 'overweight' ? 'rgba(220, 53, 69, ' : status === 'obese' ? 'rgba(255, 87, 34, ' : 'rgba(0, 255, 136, ';
        } else {
            color = status === 'normal' ? 'rgba(40, 167, 69, ' : status === 'underweight' ? 'rgba(255, 193, 7, ' :
                    status === 'overweight' ? 'rgba(220, 53, 69, ' : status === 'obese' ? 'rgba(255, 87, 34, ' : 'rgba(0, 123, 255, ';
        }
        ctx.fillStyle = color + this.opacity + ')';
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
    frameCount++;
    if (isMobile && frameCount % 3 === 0) {
        requestAnimationFrame(() => animateParticles(status));
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update(status);
        particle.draw(status);
    });
    requestAnimationFrame(() => animateParticles(status));
}

initParticles();
animateParticles('initial');

// Language Data
const langData = {
    en: {
        title: 'LifePulse',
        subtitle: 'Analyzing Your Life Energy...',
        nameInput: 'Name',
        birthYear: 'Birth Year',
        height: 'Height',
        weight: 'Weight',
        name: 'Name:',
        age: 'Age:',
        years: 'years',
        bmi: 'BMI:',
        healthDirective: 'Health Directive',
        whyHappened: 'Why This Happened',
        goodAspects: 'Good Aspects',
        badAspects: 'Bad Aspects',
        futureInstructions: 'Future Instructions',
        shareResults: 'Share Your Results',
        previewTitle: 'LifePulse Scan',
        previewYears: 'years',
        loadingText: 'Scanning Life Energy...',
        resultTitle: 'Life Energy Scan',
        copySuccess: 'Link copied! Share your LifePulse Scan:\nLifePulse Scan\nName: %name%\nAge: %age% %years%\nBMI: %bmi%\nStatus: %status%',
        normal: {
            status: 'Normal',
            tip: 'Maintain a balanced diet with regular exercise (30 min/day).',
            reason: 'This optimizes overall health and prevents chronic issues.',
            why: 'Your BMI indicates a healthy weight, likely due to balanced nutrition and active lifestyle.',
            good: 'A normal BMI supports cardiovascular health, energy levels, and longevity.',
            bad: 'No significant risks, but avoid extreme diets or inactivity to maintain this balance.',
            future: 'Continue with 150 min/week of moderate exercise (e.g., brisk walking) and a diet rich in vegetables, lean proteins, and whole grains.'
        },
        underweight: {
            status: 'Underweight',
            tip: 'Increase calorie intake with nutrient-rich foods like nuts and avocados.',
            reason: 'This helps build muscle mass and boosts energy levels safely.',
            why: 'Your low BMI may result from high metabolism, inadequate calorie intake, or stress.',
            good: 'You may have high energy efficiency, but focus on gaining healthy weight.',
            bad: 'Underweight status can lead to weakened immunity, fatigue, and fertility issues.',
            future: 'Eat frequent, small meals with protein (e.g., eggs, chicken), healthy fats, and consult a dietitian for a 500–1000 kcal/day surplus.'
        },
        overweight: {
            status: 'Overweight',
            tip: 'Incorporate cardio (e.g., running) and strength training weekly.',
            reason: 'This reduces excess weight and improves cardiovascular health.',
            why: 'Your BMI suggests excess body fat, possibly due to sedentary habits or high-calorie diet.',
            good: 'You have a foundation to build fitness; small changes can yield big results.',
            bad: 'Overweight status increases risks of diabetes, hypertension, and joint issues.',
            future: 'Aim for 300 min/week of mixed cardio and strength exercises, reduce processed foods, and track calories to create a 500 kcal/day deficit.'
        },
        obese: {
            status: 'Obese',
            tip: 'Consult a nutritionist for a tailored weight management plan.',
            reason: 'This ensures safe, sustainable progress with professional guidance.',
            why: 'Your high BMI likely stems from prolonged calorie surplus, low activity, or genetic factors.',
            good: 'Taking action now can significantly improve your health trajectory.',
            bad: 'Obesity heightens risks of heart disease, stroke, and metabolic disorders.',
            future: 'Work with a healthcare provider for a personalized plan, start with low-impact exercise (e.g., swimming), and focus on whole foods with a 500–1000 kcal/day deficit.'
        }
    },
    bn: {
        title: 'লাইফপালস',
        subtitle: 'আপনার জীবনী শক্তি বিশ্লেষণ করা হচ্ছে...',
        nameInput: 'নাম',
        birthYear: 'জন্ম সাল',
        height: 'উচ্চতা',
        weight: 'ওজন',
        name: 'নাম:',
        age: 'বয়স:',
        years: 'বছর',
        bmi: 'বিএমআই:',
        healthDirective: 'স্বাস্থ্য নির্দেশনা',
        whyHappened: 'কেন এটি ঘটেছে',
        goodAspects: 'ভালো দিক',
        badAspects: 'খারাপ দিক',
        futureInstructions: 'ভবিষ্যৎ নির্দেশনা',
        shareResults: 'আপনার ফলাফল শেয়ার করুন',
        previewTitle: 'লাইফপালস স্ক্যান',
        previewYears: 'বছর',
        loadingText: 'জীবনী শক্তি স্ক্যান করা হচ্ছে...',
        resultTitle: 'জীবনী শক্তি স্ক্যান',
        copySuccess: 'লিঙ্ক কপি করা হয়েছে! আপনার লাইফপালস স্ক্যান শেয়ার করুন:\nলাইফপালস স্ক্যান\nনাম: %name%\nবয়স: %age% %years%\nবিএমআই: %bmi%\nঅবস্থা: %status%',
        normal: {
            status: 'স্বাভাবিক',
            tip: 'নিয়মিত ব্যায়াম (প্রতিদিন ৩০ মিনিট) এবং সুষম খাদ্য বজায় রাখুন।',
            reason: 'এটি সামগ্রিক স্বাস্থ্য উন্নত করে এবং দীর্ঘমেয়াদী রোগ প্রতিরোধ করে।',
            why: 'আপনার বিএমআই স্বাস্থ্যকর ওজন নির্দেশ করে, যা সম্ভবত সুষম পুষ্টি এবং সক্রিয় জীবনযাপনের ফল।',
            good: 'স্বাভাবিক বিএমআই হৃদরোগের স্বাস্থ্য, শক্তির মাত্রা এবং দীর্ঘায়ু সমর্থন করে।',
            bad: 'কোনো উল্লেখযোগ্য ঝুঁকি নেই, তবে চরম ডায়েট বা নিষ্ক্রিয়তা এড়িয়ে এই ভারসাম্য বজায় রাখুন।',
            future: 'সপ্তাহে ১৫০ মিনিট মাঝারি ব্যায়াম (যেমন, দ্রুত হাঁটা) চালিয়ে যান এবং শাকসবজি, চর্বিহীন প্রোটিন এবং পূর্ণ শস্য সমৃদ্ধ খাদ্য গ্রহণ করুন।'
        },
        underweight: {
            status: 'কম ওজন',
            tip: 'বাদাম এবং অ্যাভোকাডোর মতো পুষ্টিকর খাবার দিয়ে ক্যালোরি গ্রহণ বাড়ান।',
            reason: 'এটি পেশী ভর বাড়াতে এবং নিরাপদে শক্তির মাত্রা বৃদ্ধি করতে সহায়তা করে।',
            why: 'আপনার কম বিএমআই উচ্চ বিপাক, অপর্যাপ্ত ক্যালোরি গ্রহণ বা মানসিক চাপের কারণে হতে পারে।',
            good: 'আপনার শক্তির দক্ষতা বেশি হতে পারে, তবে স্বাস্থ্যকর ওজন বাড়ানোর দিকে মনোযোগ দিন।',
            bad: 'কম ওজনের অবস্থা রোগ প্রতিরোধ ক্ষমতা দুর্বল করতে, ক্লান্তি সৃষ্টি করতে এবং প্রজনন সমস্যা সৃষ্টি করতে পারে।',
            future: 'প্রোটিন সমৃদ্ধ (যেমন, ডিম, মুরগি) এবং স্বাস্থ্যকর চর্বিযুক্ত ঘন ঘন ছোট খাবার খান এবং প্রতিদিন ৫০০–১০০০ ক্যালোরি উদ্বৃত্তের জন্য একজন ডায়েটিশিয়ানের সাথে পরামর্শ করুন।'
        },
        overweight: {
            status: 'অতিরিক্ত ওজন',
            tip: 'সাপ্তাহিক কার্ডিও (যেমন, দৌড়) এবং শক্তি প্রশিক্ষণ অন্তর্ভুক্ত করুন।',
            reason: 'এটি অতিরিক্ত ওজন কমায় এবং হৃদরোগের স্বাস্থ্য উন্নত করে।',
            why: 'আপনার বিএমআই অতিরিক্ত শরীরের চর্বি নির্দেশ করে, সম্ভবত নিষ্ক্রিয় অভ্যাস বা উচ্চ-ক্যালোরি খাদ্যের কারণে।',
            good: 'আপনার ফিটনেস গড়ে তোলার ভিত্তি রয়েছে; ছোট পরিবর্তন বড় ফলাফল দিতে পারে।',
            bad: 'অতিরিক্ত ওজন ডায়াবেটিস, উচ্চ রক্তচাপ এবং জয়েন্ট সমস্যার ঝুঁকি বাড়ায়।',
            future: 'সপ্তাহে ৩০০ মিনিট মিশ্র কার্ডিও এবং শক্তি ব্যায়ামের লক্ষ্য রাখুন, প্রক্রিয়াজাত খাবার কমান এবং ৫০০ ক্যালোরি/দিন ঘাটতি তৈরি করতে ক্যালোরি ট্র্যাক করুন।'
        },
        obese: {
            status: 'স্থূলতা',
            tip: 'ব্যক্তিগতকৃত ওজন ব্যবস্থাপনা পরিকল্পনার জন্য একজন পুষ্টিবিদের সাথে পরামর্শ করুন।',
            reason: 'এটি পেশাদার নির্দেশনার সাথে নিরাপদ, টেকসই অগ্রগতি নিশ্চিত করে।',
            why: 'আপনার উচ্চ বিএমআই সম্ভবত দীর্ঘায়িত ক্যালোরি উদ্বৃত্ত, কম কার্যকলাপ বা জেনেটিক কারণ থেকে উদ্ভূত।',
            good: 'এখন পদক্ষেপ নেওয়া আপনার স্বাস্থ্যের গতিপথ উল্লেখযোগ্যভাবে উন্নত করতে পারে।',
            bad: 'স্থূলতা হৃদরোগ, স্ট্রোক এবং বিপাকীয় ব্যাধিগুলির ঝুঁকি বাড়ায়।',
            future: 'ব্যক্তিগতকৃত পরিকল্পনার জন্য একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে কাজ করুন, কম-প্রভাব ব্যায়াম (যেমন, সাঁতার) দিয়ে শুরু করুন এবং ৫০০–১০০০ ক্যালোরি/দিন ঘাটতির সাথে পূর্ণ খাবারের উপর মনোযোগ দিন।'
        }
    }
};

let currentLang = 'en';

// Utility Functions
function animateValue(id, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = start + (end - start) * progress;
        document.getElementById(id).textContent = value.toFixed(id === 'result-bmi' ? 1 : 0);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

function updateMetaTags(name, age, bmi, status) {
    const title = currentLang === 'en' ? `LifePulse Scan for ${name}` : `লাইফপালস স্ক্যান: ${name}`;
    const description = currentLang === 'en' ?
        `Name: ${name}, Age: ${age} ${langData[currentLang].years}, BMI: ${bmi}, Status: ${langData[currentLang][status].status}. Check yours!` :
        `নাম: ${name}, বয়স: ${age} ${langData[currentLang].years}, বিএমআই: ${bmi}, অবস্থা: ${langData[currentLang][status].status}. আপনারটা পরীক্ষা করুন!`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDescription) twitterDescription.setAttribute('content', description);
}

function copyLink() {
    const shareLink = document.getElementById('share-link').value;
    const name = document.getElementById('result-name').textContent;
    const age = document.getElementById('result-age').textContent;
    const bmi = document.getElementById('result-bmi').textContent;
    const status = document.querySelector('.result-card').className.split(' ')[1];
    const cardText = langData[currentLang].copySuccess
        .replace('%name%', name)
        .replace('%age%', age)
        .replace('%years%', langData[currentLang].years)
        .replace('%bmi%', bmi)
        .replace('%status%', langData[currentLang][status].status);
    navigator.clipboard.writeText(shareLink);
    const alertDiv = document.getElementById('copy-alert');
    alertDiv.textContent = cardText;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

// Language Toggle
function toggleLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="toggleLanguage('${lang}')"]`).classList.add('active');

    document.getElementById('title').textContent = langData[lang].title;
    document.getElementById('subtitle').textContent = langData[lang].subtitle;
    document.getElementById('label-name-input').textContent = langData[lang].nameInput;
    document.getElementById('label-birth-year').textContent = langData[lang].birthYear;
    document.getElementById('label-height').textContent = langData[lang].height;
    document.getElementById('label-weight').textContent = langData[lang].weight;
    document.getElementById('loading-text').textContent = langData[lang].loadingText;
    document.getElementById('result-title').textContent = langData[lang].resultTitle;

    const status = document.querySelector('.result-card')?.className.split(' ')[1] || 'normal';
    updateResultContent(status);
}

function updateResultContent(status) {
    const data = langData[currentLang][status];
    document.getElementById('label-name').textContent = langData[currentLang].name;
    document.getElementById('label-age').textContent = langData[currentLang].age;
    document.getElementById('label-years').textContent = langData[currentLang].years;
    document.getElementById('label-bmi').textContent = langData[currentLang].bmi;
    document.getElementById('health-directive').textContent = langData[currentLang].healthDirective;
    document.getElementById('why-happened').textContent = langData[currentLang].whyHappened;
    document.getElementById('good-aspects').textContent = langData[currentLang].goodAspects;
    document.getElementById('bad-aspects').textContent = langData[currentLang].badAspects;
    document.getElementById('future-instructions').textContent = langData[currentLang].futureInstructions;
    document.getElementById('share-results').textContent = langData[currentLang].shareResults;
    document.getElementById('preview-title').textContent = langData[currentLang].previewTitle;
    document.getElementById('preview-years').textContent = langData[currentLang].previewYears;
    document.getElementById('tip-text').textContent = data.tip;
    document.getElementById('tip-reason').textContent = data.reason;
    document.getElementById('why-text').textContent = data.why;
    document.getElementById('good-text').textContent = data.good;
    document.getElementById('bad-text').textContent = data.bad;
    document.getElementById('future-text').textContent = data.future;
    document.getElementById('preview-status').textContent = data.status;
}

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

function instagramShare() {
    const shareLink = document.getElementById('share-link').value;
    const name = document.getElementById('result-name').textContent;
    const age = document.getElementById('result-age').textContent;
    const bmi = document.getElementById('result-bmi').textContent;
    const status = document.querySelector('.result-card').className.split(' ')[1];
    const cardText = langData[currentLang].copySuccess
        .replace('%name%', name)
        .replace('%age%', age)
        .replace('%years%', langData[currentLang].years)
        .replace('%bmi%', bmi)
        .replace('%status%', langData[currentLang][status].status);
    navigator.clipboard.writeText(`${cardText}\n${shareLink}`);
    alert(currentLang === 'en' ?
        'Instagram sharing is limited. Link and card text copied! Paste into an Instagram post or story.' :
        'ইনস্টাগ্রাম শেয়ারিং সীমিত। লিঙ্ক এবং কার্ড টেক্সট কপি করা হয়েছে! ইনস্টাগ্রাম পোস্ট বা স্টোরিতে পেস্ট করুন।');
}

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
        alert(currentLang === 'en' ? 'Please fill all fields.' : 'অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন।');
        return;
    }

    if (birthYear < 1900 || birthYear > 2025) {
        alert(currentLang === 'en' ? 'Invalid birth year.' : 'অবৈধ জন্ম সাল।');
        return;
    }

    if (heightCm < 50 || heightCm > 300 || weightKg < 10 || weightKg > 500) {
        alert(currentLang === 'en' ? 'Invalid height or weight.' : 'অবৈধ উচ্চতা বা ওজন।');
        return;
    }

    document.getElementById('input-panel').style.display = 'none';
    document.getElementById('loading-panel').style.display = 'block';
    document.getElementById('card').classList.remove('result-shown');
    document.body.classList.remove('input-active', 'normal', 'underweight', 'overweight', 'obese');
    document.body.classList.add('loading');

    setTimeout(() => {
        const currentYear = 2025;
        const age = currentYear - birthYear;
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        let statusClass;
        if (bmi < 18.5) {
            statusClass = 'underweight';
        } else if (bmi >= 18.5 && bmi < 25) {
            statusClass = 'normal';
        } else if (bmi >= 25 && bmi < 30) {
            statusClass = 'overweight';
        } else {
            statusClass = 'obese';
        }

        document.getElementById('result-name').textContent = name;
        document.getElementById('result-age').textContent = age;
        document.getElementById('result-bmi').textContent = bmi;
        const resultCard = document.querySelector('.result-card');
        resultCard.className = `result-card ${statusClass}`;
        document.getElementById('status-bubble').className = `status-bubble ${statusClass}`;
        updateResultContent(statusClass);

        document.getElementById('preview-name').textContent = name;
        document.getElementById('preview-age').textContent = age;
        document.getElementById('preview-bmi').textContent = bmi;

        const shareLink = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}&age=${age}&bmi=${bmi}&status=${statusClass}&lang=${currentLang}`;
        document.getElementById('share-link').value = shareLink;

        updateMetaTags(name, age, bmi, statusClass);

        const cardText = currentLang === 'en' ?
            `LifePulse Scan\nName: ${name}\nAge: ${age} ${langData[currentLang].years}\nBMI: ${bmi}\nStatus: ${langData[currentLang][statusClass].status}` :
            `লাইফপালস স্ক্যান\nনাম: ${name}\nবয়স: ${age} ${langData[currentLang].years}\nবিএমআই: ${bmi}\nঅবস্থা: ${langData[currentLang][statusClass].status}`;
        const shareText = currentLang === 'en' ? `${cardText}\nCheck yours!` : `${cardText}\nআপনারটা পরীক্ষা করুন!`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareText)}`;
        document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareLink)}`;
        document.getElementById('share-telegram').href = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`;
        document.getElementById('share-x').href = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`;
        document.getElementById('share-reddit').href = `https://www.reddit.com/submit?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(shareText)}`;

        animateValue('result-age', 0, age, 1000);
        animateValue('result-bmi', 0, bmi, 1000);

        document.getElementById('loading-panel').style.display = 'none';
        document.getElementById('result-panel').style.display = 'flex';
        document.getElementById('card').classList.add('result-shown');
        document.body.classList.remove('loading');
        document.body.classList.add(statusClass);
        animateParticles(statusClass);
    }, 2000);
}

function reset() {
    document.getElementById('input-panel').style.display = 'flex';
    document.getElementById('result-panel').style.display = 'none';
    document.getElementById('card').classList.remove('result-shown');
    document.body.classList.remove('normal', 'underweight', 'overweight', 'obese', 'loading');
    animateParticles('initial');
    document.getElementById('name').value = '';
    document.getElementById('birth-year').value = '';
    document.getElementById('height-cm').value = '';
    document.getElementById('height-ft').value = '';
    document.getElementById('height-in').value = '';
    document.getElementById('weight-kg').value = '';
    document.getElementById('weight-lbs').value = '';
}

// Handle Shared Link
function handleSharedLink() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const age = parseInt(params.get('age'));
    const bmi = parseFloat(params.get('bmi'));
    const status = params.get('status');
    const lang = params.get('lang') || 'en';

    if (name && age && bmi && status && ['normal', 'underweight', 'overweight', 'obese'].includes(status)) {
        currentLang = lang;
        toggleLanguage(lang);
        document.getElementById('input-panel').style.display = 'none';
        document.getElementById('result-panel').style.display = 'flex';
        document.getElementById('card').classList.add('result-shown');
        document.body.classList.add(status);
        animateParticles(status);

        document.getElementById('result-name').textContent = name;
        document.getElementById('result-age').textContent = age;
        document.getElementById('result-bmi').textContent = bmi;
        const resultCard = document.querySelector('.result-card');
        resultCard.className = `result-card ${status}`;
        document.getElementById('status-bubble').className = `status-bubble ${status}`;
        updateResultContent(status);

        document.getElementById('preview-name').textContent = name;
        document.getElementById('preview-age').textContent = age;
        document.getElementById('preview-bmi').textContent = bmi;

        const shareLink = window.location.href;
        document.getElementById('share-link').value = shareLink;

        updateMetaTags(name, age, bmi, status);

        const cardText = currentLang === 'en' ?
            `LifePulse Scan\nName: ${name}\nAge: ${age} ${langData[currentLang].years}\nBMI: ${bmi}\nStatus: ${langData[currentLang][status].status}` :
            `লাইফপালস স্ক্যান\nনাম: ${name}\nবয়স: ${age} ${langData[currentLang].years}\nবিএমআই: ${bmi}\nঅবস্থা: ${langData[currentLang][status].status}`;
        const shareText = currentLang === 'en' ? `${cardText}\nCheck yours!` : `${cardText}\nআপনারটা পরীক্ষা করুন!`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareText)}`;
        document.getElementById('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareLink)}`;
        document.getElementById('share-telegram').href = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`;
        document.getElementById('share-x').href = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`;
        document.getElementById('share-reddit').href = `https://www.reddit.com/submit?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(shareText)}`;
    }
}

// Initialize
window.addEventListener('load', handleSharedLink);
