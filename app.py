from flask import Flask, render_template, request, jsonify
from pywebio.platform.flask import webio_view
from pywebio.input import input, FLOAT, SELECT, input_group
from pywebio.output import put_text, put_html, clear, put_buttons
import json
import os
import plotly.graph_objs as go
import plotly.io as pio
from datetime import datetime

app = Flask(__name__)

# Language Data
lang_data = {
    'en': {
        'title': 'LifePulse',
        'subtitle': 'Analyzing Your Life Energy...',
        'name': 'Name',
        'birth_year': 'Birth Year',
        'height': 'Height',
        'weight': 'Weight',
        'height_unit': 'Height Unit',
        'weight_unit': 'Weight Unit',
        'analyze': 'Analyze',
        'reset': 'Reset',
        'lang_toggle': 'Language',
        'bmi_trend': 'BMI Trend Tracker',
        'add_data': 'Add Data Point',
        'view_graph': 'View 3D Graph',
        'copy_success': 'Link copied! Share your LifePulse Scan:\nLifePulse Scan\nName: %name%\nAge: %age% years\nBMI: %bmi%\nStatus: %status%',
        'normal': {
            'status': 'Normal',
            'tip': 'Maintain a balanced diet with regular exercise (30 min/day).',
            'reason': 'This optimizes overall health and prevents chronic issues.'
        },
        'underweight': {
            'status': 'Underweight',
            'tip': 'Increase calorie intake with nutrient-rich foods like nuts.',
            'reason': 'This helps build muscle mass and boosts energy.'
        },
        'overweight': {
            'status': 'Overweight',
            'tip': 'Incorporate cardio and strength training weekly.',
            'reason': 'This reduces excess weight and improves health.'
        },
        'obese': {
            'status': 'Obese',
            'tip': 'Consult a nutritionist for a tailored plan.',
            'reason': 'This ensures safe, sustainable progress.'
        }
    },
    'bn': {
        'title': 'লাইফপালস',
        'subtitle': 'আপনার জীবনী শক্তি বিশ্লেষণ করা হচ্ছে...',
        'name': 'নাম',
        'birth_year': 'জন্ম সাল',
        'height': 'উচ্চতা',
        'weight': 'ওজন',
        'height_unit': 'উচ্চতার একক',
        'weight_unit': 'ওজনের একক',
        'analyze': 'বিশ্লেষণ',
        'reset': 'রিসেট',
        'lang_toggle': 'ভাষা',
        'bmi_trend': 'বিএমআই ট্রেন্ড ট্র্যাকার',
        'add_data': 'ডেটা পয়েন্ট যোগ করুন',
        'view_graph': '3D গ্রাফ দেখুন',
        'copy_success': 'লিঙ্ক কপি করা হয়েছে! আপনার লাইফপালস স্ক্যান শেয়ার করুন:\nলাইফপালস স্ক্যান\nনাম: %name%\nবয়স: %age% বছর\nবিএমআই: %bmi%\nঅবস্থা: %status%',
        'normal': {
            'status': 'স্বাভাবিক',
            'tip': 'নিয়মিত ব্যায়াম (প্রতিদিন ৩০ মিনিট) এবং সুষম খাদ্য বজায় রাখুন।',
            'reason': 'এটি সামগ্রিক স্বাস্থ্য উন্নত করে এবং দীর্ঘমেয়াদী রোগ প্রতিরোধ করে।'
        },
        'underweight': {
            'status': 'কম ওজন',
            'tip': 'বাদামের মতো পুষ্টিকর খাবার দিয়ে ক্যালোরি গ্রহণ বাড়ান।',
            'reason': 'এটি পেশী ভর বাড়াতে এবং শক্তি বৃদ্ধি করতে সহায়তা করে।'
        },
        'overweight': {
            'status': 'অতিরিক্ত ওজন',
            'tip': 'সাপ্তাহিক কার্ডিও এবং শক্তি প্রশিক্ষণ অন্তর্ভুক্ত করুন।',
            'reason': 'এটি অতিরিক্ত ওজন কমায় এবং স্বাস্থ্য উন্নত করে।'
        },
        'obese': {
            'status': 'স্থূলতা',
            'tip': 'ব্যক্তিগতকৃত পরিকল্পনার জন্য পুষ্টিবিদের সাথে পরামর্শ করুন।',
            'reason': 'এটি নিরাপদ, টেকসই অগ্রগতি নিশ্চিত করে।'
        }
    }
}

# Session-based BMI data storage
DATA_FILE = 'data/bmi_data.json'
if not os.path.exists('data'):
    os.makedirs('data')
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def load_bmi_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_bmi_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)

@app.route('/')
def index():
    return render_template('index.html')

