 use super::Buffer;

pub struct Frame{
    view:   Buffer,
    //width:  usize,
    //height: usize,
    //channels: usize,
}

impl Frame{
    pub fn new(width:usize,height:usize)->Frame{
        let len  = (width*height*4) as usize; //Assuming RGBA Format
        let v = vec![255;len];
        Frame{
            view:   Buffer::new(v,width,height,4),
            //width:  width,
            //height: height,
        }
    }
    pub fn width(& self)->usize    {self.view.width()}
    pub fn height(& self)->usize   {self.view.height()}
    pub fn len(& self)->usize      {self.view.len()}
    pub fn clear(&mut self){
        self.view.clear(255);
    }
    //pub fn clone_img(&mut self,source: &Vec<u8>,
        //x:u32,y:u32){
        //let source_dims = source.dimensions();
        //let (x_range,y_range) = self.frame_bounds(source_dims,x,y);

        //for top_y in 0..y_range{
            //for top_x in 0..x_range{
                //let subpx = source.get_pixel(top_x,top_y);
                ////println!("subpx : {:?},{:?}",top_x,top_y);//subpx);
                //for (i,sub) in subpx.channels().iter().enumerate(){
                    //let index = (( self.width*(top_y+y)+(top_x+x) )*self.channel)+i as u32;
                    //self.view[index as usize] = *sub;
                //} 
            //}
        //}
    //}
    
}