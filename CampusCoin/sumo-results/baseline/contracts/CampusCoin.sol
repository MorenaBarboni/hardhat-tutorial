// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../@openzeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract CampusCoin is ERC20 {
    address public admin;
    address public university;

    mapping(address => bool) public isStudent;
    mapping(address => uint256) public totalSpent;

    struct ServiceProvider {
        string name;
        string category;
        bool active;
    }

    mapping(address => ServiceProvider) public serviceProviders;

      // === EVENTS ===
    event StudentAdded(address indexed student);
    event StudentRemoved(address indexed student);
    event ServiceProviderAdded( address indexed provider, string name, string category );
    event ServiceProviderUpdated(  address indexed provider,  string newName,  string newCategory,  bool active );
    event ServiceProviderRemoved(address indexed provider);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event ServicePaid(address indexed student, address indexed provider, uint256 amount, uint256 fee);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor(address _university) ERC20("CampusCoin", "CC") {
        require(_university != address(0), "university address cannot be zero");
        admin = msg.sender;
        university = _university;

        _mint(msg.sender, 3_000 * 10 ** decimals());
    }

    // === MINTING, BURNING AND TRANSFERING TOKENS ===
    function mint(address to, uint256 amount) public onlyAdmin {
        require(isStudent[to], "Can only mint to registered students");
        _mint(to, amount);        
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);        
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(isStudent[to], "Recipient must be a registered student");
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(isStudent[to], "Recipient must be a registered student");
        return super.transferFrom(from, to, amount);
    }

    // === STUDENT MANAGEMENT ===

    function addStudent(address student) external onlyAdmin {
        isStudent[student] = true;
        emit StudentAdded(student);
    }

    function removeStudent(address student) external onlyAdmin {
        isStudent[student] = false;
        emit StudentRemoved(student);
    }

    // === SERVICE PROVIDER REGISTRY ===

    function addServiceProvider(address provider, string calldata name, string calldata category ) external onlyAdmin {
        serviceProviders[provider] = ServiceProvider(name, category, true);
        emit ServiceProviderAdded(provider, name, category);
    }

    function removeServiceProvider(address provider) external onlyAdmin {
        serviceProviders[provider].active = false;
        emit ServiceProviderRemoved(provider);
    }

    function updateServiceProvider(
        address provider,
        string calldata newName,
        string calldata newCategory,
        bool active
    ) external onlyAdmin {
        require(
            bytes(serviceProviders[provider].name).length > 0,
            "Provider not found"
        );
        serviceProviders[provider] = ServiceProvider(
            newName,
            newCategory,
            active
        );
        emit ServiceProviderUpdated(provider, newName, newCategory, active);
    }

    // === PAY FOR SERVICE ===
    function payService(address to, uint256 amount) external {
        require(isStudent[msg.sender], "Only registered students can pay");
        require(
            serviceProviders[to].active,
            "Recipient must be an active service provider"
        );

        uint256 fee = amount / 100; // 1%
        uint256 amountAfterFee = amount - fee;

        _transfer(msg.sender, university, fee);
        _transfer(msg.sender, to, amountAfterFee);

        totalSpent[msg.sender] += amount;
        emit ServicePaid(msg.sender, to, amountAfterFee, fee);
    }
}
