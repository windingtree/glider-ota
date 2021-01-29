import React from 'react';

import LookupList from "./lookup-list";

export default {
    component: LookupList,
    title: 'Search form/Lookup/Dropdown list',
    excludeStories: /.*Data$/,
};

export const airportsData = [
    {primary:"Pulkovo airport",secondary:"Russia",code:"LED"},
    {primary:"Phuket international airport",secondary:"Thailand",code:"HKT"},
    {primary:"Havana",secondary:"Cuba",code:"HAV"},
    {primary:"city without country",code:"HAV"},
    {primary:"city without cody",secondary:"Country"},
    {primary:"Very long primary name which should be truncated",secondary:"Very long secondary name which should be truncated",code:"HAV"},
    {primary:"Very long primary name which should be truncated without secondary"},
    {primary:"Moscow",secondary:"Russia",code:"MOW"},
    {primary:"Domodedovo",secondary:"Russia",code:"DME", indent:true},
    {primary:"Sheremetyevo",secondary:"Russia",code:"SVO", indent:true, icon:'airport'},
    {primary:"Vnukovo",secondary:"Russia",code:"VKO", indent:true}
];

export const citiesData = [
    {primary:"London",secondary:"Great Britain",code:"LON"},
    {primary:"Toronto",secondary:"Canada",code:"HKT"},
    {primary:"Some small city",secondary:"Poland"},
    {primary:"City without country"},
    {primary:"City without country but with code", code:"ABC"}]



export const DefaultList = () => (<LookupList locations={airportsData}/>);
export const NarrowWithLongNames = () => (<div style={{width:'280px'}}><LookupList locations={airportsData}/></div>);

