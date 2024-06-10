import { ethers } from 'ethers';

interface GeneratedEthPkResult {
  publicKey: string;
  address: string;
}

// generate eth pk
function generatePublicKeys(): GeneratedEthPkResult[] {
    const generatedKeyPairs:GeneratedEthPkResult[] = [] 

  for (let i = 0; i < 10; i++) {
    const wallet = ethers.Wallet.createRandom();
    const result: GeneratedEthPkResult = {address:wallet.address, publicKey:wallet.publicKey}
    generatedKeyPairs.push(result)
  }

  return generatedKeyPairs
}

// encode into ecdsa
function encodePublicKeyToECDSA(publicKey: string): string {
  if (publicKey.startsWith('0x')) {
    publicKey = publicKey.slice(2);
  }

  const publicKeyBuffer = Buffer.from(publicKey, 'hex');
  if (publicKeyBuffer.length !== 33) {
    throw new Error('Invalid public key length.');
  }

  const ecdsaPublicKey = Buffer.concat([Buffer.from([0x04]), publicKeyBuffer]);

  return ecdsaPublicKey.toString('hex');
}
// verify the validity of generated ecdsa
// decode from ecdsa to eth pk
function decodeECDSAToPublicKey(ecdsa:string):string{
    if(ecdsa.startsWith('0x')){
        ecdsa= ecdsa.slice(2);
    }

    const ecdsaBuffer = Buffer.from(ecdsa,'hex')
    if(ecdsaBuffer.length!==34){
        throw new Error('Invalid ECDSA public key format')
    }

    const publicKeyBuffer = ecdsaBuffer.slice(1)
    return `0x${publicKeyBuffer.toString('hex')}`
}
// convert to avn k

function main(): void {
  const generatedKeyPairs:GeneratedEthPkResult[] = generatePublicKeys();
  const publicKeys = generatedKeyPairs.map(gpk=>gpk.publicKey)
  const ecdsaSignatures: string[] = [];
  for (const pk of publicKeys) {
    ecdsaSignatures.push(encodePublicKeyToECDSA(pk));
  }
  console.log({ecdsaSignatures})
  const recoveredPublicKeys = ecdsaSignatures.map(decodeECDSAToPublicKey)
  console.log({recoveredPublicKeys, publicKeys})
}

main();
