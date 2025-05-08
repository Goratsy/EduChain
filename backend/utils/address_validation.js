export function isAddress(web3, universityAddress) {
    return !web3.utils.isAddress(universityAddress)
}