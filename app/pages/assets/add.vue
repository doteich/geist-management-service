<script setup lang="ts">
import { connect } from 'node:http2';
import connectInput from '~/components/opcua/connectInput.vue';
import { useOidcAuth } from "~/composables/useOidcAuth";

const { user } = useOidcAuth();

</script>

<template>
    <section>
        <h1>Add new OPC UA Asset</h1>
        <div style="padding: 1%;">
            <Accordion value="0">

                <connect-input :token="user?.access_token"></connect-input>

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
