
import type { EdgeInstance } from "~~/server/utils/types";

export async function FetchEdgeInstances(token: string): Promise<EdgeInstance[]> {
  
    try {
        const instances = await $fetch<EdgeInstance[]>("/api/edge", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return instances
    }
    catch (err) {
        console.error("Failed to fetch edge instances:", err)
        return []
    }
    
}