//Objeto por meio de classe Despesa

class Despesa {
    //Construção do Objeto
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
     //Verificação dos dados
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            } else {
                return true
            }
        }
    }
    
}
//Objeto por meio de classe BD 
class BD {
    //Construção do Objeto
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    //Identificação do ID por meio do localStorage
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return (parseInt(proximoId)+1)
    }
    //Gravação dos dados no localStorage
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    //Recuperar dados
    recuperarTodosRegistros() {

        let despesas = Array()

        let id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue  
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    //Filtro dados
    pesquisar(despesa) {

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltradas)

        if (despesa.ano != '') {
            console.log('filtro ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            console.log('filtro mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            console.log('filtro dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            console.log('filtro tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            console.log('filtro descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            console.log('filtro valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasFiltradas
    }
    //Remover item do localStorage
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BD()

//Função de cadastro da despesa
function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        $('#sucessoGravacao').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        
        //dialog sucesso
    } else {
        $('#erroGravacao').modal('show')
        //dialog erro
    }
    
}
//Função para a criação dos campos que estão no localStorage
function carregaListaDespesa(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = 'id_despesa_' + d.id
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    
    })
}
//Função para os filtros das despesas
function pesquisarDespesa() {

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    
    this.carregaListaDespesa(despesas, true)
}