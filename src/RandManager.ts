module.exports = {
  uniqueRandomNumbers(
    numRandomNumbers: number,
    lowerLimit: number,
    upperLimit: number,
  ) {
    let uniqueNumbers: Array<number> = [];
    while (uniqueNumbers.length !== numRandomNumbers) {
      let currentRandomNumber = this.randomNumberInRange(
        lowerLimit,
        upperLimit,
      );
      if (uniqueNumbers.indexOf(currentRandomNumber) === -1) {
        uniqueNumbers.push(currentRandomNumber);
      }
    }
    return uniqueNumbers;
  },

  randomNumberInRange(lowerLimit: number, upperLimit: number) {
    return (
      Math.floor(Math.random() * (1 + upperLimit - lowerLimit)) + lowerLimit
    );
  },
};
