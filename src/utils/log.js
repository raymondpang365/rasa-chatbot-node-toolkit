const log = console.log;
console.log = function() {
  log.apply(console, arguments);
  // Print the stack trace
  console.trace();
};

export default log;
