var Code = require('code');
var Fs = require('fs');
var Lab = require('lab');
var Path = require('path');

var Fillet = require('../lib');

var internals = {};

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

describe('fillet', function () {

    it('getRunStats none', function (done) {

        var fillet = new Fillet();
        var run = { id: 1 };
        var runStats = fillet.getRunStats(run);
        expect(runStats.id).to.equal(1);
        done();
    });

    it('getRunsStats none', function (done) {

        var fillet = new Fillet();
        var runs = [];
        var runsStats = fillet.getRunsStats(runs);
        expect(runsStats.runs.length).to.equal(0);
        expect(runsStats.average.total).to.equal(0);
        expect(runsStats.average.succeeded).to.equal(0);
        done();
    });

    it('getRunsStats', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, runId: 1, startTime: 1, finishTime: 2 },
            { jobId: 1, runId: 2, startTime: 3 }
        ];
        var runsStats = fillet.getRunsStats(runs);
        expect(runsStats.runs.length).to.equal(1);
        done();
    });

    it('getRunsStats limit', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, runId: 1, startTime: 1, finishTime: 2 },
            { jobId: 1, runId: 2, startTime: 3, finishTime: 4 }
        ];
        var runsStats = fillet.getRunsStats(runs, 1);
        expect(runsStats.runs.length).to.equal(1);
        done();
    });

    it('getRunsStats averages', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, runId: 1, startTime: 10, finishTime: 40, duration: 30, status: 'succeeded' },
            { jobId: 1, runId: 2, startTime: 10, finishTime: 20, duration: 10, status: 'failed' }
        ];
        var runsStats = fillet.getRunsStats(runs);
        expect(runsStats.runs.length).to.equal(2);
        expect(runsStats.average.total).to.equal(20);
        expect(runsStats.average.succeeded).to.equal(30);
        done();
    });
});
