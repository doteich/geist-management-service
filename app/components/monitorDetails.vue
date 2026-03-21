<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Deployment {
    name: string;
    replicas: number;
    readyReplicas: number;
    available: boolean;
}

interface ApiResponse {
    redpanda: Deployment[];
    "Geist-API": Deployment;
    "Geist-Operator": Deployment;
}

const props = defineProps({
    uid: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const deployments = ref<ApiResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(() => {
    getDeployments()
})

async function getDeployments() {
    loading.value = true;
    error.value = null;
    try {
        const res = await $fetch<ApiResponse>(`/api/proxy/${props.uid}/v1/deployments/geist`, {
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        });
        deployments.value = res;
    } catch (e) {
        console.error("Failed to fetch deployments:", e);
        error.value = "Failed to load deployment data";
    } finally {
        loading.value = false;
    }
}

const isNA = (d: Deployment | undefined) => {
    return !d || d.name === "" || (d.replicas === 0 && !d.available);
};

</script>

<template>
    <div class="monitor-details">
        <div v-if="loading" class="state-container">
            <div class="spinner"></div>
            <p>Loading deployment status...</p>
        </div>

        <div v-else-if="error" class="state-container error">
            <p>{{ error }}</p>
            <button @click="getDeployments" class="retry-btn">Retry</button>
        </div>

        <div v-else-if="deployments" class="deployment-groups">
            <!-- Redpanda Group -->
            <div class="group-card">
                <div class="group-header">
                    <img src="@/assets/redpanda.svg" alt="Redpanda" class="group-logo" />
                    <span class="group-title">Redpanda</span>
                </div>
                <div class="group-content">
                    <div v-if="!deployments.redpanda || deployments.redpanda.length === 0" class="na-state">N/A</div>
                    <div v-else v-for="item in deployments.redpanda" :key="item.name" class="deployment-item">
                        <div class="item-info">
                            <span class="item-name">{{ item.name }}</span>
                            <span class="item-status" :class="{ 'status-ok': item.available, 'status-bad': !item.available }">
                                {{ item.readyReplicas }} / {{ item.replicas }}
                            </span>
                        </div>
                        <div class="status-indicator" :class="{ 'bg-good': item.available, 'bg-bad': !item.available }"></div>
                    </div>
                </div>
            </div>

            <div class="group-card">
                <div class="group-header">
                    <div class="logo-container">
                        <span class="logo-small">G</span>
                    </div>
                    <span class="group-title">Geist-Operator</span>
                </div>
                <div class="group-content">
                    <div v-if="isNA(deployments['Geist-Operator'])" class="na-state">N/A</div>
                    <div v-else class="deployment-item">
                        <div class="item-info">
                            <span class="item-name">{{ deployments['Geist-Operator'].name }}</span>
                            <span class="item-status" :class="{ 'status-ok': deployments['Geist-Operator'].available, 'status-bad': !deployments['Geist-Operator'].available }">
                                {{ deployments['Geist-Operator'].readyReplicas }} / {{ deployments['Geist-Operator'].replicas }}
                            </span>
                        </div>
                        <div class="status-indicator" :class="{ 'bg-good': deployments['Geist-Operator'].available, 'bg-bad': !deployments['Geist-Operator'].available }"></div>
                    </div>
                </div>
            </div>


            <div class="group-card">
                <div class="group-header">
                    <div class="logo-container">
                        <span class="logo-small">G</span>
                    </div>
                    <span class="group-title">Geist-API</span>
                </div>
                <div class="group-content">
                    <div v-if="isNA(deployments['Geist-API'])" class="na-state">N/A</div>
                    <div v-else class="deployment-item">
                        <div class="item-info">
                            <span class="item-name">{{ deployments['Geist-API'].name }}</span>
                            <span class="item-status" :class="{ 'status-ok': deployments['Geist-API'].available, 'status-bad': !deployments['Geist-API'].available }">
                                {{ deployments['Geist-API'].readyReplicas }} / {{ deployments['Geist-API'].replicas }}
                            </span>
                        </div>
                        <div class="status-indicator" :class="{ 'bg-good': deployments['Geist-API'].available, 'bg-bad': !deployments['Geist-API'].available }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.monitor-details {
    padding: 1.5rem;
    color: var(--p-text-color);
}

.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 1rem;
}

.error {
    color: var(--a-color-bad);
}

.retry-btn {
    background: var(--a-color-prime);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.deployment-groups {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.group-card {
    background: var(--p-color-1);
    border: 1px solid var(--p-color-2);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.group-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--p-color-2);
    border-bottom: 1px solid var(--p-color-1);
}

.group-logo {
    width: 25px;
    height: 25px;
}

.logo-container {
    width: 32px;
    height: 32px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-small {
    color: var(--p-text-color);
    font-weight: bold;
    font-family: 'Zen Dots', sans-serif;
    font-size: 1.3rem;
}

.group-title {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--p-text-color);
}

.group-content {
    padding: 1rem;
}

.deployment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid var(--p-color-2);
}

.deployment-item:last-child {
    border-bottom: none;
}

.item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.item-name {
    font-size: 0.9rem;
    font-weight: 500;
    font-family: monospace;
}

.item-status {
    font-size: 0.8rem;
    font-weight: 700;
}

.status-ok {
    color: var(--a-color-good);
}

.status-bad {
    color: var(--a-color-bad);
}



.na-state {
    text-align: center;
    padding: 1rem;
    color: #888;
    font-style: italic;
    font-weight: bold;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid var(--p-color-2);
    border-top: 3px solid var(--a-color-prime);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>