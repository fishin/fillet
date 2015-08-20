var internals = {};

module.exports = internals.Fillet = function (options) {

    this.getAverageRunTime = exports.getAverageRunTime;
    this.getRunsStats = exports.getRunsStats;
};

exports.getAverageRunTime = function (runs) {

    var totalRunTime = 0;
    var average = 0;
    for (var i = 0; i < runs.length; i++) {
        totalRunTime += runs[i].duration;
    }
    if (runs.length !== 0) {
        average = Math.round(totalRunTime / runs.length);
    }
    return average;
};

exports.getRunsStats = function (runs, limit) {

    var cleanRuns = {
        runs: []
    };
    for (var i = 0; i < runs.length; i++) {
        if (limit && i >= limit) {
            return cleanRuns;
        }
        // if theres no finishTime we dont want to see it
        if (runs[i].finishTime) {
            cleanRuns.runs.push(runs[i]);
        }
    }
    return cleanRuns;
};
