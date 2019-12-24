extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

extern crate js_sys;
pub mod modules;
pub mod context;
use context::*;

#[wasm_bindgen]
pub fn initialize_context(canvas_width:usize,canvas_height:usize)->Context{
    
    Context::new(canvas_width,canvas_height)
}
