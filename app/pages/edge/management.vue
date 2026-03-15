<script setup lang="ts">
import { ref, watch } from "vue";
import edgeAddDialog from "~/components/edgeAddDialog.vue";
import removeEdgeDialog from "~/components/removeEdgeDialog.vue";
import { useOidcAuth } from "~/composables/useOidcAuth";
import { useMainStore } from "@/stores/mainStore";
import type { EdgeInstance } from "~~/server/utils/types";

const { user } = useOidcAuth();
const store = useMainStore()

const items = ref([
    {
        label: 'Add',
        icon: 'bi bi-plus',
        command: () => {
            showDialog.value = true
        }
    },

]);

const edgeInstances = ref<EdgeInstance[]>([])

const showDialog = ref(false)
const removeDialogOpts = ref({
    showDialog: false,
    uid: 0,
    name: ""
})
function hide() {
    showDialog.value = false
}
function hideDeleteDialog() {
    removeDialogOpts.value.showDialog = false
    removeDialogOpts.value.uid = 0
    removeDialogOpts.value.name = ""
}

function showRemoveDialog(uid: number, name: string) {
    removeDialogOpts.value.name = name
    removeDialogOpts.value.uid = uid
    removeDialogOpts.value.showDialog = true
}







// Use a watch to fetch instances once the user (and their token) is available
// This handles both client-side navigation and hard reloads (F5)
watch(user, (newUser) => {
    if (newUser?.access_token) {
        fetchInstances()
    }
}, { immediate: true })

async function fetchInstances() {
    if (!user.value?.access_token) return;

    store.setLoadingState(true)
    try {
        const instances = await $fetch<EdgeInstance[]>("/api/edge", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.value.access_token}`
            }
        })
        edgeInstances.value = instances ?? []
    }
    catch (err) {
        console.error("Failed to fetch edge instances:", err)
    }
    finally {
        store.setLoadingState(false)
    }
}

async function deleteInstance(uid: number) {


    store.setLoadingState(true)
    try {
        await $fetch("/api/edge", {
            method: "DELETE",
            params: { uid },
            headers: {
                "Authorization": `Bearer ${user.value?.access_token}`
            }
        })
        removeDialogOpts.value.showDialog = false
        removeDialogOpts.value.uid = 0
        removeDialogOpts.value.name = ""

        await fetchInstances()
    } catch (err) {
        console.error(err)
    } finally {
        store.setLoadingState(false)
    }
}


</script>

<template>
    <div class="menu-bar">
        <Menubar :model="items" />
    </div>
    <edge-add-dialog :visible="showDialog" :token="user?.access_token" @close="hide"
        @success="fetchInstances"></edge-add-dialog>
    <removeEdgeDialog :showDialog="removeDialogOpts.showDialog" :uid="removeDialogOpts.uid"
        :instanceName="removeDialogOpts.name" @deleteInstance="deleteInstance" @cancelAction="hideDeleteDialog">
    </removeEdgeDialog>
    <section class="p-4">
        <h1 class="mb-4">Available Instances</h1>

        <div class="card shadow-sm border-round overflow-hidden">
            <DataTable :value="edgeInstances" tableStyle="min-width: 50rem" class="p-datatable-sm">
                <Column headerStyle="width: 3rem">
                    <template #body>
                        <img src="~/assets/k8s_logo.png" alt="k8s" class="k8s-logo" />
                    </template>
                </Column>
                <Column field="name" header="Name" sortable></Column>
                <Column field="host" header="Host" sortable></Column>
                <Column field="namespace" header="Namespace" sortable></Column>
                <Column field="kube_version" header="Kubernetes Version" sortable></Column>
                <Column field="workflow" header="Selected Workflow" sortable></Column>
                <Column header="Actions" headerStyle="width: 5rem; text-align: center" bodyStyle="text-align: center">
                    <template #body="slotProps">
                        <Button icon="bi bi-trash" class="p-button-rounded p-button-danger p-button-text"
                            @click="showRemoveDialog(slotProps.data.uid, slotProps.data.name)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </section>
</template>

<style scoped>
.k8s-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

:deep(.p-datatable-thead > tr > th) {
    background: var(--p-color-1);
    color: var(--a-color-prime);
    font-weight: 600;
    border-bottom: 2px solid var(--a-color-prime);
}

:deep(.p-datatable-tbody > tr) {
    background: var(--p-background);
    color: var(--p-text-color);
    transition: background-color 0.2s;
}

:deep(.p-datatable-tbody > tr:hover) {
    background: var(--p-color-1) !important;
}

.card {
    background: var(--p-background);
    margin: 1vw;
}

h1 {
    margin-bottom: 2rem;
}
</style>