# satyr

A tiny observable store utility. A versino of [vyce](https://github.com/kevinfiol/vyce), but using getter/setter properties.

```js
import { store, computed } from 'satyr';

const count = store(0);

// retrieve value by accessing `.value` property
console.log(count.value); // 0

// set the store value using assignment `=`
count.value = 10;
count.value += 1;

console.log(count.value); // 11

// subscribe to stores
count.sub(v => console.log(`Current count: ${v}`)); // logs `Current count: 11`

// create computed stores
const derived = computed(() => count.value * 100);
console.log(derived.value); // 1100
```