import React, { Component } from 'react';
import ReactModal from 'react-modal';
import  strings from './utils/strings'


export default class RulesModal extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            showRulesModal: false,
        }
    }

    handleOpenRulesModal = () => {
        this.setState({ showRulesModal: true });
    }

    handleCloseRulesModal = () => {
        this.setState({ showRulesModal: false });
    }
    
    render() {
        let modal = <ReactModal 
        isOpen={this.state.showRulesModal}
        contentLabel="Minimal Modal Example"
        onRequestClose={this.handleCloseRulesModal}
        shouldCloseOnOverlayClick={true}
    >
    <div className="CloseModalButtonContainer">
        <button className="CloseModalButton" onClick={this.handleCloseRulesModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                    <g id="Ellipse_1" data-name="Ellipse 1" class="cls-5" transform="translate(39 377)">
                    <circle class="cls-7" cx="10.5" cy="10.5" r="10.5"/>
                    <circle class="cls-8" cx="10.5" cy="10.5" r="10"/>
                    </g>
                    <text id="x" class="cls-6" transform="translate(46 391)"><tspan x="0" y="0">x</tspan></text>
                </g>
            </svg>
        </button>
    </div>
   
    <div className="RulesContainer">
        <div className="RulesContent">
            <h2>{strings.rules}</h2>
            <p>2-6 {strings.players}</p>
            <p>{strings.ruleP1}</p>
            <p><b>{strings.challengeButtonText}</b>{strings.ruleP2}</p>
            <p><b>{strings.ruleBlock}</b>{strings.ruleP3}
            </p>
            <p>
                {strings.ruleP4}
            </p>
            <p>
                {strings.ruleP5}
            </p>
            <h2>{strings.influences}</h2>
            <h3>{strings.captain}</h3>
            <p><b id="captain-color">{strings.steal}</b>{strings.ruleSteal}<hl id="captain-color">{strings.captain}</hl> or <hl id="ambassador-color">{strings.ambassador}</hl>{strings.ruleCanblock}<hl id="captain-color">STEAL</hl></p>
            <h3>{strings.assassin}</h3>
            <p><b id="assassin-color">{strings.assassinate}</b>{strings.ruleAssassinate}<hl id="contessa-color">{strings.contessa}</hl>.</p>
            <h3>{strings.duke}</h3>
            <p><b id="duke-color">{strings.tax}</b>{strings.ruleTax}</p>
            <h3>{strings.ambassador}</h3>
            <p><b id="ambassador-color">{strings.exchange}</b>{strings.ruleExchange}<hl id="captain-color">{strings.steal}</hl></p>
            <h3>{strings.contessa}</h3>
            <p><b id="contessa-color">{strings.blockAssassination}</b>{strings.ruleCanblock}<b id="assassin-color">{strings.assasinations}</b>{strings.notBlockable}</p>
            <h3>{strings.otherActions}</h3>
            <p><b>{strings.income}</b>{strings.ruleIncome}</p>
            <p><b>{strings.foreingAid}</b>{strings.ruleForeingAid}<hl id="duke-color">{strings.duke}</hl>.</p>
            <p><b>{strings.coup}</b>{strings.ruleCoup}</p>
        </div>
    </div>
    </ReactModal>
        if(this.props.home) {
            return(
                <>
                    <div className="HomeRules" onClick={this.handleOpenRulesModal}>
                        <p>Rules </p>  
                        <svg className="InfoIcon"xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                            <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                                <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                                <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                                <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                                </g>
                                <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                            </g>
                        </svg>
                    </div>
                    {modal}
                </>
            )
        }
        return (
            <>
            <div className="Rules" onClick={this.handleOpenRulesModal}>
                <p>Rules </p>  
                <svg className="InfoIcon"xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 21 22">
                    <g id="more_info" data-name="more info" transform="translate(-39 -377)">
                        <g id="Ellipse_1" data-name="Ellipse 1" className="cls-1" transform="translate(39 377)">
                        <circle className="cls-3" cx="10.5" cy="10.5" r="10.5"/>
                        <circle className="cls-4" cx="10.5" cy="10.5" r="10"/>
                        </g>
                        <text id="i" className="cls-2" transform="translate(48 393)"><tspan x="0" y="0">i</tspan></text>
                    </g>
                </svg>
            </div>
            {modal}
            </>
        )
    }
}
