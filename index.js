
/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos

const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

/*
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
*/

app.get('/', function(req, res)
{
    //Petición GET con URL = "/", lease, página principal
    console.log(req.query); //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('login', null); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});
let id = -1
app.post('/registro', async function(req, res){
    console.log("Soy un pedido POST", req.body);
    let existe_usu= await (MySQL.realizarQuery(`select usuario from usuarios WHERE usuario = "${req.body.usuario}"`))
    id = req.body.usuario
    console.log(existe_usu)
    if (existe_usu.length == 0) {
        console.log(await (MySQL.realizarQuery("select * from usuarios")))
        await MySQL.realizarQuery(`insert into usuarios (usuario,contraseña,administrador) values ("${req.body.usuario}","${req.body.contraseña}", 0)`)
        await MySQL.realizarQuery(`insert into puntajes (puntaje_maximo,usuario_log) values (0,"${req.body.usuario}" )`)
        res.render('home', {usuario:req.body.usuario}); 
    }else{
        console.log("Me fui")
        res.render('Registrar',{mensaje:"El usuario ya existe"});
    }
    
    });
app.put('/login', async function(req, res){
    console.log("Soy un pedido PUT", req.body);  
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM usuarios WHERE usuario = "${req.body.usuario}" AND contraseña = "${req.body.contraseña}"`)
    id = req.body.usuario
    if (respuesta.length > 0) {
        if(req.body.usuario =="n"){
            res.send({validar:true, admin:true})            
        }
        else if (req.body.usuario!="n")
        res.send({validar: true, admin:false})    
    }
    else{
        res.send({validar:false})   
    }});
app.get('/Registrar', function(req, res){
    console.log(req.query); 
    res.render('Registrar', null);
   });
app.get('/admin', function(req, res){
    console.log(req.query); 
    res.render('admin', null);
   });
app.post('/login', function(req, res){
    //Petición POST con URL = "/login"
    console.log("Soy un pedido POST21", req.body); 
    res.render('home', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});

app.get('/admin1', function(req, res){
    console.log(req.query); 
    res.render('admin', null);
   });
app.put('/admin1', async function(req, res){
    console.log("entre")
    let palabrita = await MySQL.realizarQuery(`select * from palabras where palabra = "${req.body.palabra}"`)
    if (palabrita.length > 0){
        res.send({validar:false,palabrarda:false})
    }
    if (palabrita.length == 0){
        if (req.body.palabra.length == 6){
        await MySQL.realizarQuery(`insert into palabras (palabra) values ("${req.body.palabra}")`)
        console.log("entre si existe")
        //Fijarse si lo mete a la BD
        res.send({validar:true, palabrarda:true})
        }
        else {
            res.send({validar:true, palabrarda:false})
        
        }
}});

app.put('/admin2', async function(req, res){
    console.log("entrenashee")
    let palabrita= await MySQL.realizarQuery(`select * from palabras where palabra = "${req.body.palabras}"`)
    if (palabrita.length == 0){
        res.send({validar:false})
    }
    if (palabrita.length >0){
        await MySQL.realizarQuery(`DELETE FROM palabras WHERE palabra = ("${req.body.palabras}")`)
        console.log("entre si existe")
        res.send({validar:true})
        }
});
app.get('/admin2', function(req, res){
    res.render('home', null);
   });
app.get('/home', function(req, res){
    res.render('home', null);
   });

app.post('/irajuego', function(req, res){
    console.log("Soy un pedido Put 214", req.body); 
    res.render('home')
});

app.get('/traerPalabras', async function(req, res){
    let palabras = await MySQL.realizarQuery("SELECT palabra FROM palabras")
    console.log(palabras)
    res.send({palabras: palabras});
   });
app.get('/puntuacion',async function(req, res){
    let consulta = await MySQL.realizarQuery(`SELECT puntaje_maximo,usuario_log FROM puntajes order by puntaje_maximo desc`);
    console.log("nashee",consulta);
    res.render('puntuacion',{consulta:consulta});
   });

app.put('/traerpuntaje', async function(req, res){
   
    let puntaje = await MySQL.realizarQuery(`SELECT puntaje_maximo FROM puntajes where usuario_log = "${id}"`)
        console.log(puntaje,"good",id, req.body.puntos_actuales)
        let puntos_actuales2 = req.body.puntos_actuales + puntaje[0].puntaje_maximo
        console.log(puntos_actuales2)
        puntos_nuevos=await MySQL.realizarQuery(`UPDATE puntajes set puntaje_maximo = "${puntos_actuales2}" WHERE usuario_log = "${id}"`)
        console.log(puntaje)
        res.send();
});

app.put('/irapuntos', async function(req,res){
    let consulta1 = await MySQL.realizarQuery(`SELECT puntaje_maximo,usuario_log FROM puntajes `);
    console.log("nashee",consulta1);
    res.send({consulta1:consulta1});
    
});




 

    
      
