import io
import cv2
import numpy as np
import streamlit as st
from typing import Tuple, Optional, Dict, List

# ----------------------------- Utility Functions -----------------------------

def load_image(file) -> np.ndarray:
    data = file.read() if hasattr(file, 'read') else file
    file_bytes = np.asarray(bytearray(data), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    return img

def to_rgb(img: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

def preprocess_edges(img: np.ndarray, blur: int = 5, canny1: int = 50, canny2: int = 150) -> np.ndarray:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if blur > 0:
        k = max(3, blur if blur % 2 == 1 else blur + 1)
        gray = cv2.GaussianBlur(gray, (k, k), 0)
    edges = cv2.Canny(gray, canny1, canny2)
    edges = cv2.dilate(edges, None, iterations=1)
    edges = cv2.erode(edges, None, iterations=1)
    return edges

def find_main_contour(edges: np.ndarray, min_area: int = 500) -> Optional[np.ndarray]:
    cnts = cv2.findContours(edges.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    if not cnts:
        return None
    cnts = [c for c in cnts if cv2.contourArea(c) >= min_area]
    if not cnts:
        return None
    return max(cnts, key=cv2.contourArea)

def compute_min_rect_metrics(contour: np.ndarray) -> Dict:
    rect = cv2.minAreaRect(contour)
    box = cv2.boxPoints(rect)
    box = np.intp(box)
    (w, h) = rect[1]
    area_px = w * h
    return {"rect": rect, "box": box, "w": w, "h": h, "area_px": area_px}

def watershed_segment(img: np.ndarray) -> np.ndarray:
    # Basic watershed to isolate large structures (roofs). Returns mask.
    blur = cv2.pyrMeanShiftFiltering(img, 21, 51)
    gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    # Distance transform
    dist = cv2.distanceTransform(thresh, cv2.DIST_L2, 5)
    dist_norm = cv2.normalize(dist, None, 0, 1.0, cv2.NORM_MINMAX)
    # Detect sure foreground
    _, sure_fg = cv2.threshold(dist_norm, 0.4, 1.0, cv2.THRESH_BINARY)
    sure_fg = (sure_fg * 255).astype(np.uint8)
    # Unknown region
    unknown = cv2.subtract(thresh, sure_fg)
    # Markers
    cnts = cv2.findContours(sure_fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    markers = np.zeros(gray.shape, dtype=np.int32)
    for i, c in enumerate(cnts):
        cv2.drawContours(markers, [c], -1, i + 1, -1)
    markers = cv2.watershed(img.copy(), markers)
    mask = (markers > 0).astype(np.uint8) * 255
    return mask

def annotate_image(img: np.ndarray, box: np.ndarray, area_px: float, area_real: Optional[float], units: str) -> np.ndarray:
    annotated = img.copy()
    cv2.drawContours(annotated, [box], -1, (0, 255, 255), 2)
    cx = int(box[:,0].mean())
    cy = int(box[:,1].mean())
    cv2.putText(annotated, f"Area(px): {area_px:.0f}", (cx - 80, cy - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
    if area_real is not None:
        cv2.putText(annotated, f"Area: {area_real:.2f} {units}^2", (cx - 80, cy + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
    return annotated

def calibrate_area(area_px: float, known_length_px: float, known_length_real: float) -> float:
    # area scales by (real/px)^2
    scale = known_length_real / known_length_px
    return area_px * (scale ** 2)

# ----------------------------- Streamlit App -----------------------------
def polygon_fill_contours(img: np.ndarray, blur: int, canny1: int, canny2: int, min_area: int, max_polys: int) -> Tuple[np.ndarray, List[np.ndarray], List[float]]:
    """Detect multiple contours and create a colored filled overlay.
    Returns overlay image (BGR), list of contours kept, and list of contour areas (pixel area via cv2.contourArea).
    """
    edges = preprocess_edges(img, blur=blur, canny1=canny1, canny2=canny2)
    cnts = cv2.findContours(edges.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    filtered = [c for c in cnts if cv2.contourArea(c) >= min_area]
    # Sort by area descending
    filtered.sort(key=lambda c: cv2.contourArea(c), reverse=True)
    filtered = filtered[:max_polys]
    overlay = img.copy()
    areas = []
    # Distinct colors cycle
    palette = [(0,255,0),(0,255,255),(255,0,0),(255,0,255),(0,128,255),(255,128,0),(0,200,150)]
    for i, c in enumerate(filtered):
        area = cv2.contourArea(c)
        areas.append(area)
        color = palette[i % len(palette)]
        cv2.drawContours(overlay, [c], -1, color, 2)
        cv2.drawContours(overlay, [c], -1, color, -1)  # fill
        # Put label at centroid
        M = cv2.moments(c)
        if M['m00'] != 0:
            cx = int(M['m10']/M['m00'])
            cy = int(M['m01']/M['m00'])
            cv2.putText(overlay, f"{i+1}", (cx-5, cy+5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)
    # Blend overlay with original for transparency effect
    filled = cv2.addWeighted(img, 0.5, overlay, 0.5, 0)
    return filled, filtered, areas

st.set_page_config(page_title="Roof Area Estimator", layout="wide")
st.title("Satellite Roof Area Approximation")
with st.sidebar:
    st.header("1. Upload Image")
    file = st.file_uploader("Satellite / Drone Roof Image", type=["jpg","jpeg","png"])
    st.header("2. Method & Parameters")
    method = st.selectbox("Segmentation Method", ["Edge Contour", "Watershed", "Polygon Fill"], index=0)
    blur = st.slider("Gaussian Blur Kernel", 0, 21, 5, step=2)
    c1 = st.slider("Canny Threshold 1", 0, 300, 50)
    c2 = st.slider("Canny Threshold 2", 0, 400, 150)
    min_area = st.number_input("Min Contour Area (px)", 100, 500000, 1000, step=100)
    max_polys =  st.number_input("Max Polygons (Polygon Fill)", 1, 100, 25, step=1)
    st.header("3. Calibration (Optional)")
    st.markdown("Provide a known linear dimension visible in the image to convert pixels to real units.")
    known_len_px = st.number_input("Known Length (pixels)", min_value=0.0, value=0.0, step=1.0)
    known_len_real = st.number_input("Known Length (meters)", min_value=0.0, value=0.0, step=0.1)
    units = st.selectbox("Output Units", ["meters", "feet"], index=0)
    run = st.button("Run Analysis")

col1, col2, col3 = st.columns(3)

if file and run:
    img = load_image(file)
    orig_display = to_rgb(img)

    if method == "Edge Contour":
        edges = preprocess_edges(img, blur=blur, canny1=c1, canny2=c2)
        contour = find_main_contour(edges, min_area=int(min_area))
        if contour is None:
            st.error("No contour found. Try adjusting thresholds or min area.")
        else:
            metrics = compute_min_rect_metrics(contour)
            area_px = metrics['area_px']
            box = metrics['box']
            area_real = None
            if known_len_px > 0 and known_len_real > 0:
                area_real = calibrate_area(area_px, known_len_px, known_len_real)
                if units == 'feet':
                    area_real *= 10.7639  # m^2 to ft^2
            annotated = annotate_image(img, box, area_px, area_real, 'm' if units=='meters' else 'ft')
            with col1: st.subheader("Original"); st.image(orig_display, channels="RGB")
            with col2: st.subheader("Edges"); st.image(edges, clamp=True)
            with col3: st.subheader("Annotated"); st.image(to_rgb(annotated), channels="RGB")
            st.success(f"Pixel Area: {area_px:.0f} px^2")
            if area_real is not None:
                st.info(f"Estimated Area: {area_real:.2f} {units}^2")
    elif method == "Watershed":  # Watershed
        mask = watershed_segment(img)
        edges = cv2.Canny(mask, 50, 150)
        contour = find_main_contour(mask, min_area=int(min_area))
        if contour is None:
            st.error("No region found via watershed. Try Edge Contour method.")
        else:
            metrics = compute_min_rect_metrics(contour)
            area_px = metrics['area_px']
            box = metrics['box']
            area_real = None
            if known_len_px > 0 and known_len_real > 0:
                area_real = calibrate_area(area_px, known_len_px, known_len_real)
                if units == 'feet':
                    area_real *= 10.7639
            annotated = annotate_image(img, box, area_px, area_real, 'm' if units=='meters' else 'ft')
            with col1: st.subheader("Original"); st.image(orig_display, channels="RGB")
            with col2: st.subheader("Mask"); st.image(mask, clamp=True)
            with col3: st.subheader("Annotated"); st.image(to_rgb(annotated), channels="RGB")
            st.success(f"Pixel Area: {area_px:.0f} px^2")
            if area_real is not None:
                st.info(f"Estimated Area: {area_real:.2f} {units}^2")
    else:  # Polygon Fill
        filled, polys, areas = polygon_fill_contours(img, blur=blur, canny1=c1, canny2=c2, min_area=int(min_area), max_polys=int(max_polys))
        if not polys:
            st.error("No polygons found. Adjust thresholds or min area.")
        else:
            total_px_area = sum(areas)
            area_real = None
            if known_len_px > 0 and known_len_real > 0:
                # Use calibration based on linear scale then apply to total pixel area
                area_real = calibrate_area(total_px_area, known_len_px, known_len_real)
                if units == 'feet':
                    area_real *= 10.7639
            with col1: st.subheader("Original"); st.image(orig_display, channels="RGB")
            with col2: st.subheader("Filled Polygons"); st.image(to_rgb(filled), channels="RGB")
            with col3:
                st.subheader("Areas")
                for i, a in enumerate(areas, start=1):
                    st.write(f"Polygon {i}: {a:.0f} px^2")
                st.write(f"**Total Pixel Area:** {total_px_area:.0f} px^2")
                if area_real is not None:
                    st.write(f"**Total Estimated Area:** {area_real:.2f} {units}^2")

else:
    st.info("Upload an image, set parameters, and click 'Run Analysis'.")

st.markdown("---")
st.caption("Experimental roof area estimation derived from your provided OpenCV scripts. Adjust thresholds for best results.")
