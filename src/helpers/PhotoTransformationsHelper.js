// @flow
import postProcessingDAO from '../model/PostProcessingDAO.js'
import PostProcessing from "../model/entities/PostProcessing";
import type {imagesType} from "../model/data_collections/flowTypes";

/**
 * @classdesc Class contains functions used for image post processing
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export class PhotoTransformationsHelper {
    postProcessing: PostProcessing;
    /**
     * Updates used entities according to selected model.
     */
    updateActiveModel() {
        this.postProcessing = postProcessingDAO.getActiveRecord();
    }
    /**
     * Function takes created images and applies shift from active model.
     * @param {imagesType} imagesOriginal
     * @param {number} maxShift
     * @return {imagesType}
     */
    static shiftImages(imagesOriginal: imagesType, maxShift: number): imagesType {
        let c, o, p;
        // duplicate images
        let images = imagesOriginal.slice(0);
        let shiftFactor = 2/(images.length-1);
        for (c = 0; c < images.length; c++) {
            let shift = (c*shiftFactor-1)*maxShift;
            let oimage = images[c];
            for (o = 0; o < oimage.length; o++) {
                let pimage = oimage[o];
                for (p = 0; p < pimage.length; p++) {
                    pimage[p][0] += shift;
                }
            }
        }
        return images;
    }
    /**
     * Function takes created images and applies keystone from active model.
     * @param {imagesType} images
     * @param {number} maxKeystone
     */
    static keystoneImages(images: imagesType, maxKeystone: number) {
        let c, o, p;

        let keystoneFactor = 2/(images.length-1);
        for (c = 0; c < images.length; c++) {
            let keystone = (c*keystoneFactor-1)*maxKeystone;
            let oimage = images[c];
            for (o = 0; o < oimage.length; o++) {
                let pimage = oimage[o];
                for (p = 0; p < pimage.length; p++) {
                    pimage[p][1] = pimage[p][1] * (1 + keystone * pimage[p][0]);
                }
            }
        }
    }
    /**
     * Function takes created images and applies stretch from active model.
     * @param {imagesType} images
     * @param {number} stretch
     */
    static stretchImages(images: imagesType, stretch: number) {
        let c, o, p;
        // duplicate images
        for (c = 0; c < images.length; c++) {
            let oimage = images[c];
            for (o = 0; o < oimage.length; o++) {
                let pimage = oimage[o];
                for (p = 0; p < pimage.length; p++) {
                    pimage[p][0] = pimage[p][0] * stretch;
                }
            }
        }
    }
    /**
     * Function takes created images and applies zoom from active model.
     * @param {imagesType} images
     * @param {number} zoom
     * @return {imagesType}
     */
    static zoomImages(images: imagesType, zoom: number): imagesType {
        let c, o, p;

        for (c = 0; c < images.length; c++) {
            let oimage = images[c];
            for (o = 0; o < oimage.length; o++) {
                let pimage = oimage[o];
                for (p = 0; p < pimage.length; p++) {
                    pimage[p][0] = pimage[p][0] * zoom;
                    pimage[p][1] = pimage[p][1] * zoom;
                }
            }
        }
        return images;
    }
    /**
     * Function takes created images and applies transformations entered in active model.
     * @param {imagesType} images
     */
    transformImages(images: imagesType) {
        PhotoTransformationsHelper.keystoneImages(images, this.postProcessing.getImagesKeystone());
        PhotoTransformationsHelper.stretchImages(images, this.postProcessing.getImagesStretch());
        PhotoTransformationsHelper.shiftImages(images, this.postProcessing.getImagesShift());
        PhotoTransformationsHelper.zoomImages(images, this.postProcessing.getImagesZoom());
    }
}

export const photoTransformationsHelper = new PhotoTransformationsHelper();