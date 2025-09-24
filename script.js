document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-nota');
    const tabelaNotas = document.getElementById('tabela-notas');
    const editModal = document.getElementById('edit-modal');
    const closeModalButton = document.querySelector('.close-button');
    const editForm = document.getElementById('edit-form-nota');
    const filtroBusca = document.getElementById('filtro-busca');
    const mostrarPagasCheckbox = document.getElementById('mostrar-pagas');
    const filtroDataInicio = document.getElementById('filtro-data-inicio');
    const filtroDataFim = document.getElementById('filtro-data-fim');

    let todasAsNotas = [];

    const carregarNotas = async () => {
        try {
            const response = await fetch(`api/listar_notas.php?_=${new Date().getTime()}`);
            const data = await response.json();

            if (data && data.status === 'error') {
                throw new Error(data.message);
            }
            
            if (Array.isArray(data)) {
                todasAsNotas = data;
            } else {
                todasAsNotas = [];
                console.error('Erro de formato: A API não retornou um array de notas.', data);
            }
            renderizarTabela();

        } catch (error) {
            console.error('Falha ao carregar notas:', error);
            tabelaNotas.innerHTML = `<tr><td colspan="9" style="color: red; text-align: center;"><b>Erro ao carregar dados:</b> ${error.message}</td></tr>`;
        }
    };

    const renderizarTabela = () => {
        let notasFiltradas = [...todasAsNotas];
        const mostrarPagas = mostrarPagasCheckbox.checked;
        if (!mostrarPagas) {
            notasFiltradas = notasFiltradas.filter(nota => nota.status && typeof nota.status === 'string' && nota.status.trim().toLowerCase() === 'pendente');
        }

        const dataInicio = filtroDataInicio.value;
        const dataFim = filtroDataFim.value;
        if (dataInicio || dataFim) {
            notasFiltradas = notasFiltradas.filter(nota => {
                const dataVencimento = nota.data_vencimento;
                if (!dataVencimento) return false;
                if (dataInicio && dataFim) return dataVencimento >= dataInicio && dataVencimento <= dataFim;
                if (dataInicio) return dataVencimento >= dataInicio;
                if (dataFim) return dataVencimento <= dataFim;
                return true;
            });
        }

        const termoBusca = filtroBusca.value.toLowerCase();
        if (termoBusca) {
            notasFiltradas = notasFiltradas.filter(nota => Object.values(nota).some(val => String(val).toLowerCase().includes(termoBusca)));
        }

        tabelaNotas.innerHTML = '';

        if (notasFiltradas.length === 0) {
            tabelaNotas.innerHTML = `<tr><td colspan="9">Nenhuma nota encontrada com os filtros aplicados.</td></tr>`;
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        notasFiltradas.forEach(nota => {
            const dataVencimento = new Date(nota.data_vencimento + 'T00:00:00');
            const diffTime = dataVencimento - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let statusClass = '', statusText = '';
            if (nota.status === 'Pago') {
                statusClass = 'status-pago-row'; statusText = 'Pago';
            } else if (diffDays < 0) {
                statusClass = 'status-vermelho-row'; statusText = `Vencido há ${Math.abs(diffDays)} dias`;
            } else if (diffDays === 0) {
                statusClass = 'status-vermelho-row'; statusText = `Vence hoje`;
            } else if (diffDays <= 5) {
                statusClass = 'status-laranja-row'; statusText = `Vence em ${diffDays} dias`;
            } else {
                statusClass = 'status-verde-row'; statusText = `Vence em ${diffDays} dias`;
            }
            const valorFormatado = parseFloat(nota.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const dataVencimentoFormatada = dataVencimento.toLocaleDateString('pt-BR');
            const row = `<tr class="${statusClass}"> <td><span class="status-indicator">${statusText}</span></td> <td>${dataVencimentoFormatada}</td> <td class="fornecedor-cell">${nota.fornecedor}</td> <td>${valorFormatado}</td> <td>${nota.numero_nota}</td> <td>${nota.numero_lancamento || '-'}</td> <td>${nota.numero_pedido || '-'}</td> <td>${nota.tecnico_responsavel || '-'}</td> <td> ${nota.status === 'Pendente' ? `<button class="btn-baixar" data-id="${nota.id}">Dar Baixa</button> <button class="btn-editar" data-id="${nota.id}">Editar</button>` : 'Pago'} </td> </tr>`;
            tabelaNotas.innerHTML += row;
        });
    };

    form.addEventListener('submit', async (e) => { e.preventDefault(); const novaNota = { numero_nota: document.getElementById('numero_nota').value, fornecedor: document.getElementById('fornecedor').value, valor: document.getElementById('valor').value, data_emissao: document.getElementById('data_emissao').value, data_vencimento: document.getElementById('data_vencimento').value, numero_lancamento: document.getElementById('numero_lancamento').value, numero_pedido: document.getElementById('numero_pedido').value, tecnico_responsavel: document.getElementById('tecnico_responsavel').value }; try { const response = await fetch('api/adicionar_nota.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novaNota) }); const result = await response.json(); if (response.ok) { alert(result.success); form.reset(); carregarNotas(); } else { alert(`Erro: ${result.error}`); } } catch (error) { console.error('Erro ao adicionar nota:', error); alert('Erro de comunicação.'); } });
    tabelaNotas.addEventListener('click', async (e) => { const target = e.target; const id = target.getAttribute('data-id'); if (target.classList.contains('btn-baixar')) { if (confirm('Deseja realmente dar baixa nesta nota?')) { try { const response = await fetch('api/baixar_nota.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) }); const result = await response.json(); if (response.ok) { alert(result.success); carregarNotas(); } else { alert(`Erro: ${result.error}`); } } catch (error) { console.error('Erro ao dar baixa:', error); alert('Erro de comunicação.'); } } } else if (target.classList.contains('btn-editar')) { const notaParaEditar = todasAsNotas.find(nota => nota.id == id); if (notaParaEditar) { document.getElementById('edit-id').value = notaParaEditar.id; document.getElementById('edit-numero_nota').value = notaParaEditar.numero_nota; document.getElementById('edit-fornecedor').value = notaParaEditar.fornecedor; document.getElementById('edit-valor').value = parseFloat(notaParaEditar.valor).toFixed(2); document.getElementById('edit-data_emissao').value = notaParaEditar.data_emissao; document.getElementById('edit-data_vencimento').value = notaParaEditar.data_vencimento; document.getElementById('edit-numero_lancamento').value = notaParaEditar.numero_lancamento; document.getElementById('edit-numero_pedido').value = notaParaEditar.numero_pedido; document.getElementById('edit-tecnico_responsavel').value = notaParaEditar.tecnico_responsavel; editModal.style.display = 'block'; } } });
    editForm.addEventListener('submit', async (e) => { e.preventDefault(); const notaEditada = { id: document.getElementById('edit-id').value, numero_nota: document.getElementById('edit-numero_nota').value, fornecedor: document.getElementById('edit-fornecedor').value, valor: document.getElementById('edit-valor').value, data_emissao: document.getElementById('edit-data_emissao').value, data_vencimento: document.getElementById('edit-data_vencimento').value, numero_lancamento: document.getElementById('edit-numero_lancamento').value, numero_pedido: document.getElementById('edit-numero_pedido').value, tecnico_responsavel: document.getElementById('edit-tecnico_responsavel').value }; try { const response = await fetch('api/editar_nota.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(notaEditada) }); const result = await response.json(); if (response.ok) { alert(result.success); editModal.style.display = 'none'; carregarNotas(); } else { alert(`Erro ao salvar: ${result.error}`); } } catch (error) { console.error('Erro ao salvar edição:', error); alert('Erro de comunicação.'); } });
    filtroBusca.addEventListener('input', renderizarTabela);
    mostrarPagasCheckbox.addEventListener('change', renderizarTabela);
    filtroDataInicio.addEventListener('change', renderizarTabela);
    filtroDataFim.addEventListener('change', renderizarTabela);
    closeModalButton.addEventListener('click', () => { editModal.style.display = 'none'; });
    window.addEventListener('click', (event) => { if (event.target == editModal) { editModal.style.display = 'none'; } });

    carregarNotas();
});