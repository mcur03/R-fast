import express from 'express';
import cors from 'cors';

const app = express()
.use(cors())
.use(express.json());

export default app;