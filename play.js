let foods = new WeakMap();

foods.set(['italian'], 'gelato');
foods.set(['mexican'],'tortas');
foods.set(['canadian'],'poutine');

let southernUsStates = ['Tennessee','Kentucky','Texas'];
foods.set(southernUsStates,'hot chicken');
southernUsStates = null;

console.log(
    foods.get(['italian']),
    foods.has(['french']),
    foods.get(southernUsStates),
    foods.size
);

/*

let foods = new Map();
foods.set('italian', 'gelato');
foods.set('mexican','tortas');
foods.set('canadian','poutine');

let southernUsStates = ['Tennessee','Kentucky','Texas'];
foods.set(southernUsStates,'hot chicken');

console.log(
    foods.get('italian'),
    foods.has('french'),
    foods.get(southernUsStates),
    foods.size
);


for (let [countryKey, food] of foods.entries()) {
    console.log(countryKey, food);
}

for (let countryKey of foods.keys()) {
    console.log(countryKey);
}

*/

/*
let foods = {};

foods.itlian = 'gelato';
foods.mexican = 'tortas';
foods.canadian = 'poutine';

console.log(foods.itlian);

*/
