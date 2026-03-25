import selfsigned from "selfsigned"

export default defineEventHandler(async (event) => {

    const attrs = [{ name: 'commonName', value: 'geist-iot.com' }];
    const pems = await selfsigned.generate(attrs);

    return pems
})