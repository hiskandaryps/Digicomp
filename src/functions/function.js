function response(status, data, message, res) {
    res.status(status).json({ status, data, message });
}

function getDate() {
    const dt = new Date();
    const offset = 7 * 60 * 60 * 1000; // 7-hour offset
    const newDate = new Date(dt.getTime() + offset);
    return newDate.toISOString();
}

function calculateTemp(sedang1, sedang4) {
    const dingin1 = 0;
    const panas4 = 90;

    const sedang2 = sedang1 + (sedang4 - sedang1) / 3;
    const sedang3 = sedang1 + 2 * ((sedang4 - sedang1) / 3);
    const dingin4 = sedang1 + 5;
    const dingin2 = dingin1 + (dingin4 - dingin1) / 3;
    const dingin3 = dingin1 + 2 * ((dingin4 - dingin1) / 3);
    const panas1 = sedang4 - 5;
    const panas2 = panas1 + (panas4 - panas1) / 3;
    const panas3 = panas1 + 2 * ((panas4 - panas1) / 3);

    return {
        dingin1,
        dingin2,
        dingin3,
        dingin4,
        sedang1,
        sedang2,
        sedang3,
        sedang4,
        panas1,
        panas2,
        panas3,
        panas4
    };
}

function calculateAverage(data) {
    const total = data.length;
    const sum = data.reduce((acc, curr) => ({
        temp: acc.temp + curr.temp,
        humi: acc.humi + curr.humi,
        ph: acc.ph + curr.ph,
        temp_ambiance: acc.temp_ambiance + curr.temp_ambiance,
        humi_ambiance: acc.humi_ambiance + curr.humi_ambiance
    }), { temp: 0, humi: 0, ph: 0, temp_ambiance: 0, humi_ambiance: 0 });

    return {
        temp: sum.temp / total,
        humi: sum.humi / total,
        ph: sum.ph / total,
        temp_ambiance: sum.temp_ambiance / total,
        humi_ambiance: sum.humi_ambiance / total
    };
}


function distributeValues(min, max) {
    const vc2 = min;
    const vh2 = max;
    const step = (vh2 - vc2) / (6 - 1); // Calculate the step value
    const extend = step * 0.8333;

    //calculate center member
    const c2 = vc2 + 1 * step;
    const lw2 = vc2 + 2 * step;
    const w2 = vc2 + 3 * step;
    const h2 = vc2 + 4 * step;

    //calculate left and right values
    const vc1 = vc2 - extend;
    const vc3 = vc2 + extend;

    const c1 = c2 - extend;
    const c3 = c2 + extend;

    const lw1 = lw2 - extend;
    const lw3 = lw2 + extend;

    const w1 = w2 - extend;
    const w3 = w2 + extend;

    const h1 = h2 - extend;
    const h3 = h2 + extend;

    const vh1 = vh2 - extend;
    const vh3 = vh2 + extend;

    return {
        vc1, vc2, vc3,
        c1, c2, c3,
        lw1, lw2, lw3,
        w1, w2, w3,
        h1, h2, h3,
        vh1, vh2, vh3
    };
}

module.exports = { response, getDate, calculateTemp, calculateAverage, distributeValues };