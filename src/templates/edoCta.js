
function generateRowsDebt(debt_arr) {
    return debt_arr.map(debt => `
         <tr>
            <td>${debt.periodo}</td>
            <td>${debt.impuesto_predial}</td>
            <td>${debt.recargo}</td>
            <td>${debt.multas}</td>
            <td>${debt.gastos_ejecucion}</td>
            <td>${debt.alum_publico}</td>
            <td>${debt.pronto_pago}</td>
            <td>${debt.contribuyente_cumplido}</td>
            <td>${debt.grupos_vulnerables}</td>
            <td>${debt.sub_total}</td>
        </tr>
    `).join('');
}

function addTotales(debt_arr) {

    const impuesto_predial = debt_arr.reduce((acc, debt) => acc + Number(debt.impuesto_predial), 0);
    const recargo = debt_arr.reduce((acc, debt) => acc + Number(debt.recargo), 0);
    const multas = debt_arr.reduce((acc, debt) => acc + Number(debt.multas), 0);
    const gastos_ejecucion = debt_arr.reduce((acc, debt) => acc + Number(debt.gastos_ejecucion), 0);
    const alum_publico = debt_arr.reduce((acc, debt) => acc + Number(debt.alum_publico), 0);
    const pronto_pago = debt_arr.reduce((acc, debt) => acc + Number(debt.pronto_pago), 0);
    const contribuyente_cumplido = debt_arr.reduce((acc, debt) => acc + Number(debt.contribuyente_cumplido), 0);
    const grupos_vulnerables = debt_arr.reduce((acc, debt) => acc + Number(debt.grupos_vulnerables), 0);
    const subtotal = debt_arr.reduce((acc, debt) => acc + Number(debt.sub_total), 0);
    return {
        row: `
            <td></td>
            <td> ${impuesto_predial} </td>
            <td> ${recargo} </td>
            <td> ${multas} </td>
            <td> ${gastos_ejecucion} </td>
            <td> ${alum_publico} </td>
            <td> ${pronto_pago} </td>
            <td> ${contribuyente_cumplido} </td>
            <td> ${grupos_vulnerables} </td>
            <td> ${subtotal} </td>
        `,
        total: subtotal
    }  
}


