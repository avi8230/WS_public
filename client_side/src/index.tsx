import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './6_Components/1_Layout/Layout/Layout';
import reportWebVitals from './reportWebVitals';
import createInterceptors from './2_WebAccess/Interceptors';
import user_localMemory from './3_LocalMemory/User_localMemory';
import preferences_localMemory from './3_LocalMemory/Preferences_localMemory';
import words_localMemory from './3_LocalMemory/Words_localMemory';

createInterceptors();
if (user_localMemory.token) {
    if ([0, 1, 3, 4].includes(user_localMemory.user.role)) {
        preferences_localMemory.save();
        words_localMemory.save();
    }
    user_localMemory.replaceToken();
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Layout />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
