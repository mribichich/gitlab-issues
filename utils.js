exports.asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

exports.logLine = (...args) => {
  process.stdout.write(...(args + '\n'));
};

exports.log = (...args) => {
  process.stdout.write(...args);
};
