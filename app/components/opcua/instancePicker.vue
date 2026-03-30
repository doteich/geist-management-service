<script setup="ts">
import { ref } from 'vue';

const props = defineProps({
    instances: Array
})
const selectedInstance = ref({})


const emit = defineEmits(["onInstanceSelect"])



</script>

<template>

    <AccordionPanel style="border: 1px solid var(--p-color-2); border-radius: 4px;" value="0">
        <AccordionHeader class="accordion-header-bar">
            <div class="accordion-header-content">
                <i class="bi bi-1-square"></i>
                <p>Edge Instance</p>
            </div>
        </AccordionHeader>
        <AccordionContent>
            <div class="opcua-form-grid">
                <div class="field-container">
                    <IftaLabel>
                        <Select id="policy" :options="instances" optionLabel="name" v-model="selectedInstance"
                            class="w-full" @value-change="$emit('onInstanceSelect', selectedInstance)" />
                        <label for="policy">Edge Instance</label>
                    </IftaLabel>
                </div>
            </div>
        </AccordionContent>
    </AccordionPanel>
</template>

<style></style>