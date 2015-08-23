var internals = {};

module.exports = internals.Fillet = function (options) {

    this.getRunStats = exports.getRunStats;
    this.getRunsStats = exports.getRunsStats;
};

exports.getRunStats = function (run) {

    var cleanRun = {
        id: run.id,
        commands: []
    };
    if (run.checkout && run.checkout.commands) {
        for (var i = 0; i < run.checkout.commands.length; i++) {
            cleanRun.commands.push(run.checkout.commands[i]);
        }
    }
    for (var j = 0; j < run.commands.length; j++) {
        cleanRun.commands.push(run.commands[j]);
    }
    return cleanRun;
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
