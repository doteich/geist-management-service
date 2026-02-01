<script setup lang="ts">
import { ref, computed } from 'vue';



const props = defineProps({
    visible: Boolean,
    token: String
});

defineEmits(["close"]);

interface FormField {
    input: string;
    validator: (value: string) => boolean;
}

interface InputMap {
    name: FormField;
    host: FormField;
    endpoint: FormField;
    namespace: FormField;
    workflow: FormField;
    kubeVersion: FormField;
}

interface ConnectResponse {
    namespace: string,
    kubernetesVersion: string
}


// 2. State: Only holds the inputs and the logic
const data = ref<InputMap>({
    name: {
        input: "",
        validator: (value) => value.length > 4
    },
    host: {
        input: "https://",
        validator: (value) => {
            const re = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z]{2,}))|localhost)(?::\d{2,5})?(?:[/?#]\S*)?$/i
            return re.test(value);
        }
    },
    endpoint: {
        input: "v1/connect",
        validator: (value) => true
    },
    namespace: {
        input: "",
        validator: (value) => value.length > 0 && value.length < 100
    },
    kubeVersion: {
        input: "",
        validator: (value) => value.length > 0 && value.length < 100
    },
    workflow: {
        input: "",
        validator: (value) => value == "Git" || value == "Direct"
    },

});

const connectionIcon = ref("bi bi-arrow-up-square")
const validationClass = ref("")
const saveStatusClass = ref("")


const formValidation = computed(() => {
    const validStatus: Record<string, boolean> = {};
    const keys = Object.keys(data.value) as Array<keyof InputMap>;

    keys.forEach(key => {
        const field = data.value[key];
        validStatus[key] = field.validator(field.input);
    });

    return validStatus as Record<keyof InputMap, boolean>;
});

async function validateConnection() {
    try {
        connectionIcon.value = "bi bi-arrow-repeat"
        const url = `${data.value.host.input}/${data.value.endpoint.input}`
        const res: ConnectResponse = await $fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })

        data.value.kubeVersion.input = res.kubernetesVersion
        data.value.namespace.input = res.namespace
        validationClass.value = "connectionValid"
        connectionIcon.value = "bi bi-check-lg"

    }
    catch (err) {
        connectionIcon.value = "bi bi-x-square"
        validationClass.value = "connectionInvalid"
        data.value.kubeVersion.input = ""
        data.value.namespace.input = ""
        console.error(err)
        setTimeout(() => {
            validationClass.value = ""
            connectionIcon.value = "bi bi-arrow-up-square"
        }, 5000)
    }
}

const canSave = computed(() => {
    return Object.values(formValidation.value).every(isValid => isValid === true);

})

async function saveConnection() {
    const isFormValid = Object.values(formValidation.value).every(isValid => isValid === true);
    if (!isFormValid) {
        return
    }
    try {
        await useFetch('/api/edge', {
            method: 'post',
            body: {},
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })
    }
    catch (err) {
        console.error(err)
    }
}


</script>

<template>

    <div class="edge-form">
        <Drawer :visible="visible" header="Add Instance" position="right" @update:visible="!$event && $emit('close')">
            <IftaLabel>
                <InputText v-model="data.name.input" :class="{ 'validClass': formValidation.name }" fluid />
                <label>Name</label>
            </IftaLabel>

            <IftaLabel class="input-separator">
                <InputText v-model="data.host.input" :class="{ 'validClass': formValidation.host }" fluid />
                <label>Host</label>
            </IftaLabel>

            <IftaLabel class="input-separator">
                <InputText v-model="data.endpoint.input" :class="{ 'validClass': formValidation.endpoint }" fluid
                    disabled />
                <label>Endpoint</label>
            </IftaLabel>


            <Button label="Validate Connection" class="input-separator input-button" fluid :icon="connectionIcon"
                @click="validateConnection" :class="validationClass" />

            <IftaLabel class="input-separator">
                <InputText v-model="data.kubeVersion.input" :class="{ 'validClass': formValidation.kubeVersion }" fluid
                    disabled />
                <label>Kubernetes Version</label>
            </IftaLabel>

            <IftaLabel class="input-separator">
                <InputText v-model="data.namespace.input" :class="{ 'validClass': formValidation.namespace }" fluid
                    disabled />
                <label>Namespace</label>
            </IftaLabel>

            <IftaLabel class="input-separator">
                <Select v-model="data.workflow.input" :options="['Direct', 'Git']" fluid
                    :class="{ 'validClass': formValidation.workflow }" />
                <label>Workflow</label>
            </IftaLabel>

            <Button label="Save Connection" class="input-separator input-button" fluid icon="bi bi-floppy"
                @click="saveConnection" :disabled="!canSave" />

        </Drawer>
    </div>
</template>

<style>
.validClass {
    border-color: green !important;
}

.input-separator {
    margin-top: 1vh;
}

.input-button {
    border-color: var(--p-text-color);
    background-color: var(--p-inputtext-background);
    color: var(--p-text-color);
}

.input-button:hover {
    border-color: var(--a-color-prime) !important;
    background-color: var(--p-inputtext-background) !important;
    color: var(--a-color-prime) !important;

}

.connectionInvalid {
    color: rgb(112, 2, 2);
}

.connectionValid {
    color: rgb(3, 144, 76);
}
</style>