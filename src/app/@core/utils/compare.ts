// Comparison library inspired by https://stackoverflow.com/a/14853974/9737947

export const compareArrays = <T>(array1: Array<T>, array2: Array<T>) => {
  // compare lengths - can save a lot of time
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0, l = array1.length; i < l; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
};

export const compareObjects = (object1: any, object2: any) => {
  //For the first loop, we only check for types
  for (const propName in object1) {
    if ({}.hasOwnProperty.call(object1, propName)) {
      {
        //Check for inherited methods and properties - like .equals itself
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        //Return false if the return value is different
        if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
          return false;
        }
        //Check instance type
        else if (typeof object1[propName] !== typeof object2[propName]) {
          //Different types => not equal
          return false;
        }
      }
    }
  }
  //Now a deeper check using other objects property names
  for (const propName in object2) {
    if ({}.hasOwnProperty.call(object2, propName)) {
      {
        //We must check instances anyway, there may be a property that only exists in object2
        //I wonder, if remembering the checked values from the first loop would be faster or not
        if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
          return false;
        } else if (typeof object1[propName] !== typeof object2[propName]) {
          return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if (!object1.hasOwnProperty(propName)) {
          continue;
        }

        //Now the detail check and recursion

        //This returns the script back to the array comparing
        /**REQUIRES Array.equals**/
        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
          // recurse into the nested arrays
          if (!object1[propName].equals(object2[propName])) {
            return false;
          }
        } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
          // recurse into another objects
          // console.log(
          //   "Recursing to compare ", object1[propName],"with",object2[propName], " both named \""+propName+"\""
          // );
          if (!object1[propName].equals(object2[propName])) {
            return false;
          }
        }
        //Normal value comparison for strings and numbers
        else if (object1[propName] !== object2[propName]) {
          return false;
        }
      }
    }
  }
  //If everything passed, let's say YES
  return true;
};

// TODO move to tests
export const testComparer = () => {
  assert(compareArrays([], []), 'array empty');

  assert(!compareArrays([1], []), 'array number first');
  assert(!compareArrays([], [1]), 'array number second');
  assert(compareArrays([1], [1]), 'array number');

  assert(!compareArrays(['one'], []), 'array string first');
  assert(!compareArrays([], ['one']), 'array string second');
  assert(compareArrays(['one'], ['one']), 'array string');

  assert(!compareArrays([1, 2], []), 'array numbers first');
  assert(!compareArrays([], [1, 2]), 'array numbers second');
  assert(compareArrays([1, 2], [1, 2]), 'array numbers');

  assert(!compareArrays(['one', 'two'], []), 'array strings first');
  assert(!compareArrays([], ['one', 'two']), 'array strings second');
  assert(compareArrays(['one', 'two'], ['one', 'two']), 'array strings');

  assert(compareObjects({}, {}), 'object empty');
};

const assert = (truthy: boolean, msg: string) => {
  if (!truthy) {
    throw new Error(msg);
  }
};
