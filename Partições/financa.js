// 1. Importa as ferramentas (Note que adicionei o initializeApp aqui)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// 2. Sua configuração (Idêntica ao seu print)
const firebaseConfig = {
    apiKey: "AIzaSyBNkwzgGdD-MNvKhMVCCN2K8eYZ27QXsVg",
    authDomain: "transparencia-6bd79.firebaseapp.com",
    projectId: "transparencia-6bd79",
    storageBucket: "transparencia-6bd79.firebasestorage.app",
    messagingSenderId: "462833144279",
    appId: "1:462833144279:web:6ee3e5dccd1cfcc6e3b92",
    measurementId: "G-X4KQKHMV0T"
};

// 3. Inicializa o Firebase e o Banco de Dados
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(getAuth(), (user) => {
    if (user) {
        // Usuário logado, mostra os botões de edição
        document.querySelectorAll('.btn-admin').forEach(btn => {
            btn.style.display = 'block';
        });
    } else {
        // Usuário não logado, esconde os botões de edição
        document.querySelectorAll('.btn-admin').forEach(btn => {
            btn.style.display = 'none';
        });
    }
});

// 4. Função para buscar os dados e criar os cards
async function carregarCards() {
    // Atenção: usei "Transparencia" com T maiúsculo porque foi assim que você criou no site!
    const querySnapshot = await getDocs(collection(db, "Transparencia"));
    const container = document.getElementById("cards-container");

    if (!container) {
        console.error("Erro: Não achei o ID 'cards-container' no seu HTML!");
        return;
    }

    container.innerHTML = ""; // Limpa o container antes de carregar

    querySnapshot.forEach((doc) => {
        const dados = doc.data();

        // Criando o HTML do card principal (Evento)
        container.innerHTML += `
        <div class="card-evento">
            <div class="topo-evento">
                <small>${dados.Categoria}</small>
                <h3>${dados.Titulo}</h3>
                <p>${dados.Descricao}</p>
            </div>
            
            <div class="grid-turmas-interna">
                <div class="mini-card"><span>1001</span><strong>${dados.v1001 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>1002</span><strong>${dados.v1002 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>2001</span><strong>${dados.v2001 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>2002</span><strong>${dados.v2002 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>2003</span><strong>${dados.v2003 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>3001</span><strong>${dados.v3001 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>3002</span><strong>${dados.v3002 || 'R$ 0'}</strong></div>
                <div class="mini-card"><span>3003</span><strong>${dados.v3003 || 'R$ 0'}</strong></div>
            </div>

            <div class="rodape-evento">
                <strong>Total do Evento: ${dados.Valor}</strong>
                <small>Justificativa de Saída: ${dados.Justificativa || 'Não informada'}</small>
                <h1>Valor de Saída: ${dados.ValorSaida || 'Não informada'}</h1>
<button class="btn-admin" style="display:none; margin-top: 10px; cursor: pointer;" onclick="prepararEdicao('${doc.id}', '${dados.Categoria}', '${dados.Titulo}', '${dados.Descricao}', '${dados.v1001}', '${dados.v1002}', '${dados.v2001}', '${dados.v2002}', '${dados.v2003}', '${dados.v3001}', '${dados.v3002}', '${dados.v3003}', '${dados.Valor}', '${dados.Justificativa}', '${dados.ValorSaida}')">
    ✏️ Editar
</button>
            </div>
        </div>
    `;
    });
}

// Executa a função
carregarCards();

// --- FUNÇÕES DE EDIÇÃO DO GRÊMIO ---

// Garanta que esteja EXATAMENTE assim no seu financa.js
window.abrirLogin = () => {
    const modal = document.getElementById('modal-login');
    if (modal) modal.style.display = 'flex';
};

window.fecharLogin = () => {
    const modal = document.getElementById('modal-login');
    if (modal) modal.style.display = 'none';
};

window.fazerLogin = () => {
    const email = document.getElementById('email-gremio').value;
    const senha = document.getElementById('senha-gremio').value;

    // Se o seu 'auth' já estiver importado no topo do arquivo:
    signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            alert("Logado com sucesso! Agora você pode editar.");
            window.fecharLogin();
            // Aqui chamamos a função para mostrar os lápis de edição
            document.querySelectorAll('.btn-admin').forEach(b => b.style.display = 'block');
        })
        .catch((error) => {
            alert("Erro: " + error.message);
        });
};

// 2. Função que abre o formulário e preenche com os dados atuais
window.prepararEdicao = (id, cat, tit, desc, v1, v2, v3, v4, v5, v6, v7, v8, val, just, vSaid) => {
    // Exibe a janela de edição
    const janela = document.getElementById('janela-editar');
    if (janela) {
        janela.style.display = 'block';

        // Preenche cada campo do formulário com o valor que veio do card
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-categoria').value = cat;
        document.getElementById('edit-titulo').value = tit;
        document.getElementById('edit-descricao').value = desc;
        document.getElementById('edit-v1001').value = v1;
        document.getElementById('edit-v1002').value = v2;
        document.getElementById('edit-v2001').value = v3;
        document.getElementById('edit-v2002').value = v4;
        document.getElementById('edit-v2003').value = v5;
        document.getElementById('edit-v3001').value = v6;
        document.getElementById('edit-v3002').value = v7;
        document.getElementById('edit-v3003').value = v8;
        document.getElementById('edit-valor').value = val;
        document.getElementById('edit-justificativa').value = just;
        document.getElementById('edit-valorsaida').value = vSaid;
    }
};

// 3. Função que envia as alterações para o Firebase
window.salvarAlteracoesNoFirebase = async () => {
    // Você precisa ter o 'db' e as funções do firestore importadas no topo do seu financa.js
    // Ex: import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

    const id = document.getElementById('edit-id').value;

    // ATENÇÃO: Substitua "Eventos" pelo nome exato da sua coleção no Firebase
    const eventoRef = doc(db, "Transparencia", id);

    try {
        await updateDoc(eventoRef, {
            Categoria: document.getElementById('edit-categoria').value,
            Titulo: document.getElementById('edit-titulo').value,
            Descricao: document.getElementById('edit-descricao').value,
            v1001: document.getElementById('edit-v1001').value,
            v1002: document.getElementById('edit-v1002').value,
            v2001: document.getElementById('edit-v2001').value,
            v2002: document.getElementById('edit-v2002').value,
            v2003: document.getElementById('edit-v2003').value,
            v3001: document.getElementById('edit-v3001').value,
            v3002: document.getElementById('edit-v3002').value,
            v3003: document.getElementById('edit-v3003').value,
            Valor: document.getElementById('edit-valor').value,
            Justificativa: document.getElementById('edit-justificativa').value,
            ValorSaida: document.getElementById('edit-valorsaida').value
        });

        alert("Sucesso! O Grêmio atualizou os dados.");
        document.getElementById('janela-editar').style.display = 'none'; // Fecha a janela
        location.reload(); // Atualiza a página para mostrar os novos valores
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro! Verifique se você está logado ou se as regras do Firebase permitem a edição.");
    }
};