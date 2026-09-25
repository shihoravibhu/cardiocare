import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os

# ============================================================
# PAGE CONFIGURATION
# ============================================================
st.set_page_config(
    page_title="CardioCare | Platform",
    page_icon="❤️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ============================================================
# REACT-LIKE CSS INJECTION
# ============================================================
st.markdown("""
<style>
    /* Hide Default Streamlit UI Elements */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    [data-testid="collapsedControl"] {display: none;}
    
    /* Global Typography & Background */
    .stApp {
        background-color: #F8F9FA;
        font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif;
    }
    
    /* Glassmorphism / React-like Card styling for main containers */
    div[data-testid="stVerticalBlock"] > div[style*="flex-direction: column"] > div[data-testid="stVerticalBlock"] {
        background: #FFFFFF;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        padding: 2rem;
        transition: all 0.3s ease;
        border: 1px solid rgba(0,0,0,0.03);
    }
    
    /* Hover effects for cards */
    div[data-testid="stVerticalBlock"] > div[style*="flex-direction: column"] > div[data-testid="stVerticalBlock"]:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }

    /* Primary Action Buttons */
    div.stButton > button {
        background: linear-gradient(135deg, #E63946 0%, #D62828 100%);
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 12px;
        padding: 0.8rem 2rem;
        border: none;
        width: 100%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(230, 57, 70, 0.2);
    }
    div.stButton > button:hover {
        background: linear-gradient(135deg, #D62828 0%, #BC2020 100%);
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 20px rgba(230, 57, 70, 0.3);
        color: white;
        border: none;
    }
    
    /* Outline Nav Buttons */
    .nav-btn div.stButton > button {
        background: white;
        color: #1D3557;
        border: 2px solid #E9ECEF;
        box-shadow: none;
        border-radius: 30px;
    }
    .nav-btn div.stButton > button:hover {
        background: #F8F9FA;
        border-color: #1D3557;
        color: #1D3557;
        transform: translateY(0);
        box-shadow: none;
    }
    .nav-btn-active div.stButton > button {
        background: #1D3557;
        color: white;
        border: 2px solid #1D3557;
        box-shadow: 0 4px 10px rgba(29, 53, 87, 0.2);
    }
    .nav-btn-active div.stButton > button:hover {
        background: #457B9D;
        border-color: #457B9D;
        color: white;
    }

    /* Progress bar */
    .stProgress > div > div > div {
        background: linear-gradient(90deg, #E63946, #F4A261);
        border-radius: 10px;
    }
    
    /* Metrics */
    div[data-testid="stMetricValue"] {
        font-size: 2.5rem;
        color: #E63946;
        font-weight: 800;
        background: -webkit-linear-gradient(45deg, #E63946, #D62828);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    /* Headers */
    .hero-title {
        font-size: 4rem;
        font-weight: 900;
        background: -webkit-linear-gradient(45deg, #1D3557, #457B9D);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        text-align: center;
        letter-spacing: -1px;
    }
    .hero-subtitle {
        font-size: 1.3rem;
        color: #6C757D;
        text-align: center;
        margin-bottom: 3rem;
        font-weight: 400;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================
# MODEL LOADING
# ============================================================
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend", "cardiovascular_model.pkl"))

@st.cache_resource
def load_model():
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)

model = load_model()

# ============================================================
# SPA ROUTING STATE
# ============================================================
if "page" not in st.session_state:
    st.session_state.page = "Home"

def set_page(page_name):
    st.session_state.page = page_name

# ============================================================
# CUSTOM TOP NAVIGATION BAR
# ============================================================
nav_c1, nav_c2, nav_c3, nav_c4 = st.columns(4)

with nav_c1:
    st.markdown('<div class="{}">'.format("nav-btn-active" if st.session_state.page == "Home" else "nav-btn"), unsafe_allow_html=True)
    if st.button("🏠 Dashboard", use_container_width=True): set_page("Home")
    st.markdown('</div>', unsafe_allow_html=True)

with nav_c2:
    st.markdown('<div class="{}">'.format("nav-btn-active" if st.session_state.page == "Predictor" else "nav-btn"), unsafe_allow_html=True)
    if st.button("🔍 Risk Predictor", use_container_width=True): set_page("Predictor")
    st.markdown('</div>', unsafe_allow_html=True)

with nav_c3:
    st.markdown('<div class="{}">'.format("nav-btn-active" if st.session_state.page == "Insights" else "nav-btn"), unsafe_allow_html=True)
    if st.button("📊 Health Insights", use_container_width=True): set_page("Insights")
    st.markdown('</div>', unsafe_allow_html=True)

with nav_c4:
    st.markdown('<div class="{}">'.format("nav-btn-active" if st.session_state.page == "About" else "nav-btn"), unsafe_allow_html=True)
    if st.button("ℹ️ About Model", use_container_width=True): set_page("About")
    st.markdown('</div>', unsafe_allow_html=True)

st.markdown("<br/>", unsafe_allow_html=True)

# ============================================================
# VIEWS (PAGES)
# ============================================================

if st.session_state.page == "Home":
    st.markdown('<div class="hero-title">CardioCare</div>', unsafe_allow_html=True)
    st.markdown('<div class="hero-subtitle">The seamless, React-like AI risk assessment platform.</div>', unsafe_allow_html=True)
    
    c1, c2, c3 = st.columns(3, gap="large")
    with c1:
        st.markdown("### 🧠 AI Engine")
        with st.container():
            st.write("Utilizes advanced Machine Learning algorithms to analyze your health metrics and predict cardiovascular risks instantly.")
    with c2:
        st.markdown("### ⚡ SPA Architecture")
        with st.container():
            st.write("Experience seamless Single-Page Application (SPA) navigation without constant page reloading, mimicking modern web frameworks.")
    with c3:
        st.markdown("### 📊 Live Analytics")
        with st.container():
            st.write("Receive detailed breakdowns of your risk factors and clear visualizations directly in your browser.")

elif st.session_state.page == "Predictor":
    st.markdown("## 🔍 Cardiovascular Risk Predictor")
    st.write("Enter the patient's vitals below for a real-time assessment.")
    
    if model is None:
        st.warning("⚠️ Model file not found. Please ensure 'cardiovascular_model.pkl' is in the folder.")
        
    col_left, col_right = st.columns([1.8, 1], gap="large")

    with col_left:
        st.markdown("### 👤 Patient Profile")
        with st.container():
            c1, c2, c3 = st.columns(3)
            with c1:
                age_years = st.number_input("Age (years)", min_value=18, max_value=100, value=50, step=1)
            with c2:
                gender = st.selectbox("Gender", options=[1, 2], format_func=lambda x: "Male" if x == 1 else "Female")
            with c3:
                height = st.number_input("Height (cm)", min_value=100.0, max_value=220.0, value=170.0, step=1.0)
                
        st.markdown("### ⚖️ Body Measurements")
        with st.container():
            c1, c2 = st.columns(2)
            with c1:
                weight = st.number_input("Weight (kg)", min_value=30.0, max_value=250.0, value=70.0, step=0.5)
            with c2:
                BMI = weight / ((height / 100) ** 2)
                st.metric("Calculated BMI", f"{BMI:.1f}")
                
        st.markdown("### 🩺 Clinical Data")
        with st.container():
            c1, c2 = st.columns(2)
            with c1:
                ap_hi = st.number_input("Systolic BP", min_value=70, max_value=250, value=120, step=1)
                cholesterol = st.selectbox("Cholesterol", options=[1, 2, 3], format_func=lambda x: {1: "Normal", 2: "Elevated", 3: "High"}[x])
            with c2:
                ap_lo = st.number_input("Diastolic BP", min_value=40, max_value=150, value=80, step=1)
                gluc = st.selectbox("Glucose", options=[1, 2, 3], format_func=lambda x: {1: "Normal", 2: "Elevated", 3: "High"}[x])
                
        st.markdown("### 🏃 Lifestyle")
        with st.container():
            c1, c2, c3 = st.columns(3)
            with c1:
                smoke = st.selectbox("Smokes?", options=[0, 1], format_func=lambda x: "No" if x == 0 else "Yes")
            with c2:
                alco = st.selectbox("Alcohol?", options=[0, 1], format_func=lambda x: "No" if x == 0 else "Yes")
            with c3:
                active = st.selectbox("Active?", options=[0, 1], format_func=lambda x: "No" if x == 0 else "Yes")

    with col_right:
        st.markdown("### 📈 Risk Assessment")
        with st.container():
            st.write("Run the analysis using our trained Machine Learning pipeline.")
            
            pulse_pressure = ap_hi - ap_lo
            hypertension = int((ap_hi >= 140) or (ap_lo >= 90))
            
            predict_pressed = st.button("🔍 Run Analysis", use_container_width=True)
            
            if predict_pressed:
                if model is None:
                    st.error("Cannot run prediction: Model not loaded.")
                elif ap_hi <= ap_lo:
                    st.error("Systolic BP must be greater than Diastolic BP.")
                else:
                    input_data = pd.DataFrame({
                        "age_years": [age_years], "gender": [gender], "height": [height], "weight": [weight],
                        "ap_hi": [ap_hi], "ap_lo": [ap_lo], "cholesterol": [cholesterol], "gluc": [gluc],
                        "smoke": [smoke], "alco": [alco], "active": [active], "BMI": [BMI],
                        "pulse_pressure": [pulse_pressure], "hypertension": [hypertension]
                    })
                    
                    prediction = model.predict(input_data)[0]
                    probability = model.predict_proba(input_data)[0][1]
                    
                    st.markdown("---")
                    if prediction == 1:
                        st.error("⚠️ **High Risk** detected.")
                    else:
                        st.success("✅ **Low Risk**.")
                    
                    st.metric("Disease Probability", f"{probability * 100:.1f}%")
                    st.progress(float(probability))
                    
                    with st.expander("Diagnostic Breakdown"):
                        st.write(f"- Pulse Pressure: {pulse_pressure} mmHg")
                        st.write(f"- Hypertension: {'Yes' if hypertension else 'No'}")
                        st.write(f"- Calculated BMI: {BMI:.1f}")

elif st.session_state.page == "Insights":
    st.markdown("## 📊 Health Insights")
    st.write("Explore cardiovascular statistics and healthy living habits.")
    
    c1, c2 = st.columns(2, gap="large")
    with c1:
        st.markdown("### 🩺 Risk Factors")
        with st.container():
            st.write("**High Blood Pressure**: A major risk factor with often no symptoms.")
            st.write("**High Cholesterol**: Plaque buildup in the arteries.")
            st.write("**Smoking & Alcohol**: Damages vessels and increases likelihood of clots.")
    with c2:
        st.markdown("### 💡 Prevention")
        with st.container():
            st.write("- **Diet**: Focus on fresh fruits, vegetables, and lean proteins.")
            st.write("- **Exercise**: Aim for 150 minutes of aerobic activity weekly.")
            st.write("- **Stress Management**: Find healthy ways to cope.")
            
    st.markdown("### 📈 Example Global Trends")
    with st.container():
        chart_data = pd.DataFrame(np.random.randn(20, 3) + [5, 5, 5], columns=['Hypertension', 'High Cholesterol', 'Obesity'])
        st.area_chart(chart_data)

elif st.session_state.page == "About":
    st.markdown("## ℹ️ About the Model")
    st.write("Understand how the AI processes your data.")
    
    st.markdown("### 🔬 Architecture")
    with st.container():
        st.write("This platform utilizes a trained Machine Learning model utilizing patient records and biometrics. It correlates 11 core features alongside 3 derived features (BMI, Pulse Pressure, Hypertension) to formulate a risk probability.")
    
    st.markdown("### ⚠️ Medical Disclaimer")
    with st.container():
        st.warning("**Not Medical Advice.** This tool is intended for educational purposes only. Always seek the advice of your physician.")
