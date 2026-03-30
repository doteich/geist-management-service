<script setup lang="ts">

import connectInput from '~/components/opcua/connectInput.vue';
import instancePicker from '~/components/opcua/instancePicker.vue';
import { useOidcAuth } from "~/composables/useOidcAuth";
import { useMainStore } from '#imports';
import type { EdgeInstance } from '~~/server/utils/types';

const { user } = useOidcAuth();
const store = useMainStore()
const instanceId = ref(0)
const instanceSelected = ref(false)

const edgeInstances = ref<EdgeInstance[]>([])

watch(user, (newUser) => {
    if (newUser?.access_token) {
        fetchInstances()
    }
}, { immediate: true })

async function fetchInstances() {
    if (!user.value?.access_token) return;

    store.setLoadingState(true)
    edgeInstances.value = await (await FetchEdgeInstances(user.value?.access_token))
    store.setLoadingState(false)
}

function selectInstance(e: EdgeInstance) {
    
    instanceId.value = e.uid
    instanceSelected.value = true
}

</script>

<template>
    <section>
        <h1>Add new OPC UA Asset</h1>
        <div style="padding: 1%;">
            <Accordion value="0">
                <instance-picker :instances="edgeInstances" @on-instance-select="selectInstance"></instance-picker>
                <connect-input v-if="instanceSelected" :token="user?.access_token" :uid="instanceId"></connect-input>

            </Accordion>
        </div>

    </section>
</template>


<style>
.asset-add-header {
    background-color: var(--p-color-1);
    border-radius: 2px;
    border-bottom: 2px solid var(--a-color-2);
}
</style>
