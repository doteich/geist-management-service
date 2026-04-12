<script setup="ts">
import { ref } from 'vue';

const props = defineProps({
    instances: Array
})
const selectedInstance = ref({})
const isSelected = ref(false)

const emit = defineEmits(["onInstanceSelect"])

const selectInstance = () => { 
    selectedInstance.value != "" ? isSelected.value = true : isSelected.value = false
    emit('onInstanceSelect', selectedInstance.value)
}



</script>

<template>

    <AccordionPanel style="border: 1px solid var(--p-color-2); border-radius: 4px;" value="0">
        <AccordionHeader class="accordion-header-bar">
            <div class="accordion-header-content">
                <i class="bi bi-1-square"></i>
                <p class="asset-add-header-text">Edge Instance</p>
                <i class="bi bi-check2" style="color: green; font-size: larger;" v-if="isSelected"></i>
            </div>
        </AccordionHeader>
        <AccordionContent>
            <div class="opcua-form-grid">
                <div class="field-container">
                    <IftaLabel>
                        <Select id="policy" :options="instances" optionLabel="name" v-model="selectedInstance"
                            class="w-full" @value-change="selectInstance" />
                        <label for="policy">Edge Instance</label>
                    </IftaLabel>
                </div>
            </div>


        </AccordionContent>
    </AccordionPanel>
</template>

<style></style>