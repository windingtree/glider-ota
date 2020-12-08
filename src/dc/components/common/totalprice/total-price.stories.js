import React from 'react';
import {
  action
} from '@storybook/addon-actions';

import TotalPriceButton from "./total-price";

export default {
  title: 'Total price and action button',
  component: TotalPriceButton,
};

let price = {
  "currency": "CAD",
  "public": "281.37",
  "commission": "0.00",
  "taxes": "57.37"
}
export const Default = () => (<TotalPriceButton price={price} onProceedClicked={action("onProceedButtonClicked")}/>);
export const WithCustomTitle = () => (<TotalPriceButton price={price} proceedButtonTitle={"Proceed to payment"} onProceedClicked={action("onProceedButtonClicked")}/>);
export const Disabled = () => (<TotalPriceButton price={price} disabled={true} onProceedClicked={action("onProceedButtonClicked")}/>);