export function edoCtaCuautitlanIzcalliPredio(logo, account, owner, debt, address, clave_catastral, value_cat, tipo_predio, tipo_uso_suelo) {

    const debt_rows = generateRowsDebt(debt);
    const totales = addTotales(debt);
    const fecha = debt[0].fecha_corte;

    return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>PDF Example</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                p {
                    margin: 0;
                    padding: 0;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                }
                .group-img {
                    width: 21%
                }
                .group-titulo {
                    width: 58%;
                }
                .group-fecha {
                    width: 21%;
                }
                .header img {
                    width: 45%;
                }
                .header .titulo {
                    font-size: 14px;
                    text-align: center;
                    font-weight: bold;
                }
                .header .fecha {
                    font-size: 10px;
                }
                .datos-propietario {
                    font-size: 12px;
                    text-align: center;
                }
                .datos-basic {
                    font-size: 12px;
                    margin-bottom: 20px;
                }
                .datos-basic span {
                    font-weight: bold;
                }
                .custom-hr {
                    width: 100%; 
                    height: 2px; 
                    background-color: black;
                    border: none; 
                }
                .ubicacion-datos-predio {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                }
                .datos-secondary {
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                }
                .datos-secondary-valores {
                    text-align: end;
                }
                .datos-secondary-valores span,
                .datos-secondary-info span
                {
                    font-weight: bold;
                }
                .concepto-impuesto-predial {
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                }
                .table-pago {
                    width: 100%;
                    margin-top: 10px;
                    border-collapse: collapse;
                    font-size: 11px;
                    text-align: center;
                    margin: 0;
                    padding: 0;
                    table-layout: fixed;
                    margin-top: 10px
                }
                .table-titulo {
                    background-color: #E7E9EB;
                    border: none;
                }
                .table-titulo-bold {
                    background-color: #c0c4c7;
                }
                .table-pago th,
                .table-pago td {
                    font-size: 12px;
                }
                .table-pago .fila-borde-superior td {
                    border-top: 1px solid black;
                }
                .linea-captura {
                    margin-top: 20px;
                    text-align: center;
                }
                .linea-captura h1 {
                    font-size: 12px;
                    margin: 0;
                    padding: 0;
                }
                .codigo-barras {
                    height: 30px;
                    margin-top: 10px;
                    width: 50%;
                }
                .logos-bancos {
                    margin-top: 15px;
                    width: 90%;
                }
                </style>
            </head>
            <body>

                <div class="header">
                    <div class="group-img">
                        <img src=${logo} alt="Logo"/>
                    </div> 

                    <div class="group-titulo">
                        <h1 class="titulo">H. AYUNTAMIENTO DE CUAUTITLÁN IZCALLI</h1>
                        <h1 class="titulo">TESORERIA MUNICIPAL</h1>
                        <h1 class="titulo">ESTADO DE CUENTA DEL IMPUESTO PREDIAL</h1>
                    </div>
                    <div class="group-fecha">
                        <h1 class="fecha"> FECHA DE CORTE ${fecha} </h1>
                    </div>
                </div>
                <h1 class="datos-propietario">DATOS DEL PROPIETARIO</h1>
                <div class="datos-basic">
                    <p>NOMBRE: <span> ${owner} </span> </p>
                    <p>DOMICILIO: CALLE LONDRES MZ 9 LT 15
                </div>
                <hr class="custom-hr">
                <div class="ubicacion-datos-predio">
                    <p>UBICACION: <span> ${address.calle} ${address.numero_exterior} ${address.numero_interior} ${address.colonia} </span> </p>
                    <p>DATOS DEL PREDIO </p>
                </div>
                <div class="datos-secondary">
                    <div class="datos-secondary-valores">
                        <p>VALOR FISCAL: <span> $${value_cat.valor_catastral} </span> </p>
                        <p>TERRENO: <span> $${value_cat.valor_terreno} </span> </p>
                        <p>CONSTRUCCIÓN: <span> $${value_cat.valor_construccion} </span> </p>
                    </div>
                     <div class="datos-secondary-info">
                        <p>NÚMERO DE CUENTA: <span> ${account} </span> </p>
                        <p>CLAVE CATASTRAL: <span> ${clave_catastral} </span> </p>
                        <p>PREDIO: <span> ${tipo_predio} </span> </p>
                        <p>USO DE SUELO: <span> ${tipo_uso_suelo} </span> </p>
                    </div>
                </div>
                <hr class="custom-hr">
                <div class="concepto-impuesto-predial">
                    <p>CONCEPTO</p>
                    <p>IMPUESTO PREDIAL</p>
                </div>
                <table class="table-pago">
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>DESCUENTOS</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr class="table-titulo">
                        <th>PERIODO</th>
                        <th>IMPUESTO PREDIAL</th>
                        <th>RECARGO</th>
                        <th>MULTAS</th>
                        <th>GTOS. EJECUCIÓN</th>
                        <th>ALUM. PÚBLICO</th>
                        <th class="table-titulo-bold">PRONTO PAGO</th>
                        <th class="table-titulo-bold">CONTRIBUYENTE CUMPLIDO</th>
                        <th class="table-titulo-bold">GRUPOS VULNERABLES</th>
                        <th>SUBTOTAL</th>
                    </tr>
                    ${debt_rows}
                    <tr class="fila-borde-superior">
                       ${totales.row}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>OTROS DESCUENTOS</td>
                        <td>$0.00</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>TOTAL A PAGAR</td>
                        <td>$${totales.total}</td>
                    </tr>
                </table>
                <div class="linea-captura">
                    <h1>Linea de captura</h1>
                    <img class="codigo-barras" src="https://i0.wp.com/www.elretodeemprender.com/wp-content/uploads/2013/12/imagen-vectorial.jpg?fit=1600%2C599&ssl=1" alt="linea-captura" />
                    <h1>16705941849293</h1>
                    <img class="logos-bancos" src="https://firebasestorage.googleapis.com/v0/b/waterloo-6e309.appspot.com/o/bancos.jpg?alt=media&token=c29ae8db-e3ad-4bb3-b89a-329e36fd5936" alt="logos-bancos" />
                    <h1>Vigencia al último día del mes de agosto del 2024</h1>
                </div>
            </body>
            </html>
        `
}
