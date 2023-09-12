# satyr

A [tiny](https://bundlejs.com/?q=satyr) observable store utility using getter/setter properties.

```js
import { store, computed } from 'satyr';

const count = store(0);

// retrieve store value by accessing the `.value` property
console.log(count.value); // 0

// set the store value using the assignment operator `=`
count.value = 10;
count.value += 1;

console.log(count.value); // 11

// subscribe to stores
count.sub(v => console.log(`Current count: ${v}`)); // logs `Current count: 11`

// create computed stores
const derived = computed(() => count.value * 100);
count.value = 5;
console.log(derived.value); // 500
```

## Install

```bash
npm install satyr
```