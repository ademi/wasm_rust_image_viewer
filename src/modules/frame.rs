 use super::Buffer;

pub struct Frame{
    view:   Buffer,
}

impl Frame{
    pub fn new(width:usize,height:usize)->Frame{
        let len  = (width*height*4) as usize; //Assuming RGBA Format
        let v = vec![0;len];
        Frame{
            view:   Buffer::new(v,width,height,4),
        }
    }
    pub fn width(& self)->usize     {self.view.width()}
    pub fn height(& self)->usize    {self.view.height()}
    pub fn len(& self)->usize       {self.view.len()}
    pub fn data(&self)-> *const u8  { self.view.data()} 

    pub fn clear(&mut self){
        self.view.clear(255);
    }
    pub fn draw(&mut self,src: &Buffer, x:usize,y:usize){
        self.view.clone_img(src,x,y);
    }
    
}