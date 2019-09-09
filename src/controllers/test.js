//import counter from './chatbot/cause/outer/testCounter';
import CounterWrapper from './cause/outer/CounterWrapper'
export default {

  test(req, res) {
    res.send({counter: CounterWrapper.counter});
  }
}
