const Web3= require('web3')
const ganache= require("ganache-cli")
const assert = require("assert")
const campaignFactoryJSON= require("../ethereum/build/CampaignFactory.json")
const campaignJSON= require("../ethereum/build/Campaign.json")

const web3= new Web3(ganache.provider())

let accounts
let campaignFactory
let campaign

beforeEach(async ()=>{
    accounts= await web3.eth.getAccounts()
    campaignFactory= await new web3.eth.Contract(JSON.parse(campaignFactoryJSON.interface)).deploy({data: campaignFactoryJSON.bytecode}).send({from: accounts[0], gas: "1000000"})
})

describe("campaign contract",()=>{
    it("deploys successfully", ()=>{
        assert.ok(campaignFactory.options.address)
    })
    it("can create campaign", async ()=>{   
        await campaignFactory.methods.createCampaign('5').send({from: accounts[0], gas: "1000000"})
        let campaignList= await campaignFactory.methods.getCampaigns().call()
        campaign= await new web3.eth.Contract(JSON.parse(campaignJSON.interface), campaignList[0])
        assert(campaignList.length==1)
    })
    it("can enter campaign", async()=>{
        await campaign.methods.enterCampaign().send({from: accounts[1], value: '1000'})
        let isApprover= await campaign.methods.approvers(accounts[1]).call()
        assert(isApprover)
    })
})