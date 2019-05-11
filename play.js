const data = ["vote1", "vote2", "vote1", "vote2", "vote2"];
const reducer = (accumulator, value, index, array) => {

    console.log(accumulator);

    if (accumulator[value]) {
        accumulator[value] = accumulator[value] + 1;
    } else {
        accumulator[value] = 1;
    }
    return accumulator;
};
// const getVote = data.reduce(reducer, {}); // { vote1: 2, vote2: 3 }
const getVote2 = data.reduce(reducer); // "vote1"



/*


var data = [1, 2, 3, 4, 5, 6, 1];
var reducer = (accumulator, value, index, array) => {

    console.log(accumulator);

    var sumOfAccAndVal = accumulator + value;

    // console.log(sumOfAccAndVal);

    if (index === array.length - 1) {
        return (sumOfAccAndVal) / array.length;
    }
    return sumOfAccAndVal;
};

var getMean = data.reduce(reducer, 0);
console.log(getMean); // 3.142857142857143




const favoriteFood = 'gelato';
const iLoveFood = `The year is ${(new Date()).getFullYear()} and my favorite food is ${favoriteFood}`;
console.log(iLoveFood);



var votes = ["kim", "hong", "lee", "hong", "lee", "lee", "hong"];
var reducer = function(accumulator, value, index, array) {
    if (accumulator.hasOwnProperty(value)) {
        accumulator[value] = accumulator[value] + 1;
    } else {
        accumulator[value] = 1;
    }
    return accumulator;
}
var initialValue = {};
var result = votes.reduce(reducer, initialValue);
console.log(result); // { kim: 1, hong: 3, lee: 3 }
*/

