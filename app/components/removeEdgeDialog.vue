<script setup lang="ts">
const props = defineProps({
    showDialog: Boolean,
    instanceName: String,
    uid: Number
})

const emits = defineEmits([
    "cancelAction",
    "deleteInstance"
]

)



</script>



<template>

    <Dialog :visible=showDialog header="Confirm Delete" :style="{ width: '25rem' }">
        <template #container="{ closeCallback }">
            <div style="width: 100%; display: flex; flex-direction: column; padding: 5%;">
                <p style="font-weight: bolder;">Delete Instance: <span style="font-style: italic;">{{ instanceName
                }}</span></p>
                <div style="display: flex; flex-direction: column">
                    <Button icon="bi bi-trash" style="width: 100%; margin: 1%;" @click="$emit('cancelAction')">Cancel</Button>
                    <Button icon="bi bi-cancel" style="width:100%;  margin: 1%;" class="p-button-danger" @click="$emit('deleteInstance', uid)">Delete</Button>
                </div>
            </div>
        </template>
    </Dialog>

</template>

<style></style>