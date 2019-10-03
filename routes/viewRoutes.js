const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewsController.getOverview
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

// Signup
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);

// Login
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

// Me
router.get('/me', authController.protect, viewsController.getAccount);

// My Tours
router.get('/my-tours', authController.protect, viewsController.getMyTours);

module.exports = router;
