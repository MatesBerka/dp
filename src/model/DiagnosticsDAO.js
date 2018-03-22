// @flow
import Diagnostics from './entities/Diagnostics.js';
import GenericDAO from './GenericDAO.js';
/**
 * @classdesc Class representing Data access object for Diagnostics entity.
 * @extends GenericDAO
 * @author Matej Berka <matejb@students.zcu.cz>
 */

class DiagnosticsDAO extends GenericDAO {
    records: Array<Diagnostics>;
    /**
     * @override
     */
    constructor() {
        super();
        this.addNewRecord();
    }
    /**
     * @override
     */
    addNewRecord() {
        this.records.push(new Diagnostics());
    }
    /**
     * @override
     */
    toJSON(): Array<Object> {
        let entities = [];
        for (let instance of this.records) {
            entities.push({
                isGlobal: instance.isGlobal,
                disparityXMinMM: instance.disparityXMinMM,
                disparityXMaxMM: instance.disparityXMaxMM,
                disparityYMaxMM: instance.disparityYMaxMM,
                disparityXMinPx: instance.disparityXMinPx,
                disparityXMaxPx: instance.disparityXMaxPx,
                disparityYMaxPx: instance.disparityYMaxPx,
                disparityXMinPct: instance.disparityXMinPct,
                disparityXMaxPct: instance.disparityXMaxPct,
                disparityYMaxPct: instance.disparityYMaxPct,
                disparityXMinConv: instance.disparityXMinConv,
                disparityXMaxConv: instance.disparityXMaxConv,
                disparityXMinParallax: instance.disparityXMinParallax,
                disparityXMaxParallax: instance.disparityXMaxParallax,
                disparityYMaxParallax: instance.disparityYMaxParallax,
                vergenceMinAbs: instance.vergenceMinAbs,
                vergenceMinRel: instance.vergenceMinRel,
                vergenceMaxRelD: instance.vergenceMaxRelD,
                vergenceMinRelD: instance.vergenceMinRelD,
                vergenceMaxAbs: instance.vergenceMaxAbs,
                vergenceMaxRel: instance.vergenceMaxRel,
                vergenceDistanceNear: instance.vergenceDistanceNear,
                vergenceDistanceFar: instance.vergenceDistanceFar,
            });
        }
        return entities;
    }
    /**
     * @override
     */
    fromJSON(entities: Array<Object>, activeRecordID: number) {
        let instance;
        this.records = [];
        this.setActiveRecord(activeRecordID);

        for (let entity of entities) {
            instance = new Diagnostics();

            instance.isGlobal = entity.isGlobal;
            instance.disparityXMinMM = entity.disparityXMinMM;
            instance.disparityXMaxMM = entity.disparityXMaxMM;
            instance.disparityYMaxMM = entity.disparityYMaxMM;
            instance.disparityXMinPx = entity.disparityXMinPx;
            instance.disparityXMaxPx = entity.disparityXMaxPx;
            instance.disparityYMaxPx = entity.disparityYMaxPx;
            instance.disparityXMinPct = entity.disparityXMinPct;
            instance.disparityXMaxPct = entity.disparityXMaxPct;
            instance.disparityYMaxPct = entity.disparityYMaxPct;
            instance.disparityXMinConv = entity.disparityXMinConv;
            instance.disparityXMaxConv = entity.disparityXMaxConv;
            instance.disparityXMinParallax = entity.disparityXMinParallax;
            instance.disparityXMaxParallax = entity.disparityXMaxParallax;
            instance.disparityYMaxParallax = entity.disparityYMaxParallax;
            instance.vergenceMinAbs = entity.vergenceMinAbs;
            instance.vergenceMinRel = entity.vergenceMinRel;
            instance.vergenceMaxRelD = entity.vergenceMaxRelD;
            instance.vergenceMinRelD = entity.vergenceMinRelD;
            instance.vergenceMaxAbs = entity.vergenceMaxAbs;
            instance.vergenceMaxRel = entity.vergenceMaxRel;
            instance.vergenceDistanceNear = entity.vergenceDistanceNear;
            instance.vergenceDistanceFar = entity.vergenceDistanceFar;

            this.records.push(instance);
        }
    }
}

const diagnosticsDAO = new DiagnosticsDAO();
export default diagnosticsDAO;