// @flow
/**
 * @classdesc Helper class used to store various unrelated functions.
 * @author Matej Berka <matejb@students.zcu.cz>
 */
export default class Utils {
    static SQRT2:number = Math.sqrt(Math.sqrt(2));
    static SQRT1_2:number = Math.sqrt(Math.sqrt(1/2));
    /**
     * Converts an internal value of a logarithmic slider to a number
     * Notes:
     * log(y) = kx + q
     * y = exp(kx + q) = exp(kx) exp(q)
     *
     * x = 0 => y = min => q = log(min)
     * x = 1 => y = max => max = exp(k) min => k = log(max / min)
     * @param {number} x
     * @param {number} min
     * @param {number} max
     * @return {number}
    */
    static convertRangeNumLog(x: number, min: number, max: number): number {
        return Math.exp(Math.log(max / min) * x / 100) * min;
    }
    /**
     * Converts a number to an internal value of a logarithmic slider.
     * y = exp(log(max/min)*x/100)*min
     * y/min = exp(log(max/min)*x/100)
     * log(y/min) = log(max/min)*x/100
     * x = 100*log(y/min)/log(max/min)
     * @param {number} x
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    static convertNumRangeLog(x: number, min: number, max: number): number {
        return 100*Math.log(x/min)/Math.log(max/min);
    }
    /**
     * Converts an internal value of a linear slider to a number.
     * @param {number} x
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    static convertRangeNumLin(x: number, min: number, max: number): number {
        return (x / 100) * (max - min) + min;
    }
    /**
     * Converts a number to an internal value of a linear slider.
     *
     * y = (x / 100) * (max - min) + min
     * y - min = (x / 100) * (max - min)
     * (y - min)/(max - min) * 100 = x
     * @param {number} y
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    static convertNumRangeLin(y: number, min: number, max: number): number {
        return (y - min)/(max - min) * 100;
    }
    /**
     * Updates a number value because a linear slider was changed.
     * @param {number} min
     * @param {number} max
     * @param {number} precision
     * @param {number} sliderVal
     * @return {number}
     */
    static updateNumLin(min: number, max: number, precision: number, sliderVal: number): number {
        return Math.round(this.convertRangeNumLin(sliderVal, min, max)*precision)/precision;
    }
    /**
     * Updates a linear slider value because a number was changed.
     * @param {number} min
     * @param {number} max
     * @param {number} inputVal
     * @return {number}
     */
    static updateRangeLin(min: number, max: number, inputVal: number): number {
        return this.convertNumRangeLin(inputVal, min, max);
    }
    /**
     * Updates a number value because a logarithmic slider was changed.
     * @param {number} min
     * @param {number} max
     * @param {number} precision
     * @param {number} sliderVal
     * @return {number}
     */
    static updateNumLog(min: number, max: number, precision: number, sliderVal: number): number {
        return Math.round(this.convertRangeNumLog(sliderVal, min, max) * precision) / precision;
    }
    /**
     * Updates a logarithmic slider value because a number was changed.
     * @param {number} min
     * @param {number} max
     * @param {number} inputVal
     * @return {number}
     */
    static updateRangeLog(min: number, max: number, inputVal: number): number {
        return this.convertNumRangeLog(inputVal, min, max);
    }
    /**
     * Updates a logarithmic slider value because a number was changed.
     * @param {number} val
     * @return string
     */
    static formatSliderValue(val: number): string {
        return val.toFixed(2);
    };
    /**
     * Updates a logarithmic slider value because a number was changed.
     * @param {number} num
     * @return string
     */
    static niceNumber(num: number): string {
        let epsilon = 1e-7;
        let numSign = num < 0 ? "-" : "";
        num = Math.abs(num);

        if (num < epsilon)
            return "0";

        let numInt = Math.floor(num + epsilon);
        let numFracNom = numInt;
        let numFracDenom = 1;
        while (Math.abs(numFracNom / numFracDenom - num) > epsilon) {
            numFracDenom *= 10;
            numFracNom = Math.round(num * numFracDenom + epsilon);
        }
        let numString = numSign + numInt.toString();
        if (numFracDenom > 1)
            numString = numString + '.' + Math.round(numFracNom - numInt * numFracDenom).toString();
        return numString;
    }
}