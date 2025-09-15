"""KMeans clustering on Bengaluru rainfall data.

This script:
1. Loads the rainfall dataset (yearly rows, monthly columns).
2. Cleans empty unnamed column and converts values to numeric.
3. Computes monthly means and total predicted annual rainfall.
4. Estimates potential collection for a 30x40 ft site (approx 111.48 m^2 area).
5. Performs KMeans clustering on per-year monthly rainfall profile.
6. Reduces dimensions with PCA for visualization.
7. Saves cluster plot to 'rainfall_clusters.png'.

Assumptions:
- The last empty column in CSV is dropped.
- Roof catchment area for 30x40 site assumed: 30 ft * 40 ft = 1200 sq ft = 111.48 m^2.
- Collection efficiency assumed 0.8 (adjust as needed).
"""

from __future__ import annotations
import sys
from time import time
import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Add feature_format utilities path (per request)
sys.path.append("E:/Downloads/ud120-projects-master/ud120-projects-master/tools/")
from feature_format import featureFormat  # noqa: E402

DATA_PATH = Path(__file__).parent.parent / "Datasets" / "Bengaluru Rainfall Data.csv"

MONTH_ORDER = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


def load_and_clean(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    # Drop empty / unnamed columns
    empty_cols = [c for c in df.columns if c.strip() == '' or c.lower().startswith('unnamed')]
    if empty_cols:
        df.drop(columns=empty_cols, inplace=True)
    # Rename first column to Year
    df.rename(columns={df.columns[0]: 'Year'}, inplace=True)
    # Ensure all expected month columns exist (intersect)
    month_cols_present = [c for c in MONTH_ORDER if c in df.columns]
    # Convert to numeric
    for c in month_cols_present:
        df[c] = pd.to_numeric(df[c], errors='coerce')
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    df.dropna(subset=['Year'], inplace=True)
    # Impute month NaNs with column means
    df[month_cols_present] = df[month_cols_present].apply(lambda col: col.fillna(col.mean()))
    df.reset_index(drop=True, inplace=True)
    return df[["Year"] + month_cols_present]


def rainfall_statistics(df: pd.DataFrame) -> dict:
    month_cols = [c for c in df.columns if c != 'Year']
    monthly_means = df[month_cols].mean()
    total_predicted = monthly_means.sum()
    roof_area_m2 = 30 * 0.3048 * 40 * 0.3048  # 111.483648 m2
    efficiency = 0.8
    expected_collection = total_predicted * roof_area_m2 * efficiency  # litres
    return {
        'monthly_means': monthly_means,
        'total_predicted_mm': total_predicted,
        'expected_collection_litres': expected_collection,
        'roof_area_m2': roof_area_m2,
        'efficiency': efficiency,
    }


def dataframe_to_feature_dict(df: pd.DataFrame) -> tuple[dict, list[str]]:
    """Convert dataframe to dictionary-of-dicts for featureFormat."""
    month_cols = [c for c in df.columns if c != 'Year']
    data_dict: dict = {}
    for _, row in df.iterrows():
        year_key = int(row['Year'])
        data_dict[year_key] = {m: float(row[m]) for m in month_cols}
    return data_dict, month_cols


def run_kmeans(X: np.ndarray, k: int = 3, random_state: int = 42):
    pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="mean")),
        ("scaler", StandardScaler()),
        ("kmeans", KMeans(n_clusters=k, n_init=10, max_iter=300, random_state=random_state))
    ])
    t0 = time()
    labels = pipeline.fit_predict(X)
    elapsed = time() - t0
    inertia = pipeline.named_steps['kmeans'].inertia_
    return pipeline, labels, inertia, elapsed


def plot_clusters(X: np.ndarray, labels: np.ndarray, outfile: str = 'rainfall_clusters.png') -> None:
    pca = PCA(n_components=2, random_state=42)
    X2 = pca.fit_transform(X)
    plt.figure(figsize=(8, 6))
    scatter = plt.scatter(X2[:, 0], X2[:, 1], c=labels, cmap='viridis', s=30, alpha=0.85)
    plt.title('KMeans Clusters of Yearly Rainfall Profiles (PCA 2D)')
    plt.xlabel('PC1')
    plt.ylabel('PC2')
    plt.colorbar(scatter, label='Cluster')
    plt.tight_layout()
    plt.savefig(outfile, dpi=150)
    plt.close()


