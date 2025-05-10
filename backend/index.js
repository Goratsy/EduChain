import Web3 from 'web3';
import express from 'express';
import { readFile } from 'fs/promises';
import cors from 'cors';
import { isAddress } from './utils/address_validation.js';
import { getRoleName } from './utils/getRoleName.js';


// Файл среды
import dotenv from 'dotenv';
import { ALL_USERS_ADDRESS } from './utils/get_all_users.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Подключение к Ganache и контракту
let web3;
let contract;

try {
    web3 = new Web3(process.env.URL_GANACHE);
    const contractABI = JSON.parse(
        await readFile(new URL('../smart_contract/artifacts/contracts/EduСhain.sol/EduChain.json', import.meta.url))
    ).abi;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log('✅ Успешное подключение к Ganache и контракту');
} catch (error) {
    console.error('❌ Ошибка подключения:', error);
    process.exit(1);
}

// Endpoints
app.get('/', (_, res) => res.send('EduChain API'));

// Получить админа контракта
app.get('/admin', async (_, res) => {
    try {
        const admin = await contract.methods.admin().call();
        res.json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить информацию о пользователе
app.get('/user/:address', async (req, res) => {
    try {
        const role = await contract.methods.getUserRole(req.params.address).call();
        const achievements = await contract.methods.getAchievementsByStudent(req.params.address).call();
        
        res.json({
            address: req.params.address,
            role: getRoleName(role),
            achievementsCount: achievements.length,
            achievements: achievements.map(a => ({
                studentId: a.studentId,
                courseName: a.courseName,
                grade: a.grade,
                university: a.university
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавить университет (только админ)
app.post('/add-university', async (req, res) => {
    try {
        const { universityAddress, adminAddress, privateKey } = req.body;

        if (isAddress(web3, universityAddress)) {
            return res.status(400).json({ error: "Invalid university address" });
        }

        const adminRole = await contract.methods.getUserRole(adminAddress).call();
        if (adminRole !== '1' && adminRole !== 1n) {
            return res.status(403).json({ error: "Only admin can add universities" });
        }

        const currentRole = await contract.methods.getUserRole(universityAddress).call();
        if (currentRole !== '0' && currentRole !== 0n) {
            return res.status(400).json({ 
                error: "Address already has a role",
                currentRole: getRoleName(currentRole.toString())
            });
        }

        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const tx = contract.methods.addUniversity(universityAddress);
        const gas = await tx.estimateGas({ from: adminAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const result = await tx.send({
            from: adminAddress,
            gas,
            gasPrice
        });

        res.json({
            success: true,
            transactionHash: result.transactionHash,
            universityAddress,
            blockNumber: Number(result.blockNumber)
        });

    } catch (error) {
        console.error('Add university error:', error);
        res.status(500).json({ 
            error: "Failed to add university",
            details: error.message.includes("revert") ? 
                error.message.split("revert ")[1] : 
                error.message
        });
    }
});

// Добавить студента (только университеты)
app.post('/add-student', async (req, res) => {
    try {
        const { studentAddress, universityAddress, privateKey } = req.body;

        const universityRole = await contract.methods.getUserRole(universityAddress).call();
        if (universityRole !== '2') { // 2 = University
            return res.status(403).json({ error: "Only universities can add students" });
        }

        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const tx = contract.methods.addStudent(studentAddress);
        const gas = await tx.estimateGas({ from: universityAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const result = await tx.send({
            from: universityAddress,
            gas,
            gasPrice
        });

        res.json({
            success: true,
            transactionHash: result.transactionHash,
            studentAddress
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Failed to add student",
            details: error.message
        });
    }
});

// Добавить достижение (только университеты)
app.post('/add-achievement', async (req, res) => {
    try {
        const { studentAddress, studentId, courseName, grade, universityAddress, privateKey } = req.body;

        const senderRole = await contract.methods.getUserRole(universityAddress).call();
        if (senderRole !== '2') {
            return res.status(403).json({ error: "Only universities can add achievements" });
        }

        const studentRole = await contract.methods.getUserRole(studentAddress).call();
        if (studentRole !== '3') {
            return res.status(400).json({ error: "Can only add achievements to students" });
        }

        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const tx = contract.methods.addAchievement(studentAddress, studentId, courseName, grade);
        const gas = await tx.estimateGas({ from: universityAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const result = await tx.send({
            from: universityAddress,
            gas,
            gasPrice
        });

        res.json({
            success: true,
            transactionHash: result.transactionHash,
            achievement: { studentId, courseName, grade }
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Failed to add achievement",
            details: error.message
        });
    }
});

// Получить всех пользователей (упрощенная версия)
app.get('/users', async (_, res) => {
    try {
        res.json({ "users": ALL_USERS_ADDRESS});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить достижения студента
app.get('/achievements/:studentAddress', async (req, res) => {
    try {
        const achievements = await contract.methods.getAchievementsByStudent(req.params.studentAddress).call();
        res.json(achievements.map(a => ({
            studentId: a.studentId,
            courseName: a.courseName,
            grade: a.grade,
            university: a.university
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});