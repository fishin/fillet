var internals = {};

module.exports = internals.Fillet = function (options) {

    this.getRunsStats = exports.getRunsStats;
};

exports.getRunsStats = function (runs, limit) {

    var cleanRuns = {
        runs: []
    };
    var totalRunTime = 0;
    for (var i = 0; i < runs.length; i++) {
        totalRunTime += runs[i].duration;
        if (limit && i >= limit) {
            return cleanRuns;
        }
        // if theres no finishTime we dont want to see it
        if (runs[i].finishTime) {
            cleanRuns.runs.push(runs[i]);
        }
    }
    if (runs.length !== 0) {
        cleanRuns.average = Math.round(totalRunTime / runs.length);
    }
    return cleanRuns;
};