def main():
    parser = argparse.ArgumentParser(description="Rainwater harvesting analytics + clustering")
    parser.add_argument("--roof-area", type=float, required=False, default=None, help="Roof catchment area in square meters (if omitted, uses 30x40 ft assumption ~111.48 m2)")
    parser.add_argument("--roof-type", type=str, required=False, default="RCC", help="Roof type: RCC, Tile, Corrugated, Asbestos, Thatch, Metal")
    parser.add_argument("--soil-type", type=str, required=False, default="Loam", help="Soil type: Sandy, Loam, Clay, Rocky")
    parser.add_argument("--roof-slope", type=float, required=False, default=5.0, help="Roof slope in degrees (approx; affects runoff)")
    parser.add_argument("--catchment-eff", type=float, required=False, default=None, help="Override catchment efficiency (0-1). If not set derived from roof type.")
    parser.add_argument("--annual-rainfall", type=float, required=False, default=None, help="Override annual rainfall (mm). If not set uses dataset mean.")
    parser.add_argument("--clusters", type=int, default=3, help="Number of KMeans clusters (default 3)")
    parser.add_argument("--no-plot", action="store_true", help="Skip cluster plot generation")
    args = parser.parse_args()

    # Load and stats
    df = load_and_clean(DATA_PATH)
    stats = rainfall_statistics(df)
    dataset_mean_rainfall = stats['total_predicted_mm']

    print('Monthly mean rainfall (mm) [Jan..Dec]:')
    print(stats['monthly_means'].reindex(MONTH_ORDER).tolist())
    print(f"Predicted average annual rainfall (dataset mean): {dataset_mean_rainfall:.2f} mm")

    # Determine inputs ----------------------------------------------------
    roof_area_m2 = args.roof_area if args.roof_area is not None else stats['roof_area_m2']
    annual_rainfall_mm = args.annual_rainfall if args.annual_rainfall is not None else dataset_mean_rainfall
    roof_type = args.roof_type.strip().lower()
    soil_type = args.soil_type.strip().lower()
    roof_slope = max(args.roof_slope, 0.0)

    # Coefficient mapping
    base_coeffs = {
        'rcc': 0.85,
        'concrete': 0.85,
        'tile': 0.75,
        'corrugated': 0.70,
        'sheet': 0.70,
        'asbestos': 0.65,
        'poor': 0.65,
        'thatch': 0.60,
        'metal': 0.80,
    }
    coeff = base_coeffs.get(roof_type, 0.70)
    # Adjust for slope: mild bonus up to +5% if slope between 5 and 25 degrees
    if 5 <= roof_slope <= 25:
        coeff *= 1.03
    coeff = min(coeff, 0.9)

    if args.catchment_eff is not None:
        catchment_eff = max(0.0, min(1.0, args.catchment_eff))
    else:
        catchment_eff = coeff

    potential_water_save_l_per_year = annual_rainfall_mm * roof_area_m2 * catchment_eff

    # Simple heuristic for recommended tank sizing:
    # - Provide storage for 1.5 months of average collection (i.e., annual / 8)
    avg_monthly_collection = potential_water_save_l_per_year / 12.0
    tank_volume_l = avg_monthly_collection * 1.5  # buffer factor

    # Soil type advisory (could later adjust infiltration or recharge component)
    soil_infiltration_notes = {
        'sandy': 'High infiltration potential; consider recharge pit sized appropriately.',
        'loam': 'Balanced infiltration; standard filtration adequate.',
        'clay': 'Low infiltration; prioritize storage & overflow management.',
        'rocky': 'Variable infiltration; assess need for silt traps and recharge shafts.'
    }
    soil_note = soil_infiltration_notes.get(soil_type, 'Soil type not recognized; using generic assumptions.')

    print("\nUser Input / Derived Parameters:")
    print(f"Roof area: {roof_area_m2:.2f} m^2")
    print(f"Roof type: {args.roof_type} (derived efficiency {catchment_eff:.2f})")
    print(f"Annual rainfall used: {annual_rainfall_mm:.2f} mm")
    print(f"Roof slope (deg): {roof_slope:.1f}")
    print(f"Soil type: {args.soil_type} -> {soil_note}")

    print("\nHarvest Potential:")
    print(f"Potential harvestable water (annual): {potential_water_save_l_per_year:,.2f} litres")
    print(f"Recommended tank volume: {tank_volume_l:,.2f} litres (approx 1.5 months storage)")

    # Clustering -----------------------------------------------------------
    data_dict, month_cols = dataframe_to_feature_dict(df)
    X = featureFormat(data_dict, month_cols, remove_NaN=True, remove_all_zeroes=False)
    if np.isnan(X).any():
        print("Warning: NaNs detected after featureFormat; they will be imputed in pipeline.")
    pipeline, labels, inertia, elapsed = run_kmeans(X, k=args.clusters)
    print(f"\nKMeans trained in {elapsed:.3f} s; inertia={inertia:.2f}; clusters={args.clusters}")
    unique, counts = np.unique(labels, return_counts=True)
    print('Cluster distribution (cluster: count):', dict(zip(unique, counts)))
    if not args.no_plot:
        plot_clusters(X, labels)
        print("Cluster plot saved to 'rainfall_clusters.png'")

    # Summary lines matching earlier style if needed
    print(f"\nCollection efficiency (final): {catchment_eff*100:.1f}%")
    print(f"Expected annual collection (computed): {potential_water_save_l_per_year:.2f} litres")


if __name__ == '__main__':
    main()
