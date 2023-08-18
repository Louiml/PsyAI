import React, { useEffect, useRef, useCallback } from "react";
import useScript from "./useScript";

const PRODUCT_DESCRIPTION = "Premium Plan (2 Months)";
const PRODUCT_PRICE = 14.90;
const CURRENCY_CODE = "USD";
const EXPIRY_TIME = 60 * 24 * 60 * 60 * 1000; 

export default function Paypal() {
  const paypal = useRef();
  const { error, loaded } = useScript();

  const handleApprove = useCallback(async (data, actions) => {
    const order = await actions.order.capture();
    console.log(order);
    setPremiumUserStatus(true);
  }, []);

  const setPremiumUserStatus = (status) => {
    localStorage.setItem('premiumUser', JSON.stringify({ status: status, expiry: Date.now() + EXPIRY_TIME }));
    window.location.reload();
  };

  useEffect(() => {
    if (loaded && !error) {
      window.paypal
        .Buttons({
          style: {
            color: 'gold',
          },
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: PRODUCT_DESCRIPTION,
                  amount: {
                    currency_code: CURRENCY_CODE,
                    value: PRODUCT_PRICE,
                  },
                },
              ],
            });
          },
          onApprove: handleApprove,
          onError: (err) => {
            console.error("Paypal error:", err);
          },
        })
        .render(paypal.current);
    }
  }, [loaded, error, handleApprove]);

  if (error) {
    return <div>PayPal SDK could not be loaded.</div>;
  }

  return (
    <div ref={paypal}></div>
  );
}
