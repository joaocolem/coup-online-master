import React from 'react';
import { Link } from 'react-router-dom';
import RulesModal from './RulesModal';
import LanguageStrings from './utils/strings';
import ruseImage from '../assets/Ruse.png';



const Home = () => {




    const strings = LanguageStrings()
    return (
        <>

            <div className="homeContainer">
                <h1>{strings.welcomeMessage}</h1>
                <p>{strings.subtitle}</p>

                <div className="input-group-btn">
                    <Link className="home" to="/create">
                        {strings.createGame}
                    </Link>
                </div>
                <div className="input-group-btn">
                    <Link className="home" to="/join">
                        {strings.joinGame}
                    </Link>
                </div>
                <div>
                    <div className="homeModalContainer">
                        <RulesModal home={true} />
                    </div>
                </div>
                <img src={ruseImage} alt="Ruse" />
            </div>
        </>
    );
};

export default Home;
