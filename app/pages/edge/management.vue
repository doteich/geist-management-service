<script setup lang="ts">
import { ref } from "vue";
import edgeAddDialog from "~/components/edgeAddDialog.vue";
import { useOidcAuth } from "~/composables/useOidcAuth";

const { user } = useOidcAuth();


const items = ref([
    {
        label: 'Add',
        icon: 'bi bi-plus',
        command: () => {
            showDialog.value = true
        }
    },
    {
        label: 'Remove',
        icon: 'bi bi-trash'
    }
]);

const showDialog = ref(false)

function hide() {
    showDialog.value = false
}


</script>

<template>
    <div class="menu-bar">
        <Menubar :model="items" />
    </div>
    <edge-add-dialog :visible="showDialog" :token="user?.access_token" @close="hide"></edge-add-dialog>
</template>

<style></style>