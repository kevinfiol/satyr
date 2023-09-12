import { suite, run } from 'flitch';
import { strict as assert } from 'assert';
import { store, computed } from './index.js';

const test = suite('satyr tests');

test('store get and set with primitives', () => {
  const s = store(1);

  // init
  assert.equal(s.value, 1);

  s.value = 2;
  assert.equal(s.value, 2);

  s.value = s.value + 1;
  assert.equal(s.value, 3);
});

test('store get and set with object', () => {
  const s = store({});

  // init
  assert.deepEqual(s.value, {});

  s.value = { a: 2 };
  assert.deepEqual(s.value, { a: 2 });

  s.value = { ...s.value, b: 3 };
  assert.deepEqual(s.value, { a: 2, b: 3 });

  s.value.a = 4;
  delete s.value.b;

  assert.deepEqual(s.value, { a: 4 });
});

test('store assignment operators', () => {
  const s = store(10);
  s.value += 1;
  assert.equal(s.value, 11);
});

test('store get and set with array', () => {
  const s = store([]);

  assert.deepEqual(s.value, []);

  s.value = [1, 2, 3];
  assert.deepEqual(s.value, [1, 2, 3]);

  s.value = [...s.value, 4, 5];
  assert.deepEqual(s.value, [1, 2, 3, 4, 5]);

  s.value.pop();
  s.value[0] = 'a';
  assert.deepEqual(s.value, ['a', 2, 3, 4]);
});

test('store get and set with null and undefined', () => {
  const s = store();
  assert.equal(s.value, undefined);

  s.value = 10;
  assert.equal(s.value, 10);

  s.value = undefined;
  assert.equal(s.value, undefined);

  s.value = null;
  assert.equal(s.value, null);
});

test('subscriptions', () => {
  const s = store({ a: 2 });
  let watching;

  let unsub = s.sub(v => watching = v); // should execute initially
  assert.deepEqual(watching, { a: 2 });

  s.value = { ...s.value, b: 3 };
  assert.deepEqual(watching, { a: 2, b: 3 });

  unsub();
  s.value = { c: 10 };
  assert.deepEqual(s.value, { c: 10 });
  assert.deepEqual(watching, { a: 2, b: 3 });
});

test('subscriptions with initial calculation disabled', () => {
  const s = store({ a: 2 });
  let watching;

  let unsub = s.sub(v => watching = v, false); // should not execute
  assert.equal(watching, undefined);

  s.value = { ...s.value, b: 3 };
  assert.deepEqual(watching, { a: 2, b: 3 });

  unsub();
  s.value = { c: 10 };
  assert.deepEqual(watching, { a: 2, b: 3 });
});

test('computed utility', () => {
  const s = store(10);
  const t = store(20);

  const combined = computed(() => {
    return s.value + t.value;
  });

  assert.equal(combined.value, 30);

  s.value = 40;
  assert.equal(combined.value, 60);

  t.value = 10;
  assert.equal(combined.value, 50);

  const second = computed(() => {
    return combined.value + t.value;
  });

  assert.equal(second.value, 60);

  t.end(); // detach all subscribers
  t.value = 100;
  assert.equal(combined.value, 50); // combined is no longer subbed to t

  // second is also no longer subbed to t
  assert.equal(second.value, 60);
});

test('computed with many stores', () => {
  const s = store({ num: 10 });
  const t = computed(() => ({ ...s.value, num: s.value.num + 10 }));
  const u = computed(() => ({ ...t.value, num: t.value.num * 2 }));

  assert.deepEqual(s.value, { num: 10 });
  assert.deepEqual(t.value, { num: 20 });
  assert.deepEqual(u.value, { num: 40 });

  s.value = { ...s.value, num: s.value.num * 10 };
  assert.deepEqual(s.value, { num: 100 });
  assert.deepEqual(t.value, { num: 110 });
  assert.deepEqual(u.value, { num: 220 });

  let noOfTimesComputedFnRan = 0;
  const foo = computed(() => {
    noOfTimesComputedFnRan += 1;
    return s.value.num + t.value.num + u.value.num;
  });

  // computed function should only run ONCE to get initial calculation
  assert.equal(noOfTimesComputedFnRan, 1);
  assert.equal(foo.value, 430);
});

test('store.end test 2', () => {
  const foo = store(10);
  const bar = store(20);

  const rum = computed(() => foo.value + bar.value); // 30
  const ham = computed(() => rum.value + bar.value); // 50

  assert.equal(rum.value, 30);
  assert.equal(ham.value, 50);

  rum.end(); // breaks all listeners (ham)

  foo.value = 20;
  // since foo -> rum -/> ham, ham does not update, but rum does
  assert.equal(ham.value, 50);
  assert.equal(rum.value, 40);

  // will update ham, and ham will *see* the latest rum value
  bar.value = 100;
  assert.equal(ham.value, bar.value + rum.value);
});

test('detect circular dependencies', () => {
  let error = false;
  const a = store(10);

  const b = computed(() => a.value + 10);

  try {
    const c = computed(() => a.value = b.value);
  } catch (e) {
    error = true;
  }

  assert.ok(error);
});

run();