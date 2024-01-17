import { reactive } from 'vue';

export const sharedState = reactive({
    data: null,
    isToggled: false,
    selectedLevel: 'lastLevel'
    // Add other shared properties here if needed
});