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
    pub fn dimensions(&self)->(usize,usize){
        (self.width,self.height)
    }
    pub fn len      (&self)->usize{self.data.len()}
    pub fn width    (&self)->usize{self.width}
    pub fn height   (&self)->usize{self.height}
    pub fn data     (&self)-> *const u8{ self.data.as_ptr()} 

    pub fn get_index(&self, x:usize,y:usize)->usize{
        (y * self.width() +x)* self.channel
    }


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

    pub fn clone_img(&mut self,source: &Buffer,
        x:usize,y:usize){
        let source_dims = source.dimensions();
        let (x_range,y_range) = self.drawing_range(source_dims,(x,y));


        for top_y in y..y_range{
            for top_x in x..x_range{

                let idx_dst = self.get_index(top_x,top_y);
                let idx_src = source.get_index(top_x,top_y);
                
                for sub_px in 0.. self.channel
                {
                    
                    self.data[idx_dst + sub_px] = source.data[idx_src +sub_px];
                }
            }
        }

    }

    /***************************************************
        Given the frame dimensions, the frame dimensions,
        and the starting drawing x,y cordinates of the buffer
        returns the cordinates of the last pixel drawn.
    ***************************************************/
    fn drawing_range(&self,(source_wid,source_hi):(usize,usize),(starting_x,starting_y):(usize,usize))
        ->(usize,usize){
            let x_range = self.width().saturating_sub(starting_x) // Find the maximum width available
                .min(source_wid);    // get the minimum of the of the available width and the overlay width
            let y_range = self.height().saturating_sub(starting_y)
                .min(source_hi);

        //web_sys::console::log_2(&"x_range: ".into(),&(x_range as u8).into());
        //web_sys::console::log_2(&"Y_range: ".into(),&(y_range as u8).into());
        (x_range,y_range)
    }
}
