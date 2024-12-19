import React from 'react';
import LanguageStrings from './utils/strings';

const ActionsTable = () => {
    const strings = LanguageStrings()
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <table
                style={{
                    width: '80%',
                    borderCollapse: 'collapse',
                    textAlign: 'center',
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontWeight: 'bold',
                            }}
                        >
                            {strings.influences}
                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontWeight: 'bold',
                            }}
                        >
                            {strings.action}

                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontWeight: 'bold',
                            }}
                        >
                            {strings.effect}

                        </th>
                        <th
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                backgroundColor: '#f4f4f4',
                                fontWeight: 'bold',
                            }}
                        >
                            {strings.counteration}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{strings.income}</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.collectCoin}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.foreingAidAction}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.collect2Coins}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{strings.coup}</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.pay7}<br />{strings.makeLoseInfluence}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                    </tr>
                    <tr style={{ backgroundColor: '#d9a3c9' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{strings.duke}</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{strings.tax}</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.collect3Coins}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.blockForeingAid}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: '#000', color: '#fff' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.assassin}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.assassinate}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.pay3}<br />{strings.makeLoseInfluence}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                    </tr>
                    <tr style={{ backgroundColor: '#d9efb7' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.ambassador}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.exchange}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.draw2}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.blockSteal}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: '#c7d8f0' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{strings.captain}</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{strings.steal}</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.draw2cfa}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.blockSteal}

                        </td>
                    </tr>
                    <tr style={{ backgroundColor: '#d87e72' }}>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.contessa}
                        </td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>—</td>
                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {strings.blockAssassination}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ActionsTable;
