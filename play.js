let printThreeThings = function (thing1, thing2, thing3) {
    console.log(thing1, thing2, thing3);
};

// let yummyThings = ['pizza', 'gelato', 'sushi'];
let yummyThings = ['pizza', 'gelato', 'sushi', 'cheeseburger'];
let greatThings = ['swimming', 'sunsets', ...yummyThings, 'New Orleans'];

// printThreeThings(...yummyThings);
// let copyOfGreatThing = greatThings;
let copyOfGreatThing = [...greatThings];

copyOfGreatThing.push('summer');

console.log(greatThings);
console.log(copyOfGreatThing);