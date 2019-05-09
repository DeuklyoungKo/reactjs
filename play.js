const aGreatNumber = 10;
// var aGreatNumber = 11;

const aGreatObject = { withGreatKeys: true };

aGreatObject.withGreatKeys = false;

if ( true ) {
    // aGreatNumber = 42;
}
console.log(aGreatNumber);
console.log(this.aGreatNumber);

setTimeout(() => {
    // let aGreatNumber = 32;
    console.log(aGreatNumber);
    console.log(aGreatObject.withGreatKeys);
}, 1000);

console.log('wating...');