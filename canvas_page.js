
let wasm;

/**
* @param {number} canvas_width
* @param {number} canvas_height
* @returns {Context}
*/
export function initialize_context(canvas_width, canvas_height) {
    const ret = wasm.initialize_context(canvas_width, canvas_height);
    return Context.__wrap(ret);
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}
/**
*/
export class Context {

    static __wrap(ptr) {
        const obj = Object.create(Context.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_context_free(ptr);
    }
    /**
    * @param {number} canvas_width
    * @param {number} canvas_height
    * @returns {Context}
    */
    static new(canvas_width, canvas_height) {
        const ret = wasm.context_new(canvas_width, canvas_height);
        return Context.__wrap(ret);
    }
    /**
    * @param {any} pixels
    * @param {number} width
    * @param {number} height
    * @param {number} len
    * @returns {boolean}
    */
    load_img(pixels, width, height, len) {
        const ret = wasm.context_load_img(this.ptr, addHeapObject(pixels), width, height, len);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    frame_width() {
        const ret = wasm.context_frame_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    frame_height() {
        const ret = wasm.context_frame_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    frame_len() {
        const ret = wasm.context_frame_len(this.ptr);
        return ret >>> 0;
    }
    /**
    */
    clear_frame() {
        wasm.context_clear_frame(this.ptr);
    }
    /**
    * @returns {number}
    */
    frame_buffer() {
        const ret = wasm.context_frame_buffer(this.ptr);
        return ret;
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {boolean}
    */
    refresh_frame(x, y) {
        const ret = wasm.context_refresh_frame(this.ptr, x, y);
        return ret !== 0;
    }
}

function init(module) {
    if (typeof module === 'undefined') {
        module = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    let result;
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_buffer_44cb68be3749d64e = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_453ee8a17581c5a9 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_d7a8a06e1f975d95 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_c9c8c0859dad062c = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    });
}

export default init;

