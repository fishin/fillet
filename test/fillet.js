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

    it('getAverageRunTime without runs', function (done) {

        var fillet = new Fillet();
        var runs = [];
        var average = fillet.getAverageRunTime(runs);
        expect(average).to.equal(0);
        done();
    });

    it('getAverageRunTime with runs', function (done) {

        var fillet = new Fillet();
        var runs = [
            { jobId: 1, duration: 1000},
            { jobId: 2, duration: 3000}
        ];
        var average = fillet.getAverageRunTime(runs);
        expect(average).to.equal(2000);
        done();
    });
});
