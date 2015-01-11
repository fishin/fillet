var internals = {};

module.exports = internals.Fillet = function (options) {

    this.getAverageRunTime = exports.getAverageRunTime;
};

exports.getAverageRunTime = function(runs) {

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
