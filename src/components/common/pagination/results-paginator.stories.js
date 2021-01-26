import React from 'react';
import {
  action
} from '@storybook/addon-actions';

import ResultsPaginator from "./results-paginator";

export default {
  title: 'common blocks/Results paging',
  component: ResultsPaginator,
};



export const FirstPage = () => (<ResultsPaginator recordsPerPage={10} totalRecords={100} onActivePageChange={action("onActivePageChange")}/>);
export const SecondPage = () => (<ResultsPaginator activePage={2} recordsPerPage={10} totalRecords={100} onActivePageChange={action("onActivePageChange")}/>);
export const LastPage = () => (<ResultsPaginator activePage={10} recordsPerPage={10} totalRecords={100} onActivePageChange={action("onActivePageChange")}/>);

