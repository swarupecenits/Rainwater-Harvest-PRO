"""Streamlit app for Rainwater Harvesting Analytics and Rainfall Pattern Clustering.

Features:
- Loads historical Bengaluru rainfall dataset (monthly mm per year)
- Computes monthly mean rainfall and average annual rainfall
- User inputs: roof area, roof type, soil type, roof slope, annual rainfall override, efficiency override, cluster count
- Calculates potential annual harvest and recommended tank size
- Performs KMeans clustering on yearly rainfall profiles with PCA visualization
- Provides downloadable reconstructed model snippet and module

Run:
    streamlit run streamlit_app.py
"""
from __future__ import annotations
import sys
from pathlib import Path
import numpy as np
import pandas as pd
import streamlit as st
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import io
import textwrap

# Optional: Add tools path if feature_format needed (we'll avoid dependency by using DataFrame directly)
# sys.path.append("E:/Downloads/ud120-projects-master/ud120-projects-master/tools/")

DATA_FILE_NAME = "Bengaluru Rainfall Data.csv"
# Explicit absolute path provided by user (preferred)
ABSOLUTE_DATA_PATH = Path(r"C:/Users/swaru/Documents/College Projects/RWHT/ML Model/Datasets") / DATA_FILE_NAME

def resolve_dataset_path() -> Path:
    """Resolve the rainfall dataset path with multiple fallbacks.

    Order:
    1. User-specified absolute path
    2. Parent of this file (.. / Datasets / file)
    3. Current working directory / Datasets / file
    4. This file's directory / Datasets / file
    Returns first existing path; if none exist, returns the first candidate (for error messaging).
    """
    candidates = [
        ABSOLUTE_DATA_PATH,
        Path(__file__).resolve().parent.parent / "Datasets" / DATA_FILE_NAME,
        Path.cwd() / "Datasets" / DATA_FILE_NAME,
        Path(__file__).resolve().parent / "Datasets" / DATA_FILE_NAME,
    ]
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]

DATA_PATH = resolve_dataset_path()
MONTH_ORDER = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

@st.cache_data(show_spinner=False)
def load_rainfall() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Rainfall dataset not found at: {DATA_PATH}\n"
            "Please ensure the file exists or update the path in streamlit_app.py."
        )
    df = pd.read_csv(DATA_PATH)
    empty_cols = [c for c in df.columns if c.strip() == '' or c.lower().startswith('unnamed')]
    if empty_cols:
        df.drop(columns=empty_cols, inplace=True)
    df.rename(columns={df.columns[0]: 'Year'}, inplace=True)
    month_cols_present = [c for c in MONTH_ORDER if c in df.columns]
    for c in month_cols_present:
        df[c] = pd.to_numeric(df[c], errors='coerce')
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    df.dropna(subset=['Year'], inplace=True)
    df[month_cols_present] = df[month_cols_present].apply(lambda col: col.fillna(col.mean()))
    df.sort_values('Year', inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df[["Year"] + month_cols_present]


def compute_statistics(df: pd.DataFrame) -> dict:
    month_cols = [c for c in df.columns if c != 'Year']
    monthly_means = df[month_cols].mean()
    total_predicted = monthly_means.sum()
    roof_area_default = 30 * 0.3048 * 40 * 0.3048
    return {
        'monthly_means': monthly_means,
        'total_predicted_mm': total_predicted,
        'default_roof_area_m2': roof_area_default,
    }


def efficiency_from_inputs(roof_type: str, roof_slope: float, override: float | None) -> float:
    base = {
        'rcc': 0.85,
        'concrete': 0.85,
        'tile': 0.75,
        'corrugated': 0.70,
        'sheet': 0.70,
        'asbestos': 0.65,
        'poor': 0.65,
        'thatch': 0.60,
        'metal': 0.80,
    }.get(roof_type.lower(), 0.70)
    if 5 <= roof_slope <= 25:
        base *= 1.03
    base = min(base, 0.9)
    if override is not None:
        base = max(0.0, min(1.0, override))
    return base


def harvest_calculations(annual_rainfall_mm: float, roof_area_m2: float, efficiency: float) -> dict:
    potential = annual_rainfall_mm * roof_area_m2 * efficiency
    avg_monthly = potential / 12.0
    tank_volume = avg_monthly * 1.5  # buffer factor (1.5 months)
    return {
        'potential_l': potential,
        'avg_monthly_l': avg_monthly,
        'recommended_tank_l': tank_volume,
    }


def run_clustering(df: pd.DataFrame, k: int, random_state: int = 42):
    month_cols = [c for c in df.columns if c != 'Year']
    X = df[month_cols].values
    pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="mean")),
        ("scaler", StandardScaler()),
        ("kmeans", KMeans(n_clusters=k, n_init=10, max_iter=300, random_state=random_state))
    ])
    labels = pipeline.fit_predict(X)
    inertia = pipeline.named_steps['kmeans'].inertia_
    # PCA for visualization
    pca = PCA(n_components=2, random_state=random_state)
    X2 = pca.fit_transform(X)
    return {
        'pipeline': pipeline,
        'labels': labels,
        'inertia': inertia,
        'embedding': X2,
        'month_cols': month_cols,
    }


