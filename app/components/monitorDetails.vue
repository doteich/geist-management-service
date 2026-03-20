<script setup lang="ts">
import { onMounted } from 'vue';


const props = defineProps({
    uid: Number,
    token: String
})

const crds = ref("")


onMounted(() => {
    getCRDS()
})

async function getCRDS() {
    let res = await $fetch(`/api/proxy/${props.uid}/v1/crds`, {
        headers: {
            "Authorization": `Bearer ${props.token}`
        }
    })

    crds.value = res

}


</script>

<template>
    <section>
        {{ crds }}
    </section>

</template>

<style></style>