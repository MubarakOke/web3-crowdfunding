const path = require('path')
const fs = require('fs-extra')
const solc= require('solc')

const contractPath= path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source= fs.readFileSync(contractPath, 'utf8')
const buildPath= path.resolve(__dirname, 'build')
fs.removeSync(buildPath)
const compiledContracts= solc.compile(source, 1).contracts
fs.ensureDirSync(buildPath)

for (let contract in compiledContracts){
    fs.outputJsonSync(path.resolve(buildPath, contract.replace(":","") +'.json'), compiledContracts[contract])
}