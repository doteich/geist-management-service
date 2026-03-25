<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    }
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
        certificate: '',
        privateKey: ''
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
        const response = await $fetch<{ certificate: string, privateKey: string }>('/api/opcua/generate-cert', {
            method: 'POST'
        });
        form.value.certificate.certificate = response.certificate;
        form.value.certificate.privateKey = response.privateKey;
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
        const response = await $fetch('/api/opcua/connect', {
            method: 'POST',
            body: form.value
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
    <div class="opcua-connect">
        <Card>
            <template #title>
                <div class="flex align-items-center">
                    <i class="bi bi-link-45deg mr-2"></i>
                    <span>Connect to OPC UA Server</span>
                </div>
            </template>
            <template #content>
                <div class="grid formgrid p-fluid">
                    <!-- Host and Port -->
                    <div class="field col-12 md:col-8">
                        <IftaLabel>
                            <InputText id="host" v-model="form.host" />
                            <label for="host">Host</label>
                        </IftaLabel>
                    </div>
                    <div class="field col-12 md:col-4">
                        <IftaLabel>
                            <InputNumber id="port" v-model="form.port" :use-grouping="false" />
                            <label for="port">Port</label>
                        </IftaLabel>
                    </div>

                    <!-- Policy and Mode -->
                    <div class="field col-12 md:col-6">
                        <IftaLabel>
                            <Select id="policy" v-model="form.policy" :options="policies" />
                            <label for="policy">Security Policy</label>
                        </IftaLabel>
                    </div>
                    <div class="field col-12 md:col-6">
                        <IftaLabel>
                            <Select id="mode" v-model="form.mode" :options="modes" />
                            <label for="mode">Message Mode</label>
                        </IftaLabel>
                    </div>

                    <!-- Authentication -->
                    <div class="field col-12">
                        <IftaLabel>
                            <Select id="auth" v-model="form.authentication" :options="authOptions" optionLabel="label" optionValue="value" />
                            <label for="auth">Authentication</label>
                        </IftaLabel>
                    </div>

                    <!-- Credentials (Conditional) -->
                    <template v-if="showCredentialFields">
                        <div class="field col-12 md:col-6">
                            <IftaLabel>
                                <InputText id="username" v-model="form.credentials.username" />
                                <label for="username">Username</label>
                            </IftaLabel>
                        </div>
                        <div class="field col-12 md:col-6">
                            <IftaLabel>
                                <Password id="password" v-model="form.credentials.password" :feedback="false" toggleMask fluid />
                                <label for="password">Password</label>
                            </IftaLabel>
                        </div>
                    </template>

                    <!-- Certificate (Conditional) -->
                    <template v-if="showCertFields">
                        <div class="field col-12">
                            <div class="flex justify-content-between align-items-center mb-2">
                                <label class="font-bold">Certificate Details</label>
                                <Button label="Auto-generate Self-signed" icon="bi bi-shield-lock" 
                                        class="p-button-sm p-button-outlined" 
                                        :loading="generatingCert"
                                        @click="generateCertificate" />
                            </div>
                            <div class="grid">
                                <div class="field col-12">
                                    <IftaLabel>
                                        <Textarea id="certificate" v-model="form.certificate.certificate" rows="5" autoResize />
                                        <label for="certificate">Certificate (PEM)</label>
                                    </IftaLabel>
                                </div>
                                <div class="field col-12">
                                    <IftaLabel>
                                        <Textarea id="privateKey" v-model="form.certificate.privateKey" rows="5" autoResize />
                                        <label for="privateKey">Private Key (PEM)</label>
                                    </IftaLabel>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <div v-if="errorMessage" class="error-message mb-3">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="success-message mb-3">
                    {{ successMessage }}
                </div>
            </template>
            <template #footer>
                <div class="flex justify-content-end">
                    <Button label="Cancel" icon="bi bi-x-lg" class="p-button-text mr-2" @click="$emit('close')" />
                    <Button label="Connect" icon="bi bi-plug" :loading="connecting" @click="connect" class="connect-button" />
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.opcua-connect {
   
    margin: 2rem 2rem;
}

.field {
    margin-bottom: 1.5rem;
}

.error-message {
    color: var(--a-color-bad);
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid var(--a-color-bad);
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.success-message {
    color: var(--a-color-good);
    background-color: rgba(7, 172, 27, 0.1);
    border: 1px solid var(--a-color-good);
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.connect-button {
    background-color: var(--a-color-prime);
    border-color: var(--a-color-prime);
}

.connect-button:hover {
    background-color: var(--a-color-dark-1);
    border-color: var(--a-color-dark-1);
}

:deep(.p-iftalabel label) {
    color: var(--p-text-color);
    opacity: 0.6;
}

:deep(.p-iftalabel .p-inputtext:focus ~ label),
:deep(.p-iftalabel .p-select:focus ~ label) {
    color: var(--a-color-prime);
    opacity: 1;
}
</style>
