import React, { useState, useRef, useEffect } from "react";

export default function Paypal() {
  const [rendered, setRendered] = useState(false);
  const paypal = useRef();

  useEffect(() => {
    if (!rendered) {
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "Premium Plan",
                  amount: {
                    currency_code: "USD",
                    value: 11.7,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order);
            localStorage.setItem('premiumUser', JSON.stringify({ status: true, expiry: Date.now() + 2592000000 }));
            window.location.reload();  
        },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypal.current);
      setRendered(true);
    }
  }, [rendered]);

  return (
    <div ref={paypal}></div>
  );
}
