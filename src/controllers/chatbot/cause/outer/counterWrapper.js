class CounterWrapper{
  constructor(count){
    console.log('Constructed again!')
    this.counter = count;
  }

  updateCount(count){
    this.counter = count
  }



}

const counterWrapper = new CounterWrapper(0);

export default counterWrapper;
