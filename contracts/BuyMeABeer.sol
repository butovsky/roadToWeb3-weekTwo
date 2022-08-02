// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract BuyMeABeer {
    enum BeerSize { SMALL, LARGE }
    
    struct Memo {
        address from;
        uint256 timestamp; // seconds! need to transfer to milliseconds on frontend
        string name;
        string message;
        BeerSize beerSize;
    }

    // indexed - supposedly, we need this to filter events by requests from frontends
    // todo: check later!
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        BeerSize beerSize
    );

    uint256 minimumEth = 1 * 1e18 / 1000; // 0.001 ETH
    uint256 largeEth = minimumEth * 3; // 0.003 ETH
    
    address[] funders;
    mapping (address => uint256) funderToAmount;

    address payable owner;

    Memo[] memos;

    constructor () {
        owner = payable(msg.sender); 
        // we must wrap it into payable if the variable is of such modifier
        // and we need the owner to be payable in order to invoke .call/.send/.transfer method,
    }

    /**
        * @dev reminder for myself that this is a nice practice to have such comments
        * @param _name name
        * @param _message message
    */
    function sendMemo(string memory _name, string memory _message) public payable {
        require(msg.value >= minimumEth);

        BeerSize _beerSize = BeerSize.SMALL;
        if (msg.value >= largeEth) {
            _beerSize = BeerSize.LARGE;
        }

        Memo memory newMemo = Memo({ from: msg.sender, timestamp: block.timestamp, name: _name, message: _message, beerSize: _beerSize});
        memos.push(newMemo);
        if (funderToAmount[msg.sender] == 0) {
            funders.push(msg.sender);
        }
        
        funderToAmount[msg.sender] += msg.value;
        emit NewMemo(newMemo.from, newMemo.timestamp, newMemo.name, newMemo.message, newMemo.beerSize);
    }

    /**
        * @dev for more flexible withdraw, we need some reference
    */
    function checkTips() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /** 
        * @dev i decided to allow the owner to choose the value he/she wants to withdraw
        * @param _value we can use address(this).balance instantly in case if we want to withdraw all the tips every time
    */ 
    function withdraw(uint256 _value) public onlyOwner {
        require(_value <= address(this).balance, "The requested value is bigger than there are tips in total right now.");
        (bool sent,) = owner.call{ value: _value }("");
        require(sent, "Failed to finish a transaction.");
    }

    /**
        * @dev just getting array of memos
    */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
        * @dev owner transfership, which can be triggered only by the owner himself/herself
        * @param _owner address of a new owner
    */
    function changeOwner(address _owner) public onlyOwner {
        owner = payable(_owner);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the account, who owns contract, can use this method.");
        _;
    }
}
