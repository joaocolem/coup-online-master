import React from 'react';
import { Link } from 'react-router-dom';
import chicken from '../assets/Chicken.svg';
import RulesModal from './RulesModal';
import  LanguageStrings from './utils/strings'

const PlayGame = () => {
    
    const strings = LanguageStrings()
    return (
        <>
            <div className="homeContainer">
                <h1>{strings.welcomeMessage}</h1>
                <p>{strings.subtitle}</p>
                <img src={chicken} alt="chicken-leg" />
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

                <div className="input-group-btn">
                    <Link className="home" to="/perfil">
                        {strings.profile}
                    </Link>
                </div>
                <div>
                    <div className="homeModalContainer">
                        <RulesModal home={true} />
                    </div>
                </div>
            </div>
            {/* <p className="footer">Made by <a className="website-link" href="https://github.com/cheneth" target="_blank" rel="noopener noreferrer">Ethan Chen</a></p>
            <p className="version-number">Beta v0.9</p> */}
        </>
    );
};

export default PlayGame;
