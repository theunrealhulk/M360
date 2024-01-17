import { sharedState } from './sharedState.js';
import { watch } from 'vue';

export default {
    template: `
        <canvas ref="myCanvas" width=1920 height=1080 class=" absolute top-0 left-0"></canvas>
    `,
    data() {
        return {
            images: [],
            currentFrame: 0,
            isPlaying: false,
            imgSource:""
        };
    },
    mounted() {
        watch(() => sharedState.isToggled, (newData) => {

            
            console.log( newData );

        }, { immediate: true });
        watch(() => sharedState.selectedLevel, (newLevel) => {

                // this.updateCanvas(newLevel);
        
                    if(newLevel || newLevel === 0){    
                    console.log( newLevel );
                    switch(newLevel) {
                        case "firstLevel" :
                            this.imgSource = 'data/HQ/BAS_'
                        break;
                        case "lastLevel" :
                            this.imgSource = 'data/HQ/HAUT_'
                        break;
                        default :
                            this.imgSource = `data/HQ/R${newLevel}_`
                        break;
                        }
                    }
                    this.loadImages(this.imgSource);
                }, { immediate: true });
                this.loadImages(this.imgSource);
                this.setupCanvas();
            },
                
    methods: {
        loadImages(path) {
            this.images = []; // Clear existing images
            this.currentFrame = 0; // Reset the frame counter
        
            let imageSources = [];
            for (let i = 0; i < 36; i++) {
                imageSources.push(`${path}${i.toString().padStart(3, '0')}.jpg`);
            }
        
            imageSources.forEach((src, index) => {
                const img = new Image();
                img.onload = () => {
                    this.images.push(img);
        
                    // If it's the first image, draw it on the canvas
                    if (index === 0) {
                        this.drawImageOnCanvas(img);
                    }
                };
                img.src = src;
            });
        },
        setupCanvas() {
            const canvas = this.$refs.myCanvas;
            canvas.addEventListener('mousedown', this.startPlaying);
            canvas.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.stopPlaying);
            console.log(this.imgSource);
        },
        startPlaying(event) {
            // Only start playing if there are images loaded
            if (this.images.length > 0) {
                this.isPlaying = true;
                this.playClip();
            }
        },
        onMouseMove(event) {
            console.log(this.imgSource);

            if (this.isPlaying ) {
                // Update frame based on mouse movement or keep playing
            }
        },
        stopPlaying(event) {
            console.log(this.imgSource, 'stopPlaying');

            this.isPlaying = false;
        },
        playClip() {
            console.log(this.imgSource,"playClip");

            if (!this.isPlaying || this.currentFrame >= this.images.length) {
                this.currentFrame = 0;
                return;
            }
            this.drawImageOnCanvas(this.images[this.currentFrame]);
            this.currentFrame++;
            requestAnimationFrame(this.playClip);
        },
        drawImageOnCanvas(image) {
            const canvas = this.$refs.myCanvas;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }
};
