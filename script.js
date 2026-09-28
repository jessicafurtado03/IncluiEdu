/* =====================================================
   INCLUIEDU
   SISTEMA FRONT-END
   ===================================================== */


/* =====================================================
   BANCO DE DADOS LOCAL
   ===================================================== */

function obterDados(chave, padrao = []) {

    const dados = localStorage.getItem(chave);

    if (!dados) {
        return padrao;
    }

    return JSON.parse(dados);
}


function salvarDados(chave, dados) {

    localStorage.setItem(
        chave,
        JSON.stringify(dados)
    );

}


/* =====================================================
   CADASTRO
   ===================================================== */

const formCadastro =
    document.getElementById("formCadastro");


if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const nome =
                document.getElementById("nomeCadastro").value;

            const email =
                document.getElementById("emailCadastro").value;

            const senha =
                document.getElementById("senhaCadastro").value;

            const tipo =
                document.getElementById("tipoCadastro").value;


            const usuarios =
                obterDados("incluiedu_usuarios");


            const usuarioExistente =
                usuarios.find(
                    usuario => usuario.email === email
                );


            if (usuarioExistente) {

                mostrarMensagem(
                    "mensagemCadastro",
                    "Este e-mail já está cadastrado."
                );

                return;

            }


            const novoUsuario = {

                id: Date.now(),

                nome: nome,

                email: email,

                senha: senha,

                tipo: tipo

            };


            usuarios.push(novoUsuario);

            salvarDados(
                "incluiedu_usuarios",
                usuarios
            );


            mostrarMensagem(
                "mensagemCadastro",
                "Conta criada com sucesso!"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }
    );

}


/* =====================================================
   LOGIN
   ===================================================== */

const formLogin =
    document.getElementById("formLogin");


if (formLogin) {

    formLogin.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value;

            const senha =
                document.getElementById("senha").value;


            const usuarios =
                obterDados("incluiedu_usuarios");


            const usuario =
                usuarios.find(
                    user =>
                        user.email === email &&
                        user.senha === senha
                );


            if (!usuario) {

                mostrarMensagem(
                    "mensagemLogin",
                    "E-mail ou senha incorretos."
                );

                return;

            }


            localStorage.setItem(
                "incluiedu_usuario_logado",
                JSON.stringify(usuario)
            );


            if (usuario.tipo === "professor") {

                window.location.href =
                    "dashboard-professor.html";

            } else {

                window.location.href =
                    "dashboard-aluno.html";

            }

        }
    );

}


/* =====================================================
   VERIFICAR LOGIN
   ===================================================== */

function usuarioLogado() {

    const usuario =
        localStorage.getItem(
            "incluiedu_usuario_logado"
        );


    if (!usuario) {

        return null;

    }


    return JSON.parse(usuario);

}


/* =====================================================
   SAIR
   ===================================================== */

function sair() {

    localStorage.removeItem(
        "incluiedu_usuario_logado"
    );

    window.location.href =
        "index.html";

}


/* =====================================================
   CADASTRO DE ALUNO
   ===================================================== */

const formAluno =
    document.getElementById("formAluno");


if (formAluno) {

    formAluno.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const alunos =
                obterDados("incluiedu_alunos");


            const aluno = {

                id: Date.now(),

                nome:
                    document.getElementById(
                        "nomeAluno"
                    ).value,

                turma:
                    document.getElementById(
                        "turmaAluno"
                    ).value,

                caracteristicas:
                    document.getElementById(
                        "caracteristicasAluno"
                    ).value,

                recursos:
                    document.getElementById(
                        "recursosAluno"
                    ).value,

                data:
                    new Date().toLocaleDateString(
                        "pt-BR"
                    )

            };


            alunos.push(aluno);


            salvarDados(
                "incluiedu_alunos",
                alunos
            );


            formAluno.reset();


            alert(
                "Aluno cadastrado com sucesso!"
            );


            carregarAlunos();

        }
    );

}


/* =====================================================
   LISTAR ALUNOS
   ===================================================== */

