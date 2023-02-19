pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public campaigns;

    function createCampaign(uint minimum) public{
        address campaign= new Campaign(minimum, msg.sender);
        campaigns.push(campaign);
    }

    function getCampaigns() public view returns(address[]){
        return campaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        address receiver;
        uint amount;
        bool completed;
        mapping(address=>bool) approvals;
        uint approvalsCount; 
    }

    address public manager;
    mapping(address=>bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    uint minimumAmount;

    modifier onlyCampaignManger(){
        require(msg.sender==manager);
        _;
    }

    function Campaign(uint minimum, address sender) public{
        manager= sender;
        minimumAmount= minimum;
    }

    function enterCampaign() public payable{
        require(msg.value>minimumAmount);
        approvers[msg.sender]= true;
        approversCount++;
    }

    function createRequest(string description, address receiver, uint amount) public onlyCampaignManger{
        Request memory request= Request({description: description, receiver: receiver, amount: amount, completed: false, approvalsCount:0});
        requests.push(request);
    } 

    function approveRequest(uint index) public{
        require(approvers[msg.sender]);
        Request storage request= requests[index];
        require(!request.completed);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender]= true;
        request.approvalsCount++;
    }

    function sendMoney(uint index) public{
        Request storage request= requests[index];
        require(request.approvalsCount > (approversCount/2));
        request.receiver.transfer(request.amount);
        request.completed= true;
    }

}