import Web3 from 'web3';
import dotenv from 'dotenv';
import express from 'express';
import { readFile } from 'fs/promises';
import cors from 'cors';

const contractABI = JSON.parse(
  await readFile(new URL('./EduChain.json', import.meta.url))
).abi;

dotenv.config();

const app = express();
app.use(cors());

// Подключение к Ganache
const web3 = new Web3(process.env.URL_GANACHE);

// Адрес контракта и ABI
const contractAddress = "0x8cb65812a03539fc1DD76dC82F6bfacCE1de5991";
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Роуты
app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.get('/achievements/:studentId', async (req, res) => {
    try {
        const data = await contract.methods.getAchievementsByStudent(req.params.studentId).call();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при запросе, повторите попытку позже!' });
    }
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}. http://localhost:${process.env.SERVER_PORT}`);
});