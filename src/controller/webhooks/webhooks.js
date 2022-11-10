import stripe  from 'stripe'
import dotenv from 'dotenv'
dotenv.config()


// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;

// process.env.STRIPE_WEBHOOKS_KEY

export const stripeWebHooks = async(request, response) => {

    const sig = request.headers['stripe-signature'];
    let eventType, data;

    if(endpointSecret){
        let event
        try {
            event = await stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
            console.log('event', event)  
        } catch (error) {
            console.log('error', error.message)
           return response.status(400).send(`Webhook Error: ${error.message}`);
        }

        data = event.data
        eventType = event.type

    }else{
        data = request.body?.data?.object
        eventType = request.body?.type        
    }
    
    console.log('>>>', {data, eventType})

    
    

    response.send().end();
}