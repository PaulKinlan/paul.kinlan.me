const encoder = new TextEncoder();

const pipeInto = async (from:any, controller:any) => {
  const reader = from.getReader();
  
  return reader.read().then(function process(result:any) {
    if (result.done) {
      return;
    }
    const value = result.value;
    const isTypedArray = (value instanceof Int8Array
      || value instanceof Int16Array
      || value instanceof Int32Array
      || value instanceof Uint8Array
      || value instanceof Uint8ClampedArray
      || value instanceof Uint16Array
      || value instanceof Uint32Array
      || value instanceof Float32Array
      || value instanceof Float64Array)
    if((isTypedArray === false && !!result.value) || (isTypedArray && value.length > 0)) {
      controller.enqueue(result.value);
    }
    return reader.read().then(process);
  });
};

const enqueueItem = async (val:any, controller:any) => {
  if (val instanceof globalThis.ReadableStream) {
    await pipeInto(val, controller);
  } 
  else if (val instanceof Promise) {
    let newVal;
    newVal = await val;

    if (newVal instanceof globalThis.ReadableStream) {
      await pipeInto(newVal, controller);
    } else {
      await enqueueItem(newVal, controller);
    }
  }
  else {
    if (Array.isArray(val)) {
      for (let item of val) {
        await enqueueItem(item, controller)
      }
    }
    else if (!!val) {
      controller.enqueue(encoder.encode(val));
    }
  }
}

export default async (strings: TemplateStringsArray, ...values: any) => {
  return new globalThis.ReadableStream({
    start(controller) {
      async function push() {
        let i = 0;
        while (i < values.length) {
          let html = strings[i];

          controller.enqueue(encoder.encode(html));
          await enqueueItem(values[i], controller);

          i++;
        }
        controller.enqueue(encoder.encode(strings[i]));
        controller.close();
      }

      push();
    }
  });
};