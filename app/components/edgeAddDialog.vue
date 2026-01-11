<script setup lang="ts">

const props = defineProps(
    {
        visible: Boolean,
    }
)

defineEmits(["close"])

interface FormField {
    isValid: boolean;
    input: string;
    validator: (value: string) => boolean;
}

interface MyFormData {
    name: FormField;
    url: FormField;
    description: FormField;
}

const data = ref<MyFormData>({
    name: {
        isValid: false,
        input: "",
        validator: (value) => value.length > 4
    },
    url: {
        isValid: false,
        input: "https://",
        validator: (value) => {
            const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
            return re.test(value);
        }
    },
    description: {
        isValid: false,
        input: "",
        validator: (value) => value.length > 0 && value.length < 100
    }
});

// Generic Watcher
watch(data, (newData) => {
    for (const key in newData) {
        const field = newData[key];
        // Run validation logic automatically
        field.isValid = field.validator(field.input);
    }
}, { deep: true });


</script>

<template>
    <p>{{ visible }}</p>
    <div class="edge-form">
        <Drawer :visible="visible" header="Add Instance" position="right" @update:visible="!$event && $emit('close')">
            <IftaLabel>
                <InputText v-model="data.name.input" :class="{ 'validClass': data.name.isValid }" fluid/>
                <label>Name</label>
            </IftaLabel>

            <IftaLabel>
                <InputText v-model="data.url.input" :class="{ 'validClass': data.url.isValid }" fluid/>
                <label>URL</label>
            </IftaLabel>

        </Drawer>

    </div>

</template>


<style>
.validClass {
    border-color: green !important;
}
</style>