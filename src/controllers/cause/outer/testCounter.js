const cron = require('node-cron');
import CounterWrapper from './CounterWrapper';

let counter = 0;
const task = cron.schedule('*/' + '0,5 * * * * *', async () => {
  counter++;
  console.log(counter);
  CounterWrapper.updateCount(counter)
});

task.start();

//export default counter;

