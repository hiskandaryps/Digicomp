#include <Fuzzy.h>

// Instantiating a Fuzzy object
Fuzzy *fuzzy = new Fuzzy();

// Fuzzyset temperatur
FuzzySet *dingin = new FuzzySet(0, 15, 25, 40);
FuzzySet *sedang = new FuzzySet(35, 41.666, 48.333, 55);
FuzzySet *panas = new FuzzySet(50, 63.333, 76.666, 90);

// Fuzzyset ph
FuzzySet *asam = new FuzzySet(1, 3, 5, 6.5);
FuzzySet *netral = new FuzzySet(6, 6.5, 7.5, 8);
FuzzySet *basa = new FuzzySet(7.5, 9, 10, 12);

// Fuzzyset waktu
FuzzySet *terlaluCepat = new FuzzySet(-4, 0, 2, 4);
FuzzySet *cepat = new FuzzySet(3, 5, 6, 8);
FuzzySet *menengah = new FuzzySet(7, 10, 12, 15);
FuzzySet *lambat = new FuzzySet(14, 20, 35, 40);

// Fuzzyset fase
FuzzySet *mesoFilik1 = new FuzzySet(-10, 0, 14, 26);
FuzzySet *thermoFilik = new FuzzySet(25, 33.333, 41.666, 51);
FuzzySet *mesoFilik2 = new FuzzySet(50, 58.333, 66.666, 76);
FuzzySet *matang = new FuzzySet(75, 86, 100, 110);

