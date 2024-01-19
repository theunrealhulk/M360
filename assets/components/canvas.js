import { sharedState } from './sharedState.js';
import { watch } from 'vue';

export default {
    template: `
        <canvas ref="myCanvas" width="1920" height="1080" class="absolute top-0 left-0"></canvas>
    `,
    data() {
        return {
            lowResImages: [],
            highResImages: [],
            currentFrame: 0,
            isPlaying: false,
            lastMouseX: 0,
            lastMouseY: 0,
            highResImage: null, 
            mouseMoveThreshold: 5,
            currentLevel: null,
            circles: [
                { x: 500, y: 650, radius: 30, data: 'Circle 1' },
                { x: 200, y: 250, radius: 30, data: 'Circle 2' },
                // ... add more circles
            ],
            isLabelModeOn:false,
            svgIcon: '<svg fill="#000000" height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 493.242 493.242" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M369.086,274.039c-6.705,13.129-13.365,24.789-19.402,34.557c66.705,14.018,105.068,40.147,105.068,60.684 c0,29.52-79.18,70.688-208.131,70.688s-208.13-41.168-208.13-70.688c0-20.377,37.742-46.281,103.507-60.398 c-6.07-9.734-12.761-21.362-19.516-34.443C52.909,291.5,0,323.554,0,369.279c0,70.912,127.07,109.18,246.621,109.18 s246.621-38.268,246.621-109.18C493.242,323.205,439.473,291.005,369.086,274.039z"></path> <path d="M245.602,375.013c25.586,0,125.875-132.264,125.875-222.309c0-62.851-29.488-137.92-125.875-137.92 c-96.402,0-125.875,75.069-125.875,137.92C119.727,243.752,221.513,375.013,245.602,375.013z M187.229,138.843 c0-32.213,26.189-58.389,58.373-58.389c32.183,0,58.373,26.176,58.373,58.389c0,32.167-26.19,58.357-58.373,58.357 C213.418,197.201,187.229,171.01,187.229,138.843z"></path> </g> </g></svg>', 
            iconPosition: { x: 80, y: 80 },
            iconImage: new Image(),
        };
    },
    computed: {
        levelKey() {
            let level = sharedState.selectedLevel;
            if (typeof level === 'number') {
                return `R${level}`;
            } else {
                return level === 'firstLevel' ? 'BAS' : 'HAUT';
            }
        }
    },
    mounted() {
        this.convertSVGToImage();
        watch(()=>sharedState.isToggled,(value)=>{
            this.isLabelModeOn = value &&  this.currentLevel && this.currentLevel!== 'firstLevel' && this.currentLevel!=='lastLevel' ;
                    // Check if an image is available for the current frame
                const currentImage = this.isPlaying ? this.lowResImages[this.currentFrame] : this.highResImages[this.currentFrame];

                // Redraw the canvas with the SVG icon
                if (currentImage) {
                    this.drawImageOnCanvas(currentImage);
                }
            
            console.log(this.isLabelModeOn)
        },{immediate: true});
        watch(() => sharedState.selectedLevel, (newLevel) => {
            this.currentLevel=newLevel;
            if (newLevel || newLevel === 0) {
                this.loadImages(this.levelKey, 'LQ', () => {
                    this.loadImages(this.levelKey, 'HQ');
                });
            }
        }, { immediate: true });

        this.setupCanvas();
    },
    methods: {
        loadImages(levelKey) {
            // Reset arrays
            this.lowResImages = [];
            this.highResImages = [];
        
            let lowResSources = [];
            let highResSources = [];
            for (let i = 1; i <= 35; i++) {
                lowResSources.push(`data/LQ/${levelKey}_${i.toString().padStart(3, '0')}.jpg`);
                highResSources.push(`data/HQ/${levelKey}_${i.toString().padStart(3, '0')}.jpg`);
            }
        
            // Preload high-resolution images and draw the first frame once it's loaded
            highResSources.forEach((src, index) => {
                const img = new Image();
                img.onload = () => {
                    this.highResImages.push(img);
                    if (index === 0) {
                        this.drawImageOnCanvas(img); // Draw first high-res frame
                        this.loadLowResImages(lowResSources); // Load low-res images after drawing the first high-res frame
                    }
                };
                img.src = src;
            });
        },
        
        loadLowResImages(lowResSources) {
            // Load low-resolution images
            lowResSources.forEach(src => {
                const img = new Image();
                img.onload = () => {
                    this.lowResImages.push(img);
                };
                img.src = src;
            });
        },
        setupCanvas() {
            const canvas = this.$refs.myCanvas;
            canvas.addEventListener('mousedown', this.startPlaying);
            canvas.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.stopPlaying);
            canvas.addEventListener('click', this.handleCanvasClick);
        },
        startPlaying(event) {
            this.isPlaying = true;
            this.lastMouseX = event.offsetX;
            this.loadImages(this.levelKey, 'LQ');
        },
        onMouseMove(event) {
            if (!this.isPlaying) return;
        
            const currentMouseX = event.offsetX;
            const deltaX = currentMouseX - this.lastMouseX;
        
            if (Math.abs(deltaX) > this.mouseMoveThreshold) {
                this.currentFrame += deltaX > 0 ? 1 : -1;
                this.currentFrame = this.correctFrameIndex(this.currentFrame);
                this.drawImageOnCanvas(this.lowResImages[this.currentFrame]);
                this.lastMouseX = currentMouseX;
            }
        },
        
    
        correctFrameIndex(frame) {
            // Corrects the frame index to loop within the bounds of the lowResImages array
            if (frame >= this.lowResImages.length) {
                return 0;
            } else if (frame < 0) {
                return this.lowResImages.length - 1;
            }
            return frame;
        },
    
        stopPlaying(event) {
            this.isPlaying = false;
            if (this.highResImages[this.currentFrame]) {
                this.drawImageOnCanvas(this.highResImages[this.currentFrame]);
            }
        },
        updateIconPosition(currentLevel, currentFrame) {
            // Logic to update iconPosition based on currentLevel and currentFrame
            // Example:
            // this.iconPosition.x = ...; // Update based on level and frame
            // this.iconPosition.y = ...; // Update based on level and frame
        },
    
        convertSVGToImage() {
            const blob = new Blob([this.svgIcon], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            this.iconImage.onload = () => URL.revokeObjectURL(url); // Clean up URL
            this.iconImage.src = url;
        },
        drawImageOnCanvas(image) {
            const canvas = this.$refs.myCanvas;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
            if (this.isLabelModeOn && this.iconImage.complete) {
                this.updateIconPosition(this.currentLevel, this.currentFrame);
                ctx.drawImage(this.iconImage, this.iconPosition.x, this.iconPosition.y);
            }
        },
        
        
        handleCanvasClick(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            this.circles.forEach(circle => {
                const distance = Math.sqrt(Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2));
                if (distance < circle.radius) {
                    console.log('Circle clicked:', circle.data);
                }
            });
        },
    }
};
