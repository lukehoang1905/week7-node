const c = require("chalk");
class Print {
  blue(...t) {
    console.log(c.blue.bold(...t));
  }
  yellow(...t) {
    console.log(c.yellow.bold(...t));
  }
  green(...t) {
    console.log(c.green.bold(...t));
  }
  black(...t) {
    console.log(c.black.bold(...t));
  }
  red(...t) {
    console.log(c.red.bold(...t));
  }
}
module.exports = new Print();
