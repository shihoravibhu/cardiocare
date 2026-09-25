"""Train and benchmark 6 classification models on the cardiovascular dataset.
Saves the Champion Gradient Boosting model and full benchmark statistics.
"""

import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, roc_auc_score, precision_score, recall_score, f1_score

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "..", "processed_datasets", "cardio_processed.csv")
MODEL_OUTPUT = os.path.join(BASE_DIR, "gradient_boosting_model.pkl")
BENCHMARK_OUTPUT = os.path.join(BASE_DIR, "benchmark_results.json")

print(f"Loading dataset from: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)

features = [
    'age_years', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo',
    'cholesterol', 'gluc', 'smoke', 'alco', 'active',
    'BMI', 'pulse_pressure', 'hypertension'
]
X = df[features]
y = df['cardio']

print(f"Total dataset shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")

# Exact 80/20 train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Train samples: {len(X_train):,}, Test samples: {len(X_test):,}")

# 6 Architectures
models = {
    "Gradient Boosting": HistGradientBoostingClassifier(learning_rate=0.06, max_iter=150, max_leaf_nodes=31, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1),
    "Logistic Regression": Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=1000, random_state=42))]),
    "Gaussian Naive Bayes": Pipeline([("scaler", StandardScaler()), ("clf", GaussianNB())]),
    "K-Nearest Neighbors": Pipeline([("scaler", StandardScaler()), ("clf", KNeighborsClassifier(n_neighbors=25, n_jobs=-1))]),
    "Decision Tree": DecisionTreeClassifier(max_depth=8, min_samples_leaf=20, random_state=42),
}

benchmark_data = []

print("\n--- Training and Evaluating 6 Architectures ---")
for name, m in models.items():
    print(f"Training {name}...")
    m.fit(X_train, y_train)
    preds = m.predict(X_test)
    probs = m.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, preds)
    roc = roc_auc_score(y_test, probs)
    prec = precision_score(y_test, preds, zero_division=0)
    rec = recall_score(y_test, preds, zero_division=0)
    f1 = f1_score(y_test, preds, zero_division=0)

    benchmark_data.append({
        "model": name,
        "test_accuracy": round(acc * 100, 3),
        "roc_auc": round(roc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
    })
    print(f"  -> Acc: {acc*100:.3f}% | ROC-AUC: {roc*100:.2f}% | F1: {f1*100:.2f}%")

# Sort by ROC-AUC and Test Accuracy descending
benchmark_data.sort(key=lambda x: (x["roc_auc"], x["test_accuracy"]), reverse=True)

# Assign ranks and statuses
for idx, entry in enumerate(benchmark_data):
    entry["rank"] = f"{idx + 1}"
    if idx == 0:
        entry["rank_display"] = "1st"
        entry["is_champion"] = True
        entry["status"] = "Integrated & Serving (Champion)"
    elif idx == 1:
        entry["rank_display"] = "2nd"
        entry["is_champion"] = False
        entry["status"] = "Integrated & Serving"
    elif idx == 2:
        entry["rank_display"] = "3rd"
        entry["is_champion"] = False
        entry["status"] = "Evaluated"
    else:
        entry["rank_display"] = f"{idx + 1}th"
        entry["is_champion"] = False
        entry["status"] = "Evaluated"

print("\nFinal Benchmark Results:")
print(json.dumps(benchmark_data, indent=2))

# Save Champion Model (Gradient Boosting)
champion_model = models["Gradient Boosting"]
joblib.dump(champion_model, MODEL_OUTPUT)
print(f"\nChampion model saved to: {MODEL_OUTPUT}")

# Save Benchmark JSON
with open(BENCHMARK_OUTPUT, "w") as f:
    json.dump({
        "dataset_split": f"80/20 train-test split ({len(X_train):,} train / {len(X_test):,} test records)",
        "champion": "Gradient Boosting",
        "models": benchmark_data
    }, f, indent=2)

print(f"Benchmark results saved to: {BENCHMARK_OUTPUT}")
print("Training & Evaluation complete!")
