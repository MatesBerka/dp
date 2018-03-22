// @flow
import diagnosticsDAO from '../model/DiagnosticsDAO.js';
import displayAndViewerDAO from "../model/DisplayAndViewerDAO";
import visualizationBuilder from "./VisualizationBuilder";
import Diagnostics from "../model/entities/Diagnostics";
import DisplayAndViewer from "../model/entities/DisplayAndViewer";
import type {imagesType, vec3} from "../model/data_collections/flowTypes";

/**
 * @classdesc Service class used to handle diagnostics construction.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
class DiagnosticsService {
    statValues: Diagnostics = diagnosticsDAO.getActiveRecord();
    DAW: DisplayAndViewer = displayAndViewerDAO.getActiveRecord();
    /**
     * Returns diagnostics active entity.
     * @public
     */
    getActiveRecord(): Diagnostics {
        return this.statValues;
    }
    /**
     * Switches to new active model.
     * @public
     */
    switchModel() {
        this.statValues = diagnosticsDAO.getActiveRecord();
        this.DAW = displayAndViewerDAO.getActiveRecord();
        this.updateDiagnostics();
    }
    /**
     * Helper function used to calculate max disparity.
     * @param {imagesType} images
     * @return {vec3}
     * @private
     */
    static _calculateMaxDisparity(images: imagesType): vec3 {
        let ci, oi, vi, disparity, minx  = 1e10, maxx = -1e10, maxy = -1e10;
        for (oi = 0; oi < images[0].length; oi++) {
            for (vi = 0; vi < images[0][oi].length; vi++) {
                let pointsx = [], pointsy = [];
                for (ci = 0; ci < images.length; ci++) {
                    pointsx.push(images[ci][oi][vi][0]);
                    pointsy.push(images[ci][oi][vi][1]);
                }
                disparity = pointsx[0] - pointsx[1];
                if (disparity < minx) minx = disparity;
                if (disparity > maxx) maxx = disparity;
                disparity = Math.abs(pointsy[0] - pointsy[1]);
                if (disparity > maxy) maxy = disparity;
            }
        }
        return [minx / 2, maxx / 2, maxy / 2];
    }
    /**
     * Helper function used to calculate parallax deg.
     * @param {number} disparity
     * @return {number}
     * @private
     */
    _calculateParallaxDeg(disparity: number): number {
        return Math.atan(disparity * this.DAW.getDisplayWidth() / (2 * this.DAW.getHeadDistance())) * 180 / Math.PI;
    }
    /**
     * Helper function used to calculate convergence deg.
     * @param {number} disparity
     * @return {number}
     * @private
     */
    _calculateConvergenceDeg(disparity: number): number {
        return Math.atan((this.DAW.getEyesSeparation() + disparity * this.DAW.getDisplayWidth()) / (2* this.DAW.getHeadDistance())) * 180 / Math.PI;
    }
    /**
     * Function used to calculate diagnostics values for active object.
     * @public
     */
    updateDiagnostics() {
        let images = visualizationBuilder.getImagesForDiagnostics(this.statValues.isGlobalActive());
        let disparity = DiagnosticsService._calculateMaxDisparity(images);
        this.statValues.setDisparityXMinMM([(disparity[0] * this.DAW.getDisplayWidth() * 1000), 2, 0, 0]);
        this.statValues.setDisparityXMaxMM([(disparity[1] * this.DAW.getDisplayWidth() * 1000), 2, 0, 0]);
        this.statValues.setDisparityYMaxMM([(disparity[2] * this.DAW.getDisplayWidth() * 1000), 2, 0, 0]);
        this.statValues.setDisparityXMinPx([(disparity[0] * this.DAW.getDisplayPPL()), 2, 0, 0]);
        this.statValues.setDisparityXMaxPx([(disparity[1] * this.DAW.getDisplayPPL()), 2, 0, 0]);
        this.statValues.setDisparityYMaxPx([(disparity[2] * this.DAW.getDisplayPPL()), 2, 0, 0]);
        this.statValues.setDisparityXMinPct([(100 * disparity[0]), 2, 0, 0]);
        this.statValues.setDisparityXMaxPct([(100 * disparity[1]), 2, 0, 0]);
        this.statValues.setDisparityYMaxPct([(100 * disparity[2]), 2, 0, 0]);
        this.statValues.setDisparityXMinConv([(this._calculateConvergenceDeg(disparity[0])), 2, -1, 9]);
        this.statValues.setDisparityXMaxConv([(this._calculateConvergenceDeg(disparity[1])), 2, -1, 9]);
        this.statValues.setDisparityXMinParallax([(this._calculateParallaxDeg(disparity[0])), 1, 0, 0]);
        this.statValues.setDisparityXMaxParallax([(this._calculateParallaxDeg(disparity[1])), 2, 0, 0]);
        // safe range for vertical disparity: up to 15-20 arcmin
        // (see Filippo Speranza and Laurie M. Wilcox:
        // Viewing stereoscopic images comfortably: the effects of whole-field vertical disparity,
        // Stereoscopic Displays and Virtual Reality Systems IX)
        this.statValues.setDisparityYMaxParallax([60 * this._calculateParallaxDeg(disparity[2]), 2, 0, 15]);
        // D_f = m * D_v + t
        // =>
        // D_v = (D_f - t) / m
        // where
        // D_f = viewing (focus) distance in diopters
        // D_v = vergence distance in diopters
        // m =  1.035 (near) or 1.129 (far)
        // t = -0.626 (near) or 0.442 (far)
        //var vergenceDistanceNear = 1.035 / (1 / this.DAW.getHeadDistance() + 0.626);
        //var vergenceDistanceFar  = 1.129 / (1 / this.DAW.getHeadDistance() - 0.442);

        // enhancement:
        // interpolation between D_f = D_v (m = 1, t = 0) for alpha = 1
        // and D_f = m * D_v + t (m, t = values above) for alpha = 0
        // i.e.
        // D_f = alpha * D_v + (1-alpha)(m * D_v + t)
        //     = alpha * D_v + m * D_v + t - alpha * m * D_v - alpha * t
        //     = D_v * (alpha + m - alpha*m) + t - alpha*t
        // =>
        // m(alpha) = m*(1-alpha)+alpha
        // t(alpha) = t*(1-alpha)
        let alpha = this.DAW.getViewingComfort() / 10;
        let vergenceDistanceNear = (1.035*(1-alpha)+alpha) / (1 / this.DAW.getHeadDistance() + 0.626*(1-alpha));
        let vergenceDistanceFar = (1.129*(1-alpha)+alpha) / (1 / this.DAW.getHeadDistance() - 0.442*(1-alpha));
        this.statValues.setVergenceDistanceNear([vergenceDistanceNear, 2, 0, 0]);
        this.statValues.setVergenceDistanceFar([vergenceDistanceFar, 2, 0, 0]);
        this.statValues.setVergenceMinAbs([(100 * vergenceDistanceNear), 2, 0, 0]);
        this.statValues.setVergenceMinRel([(100 * (vergenceDistanceNear - this.DAW.getHeadDistance())), 2, 0, 0]);
        this.statValues.setVergenceMaxRelD([(1 / vergenceDistanceNear - 1 / this.DAW.getHeadDistance()), 2, -0.3, 0.3]);
        this.statValues.setVergenceMinRelD([(1 / vergenceDistanceFar - 1 / this.DAW.getHeadDistance()), 2, -0.3, 0.3]);
        if (vergenceDistanceFar < 100 && vergenceDistanceFar > 0) {
            this.statValues.setVergenceMaxAbs([(100 * vergenceDistanceFar), 2, 0, 0]);
            this.statValues.setVergenceMaxRel([(100 * (vergenceDistanceFar - this.DAW.getHeadDistance())), 2, 0, 0]);
        } else {
            this.statValues.setVergenceMaxAbs('INFINITY');
            this.statValues.setVergenceMaxRel('INFINITY');
        }
    }
}

const diagnosticsService = new DiagnosticsService();
export default diagnosticsService;