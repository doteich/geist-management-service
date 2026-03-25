<script setup lang="ts">

import { ref, watch } from "vue";
import { useOidcAuth } from "~/composables/useOidcAuth";
import { useMainStore } from "@/stores/mainStore";
import type { EdgeInstance } from "~~/server/utils/types";
import monitorDetails from "~/components/monitorDetails.vue";
import auth from "~/middleware/auth";

const { user } = useOidcAuth();
const store = useMainStore()

const edgeInstances = ref<EdgeInstance[]>([])


definePageMeta({middleware: auth})

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
                        <img src="~/assets/k8s_logo.png" alt="k8s" class="k8s-logo" />
                        <div class="edge-accord-header">

                            
                            <p>{{ edgeInstance.name }}</p>

                            <div class="status-indicator edge-header-icon"
                                :class="{ 'bg-good': edgeInstance.connected, 'bg-bad': !edgeInstance.connected }"></div>
                        </div>
                    </AccordionHeader>
                    <AccordionContent class="acc-content">
                        <monitorDetails :uid="edgeInstance.uid" :token="user?.access_token "></monitorDetails>
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
    margin-left: 1vw ;
}

.edge-header-icon {
    margin-left: auto;
    margin-right: 1%;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.bg-good {
    background-color: var(--a-color-good);
}

.bg-bad {
    background-color: var(--a-color-bad);
}
</style>