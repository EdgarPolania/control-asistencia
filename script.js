
let admin = {user: "Admin",pass: "Fran2026"};

let empleados = ["CERQUERA BRAND ABEL","MEDINA PEREZ DENNY JOSE","CERVANTES ULISES EDUARDO",
    "MELENDEZ GARCIA ADRIAN JOSE","POLO MERCADO CARLOS ANDRES","RAUL LOPEZ ORTIZ",
    "FRAN ALVIN CASALLAS GUAQUETA","POLANIA HERNANDEZ ANGELICA MARIA","GLADYS PEREZ CORTES",
"LINA MARIA PEREZ RODRIGUEZ"];

let registros = [];
let actual = null;

let sesionActiva = localStorage.getItem("sesion");

window.onload = () => {
    if(!localStorage.getItem("empleados")){guardar("empleados", empleados);}
cargarEmpleados();

;registros = cargar("registros") || [];
    if(sesionActiva === "true"){document.getElementById("login").classList.add("hidden");
        document.getElementById("panel").classList.remove("hidden");}
        else{document.getElementById("panel").classList.add("hidden");
        document.getElementById("reportes").classList.add("hidden");}};

function login(){let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;
    if(u === admin.user && p === admin.pass){document.getElementById("login").classList.add("hidden");
       document.getElementById("panel").classList.remove("hidden");
        localStorage.setItem("sesion", "true");}
        else{alert("Usuario o contraseña incorrectos");}}

function logout(){document.getElementById("panel").classList.add("hidden");
    document.getElementById("reportes").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
    localStorage.removeItem("sesion");}

function agregarEmpleado(){    let nombre = document.getElementById("nuevoEmpleado").value.trim();
    if(!nombre) return;empleados.push(nombre);guardar("empleados", empleados);
    cargarEmpleados();document.getElementById("nuevoEmpleado").value = "";}

function cargarEmpleados(){empleados = cargar("empleados") || [];
    let select = document.getElementById("empleado");
    let filtro = document.getElementById("filtroEmpleado");
    select.innerHTML = "";filtro.innerHTML = "<option value=''>Todos</option>";
    empleados.forEach(e => {select.innerHTML += `<option>${e}</option>`;
        filtro.innerHTML += `<option>${e}</option>`;});}

function entrada(){let nombre = document.getElementById("empleado").value;
    let hoy = new Date().toLocaleDateString();
    let existe = registros.find(r =>r.empleado === nombre &&r.fecha === hoy);

    if(existe){alert("Ya registrado hoy");

        return;}

    actual = {empleado: nombre,fecha: hoy,
        entrada: new Date().toLocaleTimeString(),
        salida: null};

    registros.push(actual);

    guardar("registros", registros);}

function salida(){if(!actual || actual.salida){alert("Error");

        return;}

    actual.salida = new Date().toLocaleTimeString();

    guardar("registros", registros);}

function calcularHoras(e, s){
    if(!e || !s) return 0;
    let inicio = new Date("1970-01-01 " + e);
    let fin = new Date("1970-01-01 " + s);
    if(fin < inicio){fin.setDate(fin.getDate() + 1);}
    return (fin - inicio) / 3600000;}

function verReportes(){document.getElementById("panel").classList.add("hidden");
    document.getElementById("reportes").classList.remove("hidden");

    let filtro = document.getElementById("filtroEmpleado").value;
    let tabla = document.getElementById("tabla");
    let totalHorasEl = document.getElementById("totalHoras");
    tabla.innerHTML = "";
    let total = 0;

    registros.forEach((r, i) => {
        if(filtro && r.empleado !== filtro) return;
        let horas = calcularHoras(r.entrada, r.salida);
        
        total += horas;
        tabla.innerHTML += `

        <tr>

            <td>${r.empleado}</td>

            <td>${r.fecha}</td>

            <td>${r.entrada || "-"}</td>

            <td>${r.salida || "-"}</td>

            <td>${horas.toFixed(2)} h</td>

            <td class="acciones">

                <button onclick="eliminarEntrada(${i})">
                    Eliminar Entrada
                </button>

                <button onclick="eliminarSalida(${i})">
                    Eliminar Salida
                </button>

            </td>

        </tr>
        `;});

    totalHorasEl.innerText =
        "Total semana: " +
        total.toFixed(2) +
        " horas";}

function exportarExcel(){
    let filtro = document.getElementById("filtroEmpleado").value;
    let contenido ="Empleado,Fecha,Entrada,Salida,Horas\n";

    registros.forEach(r => {
                if(filtro && r.empleado !== filtro) return;
        let horas = calcularHoras(r.entrada, r.salida);

        contenido +=
            r.empleado + "," +
            r.fecha + "," +
            "'" + (r.entrada || "-") + "," +
            "'" + (r.salida || "-") + "," +
            horas.toFixed(2) + " horas\n";});

    let blob = new Blob([contenido],{ type: "text/csv;charset=utf-8;" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    if(filtro){link.download ="reporte_" + filtro + ".csv";
    }else{link.download ="reporte_general.csv";}

    link.click();}

function eliminarEntrada(i){

    if(confirm("¿Seguro que desea eliminar la hora de entrada?")){
        registros[i].entrada = null;

        actual = registros[i];

        if(!registros[i].entrada && !registros[i].salida){registros.splice(i,1);}

        guardar("registros", registros);

        verReportes();}}

function eliminarSalida(i){

    if(confirm("¿Seguro que desea eliminar la hora de salida?")){

        registros[i].salida = null;

        actual = registros[i];

        if(!registros[i].entrada && !registros[i].salida){

            registros.splice(i,1);}

        guardar("registros", registros);

        verReportes();}}

function volver(){

    document.getElementById("reportes").classList.add("hidden");

    document.getElementById("panel").classList.remove("hidden");}

function guardar(k, d){localStorage.setItem(k, JSON.stringify(d));}

function cargar(k){ return JSON.parse(localStorage.getItem(k));}