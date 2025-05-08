// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EduChain {
    // Структура для хранения достижений
    struct Achievement {
        string studentId;
        string courseName;
        uint256 grade;
        address university;
    }

    address public admin;
    Achievement[] public achievements;
    mapping(address => bool) public universities; // Список доверенных вузов

    // Событие для отслеживания добавления достижений
    event AchievementAdded(
        string indexed studentId,
        string courseName,
        uint256 grade
    );

    // Модификатор для проверки прав вуза
    modifier onlyUniversity() {
        require(
            universities[msg.sender],
            "Only authorized universities can add data"
        );
        _;
    }

    constructor() {
        admin = msg.sender; // Устанавливаем создателя контракта как админа
        universities[msg.sender] = true; // Создатель также является университетом
    }

    // Функция добавления вуза (только владелец контракта)
    function addUniversity(address _university) external {
        require(msg.sender == admin, "Only admin can add universities");
        universities[_university] = true;
    }

    // Удаление университета (только админ)
    function removeUniversity(address _university) external {
        require(msg.sender == admin, "Only admin can remove universities");
        require(universities[_university], "University not registered");
        universities[_university] = false;
    }

    // Добавление достижения (только вузы)
    function addAchievement(
        string memory _studentId,
        string memory _courseName,
        uint256 _grade
    ) external onlyUniversity {
        achievements.push(
            Achievement(_studentId, _courseName, _grade, msg.sender)
        );
        emit AchievementAdded(_studentId, _courseName, _grade);
    }

    // Получение достижений по studentId
    function getAchievementsByStudent(
        string memory _studentId
    ) external view returns (Achievement[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < achievements.length; i++) {
            if (
                keccak256(bytes(achievements[i].studentId)) ==
                keccak256(bytes(_studentId))
            ) {
                count++;
            }
        }

        Achievement[] memory result = new Achievement[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < achievements.length; i++) {
            if (
                keccak256(bytes(achievements[i].studentId)) ==
                keccak256(bytes(_studentId))
            ) {
                result[index] = achievements[i];
                index++;
            }
        }
        return result;
    }
}
