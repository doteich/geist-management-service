
import { off } from 'node:cluster'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { run } from 'node:test'
const runtimeConfig = useRuntimeConfig()


export const isSafeUrl = async (urlStr: string) => {
  try {
    const url = new URL(urlStr)
    
  
    if (!['http:', 'https:'].includes(url.protocol)) return false
    let ip = url.hostname
    if (!isIP(url.hostname)) {
      const res = await lookup(url.hostname)
      ip = res.address
    }
  
    // 3. Block Private/Reserved Ranges
    return !isPrivateIP(ip)
  } catch {
    return false
  }
}

function isPrivateIP(ip: string) {
  if(runtimeConfig.allowLocalhost){
    return false
  }

  const privatePatterns = [
    /^127\./,               // IPv4 loopback
    /^10\./,                // RFC1918
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // RFC1918
    /^192\.168\./,          // RFC1918
    /^169\.254\./,          // Link-local (Cloud Metadata)
    /^::1$/,                // IPv6 loopback
    /^fe80:/,               // IPv6 link-local
    /^fc00:/,               // IPv6 unique local addr
  ]
  return privatePatterns.some(pattern => pattern.test(ip))
}