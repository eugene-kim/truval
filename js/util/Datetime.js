class Datetime {

  /**
   * Takes in Javascript's native Date object.
   */
  constructor(date=new Date()) {
    this.date = date;
  }

  // --------------------------------------------------
  // Print
  // --------------------------------------------------
  getHoursAndMinutes() {
    const hours = this.formatTimeDigits(this.date.getHours());
    const minutes = this.formatTimeDigits(this.date.getMinutes());

    return `${hours}:${minutes}`;
  }

  // --------------------------------------------------
  // Boolean Methods
  // --------------------------------------------------
  isNewMinute() {
    return this.date.getSeconds() === 0;
  }

  // --------------------------------------------------
  // Formatting
  // --------------------------------------------------
  formatTimeDigits(number) {
    return (number).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
  }

}


export default Datetime;
