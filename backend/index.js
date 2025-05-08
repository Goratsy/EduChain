import Web3 from 'web3';
import express from 'express';
import { readFile } from 'fs/promises';
import cors from 'cors';
import { isAddress } from './utils/address_validation.js';

// Файл среды
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json()); // Настройка формата выдачи информации (json)
app.use(cors()); // Настройки CORS защиты

// Подключение к Ganache
let web3;
let contract;

try {
    web3 = new Web3(process.env.URL_GANACHE);
    const contractABI = JSON.parse(
        await readFile(new URL('./EduChain.json', import.meta.url))
    ).abi;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Загрузка ABI контракта
    contract = new web3.eth.Contract(contractABI, contractAddress);
} catch (error) {
    console.log('❌ Неудачная попытка подключения к локальной сети Ganache')
    console.log(error);
}

// endpoints
app.get('/', (_, res) => {
    res.send('EduChain API is running!');
});

// Получить админа контракта
app.get('/admin', async (_, res) => {
    try {
        const admin = await contract.methods.admin().call();
        res.json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Проверить, является ли адрес университетом
app.get('/is-university/:address', async (req, res) => {
    try {
        const isUniversity = await contract.methods.universities(req.params.address).call();
        res.json({ isUniversity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавить университет (только админ)
app.post('/add-university', async (req, res) => {
    try {
        const { universityAddress, fromAddress, privateKey } = req.body;

        // Проверка формата адресов
        if (isAddress(web3, universityAddress)) {
            return res.status(400).json({ error: "Неверный формат адреса университета" });
        }

        if (isAddress(web3, fromAddress)) {
            return res.status(400).json({ error: "Неверный формат адреса отправителя" });
        }

        // Проверяем, является ли адрес уже университетом
        const isAlreadyUniversity = await contract.methods.universities(universityAddress).call();
        if (isAlreadyUniversity) {
            return res.status(400).json({ 
                error: "Университет уже зарегистрирован",
                universityAddress,
                isRegistered: true
            });
        }

        // Настройка аккаунта
        const cleanedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        const account = web3.eth.accounts.privateKeyToAccount(cleanedPrivateKey);
        web3.eth.accounts.wallet.add(account);

        // Проверяем, что отправитель - админ
        const adminAddress = await contract.methods.admin().call();
        if (fromAddress.toLowerCase() !== adminAddress.toLowerCase()) {
            return res.status(403).json({ 
                error: "Только администратор может добавлять университеты",
                requiredAdmin: adminAddress,
                yourAddress: fromAddress
            });
        }

        // Отправка транзакции
        const tx = contract.methods.addUniversity(universityAddress);
        const gas = await tx.estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const result = await tx.send({
            from: fromAddress,
            gas,
            gasPrice
        });

        // Успешный ответ
        res.json({ 
            success: true,
            message: "Университет успешно добавлен",
            transactionHash: result.transactionHash,
            universityAddress,
            blockNumber: Number(result.blockNumber)
        });

    } catch (error) {
        let errorMessage = error.message;
        
        if (error.message.includes("revert Only admin can add universities")) {
            errorMessage = "Только администратор может добавлять университеты";
        } else if (error.message.includes("already registered")) {
            errorMessage = "Этот университет уже зарегистрирован";
        }

        console.error('Ошибка при добавлении университета:', error);
        res.status(500).json({ 
            error: "Ошибка при добавлении университета",
            details: errorMessage,
            technicalDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Удалить университет (только админ)
app.post('/remove-university', async (req, res) => {
    try {
        const { universityAddress, adminAddress, privateKey } = req.body;

        // Валидация адресов
        if (isAddress(web3, universityAddress)) {
            return res.status(400).json({ error: "Неверный формат адреса университета" });
        }

        if (isAddress(web3, adminAddress)) {
            return res.status(400).json({ error: "Неверный формат адреса администратора" });
        }

        // Проверка существования университета
        const isUniversity = await contract.methods.universities(universityAddress).call();
        if (!isUniversity) {
            return res.status(404).json({ 
                error: "Университет не найден",
                universityAddress,
                isRegistered: false
            });
        }

        // Проверка прав администратора
        const contractAdmin = await contract.methods.admin().call();
        if (adminAddress.toLowerCase() !== contractAdmin.toLowerCase()) {
            return res.status(403).json({ 
                error: "Только администратор может удалять университеты",
                requiredAdmin: contractAdmin,
                yourAddress: adminAddress
            });
        }

        // Настройка аккаунта
        const cleanedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        const account = web3.eth.accounts.privateKeyToAccount(cleanedPrivateKey);
        web3.eth.accounts.wallet.add(account);

        // Отправка транзакции
        const tx = contract.methods.removeUniversity(universityAddress);
        const gas = await tx.estimateGas({ from: adminAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const result = await tx.send({
            from: adminAddress,
            gas,
            gasPrice
        });

        // Успешный ответ
        res.json({ 
            success: true,
            message: "Университет успешно удален",
            transactionHash: result.transactionHash,
            removedUniversity: universityAddress,
            blockNumber: Number(result.blockNumber)
        });

    } catch (error) {
        console.error('Ошибка при удалении университета:', error);
        
        let errorMessage = "Ошибка при удалении университета";
        if (error.message.includes("Only admin can remove")) {
            errorMessage = "Только администратор может удалять университеты";
        } else if (error.message.includes("revert")) {
            errorMessage = "Ошибка выполнения транзакции";
        }

        res.status(500).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Добавить достижение (только университеты)
app.post('/add-achievement', async (req, res) => {
    try {
        const { studentId, courseName, grade, fromAddress, privateKey } = req.body;

        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const tx = contract.methods.addAchievement(studentId, courseName, grade);
        const gas = await tx.estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const result = await tx.send({
            from: fromAddress,
            gas,
            gasPrice
        });

        res.json({ transactionHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить достижения студента
app.get('/achievements/:studentId', async (req, res) => {
    try {
        const data = await contract.methods.getAchievementsByStudent(req.params.studentId).call();

        const formattedData = data.map(achievement => ({
            studentId: achievement.studentId,
            courseName: achievement.courseName,
            grade: achievement.grade,
            university: achievement.university
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при запросе, повторите попытку позже!' });
    }
});

// Получить общее количество достижений
app.get('/achievements-count', async (_, res) => {
    try {
        const count = await contract.methods.achievements.length().call();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить информацию о контракте
app.get('/contract-info', async (_, res) => {
    try {
        const admin = await contract.methods.admin().call();
        const achievementsCount = await contract.methods.achievements.length().call();

        res.json({
            contractAddress,
            admin,
            achievementsCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}. http://localhost:${process.env.SERVER_PORT}`);
});