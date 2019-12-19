pub struct Buffer{
    channel: usize,
    data:Vec<u8>,
    width:usize,
    height:usize,
}

impl Buffer{
    pub fn new(data:Vec<u8>,width:usize,height:usize,channel:usize)->Buffer{
        Buffer{
            channel:channel,
            data:data,
            height:height,
            width:width,
        }
    }
    pub fn get_dimensions(&self)->(usize,usize){
        (self.width,self.height)
    }
    pub fn len      (&self)->usize{self.data.len()}
    pub fn width    (&self)->usize{self.width}
    pub fn height   (&self)->usize{self.height}


    pub fn set_dimensions(&mut self, width:usize,height:usize){
        self.width=width;
        self.height =height;
    }
    pub fn set_data(&mut self,data:Vec<u8>){
        self.data =data;
    }
    pub fn clear(&mut self,color:u8){
        for i in &mut self.data {*i = color};
    }
}