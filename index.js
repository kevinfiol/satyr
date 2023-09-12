let COMPS = [];

export function store(init) {
  let $,
    x = init,
    subs = [];

  return $ = {
    get value() {
      let comp = COMPS[COMPS.length - 1];
      if (comp) $.sub(comp, false);
      return x;
    },

    set value(v) {
      x = v;
      for (let sub of subs) sub(x);
    },

    sub(fn, run = true) {
      if (run) fn(x);
      if (!~subs.indexOf(fn)) subs.push(fn);
      return idx =>
        (~(idx = subs.indexOf(fn))) && subs.splice(idx, 1);
    },

    end: _ => subs = []
  };
}

export function computed(fn) {
  let comb = store(),
    calc = _ => {
      if (~COMPS.indexOf(calc))
        throw Error('satyr: Circular Dependency');
      COMPS.push(calc);
      comb.value = fn();
      COMPS.pop();
    }

  calc();
  return comb;
}
