class AGreateClass {
    constructor(greatNumber) {
        this.greatNumber = greatNumber;
    }


    returnGreatThings(){
        return this.greatNumber;
    }
}


class AnotherGreatClass extends AGreateClass{

    constructor(greatNumber,greatWord) {
        super(greatNumber);
        this.greatWord = greatWord;
    }

    returnGreatThings() {

        let greatNumber = super.returnGreatThings();
        // return {greatNumber: 'adventure'};
        return [greatNumber, this.greatWord];

    }

}

// const aGreatObject = new AGreateClass(42);
const aGreatObject = new AnotherGreatClass(42, 'adventure');

console.log(
    // aGreatObject.returnGreatThings().greatNumber
    aGreatObject.returnGreatThings()
);