def generate_model_snippet(pipeline, month_cols, inertia, k):
    kmeans_model = pipeline.named_steps['kmeans']
    scaler_model = pipeline.named_steps['scaler']
    imputer_model = pipeline.named_steps['imputer']
    centers = kmeans_model.cluster_centers_.tolist()
    scaler_mean = scaler_model.mean_.tolist()
    scaler_scale = scaler_model.scale_.tolist()
    imputer_stats = imputer_model.statistics_.tolist()
    snippet = f"""# Clustering reconstruction snippet\n# Clusters: {k}  Inertia: {inertia:.2f}\nimport numpy as np\nmonth_features = {month_cols!r}\nimputer_statistics = np.array({imputer_stats})\nscaler_mean = np.array({scaler_mean})\nscaler_scale = np.array({scaler_scale})\ncluster_centers = np.array({centers})\n\ndef preprocess(X_raw):\n    X_raw = np.asarray(X_raw, dtype=float)\n    if X_raw.ndim == 1: X_raw = X_raw.reshape(1, -1)\n    X_imp = np.where(np.isnan(X_raw), imputer_statistics, X_raw)\n    X_scaled = (X_imp - scaler_mean) / scaler_scale\n    return X_scaled\n\ndef predict_cluster(X_raw):\n    Xs = preprocess(X_raw)\n    d2 = ((Xs[:, None, :] - cluster_centers)**2).sum(axis=2)\n    return d2.argmin(axis=1)\n"""
    return snippet


def generate_module_code(pipeline, month_cols, inertia, k):
    kmeans_model = pipeline.named_steps['kmeans']
    scaler_model = pipeline.named_steps['scaler']
    imputer_model = pipeline.named_steps['imputer']
    centers = kmeans_model.cluster_centers_.tolist()
    scaler_mean = scaler_model.mean_.tolist()
    scaler_scale = scaler_model.scale_.tolist()
    imputer_stats = imputer_model.statistics_.tolist()
    module_code = f"""# Auto-generated Rainfall Clustering Model Module\n# Clusters: {k}  Inertia: {inertia:.2f}\nimport numpy as np\nfrom dataclasses import dataclass\nfrom typing import Sequence, List\nMONTH_FEATURES: List[str] = {month_cols!r}\nIMPUTER_STATISTICS = np.array({imputer_stats})\nSCALER_MEAN = np.array({scaler_mean})\nSCALER_SCALE = np.array({scaler_scale})\nCLUSTER_CENTERS = np.array({centers})\n@dataclass\nclass RainfallClusterModel:\n    month_features: Sequence[str] = tuple(MONTH_FEATURES)\n    def preprocess(self, X_raw: np.ndarray) -> np.ndarray:\n        X_raw = np.asarray(X_raw, dtype=float)\n        if X_raw.ndim == 1: X_raw = X_raw.reshape(1, -1)\n        if X_raw.shape[1] != len(self.month_features):\n            raise ValueError(f'Expected {{len(self.month_features)}} features, got {{X_raw.shape[1]}}')\n        X_imp = np.where(np.isnan(X_raw), IMPUTER_STATISTICS, X_raw)\n        X_scaled = (X_imp - SCALER_MEAN) / SCALER_SCALE\n        return X_scaled\n    def predict(self, X_raw: np.ndarray) -> np.ndarray:\n        Xs = self.preprocess(X_raw)\n        d2 = ((Xs[:, None, :] - CLUSTER_CENTERS)**2).sum(axis=2)\n        return d2.argmin(axis=1)\n    def distances(self, X_raw: np.ndarray) -> np.ndarray:\n        Xs = self.preprocess(X_raw)\n        return ((Xs[:, None, :] - CLUSTER_CENTERS)**2).sum(axis=2) ** 0.5\nMODEL = RainfallClusterModel()\n"""
    return module_code


