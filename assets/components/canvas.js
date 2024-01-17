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
            imgSource:"",
            lastMouseX: 0, // To track the last mouse X position
            frameDelay: 150, // Delay in milliseconds between frames
            mouseMoveThreshold:20,
            recentMousePositions: [], // Array to store recent mouse positions
            maxRecentPositions: 5, // Maximum number of positions to track
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
            if (this.isPlaying) {
                const currentMouseX = event.offsetX;

                // Update the array of recent mouse positions
                this.recentMousePositions.push(currentMouseX);
                if (this.recentMousePositions.length > this.maxRecentPositions) {
                    this.recentMousePositions.shift(); // Remove the oldest position
                }

                // Determine the direction of movement based on average
                const avgDelta = this.calculateAverageDelta();
                if (Math.abs(avgDelta) > this.mouseMoveThreshold) {
                    if (avgDelta > 0) {
                        // Moving to the right (this is inverted to adapt with renderings i have)
                        this.currentFrame--
                    } else {
                        // Moving to the left
                        this.currentFrame++;
                    }

                    // Correct the frame index and draw the image
                    this.currentFrame = this.correctFrameIndex(this.currentFrame);
                    this.drawImageOnCanvas(this.images[this.currentFrame]);
                }
            }
        },

        calculateAverageDelta() {
            if (this.recentMousePositions.length < 2) {
                return 0;
            }
            let totalDelta = 0;
            for (let i = 1; i < this.recentMousePositions.length; i++) {
                totalDelta += this.recentMousePositions[i] - this.recentMousePositions[i - 1];
            }
            return totalDelta / (this.recentMousePositions.length - 1);
        },
        correctFrameIndex(frame) {
            // Corrects the frame index to loop within the array bounds
            if (frame >= this.images.length) {
                return 0;
            } else if (frame < 0) {
                return this.images.length - 1;
            }
            return frame;
        },
    
        startPlaying(event) {
            this.isPlaying = true;
            this.lastMouseX = event.offsetX; // Set initial mouse X position
        },
    
        stopPlaying(event) {
            this.isPlaying = false;
        },
        // playClip() {
        //     console.log(this.imgSource,"playClip");

        //     if (!this.isPlaying || this.currentFrame >= this.images.length) {
        //         this.currentFrame = 0;
        //         return;
        //     }
        //     this.drawImageOnCanvas(this.images[this.currentFrame]);
        //     this.currentFrame++;
        //     requestAnimationFrame(this.playClip);
        // },
        drawImageOnCanvas(image) {
            const canvas = this.$refs.myCanvas;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }
};
