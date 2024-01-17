import { reactive } from 'vue';

export const sharedState = reactive({
    data: null,
    isToggled: false,
    selectedLevel: 'lastLevel',
    sharedVal:false
    // Add other shared properties here if needed
});