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

[Try on Flems.io.](https://flems.io/#0=N4IgtglgJlA2CmIBcBGADGgNCAZhBAzsgNqgB2AhmIkiAHQAWALmLCNgMYD2ZT8vyECAC+mclRr0AVkU48+A2hDAAHLgCcmAAmBaCTDfExbuqgK58oW4VpzquYLQHICFJgE91TgNwAdMv7cZPomXGa8WgC8egbq8AAUaACUfgFkAPTpWnFM6hDwAG7wMYZaBRSwZsUARu5aFBwc8AQEEGQA5lpMDMUABnTllfC9Wir2KvCa7oE8BFwIdLBc7fHc4UwDFVUpWplaaP7+ewTw2t3F+qWDVVpmrR1dPfUtEO1k1BFcE+puGlq9kV6M3WmyGUS06FSa14oJuAGpoihUjNgvN4ItlqswjDrvAdnsUChDhksgQzNUCBw8tVigYSnECMCYWTqvEClEAHyhVELJYrXoAYTM6jiEWhTCQWgAJMACsJekl8Vk+QR-kKRfxtOLJYSgWk9lT4G5iqYVBZ4FZLgyUSEoJMIEUrNFTeaoPF4klOaEQbitAAqCEYFJMja+6IAVihszRGJWdryjtheO8uyy4Yw7BAJwQHCYEFmghQAE4kABmAAsIjEIEo1EEdA4LUzQQUTEEIgAusIgA)

## Install

```bash
npm install satyr
```