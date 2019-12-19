
use wasm_bindgen::prelude::*;
use crate::modules::*;


#[wasm_bindgen]
pub struct Context{
    buffer: Option<Buffer>,//<Vec<u8>>,
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

    pub fn load_img(&mut self,pixels:JsValue,width:usize,height:usize,len:usize)->bool{
        let mut buf:Vec<u8> = vec![0;len];
        let js_buf = js_sys::Uint8Array::new(&pixels);
        
        // copy the js buffer into the wasm buffer
        js_buf.copy_to(&mut buf);
        web_sys::console::log_2(&"loaded image successfully: ".into(),
            &buf[0].into());
        
        self.buffer=Some(Buffer::new(buf,width,height,4));
        true
    }

    pub fn frame_width(&self)->usize  {self.frame.width()}
    pub fn frame_height(&self)->usize {self.frame.height()}
    pub fn frame_len(&self)->usize    {self.frame.len()}
    pub fn clear_frame(&mut self){
        self.frame.clear();
    }
    //pub fn draw(&mut self){
        //self.frame.draw();
    //}

    //pub fn view_img(&mut self,x:u32,y:u32)->bool{
        //if x >= self.frame.width() || y >= self.frame.height() { return false}
        //match self.buffer.as_mut(){
            //Some(buf)=>{
                //self.frame.put_img(&buf,x,y);
                //return true
            //}
            //None => {
                //web_sys::console::log_1(&"No image Found".into());
                //return false
            //}
        //}        
    //}
}
