import selfsigned from "selfsigned"

export default defineEventHandler(async (event) => {

    const attrs = [{ name: 'commonName', value: 'geist-iot.com' }];
    const pems = await selfsigned.generate(attrs, {
        extensions: [
            {
                name: 'keyUsage',
                digitalSignature: true,
                nonRepudiation: true,
                keyEncipherment: true,
                dataEncipherment: true,
                keyCertSign: true,
            },
            {
                name: 'extKeyUsage',
                serverAuth: true,           // TLS server authentication
                clientAuth: true,           // TLS client authentication
            },
            {
                name: 'basicConstraints',
                cA: true,
                critical: true
            },
            {
                name: 'subjectAltName',
                altNames: [{ type: 6, value: 'urn:geist-iot:client' }] // Type 6 is URI
            }

        ]
    });

    return pems
})