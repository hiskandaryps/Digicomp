const fuzzyis = require('fuzzyis');
const { LinguisticVariable, Term, Rule, FIS } = fuzzyis;

function getPWMOutput(vc1, vc2, vc3, c1, c2, c3, lw1, lw2, lw3, w1, w2, w3, h1, h2, h3, vh1, vh2, vh3, currentTemperature, targetTemperature) {
    // Create the fuzzy inference system
    const system = new FIS('Compost Temperature Control System');

    // Define output variables
    const heaterPWM = new LinguisticVariable('heater', [0, 255]);
    const exhaustPWM = new LinguisticVariable('exhaust', [0, 255]);
    system.addOutput(heaterPWM);
    system.addOutput(exhaustPWM);

    const currentTemp = new LinguisticVariable('current', [vc2, vh2]);
    const targetTemp = new LinguisticVariable('target', [vc2, vh2]);
    system.addInput(currentTemp);
    system.addInput(targetTemp);

    // Describe terms for each variable
    currentTemp.addTerm(new Term('veryCold', 'triangle', [vc1, vc2, vc3]));
    currentTemp.addTerm(new Term('cold', 'triangle', [c1, c2, c3]));
    currentTemp.addTerm(new Term('lukeWarm', 'triangle', [lw1, lw2, lw3]));
    currentTemp.addTerm(new Term('warm', 'triangle', [w1, w2, w3]));
    currentTemp.addTerm(new Term('hot', 'triangle', [h1, h2, h3]));
    currentTemp.addTerm(new Term('veryHot', 'triangle', [vh1, vh2, vh3]));

    // Add terms to targetTemp
    targetTemp.addTerm(new Term('maturation', 'triangle', [vc1, vc2, vc3]));
    targetTemp.addTerm(new Term('mesophilic2', 'triangle', [c1, c2, c3]));
    targetTemp.addTerm(new Term('mesophilic1', 'triangle', [lw1, lw2, lw3]));
    targetTemp.addTerm(new Term('thermophilic1', 'triangle', [w1, w2, w3]));
    targetTemp.addTerm(new Term('thermophilic2', 'triangle', [h1, h2, h3]));
    targetTemp.addTerm(new Term('overheat', 'triangle', [vh1, vh2, vh3]));

    heaterPWM.addTerm(new Term('veryLow', 'triangle', [-53.125, 0, 53.125]));
    heaterPWM.addTerm(new Term('low', 'triangle', [10.625, 63.75, 116.875]));
    heaterPWM.addTerm(new Term('medium', 'triangle', [74.375, 127.5, 180.625]));
    heaterPWM.addTerm(new Term('high', 'triangle', [138.125, 191.25, 244.375]));
    heaterPWM.addTerm(new Term('veryHigh', 'triangle', [201.875, 255, 308.125]));

    exhaustPWM.addTerm(new Term('veryLow', 'triangle', [-53.125, 0, 53.125]));
    exhaustPWM.addTerm(new Term('low', 'triangle', [10.625, 63.75, 116.875]));
    exhaustPWM.addTerm(new Term('medium', 'triangle', [74.375, 127.5, 180.625]));
    exhaustPWM.addTerm(new Term('high', 'triangle', [138.125, 191.25, 244.375]));
    exhaustPWM.addTerm(new Term('veryHigh', 'triangle', [201.875, 255, 308.125]));

    // Define rules for the system (reusing the provided rules)
    system.rules = [
        new Rule(['veryCold', 'maturation'], ['veryLow', 'veryLow'], 'and'),
        new Rule(['cold', 'maturation'], ['low', 'veryLow'], 'and'),
        new Rule(['lukeWarm', 'maturation'], ['medium', 'veryLow'], 'and'),
        new Rule(['warm', 'maturation'], ['high', 'veryLow'], 'and'),
        new Rule(['hot', 'maturation'], ['veryHigh', 'veryLow'], 'and'),
        new Rule(['veryHot', 'maturation'], ['veryHigh', 'veryLow'], 'and'),
        new Rule(['veryCold', 'mesophilic2'], ['low', 'veryLow'], 'and'),
        new Rule(['cold', 'mesophilic2'], ['veryLow', 'veryLow'], 'and'),
        new Rule(['lukeWarm', 'mesophilic2'], ['low', 'veryLow'], 'and'),
        new Rule(['warm', 'mesophilic2'], ['medium', 'veryLow'], 'and'),
        new Rule(['hot', 'mesophilic2'], ['high', 'veryLow'], 'and'),
        new Rule(['veryHot', 'mesophilic2'], ['veryHigh', 'veryLow'], 'and'),
        new Rule(['veryCold', 'mesophilic1'], ['medium', 'veryLow'], 'and'),
        new Rule(['cold', 'mesophilic1'], ['low', 'veryLow'], 'and'),
        new Rule(['lukeWarm', 'mesophilic1'], ['veryLow', 'veryLow'], 'and'),
        new Rule(['warm', 'mesophilic1'], ['low', 'veryLow'], 'and'),
        new Rule(['hot', 'mesophilic1'], ['medium', 'veryLow'], 'and'),
        new Rule(['veryHot', 'mesophilic1'], ['high', 'veryLow'], 'and'),
        new Rule(['veryCold', 'thermophilic1'], ['high', 'veryLow'], 'and'),
        new Rule(['cold', 'thermophilic1'], ['medium', 'veryLow'], 'and'),
        new Rule(['lukeWarm', 'thermophilic1'], ['low', 'veryLow'], 'and'),
        new Rule(['warm', 'thermophilic1'], ['veryLow', 'veryLow'], 'and'),
        new Rule(['hot', 'thermophilic1'], ['low', 'veryLow'], 'and'),
        new Rule(['veryHot', 'thermophilic1'], ['medium', 'veryLow'], 'and'),
        new Rule(['veryCold', 'thermophilic2'], ['veryHigh', 'veryLow'], 'and'),
        new Rule(['cold', 'thermophilic2'], ['high', 'veryLow'], 'and'),
        new Rule(['lukeWarm', 'thermophilic2'], ['medium', 'veryLow'], 'and'),
        new Rule(['warm', 'thermophilic2'], ['low', 'veryLow'], 'and'),
        new Rule(['hot', 'thermophilic2'], ['veryLow', 'veryLow'], 'and'),
        new Rule(['veryHot', 'thermophilic2'], ['low', 'veryLow'], 'and'),
    ];

    // Return the precise output based on the input currentTemp and targetTemp
    const output = system.getPreciseOutput([currentTemperature, targetTemperature]);

    return output;
}

module.exports = getPWMOutput;