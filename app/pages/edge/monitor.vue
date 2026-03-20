<script setup lang="ts">

import { ref, watch } from "vue";
import { useOidcAuth } from "~/composables/useOidcAuth";
import { useMainStore } from "@/stores/mainStore";
import type { EdgeInstance } from "~~/server/utils/types";
import monitorDetails from "~/components/monitorDetails.vue";


const { user } = useOidcAuth();
const store = useMainStore()

const edgeInstances = ref<EdgeInstance[]>([])

watch(user, (newUser) => {
    if (newUser?.access_token) {
        fetchInstances()
    }
}, { immediate: true })

async function fetchInstances() {
    if (!user.value?.access_token) return;

    store.setLoadingState(true)
    try {
        let instances = await $fetch<EdgeInstance[]>("/api/edge", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.value.access_token}`
            }
        })
        instances = instances.map(e => {
            e.connected = false
            return e
        })

        edgeInstances.value = instances ?? []
        validateConnection()
    }

    catch (err) {
        console.error("Failed to fetch edge instances:", err)
    }
    finally {
        store.setLoadingState(false)
    }
}

async function validateConnection() {

    for (let el of edgeInstances.value) {
        try {
            let res = await $fetch(`/api/proxy/${el.uid}/v1/connect`, {
                headers: {
                    "Authorization": `Bearer ${user.value?.access_token}`
                }
            }

            )
            if (res) {
                el.connected = true
            }
        } catch (err) {
            console.error(err)
        }

    }

}

function openEvent(event: any) {
    console.log(event)
}

</script>

<template>

    <section>
        <h1>Available Instances</h1>
        <div style="padding: 1%;">

            <Accordion value="0" @update:value="openEvent">
                <AccordionPanel v-for="edgeInstance in edgeInstances" :key="edgeInstance.uid" :value="edgeInstance.name"
                    style="border: 1px solid var(--p-color-2);">
                    <AccordionHeader
                        style="background-color: var(--p-color-1); border-radius: 2px;   border-bottom: 2px solid var(--a-color-prime);">
                        <div class="edge-accord-header">
                            <p>{{ edgeInstance.name }}</p>
                            <span class="edge-header-icon" style="color: var(--a-color-good)"
                                v-if="edgeInstance.connected"><i class="bi bi-link-45deg"></i></span>
                            <span class="edge-header-icon" style="color: var(--a-color-bad);"
                                v-else="edgeInstance.connected"><i class="bi bi-x-square"></i></span>
                        </div>
                    </AccordionHeader>
                    <AccordionContent class="acc-content">
                        <p class="m-0">{{ edgeInstance.name }}</p>
                        <monitorDetails :uid="edgeInstance.uid" :token="user?.access_token"></monitorDetails>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

        </div>


    </section>

</template>

<style>
.edge-accord-header {
    display: flex;
    align-items: center;
    width: 100%;
    color: var(--p-text-color);

}

.edge-accord-header>p {
    padding: 0;
    margin: 0;
}

.edge-header-icon {
    margin-left: auto;
    margin-right: 1%;
}
</style>