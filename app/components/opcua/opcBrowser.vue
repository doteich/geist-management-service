<script setup lang="ts">
import { computed, ref } from "vue"

interface browseEntry {
    id: string,
    nodeId: string,
    browseName: string,
    displayName: string,
    nodeClass: string,
    dataType: string,
    nodes?: Array<browseEntry>,
    expanded?: boolean,
    loading?: boolean
}

const props = defineProps({
    session: String,
    uid: Number,
    token: String,
})

const emit = defineEmits(['add-node'])

const nodes = ref<browseEntry[]>([{
    id: "0",
    "nodeId": "i=84",
    "browseName": "Root",
    "displayName": "Root",
    "nodeClass": "NodeClassObject",
    "dataType": "Object",
    nodes: [],
    expanded: false,
    loading: false
}])

async function toggleNode(node: browseEntry) {
    if (node.nodeClass !== 'NodeClassObject') return;

    node.expanded = !node.expanded;


    if (node.expanded && (!node.nodes || node.nodes.length === 0)) {
        node.loading = true
        try {
            const response: any = await $fetch(`/api/proxy/${props.uid}/v1/opcua/browse`, {
                method: 'POST',
                body: {
                    "uuid": props.session,
                    "nodeId": node.nodeId
                },
                headers: {
                    "Authorization": `Bearer ${props.token}`
                }
            });

            node.nodes = response.nodes?.map((el: any, index: number) => ({
                ...el,
                id: node.id + `.${index}`,
                nodes: [],
                expanded: false,
                loading: false
            })) || []
        } catch (err: any) {
            console.error("Browse failed:", err)
        } finally {
            node.loading = false
        }
    }
}

const browseResults = computed(() => {
    const result: browseEntry[] = []
    function flatten(arr: browseEntry[]) {
        for (let entry of arr) {
            result.push(entry)
            if (entry.expanded && entry.nodes && entry.nodes.length > 0) {
                flatten(entry.nodes)
            }
        }
    }
    flatten(nodes.value)
    return result
})

function addVariable(node: browseEntry) {
    if (node.nodeClass === 'NodeClassVariable') {
        emit('add-node', node)
    }
}
</script>

<template>
    <AccordionPanel style="border: 1px solid var(--p-color-2); border-radius: 4px; margin-top: 1%;" value="2">
        <AccordionHeader class="accordion-header-bar">
            <div class="accordion-header-content">
                <i class="bi bi-3-square"></i>
                <p>OPC UA Nodes</p>
            </div>
        </AccordionHeader>
        <AccordionContent>
            <div class="browser">
                <div v-for="node in browseResults" :key="node.id" class="browse-node" :class="{
                    'expanded': node.expanded,
                    'variable-node': node.nodeClass === 'NodeClassVariable',
                    'object-node': node.nodeClass === 'NodeClassObject'
                }" :style="{ 'padding-left': (node.id.split('.').length - 1) * 20 + 12 + 'px' }"
                    @click="node.nodeClass === 'NodeClassObject' ? toggleNode(node) : addVariable(node)">

                    <div class="icon-section">
                        <i v-if="node.nodeClass === 'NodeClassObject'" class="bi"
                            :class="node.loading ? 'bi-arrow-repeat spin' : (node.expanded ? 'bi-chevron-down' : 'bi-chevron-right')">
                        </i>
                        <i v-else class="bi bi-dot leaf-dot"></i>
                    </div>

                    <div class="browse-node-content">
                        <i v-if="node.nodeClass === 'NodeClassObject'" class="bi bi-folder2 folder-icon"></i>
                        <i v-else class="bi bi-hash variable-icon"></i>

                        <span class="node-name">{{ node.browseName }}</span>

                        <div v-if="node.nodeClass === 'NodeClassVariable'" class="variable-details">
                            <span class="datatype" v-if="node.dataType">{{ node.dataType }}</span>
                            <Button icon="bi bi-plus" size="small" text rounded class="add-button"
                                @click.stop="addVariable(node)" />
                        </div>
                    </div>
                </div>

                <div v-if="nodes[0].loading && !nodes[0].expanded" class="loading-state">
                    <i class="bi bi-arrow-repeat spin"></i>
                    <span>Connecting to server...</span>
                </div>
            </div>
        </AccordionContent>
    </AccordionPanel>
</template>

<style scoped>
.browser {
    max-height: 500px;
    overflow-y: auto;
    padding: 8px 0;
    background: var(--p-background);
    border-radius: 4px;
}

.browse-node {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    margin: 1px 6px;
    user-select: none;
}

.browse-node:hover {
    background-color: var(--p-color-1);
}

.icon-section {
    width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 6px;
    color: var(--p-text-color);
    opacity: 0.6;
}

.leaf-dot {
    opacity: 0.3;
    font-size: 1.2rem;
}

.browse-node-content {
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 10px;
    min-width: 0;
}

.folder-icon {
    color: var(--a-color-prime);
    font-size: 1.1rem;
}

.variable-icon {
    color: var(--a-color-good);
    font-size: 1.1rem;
}

.node-name {
    font-size: 0.95rem;
    color: var(--p-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.variable-node:hover .node-name {
    color: var(--a-color-prime);
}

.variable-details {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
}

.datatype {
    font-size: 0.7rem;
    padding: 2px 8px;
    background: var(--p-color-2);
    border-radius: 12px;
    color: var(--p-text-color);
    font-family: monospace;
    opacity: 0.8;
}

.add-button {
    opacity: 0;
    transition: opacity 0.2s;
    width: 28px !important;
    height: 28px !important;
}

.variable-node:hover .add-button {
    opacity: 1;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    gap: 12px;
    color: var(--p-text-color);
    opacity: 0.5;
}

/* Custom Scrollbar */
.browser::-webkit-scrollbar {
    width: 6px;
}

.browser::-webkit-scrollbar-track {
    background: transparent;
}

.browser::-webkit-scrollbar-thumb {
    background: var(--p-color-2);
    border-radius: 10px;
}

.browser::-webkit-scrollbar-thumb:hover {
    background: var(--a-color-prime);
}
</style>
