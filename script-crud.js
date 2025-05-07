
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');

const textarea = document.querySelector('.app__form-textarea');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

const ulTarefa = document.querySelector('.app__section-task-list'); 

const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

//Atualiza as tarefas dentro do banco de dados
function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

//Cria uma tarefa na tela
function criarElementoTarefa(tarefa){

    //Pegando elementos da tarefa
    const li = document.createElement('li');
    const svg = document.createElement('svg');
    const p = document.createElement('p');
    const botao = document.createElement('button');
    const imagemBotao = document.createElement('img');

    //Colocando classes, textos e atributos nos elementos da tarefa
    botao.classList.add('app_button-edit');
    li.classList.add('app__section-task-list-item');
    p.textContent = tarefa.descricao;
    p.classList.add('app__section-task-list-item-description')
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    
    //Adicionando elementos graficos
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `;

    //Caso tenha clique no botão de edição da tarefa
    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");

        if (novaDescricao){

            //Atualiza o texto novo da tarefa e atualiza no banco de dados
            p.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    //Exibe os elementos da tarefa na tela
    botao.append(imagemBotao);
    li.append(svg);
    li.append(p);
    li.append(botao);

    //Se o tarefa for completa
    if (tarefa.completa){
        li.classList.add('app__section-task-list-item-complete')//Adiciona a classe de tarefa completa
        botao.setAttribute('disabled', 'disabled')//Coloca o atributo de disabled e seu valor disabled no botão de edição da tarefa

    }else{//Se a tarefa não estiver completa

        //Se houver clique na tarefa
        li.onclick = () => {

            //Executa um loop Para remover as outras tarefasa ativas
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                })
            
            //Se o clique houver em uma tarefa já selecionada
            if (tarefaSelecionada == tarefa){

                //Esvazia as variavéis de seleção e informações da tarefa selecionada
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }

            //A tarefa clicada passa ser a tarefa em andamento
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;

            //A descrição da tarefa selecionada é exibida também em "Em andamento:"
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            
            //Adiciona a classe de tarefa ativa, para a tarefa selecionada
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

//Se houver clique no botão de adicionar tarefa
btnAdicionarTarefa.addEventListener('click', () => {

    //O form desaparece ou aparece dependendo do se tem ou não a classe hidden
    formAdicionarTarefa.classList.toggle('hidden');
})

//Se o form for enviado
formAdicionarTarefa.addEventListener('submit', (evento) => {

    //Evita o comportamento padrão de um form
    evento.preventDefault(); 
    const tarefa = {
        descricao: textarea.value
    }

    tarefas.push(tarefa);//Coloca a nova tarefa no array das tarefas
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefa.append(elementoTarefa);//Exibe a lista de tarefas
    atualizarTarefas();//Atualiza as tarefas no banco de dados
    textarea.value = '';//Esvazia o campo de digitação do form
    formAdicionarTarefa.classList.add('hidden');//Esconde o form
})

//Cria e exibe as tarefas na lista de tarefas de acordo com array das tarefas
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefa.append(elementoTarefa);
});

//Se o evento "FocoFinalizado" for disparado
document.addEventListener('FocoFinalizado', () => {

    //Se haver uma tarefa selecionada 
    if (tarefaSelecionada && liTarefaSelecionada){

        //A tarefa que estava em andamento passa a estar concluida
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();//Atualiza as tarefas do banco de dados
    }
})

//Remove as tarefas, de acordo com o parametro que diz se é para remover as tarefas conluidas ou todas as tarefas
const removerTarefas = (somenteCompletas) => {

    //Se "somenteCompletas" for true, "seletor" será o classe de tarefa completa, se não sera a classe de tarefa normal
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";

    //Remove as tarefas de acordo com o parametro desta função
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })

    //Se "somenteCompletas" for true tarefas serão filtradas, exibindo apenas as não concluidas, se não retorna um array vazio
    tarefas = somenteCompletas ?  tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

//Adiciona a função "removerTarefas" para os botões de remoção de tarefas
btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);