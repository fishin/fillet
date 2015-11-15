'use strict';

const internals = {};

module.exports = internals.Fillet = function (options) {

    this.getRunStats = exports.getRunStats;
    this.getRunsStats = exports.getRunsStats;
};

exports.getRunStats = function (run) {

    if (!run) {
        return null;
    }
    const cleanRun = {
        id: run.id,
        commands: [],
        tests: []
    };
    if (run.checkout && run.checkout.commands) {
        for (let i = 0; i < run.checkout.commands.length; ++i) {
            const checkoutCommand = {
                command: run.checkout.commands[i].command,
                startTime: run.checkout.commands[i].startTime,
                finishTime: run.checkout.commands[i].finishTime,
                status: run.checkout.commands[i].status
            };
            cleanRun.commands.push(checkoutCommand);
        }
    }
    for (let i = 0; i < run.commands.length; ++i) {
        const cleanCommand = {
            command: run.commands[i].command,
            startTime: run.commands[i].startTime,
            finishTime: run.commands[i].finishTime,
            status: run.commands[i].status
        };
        cleanRun.commands.push(cleanCommand);
    }
    // assumes only 1 nested loop not sure its safe
    let totalTests = 0;
    if (run.testFile && run.testFile.tests) {
        for (const key in run.testFile.tests) {
            for (let i = 0; i < run.testFile.tests[key].length; ++i) {
                totalTests++;
                const test = run.testFile.tests[key][i];
                test.title = key + ' - ' + run.testFile.tests[key][i].title;
                test.num = totalTests;
                cleanRun.tests.push(test);
            }
        }
    }
    return cleanRun;
};

exports.getRunsStats = function (runs, limit) {

    const cleanRuns = {
        average: {
            total: 0,
            succeeded: 0
        },
        runs: []
    };
    let totalRunTime = 0;
    let totalSucceededRunTime = 0;
    let succeeded = 0;
    for (let i = 0; i < runs.length; ++i) {
        if (limit && i >= limit) {
            return cleanRuns;
        }
        const run = runs[i];
        // if theres no finishTime we dont want to see it
        const cleanRun = {
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
            for (const key in run.testFile.tests) {
                for (let j = 0; j < run.testFile.tests[key].length; ++j) {
                    if (!run.testFile.tests[key][j].err) {
                        cleanRun.tests.succeeded++;
                    }
                    else {
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
