'use strict';

const Code = require('code');
const Lab = require('lab');

const Fillet = require('../lib');

const internals = {};

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

describe('fillet', () => {

    it('getRunStats no checkout', (done) => {

        const fillet = new Fillet();
        const run = {
            id: 1,
            commands: [
                {
                    command: 'command 1',
                    startTime: 3,
                    finishTime: 4
                }
            ]
        };
        const runStats = fillet.getRunStats(run);
        expect(runStats.id).to.equal(1);
        done();
    });

    it('getRunStats no run', (done) => {

        const fillet = new Fillet();
        const runStats = fillet.getRunStats(null);
        expect(runStats).to.not.exist();
        done();
    });

    it('getRunStats checkout commands', (done) => {

        const fillet = new Fillet();
        const run = {
            id: 1,
            checkout: {
                commands: [
                    {
                        command: 'git clone',
                        startTime: 1,
                        finishTime: 2
                    }
                ]
            },
            commands: [
                {
                    command: 'command 1',
                    startTime: 3,
                    finishTime: 4
                }
            ],
            testFile: {
                tests: {
                    job: [
                        { title: 'title1', err: false },
                        { title: 'title2', err: true }
                    ]
                }
            }
        };
        const runStats = fillet.getRunStats(run);
        expect(runStats.id).to.equal(1);
        expect(runStats.tests.length).to.equal(2);
        done();
    });

    it('getRunsStats none', (done) => {

        const fillet = new Fillet();
        const runs = [];
        const runsStats = fillet.getRunsStats(runs);
        expect(runsStats.runs.length).to.equal(0);
        expect(runsStats.average.total).to.equal(0);
        expect(runsStats.average.succeeded).to.equal(0);
        done();
    });

    it('getRunsStats', (done) => {

        const fillet = new Fillet();
        const runs = [
            {
                jobId: 1,
                runId: 1,
                startTime: 1,
                finishTime: 2,
                testFile: {
                    tests: {
                        job: [
                            { title: 'title1', err: false },
                            { title: 'title2', err: true }
                        ]
                    }
                }
            },
            {
                jobId: 1,
                runId: 2,
                startTime: 3
            }
        ];
        const runsStats = fillet.getRunsStats(runs);
        expect(runsStats.runs.length).to.equal(1);
        expect(runsStats.runs[0].tests.total).to.equal(2);
        expect(runsStats.runs[0].tests.succeeded).to.equal(1);
        expect(runsStats.runs[0].tests.failed).to.equal(1);
        done();
    });

    it('getRunsStats limit', (done) => {

        const fillet = new Fillet();
        const runs = [
            {
                jobId: 1,
                runId: 1,
                startTime: 1,
                finishTime: 2
            },
            {
                jobId: 1,
                runId: 2,
                startTime: 3,
                finishTime: 4
            }
        ];
        const runsStats = fillet.getRunsStats(runs, 1);
        expect(runsStats.runs.length).to.equal(1);
        done();
    });

    it('getRunsStats averages', (done) => {

        const fillet = new Fillet();
        const runs = [
            {
                jobId: 1,
                runId: 1,
                startTime: 10,
                finishTime: 40,
                duration: 30,
                status: 'succeeded'
            },
            {
                jobId: 1,
                runId: 2,
                startTime: 10,
                finishTime: 20,
                duration: 10,
                status: 'failed'
            }
        ];
        const runsStats = fillet.getRunsStats(runs);
        expect(runsStats.runs.length).to.equal(2);
        expect(runsStats.average.total).to.equal(20);
        expect(runsStats.average.succeeded).to.equal(30);
        done();
    });
});
