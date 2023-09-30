// SPDX-License-Identifier: MIT
pragma solidity ^0.6.5;

contract CampaignFactory {
    address[] public deployedCampaigns;

    mapping(address => string) public campaignCause;

    // Deploys a new instance of a Campaign and stores the resulting address
    function createCampaign(string memory cause, uint minimum) public {
        address newCampaign = address(
            new Campaign(cause, minimum, payable(msg.sender))
        );

        deployedCampaigns.push(newCampaign);
        campaignCause[newCampaign] = cause;
    }

    // Returns a list of all deployed campaigns
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests; // List of requests the manager has created
    address payable public manager;
    string public campaignCause;
    uint public minimumContribution;
    // address[] public approvers; arrays aren't scalable - use mappings for O(1) lookups. Mappings need to be initialised to return an undefined value though
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        string memory cause,
        uint minimum,
        address payable creator
    ) public {
        manager = creator;
        campaignCause = cause;
        minimumContribution = minimum;
    }

    // Called when someone wants to donate money to the campaign and become an 'approver'
    function contribute() public payable {
        require(msg.value > minimumContribution);

        if (!approvers[msg.sender]) {
            approversCount++;
            //approvers[msg.sender] = true; //should be here I think
        }
        approvers[msg.sender] = true; //only the value true gets stored inside the mapping - not the address
    }

    // Called by the manager to create a new 'spending' request
    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public restricted {
        // Ensure we can't ask for more money than the contract holds
        require(value <= address(this).balance);
        // require(approvers[msg.sender]); //to ensure the user is approved - not needed here
        //memory is like a c++ reference pointer to original stored memory address we initialised - as opposed to storage which is a copy of the original (which we'd pass not refer to).
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        //NB: since mapping is a reference type, we do not need to initialise this

        //Request(description, value, recipient, false); // relies on the variables being passed in CORRECT ORDER though

        requests.push(newRequest);
    }

    // Called by each contributor to approve a spending request (voting)
    function approveRequest(uint index) public {
        // storage keyword as we're making a mutable copy of requests
        Request storage request = requests[index];

        //make sure person is approved
        require(approvers[msg.sender]);
        //make sure this person has not already voted
        require(!request.approvals[msg.sender]);
        //mark this person as having voted
        request.approvals[msg.sender] = true;
        //increment voting count
        request.approvalCount++;
    }

    // After a request has gotten enough approvals, the manager can call this to get money sent to the vendor
    function finaliseRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount >= (approversCount / 2));
        require(!request.complete);

        request.complete = true;
        request.recipient.transfer(request.value);
    }

    //get a summary of the stats of a campaign (balance, contribution, manager etc )
    function getSummary()
        public
        view
        returns (
            string memory,
            uint,
            uint,
            uint,
            uint,
            address
        )
    {
        return (
            campaignCause,
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