def main():
    st.set_page_config(page_title="Rainwater Harvesting & Clustering", layout="wide")
    st.title("🌧️ Rainwater Harvesting & Rainfall Pattern Clustering")

    df = load_rainfall()
    stats = compute_statistics(df)

    with st.sidebar:
        st.header("Input Parameters")
        roof_area = st.number_input("Roof area (m²)", min_value=5.0, value=round(stats['default_roof_area_m2'], 2), step=1.0)
        roof_type = st.selectbox("Roof type", ["RCC", "Tile", "Corrugated", "Sheet", "Asbestos", "Thatch", "Metal", "Other"], index=0)
        soil_type = st.selectbox("Soil type", ["Loam", "Sandy", "Clay", "Rocky"], index=0)
        roof_slope = st.slider("Roof slope (degrees)", min_value=0.0, max_value=45.0, value=5.0, step=0.5)
        annual_override = st.number_input("Override annual rainfall (mm) (optional)", min_value=0.0, value=0.0, help="Set >0 to override dataset mean")
        eff_override = st.number_input("Override efficiency (0-1) (optional)", min_value=0.0, max_value=1.0, value=0.0, step=0.01)
        clusters = st.slider("Clusters (k)", min_value=2, max_value=8, value=3)
        show_raw = st.checkbox("Show raw dataset")
        run_button = st.button("Run Analysis", type="primary")

    monthly_means = stats['monthly_means']
    dataset_mean_rainfall = stats['total_predicted_mm']
    if annual_override > 0:
        annual_rainfall = annual_override
    else:
        annual_rainfall = dataset_mean_rainfall

    efficiency = efficiency_from_inputs(roof_type, roof_slope, eff_override if eff_override > 0 else None)
    harvest = harvest_calculations(annual_rainfall, roof_area, efficiency)

    if run_button:
        cluster_res = run_clustering(df, clusters)
        labels = cluster_res['labels']
        inertia = cluster_res['inertia']
        X2 = cluster_res['embedding']
        month_cols = cluster_res['month_cols']

        c1, c2, c3 = st.columns(3)
        c1.metric("Annual Rainfall (mm)", f"{annual_rainfall:.2f}")
        c2.metric("Potential Harvest (L/yr)", f"{harvest['potential_l']:.0f}")
        c3.metric("Recommended Tank (L)", f"{harvest['recommended_tank_l']:.0f}")

        c4, c5, c6 = st.columns(3)
        c4.metric("Efficiency (%)", f"{efficiency*100:.1f}")
        c5.metric("Avg Monthly (L)", f"{harvest['avg_monthly_l']:.0f}")
        c6.metric("Inertia", f"{inertia:.2f}")

        # PCA scatter
        st.subheader("Cluster Visualization (PCA)")
        import plotly.express as px
        fig = px.scatter(x=X2[:,0], y=X2[:,1], color=labels.astype(str), labels={"x":"PC1","y":"PC2","color":"Cluster"}, title="Yearly Rainfall Profile Clusters (PCA)")
        st.plotly_chart(fig, use_container_width=True)

        # Distribution
        unique, counts = np.unique(labels, return_counts=True)
        dist_df = pd.DataFrame({"Cluster": unique, "Count": counts})
        st.subheader("Cluster Distribution")
        st.dataframe(dist_df, use_container_width=True)

        if show_raw:
            st.subheader("Raw Dataset (First 20 Rows)")
            st.dataframe(df.head(20), use_container_width=True)

        # Model export section
        st.subheader("Model Export")
        snippet = generate_model_snippet(cluster_res['pipeline'], month_cols, inertia, clusters)
        module_code = generate_module_code(cluster_res['pipeline'], month_cols, inertia, clusters)
        with st.expander("Show reconstruction snippet"):
            st.code(snippet, language="python")
        st.download_button("Download Model Snippet", data=snippet, file_name="model_snippet.py", mime="text/x-python")
        st.download_button("Download Model Module", data=module_code, file_name="rainfall_clustering_model.py", mime="text/x-python")

        st.markdown("---")
        st.caption("Generated by streamlit_app.py · All computations local.")
    else:
        st.info("Configure parameters in the sidebar and click 'Run Analysis'.")

    with st.expander("Monthly Mean Rainfall (mm)"):
        st.bar_chart(monthly_means.reindex(MONTH_ORDER))

    st.markdown("""---\n**Notes**:\n- Efficiency derived from roof type + slope (override if known).\n- 1 mm rainfall over 1 m² ≈ 1 litre potential harvest (before losses).\n- Tank sizing heuristic: 1.5 × average monthly collection.\n""")

if __name__ == "__main__":
    main()
