<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    token: String,
    uid: Number

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
        // certificate: '-----BEGIN CERTIFICATE-----\n-----END CERTIFICATE-----',
        // privateKey: '-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----'
        privateKey: `-----BEGIN PRIVATE KEY-----
MIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCRDPC+c8XtV5wm
df6iBbSzziH/Q78w1TKL2kYw71Cr8P2ntgXTG91Q6IZplqDx+wENnHtqdFfh1dBM
ZPQQMWypr54+ejgJ95TNQv0t6Po2lBGS7bu1qV3WSgEIfIfJyZ+p5c4QMOR+XwSJ
k1m+YhWXpuFhExLm2frmQ/H1m9ztl3NiErMx+s20WM5N1K2HHT3HyFVTIt7TnQOn
dpm3Wf5GZ1Mhksprm/dfUuKT1Z+iGCnGWP44GqH9NfjIdocRpMwAmT5uV4CweZVO
FV8YthWkBzubB1gKjLsdpPWWmvdV6qFVAxPdLGILaDHfek5kWbQf9LUGWXiTunU0
Gdjpch85AgMBAAECgf9kvZgQR/HJGNzBDMwAIfZe6v6xscIX9S2/jaZliWpKza73
zA1yxOeKsFqqLibNHIdrhkL938/2b/AIUhUwXSNOUHdkIEsx1CiEzWg9FCvm71YS
HD4PU8U+3CcOvdUq6kQtIgfI0JKuZU/BcGJKcW6NsfM83wJ07ImIlttCU5e3BKBP
R+zNVRhQrjaT2FJe7iLlBECx3/WLphY13RgyvP2EWE3kSFJFYgC7c/Tjso+/aLVy
czA0T8zmgMzs7hlSeoMzjTQdv7GCwl1mQYY9fTDiXkniu8JxOTKQonmNu7Svhyvv
tdbYhQVj2WKz6BH+86aXtaL/smyI+F3YlSq0rvUCgYEAxv6StTtYWCnENgWeMHPE
BDzqUorDhncZo2vNMruZdPXRwKZFNmQNUS6kfjO3mlNy6p1oCNb8PAanbYoW3DXA
IjeWqeaqYxqUURqTcDIWI2Y3tuFM/dztxn+G0Ozsesoun3TyHRR2whvRTS9C8l4i
QV6kTz2u/tilONSDsZytzlsCgYEAuppYx2stZ/BEWyZv8D0HSeuw4FrDMOGKh0+a
Ru4rrPFchlWZSz3VGA7ouIs75Ucza2z1zY/psa4g+OqtGDXFOabwJLPNpERTcp92
z/NGofAedaxzKPio+hsMO23GA5LigxQR3O40O5EJQArK1fk5+QbFRMzK+450+0Uq
uXVMJPsCgYANDBoAagCz3yEvTZT+pkh+4qOWf+SsB1kV/vZ4UhaQtaFoGT7Gfy7k
WMOORsPOCZSqT2HH2pi1MtZ9dyVikN+lHrHxN9+KGe8Jlk1+eLo83fHfOsx6hKbO
cgQb5LzonCMMb3WEdJgIyBwkDGo+S+/BC3yIeYnkyb2jiUONPLGkqwKBgC6+dVjX
J1OvI2B1+3qBvy6sRO2eruCyzwHgVfRIu1YiTBw2myT3A0d4jKGV91YTBPV3IQfy
cgcZaJcSKnQzHAm6INQA2pW4q/K9sYScG2h7fxXZMivkRmgImILWl9DTXbyaLXNb
lGgLh/ar/W2mdfhE0uvOJVbos7Mx+2bj1EQ7AoGAOfmdz5LLOP6nMTjA24Nz68yk
2LayDtreJYlI/uyyJbpRGuSJqcX4PrIQRL2Jgf0fT/bNkkjNXJQv0jkVUAOTXSoN
5XGP3LrVG+AX0XGhJWpQV68imQY9z1o1/JdPjpn97GDoousZ0jZuK8pkagfVMWhO
hNk/s2LUqjpnXnjU/2c=
-----END PRIVATE KEY-----
`,
        certificate: `-----BEGIN CERTIFICATE-----
MIIDEjCCAfqgAwIBAgIIcd/OUCLz8yQwDQYJKoZIhvcNAQELBQAwGDEWMBQGA1UE
AxMNZ2Vpc3QtaW90LmNvbTAeFw0yNjA0MDQxMTMxNDZaFw0yNzA0MDQxMTMxNDZa
MBgxFjAUBgNVBAMTDWdlaXN0LWlvdC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQCRDPC+c8XtV5wmdf6iBbSzziH/Q78w1TKL2kYw71Cr8P2ntgXT
G91Q6IZplqDx+wENnHtqdFfh1dBMZPQQMWypr54+ejgJ95TNQv0t6Po2lBGS7bu1
qV3WSgEIfIfJyZ+p5c4QMOR+XwSJk1m+YhWXpuFhExLm2frmQ/H1m9ztl3NiErMx
+s20WM5N1K2HHT3HyFVTIt7TnQOndpm3Wf5GZ1Mhksprm/dfUuKT1Z+iGCnGWP44
GqH9NfjIdocRpMwAmT5uV4CweZVOFV8YthWkBzubB1gKjLsdpPWWmvdV6qFVAxPd
LGILaDHfek5kWbQf9LUGWXiTunU0Gdjpch85AgMBAAGjYDBeMAsGA1UdDwQEAwIC
9DAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDwYDVR0TAQH/BAUwAwEB
/zAfBgNVHREEGDAWhhR1cm46Z2Vpc3QtaW90OmNsaWVudDANBgkqhkiG9w0BAQsF
AAOCAQEATsfpoMXzlg62ysewx9zFsdtZ6fL/pWST7123MMnLR8/T7GYBJe96cmxA
QJt/9K7wwVGrvqNY3K9ecKmnJVBSE7v5AdyEu+ViS/aBbBaP/sBRqd1YrRQiG1Cz
q9tvzJtFKthnyPzNLV2a/cmShs7kt+r+RliPXE/bZq/p+A/1HqN+GjKY9NgsD9j/
XLBkKy52hNhj/sLuWNBzR9KXSqmKDbAIVHJZ9fGmYUXiaP4+zBMG2xmKXN+Wiqv/
/2GdqHHkbJx4aqvOkHJSP8jFU2WGwIGdNQ5pokytxbgJA3qp3RXblZzLxFnmh5UG
NEDF/wwefrbMtElGtO46SWOupdTn0w==
-----END CERTIFICATE-----`
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
const isSelected = ref(false)


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
        const response = await $fetch(`/api/proxy/${props.uid}/v1/opcua/connect`, {
            method: 'POST',
            body: form.value,
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        });
        isSelected.value = true
        emit('connected', response?.uuid);
        successMessage.value = 'Connected successfully';
    } catch (err: any) {
        isSelected.value = false
        errorMessage.value = 'Connection failed: ' + (err.data?.message || err.message);
    } finally {
        connecting.value = false;
    }
}

</script>

<template>
    <AccordionPanel style="border: 1px solid var(--p-color-2); border-radius: 4px; margin-top: 1%;" value="1">
        <AccordionHeader class="accordion-header-bar">
            <div class="accordion-header-content">
                <i class="bi bi-2-square"></i>
                <p>Server Connection</p>
                <i class="bi bi-check2" style="color: green; font-size: larger;" v-if="isSelected"></i>
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

<style>
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
