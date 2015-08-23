var internals = {};

module.exports = internals.Fillet = function (options) {

    this.getRunStats = exports.getRunStats;
    this.getRunsStats = exports.getRunsStats;
};

exports.getRunStats = function (run) {

    var cleanRun = {
        id: run.id,
        commands: [],
        tests: []
    };
    if (run.checkout && run.checkout.commands) {
        for (var i = 0; i < run.checkout.commands.length; i++) {
            var checkoutCommand = {
                command: run.checkout.commands[i].command,
                startTime: run.checkout.commands[i].startTime,
                finishTime: run.checkout.commands[i].finishTime,
                status: run.checkout.commands[i].status
            };
            cleanRun.commands.push(checkoutCommand);
        }
    }
    for (var j = 0; j < run.commands.length; j++) {
        var cleanCommand = {
            command: run.commands[j].command,
            startTime: run.commands[j].startTime,
            finishTime: run.commands[j].finishTime,
            status: run.commands[j].status
        };
        cleanRun.commands.push(cleanCommand);
    }
    // assumes only 1 nested loop not sure its safe
    var totalTests = 0;
    if (run.testFile && run.testFile.tests) {
        for (var key in run.testFile.tests) {
            for (var k = 0; k < run.testFile.tests[key].length; k++) {
                totalTests++;
                var test = run.testFile.tests[key][k];
                test.title = 'key - ' + run.testFile.tests[key][k].title;
                test.num = totalTests;
                cleanRun.tests.push(test);
            }
        }
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
        var run = runs[i];
        // if theres no finishTime we dont want to see it
        var cleanRun = {
            id: run.id,
            startTime: run.startTime,
            finishTime: run.finishTime,
            elapsedTime: run.elapsedTime,
            tests: {
                total: 0,
                succeeded: 0,
                failed: 0
            },
            status: run.status
        };
        // assumes only 1 nested loop not sure its safe
        if (run.testFile && run.testFile.tests) {
            for (var key in run.testFile.tests) {
                for (var j = 0; j < run.testFile.tests[key].length; j++) {
                    if (!run.testFile.tests[key][j].err) {
                        cleanRun.tests.succeeded++;
                    } else {
                        cleanRun.tests.failed++;
                    }
                    cleanRun.tests.total++;
                }
            }
        }
        if (run.finishTime) {
            totalRunTime += run.duration;
            if (run.status === 'succeeded') {
                succeeded++;
                totalSucceededRunTime += run.duration;
            }
            cleanRuns.runs.push(cleanRun);
        }
    }
    if (runs.length !== 0) {
        cleanRuns.average.total = Math.round(totalRunTime / runs.length);
        cleanRuns.average.succeeded = Math.round(totalSucceededRunTime / succeeded);
    }
    return cleanRuns;
};