function carregarAlunos() {

    const lista =
        document.getElementById(
            "listaAlunos"
        );


    if (!lista) return;


    const alunos =
        obterDados("incluiedu_alunos");


    if (alunos.length === 0) {

        lista.innerHTML = `
            <p class="empty">
                Nenhum aluno cadastrado.
            </p>
        `;

        return;

    }


    lista.innerHTML =
        alunos.map(
            aluno => `

            <div class="item-lista">

                <div>

                    <strong>
                        ${aluno.nome}
                    </strong>

                    <p>
                        ${aluno.turma}
                    </p>

                </div>

                <a
                    class="btn-small"
                    href="aluno-perfil.html?id=${aluno.id}">

                    Ver perfil

                </a>

            </div>

        `
        ).join("");

}


carregarAlunos();


/* =====================================================
   PERFIL DO ALUNO
   ===================================================== */

function carregarPerfilAluno() {

    const container =
        document.getElementById(
            "perfilAluno"
        );


    if (!container) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(
            parametros.get("id")
        );


    const alunos =
        obterDados("incluiedu_alunos");


    const aluno =
        alunos.find(
            item => item.id === id
        );


    if (!aluno) {

        container.innerHTML = `
            <div class="dashboard-card">
                <h2>Aluno não encontrado.</h2>
                <a class="btn" href="alunos.html">
                    Voltar
                </a>
            </div>
        `;

        return;

    }


    container.innerHTML = `

        <section class="dashboard-card">

            <span>
                PERFIL PEDAGÓGICO
            </span>

            <h1>
                ${aluno.nome}
            </h1>

            <p>
                Turma: ${aluno.turma}
            </p>

        </section>


        <section class="dashboard-card">

            <h2>
                🧠 Características de aprendizagem
            </h2>

            <p>
                ${aluno.caracteristicas ||
                "Nenhuma informação registrada."}
            </p>

        </section>


        <section class="dashboard-card">

            <h2>
                🧩 Recursos facilitadores
            </h2>

            <p>
                ${aluno.recursos ||
                "Nenhum recurso registrado."}
            </p>

        </section>


        <section class="dashboard-card">

            <h2>
                📚 Memória pedagógica
            </h2>

            <p>
                O histórico das estratégias utilizadas
                aparecerá aqui conforme as atividades
                forem realizadas.
            </p>

        </section>

    `;

}


carregarPerfilAluno();


/* =====================================================
   NOVA ATIVIDADE
   ===================================================== */

const formAtividade =
    document.getElementById(
        "formAtividade"
    );


if (formAtividade) {

    formAtividade.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const atividades =
                obterDados(
                    "incluiedu_atividades"
                );


            const atividade = {

                id: Date.now(),

                titulo:
                    document.getElementById(
                        "tituloAtividade"
                    ).value,

                disciplina:
                    document.getElementById(
                        "disciplinaAtividade"
                    ).value,

                turma:
                    document.getElementById(
                        "turmaAtividade"
                    ).value,

                objetivo:
                    document.getElementById(
                        "objetivoAtividade"
                    ).value,

                conteudo:
                    document.getElementById(
                        "conteudoAtividade"
                    ).value,

                data:
                    new Date().toLocaleDateString(
                        "pt-BR"
                    )

            };


            atividades.push(atividade);


            salvarDados(
                "incluiedu_atividades",
                atividades
            );


            alert(
                "Atividade criada com sucesso!"
            );


            window.location.href =
                "atividades.html";

        }
    );

}


/* =====================================================
   LISTAR ATIVIDADES
   ===================================================== */

function carregarAtividades() {

    const lista =
        document.getElementById(
            "listaAtividades"
        );


    if (!lista) return;


    const atividades =
        obterDados(
            "incluiedu_atividades"
        );


    if (atividades.length === 0) {

        lista.innerHTML = `
            <p class="empty">
                Nenhuma atividade cadastrada.
            </p>
        `;

        return;

    }


    lista.innerHTML =
        atividades.map(
            atividade => `

            <div class="item-lista">

                <div>

                    <strong>
                        ${atividade.titulo}
                    </strong>

                    <p>
                        ${atividade.disciplina}
                        •
                        ${atividade.turma}
                    </p>

                </div>

                <a
                    class="btn-small"
                    href="adaptar-atividade.html?id=${atividade.id}">

                    Adaptar

                </a>

            </div>

        `
        ).join("");

}


carregarAtividades();


/* =====================================================
   SELECTS DE ADAPTAÇÃO
   ===================================================== */

