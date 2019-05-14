'use strict';


/**
 * A "private" object
 */
class Helper {

    constructor(repLogs) {
        this.repLogs = repLogs;
    }

    calculateTotalWeight() {

        // console.log(this.repLogs)
        return Helper._calculateWeights(
            this.repLogs
        );
    }

    getTotalWeightString(maxWeight = 500) {
        let weight = this.calculateTotalWeight();

        if (weight > maxWeight) {
            weight = maxWeight + '+';
        }

        return weight + ' lbs';
    }


    static _calculateWeights(repLogs) {
        let totalWeight = 0;

        for (let repLog of repLogs) {
            // console.log(repLog, repLog.totalWeightLifted);
            totalWeight += repLog.totalWeightLifted;
        }
        /*
                    console.log(repLogs);
                    for (let repLog in repLogs) {
                        // console.log(repLog, repLogs[repLog].totalWeightLifted);
                        totalWeight += repLogs[repLog].totalWeightLifted;
                    }
          */

        return  totalWeight;
    }

}


module.exports = Helper;