import { Router } from "express";

const user_router = Router();

user_router.get('/', (req, res) => {
    res.send('User Route');
})

user_router.get('/:id', (req, res) => {
    res.send('Get user by ID Route');
})

user_router.get('/:id/edit', (req, res) => {
    res.send('Edit user by ID Route');
})

user_router.get('/:id/delete', (req, res) => {
    res.send('Delete user by ID Route');
})

export default user_router;