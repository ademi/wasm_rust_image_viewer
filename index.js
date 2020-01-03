import init,{initialize_context,Context} from './canvas_page.js';
'use strict';

const view = {};
async   function run(view){
    'use strict';
    let wasm_handler = await init();

    function App(){

        this.zoom = 1.0;

        this.setup_canvas();
        this.setuploader();
        console.log(this.canvas.width,this.canvas.height);
        this.viewer =initialize_context(this.canvas.width,this.canvas.height);
        
    }
    App.prototype.setuploader = function(){
        document.getElementById('open_img')
            .addEventListener('change',this.openFile.bind(this),true);

    }
    App.prototype.setup_canvas = function(){
        this.canvas = document.getElementById("canvas");
        
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height= this.canvas.clientHeight;
        //this.canvas_ctx = this.canvas.getContext('2d');
        
    }
    App.prototype.openFile=function(event){

        const files = event.target.files;
        const validtypes = ["image/gif", "image/jpeg", "image/png"];

        if(files 
            && files.length==1 
            && validtypes.indexOf(files[0]["type"]) !=-1){
                const reader = new FileReader();
                reader.addEventListener("loadend",this.loadImage.bind(this));
                reader.readAsDataURL(event.target.files[0]);
                reader.onerror =() =>{
                    console.error("Unable to read file"+file.name)
                }       
            }
        
    }
    App.prototype.getindex = function(x,y,w,h){
        return (y*w + x)*4;
    }
    App.prototype.refresh_frame=function(raw_img){
        //this.canvas_ctx.putImageData(raw_img,0,0); 
            let raw_buffer = new Uint8ClampedArray(
                wasm_handler.memory.buffer,
                this.viewer.frame_buffer(),
                this.viewer.frame_len());
        
            let imgData = new ImageData(raw_buffer,this.viewer.frame_width(),this.viewer.frame_height());
            for (let x =0, y=0 ;
                    x < Math.min(raw_img.width,imgData.width) && 
                    y < Math.min(raw_img.height,imgData.height) ;
                    x++,y++){
                let idx =this.getindex(x,y,
                    Math.min(raw_img.width,imgData.width),
                    Math.min(raw_img.height,imgData.height));

                //for (let i =0;i<4;i++){
                    //if(raw_img.data[idx+i]!= imgData.data[idx+i]){
                    //console.log("difference: "+x+","+y+" : "
                        //+raw_img.data[idx+i]+" , "+imgData.data[idx+i])
                    //}
                //}
            }

            let canvas_ctx = this.canvas.getContext('2d')
            canvas_ctx.putImageData(imgData,0,0);
    }
    App.prototype.loadImage = function(loadend_evt){
        const img = new Image();
        img.src = loadend_evt.target.result;
        img.onload = (function(evt){
            const cnvx = document.createElement('canvas');
            const cnvx_ctx = cnvx.getContext('2d');
            cnvx.width = img.naturalWidth;
            cnvx.height = img.naturalHeight;
            cnvx_ctx.drawImage(img,0,0);
            const raw_img = cnvx_ctx.getImageData(0,0,img.naturalWidth,img.naturalHeight)
           
            const did_load = this.viewer.load_img(
                raw_img.data,
                raw_img.width,
                raw_img.height,
                raw_img.data.length
                );
            
            if(did_load){
                this.viewer.refresh_frame(0,0)
                this.refresh_frame(raw_img)
            }
        }).bind(this);
   }

    new App();
}
run(view);