void setup()
{
  // Instantiating a FuzzyInput object
  FuzzyInput *temperatur = new FuzzyInput(1);
  temperatur->addFuzzySet(dingin);
  temperatur->addFuzzySet(sedang);
  temperatur->addFuzzySet(panas);
  fuzzy->addFuzzyInput(temperatur);

  FuzzyInput *ph = new FuzzyInput(2);
  ph->addFuzzySet(asam);
  ph->addFuzzySet(netral);
  ph->addFuzzySet(basa);
  fuzzy->addFuzzyInput(ph);

  FuzzyInput *waktu = new FuzzyInput(3);
  waktu->addFuzzySet(terlaluCepat);
  waktu->addFuzzySet(cepat);
  waktu->addFuzzySet(menengah);
  waktu->addFuzzySet(lambat);
  fuzzy->addFuzzyInput(waktu);

  // Instantiating a FuzzyOutput objects
  FuzzyOutput *fase = new FuzzyOutput(1);
  fase->addFuzzySet(mesoFilik1);
  fase->addFuzzySet(thermoFilik);
  fase->addFuzzySet(mesoFilik2);
  fase->addFuzzySet(matang);
  fuzzy->addFuzzyOutput(fase);

  // Instantiaring a FuzzyRule objects
  // Definitions for the antecedents and consequents
  FuzzyRuleAntecedent *temperaturDinginAndPhAsam = new FuzzyRuleAntecedent();
  temperaturDinginAndPhAsam->joinWithAND(dingin, asam);
  FuzzyRuleAntecedent *temperaturSedangAndPhAsam = new FuzzyRuleAntecedent();
  temperaturSedangAndPhAsam->joinWithAND(sedang, asam);
  FuzzyRuleAntecedent *temperaturPanasAndPhAsam = new FuzzyRuleAntecedent();
  temperaturPanasAndPhAsam->joinWithAND(panas, asam);
  FuzzyRuleAntecedent *temperaturDinginAndPhNetral = new FuzzyRuleAntecedent();
  temperaturDinginAndPhNetral->joinWithAND(dingin, netral);
  FuzzyRuleAntecedent *temperaturPanasAndPhNetral = new FuzzyRuleAntecedent();
  temperaturPanasAndPhNetral->joinWithAND(panas, netral);
  FuzzyRuleAntecedent *temperaturPanasAndPhBasa = new FuzzyRuleAntecedent();
  temperaturPanasAndPhBasa->joinWithAND(panas, basa);
  FuzzyRuleAntecedent *temperaturSedangAndPhNetral = new FuzzyRuleAntecedent();
  temperaturSedangAndPhNetral->joinWithAND(sedang, netral);
  FuzzyRuleAntecedent *temperaturSedangAndPhBasa = new FuzzyRuleAntecedent();
  temperaturSedangAndPhBasa->joinWithAND(sedang, basa);
  FuzzyRuleAntecedent *temperaturDinginAndPhBasa = new FuzzyRuleAntecedent();
  temperaturDinginAndPhBasa->joinWithAND(dingin, basa);

  FuzzyRuleAntecedent *waktuTerlaluCepat = new FuzzyRuleAntecedent();
  waktuTerlaluCepat->joinSingle(terlaluCepat);
  FuzzyRuleAntecedent *waktuCepat = new FuzzyRuleAntecedent();
  waktuCepat->joinSingle(cepat);
  FuzzyRuleAntecedent *waktuMenengah = new FuzzyRuleAntecedent();
  waktuMenengah->joinSingle(menengah);
  FuzzyRuleAntecedent *waktuLambat = new FuzzyRuleAntecedent();
  waktuLambat->joinSingle(lambat);

  FuzzyRuleConsequent *thenFaseMesoFilik1 = new FuzzyRuleConsequent();
  thenFaseMesoFilik1->addOutput(mesoFilik1);
  FuzzyRuleConsequent *thenFaseThermoFilik = new FuzzyRuleConsequent();
  thenFaseThermoFilik->addOutput(thermoFilik);
  FuzzyRuleConsequent *thenFaseMesoFilik2 = new FuzzyRuleConsequent();
  thenFaseMesoFilik2->addOutput(mesoFilik2);
  FuzzyRuleConsequent *thenFaseMatang = new FuzzyRuleConsequent();
  thenFaseMatang->addOutput(matang);

  // Fuzzy Rule 1
  FuzzyRuleAntecedent *ifTemperaturDinginAndPhAsamAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturDinginAndPhAsamAndWaktuTerlaluCepat->joinWithAND(temperaturDinginAndPhAsam, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule1 = new FuzzyRule(1, ifTemperaturDinginAndPhAsamAndWaktuTerlaluCepat, thenFaseMesoFilik1);
  fuzzy->addFuzzyRule(fuzzyRule1);

  // Fuzzy Rule 2
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhAsamAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhAsamAndWaktuTerlaluCepat->joinWithAND(temperaturSedangAndPhAsam, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule2 = new FuzzyRule(2, ifTemperaturSedangAndPhAsamAndWaktuTerlaluCepat, thenFaseMesoFilik1);
  fuzzy->addFuzzyRule(fuzzyRule2);

  // Fuzzy Rule 3
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhAsamAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhAsamAndWaktuTerlaluCepat->joinWithAND(temperaturPanasAndPhAsam, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule3 = new FuzzyRule(3, ifTemperaturPanasAndPhAsamAndWaktuTerlaluCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule3);

  // Fuzzy Rule 4
  FuzzyRuleAntecedent *ifTemperaturDinginAndPhNetralAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturDinginAndPhNetralAndWaktuTerlaluCepat->joinWithAND(temperaturDinginAndPhNetral, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule4 = new FuzzyRule(4, ifTemperaturDinginAndPhNetralAndWaktuTerlaluCepat, thenFaseMesoFilik1);
  fuzzy->addFuzzyRule(fuzzyRule4);

  // Fuzzy Rule 5
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhNetralAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhNetralAndWaktuTerlaluCepat->joinWithAND(temperaturSedangAndPhNetral, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule5 = new FuzzyRule(5, ifTemperaturSedangAndPhNetralAndWaktuTerlaluCepat, thenFaseMesoFilik1);
  fuzzy->addFuzzyRule(fuzzyRule5);

  // Fuzzy Rule 6
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhNetralAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhNetralAndWaktuTerlaluCepat->joinWithAND(temperaturPanasAndPhNetral, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule6 = new FuzzyRule(6, ifTemperaturPanasAndPhNetralAndWaktuTerlaluCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule6);

  // Fuzzy Rule 7
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhBasaAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhBasaAndWaktuTerlaluCepat->joinWithAND(temperaturPanasAndPhBasa, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule7 = new FuzzyRule(7, ifTemperaturPanasAndPhBasaAndWaktuTerlaluCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule7);

  // Fuzzy Rule 8
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhAsamAndWaktuCepat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhAsamAndWaktuCepat->joinWithAND(temperaturSedangAndPhAsam, waktuCepat);
  FuzzyRule *fuzzyRule8 = new FuzzyRule(8, ifTemperaturSedangAndPhAsamAndWaktuCepat, thenFaseMesoFilik1);
  fuzzy->addFuzzyRule(fuzzyRule8);

  // Fuzzy Rule 9
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhAsamAndWaktuCepat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhAsamAndWaktuCepat->joinWithAND(temperaturPanasAndPhAsam, waktuCepat);
  FuzzyRule *fuzzyRule9 = new FuzzyRule(9, ifTemperaturPanasAndPhAsamAndWaktuCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule9);

  // Fuzzy Rule 10
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhNetralAndWaktuCepat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhNetralAndWaktuCepat->joinWithAND(temperaturSedangAndPhNetral, waktuCepat);
  FuzzyRule *fuzzyRule10 = new FuzzyRule(10, ifTemperaturSedangAndPhNetralAndWaktuCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule10);

  // Fuzzy Rule 11
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhNetralAndWaktuCepat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhNetralAndWaktuCepat->joinWithAND(temperaturPanasAndPhNetral, waktuCepat);
  FuzzyRule *fuzzyRule11 = new FuzzyRule(11, ifTemperaturPanasAndPhNetralAndWaktuCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule11);

  // Fuzzy Rule 12
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhBasaAndWaktuCepat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhBasaAndWaktuCepat->joinWithAND(temperaturPanasAndPhBasa, waktuCepat);
  FuzzyRule *fuzzyRule12 = new FuzzyRule(12, ifTemperaturPanasAndPhBasaAndWaktuCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule12);

  // Fuzzy Rule 13
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhAsamAndWaktuMenengah = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhAsamAndWaktuMenengah->joinWithAND(temperaturSedangAndPhAsam, waktuMenengah);
  FuzzyRule *fuzzyRule13 = new FuzzyRule(13, ifTemperaturSedangAndPhAsamAndWaktuMenengah, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule13);

  // Fuzzy Rule 14
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhAsamAndWaktuMenengah = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhAsamAndWaktuMenengah->joinWithAND(temperaturPanasAndPhAsam, waktuMenengah);
  FuzzyRule *fuzzyRule14 = new FuzzyRule(14, ifTemperaturPanasAndPhAsamAndWaktuMenengah, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule14);

  // Fuzzy Rule 15
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhNetralAndWaktuMenengah = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhNetralAndWaktuMenengah->joinWithAND(temperaturSedangAndPhNetral, waktuMenengah);
  FuzzyRule *fuzzyRule15 = new FuzzyRule(15, ifTemperaturSedangAndPhNetralAndWaktuMenengah, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule15);

  // Fuzzy Rule 16
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhNetralAndWaktuMenengah = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhNetralAndWaktuMenengah->joinWithAND(temperaturPanasAndPhNetral, waktuMenengah);
  FuzzyRule *fuzzyRule16 = new FuzzyRule(16, ifTemperaturPanasAndPhNetralAndWaktuMenengah, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule16);

  // Fuzzy Rule 17
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhBasaAndWaktuMenengah = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhBasaAndWaktuMenengah->joinWithAND(temperaturSedangAndPhBasa, waktuMenengah);
  FuzzyRule *fuzzyRule17 = new FuzzyRule(17, ifTemperaturSedangAndPhBasaAndWaktuMenengah, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule17);

  // Fuzzy Rule 18
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhBasaAndWaktuMenengah = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhBasaAndWaktuMenengah->joinWithAND(temperaturPanasAndPhBasa, waktuMenengah);
  FuzzyRule *fuzzyRule18 = new FuzzyRule(18, ifTemperaturPanasAndPhBasaAndWaktuMenengah, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule18);

  // Fuzzy Rule 19
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhAsamAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhAsamAndWaktuLambat->joinWithAND(temperaturSedangAndPhAsam, waktuLambat);
  FuzzyRule *fuzzyRule19 = new FuzzyRule(19, ifTemperaturSedangAndPhAsamAndWaktuLambat, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule19);

  // Fuzzy Rule 20
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhAsamAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhAsamAndWaktuLambat->joinWithAND(temperaturPanasAndPhAsam, waktuLambat);
  FuzzyRule *fuzzyRule20 = new FuzzyRule(20, ifTemperaturPanasAndPhAsamAndWaktuLambat, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule20);

  // Fuzzy Rule 21
  FuzzyRuleAntecedent *ifTemperaturDinginAndPhNetralAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturDinginAndPhNetralAndWaktuLambat->joinWithAND(temperaturDinginAndPhNetral, waktuLambat);
  FuzzyRule *fuzzyRule21 = new FuzzyRule(21, ifTemperaturDinginAndPhNetralAndWaktuLambat, thenFaseMatang);
  fuzzy->addFuzzyRule(fuzzyRule21);

  // Fuzzy Rule 22
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhNetralAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhNetralAndWaktuLambat->joinWithAND(temperaturSedangAndPhNetral, waktuLambat);
  FuzzyRule *fuzzyRule22 = new FuzzyRule(22, ifTemperaturSedangAndPhNetralAndWaktuLambat, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule22);

  // Fuzzy Rule 23
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhNetralAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhNetralAndWaktuLambat->joinWithAND(temperaturPanasAndPhNetral, waktuLambat);
  FuzzyRule *fuzzyRule23 = new FuzzyRule(23, ifTemperaturPanasAndPhNetralAndWaktuLambat, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule23);

  // Fuzzy Rule 24
  FuzzyRuleAntecedent *ifTemperaturDinginAndPhBasaAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturDinginAndPhBasaAndWaktuLambat->joinWithAND(temperaturDinginAndPhBasa, waktuLambat);
  FuzzyRule *fuzzyRule24 = new FuzzyRule(24, ifTemperaturDinginAndPhBasaAndWaktuLambat, thenFaseMatang);
  fuzzy->addFuzzyRule(fuzzyRule24);

  // Fuzzy Rule 25
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhBasaAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhBasaAndWaktuLambat->joinWithAND(temperaturSedangAndPhBasa, waktuLambat);
  FuzzyRule *fuzzyRule25 = new FuzzyRule(25, ifTemperaturSedangAndPhBasaAndWaktuLambat, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule25);

  // Fuzzy Rule 26
  FuzzyRuleAntecedent *ifTemperaturPanasAndPhBasaAndWaktuLambat = new FuzzyRuleAntecedent();
  ifTemperaturPanasAndPhBasaAndWaktuLambat->joinWithAND(temperaturPanasAndPhBasa, waktuLambat);
  FuzzyRule *fuzzyRule26 = new FuzzyRule(26, ifTemperaturPanasAndPhBasaAndWaktuLambat, thenFaseMesoFilik2);
  fuzzy->addFuzzyRule(fuzzyRule26);

  // Fuzzy Rule 27
  FuzzyRuleAntecedent *ifTemperaturSedangAndPhBasaAndWaktuCepat = new FuzzyRuleAntecedent();
  ifTemperaturSedangAndPhBasaAndWaktuCepat->joinWithAND(temperaturSedangAndPhBasa, waktuCepat);
  FuzzyRule *fuzzyRule27 = new FuzzyRule(27, ifTemperaturSedangAndPhBasaAndWaktuCepat, thenFaseThermoFilik);
  fuzzy->addFuzzyRule(fuzzyRule27);

  // Fuzzy Rule 28
  FuzzyRuleAntecedent *ifTemperaturDinginAndPhBasaAndWaktuTerlaluCepat = new FuzzyRuleAntecedent();
  ifTemperaturDinginAndPhBasaAndWaktuTerlaluCepat->joinWithAND(temperaturDinginAndPhBasa, waktuTerlaluCepat);
  FuzzyRule *fuzzyRule28 = new FuzzyRule(28, ifTemperaturDinginAndPhBasaAndWaktuTerlaluCepat, thenFaseMesoFilik1);
  fuzzy->addFuzzyRule(fuzzyRule28);

  delay(500);
}

void loop()
{
  temp_val = catch_temp();
  ph_val = catch_ph();
  waktu_val = catch_waktu();

  //Logika Fuzzy
  fuzzy->setInput(1, temp_val);
  fuzzy->setInput(2, ph_val);
  fuzzy->setInput(3, waktu);

  fuzzy->fuzzify();

  float output = fuzzy->defuzzify(1);

  Serial.println("Hasil: ");
  Serial.print("\t\t\tFase: ");
  Serial.println(output);

  delay(5000);
}