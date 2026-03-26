<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    token: String,
});

const emit = defineEmits(['close', 'connected']);

const form = ref({
    host: 'localhost',
    port: 4840,
    policy: 'None',
    mode: 'None',
    authentication: 'Anonymous',
    credentials: {
        username: '',
        password: ''
    },
    certificate: {
        certificate: '-----BEGIN CERTIFICATE-----\n-----END CERTIFICATE-----',
        privateKey: '-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----'
    }
});

const policies = ['None', 'Basic128Rsa15', 'Basic256', 'Basic256Sha256'];
const modes = ['None', 'Sign', 'SignAndEncrypt'];
const authOptions = [
    { label: 'Anonymous', value: 'Anonymous' },
    { label: 'Username & Password', value: 'User&Password' }
];

const connecting = ref(false);
const generatingCert = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const showCertFields = computed(() => form.value.policy !== 'None');
const showCredentialFields = computed(() => form.value.authentication === 'User&Password');

async function generateCertificate() {
    generatingCert.value = true;
    errorMessage.value = '';
    try {
        const response = await $fetch<{ cert: string, private: string }>('/api/certificate', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        });
        form.value.certificate.certificate = response.cert;
        form.value.certificate.privateKey = response.private;
        successMessage.value = 'Certificate generated successfully';
        setTimeout(() => successMessage.value = '', 3000);
    } catch (err: any) {
        errorMessage.value = 'Failed to generate certificate: ' + (err.data?.message || err.message);
    } finally {
        generatingCert.value = false;
    }
}

async function connect() {
    connecting.value = true;
    errorMessage.value = '';
    try {
        const response = await $fetch('/api/proxy/7/v1/opcua/connect', {
            method: 'POST',
            body: form.value,
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        });
        emit('connected', response);
        successMessage.value = 'Connected successfully';
    } catch (err: any) {
        errorMessage.value = 'Connection failed: ' + (err.data?.message || err.message);
    } finally {
        connecting.value = false;
    }
}

</script>

<template>
    <AccordionPanel style="border: 1px solid var(--p-color-2); border-radius: 4px;">
        <AccordionHeader class="accordion-header-bar">
            <div class="accordion-header-content">
                <i class="bi bi-2-square"></i>
                <p>Server Connection</p>
            </div>
        </AccordionHeader>
        <AccordionContent>
            <div class="opcua-form-grid">
                <!-- Host and Port -->
                <div class="field-container">
                    <IftaLabel>
                        <InputText id="host" v-model="form.host" class="w-full" />
                        <label for="host">Host</label>
                    </IftaLabel>
                </div>
                <div class="field-container">
                    <IftaLabel>
                        <InputNumber id="port" v-model="form.port" :use-grouping="false" class="w-full" />
                        <label for="port">Port</label>
                    </IftaLabel>
                </div>

                <!-- Policy and Mode -->
                <div class="field-container">
                    <IftaLabel>
                        <Select id="policy" v-model="form.policy" :options="policies" class="w-full" />
                        <label for="policy">Security Policy</label>
                    </IftaLabel>
                </div>
                <div class="field-container">
                    <IftaLabel>
                        <Select id="mode" v-model="form.mode" :options="modes" class="w-full" />
                        <label for="mode">Message Mode</label>
                    </IftaLabel>
                </div>

                <!-- Authentication -->
                <div class="field-container">
                    <IftaLabel>
                        <Select id="auth" v-model="form.authentication" :options="authOptions" optionLabel="label"
                            optionValue="value" class="w-full" />
                        <label for="auth">Authentication</label>
                    </IftaLabel>
                </div>

                <!-- Credentials (Conditional) -->
                <template v-if="showCredentialFields">
                    <div class="field-container">
                        <IftaLabel>
                            <InputText id="username" v-model="form.credentials.username" class="w-full" />
                            <label for="username">Username</label>
                        </IftaLabel>
                    </div>
                    <div class="field-container">
                        <IftaLabel>
                            <Password id="password" v-model="form.credentials.password" :feedback="false" toggleMask
                                fluid />
                            <label for="password">Password</label>
                        </IftaLabel>
                    </div>
                </template>
            </div>

            <!-- Certificate (Conditional) -->
            <div v-if="showCertFields" class="certificate-section">
                <div class="certificate-header mb-3">
                    <span class="font-bold text-lg">Certificate Details</span>
                    <Button label="Generate Self Signed Certificate" icon="bi bi-shield-lock"
                        class="p-button-sm p-button-outlined" :loading="generatingCert" @click="generateCertificate" />
                </div>
                <div class="opcua-form-grid">
                    <div class="field-container ">
                        <IftaLabel>
                            <Textarea id="certificate" v-model="form.certificate.certificate" rows="5" class="w-full" />
                            <label for="certificate">Certificate (PEM)</label>
                        </IftaLabel>
                    </div>
                    <div class="field-container ">
                        <IftaLabel>
                            <Textarea id="privateKey" v-model="form.certificate.privateKey" rows="5" class="w-full" />
                            <label for="privateKey">Private Key (PEM)</label>
                        </IftaLabel>
                    </div>
                </div>
            </div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="success-message ">
                {{ successMessage }}
            </div>

            <div class="form-actions mt-4">
                <Button label="Connect" icon="bi bi-plug" :loading="connecting" @click="connect"
                    class="connect-button" />
            </div>
        </AccordionContent>
    </AccordionPanel>
</template>

<style scoped>
.opcua-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    align-items: start;
    padding: 0.5vh 0.5vw;
}

.field-container {
    display: flex;
    flex-direction: column;
}

.w-full {
    width: 100%;
}

.certificate-section {
    border-top: 1px solid var(--p-color-2);
    padding-top: 1.5rem;
}

.certificate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--p-color-2);
    padding-top: 1.5rem;
}

.error-message {
    color: var(--a-color-bad);
    background-color: rgba(255, 0, 0, 0.05);
    border: 1px solid var(--a-color-bad);
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
}

.success-message {
    color: var(--a-color-good);
    background-color: rgba(7, 172, 27, 0.05);
    border: 1px solid var(--a-color-good);
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
}

.connect-button {
    background-color: var(--a-color-prime);
    border-color: var(--a-color-prime);
    min-width: 120px;
}

.connect-button:hover {
    background-color: var(--a-color-dark-1);
    border-color: var(--a-color-dark-1);
}

:deep(.p-iftalabel) {
    width: 100%;
}

:deep(.p-iftalabel label) {
    color: var(--p-text-color);
    opacity: 0.6;
}

:deep(.p-iftalabel .p-inputtext:focus ~ label),
:deep(.p-iftalabel .p-select:focus ~ label),
:deep(.p-iftalabel .p-inputnumber:focus-within ~ label),
:deep(.p-iftalabel .p-textarea:focus ~ label) {
    color: var(--a-color-prime);
    opacity: 1;
}

:deep(.p-select),
:deep(.p-inputnumber) {
    width: 100%;
}

@media (max-width: 640px) {
    .opcua-form-grid {
        grid-template-columns: 1fr;
    }

    .certificate-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
