
use wasm_bindgen::prelude::*;
use crate::modules::*;


#[wasm_bindgen]
pub struct Context{
    buffer: Option<Buffer>,
    frame: Frame,
}

#[wasm_bindgen]
impl Context{
    pub fn new(canvas_width:usize,canvas_height:usize)->Context{
        Context{
            buffer:None,
            frame: Frame::new(canvas_width,canvas_height),
        }
    }

    pub fn load_img(&mut self,pixels:JsValue,width:usize,height:usize,len:u32)->bool{
        let mut buf:Vec<u8> = vec![0;len as usize];
        let js_buf = js_sys::Uint8Array::new(&pixels);
        
        // copy the js buffer into the wasm buffer
        js_buf.copy_to(&mut buf);
        self.buffer=Some(Buffer::new(buf,width,height,4));
        true
    }

    pub fn frame_width(&self)->usize  {self.frame.width()}
    pub fn frame_height(&self)->usize {self.frame.height()}
    pub fn frame_len(&self)->usize    {self.frame.len()}
    pub fn clear_frame(&mut self){
        self.frame.clear();
    }
    pub fn frame_buffer(&mut self)-> *const u8{
        self.frame.data()
    }
    pub fn refresh_frame(&mut self, x:usize,y:usize)->bool{

        match
            self.buffer.as_ref(){
                Some(buf)=>{
                    
                    self.frame.draw(buf,x,y);
                    true
                },
                None=> false,
            }
    }

}
