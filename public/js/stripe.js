/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_FQqcOuWn3lIwmA4iLKaNbm2f001V1buVwL');

export const bookTour = async tourId => {
    try {
        //1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-sesion/${tourId}`
        );

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (error) {
        console.log(error);
        showAlert('error', error);
    }
};
