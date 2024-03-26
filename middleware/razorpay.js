const Razorpay = require('razorpay');
const instance = new Razorpay({
  key_id: 'rzp_test_eTLqINNAiIdrCX',
  key_secret: 'Q5f3IzRj7cMru1iYCRfbp5K6'
});

const generateRazorpay = function(orderid,total){
  console.log("From razerpay",orderid,total);
  return new Promise((resolve,reject)=>{
    var options ={
      amount:total*100,
      currency:"INR",
      receipt:orderid,
    };
    try {
      instance.orders.create(options, function(err, order) {
        if (err) {
          console.log("Error:", err);
          reject(err);
        } else {
          console.log("Order:", order);
          resolve(order);
        }
      });
    } catch (err) {
      console.log("Error:", err);
      reject(err);
    }
  })
}

const signatureCheck =async function(rZOrderId,rZPaymentId,rZSignature) {
  try{
    console.log('signature check');
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256','Q5f3IzRj7cMru1iYCRfbp5K6');
    hmac.update(rZOrderId+'|'+rZPaymentId);
    hmac =hmac.digest('hex');
    if(hmac===rZSignature){
      return true
    }else{
      return false
    }
  }catch(error){
    console.log(error.message);
  }
}




module.exports ={generateRazorpay,signatureCheck};