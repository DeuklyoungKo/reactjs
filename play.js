// var aGreateNumber = 10;
let aGreateNumber = 10;

if ( true ) {
    let aGreateNumber = 42;

    // (() => {
    //     var aGreateNumber = 42;
    // })();

}

setTimeout(() => {
    console.log(aGreateNumber);
}, 1000);

console.log('wating...');