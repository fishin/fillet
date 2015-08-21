var internals = {};

module.exports = internals.Fillet = function (options) {

    this.getRunsStats = exports.getRunsStats;
};

exports.getRunsStats = function (runs, limit) {

    var cleanRuns = {
        average: {
            total: 0,
            succeeded: 0
        },
        runs: []
    };
    var totalRunTime = 0;
    var totalSucceededRunTime = 0;
    var succeeded = 0;
    for (var i = 0; i < runs.length; i++) {
        if (limit && i >= limit) {
            return cleanRuns;
        }
        // if theres no finishTime we dont want to see it
        if (runs[i].finishTime) {
            totalRunTime += runs[i].duration;
            if (runs[i].status === 'succeeded') {
                succeeded++;
                totalSucceededRunTime += runs[i].duration;
            }
            cleanRuns.runs.push(runs[i]);
        }
    }
    if (runs.length !== 0) {
        cleanRuns.average.total = Math.round(totalRunTime / runs.length);
        cleanRuns.average.succeeded = Math.round(totalSucceededRunTime / succeeded);
    }
    return cleanRuns;
};
