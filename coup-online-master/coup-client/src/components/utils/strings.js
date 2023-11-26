// strings.js
const strings = {
  en: {
    challengeSteal: "{source} is trying to Steal from {target}",
    challengeTax: "{source} is trying to collect Tax (3 coins)",
    challengeAssassinate: "{source} is trying to Assassinate {target}",
    challengeExchange: "{source} is trying to Exchange their influences",
    challengeButtonText: "Challenge",
    blockChallengeMessage: "{source} is trying to block {action} from {prevSource} as {claim}",
    usingForeingAid: "is trying to use Foreign Aid",
    blockForeingAid: "Block Foreign Aid",
    blockSteal: "Block Steal",
    blockAssassination: "Block Assassination",
    pickClaimMessage: "To block steal, do you claim Ambassador or Captain?",
    ambassador: "Ambassador",
    captain: "Captain",
    chooseInfluenceToLose: "Choose an influence to lose",
    playAgain: "Play Again",
    eventLog: "Event log",
    chooseInfluencesToKeep: "Choose which influence(s) to keep",
    signIn: "Sign In",
    password: "Password:",
    registration: "Registration",
    dragPlayersMessage: "You can drag to re-arrange the players in a specific turn order!",
    roomCode: "ROOM CODE:",
    copiedToClip: "Copied to clipboard",
    pleaseEnterName: "Please enter your name",
    lessNameError: 'Name must be less than 11 characters',
    ready: "Ready!",
    notReady: "Not Ready",

  },
  pt: {
    challengeSteal: "{source} está tentando Roubar de {target}",
    challengeTax: "{source} está tentando coletar Imposto (3 moedas)",
    challengeAssassinate: "{source} está tentando Assassinar {target}",
    challengeExchange: "{source} está tentando Trocar suas influências",
    challengeButtonText: "Desafiar",
    blockChallengeMessage: "{source} está tentando bloquear {action} de {prevSource} como {claim}",
    usingForeingAid: "está tentando usar Ajuda Externa",
    blockForeingAid: "Bloquear Ajuda Externa",
    blockSteal: "Bloquear Roubo",
    blockAssassination: "Bloquear Assassinato",
    pickClaimMessage: "Para bloquear roubo, você alega ser Embaixador ou Capitão?",
    ambassador: "Embaixador",
    captain: "Capitão",
    chooseInfluenceToLose: "Escolha uma influencia para perder",
  },
};

const defaultLanguage = 'pt'; // Idioma padrão


export default strings[defaultLanguage];
