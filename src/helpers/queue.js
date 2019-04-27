import 'pipe/fn/Promise';

function Queue(argument) {
  this.tasks = [];
  this.isPeding = false;
};

Queue.prototype = {
  call: function (fn, input, callback) {
    this.tasks.push({
      fn: fn,
      input: input,
      callback: callback
    });
    this.do();
  },

  do: function () {
    if (this.tasks.length === 0 || this.isPeding) return null;
    this.isPeding = true;
    const { fn, input, callback } = this.tasks[0];
    fn(input).finally(function (e) {
      callback(e)
      this.tasks.shift();
      this.isPeding = false;
      this.do();
    }.bind(this));
  }
};

export default Queue;