function carregarOpcoesAdaptacao() {

    const selectAtividade =
        document.getElementById(
            "atividadeSelecionada"
        );

    const selectAluno =
        document.getElementById(
            "alunoSelecionado"
        );


    if (!selectAtividade ||
        !selectAluno) {

        return;

    }


    const atividades =
        obterDados(
            "incluiedu_atividades"
        );


    const alunos =
        obterDados(
            "incluiedu_alunos"
        );


    selectAtividade.innerHTML =
        `<option value="">
            Selecione uma atividade
        </option>` +
        atividades.map(
            atividade =>
                `<option value="${atividade.id}">
                    ${atividade.titulo}
                </option>`
        ).join("");


    selectAluno.innerHTML =
        `<option value="">
            Selecione um aluno
        </option>` +
        alunos.map(
            aluno =>
                `<option value="${aluno.id}">
                    ${aluno.nome}
                </option>`
        ).join("");

}


carregarOpcoesAdaptacao();


/* =====================================================
   GERAR ADAPTAÇÃO
   ===================================================== */

const formAdaptacao =
    document.getElementById(
        "formAdaptacao"
    );


if (formAdaptacao) {

    formAdaptacao.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const atividadeId =
                Number(
                    document.getElementById(
                        "atividadeSelecionada"
                    ).value
                );


            const alunoId =
                Number(
                    document.getElementById(
                        "alunoSelecionado"
                    ).value
                );


            const atividades =
                obterDados(
                    "incluiedu_atividades"
                );


            const alunos =
                obterDados(
                    "incluiedu_alunos"
                );


            const atividade =
                atividades.find(
                    item =>
                        item.id === atividadeId
                );


            const aluno =
                alunos.find(
                    item =>
                        item.id === alunoId
                );


            if (!atividade || !aluno) {

                return;

            }


            const resultado =
                document.getElementById(
                    "resultadoAdaptacao"
                );


            resultado.style.display =
                "block";


            resultado.innerHTML = `

                <span>
                    SUGESTÕES DE ADAPTAÇÃO
                </span>

                <h2>
                    ${atividade.titulo}
                </h2>

                <p>
                    Para o aluno:
                    <strong>${aluno.nome}</strong>
                </p>

                <hr>

                <h3>
                    💡 Sugestões
                </h3>

                <label>
                    <input
                        type="checkbox"
                        checked>
                    Utilizar instruções mais curtas
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked>
                    Dividir a atividade em etapas
                </label>

                <label>
                    <input
                        type="checkbox">
                    Utilizar apoio visual
                </label>

                <label>
                    <input
                        type="checkbox">
                    Destacar palavras-chave
                </label>

                <label>
                    <input
                        type="checkbox">
                    Disponibilizar áudio
                </label>

                <h3>
                    🧠 Por que essas sugestões?
                </h3>

                <p>
                    As sugestões são apresentadas considerando
                    as características pedagógicas registradas
                    para o aluno.
                </p>

                <h3>
                    ✏️ Atividade adaptada
                </h3>

                <textarea rows="10">
${atividade.conteudo}
                </textarea>

                <button
                    class="btn"
                    onclick="salvarAdaptacao(
                        ${atividade.id},
                        ${aluno.id}
                    )">

                    Salvar adaptação

                </button>

            `;

        }
    );

}


/* =====================================================
   SALVAR ADAPTAÇÃO
   ===================================================== */

function salvarAdaptacao(
    atividadeId,
    alunoId
) {

    const adaptacoes =
        obterDados(
            "incluiedu_adaptacoes"
        );


    adaptacoes.push({

        id: Date.now(),

        atividadeId: atividadeId,

        alunoId: alunoId,

        data:
            new Date().toLocaleDateString(
                "pt-BR"
            ),

        status: "aprovada"

    });


    salvarDados(
        "incluiedu_adaptacoes",
        adaptacoes
    );


    alert(
        "Adaptação salva com sucesso!"
    );

}


/* =====================================================
   RESULTADOS
   ===================================================== */

