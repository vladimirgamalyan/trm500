
function startTimer(duration, cb) {
    var start = Date.now(),
        diff;

    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);
        cb(diff);

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    }

    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}
