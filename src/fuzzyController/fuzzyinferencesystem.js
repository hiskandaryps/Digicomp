const fuzzyis = require('fuzzyis');
const { LinguisticVariable, Term, Rule, FIS } = fuzzyis;

// Describe the new system, input, and output variables
const system = new FIS('Compost Temperature Control System');

// Initialize and add variables into the system
const heaterPWM = new LinguisticVariable('heater', [0, 255]);
const exhaustPWM = new LinguisticVariable('exhaust', [0, 255]);
system.addOutput(heaterPWM);
system.addOutput(exhaustPWM);

const currentTemp = new LinguisticVariable('current', [15, 65]);
const targetTemp = new LinguisticVariable('target', [15, 65]);
system.addInput(currentTemp);
system.addInput(targetTemp);

// Describe terms for each variable
currentTemp.addTerm(new Term('veryCold', 'triangle', [6.66667, 15, 23.3333]));
currentTemp.addTerm(new Term('cold', 'triangle', [16.6667, 25, 33.3333]));
currentTemp.addTerm(new Term('lukeWarm', 'triangle', [26.6667, 35, 43.3333]));
currentTemp.addTerm(new Term('warm', 'triangle', [36.6667, 45, 53.3333]));
currentTemp.addTerm(new Term('hot', 'triangle', [46.6667, 55, 63.3333]));
currentTemp.addTerm(new Term('veryHot', 'triangle', [56.6667, 65, 73.3333]));

targetTemp.addTerm(new Term('maturation', 'triangle', [6.66667, 15, 23.3333]));
targetTemp.addTerm(new Term('mesophilic2', 'triangle', [16.6667, 25, 33.3333]));
targetTemp.addTerm(new Term('mesophilic1', 'triangle', [26.6667, 35, 43.3333]));
targetTemp.addTerm(new Term('thermophilic1', 'triangle', [36.6667, 45, 53.3333]));
targetTemp.addTerm(new Term('thermophilic2', 'triangle', [46.6667, 55, 63.3333]));
targetTemp.addTerm(new Term('overheat', 'triangle', [56.6667, 65, 73.3333]));

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

// Define rules for the system
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

module.exports = system;