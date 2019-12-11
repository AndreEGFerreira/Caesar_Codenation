const rp = require('request-promise');
const sha = require('sha1');
const fs = require('fs');
const FormData = require('form-data');

async function main() {
    const url = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=8c3da01dbc1a24732a6e037123ab924c6c98c88c';
    const url2 = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=8c3da01dbc1a24732a6e037123ab924c6c98c88c'
    let resp = JSON.parse(await rp.get(url));
    
    resp.decifrado = decifrar(resp.cifrado.toLowerCase(), resp.numero_casas);
    resp.resumo_criptografico = resumo(resp.decifrado);
    
    fs.writeFile('answer.json', JSON.stringify(resp), function foo() {
        // 
    });

    var body = new FormData();
    body.append('answer.json', fs.createReadStream('answer.json'));

    fs.readFile("./answer.json", "UTF-8", async(err, file) => {

        if (err) throw err;
      
        let body = new FormData();
      
        body.append("answer", file);
        console.log("File: " + file);

        const options = {
            method: 'POST',
            uri: url2,
    
            headers: {
                "Content-Type": "multipart/form-data",
            },
    
            json: true,
    
            formData: {
                answer: fs.createReadStream('answer.json')
            }
        }

        let respdenovo;
        
        try {
            respdenovo = await rp(options);
        } catch(err) {
            console.log(err)
        }
    
        console.log(respdenovo);
    })
}

function decifrar(texto_cifrado, n_casas) {
    let  texto_decifrado = '';

    for (let casa = 0; casa < texto_cifrado.length; casa++) {
        if (texto_cifrado.charCodeAt(casa) > 96 && texto_cifrado.charCodeAt(casa) < 124) {
            texto_decifrado += String.fromCharCode((texto_cifrado.charCodeAt(casa) + n_casas + 97) % 26 + 97 );
        } else {
            texto_decifrado += texto_cifrado[casa];
        }
    }
    
    return texto_decifrado;
}

function resumo(texto_decifrado) {
    return sha(texto_decifrado);
}

main();