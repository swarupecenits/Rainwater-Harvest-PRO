# Auto-generated Rainfall Clustering Model Module
#
# Exported from k_Means_v2.py
# Clusters: 3
# Inertia: 1116.57
# Month feature order: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

import numpy as np
from dataclasses import dataclass
from typing import Sequence, List

MONTH_FEATURES: List[str] = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
IMPUTER_STATISTICS = np.array([4.67196261682243, 7.501869158878505, 11.519626168224303, 45.19719626168223, 112.69719626168222, 81.10373831775702, 110.72336448598128, 138.89626168224305, 185.0112149532711, 162.27196261682246, 59.40934579439253, 16.810377358490566])
SCALER_MEAN = np.array([4.67196261682243, 7.501869158878505, 11.519626168224303, 45.19719626168223, 112.69719626168222, 81.10373831775702, 110.72336448598128, 138.89626168224305, 185.0112149532711, 162.27196261682246, 59.40934579439253, 16.810377358490566])
SCALER_SCALE = np.array([11.350096470495291, 17.137072951026436, 21.347541647916167, 40.6726141009892, 52.59087106738365, 44.37896087364259, 63.575985431091894, 81.2710671151947, 99.49859325374022, 98.90180786507626, 58.27819884393115, 22.803292941013755])
CLUSTER_CENTERS = np.array([[-0.20865539947392014, 0.2566442270328355, 0.04089306575745705, -0.4400306362714696, -0.4569334773752978, 0.017107760755544436, 1.0127101056295866, 0.927167430434995, -0.42334594577595985, 0.563018959316676, -0.13304787026108342, -0.0153976927867198], [-0.24862895431401444, 0.015093426844254418, -0.15833919145175798, -0.5450411630346137, -0.05889227918879397, 0.485446925281451, -0.45866700128227356, -0.31439878602702137, 0.7400194103459743, -0.44571974854848073, 0.322430249705019, 0.010866433517906357], [0.3351465788828531, -0.16673209666596076, 0.1091728111047877, 0.7242753638810008, 0.32389134440682793, -0.4201976155798858, -0.22030726229494196, -0.290808150060403, -0.3708977123821376, 0.03857418985093271, -0.19244571092758841, 6.251625691099855e-05]])

@dataclass
class RainfallClusterModel:
    month_features: Sequence[str] = tuple(MONTH_FEATURES)

    def preprocess(self, X_raw: np.ndarray) -> np.ndarray:
        X_raw = np.asarray(X_raw, dtype=float)
        if X_raw.ndim == 1:
            X_raw = X_raw.reshape(1, -1)
        if X_raw.shape[1] != len(self.month_features):
            raise ValueError(f"Expected {len(self.month_features)} features, got {X_raw.shape[1]}")
        X_imp = np.where(np.isnan(X_raw), IMPUTER_STATISTICS, X_raw)
        X_scaled = (X_imp - SCALER_MEAN) / SCALER_SCALE
        return X_scaled

    def predict(self, X_raw: np.ndarray) -> np.ndarray:
        Xs = self.preprocess(X_raw)
        d2 = ((Xs[:, None, :] - CLUSTER_CENTERS)**2).sum(axis=2)
        return d2.argmin(axis=1)

    def distances(self, X_raw: np.ndarray) -> np.ndarray:
        Xs = self.preprocess(X_raw)
        return ((Xs[:, None, :] - CLUSTER_CENTERS)**2).sum(axis=2) ** 0.5

    @property
    def n_clusters(self) -> int:
        return CLUSTER_CENTERS.shape[0]

MODEL = RainfallClusterModel()

if __name__ == '__main__':
    demo = np.random.rand(2, len(MONTH_FEATURES)) * 100
    print('Demo input shape:', demo.shape)
    print('Predicted clusters:', MODEL.predict(demo))
