import React, { useState } from 'react';
import LeaderBoard from './LeaderBoard';
import AppHeader from './AppHeader';

const App = () => {

    return (
        <div className="app">
        <AppHeader title={"Game LeaderBoard"}/>
            <LeaderBoard  />
        </div>
    );
};

export default App;
