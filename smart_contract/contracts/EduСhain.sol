// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EduChain {
    // Роли пользователей
    enum Role { None, Admin, University, Student }
    
    // Структура для хранения достижений
    struct Achievement {
        string studentId;
        string courseName;
        uint256 grade;
        address university;
    }

    // Структура для хранения информации о пользователе
    struct UserInfo {
        Role role;
        uint256 achievementsCount;
    }

    address public admin;
    Achievement[] public achievements;
    mapping(address => UserInfo) public users;
    mapping(address => Achievement[]) public studentAchievements;

    // События
    event RoleAssigned(address indexed user, Role role);
    event AchievementAdded(
        string indexed studentId,
        string courseName,
        uint256 grade,
        address indexed studentAddress,
        address indexed university
    );

    // Модификаторы
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Only admin can perform this action");
        _;
    }

    modifier onlyUniversity() {
        require(users[msg.sender].role == Role.University, "Only universities can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        users[msg.sender] = UserInfo(Role.Admin, 0);
        emit RoleAssigned(msg.sender, Role.Admin);
    }

    // Функция добавления университета (только админ)
    function addUniversity(address _university) external onlyAdmin {
        require(users[_university].role == Role.None, "Address already has a role");
        require(studentAchievements[_university].length == 0, "Cannot assign university role to a student");
        
        users[_university] = UserInfo(Role.University, 0);
        emit RoleAssigned(_university, Role.University);
    }

    // Удаление университета (только админ)
    function removeUniversity(address _university) external onlyAdmin {
        require(users[_university].role == Role.University, "Address is not a university");
        users[_university].role = Role.None;
        emit RoleAssigned(_university, Role.None);
    }

    // Добавление ученика (только университеты)
    function addStudent(address _student) external onlyUniversity {
        require(users[_student].role == Role.None, "Address already has a role");
        users[_student] = UserInfo(Role.Student, 0);
        emit RoleAssigned(_student, Role.Student);
    }

    // Добавление достижения (только университеты)
    function addAchievement(
        address _student,
        string memory _studentId,
        string memory _courseName,
        uint256 _grade
    ) external onlyUniversity {
        require(users[_student].role == Role.Student, "Can only add achievements to students");
        require(users[msg.sender].role == Role.University, "Only universities can add achievements");
        
        achievements.push(Achievement(_studentId, _courseName, _grade, msg.sender));
        studentAchievements[_student].push(Achievement(_studentId, _courseName, _grade, msg.sender));
        users[_student].achievementsCount++;
        
        emit AchievementAdded(_studentId, _courseName, _grade, _student, msg.sender);
    }

    // Получение достижений по адресу студента
    function getAchievementsByStudent(address _student) external view returns (Achievement[] memory) {
        return studentAchievements[_student];
    }

    // Получение роли пользователя
    function getUserRole(address _user) external view returns (Role) {
        return users[_user].role;
    }
}