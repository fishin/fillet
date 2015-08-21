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

    it('getRunsStats none', function (done) {

        var fillet = new Fillet();
        var runs = [];
        var runStats = fillet.getRunsStats(runs);
        expect(runStats.runs.length).to.equal(0);
        expect(runStats.average.total).to.equal(0);
        expect(runStats.average.succeeded).to.equal(0);
        done();
    });

    it('getRunsStats', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, runId: 1, startTime: 1, finishTime: 2 },
            { jobId: 1, runId: 2, startTime: 3 }
        ];
        var runStats = fillet.getRunsStats(runs);
        expect(runStats.runs.length).to.equal(1);
        done();
    });

    it('getRunsStats limit', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, runId: 1, startTime: 1, finishTime: 2 },
            { jobId: 1, runId: 2, startTime: 3, finishTime: 4 }
        ];
        var runStats = fillet.getRunsStats(runs, 1);
        expect(runStats.runs.length).to.equal(1);
        done();
    });

    it('getRunsStats averages', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, runId: 1, startTime: 10, finishTime: 40, duration: 30, status: 'succeeded' },
            { jobId: 1, runId: 2, startTime: 10, finishTime: 20, duration: 10, status: 'failed' }
        ];
        var runStats = fillet.getRunsStats(runs);
        expect(runStats.runs.length).to.equal(2);
        expect(runStats.average.total).to.equal(20);
        expect(runStats.average.succeeded).to.equal(30);
        done();
    });
});
