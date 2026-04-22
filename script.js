// 1. ESTADO DO APLICATIVO
let cart = [];

// 2. FUNÇÃO QUE DESENHA OS CARDS NA TELA (NOVIDADE)
function renderizarServicos() {
    const grid = document.getElementById('services-grid');
    
    // O mapa percorre a lista que está no arquivo dados.js
    grid.innerHTML = MEUS_SERVICOS.map(servico => `
        <div class="service-card" data-category="${servico.categoria}">
            <div class="service-img" style="background-image: url('${servico.imagem}')"></div>
            <div class="service-info">
                <h3>${servico.nome}</h3>
                <p>${servico.descricao}</p>
                
                <details class="service-details">
                    <summary>Ver detalhes</summary>
                    <ul>
                        ${servico.detalhes.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </details>

                <div class="service-footer">
                    <span class="price">R$ ${servico.preco}</span>
                    <button class="add-btn" onclick="addToCart('${servico.nome}', ${servico.preco}, this)">Selecionar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Chamar a função assim que o site carregar
renderizarServicos();

// 3. FUNÇÃO: ADICIONAR/REMOVER DO CARRINHO
function addToCart(name, price, btn) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        btn.innerText = "Selecionar";
        btn.classList.remove("selected");
    } else {
        cart.push({ name, price });
        btn.innerText = "Remover";
        btn.classList.add("selected");
    }
    updateCartUI();
}

// 4. FUNÇÃO: ATUALIZAR A INTERFACE (BADGE E PULO)
function updateCartUI() {
    const countBadge = document.getElementById("cart-count");
    const priceText = document.getElementById("total-price-panel");
    const cartWrapper = document.getElementById("cart-wrapper");
    const cartBtn = document.getElementById("cartButton");

    countBadge.innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    priceText.innerText = `Total: R$ ${total}`;

    if (cart.length > 0) {
        cartWrapper.style.display = "block";
        cartBtn.classList.add("bounce");
        setTimeout(() => cartBtn.classList.remove("bounce"), 400);
    } else {
        cartWrapper.style.display = "none";
        document.getElementById("cartPanel").style.display = "none";
    }
}

// 5. FUNÇÃO: ABRIR/FECHAR PAINEL
function toggleCart() {
    const panel = document.getElementById("cartPanel");
    panel.style.display = (panel.style.display === "block") ? "none" : "block";
}

// 6. FUNÇÃO: LIMPAR TUDO
function clearCart() {
    cart = [];
    const allAddButtons = document.querySelectorAll('.add-btn');
    allAddButtons.forEach(btn => {
        btn.innerText = "Selecionar";
        btn.classList.remove("selected");
    });
    document.getElementById("appointmentDate").value = "";
    updateCartUI();
}

// 7. FUNÇÃO: PESQUISA
function searchService() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? "flex" : "none";
    });
}

// 8. FILTRO POR CATEGORIA
const filterButtons = document.querySelectorAll('.cat-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.style.display = (category === 'todos' || card.getAttribute('data-category') === category) ? 'flex' : 'none';
        });
    });
});

// 9. ENVIO WHATSAPP
function sendWhatsApp() {
    const phone = "5511999999999"; 
    const dateInput = document.getElementById("appointmentDate").value;
    if(!dateInput) return alert("Selecione data e hora.");
    const dataFormatada = new Date(dateInput).toLocaleString('pt-BR');
    let message = `*NOVO AGENDAMENTO*%0A%0A`;
    cart.forEach(item => message += `- ${item.name} (R$ ${item.price})%0A`);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `%0A📅 *Data:* ${dataFormatada}%0A💰 *Total:* R$ ${total}`;
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}