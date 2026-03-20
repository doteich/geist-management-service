<script setup lang="ts">
import { ref, computed } from 'vue';



const props = defineProps({
    visible: Boolean,
    token: String
});

const emit = defineEmits(["close", "success"]);

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
const errorMessage = ref("")


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
        const url = `${data.value.host.input}`
        const response = await $fetch('/api/validate-edge', {
            method: 'POST',
            body: { url: url },
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })

        data.value.kubeVersion.input = response.metadata.version
        data.value.namespace.input = response.metadata.namespace
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
    errorMessage.value = "";
    saveStatusClass.value = "";
    const isFormValid = Object.values(formValidation.value).every(isValid => isValid === true);
    if (!isFormValid) {
        return
    }
    try {
        await $fetch('/api/edge', {
            method: 'post',
            body: {
                name: data.value.name.input,
                host: data.value.host.input,
                namespace: data.value.namespace.input,
                workflow: data.value.workflow.input,
                kubeVersion: data.value.kubeVersion.input
            },
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })
        saveStatusClass.value = "saveSuccess"
        setTimeout(() => {
            emit("success")
            emit("close")
            saveStatusClass.value = ""
        }, 1000)
    }
    catch (err: any) {
        console.error(err)
        saveStatusClass.value = "saveError"
        errorMessage.value = err.data?.message || err.message || "Failed to save connection"
    }
}
// {body.name}, ${body.host}, ${body.namespace}, ${body.workflow}, ${body.kubeVersion}

</script>

<template>

    <div class="edge-form">
        <Drawer :visible="visible" header="Add Instance" position="right" @update:visible="!$event && $emit('close')"
            :pt="{ content: { style: 'height: 100%; display: flex; flex-direction: column;' } }">

            <div class="drawer-fields">
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
                    <InputText v-model="data.kubeVersion.input" :class="{ 'validClass': formValidation.kubeVersion }"
                        fluid disabled />
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
                    @click="saveConnection" :disabled="!canSave" :class="saveStatusClass" />
            </div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

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
    color: var(--a-color-bad);
}

.connectionValid {
    color: var(--a-color-good);
}

.saveError {
    color: var(--a-color-bad) !important;
    border-color: var(--a-color-bad) !important;
}

.saveSuccess {
    color: var(--a-color-good) !important;
    border-color: var(--a-color-good) !important;
}

.drawer-fields {
    flex-grow: 1;
}

.error-message {
    color: #720202;
    background-color: #fce4e4;
    border: 1px solid #f5c6cb;
    padding: 1rem;
    margin-top: 2vh;
    border-radius: 4px;
    font-size: 0.9rem;
    text-align: center;
}
</style>