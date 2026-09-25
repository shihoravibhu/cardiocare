"""Automated End-to-End Test Suite for CardioCare Backend & Model.
Tests all endpoints, validation rules, derived features, and edge cases.
"""

import urllib.request
import urllib.error
import json
import time
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8001"

passed_tests = 0
failed_tests = 0
results = []


def record_result(name: str, passed: bool, message: str = ""):
    global passed_tests, failed_tests
    if passed:
        passed_tests += 1
        status_str = "PASS"
    else:
        failed_tests += 1
        status_str = "FAIL"
    results.append({"name": name, "status": status_str, "message": message})
    print(f"[{status_str}] {name} {('- ' + message) if message else ''}")


def http_request(path: str, method: str = "GET", data: dict = None, headers: dict = None):
    url = f"{BASE_URL}{path}"
    headers = headers or {}
    payload = None
    if data is not None:
        payload = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            body = response.read().decode("utf-8")
            status_code = response.status
            try:
                parsed_json = json.loads(body)
            except Exception:
                parsed_json = body
            return status_code, parsed_json
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed_json = json.loads(body)
        except Exception:
            parsed_json = body
        return e.code, parsed_json
    except Exception as e:
        return 0, str(e)


def run_tests():
    print("=================================================================")
    print("       CardioCare Automated Test Suite: Testing Backend & Model   ")
    print(f"       Target: {BASE_URL}")
    print("=================================================================\n")

    # -------------------------------------------------------------
    # 1. Basic Health & System Endpoints
    # -------------------------------------------------------------
    print("--- 1. System & Health Endpoints ---")
    status, res = http_request("/")
    record_result(
        "GET / (Root endpoint)",
        status == 200 and res.get("status") == "running" and res.get("model_loaded") is True,
        f"Status: {status}, Response: {res}",
    )

    status, res = http_request("/health")
    record_result(
        "GET /health",
        status == 200 and res.get("status") == "ok" and res.get("model_loaded") is True,
        f"Status: {status}, Response: {res}",
    )

    status, res = http_request("/docs")
    record_result(
        "GET /docs (Swagger UI)",
        status == 200,
        f"Status: {status}",
    )

    status, res = http_request("/openapi.json")
    record_result(
        "GET /openapi.json (OpenAPI Schema)",
        status == 200 and "paths" in res and "/predict" in res["paths"],
        f"Status: {status}, Predict endpoint declared: {'/predict' in res.get('paths', {})}",
    )

    status, res = http_request("/benchmark")
    record_result(
        "GET /benchmark (Multi-Model Benchmark Endpoint)",
        status == 200 and "models" in res and len(res["models"]) == 6 and res.get("champion") == "Gradient Boosting",
        f"Status: {status}, Models returned: {len(res.get('models', []))}, Champion: {res.get('champion')}",
    )

    # -------------------------------------------------------------
    # 2. CORS Verification
    # -------------------------------------------------------------
    print("\n--- 2. CORS Headers ---")
    req = urllib.request.Request(
        f"{BASE_URL}/predict",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
        method="OPTIONS",
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            cors_origin = r.headers.get("access-control-allow-origin")
            record_result(
                "CORS Preflight for React Frontend (localhost:5173)",
                cors_origin == "http://localhost:5173" or cors_origin == "*",
                f"Allowed Origin: {cors_origin}",
            )
    except Exception as e:
        record_result("CORS Preflight for React Frontend", False, str(e))

    # -------------------------------------------------------------
    # 3. Blood Pressure Business Logic Validation
    # -------------------------------------------------------------
    print("\n--- 3. Blood Pressure Validation (Systolic > Diastolic) ---")

    # Systolic == Diastolic
    payload = {
        "age_years": 45, "gender": 1, "height": 170.0, "weight": 70.0,
        "ap_hi": 120, "ap_lo": 120, "cholesterol": 1, "gluc": 1,
        "smoke": 0, "alco": 0, "active": 1
    }
    status, res = http_request("/predict", method="POST", data=payload)
    record_result(
        "Validation: ap_hi == ap_lo rejected (HTTP 400)",
        status == 400 and "Systolic BP must be greater than Diastolic BP" in str(res),
        f"Status: {status}, Detail: {res.get('detail') if isinstance(res, dict) else res}",
    )

    # Systolic < Diastolic
    payload["ap_hi"] = 80
    payload["ap_lo"] = 120
    status, res = http_request("/predict", method="POST", data=payload)
    record_result(
        "Validation: ap_hi < ap_lo rejected (HTTP 400)",
        status == 400 and "Systolic BP must be greater than Diastolic BP" in str(res),
        f"Status: {status}, Detail: {res.get('detail') if isinstance(res, dict) else res}",
    )

    # -------------------------------------------------------------
    # 4. Input Boundary & Schema Validation (Pydantic)
    # -------------------------------------------------------------
    print("\n--- 4. Pydantic Schema Validation (HTTP 422) ---")

    # Negative Age
    bad_payload = dict(payload, ap_hi=120, ap_lo=80, age_years=-5)
    status, _ = http_request("/predict", method="POST", data=bad_payload)
    record_result("Validation: Age < 1 rejected (HTTP 422)", status == 422, f"Status: {status}")

    # Age > 120
    bad_payload = dict(payload, ap_hi=120, ap_lo=80, age_years=150)
    status, _ = http_request("/predict", method="POST", data=bad_payload)
    record_result("Validation: Age > 120 rejected (HTTP 422)", status == 422, f"Status: {status}")

    # Invalid Gender (value 3, only 1 and 2 allowed)
    bad_payload = dict(payload, ap_hi=120, ap_lo=80, gender=3)
    status, _ = http_request("/predict", method="POST", data=bad_payload)
    record_result("Validation: Gender not in [1, 2] rejected (HTTP 422)", status == 422, f"Status: {status}")

    # Invalid Cholesterol (value 4, only 1, 2, 3 allowed)
    bad_payload = dict(payload, ap_hi=120, ap_lo=80, cholesterol=4)
    status, _ = http_request("/predict", method="POST", data=bad_payload)
    record_result("Validation: Cholesterol > 3 rejected (HTTP 422)", status == 422, f"Status: {status}")

    # Missing mandatory field (weight missing)
    incomplete_payload = {k: v for k, v in payload.items() if k != "weight"}
    status, _ = http_request("/predict", method="POST", data=incomplete_payload)
    record_result("Validation: Missing required field rejected (HTTP 422)", status == 422, f"Status: {status}")

    # Wrong data type (string where integer expected)
    bad_type_payload = dict(payload, ap_hi=120, ap_lo=80, smoke="not_a_number")
    status, _ = http_request("/predict", method="POST", data=bad_type_payload)
    record_result("Validation: Wrong type string for int rejected (HTTP 422)", status == 422, f"Status: {status}")

    # -------------------------------------------------------------
    # 5. Derived Feature Calculation Integrity
    # -------------------------------------------------------------
    print("\n--- 5. Derived Feature Verification ---")
    test_height = 175.0
    test_weight = 75.0
    test_hi = 145
    test_lo = 95
    expected_bmi = round(test_weight / ((test_height / 100) ** 2), 2)  # 24.49
    expected_pulse_pressure = test_hi - test_lo  # 50
    expected_hypertension = 1  # 145 >= 140

    payload_features = {
        "age_years": 50, "gender": 1, "height": test_height, "weight": test_weight,
        "ap_hi": test_hi, "ap_lo": test_lo, "cholesterol": 1, "gluc": 1,
        "smoke": 0, "alco": 0, "active": 1
    }
    status, res = http_request("/predict", method="POST", data=payload_features)
    derived = res.get("derived_features", {}) if isinstance(res, dict) else {}

    record_result(
        f"Derived BMI matches formula ({expected_bmi})",
        derived.get("bmi") == expected_bmi,
        f"Calculated: {derived.get('bmi')}, Expected: {expected_bmi}",
    )
    record_result(
        f"Derived Pulse Pressure matches formula ({expected_pulse_pressure})",
        derived.get("pulse_pressure") == expected_pulse_pressure,
        f"Calculated: {derived.get('pulse_pressure')}, Expected: {expected_pulse_pressure}",
    )
    record_result(
        f"Derived Hypertension matches formula ({expected_hypertension})",
        derived.get("hypertension") == expected_hypertension,
        f"Calculated: {derived.get('hypertension')}, Expected: {expected_hypertension}",
    )

    # -------------------------------------------------------------
    # 6. Clinical Prediction Scenarios & Model Performance
    # -------------------------------------------------------------
    print("\n--- 6. Clinical Clinical Prediction Scenarios ---")

    # Scenario A: Young, healthy athletic non-smoker
    young_healthy = {
        "age_years": 24, "gender": 1, "height": 178.0, "weight": 68.0,
        "ap_hi": 115, "ap_lo": 75, "cholesterol": 1, "gluc": 1,
        "smoke": 0, "alco": 0, "active": 1
    }
    start = time.perf_counter()
    status, res_healthy = http_request("/predict", method="POST", data=young_healthy)
    elapsed_healthy_ms = (time.perf_counter() - start) * 1000

    pred_h = res_healthy.get("prediction")
    prob_h = res_healthy.get("probability", 1.0)
    label_h = res_healthy.get("risk_label")
    record_result(
        "Scenario A (Young & Healthy): Low Risk expected (Prediction=0)",
        status == 200 and pred_h == 0 and label_h == "Low Risk",
        f"Prediction: {pred_h} ({label_h}), Probability: {prob_h:.1%}, Latency: {elapsed_healthy_ms:.1f}ms",
    )

    # Scenario B: Older, hypertensive, smoker, high cholesterol
    older_high_risk = {
        "age_years": 63, "gender": 2, "height": 165.0, "weight": 92.0,
        "ap_hi": 170, "ap_lo": 105, "cholesterol": 3, "gluc": 2,
        "smoke": 1, "alco": 1, "active": 0
    }
    start = time.perf_counter()
    status, res_risk = http_request("/predict", method="POST", data=older_high_risk)
    elapsed_risk_ms = (time.perf_counter() - start) * 1000

    pred_r = res_risk.get("prediction")
    prob_r = res_risk.get("probability", 0.0)
    label_r = res_risk.get("risk_label")
    record_result(
        "Scenario B (High Risk Clinical Profile): High Risk expected (Prediction=1)",
        status == 200 and pred_r == 1 and label_r == "High Risk" and prob_r > 0.5,
        f"Prediction: {pred_r} ({label_r}), Probability: {prob_r:.1%}, Latency: {elapsed_risk_ms:.1f}ms",
    )

    # Scenario C: Moderate / Borderline patient
    borderline = {
        "age_years": 52, "gender": 1, "height": 170.0, "weight": 78.0,
        "ap_hi": 135, "ap_lo": 85, "cholesterol": 2, "gluc": 1,
        "smoke": 0, "alco": 0, "active": 1
    }
    status, res_border = http_request("/predict", method="POST", data=borderline)
    record_result(
        "Scenario C (Borderline Patient): Valid result computed",
        status == 200 and res_border.get("prediction") in (0, 1),
        f"Prediction: {res_border.get('prediction')} ({res_border.get('risk_label')}), Probability: {res_border.get('probability', 0):.1%}",
    )

    # Scenario D: Model routing - Gradient Boosting Champion
    gb_payload = dict(young_healthy, model_choice="gradient_boosting")
    status_gb, res_gb = http_request("/predict", method="POST", data=gb_payload)
    record_result(
        "Scenario D1: Explicit Gradient Boosting Champion routing",
        status_gb == 200 and "Gradient Boosting" in res_gb.get("model_used", ""),
        f"Model used: {res_gb.get('model_used')}",
    )

    # Scenario E: Model routing - Random Forest Ensemble
    rf_payload = dict(young_healthy, model_choice="random_forest")
    status_rf, res_rf = http_request("/predict", method="POST", data=rf_payload)
    record_result(
        "Scenario D2: Explicit Random Forest Ensemble routing",
        status_rf == 200 and "Random Forest" in res_rf.get("model_used", ""),
        f"Model used: {res_rf.get('model_used')}",
    )

    # -------------------------------------------------------------
    # 7. Stress / Latency Benchmarking (10 consecutive requests)
    # -------------------------------------------------------------
    print("\n--- 7. Performance & Latency Benchmark ---")
    latencies = []
    for _ in range(10):
        t0 = time.perf_counter()
        s, _ = http_request("/predict", method="POST", data=young_healthy)
        lat = (time.perf_counter() - t0) * 1000
        if s == 200:
            latencies.append(lat)

    avg_lat = sum(latencies) / len(latencies) if latencies else 0
    max_lat = max(latencies) if latencies else 0
    min_lat = min(latencies) if latencies else 0

    record_result(
        "Performance Benchmark (10 sequential predictions under 500ms)",
        avg_lat < 500.0,
        f"Avg: {avg_lat:.2f}ms, Min: {min_lat:.2f}ms, Max: {max_lat:.2f}ms",
    )

    # -------------------------------------------------------------
    # Summary
    # -------------------------------------------------------------
    print("\n=================================================================")
    print(f"                      TEST SUMMARY                               ")
    print(f"     Total Tests:  {passed_tests + failed_tests}")
    print(f"     Passed:       {passed_tests} ✅")
    print(f"     Failed:       {failed_tests} ❌")
    print("=================================================================")

    return failed_tests == 0


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
