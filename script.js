const html = document.querySelector('html');

const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');

const title = document.querySelector('.app__title');

const botoes = document.querySelectorAll('.app__card-button');

const musicaFocoInput = document.getElementById('alternar-musica');
const musica = new Audio('sons/luna-rise-part-one.mp3');

let tempoDecorridoEmsegundos = 1500;
const startPauseBt = document.querySelector('#start-pause');
let intervaloId = null;
const iniciarOuPausarBt = document.querySelector('#start-pause span');

const somPlay = new Audio('sons/click.wav');
const somPause = new Audio('sons/pause.mp3');
const somBeep = new Audio('sons/beep.wav');

const icon = document.querySelector('.app__card-primary-butto-icon');

const tempoNaTela = document.querySelector('#timer')

//Deixa a música em loop
musica.loop = true;

//Quando clicar no Input da música
musicaFocoInput.addEventListener('change', () => {
    //Se a música estiver pausada
    if(musica.paused) {
        musica.play();//A música começa a tocar
    //Se não a música estiver pausada
    } else {
        musica.pause();//A música é pausada
    }
})

//Se houver clique no botão de foco
focoBt.addEventListener('click', () => {
    tempoDecorridoEmsegundos = 1500;//O tempo do timer sera de 1500 segundos (25min)
    alterarContexto('foco');//Altera o contexto da página para foco
    focoBt.classList.add('active');//Adiciona a classe css de "active"
})

//Se houver clique no botão de descanso curto
curtoBt.addEventListener('click', () => {
    tempoDecorridoEmsegundos = 300;//O tempo do timer sera de 300 segundos (5min)
    alterarContexto('descanso-curto');//Altera o contexto da página para descanso curto
    curtoBt.classList.add('active');//Adiciona a classe css de "active"
})

//Se houver clique no botão de descanso longo
longoBt.addEventListener('click', () => {
    tempoDecorridoEmsegundos = 900;//O tempo do timer sera de 900 segundos (15min)
    alterarContexto('descanso-longo');//Altera o contexto da página para descanso longo
    longoBt.classList.add('active');//Adiciona a classe css de "active"
})

//Função que altera o contexto da página
function alterarContexto(contexto){
    mostrarTempo();//Chama a função "mostrarTempo"

    //Remove a classe css dos botões que não estão ativos
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })

    //Adiciona um atributo ao elemento html
    html.setAttribute('data-contexto' , contexto);
    
    //Altera o texto da página conforme o contexto
    switch(contexto){

        case "foco":
            title.innerHTML = `
               <h1 class="app__title">
                    Otimize sua produtividade,<br>
                    <strong class="app__title-strong">mergulhe no que importa.</strong>
                </h1>
            `
        break;

        case "descanso-curto":
            title.innerHTML = `
               <h1 class="app__title">
                    Que tal dar uma respirada?<br>
                    <strong class="app__title-strong">Faça uma pausa curta!</strong>
                </h1>
            `
        break;

        case "descanso-longo":
            title.innerHTML = `
               <h1 class="app__title">
                    Hora de voltar à superfície.<br>
                    <strong class="app__title-strong">Faça uma pausa longa.</strong>
                </h1>
            `
        break;
    }
}

//Função que decrementa o tempo
const contagemRegressiva = () => {

    //Se o tempo for menor ou igual a 0
    if (tempoDecorridoEmsegundos <= 0){
        somBeep.play();//O som de beep é tocado
        zerar();//A função zerar é ativada
        alert('O tempo acabou!');//Um alerta é criado
        return;
    }

    //Decrementando o tempo
    tempoDecorridoEmsegundos -= 1;
    mostrarTempo();//Chamando a função de "mostrarTempo"
}

//Se houver clique no botão "startPauseBt" a função "iniciarOuPausar" é acionada
startPauseBt.addEventListener('click', iniciarOuPausar);

//Função que inicia ou pausa a contagem
function iniciarOuPausar(){

    //Se "intervaloId não estiver vazio"
    if (intervaloId){
        zerar();//A função "zerar" é chamada
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000);//Chama a função "contagemRegressiva" depois de 1000 milisegundos (1 segundo)
    iniciarOuPausarBt.textContent = "Pausar";//Muda o texto do botão de iniciar para "Pausar"
    icon.setAttribute('src', `imagens/pause.png`);//Altera o icone do botão, par aum icone de pause

    //Se o som de play estiver pausado
    if (somPlay.paused){
        somPlay.play();//O som de play é tocado
    //Se o som de play não estiver pausado    
    } else {
        somPlay.paused;//O som de play é pausado
    }
}

function zerar(){
    clearInterval(intervaloId);//Limpa o intervalo de "intervaloId" setado anteriomente
    intervaloId = null;//Deixa "intervaloId" vazio
    iniciarOuPausarBt.textContent = "Começar";//Aletra o texto do botão iniciar para "Começar"
    icon.setAttribute('src', `imagens/play_arrow.png`);//Altera o icone do botão, par aum icone de play

    //Se o som de beep estiver pausado
    if (somBeep.paused){
        //Se o som de pause estiver pausado
        if (somPause.paused){
            somPause.play();//O som de pause é tocado
        //Se o som de beep não estiver pausado
        } else {
            somPause.paused;//O som de pause é pausado
        }
    }    
}

//Função que mostra o tempo do timer
function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmsegundos * 1000);//Armazena o tempo do timer em uma Date multiplicado por 1000, para ficar em segundos 
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute:'2-digit', second:'2-digit'})//Formata a string do tempo do timer
    tempoNaTela.innerHTML = `${tempoFormatado}`;//Exibe o tempo já formatado do timer
}

mostrarTempo();//Chama a função "mostrarTempo"