import { Router } from "express";

const subscription_router = Router();

subscription_router.get('/', (req, res) => {
    res.send('Subscription Route');
})

subscription_router.get('/new', (req, res) => {
    res.send('Add new subscription Route');
})

subscription_router.get('/:id', (req, res) => {
    res.send('Get subscription by ID Route');
})

subscription_router.get('/:id/edit', (req, res) => {
    res.send('Edit subscription by ID Route');
})

subscription_router.get('/:id/delete', (req, res) => {
    res.send('Delete subscription by ID Route');
})

export default subscription_router;