def bmi_calculator():
    lang = 'en'
    
    def update_ui():
        clear()
        put_html(f"""
            <h1 class='text-4xl font-bold text-center text-neon-green animate-pulse' id='title'>{lang_data[lang]['title']}</h1>
            <p class='text-center text-gray-400' id='subtitle'>{lang_data[lang]['subtitle']}</p>
            <div class='flex justify-center my-4'>
                <button class='lang-btn mx-2 px-4 py-2 rounded bg-neon-green text-black' onclick="setLanguage('en')">EN</button>
                <button class='lang-btn mx-2 px-4 py-2 rounded bg-gray-700 text-white' onclick="setLanguage('bn')">BN</button>
            </div>
        """)
        inputs = input_group("LifePulse Scan", [
            input(lang_data[lang]['name'], name='name', required=True),
            input(lang_data[lang]['birth_year'], name='birth_year', type=FLOAT, required=True),
            input(lang_data[lang]['height'], name='height', type=FLOAT, required=True),
            SELECT(lang_data[lang]['height_unit'], name='height_unit', options=['cm', 'ft-in']),
            input(lang_data[lang]['weight'], name='weight', type=FLOAT, required=True),
            SELECT(lang_data[lang]['weight_unit'], name='weight_unit', options=['kg', 'lbs'])
        ])
        
        name = inputs['name']
        birth_year = int(inputs['birth_year'])
        height = inputs['height']
        height_unit = inputs['height_unit']
        weight = inputs['weight']
        weight_unit = inputs['weight_unit']

        if birth_year < 1900 or birth_year > 2025:
            put_text(lang_data[lang]['birth_year'] + ' invalid.')
            return
        if height < 50 or height > 300 or weight < 10 or weight > 500:
            put_text(lang_data[lang]['height'] + ' or ' + lang_data[lang]['weight'] + ' invalid.')
            return

        height_cm = height if height_unit == 'cm' else (int(height) * 30.48 + (height % 1 * 100) * 2.54)
        weight_kg = weight if weight_unit == 'kg' else weight * 0.453592
        height_m = height_cm / 100
        bmi = round(weight_kg / (height_m * height_m), 1)
        age = 2025 - birth_year

        status = 'normal' if 18.5 <= bmi < 25 else 'underweight' if bmi < 18.5 else 'overweight' if bmi < 30 else 'obese'

        # Save BMI data point
        bmi_data = load_bmi_data()
        bmi_data.append({'name': name, 'date': datetime.now().strftime('%Y-%m-%d'), 'bmi': bmi, 'weight_kg': weight_kg})
        save_bmi_data(bmi_data)

        # Display Results
        put_html(f"""
            <div class='result-card {status} p-6 rounded-lg shadow-neon max-w-2xl mx-auto'>
                <h2 class='text-2xl font-bold text-center'>{lang_data[lang]['title']} Scan</h2>
                <p><strong>{lang_data[lang]['name']}:</strong> {name}</p>
                <p><strong>{lang_data[lang]['birth_year']}:</strong> {age} years</p>
                <p><strong>BMI:</strong> {bmi}</p>
                <p><strong>Status:</strong> {lang_data[lang][status]['status']}</p>
                <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <h3>Health Directive</h3>
                        <p>{lang_data[lang][status]['tip']}</p>
                        <p>{lang_data[lang][status]['reason']}</p>
                    </div>
                    <div>
                        <h3>Share</h3>
                        <input id='share-link' class='w-full p-2 rounded' value='{request.url}?name={name}&age={age}&bmi={bmi}&status={status}&lang={lang}' readonly>
                        <button class='copy-btn mt-2 px-4 py-2 bg-neon-green text-black rounded' onclick='copyLink()'>Copy Link</button>
                    </div>
                </div>
            </div>
        """)
        put_buttons([lang_data[lang]['reset'], lang_data[lang]['add_data'], lang_data[lang]['view_graph']], 
                   onclick=[lambda: bmi_calculator(), lambda: add_data_point(), view_3d_graph])

    def add_data_point():
        clear()
        inputs = input_group(lang_data[lang]['bmi_trend'], [
            input(lang_data[lang]['weight'], name='weight', type=FLOAT, required=True),
            SELECT(lang_data[lang]['weight_unit'], name='weight_unit', options=['kg', 'lbs'])
        ])
        weight = inputs['weight']
        weight_unit = inputs['weight_unit']
        weight_kg = weight if weight_unit == 'kg' else weight * 0.453592
        height_cm = 170  # Default height for trend
        height_m = height_cm / 100
        bmi = round(weight_kg / (height_m * height_m), 1)
        bmi_data = load_bmi_data()
        bmi_data.append({'name': 'User', 'date': datetime.now().strftime('%Y-%m-%d'), 'bmi': bmi, 'weight_kg': weight_kg})
        save_bmi_data(bmi_data)
        put_text('Data point added!')
        put_buttons([lang_data[lang]['reset']], onclick=[bmi_calculator])

    def view_3d_graph():
        bmi_data = load_bmi_data()
        if not bmi_data:
            put_text('No BMI data available.')
            return
        dates = [d['date'] for d in bmi_data]
        bmis = [d['bmi'] for d in bmi_data]
        weights = [d['weight_kg'] for d in bmi_data]
        
        fig = go.Figure(data=[
            go.Scatter3d(
                x=dates, y=bmis, z=weights,
                mode='lines+markers',
                marker=dict(size=5, color=bmis, colorscale='Viridis'),
                line=dict(width=2)
            )
        ])
        fig.update_layout(
            scene=dict(
                xaxis_title='Date',
                yaxis_title='BMI',
                zaxis_title='Weight (kg)'
            ),
            title='3D BMI Trend'
        )
        put_html(pio.to_html(fig, full_html=False))

    update_ui()

app.route('/bmi', methods=['GET', 'POST'])(webio_view(bmi_calculator))

if __name__ == '__main__':
    app.run(debug=True, port=5000)