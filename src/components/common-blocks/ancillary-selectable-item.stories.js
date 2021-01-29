import React,{useState} from 'react';
import {AncillarySelectableItem} from "./ancillary-selectable-item"

export default {
    title: 'common blocks/ancillary selectable item',
    component: AncillarySelectableItem
};

let benefits = [
    '2 checked bags free',
    'Premium meal service',
    'Maple Leaf Lounge access',
    'Exclusive cabin with fully lie-flat seats',
    'Inspired cuisine, selected wines and spirits',
    'Priority check-in, security, baggage and boarding',
    '150% Aeroplan Miles',
    'Free changes, cancellations and standby'
]

let price = "123.4$";

export const Default = () => (
    <AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={false}
                             isSelected={false}/>)
export const DefaultSelected = () => (
    <AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={false}
                             isSelected={true}/>)
export const DefaultDisabled = () => (
    <AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={true}
                             isSelected={false}/>)
export const WithDescription = () => (
    <AncillarySelectableItem items={benefits} description={'40cm x 50cm x 20cm, max 20kg'} price={price}
                             name={"Economy Flexible"} isDisabled={true} isSelected={false}/>)

export const ToggleExample = () => {
    const [enabled,setEnabled] = useState(false);

    return (<AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={false}
                             isSelected={false} onSelect={()=>setEnabled(!enabled)}/>)
}
const fareFamilies=[{
    name:'Economy',
    label:'Economy',
    id:'ECO',
    selected:false,
},{
    name:'Premium',
    label:'Premium',
    id:'PREM',
    selected:true,
},{
    name:'Business',
    label:'Business',
    id:'BUS',
    selected:false,
}]


export const Selection = () => {
    const [items,setItems] = useState(fareFamilies)

    const onSelect = (id) =>{
        console.log('Selected:',id)
        let newItems = Object.assign({},items);
        newItems.forEach(item=>{
            if(item.id === id){
                item.selected = true;
            }else{
                item.selected = false;
            }
            item.name=`${item.label} ${item.selected}`
        })
        setItems(newItems);
    }
    console.log('Items',items)
    return (items.map(item=>{
        return (<AncillarySelectableItem key={item.id} id={item.id} items={benefits} price={price} name={item.name} isDisabled={false}
                                         isSelected={item.selected} onSelect={onSelect}/>)
    }))
}