function carregarSelectsResultados() {

    const alunoSelect =
        document.getElementById(
            "resultadoAluno"
        );

    const atividadeSelect =
        document.getElementById(
            "resultadoAtividade"
        );


    if (!alunoSelect ||
        !atividadeSelect) {

        return;

    }


    const alunos =
        obterDados(
            "incluiedu_alunos"
        );


    const atividades =
        obterDados(
            "incluiedu_atividades"
        );


    alunoSelect.innerHTML =
        alunos.map(
            aluno =>
                `<option value="${aluno.id}">
                    ${aluno.nome}
                </option>`
        ).join("");


    atividadeSelect.innerHTML =
        atividades.map(
            atividade =>
                `<option value="${atividade.id}">
                    ${atividade.titulo}
                </option>`
        ).join("");

}


carregarSelectsResultados();


/* =====================================================
   SALVAR RESULTADO
   ===================================================== */

const formResultado =
    document.getElementById(
        "formResultado"
    );


if (formResultado) {

    formResultado.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const resultados =
                obterDados(
                    "incluiedu_resultados"
                );


            resultados.push({

                id: Date.now(),

                alunoId:
                    Number(
                        document.getElementById(
                            "resultadoAluno"
                        ).value
                    ),

                atividadeId:
                    Number(
                        document.getElementById(
                            "resultadoAtividade"
                        ).value
                    ),

                nivel:
                    document.getElementById(
                        "resultadoNivel"
                    ).value,

                observacao:
                    document.getElementById(
                        "resultadoObservacao"
                    ).value,

                data:
                    new Date().toLocaleDateString(
                        "pt-BR"
                    )

            });


            salvarDados(
                "incluiedu_resultados",
                resultados
            );


            alert(
                "Resultado registrado!"
            );


            formResultado.reset();

            carregarResultados();

        }
    );

}


/* =====================================================
   LISTAR RESULTADOS
   ===================================================== */

function carregarResultados() {

    const lista =
        document.getElementById(
            "listaResultados"
        );


    if (!lista) return;


    const resultados =
        obterDados(
            "incluiedu_resultados"
        );


    const alunos =
        obterDados(
            "incluiedu_alunos"
        );


    const atividades =
        obterDados(
            "incluiedu_atividades"
        );


    if (resultados.length === 0) {

        lista.innerHTML = `
            <p class="empty">
                Nenhum resultado registrado.
            </p>
        `;

        return;

    }


    lista.innerHTML =
        resultados.map(
            resultado => {

                const aluno =
                    alunos.find(
                        item =>
                            item.id ===
                            resultado.alunoId
                    );


                const atividade =
                    atividades.find(
                        item =>
                            item.id ===
                            resultado.atividadeId
                    );


                return `

                    <div class="item-lista">

                        <div>

                            <strong>
                                ${aluno?.nome || "Aluno"}
                            </strong>

                            <p>
                                ${atividade?.titulo || "Atividade"}
                            </p>

                            <small>
                                ${resultado.observacao || ""}
                            </small>

                        </div>

                        <strong>
                            ${resultado.nivel}
                        </strong>

                    </div>

                `;

            }
        ).join("");

}


carregarResultados();


/* =====================================================
   DASHBOARD
   ===================================================== */

function atualizarDashboard() {

    const totalAlunos =
        document.getElementById(
            "totalAlunos"
        );

    const totalAtividades =
        document.getElementById(
            "totalAtividades"
        );

    const totalAdaptacoes =
        document.getElementById(
            "totalAdaptacoes"
        );

    const totalResultados =
        document.getElementById(
            "totalResultados"
        );


    if (totalAlunos) {

        totalAlunos.textContent =
            obterDados(
                "incluiedu_alunos"
            ).length;

    }


    if (totalAtividades) {

        totalAtividades.textContent =
            obterDados(
                "incluiedu_atividades"
            ).length;

    }


    if (totalAdaptacoes) {

        totalAdaptacoes.textContent =
            obterDados(
                "incluiedu_adaptacoes"
            ).length;

    }


    if (totalResultados) {

        totalResultados.textContent =
            obterDados(
                "incluiedu_resultados"
            ).length;

    }

}


atualizarDashboard();


/* =====================================================
   MENSAGEM
   ===================================================== */

function mostrarMensagem(
    elementoId,
    mensagem
) {

    const elemento =
        document.getElementById(
            elementoId
        );


    if (elemento) {

        elemento.textContent =
            mensagem;

    }

}